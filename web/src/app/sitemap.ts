import type { MetadataRoute } from "next";
import { loadProducts } from "@/lib/catalog/load-catalog";
import { absoluteUrl, isSeoPageIndexable, seoPages } from "@/lib/seo/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await loadProducts();
  const fixedPages: MetadataRoute.Sitemap = seoPages
    .filter((page) => page.sitemap && isSeoPageIndexable(page))
    .map((page) => ({
      url: absoluteUrl(page.path),
      lastModified: page.updatedAt,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      ...(page.socialImage ? { images: [absoluteUrl(page.socialImage)] } : {}),
    }));

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: absoluteUrl(`/catalog/${product.category}/${product.slug}`),
    lastModified: product.updatedAt,
    changeFrequency: "monthly",
    priority: 0.7,
    images: product.media
      .filter((item) => item.type === "image")
      .map((item) => absoluteUrl(item.url)),
  }));

  return [...fixedPages, ...productPages];
}
