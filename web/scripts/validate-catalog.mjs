import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { BrandSchema, GasSchema, ProductSchema } from "../src/lib/catalog/schema.ts";
import { catalogIssues, assetPath } from "../src/lib/catalog/integrity.mjs";

const root = path.resolve(import.meta.dirname, "..");
const catalog = path.join(root, "content/catalog");
const json = async (file) => JSON.parse(await readFile(path.join(catalog, file), "utf8"));
const brands = BrandSchema.array().parse(await json("dictionaries/brands.json"));
const gases = GasSchema.array().parse(await json("dictionaries/gases.json"));
const files = (await readdir(path.join(catalog, "products"))).filter((file) => file.endsWith(".json")).sort();
const products = [];
const issues = [];
for (const file of files) {
  const raw = await json(`products/${file}`);
  const parsed = ProductSchema.safeParse(raw);
  if (!parsed.success) {
    issues.push(`${file}: ${parsed.error.message}`);
    continue;
  }
  const product = parsed.data;
  if (file !== `${product.slug}.json`) issues.push(`${file}: filename must match slug`);
  products.push(product);
  for (const item of [...product.media, ...product.documents]) {
    const relative = assetPath(item.url);
    if (!relative) continue;
    try {
      const info = await stat(path.join(root, "public", relative));
      if (!info.isFile() || info.size === 0) issues.push(`${file}: empty/non-file asset ${item.url}`);
    } catch {
      issues.push(`${file}: missing asset ${item.url}`);
    }
  }
}
issues.push(...catalogIssues({ products, brands, gases }));
if (issues.length) {
  console.error(issues.join("\n"));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({ products: products.length, published: products.filter((p) => p.status === "published").length, brands: brands.length, gases: gases.length, issues: 0 }));
}
