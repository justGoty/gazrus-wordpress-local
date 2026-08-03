import { ArrowRight, FileCheck2, Gauge, Wrench } from "lucide-react";
import Link from "next/link";
import { CategoryHero } from "@/components/category-hero";
import { QuickSelection } from "@/components/quick-selection";
import { SiteHeader } from "@/components/site-header";
import { categories } from "@/data/categories";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <CategoryHero />

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
                <h2>Три направления без лишних уровней</h2>
              </div>
              <p>
                Категории разделены по способу применения. Внутри доступны собственные технические фильтры и единый запрос КП.
              </p>
            </header>

            <div className="category-grid">
              {categories.map((category) => (
                <article className={`category-card category-card-${category.accent}`} key={category.id}>
                  <span className="category-number">{category.number}</span>
                  <h3>{category.cardTitle}</h3>
                  <p>{category.cardDescription}</p>
                  <ul className="filter-tags" aria-label={`Основные фильтры: ${category.label}`}>
                    {category.filters.map((filter) => (
                      <li key={filter}>{filter}</li>
                    ))}
                  </ul>
                  <Link className="category-link" href={`/catalog?category=${category.id}`}>
                    Открыть категорию
                    <ArrowRight aria-hidden="true" size={17} />
                  </Link>
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

      <footer className="site-footer">
        <div className="footer-inner">
          <span>Газоанализатор.рус — промышленный газовый контроль</span>
          <a href="mailto:info@prscom.ru">info@prscom.ru</a>
        </div>
      </footer>
    </>
  );
}
