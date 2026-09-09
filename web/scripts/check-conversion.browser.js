async (page) => {
  const location = await page.evaluate(() => ({ origin: window.location.origin, hostname: window.location.hostname }));
  const origin = location.origin;
  if (!["127.0.0.1", "localhost"].includes(location.hostname)) throw new Error("Run only against a local server; all lead requests are mocked.");
  const results = [];
  const assert = (condition, message) => { if (!condition) throw new Error(message); };
  const productPath = "/catalog/stationary/sta-kd1";
  const requests = [];
  let responseBody = { ok: false, message: "Проверка: отправка не подтверждена" };
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/api/leads/**", async (route) => {
    requests.push({ url: route.request().url(), body: route.request().postDataJSON() });
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(responseBody) });
  });

  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: width > 1000 ? 960 : 844 });
    for (const path of [productPath, "/", "/contacts", "/catalog"]) {
      const response = await page.goto(origin + path);
      assert(response.status() === 200, `${width} ${path}: HTTP ${response.status()}`);
      await page.locator("h1").waitFor();
      await page.evaluate(() => document.fonts.ready);
      const layout = await page.evaluate(() => {
        const brand = document.querySelector(".brand-link").getBoundingClientRect();
        const actions = document.querySelector(".header-actions").getBoundingClientRect();
        return { overflow: document.documentElement.scrollWidth > innerWidth, overlap: brand.right > actions.left, phone: document.querySelector(".header-phone").checkVisibility() };
      });
      assert(!layout.overflow && !layout.overlap && layout.phone, `${width} ${path}: ${JSON.stringify(layout)}`);
      if (path === productPath && width <= 760) {
        const cta = await page.locator(".product-mobile-actions").boundingBox();
        assert(cta && cta.y + cta.height <= 845 && cta.y > 0, "Mobile CTA must be visible in the viewport");
        const title = await page.locator("h1").boundingBox();
        const gallery = await page.locator(".product-gallery").boundingBox();
        assert(title.y < gallery.y, "Product title must precede mobile gallery");
      }
      if ([390, 1440].includes(width) && path !== "/catalog") {
        const name = path === "/" ? "home" : path === "/contacts" ? "contacts" : "product";
        await page.screenshot({ path: `output/playwright/conversion-${name}-${width}.png` });
      }
      results.push(`${width}px ${path}: layout passed`);
    }
  }

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(origin + productPath);
  await page.locator(".product-mobile-actions").getByRole("button", { name: "Узнать цену", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.waitFor();
  const emailForm = dialog.locator("form:not([hidden])");
  assert((await emailForm.locator('[name="subject"]').inputValue()).includes("СТА-КД1"), "Missing product subject");
  assert((await emailForm.locator('[name="message"]').inputValue()).includes("СТА-КД1"), "Missing product request preset");
  await emailForm.locator('[name="email"]').fill("sales-test@example.com");
  await emailForm.locator('[name="message"]').fill("Тестовая заявка: стоимость СТА-КД1, два прибора.");
  await dialog.getByRole("button", { name: "Обратный звонок", exact: true }).click();
  await dialog.locator('form:not([hidden]) [name="phone"]').fill("+7 (000) 000-00-00");
  await dialog.getByRole("button", { name: "Письмо", exact: true }).click();
  assert(await emailForm.locator('[name="email"]').inputValue() === "sales-test@example.com", "Email draft lost when switching");
  await emailForm.locator('[name="consent"]').check();
  await page.screenshot({ path: "output/playwright/conversion-email-390.png" });
  for (let i = 0; i < 14; i++) {
    await page.keyboard.press("Tab");
    assert(await page.evaluate(() => document.querySelector("dialog").contains(document.activeElement)), "Focus escaped native modal");
  }
  // Dispatch twice in the same tick to cover the interval before React disables the button.
  await emailForm.evaluate((form) => {
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  });
  await dialog.getByRole("alert").waitFor();
  assert(requests.length === 1, "Double submit emitted more than one request");
  assert(await emailForm.locator('[name="email"]').inputValue() === "sales-test@example.com", "Error lost form draft");
  assert(await dialog.locator(".lead-success").count() === 0, "HTTP 200 / ok false must not show success");
  const firstId = requests[0].body.requestId;
  assert(requests[0].body.context.includes("СТА-КД1"), "Product context not submitted");
  await emailForm.getByRole("button", { name: "Отправить запрос" }).click();
  await dialog.getByRole("alert").waitFor();
  await emailForm.getByRole("button", { name: "Отправить запрос" }).waitFor();
  assert(requests.length === 2 && requests[1].body.requestId === firstId, "Unchanged retry must reuse request id");
  await emailForm.locator('[name="email"]').fill("corrected-sales-test@example.com");
  responseBody = { ok: true };
  await emailForm.getByRole("button", { name: "Отправить запрос" }).click();
  await dialog.locator(".lead-success").waitFor();
  assert(requests.length === 3 && requests[2].body.requestId !== firstId, "Edited payload must get a new request id");
  assert(await page.evaluate(() => document.activeElement.classList.contains("lead-success")), "Success should receive focus");
  await dialog.getByRole("button", { name: "Закрыть", exact: true }).click();
  assert(await page.evaluate(() => document.activeElement.textContent.includes("Узнать цену")), "Focus not returned to CTA");
  results.push("Email: product preset, preserved draft, focus trap, double-submit guard, false response, stable retry id, success passed");

  await page.getByRole("button", { name: "Обсудить по телефону" }).click();
  await dialog.waitFor();
  const callbackForm = dialog.locator("form:not([hidden])");
  assert(await callbackForm.locator('[name="phone"]').count() === 1, "Callback should open directly");
  await callbackForm.locator('[name="phone"]').fill("+7 (000) 000-00-00");
  await callbackForm.locator('[name="consent"]').check();
  await callbackForm.getByRole("button", { name: "Заказать звонок", exact: true }).click();
  await dialog.locator(".lead-success").waitFor();
  assert(requests.length === 4 && requests[3].url.endsWith("/callback"), "Callback endpoint not selected");
  assert(requests[3].body.requestId !== firstId, "Independent callback must have its own request id");
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "detached" });
  results.push("Direct callback, independent id, success and Escape passed");

  await page.goto(origin + "/");
  await page.getByRole("button", { name: "Открыть меню" }).click();
  await page.locator(".mobile-nav").getByRole("button", { name: "Запросить КП" }).click();
  await dialog.waitFor();
  assert(await page.locator(".mobile-nav").getAttribute("data-open") === "false", "Mobile menu stayed open");
  await page.keyboard.press("Escape");
  await dialog.waitFor({ state: "detached" });
  assert(await page.evaluate(() => !document.body.style.overflow), "Body scroll not restored");
  assert(await page.evaluate(() => !document.querySelector('script[src*="mc.yandex.ru"]')), "Local QA should not load Metrika");
  assert(errors.length === 0, `Page errors: ${errors.join(", ")}`);
  results.push("Mobile menu and local analytics exclusion passed; no real mail sent");
  await page.unroute("**/api/leads/**");
  return results;
}
