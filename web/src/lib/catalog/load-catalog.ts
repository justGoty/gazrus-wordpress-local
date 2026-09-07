import { promises as fs } from "node:fs";
import path from "node:path";
import { catalogIssues } from "./integrity.mjs";
import {
  BrandSchema,
  GasSchema,
  ProductSchema,
  type Brand,
  type Gas,
  type Product,
} from "@/lib/catalog/schema";

const catalogRoot = path.join(process.cwd(), "content", "catalog");

async function readJson(filePath: string): Promise<unknown> {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

export async function loadGases(): Promise<Gas[]> {
  const value = await readJson(path.join(catalogRoot, "dictionaries", "gases.json"));
  return GasSchema.array().parse(value);
}

export async function loadBrands(): Promise<Brand[]> {
  const value = await readJson(path.join(catalogRoot, "dictionaries", "brands.json"));
  return BrandSchema.array().parse(value);
}

export async function loadProducts(): Promise<Product[]> {
  const productDirectory = path.join(catalogRoot, "products");
  const entries = await fs.readdir(productDirectory, { withFileTypes: true });
  const productFiles = entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => entry.name)
    .sort();

  const products = await Promise.all(
    productFiles.map(async (fileName) =>
      ProductSchema.parse(await readJson(path.join(productDirectory, fileName))),
    ),
  );

  const [brands, gases] = await Promise.all([loadBrands(), loadGases()]);
  const issues = catalogIssues({ products, brands, gases });
  if (issues.length) throw new Error(`Catalog integrity failed:\n${issues.join("\n")}`);

  return products.filter((product) => product.status === "published");
}

export async function loadProductBySlug(category: string, slug: string): Promise<Product | undefined> {
  const products = await loadProducts();
  return products.find((product) => product.category === category && product.slug === slug);
}
