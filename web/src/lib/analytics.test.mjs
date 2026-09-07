import assert from "node:assert/strict";
import test from "node:test";
import { METRIKA_COUNTER_ID, trackGoal, trackPageView } from "./analytics.ts";

const ORIGIN = "https://xn--80aaaalzch0asjh0a0a.xn--p1acf";

function browser(t, origin = ORIGIN, mode = "production") {
  const previousEnv = process.env.NODE_ENV;
  const previousGlobals = ["window", "document"].map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]);
  const scripts = [];
  const window = { location: { origin } };
  const document = {
    scripts,
    title: "Catalog",
    referrer: "https://example.org/",
    createElement: () => ({}),
    head: { appendChild: (script) => scripts.push(script) },
  };
  process.env.NODE_ENV = mode;
  Object.defineProperty(globalThis, "window", { value: window, configurable: true });
  Object.defineProperty(globalThis, "document", { value: document, configurable: true });
  t.after(() => {
    if (previousEnv === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previousEnv;
    for (const [key, descriptor] of previousGlobals) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  });
  return { window, scripts };
}

for (const [name, origin, mode] of [
  ["localhost production", "http://localhost:8096", "production"],
  ["loopback production", "http://127.0.0.1:8096", "production"],
  ["canonical development", ORIGIN, "development"],
  ["staging", "https://new.xn--80aaaalzch0asjh0a0a.xn--p1acf", "production"],
  ["HTTP", ORIGIN.replace("https:", "http:"), "production"],
  ["nonstandard port", `${ORIGIN}:8096`, "production"],
]) {
  test(`${name}: no tag or goals`, (t) => {
    const { window, scripts } = browser(t, origin, mode);
    trackPageView("/catalog");
    trackGoal("lead_email_success");
    assert.equal(window.ym, undefined);
    assert.equal(scripts.length, 0);
  });
}

test("one init and first hit; deduplicate rerenders, count route changes and back", (t) => {
  const { window, scripts } = browser(t);
  trackPageView("/");
  trackPageView("/");
  assert.equal(window.ym.a.length, 2);
  assert.equal(window.ym.a[0][0], METRIKA_COUNTER_ID);
  assert.equal(window.ym.a[0][1], "init");
  assert.equal(window.ym.a[0][2].defer, true);
  assert.equal(window.ym.a[0][2].webvisor, true);
  trackPageView("/catalog");
  trackPageView("/catalog?gas=co");
  trackPageView("/catalog?gas=co#selection");
  trackPageView("/");
  trackPageView("https://example.org/");
  assert.equal(scripts.length, 1);
  assert.equal(scripts[0].src, "https://mc.yandex.ru/metrika/tag.js");
  assert.equal(window.ym.a.filter((args) => args[1] === "init").length, 1);
  const hits = window.ym.a.filter((args) => args[1] === "hit");
  assert.deepEqual(hits.map((args) => args[2]), [ORIGIN + "/", ORIGIN + "/catalog", ORIGIN + "/catalog?gas=co", ORIGIN + "/"]);
  assert.equal(hits[0][3].referer, "https://example.org/");
  assert.equal(hits[1][3].referer, ORIGIN + "/");
});

test("goals contain only counter, method and fixed name; no URL or params", (t) => {
  const { window } = browser(t);
  const goals = ["lead_email_success", "lead_callback_success", "phone_click"];
  for (const goal of goals) trackGoal(goal);
  assert.deepEqual(
    window.ym.a.filter((args) => args[1] === "reachGoal"),
    goals.map((goal) => [METRIKA_COUNTER_ID, "reachGoal", goal]),
  );
});

test("a throwing ym cannot break callers, before or after initialization", (t) => {
  const { window } = browser(t);
  const blocked = () => { throw new Error("blocked"); };
  window.ym = blocked;
  assert.doesNotThrow(() => trackPageView("/"));
  assert.doesNotThrow(() => trackGoal("lead_email_success"));
  delete window.ym;
  trackPageView("/");
  window.ym = blocked;
  assert.doesNotThrow(() => trackPageView("/catalog"));
  assert.doesNotThrow(() => trackGoal("lead_callback_success"));
});
