// src/server/api/routers/post.ts
import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "../trpc";
import { categories, posts, postsToCategories } from "@/server/db/schema";
import { createPostSchema, updatePostSchema } from "../zod-schemas";
import { db } from "@/server/db";
import { and, eq, inArray } from "drizzle-orm";
import slugify from "slugify";

export const postRouter = createTRPCRouter({

	hello: publicProcedure
		.input(z.object({ name: z.string().optional() }).optional())
		.query(({ input }) => {
			return { message: `Hello ${input?.name ?? "World"}!` };
		}),

	// C: CREATE
	create: publicProcedure
		.input(createPostSchema)
		.mutation(async ({ input }) => {
			// Generate the slug from the title
			const slug = slugify(input.title, { lower: true, strict: true });

			// Run the create and linking in a transaction for atomicity
			return await db.transaction(async (tx) => {
				// 1. Insert the Post
				const newPost = await tx
					.insert(posts)
					.values({
						title: input.title,
						content: input.content,
						slug: slug,
						published: input.published,
					})
					.returning({ id: posts.id });

				const postId = newPost[0]?.id;

				if (!postId) {
					tx.rollback();
					throw new Error("Failed to create post.");
				}

				// 2. Link Categories (if any)
				if (input.categoryIds && input.categoryIds.length > 0) {
					const links = input.categoryIds.map((categoryId) => ({
						postId: postId,
						categoryId: categoryId,
					}));
					await tx.insert(postsToCategories).values(links);
				}

				return postId;
			});
		}),

	// R: READ ALL (with categories included)
	getAll: publicProcedure.query(async () => {
		return db.query.posts.findMany({
			// This 'with' clause requires Drizzle relations to be defined!
			with: {
				postsToCategories: {
					with: {
						category: true,
					},
				},
			},
		});
	}),

	// R: READ ONE BY SLUG
	getBySlug: publicProcedure
		.input(z.object({ slug: z.string() }))
		.query(async ({ input }) => {
			// Find one post by slug
			return db.query.posts.findFirst({
				where: (post, { eq }) => eq(post.slug, input.slug),
				with: {
					postsToCategories: {
						with: {
							category: true,
						},
					},
				},
			});
		}),

	// U: UPDATE
	update: publicProcedure
		.input(updatePostSchema)
		.mutation(async ({ input }) => {
			return await db.transaction(async (tx) => {
				// 1. Update the Post's main fields
				const updatedPost = await tx
					.update(posts)
					.set({
						title: input.title,
						content: input.content,
						published: input.published,
						updatedAt: new Date(),
					})
					.where(eq(posts.id, input.id))
					.returning();

				// 2. Clear existing category links
				await tx
					.delete(postsToCategories)
					.where(eq(postsToCategories.postId, input.id));

				// 3. Insert new category links
				if (input.categoryIds && input.categoryIds.length > 0) {
					const links = input.categoryIds.map((categoryId) => ({
						postId: input.id,
						categoryId: categoryId,
					}));
					await tx.insert(postsToCategories).values(links);
				}

				return updatedPost[0];
			});
		}),

	// D: DELETE
	delete: publicProcedure
		.input(z.object({ id: z.number() }))
		.mutation(async ({ input }) => {
			// Deleting the post will automatically cascade/cleanup the join table entries
			const deletedPost = await db
				.delete(posts)
				.where(eq(posts.id, input.id))
				.returning({ id: posts.id });
			return deletedPost[0];
		}),
});