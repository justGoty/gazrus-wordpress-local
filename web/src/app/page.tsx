import Image from "next/image";
import { ArrowRight, FileCheck2, Gauge, Wrench } from "lucide-react";
import Link from "next/link";
import { CategoryHero } from "@/components/category-hero";
import { QuickSelection } from "@/components/quick-selection";
import { SiteHeader } from "@/components/site-header";
import { categories } from "@/data/categories";
import { absoluteUrl, getSeoPageById, seoSite } from "@/lib/seo/content";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata("home");

const homeSeo = getSeoPageById("home");
const homeStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${seoSite.origin}/#organization`,
      name: seoSite.siteName,
      url: absoluteUrl("/"),
      email: seoSite.contactEmail,
    },
    {
      "@type": "WebSite",
      "@id": `${seoSite.origin}/#website`,
      name: seoSite.siteName,
      url: absoluteUrl("/"),
      inLanguage: "ru-RU",
      publisher: { "@id": `${seoSite.origin}/#organization` },
    },
  ],
};

export default function Home() {
  return (
    <>
      <SiteHeader />
      <CategoryHero pageHeading={homeSeo.h1} />

      <main>
        <section className="trust-strip" aria-label="Принципы работы">
          <div className="trust-inner">
            <div className="trust-item">
              <strong>Технический подбор</strong>
              <span>По газу, диапазону и условиям эксплуатации</span>
            </div>
            <div className="trust-item">
              <strong>Документы рядом с товаром</strong>
              <span>Паспорта, руководства и подтвержденные сертификаты</span>
            </div>
            <div className="trust-item">
              <strong>Коммерческое предложение</strong>
              <span>Комплектация и стоимость после проверки запроса</span>
            </div>
          </div>
        </section>

        <section className="section" id="catalog">
          <div className="section-inner">
            <header className="section-heading">
              <div>
                <p className="section-kicker">Каталог</p>
                <h2>Газоанализаторы и сенсоры по типу оборудования</h2>
              </div>
              <p>
                Выберите стационарный или портативный газоанализатор либо сенсор. Для каждой категории предусмотрены технический подбор и запрос коммерческого предложения.
              </p>
            </header>

            <div className="category-grid">
              {categories.map((category) => (
                <article className={`category-card category-card-${category.accent}`} key={category.id}>
                  <div className="category-card-media">
                    <Image alt={category.imageAlt} fill sizes="(max-width: 760px) 100vw, 33vw" src={category.cardImage} />
                  </div>
                  <div className="category-card-body">
                    <h3>{category.cardTitle}</h3>
                    <p>{category.cardDescription}</p>
                    <Link className="category-link" href={`/catalog/${category.id}`}>
                      Открыть категорию
                      <ArrowRight aria-hidden="true" size={17} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="selection-section" id="selection">
          <QuickSelection />
        </section>

        <section className="section" id="services">
          <div className="section-inner">
            <header className="section-heading">
              <div>
                <p className="section-kicker">Комплектация</p>
                <h2>От выбора прибора до документов</h2>
              </div>
              <p>
                Сервисные разделы поддерживают каталог и помогают сформировать комплект поставки без смешивания с товарными категориями.
              </p>
            </header>

            <div className="service-grid" id="documents">
              <div className="service-item">
                <Gauge aria-hidden="true" size={24} />
                <strong>Подбор под объект</strong>
                <span>Газ, диапазон, точки контроля и условия эксплуатации.</span>
              </div>
              <div className="service-item">
                <FileCheck2 aria-hidden="true" size={24} />
                <strong>Поверка и документы</strong>
                <span>Только подтвержденные сведения рядом с конкретной моделью.</span>
              </div>
              <div className="service-item">
                <Wrench aria-hidden="true" size={24} />
                <strong>Сенсоры и обслуживание</strong>
                <span>Подбор по совместимости, диапазону и принципу измерения.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="quote-band">
          <div className="quote-inner">
            <div>
              <h2>Нужна комплектация под конкретную задачу?</h2>
              <p>
                Отправьте исходные параметры. Ответим с уточнениями по моделям, документам и составу коммерческого предложения.
              </p>
            </div>
            <a className="button button-primary" href="mailto:info@prscom.ru?subject=Запрос%20КП%20на%20газоанализатор">
              Запросить КП
              <ArrowRight aria-hidden="true" size={18} />
            </a>
          </div>
        </section>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeStructuredData).replace(/</g, "\\u003c") }}
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
