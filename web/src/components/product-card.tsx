import { ArrowRight, ImageIcon, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { categoryById } from "@/data/categories";
import { formatBrandId } from "@/lib/catalog/display";
import type { Brand, Gas, Product } from "@/lib/catalog/schema";

type ProductCardProps = {
  product: Product;
  gases: Gas[];
  brands: Brand[];
};

export function ProductCard({ product, gases, brands }: ProductCardProps) {
  const category = categoryById[product.category];
  const image = product.media.find((item) => item.type === "image");
  const brandName = brands.find((brand) => brand.id === product.brandId)?.name ?? formatBrandId(product.brandId);
  const gasLabels = product.gases
    .map((gasId) => gases.find((gas) => gas.id === gasId)?.formula)
    .filter((formula): formula is string => Boolean(formula));
  const gasSummary = gasLabels.length > 6 ? `${gasLabels.slice(0, 6).join(", ")} и другие` : gasLabels.join(", ");
  const detailsHref = `/catalog/${product.category}/${product.slug}`;
  const quoteHref = `mailto:info@prscom.ru?subject=${encodeURIComponent(`Запрос КП: ${product.title}`)}`;

  return (
    <article className="product-card">
      <div className="product-card-media">
        {image ? (
          <div className="product-card-image">
            <Image
              alt={image.alt}
              fill
              sizes="(max-width: 760px) calc(100vw - 48px), (max-width: 1180px) 50vw, 390px"
              src={image.url}
            />
          </div>
        ) : (
          <div className="product-card-placeholder" aria-label="Изображение товара не добавлено">
            <ImageIcon aria-hidden="true" size={30} />
          </div>
        )}
      </div>

      <div className="product-card-body">
        <p className="product-card-overline">
          {brandName} · {product.model}
        </p>
        <h2>{product.title}</h2>
        <p className="product-card-summary">{product.summary}</p>

        <dl className="product-card-facts">
          {gasLabels.length > 0 ? (
            <div>
              <dt>Контролируемые газы</dt>
              <dd>{gasSummary}</dd>
            </div>
          ) : null}
          {product.highlights.slice(0, 3).map((item) => (
            <div key={`${item.label}-${item.value}`}>
              <dt>{item.label}</dt>
              <dd>{item.value}</dd>
            </div>
          ))}
        </dl>

        <div className="product-card-commercial">
          <span>Стоимость</span>
          <strong>По запросу</strong>
        </div>

        <div className="product-card-actions">
          <Link className="product-details-link" href={detailsHref}>
            Подробнее
            <ArrowRight aria-hidden="true" size={17} />
          </Link>
          <a className="button button-primary product-quote-button" href={quoteHref}>
            <Mail aria-hidden="true" size={17} />
            Запросить КП
          </a>
        </div>
      </div>
      <span className={`product-card-accent product-card-accent-${category.accent}`} aria-hidden="true" />
    </article>
  );
}
