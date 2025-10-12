// src/server/db/schema.ts
import { sql } from "drizzle-orm";
import {
	pgTable,
	serial,
	text,
	timestamp,
	boolean,
	uniqueIndex,
	primaryKey,
} from "drizzle-orm/pg-core";

// 1. Posts Table
export const posts = pgTable(
	"post",
	{
		id: serial("id").notNull(),
		title: text("title").notNull(),
		slug: text("slug").notNull(), // For SEO-friendly URLs
		content: text("content").notNull(),
		published: boolean("published").default(false).notNull(), // Draft vs Published
		createdAt: timestamp("created_at")
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp("updated_at"),
	},
	(table) => ({
		// Set 'id' as the primary key
		pk: primaryKey({ columns: [table.id] }),
		// Ensure slugs are unique for posts
		slugIdx: uniqueIndex("post_slug_idx").on(table.slug),
	}),
);

// 2. Categories Table
export const categories = pgTable(
	"category",
	{
		id: serial("id").notNull(),
		name: text("name").notNull(),
		slug: text("slug").notNull(), // Unique slug for category filtering
	},
	(table) => ({
		pk: primaryKey({ columns: [table.id] }),
		slugIdx: uniqueIndex("category_slug_idx").on(table.slug),
	}),
);

// 3. Posts to Categories Join Table (Many-to-Many)
export const postsToCategories = pgTable(
	"posts_to_categories",
	{
		postId: serial("post_id").references(() => posts.id),
		categoryId: serial("category_id").references(() => categories.id),
	},
	(t) => ({
		// A post can only be assigned to a category once
		pk: primaryKey({ columns: [t.postId, t.categoryId] }),
	}),
);