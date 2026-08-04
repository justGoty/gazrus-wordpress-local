import { promises as fs } from "node:fs";
import path from "node:path";
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

  const ids = new Set<string>();
  const slugs = new Set<string>();
  const seoTitles = new Set<string>();
  const seoDescriptions = new Set<string>();

  for (const product of products) {
    if (ids.has(product.id)) {
      throw new Error(`Повторяющийся product id: ${product.id}`);
    }
    if (slugs.has(product.slug)) {
      throw new Error(`Повторяющийся product slug: ${product.slug}`);
    }
    if (seoTitles.has(product.seo.title)) {
      throw new Error(`Повторяющийся product SEO title: ${product.seo.title}`);
    }
    if (seoDescriptions.has(product.seo.description)) {
      throw new Error(`Повторяющийся product SEO description: ${product.seo.description}`);
    }
    ids.add(product.id);
    slugs.add(product.slug);
    seoTitles.add(product.seo.title);
    seoDescriptions.add(product.seo.description);
  }

  return products.filter((product) => product.status === "published");
}

export async function loadProductBySlug(category: string, slug: string): Promise<Product | undefined> {
  const products = await loadProducts();
  return products.find((product) => product.category === category && product.slug === slug);
}
