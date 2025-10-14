// src/server/api/zod-schemas.ts
import { z } from "zod";

// --- Category Schemas ---
export const createCategorySchema = z.object({
  // Requires at least one character for the name
  name: z.string().min(1, "Category name is required."),
});

// --- Post Schemas ---
// Base schema for validation that applies to both CREATE and UPDATE
export const postBaseSchema = z.object({
  // Use stronger, consistent validation rules
  title: z.string().min(3, "Title must be at least 3 characters."),
  content: z.string().min(10, "Content must be at least 10 characters."),

  // The API expects an array of numbers (category IDs), but it's optional.
  categoryIds: z.array(z.number()).optional(),
});

// Schema for creating a new post (extends base validation)
export const createPostSchema = postBaseSchema.extend({
  // published is defaulted to false if the frontend component (RHF) doesn't send it.
  // RHF resolves type issues because you defined the explicit `PostFormFields` interface
  // which ensures a boolean is sent, matching the expected form input.
  published: z.boolean().default(false),
});


// Schema for updating an existing post (extends base validation)
export const updatePostSchema = postBaseSchema.extend({
  id: z.number(), // The ID is required to know which post to update
  published: z.boolean().optional(), // Status can be optionally changed
});