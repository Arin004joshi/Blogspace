// src/server/api/root.ts
import { postRouter } from "./routers/post";
import { categoryRouter } from "./routers/category";
import { createTRPCRouter } from "./trpc";

/**
 * This is the primary router for your server.
 */
export const appRouter = createTRPCRouter({
	post: postRouter, // Register the post router
	category: categoryRouter, // Register the category router
});

// export type definition of API
export type AppRouter = typeof appRouter;