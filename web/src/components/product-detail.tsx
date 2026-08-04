import { ArrowLeft, Download, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { ProductGallery } from "@/components/product-gallery";
import { categoryById } from "@/data/categories";
import { formatBrandId } from "@/lib/catalog/display";
import type { Brand, Gas, Product } from "@/lib/catalog/schema";

type ProductDetailProps = {
  product: Product;
  gases: Gas[];
  brands: Brand[];
};

export function ProductDetail({ product, gases, brands }: ProductDetailProps) {
  const category = categoryById[product.category];
  const brandName = brands.find((brand) => brand.id === product.brandId)?.name ?? formatBrandId(product.brandId);
  const gasById = new Map(gases.map((gas) => [gas.id, gas]));
  const specificationGroups = new Map<string, typeof product.specifications>();

  for (const specification of product.specifications) {
    const group = specification.group ?? "Основные параметры";
    specificationGroups.set(group, [...(specificationGroups.get(group) ?? []), specification]);
  }

  const quoteHref = `mailto:info@prscom.ru?subject=${encodeURIComponent(`Запрос КП: ${product.title}`)}`;

  return (
    <div className="product-page">
      <div className="product-breadcrumbs">
        <Link href="/catalog">
          <ArrowLeft aria-hidden="true" size={16} />
          Каталог
        </Link>
        <span>{category.label}</span>
      </div>

      <section className="product-hero">
        <ProductGallery media={product.media} />

        <div className="product-detail-copy">
          <p className="section-kicker">{category.cardTitle}</p>
          <p className="product-model">{brandName} · {product.model}</p>
          <h1>{product.title}</h1>
          <p className="product-lead">{product.summary}</p>

          <div className="product-detail-commercial">
            <div>
              <span>Стоимость и срок поставки</span>
              <strong>По запросу</strong>
            </div>
            <a className="button button-primary" href={quoteHref}>
              <Mail aria-hidden="true" size={18} />
              Запросить КП
            </a>
          </div>

          {product.highlights.length > 0 || product.gases.length > 0 ? (
            <dl className="product-key-facts">
              {product.gases.length > 0 ? (
                <div>
                  <dt>Контролируемые газы</dt>
                  <dd>
                    {product.gases
                      .map((id) => gasById.get(id)?.formula ?? id)
                      .join(", ")}
                  </dd>
                </div>
              ) : null}
              {product.highlights.slice(0, 5).map((item) => (
                <div key={`${item.label}-${item.value}`}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
      </section>

      {product.applications.length > 0 ? (
        <section className="product-content-section">
          <div className="product-section-heading">
            <p className="section-kicker">Применение</p>
            <h2>Для каких задач подходит</h2>
          </div>
          <ul className="product-application-list">
            {product.applications.map((application) => (
              <li key={application}>{application}</li>
            ))}
          </ul>
        </section>
      ) : null}

      {product.ranges.length > 0 || product.specifications.length > 0 ? (
        <section className="product-content-section product-specification-section">
          <div className="product-section-heading">
            <p className="section-kicker">Характеристики</p>
            <h2>Параметры модели</h2>
          </div>
          <div className="product-specification-groups">
            {product.ranges.length > 0 ? (
              <section className="product-specification-group">
                <h3>Диапазоны измерений</h3>
                <dl className="product-specification-list">
                  {product.ranges.map((range) => (
                    <div key={`${range.gasId}-${range.min}-${range.max}-${range.unit}`}>
                      <dt>{gasById.get(range.gasId)?.formula ?? range.gasId}</dt>
                      <dd>
                        {range.min}–{range.max} {range.unit}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}
            {[...specificationGroups.entries()].map(([group, specifications]) => (
              <section className="product-specification-group" key={group}>
                <h3>{group}</h3>
                <dl className="product-specification-list">
                  {specifications.map((item) => (
                    <div key={`${item.label}-${item.value}`}>
                      <dt>{item.label}</dt>
                      <dd>{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>
        </section>
      ) : null}

      {product.modifications.length > 0 ? (
        <section className="product-content-section">
          <div className="product-section-heading">
            <p className="section-kicker">Исполнения</p>
            <h2>Доступные модификации</h2>
          </div>
          <div className="product-modification-list">
            {product.modifications.map((item) => (
              <article key={item.id}>
                <h3>{item.name}</h3>
                {item.summary ? <p>{item.summary}</p> : null}
                {item.gases.length > 0 ? (
                  <p>
                    Газы: {item.gases.map((id) => gasById.get(id)?.formula ?? id).join(", ")}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {product.documents.length > 0 ? (
        <section className="product-content-section product-document-section">
          <div className="product-section-heading">
            <p className="section-kicker">Документация</p>
            <h2>Файлы по модели</h2>
          </div>
          <div className="product-document-list">
            {product.documents.map((document) => (
              <a href={document.url} target="_blank" rel="noreferrer" key={`${document.type}-${document.title}`}>
                <Download aria-hidden="true" size={18} />
                {document.title}
              </a>
            ))}
          </div>
        </section>
      ) : null}

      <section className="product-verification-note">
        <ShieldCheck aria-hidden="true" size={24} />
        <div>
          <strong>Характеристики сверены с источниками</strong>
          <p>Перед заказом уточняем исполнение, диапазон и комплект поставки в коммерческом предложении.</p>
        </div>
      </section>
    </div>
  );
}
