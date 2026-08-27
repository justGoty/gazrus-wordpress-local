import { NextResponse } from "next/server";
import { z } from "zod";
import {
  escapeLeadHtml,
  isDuplicateLead,
  markLeadDelivered,
  readLeadJson,
  sendLeadNotification,
  validateLeadRequest,
} from "@/lib/leads/server";

export const runtime = "nodejs";

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

function validPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

export async function POST(request: Request) {
  const requestError = validateLeadRequest(request, "callback");
  if (requestError) return requestError;

  let rawBody: unknown;
  try {
    rawBody = await readLeadJson(request);
  } catch {
    return NextResponse.json({ message: "Некорректный запрос" }, { status: 400 });
  }

  let payload: z.infer<typeof CallbackRequestSchema>;
  try {
    payload = CallbackRequestSchema.parse(rawBody);
  } catch {
    return NextResponse.json({ message: "Проверьте телефон и согласие на обработку данных" }, { status: 400 });
  }

  if (!validPhone(payload.phone)) {
    return NextResponse.json({ message: "Введите телефон с кодом города или оператора" }, { status: 400 });
  }

  if (isDuplicateLead(payload.requestId)) return NextResponse.json({ ok: true });

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

  const delivery = await sendLeadNotification({
    subject: "Запрос обратного звонка — Газоанализатор.рус",
    text: lines.join("\n"),
    html: `
        <h2>Новая заявка на обратный звонок</h2>
        <p><strong>Имя:</strong> ${escapeLeadHtml(payload.name || "не указано")}</p>
        <p><strong>Телефон:</strong> ${escapeLeadHtml(payload.phone)}</p>
        <p><strong>Комментарий:</strong> ${escapeLeadHtml(payload.comment || "не указан")}</p>
        <p><strong>Контекст:</strong> ${escapeLeadHtml(payload.context || "общий запрос")}</p>
        <p><strong>Источник:</strong> ${escapeLeadHtml(payload.source)}</p>
        <p><strong>Страница:</strong> <a href="${escapeLeadHtml(payload.pageUrl)}">${escapeLeadHtml(payload.pageUrl)}</a></p>
      `,
  });

  if (delivery === "unavailable") {
    return NextResponse.json({ message: "Отправка временно недоступна. Позвоните нам по указанному номеру." }, { status: 503 });
  }
  if (delivery === "failed") {
    return NextResponse.json({ message: "Не удалось отправить заявку. Позвоните нам или повторите позже." }, { status: 502 });
  }

  markLeadDelivered(payload.requestId);

  return NextResponse.json({ ok: true });
}
