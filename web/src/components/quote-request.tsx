"use client";

import { ArrowLeft, CheckCircle2, Mail, PhoneCall, Send, X } from "lucide-react";
import type { PropsWithChildren } from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

type QuoteRequest = {
  subject: string;
  details?: string;
  source?: string;
};

type QuoteRequestContextValue = {
  openQuoteRequest: (request: QuoteRequest) => void;
};

type QuoteRequestButtonProps = PropsWithChildren<QuoteRequest> & {
  className?: string;
  title?: string;
};

const QuoteRequestContext = createContext<QuoteRequestContextValue | null>(null);

function buildMailHref(request: QuoteRequest): string {
  const body = [
    "Здравствуйте! Хочу получить коммерческое предложение.",
    request.details ? `\n${request.details}` : "",
    "\nКонтактные данные:",
  ].join("\n");

  return `mailto:info@prscom.ru?subject=${encodeURIComponent(request.subject)}&body=${encodeURIComponent(body)}`;
}

export function QuoteRequestProvider({ children }: PropsWithChildren) {
  const [request, setRequest] = useState<QuoteRequest | null>(null);
  const [step, setStep] = useState<"choice" | "callback" | "success">("choice");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setRequest(null);
    setStep("choice");
    setPending(false);
    setError("");
  }, []);

  const openQuoteRequest = useCallback((nextRequest: QuoteRequest) => {
    setRequest(nextRequest);
    setStep("choice");
    setPending(false);
    setError("");
  }, []);

  useEffect(() => {
    if (!request) return;

    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      dialogRef.current?.querySelector<HTMLElement>("button, a, input, textarea")?.focus();
    }, 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), textarea:not([disabled])',
        ),
      ).filter((element) => element.offsetParent !== null);
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousFocusRef.current?.focus();
    };
  }, [close, request]);

  const contextValue = useMemo(() => ({ openQuoteRequest }), [openQuoteRequest]);
  const mailHref = request ? buildMailHref(request) : "mailto:info@prscom.ru";

  const submitCallback = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!request || pending) return;

    setPending(true);
    setError("");
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/leads/callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          phone: form.get("phone"),
          comment: form.get("comment"),
          website: form.get("website"),
          consent: form.get("consent") === "on",
          context: request.details ?? "",
          source: request.source ?? "Запрос КП",
          pageUrl: window.location.href,
          requestId: window.crypto.randomUUID(),
        }),
      });

      const result = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(result.message || "Не удалось отправить заявку");
      setStep("success");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Не удалось отправить заявку. Попробуйте еще раз.");
    } finally {
      setPending(false);
    }
  };

  return (
    <QuoteRequestContext.Provider value={contextValue}>
      {children}
      {request ? (
        <div className="quote-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && close()}>
          <div
            className="quote-modal"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quote-dialog-title"
          >
            <button className="quote-modal-close" type="button" onClick={close} aria-label="Закрыть окно">
              <X aria-hidden="true" size={21} />
            </button>

            {step === "choice" ? (
              <>
                <p className="section-kicker">Связаться с нами</p>
                <h2 id="quote-dialog-title">Как вам удобнее получить ответ?</h2>
                <p className="quote-modal-lead">Выберите способ связи. Контекст выбранного прибора уже будет добавлен к обращению.</p>
                <div className="quote-contact-choices">
                  <a className="quote-contact-choice quote-contact-email" href={mailHref} onClick={close}>
                    <span className="quote-choice-icon"><Mail aria-hidden="true" size={23} /></span>
                    <strong>Написать на почту</strong>
                    <span>Откроется письмо на info@prscom.ru</span>
                  </a>
                  <button className="quote-contact-choice quote-contact-phone" type="button" onClick={() => setStep("callback")}>
                    <span className="quote-choice-icon"><PhoneCall aria-hidden="true" size={23} /></span>
                    <strong>Заказать обратный звонок</strong>
                    <span>Оставьте номер, и мы свяжемся с вами</span>
                  </button>
                </div>
              </>
            ) : null}

            {step === "callback" ? (
              <>
                <button className="quote-modal-back" type="button" onClick={() => setStep("choice")}>
                  <ArrowLeft aria-hidden="true" size={17} /> Другой способ связи
                </button>
                <p className="section-kicker">Обратный звонок</p>
                <h2 id="quote-dialog-title">Оставьте номер телефона</h2>
                <p className="quote-modal-lead">Уточним задачу и подготовим информацию по оборудованию.</p>
                <form className="callback-form" onSubmit={submitCallback}>
                  <label>
                    <span>Имя</span>
                    <input name="name" type="text" autoComplete="name" maxLength={80} placeholder="Как к вам обращаться" />
                  </label>
                  <label>
                    <span>Телефон *</span>
                    <input name="phone" type="tel" inputMode="tel" autoComplete="tel" maxLength={32} required placeholder="+7 (___) ___-__-__" />
                  </label>
                  <label>
                    <span>Комментарий</span>
                    <textarea name="comment" maxLength={500} rows={3} placeholder="Прибор, газ или удобное время звонка" />
                  </label>
                  <label className="callback-honeypot" aria-hidden="true">
                    <span>Сайт</span>
                    <input name="website" type="text" tabIndex={-1} autoComplete="off" />
                  </label>
                  <label className="callback-consent">
                    <input name="consent" type="checkbox" required />
                    <span>Согласен на обработку контактных данных для обратной связи</span>
                  </label>
                  {error ? <p className="callback-error" role="alert">{error}</p> : null}
                  <button className="button button-primary callback-submit" type="submit" disabled={pending}>
                    <Send aria-hidden="true" size={18} />
                    {pending ? "Отправляем..." : "Заказать звонок"}
                  </button>
                </form>
              </>
            ) : null}

            {step === "success" ? (
              <div className="callback-success">
                <CheckCircle2 aria-hidden="true" size={42} />
                <p className="section-kicker">Заявка отправлена</p>
                <h2 id="quote-dialog-title">Спасибо, мы получили ваш номер</h2>
                <p>Специалист свяжется с вами для уточнения задачи.</p>
                <button className="button button-primary" type="button" onClick={close}>Закрыть</button>
              </div>
            ) : null}

            <div className="quote-direct-contacts">
              <a href="tel:+79255086258">+7 (925) 508-62-58</a>
              <a href="tel:+74957486258">+7 (495) 748-62-58</a>
            </div>
          </div>
        </div>
      ) : null}
    </QuoteRequestContext.Provider>
  );
}

export function QuoteRequestButton({ children, className, subject, details, source, title }: QuoteRequestButtonProps) {
  const context = useContext(QuoteRequestContext);
  if (!context) throw new Error("QuoteRequestButton must be rendered inside QuoteRequestProvider");

  return (
    <button
      className={className}
      type="button"
      title={title}
      onClick={() => context.openQuoteRequest({ subject, details, source })}
    >
      {children}
    </button>
  );
}
