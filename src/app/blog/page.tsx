// src/app/page.tsx
import Link from "next/link";
import { api } from "@/trpc/server"; // Server-side tRPC utility
import { HydrateClient } from "@/trpc/server";
import parse from "html-react-parser"; // Need to install: npm install html-react-parser
import type { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

// Helper function to format the content snippet
const getPostSnippet = (content: string, length = 150) => {
    // Strip simple markdown characters like ** and * for the snippet
    const cleanText = content.replace(/(\*\*|__|\*|_|#)/g, '').trim();
    return cleanText.length > length
        ? cleanText.substring(0, length) + '...'
        : cleanText;
}

export default async function BlogListingPage() {
    // 1. Fetch all posts directly on the server (RSC)
    // This call is type-safe thanks to tRPC!
    const allPosts = await api.post.getAll();

    // The HydrateClient is needed here because the Posts list uses it
    // and we're fetching data on the server.
    return (
        <HydrateClient>
            <main className="container mx-auto p-8 max-w-6xl">
                <h1 className="text-5xl font-extrabold text-gray-900 mb-10">
                    The Blog Platform
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {allPosts.map((post: { id: Key | null | undefined; slug: any; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; postsToCategories: { category: any; }[]; content: string; published: any; createdAt: { toLocaleDateString: () => string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }; }) => (
                        <Link
                            key={post.id}
                            href={`/post/${post.slug}`} // Link to the individual post page
                            className="block border rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow bg-white"
                        >
                            <h2 className="text-2xl font-semibold text-blue-600 mb-2 truncate">
                                {post.title}
                            </h2>

                            {/* Display Categories */}
                            <div className="flex flex-wrap gap-2 mb-3">
                                {post.postsToCategories.map(({ category }) => (
                                    <span
                                        key={category.id}
                                        className="text-xs bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full font-medium"
                                    >
                                        {category.name}
                                    </span>
                                ))}
                            </div>

                            {/* Content Snippet */}
                            <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                                {getPostSnippet(post.content)}
                            </p>

                            <div className="text-sm text-gray-400">
                                {post.published ? 'Published' : 'Draft'} on {post.createdAt.toLocaleDateString()}
                            </div>
                        </Link>
                    ))}
                </div>

                {allPosts.length === 0 && (
                    <div className="text-center text-gray-500 py-12">
                        No posts found. Time to create one!
                    </div>
                )}
            </main>
        </HydrateClient>
    );
}