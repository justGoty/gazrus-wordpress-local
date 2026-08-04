import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogBrowser } from "@/components/catalog-browser";
import { SiteHeader } from "@/components/site-header";
import { loadBrands, loadGases, loadProducts } from "@/lib/catalog/load-catalog";
import { absoluteUrl, getSeoPageById } from "@/lib/seo/content";
import { buildPageMetadata } from "@/lib/seo/metadata";

type CatalogPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: CatalogPageProps): Promise<Metadata> {
  const parameters = await searchParams;
  return buildPageMetadata("catalog", { index: Object.keys(parameters).length === 0 });
}

export default async function CatalogPage() {
  const [gases, products, brands] = await Promise.all([loadGases(), loadProducts(), loadBrands()]);
  const catalogSeo = getSeoPageById("catalog");
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${absoluteUrl(catalogSeo.canonical)}#page`,
        name: catalogSeo.h1,
        description: catalogSeo.description,
        url: absoluteUrl(catalogSeo.canonical),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Главная", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: catalogSeo.h1, item: absoluteUrl(catalogSeo.canonical) },
        ],
      },
      {
        "@type": "ItemList",
        itemListElement: products.map((product, index) => ({
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
            <p className="eyebrow eyebrow-blue">Инженерный каталог</p>
            <h1>{catalogSeo.h1}</h1>
            <p>Три товарных направления, технические параметры и запрос КП без условных цен.</p>
          </div>
        </section>

        <section className="catalog-section">
          <Suspense fallback={<div className="catalog-loading">Загрузка каталога...</div>}>
            <CatalogBrowser gases={gases} products={products} brands={brands} />
          </Suspense>
        </section>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />

      <footer className="site-footer">
        <div className="footer-inner">
          <span>Газоанализатор.рус — промышленный газовый контроль</span>
          <a href="mailto:info@prscom.ru">info@prscom.ru</a>
        </div>
      </footer>
    </>
  );
}
