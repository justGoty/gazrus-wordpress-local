import type { Metadata } from "next";
import { Suspense } from "react";
import { CatalogBrowser } from "@/components/catalog-browser";
import { SiteHeader } from "@/components/site-header";
import { loadBrands, loadGases, loadProducts } from "@/lib/catalog/load-catalog";

export const metadata: Metadata = {
  title: "Каталог газоанализаторов и сенсоров",
  description:
    "Стационарные и портативные газоанализаторы, сенсоры и технический подбор оборудования по газу и условиям эксплуатации.",
};

export default async function CatalogPage() {
  const [gases, products, brands] = await Promise.all([loadGases(), loadProducts(), loadBrands()]);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="catalog-title-band">
          <div className="catalog-title-inner">
            <p className="eyebrow eyebrow-blue">Инженерный каталог</p>
            <h1>Газоанализаторы и сенсоры</h1>
            <p>Три товарных направления, технические параметры и запрос КП без условных цен.</p>
          </div>
        </section>

        <section className="catalog-section">
          <Suspense fallback={<div className="catalog-loading">Загрузка каталога...</div>}>
            <CatalogBrowser gases={gases} products={products} brands={brands} />
          </Suspense>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <span>Газоанализатор.рус — промышленный газовый контроль</span>
          <a href="mailto:info@prscom.ru">info@prscom.ru</a>
        </div>
      </footer>
    </>
  );
}
