import { HydrateClient } from "@/trpc/server";
import { PostSearch } from "@/app/_components/post-search";

export default function BlogListingPage() {
    return (
        <HydrateClient>
            <main className="container mx-auto p-8 max-w-6xl">
                <h1 className="text-5xl font-extrabold text-gray-900 mb-10 dark:text-gray-50">
                    The Blog Platform
                </h1>

                <PostSearch />

            </main>
        </HydrateClient>
    );
}