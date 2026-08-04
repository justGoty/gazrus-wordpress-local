import { ArrowLeft, Download, ImageIcon, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { categoryById } from "@/data/categories";
import { formatBrandId } from "@/lib/catalog/display";
import type { Gas, Product } from "@/lib/catalog/schema";

type ProductDetailProps = {
  product: Product;
  gases: Gas[];
};

export function ProductDetail({ product, gases }: ProductDetailProps) {
  const category = categoryById[product.category];
  const image = product.media.find((item) => item.type === "image");
  const gasById = new Map(gases.map((gas) => [gas.id, gas]));
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
        <div className="product-detail-media">
          {image ? (
            <div
              className="product-detail-image"
              role="img"
              aria-label={image.alt}
              style={{ backgroundImage: `url(${JSON.stringify(image.url)})` }}
            />
          ) : (
            <div className="product-detail-placeholder" aria-label="Изображение товара отсутствует">
              <ImageIcon aria-hidden="true" size={42} />
            </div>
          )}
        </div>

        <div className="product-detail-copy">
          <p className="section-kicker">{category.cardTitle}</p>
          <p className="product-model">{formatBrandId(product.brandId)} · {product.model}</p>
          <h1>{product.title}</h1>
          <p className="product-lead">{product.summary}</p>

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
          <dl className="product-specification-list">
            {product.ranges.map((range) => (
              <div key={`${range.gasId}-${range.min}-${range.max}-${range.unit}`}>
                <dt>Диапазон {gasById.get(range.gasId)?.formula ?? range.gasId}</dt>
                <dd>
                  {range.min}–{range.max} {range.unit}
                </dd>
              </div>
            ))}
            {product.specifications.map((item) => (
              <div key={`${item.group ?? "main"}-${item.label}-${item.value}`}>
                <dt>{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
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
              <a href={document.url} key={`${document.type}-${document.title}`}>
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
