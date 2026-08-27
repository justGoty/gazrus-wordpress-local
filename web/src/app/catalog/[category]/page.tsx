import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CatalogBrowser } from "@/components/catalog-browser";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { categories, categoryById, type CategoryId } from "@/data/categories";
import { loadBrands, loadGases, loadProducts } from "@/lib/catalog/load-catalog";
import { CategoryIdSchema } from "@/lib/catalog/schema";
import { absoluteUrl, getSeoPageById } from "@/lib/seo/content";
import { buildPageMetadata } from "@/lib/seo/metadata";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function seoPageId(category: CategoryId): string {
  return `catalog-${category}`;
}

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.id }));
}

export async function generateMetadata({ params, searchParams }: CategoryPageProps): Promise<Metadata> {
  const parsedCategory = CategoryIdSchema.safeParse((await params).category);
  if (!parsedCategory.success) {
    return { title: "Категория не найдена", robots: { index: false, follow: false } };
  }

  const products = await loadProducts();
  const hasProducts = products.some((product) => product.category === parsedCategory.data);
  const hasParameters = Object.keys(await searchParams).length > 0;
  const seoPage = getSeoPageById(seoPageId(parsedCategory.data));
  const index = seoPage.seoStatus === "ready" && hasProducts && !hasParameters;
  return buildPageMetadata(seoPage.id, { index });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const parsedCategory = CategoryIdSchema.safeParse((await params).category);
  if (!parsedCategory.success) {
    notFound();
  }

  const categoryId = parsedCategory.data;
  const category = categoryById[categoryId];
  const seoPage = getSeoPageById(seoPageId(categoryId));
  const [gases, products, brands] = await Promise.all([loadGases(), loadProducts(), loadBrands()]);
  const categoryProducts = products.filter((product) => product.category === categoryId);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${absoluteUrl(seoPage.canonical)}#page`,
        name: seoPage.h1,
        description: seoPage.description,
        url: absoluteUrl(seoPage.canonical),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Главная", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Каталог", item: absoluteUrl("/catalog") },
          { "@type": "ListItem", position: 3, name: seoPage.h1, item: absoluteUrl(seoPage.canonical) },
        ],
      },
      {
        "@type": "ItemList",
        itemListElement: categoryProducts.map((product, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: product.title,
          url: absoluteUrl(`/catalog/${product.category}/${product.slug}`),
        })),
      },
    ],
  };

  return (
    <>
      <SiteHeader />
      <main>
        <section className="catalog-title-band">
          <div className="catalog-title-inner">
            <p className={`eyebrow eyebrow-${category.accent}`}>Каталог · {category.label}</p>
            <h1>{seoPage.h1}</h1>
            <p>{seoPage.description}</p>
          </div>
        </section>

        <section className="catalog-section">
          <Suspense fallback={<div className="catalog-loading">Загрузка каталога...</div>}>
            <CatalogBrowser
              gases={gases}
              products={products}
              brands={brands}
              initialCategory={categoryId}
            />
          </Suspense>
        </section>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />

      <SiteFooter />
    </>
  );
}
