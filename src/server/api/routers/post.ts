import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "../trpc";
import { categories, posts, postsToCategories } from "@/server/db/schema";
import { createPostSchema, updatePostSchema } from "../zod-schemas";
import { db } from "@/server/db";
import { and, eq, inArray, sql } from "drizzle-orm";
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
			const slug = slugify(input.title, { lower: true, strict: true });

			return await db.transaction(async (tx) => {
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

				await tx
					.delete(postsToCategories)
					.where(eq(postsToCategories.postId, input.id));

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
			const deletedPost = await db
				.delete(posts)
				.where(eq(posts.id, input.id))
				.returning({ id: posts.id });
			return deletedPost[0];
		}),

	search: publicProcedure
		.input(z.object({
			query: z.string().optional(),
		}))
		.query(async ({ input }) => {
			if (!input.query || input.query.trim() === "") {
				return db.query.posts.findMany({
					where: (post, { eq }) => eq(post.published, true),
					with: {
						postsToCategories: {
							with: {
								category: true,
							},
						},
					},
					orderBy: (posts, { desc }) => [desc(posts.createdAt)],
				});
			}

			const trimmedQuery = input.query.trim();
			const searchPattern = `%${trimmedQuery}%`;

			return db.query.posts.findMany({
				where: (post, { eq, and }) =>
					and(
						eq(post.published, true), 
						sql`
                            TRIM(${post.title}) ILIKE ${searchPattern}
                        `,
					),
				with: {
					postsToCategories: {
						with: {
							category: true,
						},
					},
				},
				orderBy: (posts, { desc }) => [desc(posts.createdAt)],
			});
		}),
});	