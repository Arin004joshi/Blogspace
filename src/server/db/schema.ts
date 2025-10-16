// src/server/db/schema.ts
import { relations, sql } from "drizzle-orm"; // <-- ADDED 'relations' IMPORT
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
		slug: text("slug").notNull(),
		content: text("content").notNull(),
		published: boolean("published").default(false).notNull(),
		createdAt: timestamp("created_at")
			.default(sql`CURRENT_TIMESTAMP`)
			.notNull(),
		updatedAt: timestamp("updated_at"),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.id] }),
		slugIdx: uniqueIndex("post_slug_idx").on(table.slug),
	}),
);

// 2. Categories Table
export const categories = pgTable(
	"category",
	{
		id: serial("id").notNull(),
		name: text("name").notNull(),
		slug: text("slug").notNull(),
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
		postId: serial("post_id").references(() => posts.id, { onDelete: 'cascade' }),
		categoryId: serial("category_id").references(() => categories.id, { onDelete: 'cascade' }),
	},
	(t) => ({
		pk: primaryKey({ columns: [t.postId, t.categoryId] }),
	}),
);

// --- 4. DRIZZLE RELATIONS (remain the same) ---

// Defines relationships for the 'posts' table
export const postsRelations = relations(posts, ({ many }) => ({
	// A Post can have many PostsToCategories links
	postsToCategories: many(postsToCategories),
}));

// Defines relationships for the 'categories' table
export const categoriesRelations = relations(categories, ({ many }) => ({
	// A Category can have many PostsToCategories links
	postsToCategories: many(postsToCategories),
}));

// Defines relationships for the 'postsToCategories' (Join Table)
export const postsToCategoriesRelations = relations(postsToCategories, ({ one }) => ({
	// Each link belongs to ONE post
	post: one(posts, {
		fields: [postsToCategories.postId],
		references: [posts.id],
	}),
	// Each link belongs to ONE category
	category: one(categories, {
		fields: [postsToCategories.categoryId],
		references: [categories.id],
	}),
}));