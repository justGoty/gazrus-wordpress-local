import "server-only";

import nodemailer from "nodemailer";
import { NextResponse } from "next/server";
import { seoSite } from "@/lib/seo/content";

const MAX_BODY_SIZE = 12_000;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000;
const RATE_LIMIT_MAX = 5;

type RateEntry = { count: number; expiresAt: number };
type LeadGlobal = typeof globalThis & {
  leadRateLimits?: Map<string, RateEntry>;
  leadRequestIds?: Map<string, number>;
};

type LeadMessage = {
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
};

const leadGlobal = globalThis as LeadGlobal;
const rateLimitStore = leadGlobal.leadRateLimits ?? new Map<string, RateEntry>();
const requestIdStore = leadGlobal.leadRequestIds ?? new Map<string, number>();
leadGlobal.leadRateLimits = rateLimitStore;
leadGlobal.leadRequestIds = requestIdStore;

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

function rateLimitExceeded(key: string): boolean {
  const now = Date.now();
  const current = rateLimitStore.get(key);
  if (!current || current.expiresAt <= now) {
    rateLimitStore.set(key, { count: 1, expiresAt: now + RATE_LIMIT_WINDOW });
    return false;
  }
  current.count += 1;
  return current.count > RATE_LIMIT_MAX;
}

export function validateLeadRequest(request: Request, bucket: string): NextResponse | null {
  if (!isAllowedOrigin(request.headers.get("origin"), request)) {
    return NextResponse.json({ message: "Запрос отклонен" }, { status: 403 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_SIZE) {
    return NextResponse.json({ message: "Слишком большой запрос" }, { status: 413 });
  }

  if (rateLimitExceeded(`${bucket}:${clientIp(request)}`)) {
    return NextResponse.json({ message: "Слишком много попыток. Позвоните нам или повторите позже." }, { status: 429 });
  }

  return null;
}

export async function readLeadJson(request: Request): Promise<unknown> {
  const rawBody = await request.text();
  if (rawBody.length > MAX_BODY_SIZE) throw new Error("body-too-large");
  return JSON.parse(rawBody);
}

export function isDuplicateLead(requestId: string): boolean {
  const existingRequest = requestIdStore.get(requestId);
  return Boolean(existingRequest && existingRequest > Date.now());
}

export function markLeadDelivered(requestId: string): void {
  requestIdStore.set(requestId, Date.now() + 30 * 60 * 1000);
  if (requestIdStore.size <= 500) return;

  const now = Date.now();
  for (const [id, expiresAt] of requestIdStore) {
    if (expiresAt <= now) requestIdStore.delete(id);
  }
}

export function escapeLeadHtml(value: string): string {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] ?? character);
}

export async function sendLeadNotification(message: LeadMessage): Promise<"sent" | "unavailable" | "failed"> {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = Number(process.env.SMTP_PORT ?? 465);
  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;
  const smtpFrom = process.env.SMTP_FROM || smtpUser;
  const recipient = process.env.LEAD_RECIPIENT_EMAIL || seoSite.contactEmail;

  if (!smtpHost || !smtpUser || !smtpPassword || !smtpFrom || !Number.isInteger(smtpPort)) {
    return "unavailable";
  }

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
      replyTo: message.replyTo,
      subject: message.subject,
      text: message.text,
      html: message.html,
    });
    return "sent";
  } catch {
    return "failed";
  }
}
