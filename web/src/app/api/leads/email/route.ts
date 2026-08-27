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

const EmailRequestSchema = z.object({
  name: z.string().trim().max(80).default(""),
  email: z.string().trim().email().max(160),
  subject: z.string().trim().min(3).max(160).refine((value) => !/[\r\n]/.test(value)),
  message: z.string().trim().min(10).max(3000),
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

export async function POST(request: Request) {
  const requestError = validateLeadRequest(request, "email");
  if (requestError) return requestError;

  let rawBody: unknown;
  try {
    rawBody = await readLeadJson(request);
  } catch {
    return NextResponse.json({ message: "Некорректный запрос" }, { status: 400 });
  }

  let payload: z.infer<typeof EmailRequestSchema>;
  try {
    payload = EmailRequestSchema.parse(rawBody);
  } catch {
    return NextResponse.json({ message: "Проверьте e-mail, тему, сообщение и согласие" }, { status: 400 });
  }

  if (isDuplicateLead(payload.requestId)) return NextResponse.json({ ok: true });

  const lines = [
    "Новое обращение с сайта Газоанализатор.рус",
    "",
    `Имя: ${payload.name || "не указано"}`,
    `E-mail для ответа: ${payload.email}`,
    `Тема клиента: ${payload.subject}`,
    `Сообщение: ${payload.message}`,
    `Контекст: ${payload.context || "общий запрос"}`,
    `Источник: ${payload.source}`,
    `Страница: ${payload.pageUrl}`,
  ];

  const delivery = await sendLeadNotification({
    subject: `Обращение с сайта: ${payload.subject}`,
    replyTo: payload.email,
    text: lines.join("\n"),
    html: `
      <h2>Новое обращение с сайта</h2>
      <p><strong>Имя:</strong> ${escapeLeadHtml(payload.name || "не указано")}</p>
      <p><strong>E-mail для ответа:</strong> <a href="mailto:${escapeLeadHtml(payload.email)}">${escapeLeadHtml(payload.email)}</a></p>
      <p><strong>Тема клиента:</strong> ${escapeLeadHtml(payload.subject)}</p>
      <p><strong>Сообщение:</strong><br>${escapeLeadHtml(payload.message).replace(/\n/g, "<br>")}</p>
      <p><strong>Контекст:</strong> ${escapeLeadHtml(payload.context || "общий запрос")}</p>
      <p><strong>Источник:</strong> ${escapeLeadHtml(payload.source)}</p>
      <p><strong>Страница:</strong> <a href="${escapeLeadHtml(payload.pageUrl)}">${escapeLeadHtml(payload.pageUrl)}</a></p>
    `,
  });

  if (delivery === "unavailable") {
    return NextResponse.json({ message: "Отправка временно недоступна. Позвоните нам по указанному номеру." }, { status: 503 });
  }
  if (delivery === "failed") {
    return NextResponse.json({ message: "Не удалось отправить письмо. Позвоните нам или повторите позже." }, { status: 502 });
  }

  markLeadDelivered(payload.requestId);
  return NextResponse.json({ ok: true });
}
