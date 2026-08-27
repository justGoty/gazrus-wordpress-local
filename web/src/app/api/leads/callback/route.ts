import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { z } from "zod";
import { seoSite } from "@/lib/seo/content";

export const runtime = "nodejs";

const MAX_BODY_SIZE = 12_000;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

const CallbackRequestSchema = z.object({
  name: z.string().trim().max(80).default(""),
  phone: z.string().trim().min(5).max(32),
  comment: z.string().trim().max(500).default(""),
  website: z.string().trim().max(0).default(""),
  consent: z.literal(true),
  context: z.string().trim().max(400).default(""),
  source: z.string().trim().max(120).default("Запрос КП"),
  pageUrl: z.string().url().max(600).refine((value) => {
    const protocol = new URL(value).protocol;
    return protocol === "http:" || protocol === "https:";
  }),
  requestId: z.string().uuid(),
});

type RateEntry = { count: number; expiresAt: number };
type LeadGlobal = typeof globalThis & {
  callbackRateLimit?: Map<string, RateEntry>;
  callbackRequestIds?: Map<string, number>;
};

const leadGlobal = globalThis as LeadGlobal;
const rateLimitStore = leadGlobal.callbackRateLimit ?? new Map<string, RateEntry>();
const requestIdStore = leadGlobal.callbackRequestIds ?? new Map<string, number>();
leadGlobal.callbackRateLimit = rateLimitStore;
leadGlobal.callbackRequestIds = requestIdStore;

function clientIp(request: Request): string {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

function isAllowedOrigin(origin: string | null, request: Request): boolean {
  if (!origin) return false;
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const requestHost = forwardedHost || request.headers.get("host");
  try {
    if (requestHost && new URL(origin).host === requestHost) return true;
  } catch {
    return false;
  }
  const configured = (process.env.LEAD_ALLOWED_ORIGINS ?? seoSite.origin)
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (configured.includes(origin)) return true;
  if (process.env.NODE_ENV !== "production") {
    try {
      const hostname = new URL(origin).hostname;
      return hostname === "localhost" || hostname === "127.0.0.1";
    } catch {
      return false;
    }
  }
  return false;
}

function rateLimitExceeded(ip: string): boolean {
  const now = Date.now();
  const current = rateLimitStore.get(ip);
  if (!current || current.expiresAt <= now) {
    rateLimitStore.set(ip, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW });
    return false;
  }
  current.count += 1;
  return current.count > RATE_LIMIT_MAX;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}

function validPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

export async function POST(request: Request) {
  if (!isAllowedOrigin(request.headers.get("origin"), request)) {
    return NextResponse.json({ message: "Запрос отклонен" }, { status: 403 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_SIZE) {
    return NextResponse.json({ message: "Слишком большой запрос" }, { status: 413 });
  }

  const ip = clientIp(request);
  if (rateLimitExceeded(ip)) {
    return NextResponse.json({ message: "Слишком много попыток. Позвоните нам или повторите позже." }, { status: 429 });
  }

  let rawBody = "";
  try {
    rawBody = await request.text();
    if (rawBody.length > MAX_BODY_SIZE) throw new Error("body-too-large");
  } catch {
    return NextResponse.json({ message: "Некорректный запрос" }, { status: 400 });
  }

  let payload: z.infer<typeof CallbackRequestSchema>;
  try {
    payload = CallbackRequestSchema.parse(JSON.parse(rawBody));
  } catch {
    return NextResponse.json({ message: "Проверьте телефон и согласие на обработку данных" }, { status: 400 });
  }

  if (!validPhone(payload.phone)) {
    return NextResponse.json({ message: "Введите телефон с кодом города или оператора" }, { status: 400 });
  }

  const existingRequest = requestIdStore.get(payload.requestId);
  if (existingRequest && existingRequest > Date.now()) {
    return NextResponse.json({ ok: true });
  }

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT ?? 465);
  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;
  const smtpFrom = process.env.SMTP_FROM || smtpUser;
  const recipient = process.env.LEAD_RECIPIENT_EMAIL || seoSite.contactEmail;

  if (!smtpHost || !smtpUser || !smtpPassword || !smtpFrom || !Number.isInteger(smtpPort)) {
    return NextResponse.json({ message: "Отправка временно недоступна. Позвоните нам по указанному номеру." }, { status: 503 });
  }

  const lines = [
    "Новая заявка на обратный звонок с сайта Газоанализатор.рус",
    "",
    `Имя: ${payload.name || "не указано"}`,
    `Телефон: ${payload.phone}`,
    `Комментарий: ${payload.comment || "не указан"}`,
    `Контекст: ${payload.context || "общий запрос"}`,
    `Источник: ${payload.source}`,
    `Страница: ${payload.pageUrl}`,
  ];

  const transport = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: process.env.SMTP_SECURE !== "false",
    auth: { user: smtpUser, pass: smtpPassword },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });

  try {
    await transport.sendMail({
      from: smtpFrom,
      to: recipient,
      subject: "Запрос обратного звонка — Газоанализатор.рус",
      text: lines.join("\n"),
      html: `
        <h2>Новая заявка на обратный звонок</h2>
        <p><strong>Имя:</strong> ${escapeHtml(payload.name || "не указано")}</p>
        <p><strong>Телефон:</strong> ${escapeHtml(payload.phone)}</p>
        <p><strong>Комментарий:</strong> ${escapeHtml(payload.comment || "не указан")}</p>
        <p><strong>Контекст:</strong> ${escapeHtml(payload.context || "общий запрос")}</p>
        <p><strong>Источник:</strong> ${escapeHtml(payload.source)}</p>
        <p><strong>Страница:</strong> <a href="${escapeHtml(payload.pageUrl)}">${escapeHtml(payload.pageUrl)}</a></p>
      `,
    });
  } catch {
    return NextResponse.json({ message: "Не удалось отправить заявку. Позвоните нам или повторите позже." }, { status: 502 });
  }

  requestIdStore.set(payload.requestId, Date.now() + 30 * 60 * 1000);
  if (requestIdStore.size > 500) {
    const now = Date.now();
    for (const [id, expiresAt] of requestIdStore) if (expiresAt <= now) requestIdStore.delete(id);
  }

  return NextResponse.json({ ok: true });
}
