import { z } from "zod";

export const CategoryIdSchema = z.enum(["stationary", "portable", "sensors"]);

export const GasSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "Некорректный ID газа"),
  formula: z.string().min(1, "Укажите формулу газа"),
  name: z.string().min(1, "Укажите название газа"),
});

export const BrandSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/, "Некорректный ID производителя"),
  name: z.string().min(1, "Укажите название производителя"),
});

const MeasurementRangeSchema = z
  .object({
    gasId: z.string().min(1),
    min: z.number(),
    max: z.number(),
    unit: z.enum(["ppm", "% об.", "% НКПР", "мг/м³"]),
    resolution: z.number().positive().optional(),
    conditions: z.string().min(1).optional(),
  })
  .refine((range) => range.min < range.max, {
    message: "Минимум диапазона должен быть меньше максимума",
  });

const MediaSchema = z.object({
  type: z.enum(["image", "diagram"]),
  url: z.string().min(1),
  alt: z.string().min(1),
});

const DocumentSchema = z.object({
  type: z.enum(["passport", "manual", "certificate", "verification", "other"]),
  title: z.string().min(1),
  url: z.string().min(1),
});

const SourceSchema = z.object({
  title: z.string().min(1, "Укажите название источника"),
  url: z.string().url("Укажите корректную ссылку на источник").optional(),
  document: z.string().min(1).optional(),
  checkedAt: z.string().datetime(),
});

const HighlightSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

const SpecificationSchema = z.object({
  group: z.string().min(1).optional(),
  label: z.string().min(1),
  value: z.string().min(1),
});

const ModificationSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  summary: z.string().min(1).optional(),
  gases: z.array(z.string().min(1)).default([]),
});

const WorkingPrincipleSchema = z.object({
  summary: z.string().min(1),
  stages: z
    .array(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
      }),
    )
    .min(2)
    .max(4),
  note: z.string().min(1).optional(),
});

export const ProductSchema = z
  .object({
    schemaVersion: z.literal(1),
    id: z.string().uuid("Некорректный идентификатор товара"),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Используйте латиницу, цифры и дефисы"),
    status: z.enum(["draft", "published", "archived"]),
    category: CategoryIdSchema,
    brandId: z.string().min(1, "Укажите производителя"),
    model: z.string().min(1, "Укажите модель"),
    title: z.string().min(1, "Укажите название товара"),
    summary: z.string().min(1, "Добавьте краткое описание"),
    commercialMode: z.literal("request_quote"),
    gases: z.array(z.string().min(1)).min(1, "Выберите хотя бы один газ").default([]),
    ranges: z.array(MeasurementRangeSchema).default([]),
    media: z.array(MediaSchema).default([]),
    highlights: z.array(HighlightSchema).max(6).default([]),
    specifications: z.array(SpecificationSchema).default([]),
    applications: z.array(z.string().min(1)).default([]),
    workingPrinciple: WorkingPrincipleSchema.optional(),
    modifications: z.array(ModificationSchema).default([]),
    documents: z.array(DocumentSchema).default([]),
    seo: z.object({
      title: z.string().min(1, "Добавьте SEO-заголовок"),
      description: z.string().min(1, "Добавьте SEO-описание"),
    }),
    sources: z.array(SourceSchema).min(1, "Добавьте проверенный источник"),
    verifiedAt: z.string().datetime().optional(),
    updatedAt: z.string().datetime(),
  })
  .superRefine((product, context) => {
    if (product.status !== "published") {
      return;
    }

    if (!product.verifiedAt) {
      context.addIssue({
        code: "custom",
        path: ["verifiedAt"],
        message: "Для публикации нужна дата проверки",
      });
    }

    if (!product.media.some((item) => item.type === "image")) {
      context.addIssue({
        code: "custom",
        path: ["media"],
        message: "Для публикации нужно проверенное изображение товара",
      });
    }
  });

export type Gas = z.infer<typeof GasSchema>;
export type Brand = z.infer<typeof BrandSchema>;
export type Product = z.infer<typeof ProductSchema>;
