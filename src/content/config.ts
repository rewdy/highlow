import { defineCollection, z } from "astro:content";

const promptsCollection = defineCollection({
  type: "content",
  schema: z.object({
    tags: z.array(z.string()).optional(),
  }),
});

export const collections = {
  prompts: promptsCollection,
};
