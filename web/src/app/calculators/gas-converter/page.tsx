import { Activity, ArrowRight, BookOpenCheck, CircleGauge, FlaskConical } from "lucide-react";
import Link from "next/link";
import { GasConverter } from "@/components/gas-converter";
import { QuoteRequestButton } from "@/components/quote-request";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { absoluteUrl, getSeoPageById, seoSite } from "@/lib/seo/content";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata("gas-converter");

export default function GasConverterPage() {
  const seoPage = getSeoPageById("gas-converter");
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `${absoluteUrl(seoPage.canonical)}#application`,
        name: seoPage.h1,
        description: seoPage.description,
        url: absoluteUrl(seoPage.canonical),
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any",
        browserRequirements: "Современный браузер с поддержкой JavaScript",
        isAccessibleForFree: true,
        inLanguage: "ru-RU",
        dateModified: "2026-09-01",
        featureList: ["Перевод ppm", "Перевод мг/м³", "Перевод объемной доли", "Перевод % НКПР"],
        provider: {
          "@type": "Organization",
          name: seoSite.siteName,
          url: absoluteUrl("/"),
          email: seoSite.contactEmail,
        },
        citation: [
          "https://physics.nist.gov/cuu/Constants/index.html",
          "https://www.cdc.gov/niosh/npg/pgintrod.html",
          "https://www.cdc.gov/niosh/npg/npgd0524.html",
          "https://www.cdc.gov/niosh/npg/npgd0105.html",
          "https://www.cdc.gov/niosh/npg/npgd0337.html",
          "https://www.cdc.gov/niosh/npg/npgd0028.html",
        ],
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Главная", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Конвертер газов", item: absoluteUrl(seoPage.canonical) },
        ],
      },
    ],
  };

  return (
    <>
      <SiteHeader />
      <main>
        <section className="converter-title-band">
          <div className="converter-title-inner">
            <div className="converter-title-copy">
              <p className="eyebrow eyebrow-blue">Расчетный инструмент</p>
              <h1>{seoPage.h1}</h1>
              <p>
                Переводите концентрацию газа между ppm, мг/м³, объемной долей и % НКПР. Выберите газ и укажите
                температуру с давлением — результаты пересчитаются автоматически.
              </p>
            </div>
            <div className="converter-title-visual" aria-hidden="true">
              <div className="converter-visual-heading">
                <span><Activity size={17} /> Пересчет концентрации</span>
                <span>20 °C · 101,325 кПа</span>
              </div>
              <div className="converter-visual-reading">
                <span>CH₄</span>
                <strong>100</strong>
                <b>ppm</b>
              </div>
              <div className="converter-visual-results">
                <div>
                  <span>мг/м³</span>
                  <strong>66,69</strong>
                </div>
                <div>
                  <span>% об.</span>
                  <strong>0,01</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="converter-section">
          <div className="converter-section-inner">
            <GasConverter />
          </div>
        </section>

        <section className="converter-method-section">
          <div className="converter-method-inner">
            <div className="converter-method-heading">
              <p className="section-kicker">Методика</p>
              <h2>Как выполняется перевод</h2>
              <p>Все исходные условия и ограничения остаются видимыми, чтобы результат можно было проверить.</p>
            </div>
            <div className="converter-method-grid">
              <article>
                <FlaskConical aria-hidden="true" size={24} />
                <h3>ppm и объемная доля</h3>
                <p>1% об. соответствует 10 000 ppm. Этот перевод не зависит от температуры и давления.</p>
              </article>
              <article>
                <CircleGauge aria-hidden="true" size={24} />
                <h3>Массовая концентрация</h3>
                <p>мг/м³ рассчитывается по молярной массе, абсолютной температуре и давлению идеального газа.</p>
              </article>
              <article>
                <BookOpenCheck aria-hidden="true" size={24} />
                <h3>Процент от НКПР</h3>
                <p>Расчет доступен только для газов с внесенным справочным пределом воспламенения.</p>
              </article>
            </div>

            <div className="converter-formula-band">
              <div>
                <span>Используемая формула</span>
                <strong>мг/м³ = ppm × M × P / (R × T × 1000)</strong>
              </div>
              <p>
                Где M — молярная масса, P — давление в Па, T — температура в K, R = 8,314462618 Дж/(моль·К).
              </p>
            </div>

            <div className="converter-source-band">
              <div>
                <h2>Источники и область применения</h2>
                <p>
                  Газовая постоянная приведена по CODATA/NIST. Определение НКПР и справочные пределы для горючих газов
                  сверяются с NIOSH. Конвертер предназначен для инженерной оценки и подготовки исходных данных.
                </p>
              </div>
              <div className="converter-source-links">
                <a href="https://physics.nist.gov/cuu/Constants/index.html" target="_blank" rel="noreferrer">
                  NIST: физические константы <ArrowRight aria-hidden="true" size={17} />
                </a>
                <a href="https://www.cdc.gov/niosh/npg/pgintrod.html" target="_blank" rel="noreferrer">
                  NIOSH Pocket Guide <ArrowRight aria-hidden="true" size={17} />
                </a>
              </div>
            </div>

            <div className="converter-cta">
              <div>
                <p className="section-kicker">От расчета к оборудованию</p>
                <h2>Нужен газоанализатор под конкретный газ и диапазон?</h2>
                <p>Поможем проверить исходные условия и подобрать стационарное или портативное решение.</p>
              </div>
              <div className="converter-cta-actions">
                <QuoteRequestButton
                  className="button button-primary"
                  subject="Подбор газоанализатора после расчета концентрации"
                  source="Конвертер газов"
                >
                  Запросить подбор
                </QuoteRequestButton>
                <Link className="button converter-catalog-link" href="/catalog">
                  Открыть каталог
                </Link>
              </div>
            </div>
          </div>
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
