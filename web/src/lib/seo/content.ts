import pagesData from "../../../content/seo/pages.json";
import semanticCoreData from "../../../content/seo/semantic-core.json";
import siteData from "../../../content/seo/site.json";
import templatesData from "../../../content/seo/templates.json";
import {
  SemanticCoreFileSchema,
  SeoPagesFileSchema,
  SeoSiteSchema,
  SeoTemplatesFileSchema,
  type SeoPage,
} from "@/lib/seo/schema";

export const seoSite = SeoSiteSchema.parse(siteData);
export const seoPages = SeoPagesFileSchema.parse(pagesData).pages;
export const seoTemplates = SeoTemplatesFileSchema.parse(templatesData).templates;
export const semanticCore = SemanticCoreFileSchema.parse(semanticCoreData);

const pageById = new Map(seoPages.map((page) => [page.id, page]));
const pageByPath = new Map(seoPages.map((page) => [page.path, page]));
const clusterIds = new Set(semanticCore.clusters.map((cluster) => cluster.id));

for (const page of seoPages) {
  assertKnownClusters(`page ${page.id}`, page.clusterIds);
}

for (const template of seoTemplates) {
  assertKnownClusters(`template ${template.id}`, template.clusterIds);
}

function assertKnownClusters(owner: string, ids: string[]) {
  const unknown = ids.filter((id) => !clusterIds.has(id));
  if (unknown.length > 0) {
    throw new Error(`Unknown semantic clusters in ${owner}: ${unknown.join(", ")}`);
  }
}

export function getSeoPageById(id: string): SeoPage {
  const page = pageById.get(id);
  if (!page) {
    throw new Error(`SEO page is not defined: ${id}`);
  }
  return page;
}

export function getSeoPageByPath(path: string): SeoPage | undefined {
  return pageByPath.get(path);
}

export function absoluteUrl(path: string): string {
  return new URL(path, `${seoSite.origin}/`).toString();
}

export function isSeoPageIndexable(page: SeoPage): boolean {
  return page.implementation === "implemented" && page.seoStatus === "ready" && page.indexing === "index";
}
