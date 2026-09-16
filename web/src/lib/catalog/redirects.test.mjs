import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

const directory = new URL("../../../content/catalog/", import.meta.url);
const { redirects } = JSON.parse(readFileSync(new URL("redirects.json", directory), "utf8"));
const products = readdirSync(new URL("products/", directory))
  .filter((file) => file.endsWith(".json"))
  .map((file) => JSON.parse(readFileSync(new URL(`products/${file}`, directory), "utf8")));
const destinations = new Set([
  "/calculators/gas-converter", "/catalog/stationary", "/catalog/portable", "/catalog/sensors",
  ...products.filter((p) => p.status === "published").map((p) => `/catalog/${p.category}/${p.slug}`),
]);

test("legacy redirects are unique, permanent and target published pages without chains", () => {
  const sources = new Set(redirects.map((rule) => rule.source));
  assert.equal(sources.size, redirects.length);
  for (const rule of redirects) {
    assert.equal(rule.permanent, true);
    assert(destinations.has(rule.destination), `Unpublished destination: ${rule.destination}`);
    assert(!sources.has(rule.destination), `Redirect chain: ${rule.source}`);
    assert.notEqual(rule.destination, "/");
  }
});

test("WordPress portable pagination maps only positive page numbers to the complete category", () => {
  const rule = redirects.find((item) => item.source.startsWith("/catalog/portativnye-gazoanalizatory/page/"));
  assert.equal(rule.destination, "/catalog/portable");
  assert.equal(rule.source, "/catalog/portativnye-gazoanalizatory/page/:page([1-9]\\d*)");
  const pattern = new RegExp(`^${rule.source.replace(":page", "")}$`);
  for (const page of [1, 4, 14, 16]) assert(pattern.test(`/catalog/portativnye-gazoanalizatory/page/${page}`));
  for (const page of ["0", "-1", "04", "abc", "4/product"]) {
    assert(!pattern.test(`/catalog/portativnye-gazoanalizatory/page/${page}`));
  }
});

test("legacy aliases do not introduce blanket product redirects", () => {
  assert(redirects.some((rule) => rule.source === "/catalog/sensory-i-datchiki" && rule.destination === "/catalog/sensors"));
  assert(redirects.some((rule) => rule.source === "/catalog/portativnye-gazoanalizatory" && rule.destination === "/catalog/portable"));
  assert(!redirects.some((rule) => rule.source.startsWith("/product/") || rule.source.includes(":path*")));
});

test("populated category destinations are indexable and included in the sitemap", () => {
  const { pages } = JSON.parse(readFileSync(new URL("../seo/pages.json", directory), "utf8"));
  for (const category of ["stationary", "portable", "sensors"]) {
    const page = pages.find((item) => item.id === `catalog-${category}`);
    assert.equal(page.implementation, "implemented");
    assert.equal(page.seoStatus, "ready");
    assert.equal(page.indexing, "index");
    assert.equal(page.sitemap, true);
    assert.equal(page.canonical, `/catalog/${category}`);
    assert(products.some((product) => product.status === "published" && product.category === category));
  }
});
