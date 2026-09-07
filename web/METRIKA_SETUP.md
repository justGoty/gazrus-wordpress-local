# Yandex Metrika 112352811

## Implementation

- Enabled only when NODE_ENV is production and the browser origin is exactly https://xn--80aaaalzch0asjh0a0a.xn--p1acf. Localhost, development builds, staging hosts, HTTP and nonstandard ports do not load the tag or send goals.
- One queued tag initialization per browser document; defer: true disables the automatic pageview. The client component sends the first hit and subsequent pathname/query changes. Consecutive identical URLs are ignored, including effect remounts; A -> B -> A counts three views. Hash-only navigation is not a pageview.
- SPA hits include the page title and previous page URL (document.referrer for the first view). Existing query parameters, including campaign attribution, remain in page URLs. Never put personal data in URLs.
- Webvisor, clickmap, trackLinks and accurateTrackBounce are enabled. No noscript tracking pixel is rendered, so it cannot bypass the runtime host gate.
- All input/textarea elements in both lead forms have ym-disable-keys. Both forms also have ym-hide-content, masking their content and errors. No ym-record-keys is used.
- lead_email_success and lead_callback_success are sent only after both HTTP success and JSON ok === true. Invalid JSON, missing/false ok, HTTP errors and rejected fetch do not count. Goals carry only their fixed identifier, without params, contacts, message content or request IDs.
- phone_click is delegated to tel: links throughout the page, including the footer and dialog. It is a click, not a confirmed call or lead.
- Analytics failures do not change submission results. Backend SMTP/API behavior is unchanged: success means SMTP handoff, not mailbox delivery.

## Counter Settings

Create JavaScript event goals named exactly lead_email_success, lead_callback_success and phone_click in counter 112352811. Use only the first two as lead conversions. Enable Webvisor and leave recording of all input fields disabled as an additional precaution. Do not install a second copy of this counter through a tag manager or another snippet.

## Browser Acceptance Without Real Submissions

1. On localhost/dev, navigate, open the dialog and click telephone links: no mc.yandex requests or ym initialization from this integration.
2. In an isolated production-build browser harness, map the canonical origin to the local application. Intercept the Metrika tag before navigation and replace it with a local ym spy; block all other Yandex requests. Do not publish mock code or add a production bypass to the host gate.
3. Check one init with defer: true and webvisor: true, one initial hit, then one hit for each pathname/query change. Check back/forward, A -> B -> A and repeated renders of the same URL. There must be no duplicate first hit.
4. Before interacting with forms, intercept BOTH /api/leads/email and /api/leads/callback in the browser harness, returning synthetic responses without forwarding to the backend. Block any unmatched lead API request. Use fictional input only.
5. For each form, simulate HTTP 200 with {"ok":true}: exactly the matching goal and success view. Repeat with {"ok":false}, {}, null, invalid JSON, HTTP 400/502/503 and network failure: no success goal. Opening a dialog or clicking submit alone is not a goal.
6. Click a footer or dialog tel: link: only phone_click, with no fourth params argument. Prevent external telephone-app navigation in the harness.
7. Inspect both forms: every input/textarea has ym-disable-keys and each form has ym-hide-content. After authorized deployment, verify an actual Webvisor recording with fictional input and WITHOUT submitting; field values must not be readable.
8. Production reporting, goal configuration and actual Webvisor masking require separate browser/account acceptance. Offline spies cannot prove data arrival in Metrika or SMTP delivery.

## Offline Helper Tests

Run from web/ with Node.js supporting TypeScript stripping:

```powershell
node --experimental-strip-types --test src/lib/analytics.test.mjs
```

The tests use mock window/document and never fetch the tag or contact the lead API.
The parent added `pnpm test:analytics`, included in CI and scripts/check.ps1.

## Official References

- [SPA setup: defer and manual hits](https://yandex.ru/support/metrica/ru/code/counter-spa-setup)
- [hit API](https://yandex.ru/support/metrica/ru/objects/hit)
- [reachGoal API](https://yandex.ru/support/metrica/ru/objects/reachgoal)
- [Webvisor field and content masking](https://yandex.ru/support/metrica/ru/webvisor/settings)
