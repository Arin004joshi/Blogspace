// src/app/blog/page.tsx
import { HydrateClient } from "@/trpc/server";
// Corrected to use alias import path for the component location
import { PostSearch } from "@/app/_components/post-search";

// The static fetch logic (api.post.getAll) is removed because PostSearch handles the fetch.
// The component no longer needs to be 'async'.

export default function BlogListingPage() {
    return (
        <HydrateClient>
            <main className="container mx-auto p-8 max-w-6xl">
                <h1 className="text-5xl font-extrabold text-gray-900 mb-10 dark:text-gray-50">
                    The Blog Platform
                </h1>

                {/* REPLACED the static post list with the dynamic search component */}
                <PostSearch />

            </main>
        </HydrateClient>
    );
}