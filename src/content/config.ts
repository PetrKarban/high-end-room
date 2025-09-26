import { defineCollection, z } from "astro:content";

const products = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    brand: z.string(),
    category: z.enum(["obuv", "obleceni", "batohy", "doplnky"]),
    subcategory: z.string().optional(),             // ⬅ přidat
    sizes: z.array(z.string()).optional().default([]),
    condition: z.string().optional(),
    price: z.number().optional(),
    status: z.enum(["available", "sold"]).default("available"),
    images: z.array(z.string()).nonempty(),
    tags: z.array(z.string()).optional(),
    date: z.string().optional(),
  }),
});

export const collections = { products };
