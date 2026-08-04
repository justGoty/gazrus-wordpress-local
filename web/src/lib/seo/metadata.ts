import type { Metadata } from "next";
import { absoluteUrl, getSeoPageById, seoSite } from "@/lib/seo/content";

type MetadataOptions = {
  index?: boolean;
};

export function buildPageMetadata(pageId: string, options: MetadataOptions = {}): Metadata {
  const page = getSeoPageById(pageId);
  const defaultIndex = page.implementation === "implemented" && page.seoStatus === "ready" && page.indexing === "index";
  const index = options.index ?? defaultIndex;
  const fullTitle = `${page.title} | ${seoSite.siteName}`;
  const socialImage = page.socialImage ? absoluteUrl(page.socialImage) : undefined;

  return {
    title: page.path === "/" ? { absolute: fullTitle } : page.title,
    description: page.description,
    alternates: { canonical: page.canonical },
    robots: {
      index,
      follow: page.follow,
      googleBot: {
        index,
        follow: page.follow,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: seoSite.locale,
      siteName: seoSite.siteName,
      url: absoluteUrl(page.canonical),
      title: fullTitle,
      description: page.description,
      ...(socialImage ? { images: [{ url: socialImage }] } : {}),
    },
    twitter: {
      card: socialImage ? "summary_large_image" : "summary",
      title: fullTitle,
      description: page.description,
      ...(socialImage ? { images: [socialImage] } : {}),
    },
  };
}
