import { z } from "zod";

export const CategoryIdSchema = z.enum(["stationary", "portable", "sensors"]);

export const GasSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  formula: z.string().min(1),
  name: z.string().min(1),
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
  title: z.string().min(1),
  url: z.string().url().optional(),
  document: z.string().min(1).optional(),
  checkedAt: z.string().datetime(),
});

export const ProductSchema = z.object({
  schemaVersion: z.literal(1),
  id: z.string().uuid(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  status: z.enum(["draft", "published", "archived"]),
  category: CategoryIdSchema,
  brandId: z.string().min(1),
  model: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  commercialMode: z.literal("request_quote"),
  gases: z.array(z.string().min(1)),
  ranges: z.array(MeasurementRangeSchema),
  media: z.array(MediaSchema),
  documents: z.array(DocumentSchema),
  seo: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
  }),
  sources: z.array(SourceSchema).min(1),
  verifiedAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type Gas = z.infer<typeof GasSchema>;
export type Product = z.infer<typeof ProductSchema>;
