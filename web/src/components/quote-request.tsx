"use client";

import { CheckCircle2, Mail, PhoneCall, Send, X } from "lucide-react";
import type { FormEvent, PropsWithChildren } from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { seller } from "@/data/seller";
import { trackGoal } from "@/lib/analytics";

type ContactMethod = "email" | "callback";
type QuoteRequest = {
  subject: string;
  details?: string;
  source?: string;
  contactMethod?: ContactMethod;
  initialMessage?: string;
};

type QuoteRequestButtonProps = PropsWithChildren<QuoteRequest> & {
  className?: string;
  title?: string;
  onOpen?: () => void;
};

const QuoteRequestContext = createContext<{ openQuoteRequest: (request: QuoteRequest) => void } | null>(null);

export function QuoteRequestProvider({ children }: PropsWithChildren) {
  const [request, setRequest] = useState<QuoteRequest | null>(null);
  const close = useCallback(() => setRequest(null), []);
  const contextValue = useMemo(() => ({ openQuoteRequest: setRequest }), []);

  return (
    <QuoteRequestContext.Provider value={contextValue}>
      {children}
      {request ? <QuoteRequestDialog request={request} onClose={close} /> : null}
    </QuoteRequestContext.Provider>
  );
}

function QuoteRequestDialog({ request, onClose }: { request: QuoteRequest; onClose: () => void }) {
  const [method, setMethod] = useState<ContactMethod>(request.contactMethod ?? "email");
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pendingRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const submissions = useRef<Partial<Record<ContactMethod, { fingerprint: string; id: string }>>>({});

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      abortRef.current?.abort();
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (previousFocus?.checkVisibility() && !previousFocus.closest("[inert]")) previousFocus.focus();
      else document.querySelector<HTMLElement>(".menu-toggle")?.focus();
    };
  }, []);

  function close() {
    if (!pendingRef.current) onClose();
  }

  function selectMethod(nextMethod: ContactMethod) {
    if (pendingRef.current) return;
    setMethod(nextMethod);
    setError("");
  }

  async function submit(event: FormEvent<HTMLFormElement>, kind: ContactMethod) {
    event.preventDefault();
    if (pendingRef.current || success) return;
    pendingRef.current = true;
    setPending(true);
    setError("");
    const form = new FormData(event.currentTarget);
    const controller = new AbortController();
    abortRef.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 45_000);

    try {
      const fields = kind === "email"
        ? { email: form.get("email"), subject: form.get("subject"), message: form.get("message") }
        : { phone: form.get("phone"), comment: form.get("comment") };
      const payload = {
        ...fields,
        name: form.get("name"),
        website: form.get("website"),
        consent: form.get("consent") === "on",
        context: request.details ?? "",
        source: request.source ?? "Запрос КП",
        pageUrl: window.location.href,
      };
      // Only an unchanged retry shares its id; edited contact data is a new request.
      const fingerprint = JSON.stringify(payload);
      const previous = submissions.current[kind];
      const submission = previous?.fingerprint === fingerprint ? previous : { fingerprint, id: window.crypto.randomUUID() };
      submissions.current[kind] = submission;
      const response = await fetch(`/api/leads/${kind}`, {
        method: "POST",
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, requestId: submission.id }),
      });
      const result = (await response.json()) as { ok?: boolean; message?: string } | null;
      if (!response.ok || result?.ok !== true) throw new Error(result?.message || "Не удалось отправить обращение. Попробуйте еще раз или позвоните нам.");
      setSuccess(true);
      trackGoal(kind === "email" ? "lead_email_success" : "lead_callback_success");
      dialogRef.current?.scrollTo({ top: 0 });
    } catch (submitError) {
      setError(controller.signal.aborted
        ? "Не удалось получить подтверждение отправки. Введенные данные сохранены: повторите попытку или позвоните нам."
        : submitError instanceof Error ? submitError.message : "Нет связи с сервером. Повторите попытку или позвоните нам.");
    } finally {
      window.clearTimeout(timeout);
      pendingRef.current = false;
      setPending(false);
    }
  }

  useEffect(() => {
    if (success) dialogRef.current?.querySelector<HTMLElement>(".lead-success")?.focus();
  }, [success]);

  return (
    <dialog
      className="quote-modal"
      ref={dialogRef}
      aria-labelledby="quote-dialog-title"
      onCancel={(event) => { event.preventDefault(); close(); }}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>("a[href], button, input, textarea"))
          .filter((element) => element.tabIndex >= 0 && !element.hasAttribute("disabled") && element.checkVisibility());
        const first = controls[0];
        const last = controls.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
      }}
    >
      <button className="quote-modal-close" type="button" onClick={close} disabled={pending} aria-label="Закрыть окно">
        <X aria-hidden="true" size={21} />
      </button>

      {success ? (
        <div className="lead-success" tabIndex={-1}>
          <CheckCircle2 aria-hidden="true" size={42} />
          <p className="section-kicker">Обращение принято к отправке</p>
          <h2 id="quote-dialog-title">Спасибо за обращение</h2>
          <p>{method === "email" ? "Ответим на указанный e-mail в течение суток." : "Свяжемся по указанному телефону в течение суток."} Если вопрос срочный, позвоните нам.</p>
          <button className="button button-primary" type="button" onClick={close}>Закрыть</button>
        </div>
      ) : (
        <>
          <p className="section-kicker">Связаться с нами</p>
          <h2 id="quote-dialog-title">{method === "email" ? "Узнать цену и срок поставки" : "Заказать обратный звонок"}</h2>
          <p className="quote-modal-lead">{seller.responseNotice}. {method === "email" ? "Укажите почту для ответа и ваш вопрос." : "Оставьте номер, чтобы обсудить вашу задачу."}</p>
          <div className="quote-methods" role="group" aria-label="Способ связи">
            <button type="button" aria-pressed={method === "email"} disabled={pending} onClick={() => selectMethod("email")}>
              <Mail aria-hidden="true" size={18} /> Письмо
            </button>
            <button type="button" aria-pressed={method === "callback"} disabled={pending} onClick={() => selectMethod("callback")}>
              <PhoneCall aria-hidden="true" size={18} /> Обратный звонок
            </button>
          </div>

          {/* Both forms stay mounted so switching the contact method preserves the draft. */}
          <form className="lead-form ym-hide-content" hidden={method !== "email"} onSubmit={(event) => submit(event, "email")} aria-busy={pending}>
            <div className="lead-contact-fields">
              <label>
                <span>E-mail для ответа *</span>
                <input className="ym-disable-keys" name="email" type="email" inputMode="email" autoComplete="email" maxLength={160} required placeholder="name@company.ru" />
              </label>
              <label>
                <span>Имя</span>
                <input className="ym-disable-keys" name="name" type="text" autoComplete="name" maxLength={80} placeholder="Как к вам обращаться" />
              </label>
            </div>
            <label>
              <span>Тема *</span>
              <input className="ym-disable-keys" name="subject" type="text" maxLength={160} minLength={3} required defaultValue={request.subject.slice(0, 160)} />
            </label>
            <label>
              <span>Ваш запрос *</span>
              <textarea className="ym-disable-keys" name="message" maxLength={3000} minLength={10} rows={3} required defaultValue={request.initialMessage} placeholder="Модель, количество или задача, для которой нужен прибор" />
            </label>
            <FormConsent />
            {error ? <p className="lead-error" role="alert">{error}</p> : null}
            <button className="button button-primary lead-submit" type="submit" disabled={pending}>
              <Send aria-hidden="true" size={18} />{pending ? "Отправляем..." : "Отправить запрос"}
            </button>
          </form>

          <form className="lead-form ym-hide-content" hidden={method !== "callback"} onSubmit={(event) => submit(event, "callback")} aria-busy={pending}>
            <div className="lead-contact-fields">
              <label>
                <span>Телефон *</span>
                <input className="ym-disable-keys" name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={32} required placeholder="+7 (___) ___-__-__" />
              </label>
              <label>
                <span>Имя</span>
                <input className="ym-disable-keys" name="name" type="text" autoComplete="name" maxLength={80} placeholder="Как к вам обращаться" />
              </label>
            </div>
            <label>
              <span>Комментарий</span>
              <textarea className="ym-disable-keys" name="comment" maxLength={500} rows={3} placeholder="Модель, ваша задача или удобное время звонка" />
            </label>
            <FormConsent />
            {error ? <p className="lead-error" role="alert">{error}</p> : null}
            <button className="button button-primary lead-submit" type="submit" disabled={pending}>
              <PhoneCall aria-hidden="true" size={18} />{pending ? "Отправляем..." : "Заказать звонок"}
            </button>
          </form>
        </>
      )}

      <div className="quote-direct-contacts">
        <a href="tel:+79255086258">+7 (925) 508-62-58</a>
        <a href="tel:+74957486258">+7 (495) 748-62-58</a>
      </div>
    </dialog>
  );
}

function FormConsent() {
  return (
    <>
      <label className="lead-honeypot" aria-hidden="true">
        <span>Сайт</span>
        <input className="ym-disable-keys" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="lead-consent">
        <input className="ym-disable-keys" name="consent" type="checkbox" required />
        <span>Согласен на обработку контактных данных {seller.legalName} для ответа на обращение</span>
      </label>
    </>
  );
}

export function QuoteRequestButton({ children, className, subject, details, source, title, contactMethod, initialMessage, onOpen }: QuoteRequestButtonProps) {
  const context = useContext(QuoteRequestContext);
  if (!context) throw new Error("QuoteRequestButton must be rendered inside QuoteRequestProvider");

  return (
    <button className={className} type="button" title={title} onClick={() => {
      context.openQuoteRequest({ subject, details, source, contactMethod, initialMessage });
      onOpen?.();
    }}>
      {children}
    </button>
  );
}
