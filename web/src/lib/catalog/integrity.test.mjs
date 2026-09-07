import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { catalogIssues, assetPath } from "./integrity.mjs";

const fixture = JSON.parse(readFileSync(new URL("../../../content/catalog/products/sgx-ps1-co-1000.json", import.meta.url), "utf8"));
const makeCatalog = () => ({ products: [structuredClone(fixture)], brands: [{ id: fixture.brandId, name: "SGX Sensortech" }], gases: [{ id: "co", name: "Carbon monoxide", formula: "CO" }] });

test("valid catalog passes", () => assert.deepEqual(catalogIssues(makeCatalog()), []));
test("unknown brand and gas references fail", () => {
  const catalog = makeCatalog();
  catalog.brands = [];
  catalog.gases = [];
  assert.match(catalogIssues(catalog).join("\n"), /unknown brand/);
  assert.match(catalogIssues(catalog).join("\n"), /unknown gas/);
});
test("ranges and modifications must reference the product gas set", () => {
  const catalog = makeCatalog();
  catalog.products[0].ranges[0].gasId = "h2s";
  catalog.products[0].modifications = [{ id: "a", name: "A", gases: ["h2s"] }];
  const result = catalogIssues(catalog).join("\n");
  assert.match(result, /range gas h2s/);
  assert.match(result, /modification gas h2s/);
});
test("normalized model and SEO duplicates fail", () => {
  const catalog = makeCatalog();
  const second = structuredClone(fixture);
  second.id = "a-different-id";
  second.slug = "different-slug";
  second.model = ` ${fixture.model.toLowerCase()} `;
  second.seo.title = ` ${fixture.seo.title.toUpperCase()} `;
  second.seo.description = fixture.seo.description.replaceAll(" ", "  ");
  catalog.products.push(second);
  const result = catalogIssues(catalog).join("\n");
  for (const key of ["products.brand/model", "products.seo.title", "products.seo.description"]) assert.ok(result.includes(key));
});
test("nested duplicate IDs and source without location fail", () => {
  const catalog = makeCatalog();
  const product = catalog.products[0];
  product.gases.push("co");
  product.modifications = [{ id: "a", name: "A", gases: [] }, { id: "a", name: "B", gases: [] }];
  product.sources = [{ title: "Unknown", checkedAt: "2026-09-07T00:00:00Z" }];
  const result = catalogIssues(catalog).join("\n");
  assert.match(result, /gases: duplicate/);
  assert.match(result, /modifications: duplicate/);
  assert.match(result, /source lacks/);
});
test("dictionary duplicates fail", () => {
  const catalog = makeCatalog();
  catalog.brands.push({ ...catalog.brands[0] });
  catalog.gases.push({ ...catalog.gases[0] });
  const result = catalogIssues(catalog).join("\n");
  for (const key of ["brands.id", "brands.name", "gases.id", "gases.formula"]) assert.ok(result.includes(key));
});
test("unsafe paths are rejected while external links remain valid", () => {
  for (const url of ["//host/a", "/../secret", "/%2e%2e/secret", "/a\\b", "/%00", "/%zz", "javascript:alert(1)"]) assert.equal(assetPath(url), null);
  assert.equal(assetPath("/images/photo.webp?v=1"), "images/photo.webp");
  const catalog = makeCatalog();
  catalog.products[0].media[0].url = "javascript:alert(1)";
  assert.match(catalogIssues(catalog).join("\n"), /unsafe asset URL/);
  catalog.products[0].media[0].url = "https://example.com/photo.webp";
  assert.deepEqual(catalogIssues(catalog), []);
  for (const url of ["https://", "https://user:secret@example.com/a", "/C:/secret"]) {
    catalog.products[0].media[0].url = url;
    assert.match(catalogIssues(catalog).join("\n"), /unsafe asset URL/);
  }
});
