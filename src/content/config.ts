import { defineCollection, z } from "astro:content";

const products = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    brand: z.string(),
    size: z.string().optional(),
    condition: z.string().optional(),
    price: z.number().optional(),
    status: z.enum(["available", "sold"]).default("available"),
    images: z.array(z.string()).nonempty(), // cesty z /products/...
    tags: z.array(z.string()).optional(),
    date: z.string().optional(), // ISO "YYYY-MM-DD"
  }),
});

export const collections = { products };
