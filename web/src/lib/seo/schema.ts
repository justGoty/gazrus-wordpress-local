import { z } from "zod";

const RelativePathSchema = z.string().regex(/^\/(?:[^?#]*[^/?#])?$/, "Используйте чистый путь без query и завершающего слеша");
const IntentSchema = z.enum(["commercial", "transactional", "informational", "navigation"]);
const IndexingSchema = z.enum(["index", "conditional", "noindex"]);
const SchemaTypeSchema = z.enum([
  "Article",
  "AggregateOffer",
  "Brand",
  "BreadcrumbList",
  "CollectionPage",
  "ItemList",
  "Offer",
  "OfferCatalog",
  "Organization",
  "Product",
  "Service",
  "WebApplication",
  "WebSite",
]);

export const SeoSiteSchema = z.object({
  schemaVersion: z.literal(1),
  siteId: z.string().regex(/^[a-z0-9-]+$/),
  siteName: z.string().min(1),
  origin: z.string().url().refine((value) => !value.endsWith("/"), "Origin не должен заканчиваться слешем"),
  language: z.string().min(2),
  locale: z.string().min(2),
  titleTemplate: z.string().includes("%s"),
  defaultTitle: z.string().min(20).max(100),
  defaultDescription: z.string().min(70).max(220),
  commercialMode: z.literal("request_quote"),
  publicPrices: z.literal(false),
  contactEmail: z.string().email(),
});

export const SeoPageSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  path: RelativePathSchema,
  canonical: RelativePathSchema,
  pageType: z.string().regex(/^[a-z0-9-]+$/),
  implementation: z.enum(["implemented", "planned"]),
  seoStatus: z.enum(["ready", "draft"]),
  indexing: IndexingSchema,
  follow: z.boolean(),
  sitemap: z.boolean(),
  changeFrequency: z.enum(["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"]),
  priority: z.number().min(0).max(1),
  title: z.string().min(15).max(100),
  description: z.string().min(70).max(220),
  h1: z.string().min(5).max(140),
  intent: IntentSchema,
  clusterIds: z.array(z.string().regex(/^[a-z0-9-]+$/)).min(1),
  schemaTypes: z.array(SchemaTypeSchema),
  requiredSections: z.array(z.string().min(2)).min(1),
  socialImage: RelativePathSchema.optional(),
  updatedAt: z.string().datetime(),
  indexConditions: z.array(z.string().min(3)).optional(),
  notes: z.array(z.string().min(3)),
});

export const SeoPagesFileSchema = z
  .object({
    schemaVersion: z.literal(1),
    pages: z.array(SeoPageSchema).min(1),
  })
  .superRefine(({ pages }, context) => {
    const ids = new Set<string>();
    const paths = new Set<string>();
    const titles = new Set<string>();
    const descriptions = new Set<string>();

    for (const [index, page] of pages.entries()) {
      if (ids.has(page.id)) {
        context.addIssue({ code: "custom", path: ["pages", index, "id"], message: `Повторяющийся SEO id: ${page.id}` });
      }
      if (paths.has(page.path)) {
        context.addIssue({ code: "custom", path: ["pages", index, "path"], message: `Повторяющийся SEO path: ${page.path}` });
      }
      if (titles.has(page.title)) {
        context.addIssue({ code: "custom", path: ["pages", index, "title"], message: `Повторяющийся SEO title: ${page.title}` });
      }
      if (descriptions.has(page.description)) {
        context.addIssue({ code: "custom", path: ["pages", index, "description"], message: "SEO description должен быть уникальным" });
      }
      if (page.canonical !== page.path) {
        context.addIssue({ code: "custom", path: ["pages", index, "canonical"], message: "Фиксированная SEO-страница должна иметь self-canonical" });
      }
      if (page.indexing === "conditional" && !page.indexConditions?.length) {
        context.addIssue({ code: "custom", path: ["pages", index, "indexConditions"], message: "Условной индексации нужны явные критерии" });
      }
      if (page.seoStatus === "ready" && page.implementation !== "implemented") {
        context.addIssue({ code: "custom", path: ["pages", index, "seoStatus"], message: "SEO-статус ready допустим только для реализованной страницы" });
      }
      if (page.indexing === "noindex" && page.sitemap) {
        context.addIssue({ code: "custom", path: ["pages", index, "sitemap"], message: "Noindex-страница не может входить в sitemap" });
      }
      ids.add(page.id);
      paths.add(page.path);
      titles.add(page.title);
      descriptions.add(page.description);
    }
  });

export const SeoTemplateSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  pageType: z.string().regex(/^[a-z0-9-]+$/),
  pathPattern: z.string().startsWith("/"),
  indexing: IndexingSchema,
  titleTemplate: z.string().min(3),
  descriptionTemplate: z.string().min(10),
  h1Template: z.string().min(3),
  intent: IntentSchema,
  clusterIds: z.array(z.string().regex(/^[a-z0-9-]+$/)),
  schemaTypes: z.array(SchemaTypeSchema),
  forbiddenSchemaTypes: z.array(SchemaTypeSchema),
  requiredData: z.array(z.string().min(2)).min(1),
  requiredSections: z.array(z.string().min(2)).min(1),
  canonicalRule: z.string().min(10),
  sitemapRule: z.string().min(10),
  indexConditions: z.array(z.string().min(3)),
  notes: z.array(z.string().min(3)),
});

export const SeoTemplatesFileSchema = z
  .object({
    schemaVersion: z.literal(1),
    templates: z.array(SeoTemplateSchema).min(1),
  })
  .superRefine(({ templates }, context) => {
    const ids = new Set<string>();
    for (const [index, template] of templates.entries()) {
      if (ids.has(template.id)) {
        context.addIssue({ code: "custom", path: ["templates", index, "id"], message: `Повторяющийся SEO template id: ${template.id}` });
      }
      ids.add(template.id);
    }
  });

const DemandValidationSchema = z.object({
  status: z.enum(["not_validated", "validated"]),
  source: z.string().url().nullable(),
  checkedAt: z.string().datetime().nullable(),
});

export const SemanticClusterSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(3),
  intent: IntentSchema,
  priority: z.enum(["P0", "P1", "P2"]),
  targetPageIds: z.array(z.string().regex(/^[a-z0-9-]+$/)),
  targetPageTypes: z.array(z.string().regex(/^[a-z0-9-]+$/)).min(1),
  primaryQueries: z.array(z.string().min(3)).min(1),
  supportingQueries: z.array(z.string().min(3)),
  modifiers: z.array(z.string().min(1)),
  variablePatterns: z.array(z.string().min(3)),
  demandValidation: DemandValidationSchema,
  notes: z.array(z.string().min(3)),
});

export const SemanticCoreFileSchema = z
  .object({
    schemaVersion: z.literal(1),
    status: z.enum(["draft", "validated"]),
    frequencySource: z.string().url().nullable(),
    validatedAt: z.string().datetime().nullable(),
    clusters: z.array(SemanticClusterSchema).min(1),
  })
  .superRefine(({ clusters }, context) => {
    const ids = new Set<string>();
    for (const [index, cluster] of clusters.entries()) {
      if (ids.has(cluster.id)) {
        context.addIssue({ code: "custom", path: ["clusters", index, "id"], message: `Повторяющийся semantic cluster id: ${cluster.id}` });
      }
      ids.add(cluster.id);
    }
  });

export type SeoSite = z.infer<typeof SeoSiteSchema>;
export type SeoPage = z.infer<typeof SeoPageSchema>;
export type SeoTemplate = z.infer<typeof SeoTemplateSchema>;
export type SemanticCluster = z.infer<typeof SemanticClusterSchema>;
