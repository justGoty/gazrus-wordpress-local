import type { Metadata } from "next";
import { Suspense } from "react";
import { DocumentsBrowser, type DocumentSearchItem } from "@/components/documents-browser";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { categoryById } from "@/data/categories";
import { loadBrands, loadProducts } from "@/lib/catalog/load-catalog";
import { absoluteUrl, getSeoPageById } from "@/lib/seo/content";
import { buildPageMetadata } from "@/lib/seo/metadata";

type DocsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: DocsPageProps): Promise<Metadata> {
  const parameters = await searchParams;
  return buildPageMetadata("docs", { index: Object.keys(parameters).length === 0 });
}

export default async function DocsPage() {
  const [products, brands] = await Promise.all([loadProducts(), loadBrands()]);
  const seoPage = getSeoPageById("docs");
  const brandById = new Map(brands.map((brand) => [brand.id, brand.name]));
  const documents: DocumentSearchItem[] = products
    .flatMap((product) =>
      product.documents.map((document, index) => ({
        id: `${product.id}-${index}`,
        title: document.title,
        url: document.url,
        productTitle: product.title,
        model: product.model,
        brand: brandById.get(product.brandId) ?? product.brandId,
        category: categoryById[product.category].label,
        productHref: `/catalog/${product.category}/${product.slug}`,
      })),
    )
    .sort((left, right) =>
      left.productTitle.localeCompare(right.productTitle, "ru") || left.title.localeCompare(right.title, "ru"),
    );

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
          { "@type": "ListItem", position: 2, name: seoPage.h1, item: absoluteUrl(seoPage.canonical) },
        ],
      },
      {
        "@type": "ItemList",
        numberOfItems: documents.length,
        itemListElement: documents.map((document, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: document.title,
          url: document.url,
        })),
      },
    ],
  };

  return (
    <>
      <SiteHeader />
      <main>
        <section className="catalog-title-band docs-title-band">
          <div className="catalog-title-inner">
            <p className="eyebrow eyebrow-blue">Техническая библиотека</p>
            <h1>{seoPage.h1}</h1>
            <p>{seoPage.description}</p>
          </div>
        </section>

        <section className="docs-section">
          <Suspense fallback={<div className="catalog-loading">Загрузка документов...</div>}>
            <DocumentsBrowser documents={documents} />
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
