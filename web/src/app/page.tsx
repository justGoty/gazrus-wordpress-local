import Image from "next/image";
import { ArrowRight, FileCheck2, Gauge, Wrench } from "lucide-react";
import Link from "next/link";
import { CategoryHero } from "@/components/category-hero";
import { QuickSelection } from "@/components/quick-selection";
import { QuoteRequestButton } from "@/components/quote-request";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { categories } from "@/data/categories";
import { seller } from "@/data/seller";
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
      legalName: seller.legalName,
      taxID: seller.taxId,
      url: absoluteUrl("/"),
      logo: absoluteUrl("/icon-512.png"),
      description: homeSeo.description,
      email: seoSite.contactEmail,
      telephone: seoSite.contactPhones,
      areaServed: { "@type": "Country", name: "Россия" },
      knowsAbout: [
        "Стационарные газоанализаторы",
        "Портативные газоанализаторы",
        "Сенсоры для газоанализаторов",
        "Контроль загазованности",
        "Промышленная газовая безопасность",
      ],
      contactPoint: seoSite.contactPhones.map((telephone) => ({
        "@type": "ContactPoint",
        contactType: "sales",
        telephone,
        email: seoSite.contactEmail,
        availableLanguage: "Russian",
        areaServed: "RU",
      })),
    },
    {
      "@type": "WebSite",
      "@id": `${seoSite.origin}/#website`,
      name: seoSite.siteName,
      url: absoluteUrl("/"),
      inLanguage: "ru-RU",
      publisher: { "@id": `${seoSite.origin}/#organization` },
      about: { "@id": `${seoSite.origin}/#organization` },
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
              <strong>Ответ в течение суток</strong>
              <span>По известной модели или вашей задаче</span>
            </div>
            <div className="trust-item">
              <strong>Поставка от двух недель</strong>
              <span>Конкретный срок уточним по прибору и комплектации</span>
            </div>
            <div className="trust-item">
              <strong>Подбор под условия объекта</strong>
              <span>Газ, диапазон, исполнение и необходимые документы</span>
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
                Знаете модель? Найдите ее в каталоге. Нужна помощь с выбором? Расскажите, какой газ и в каких условиях нужно контролировать.
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
                Поможем уточнить исполнение и комплект поставки. Стоимость, срок и состав заказа согласуем в коммерческом предложении.
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
                <strong>Документы на прибор</strong>
                <span>Руководства и метрологические документы для выбранной модели.</span>
              </div>
              <div className="service-item">
                <Wrench aria-hidden="true" size={24} />
                <strong>Сенсоры для замены</strong>
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
                Напишите модель или опишите задачу. Ответим на запрос в течение суток и уточним условия поставки.
              </p>
            </div>
            <QuoteRequestButton className="button button-primary" subject="Запрос КП на газоанализатор" source="Главная — коммерческий блок">
              Запросить КП
              <ArrowRight aria-hidden="true" size={18} />
            </QuoteRequestButton>
          </div>
        </section>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeStructuredData).replace(/</g, "\\u003c") }}
      />

      <SiteFooter />
    </>
  );
}
