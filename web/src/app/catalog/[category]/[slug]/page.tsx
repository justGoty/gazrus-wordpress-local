import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/product-detail";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { categoryById } from "@/data/categories";
import { formatBrandId } from "@/lib/catalog/display";
import { loadBrands, loadGases, loadProductBySlug } from "@/lib/catalog/load-catalog";
import { absoluteUrl, seoSite } from "@/lib/seo/content";

type ProductPageProps = {
  params: Promise<{ category: string; slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params, searchParams }: ProductPageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const parameters = await searchParams;
  const product = await loadProductBySlug(category, slug);

  if (!product) {
    return { title: "Товар не найден", robots: { index: false, follow: false } };
  }

  const canonical = `/catalog/${product.category}/${product.slug}`;
  const mainImage = product.media.find((item) => item.type === "image")?.url;
  const fullTitle = `${product.seo.title} | ${seoSite.siteName}`;
  const index = Object.keys(parameters).length === 0;

  return {
    title: product.seo.title,
    description: product.seo.description,
    alternates: { canonical },
    robots: {
      index,
      follow: true,
      googleBot: {
        index,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: seoSite.locale,
      siteName: seoSite.siteName,
      url: absoluteUrl(canonical),
      title: fullTitle,
      description: product.seo.description,
      ...(mainImage ? { images: [{ url: absoluteUrl(mainImage) }] } : {}),
    },
    twitter: {
      card: mainImage ? "summary_large_image" : "summary",
      title: fullTitle,
      description: product.seo.description,
      ...(mainImage ? { images: [absoluteUrl(mainImage)] } : {}),
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { category, slug } = await params;
  const [product, gases, brands] = await Promise.all([
    loadProductBySlug(category, slug),
    loadGases(),
    loadBrands(),
  ]);

  if (!product) {
    notFound();
  }

  const brandName = brands.find((brand) => brand.id === product.brandId)?.name ?? formatBrandId(product.brandId);
  const categoryName = categoryById[product.category].cardTitle;
  const canonical = `/catalog/${product.category}/${product.slug}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `${absoluteUrl(canonical)}#product`,
        name: product.title,
        model: product.model,
        category: categoryName,
        brand: { "@type": "Brand", name: brandName },
        description: product.summary,
        image: product.media
          .filter((item) => item.type === "image")
          .map((item) => absoluteUrl(item.url)),
        additionalProperty: product.highlights.map((item) => ({
          "@type": "PropertyValue",
          name: item.label,
          value: item.value,
        })),
        url: absoluteUrl(canonical),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Главная", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Каталог", item: absoluteUrl("/catalog") },
          {
            "@type": "ListItem",
            position: 3,
            name: categoryName,
            item: absoluteUrl(`/catalog/${product.category}`),
          },
          { "@type": "ListItem", position: 4, name: product.title, item: absoluteUrl(canonical) },
        ],
      },
    ],
  };

  return (
    <>
      <SiteHeader />
      <main>
        <ProductDetail product={product} gases={gases} brands={brands} />
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />
      <SiteFooter />
    </>
  );
}
