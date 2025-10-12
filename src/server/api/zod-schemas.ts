// src/server/api/zod-schemas.ts
import { z } from "zod";

// --- Category Schemas ---
export const createCategorySchema = z.object({
  name: z.string().min(1, "Category name is required."),
  // The slug will be generated on the backend
});

// --- Post Schemas ---
// Base schema for creating and updating a post
export const postBaseSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters."),
  content: z.string().min(10, "Content must be at least 10 characters."),
  // Array of category IDs to link the post to
  categoryIds: z.array(z.number()).default([]).optional(),
});

// Schema for creating a new post
export const createPostSchema = postBaseSchema.extend({
  published: z.boolean().default(false),
});

// Schema for updating an existing post
export const updatePostSchema = postBaseSchema.extend({
  id: z.number(), // Need the ID to identify the post
  published: z.boolean().optional(),
});