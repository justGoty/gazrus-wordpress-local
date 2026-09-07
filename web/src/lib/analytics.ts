export const METRIKA_COUNTER_ID = 112352811;
const CANONICAL_ORIGIN = "https://xn--80aaaalzch0asjh0a0a.xn--p1acf";
const TAG_URL = "https://mc.yandex.ru/metrika/tag.js";

type Goal = "lead_email_success" | "lead_callback_success" | "phone_click";
type Metrika = ((...args: unknown[]) => void) & { a?: unknown[][]; l?: number };
type AnalyticsWindow = Window & {
  ym?: Metrika;
  gazrusMetrika?: { initialized: boolean; lastPageUrl?: string };
};

export function isAnalyticsEnabled(): boolean {
  return process.env.NODE_ENV === "production"
    && typeof window !== "undefined"
    && window.location.origin === CANONICAL_ORIGIN;
}

function getCounter(): AnalyticsWindow | undefined {
  if (!isAnalyticsEnabled()) return;
  const target = window as AnalyticsWindow;
  const state = target.gazrusMetrika ??= { initialized: false };
  if (!target.ym) {
    const queue: Metrika = (...args) => { (queue.a ??= []).push(args); };
    queue.l = Date.now();
    target.ym = queue;
  }
  if (!state.initialized) {
    // Disable the automatic first hit; all pageviews share the same deduplication.
    target.ym(METRIKA_COUNTER_ID, "init", {
      defer: true,
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true,
    });
    state.initialized = true;
    if (!Array.from(document.scripts).some((script) => script.src === TAG_URL)) {
      const script = document.createElement("script");
      script.async = true;
      script.src = TAG_URL;
      document.head.appendChild(script);
    }
  }
  return target;
}

export function trackPageView(path: string): void {
  try {
    const target = getCounter();
    if (!target?.ym || !target.gazrusMetrika) return;
    const url = new URL(path, CANONICAL_ORIGIN);
    if (url.origin !== CANONICAL_ORIGIN) return;
    url.hash = "";
    const state = target.gazrusMetrika;
    if (state.lastPageUrl === url.href) return;
    target.ym(METRIKA_COUNTER_ID, "hit", url.href, {
      title: document.title,
      referer: state.lastPageUrl ?? document.referrer,
    });
    state.lastPageUrl = url.href;
  } catch {
    // Analytics must never interrupt navigation or lead submission.
  }
}

export function trackGoal(goal: Goal): void {
  try {
    // Deliberately no params, contact details, form values or request identifiers.
    getCounter()?.ym?.(METRIKA_COUNTER_ID, "reachGoal", goal);
  } catch {
    // A blocked or failing third-party tag must not turn a successful lead into an error.
  }
}
