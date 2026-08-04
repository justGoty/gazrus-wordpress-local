import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import { SiteHeader } from "@/components/site-header";
import { formatBrandId } from "@/lib/catalog/display";
import { loadGases, loadProductBySlug } from "@/lib/catalog/load-catalog";

type ProductPageProps = {
  params: Promise<{ category: string; slug: string }>;
};

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const product = await loadProductBySlug(category, slug);

  if (!product) {
    return { title: "Товар не найден" };
  }

  return {
    title: product.seo.title,
    description: product.seo.description,
    alternates: { canonical: `/catalog/${product.category}/${product.slug}` },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { category, slug } = await params;
  const [product, gases] = await Promise.all([loadProductBySlug(category, slug), loadGases()]);

  if (!product) {
    notFound();
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    model: product.model,
    brand: { "@type": "Brand", name: formatBrandId(product.brandId) },
    description: product.summary,
    image: product.media.filter((item) => item.type === "image").map((item) => item.url),
  };

  return (
    <>
      <SiteHeader />
      <main>
        <ProductDetail product={product} gases={gases} />
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
