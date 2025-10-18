import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "../trpc";
import { categories } from "@/server/db/schema";
import { createCategorySchema } from "../zod-schemas";
import { db } from "@/server/db";
import slugify from "slugify";
import { eq } from "drizzle-orm";



export const categoryRouter = createTRPCRouter({
    // C: CREATE
    create: publicProcedure
        .input(createCategorySchema)
        .mutation(async ({ input }) => {
            const slug = slugify(input.name, { lower: true, strict: true });
            const newCategory = await db
                .insert(categories)
                .values({
                    name: input.name,
                    slug: slug,
                })
                .returning();
            return newCategory[0];
        }),

    // R: READ ALL
    getAll: publicProcedure.query(async () => {
        // Select all categories
        return db.select().from(categories);
    }),

    // R: READ BY ID
    getById: publicProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ input }) => {
            // Find one category by ID
            return db.query.categories.findFirst({
                where: (category, { eq }) => eq(category.id, input.id),
            });
        }),

    // D: DELETE
    delete: publicProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ input }) => {
            // Delete a category by ID
            const deletedCategory = await db
                .delete(categories)
                .where(eq(categories.id, input.id))
                .returning({ id: categories.id });
            return deletedCategory[0];
        }),
});