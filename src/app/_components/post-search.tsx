// src/app/_components/post-search.tsx
"use client";

import { api } from "@/trpc/react";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";

// Helper hook for debouncing a value
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

// Helper function to format the content snippet
const getPostSnippet = (content: string, length = 150) => {
    // Strip simple markdown characters like ** and * for the snippet
    const cleanText = content.replace(/(\*\*|__|\*|_|#)/g, '').trim();
    return cleanText.length > length
        ? cleanText.substring(0, length) + '...'
        : cleanText;
}


export function PostSearch() {
    const [searchQuery, setSearchQuery] = useState("");
    const debouncedSearchQuery = useDebounce(searchQuery, 500); // Debounce for 500ms

    // Use the new tRPC search procedure
    const { data: posts, isLoading, isFetching } = api.post.search.useQuery(
        { query: debouncedSearchQuery },
        {
            // FIX: Replaced deprecated 'keepPreviousData: true' with the correct TanStack Query v5 syntax.
            // This prevents the flickering issue by displaying the old results while fetching new ones.
            placeholderData: (previousData) => previousData,
        }
    );

    return (
        <div>
            {/* Search Input Field */}
            <div className="mb-8">
                <input
                    type="text"
                    placeholder="Search posts by title or content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                />
            </div>

            {/* Loading/Status Messages */}
            {(isLoading || isFetching) && posts === undefined && (
                <div className="text-center py-10 text-indigo-600 dark:text-indigo-400">Loading initial results...</div>
            )}

            {isFetching && posts !== undefined && (
                <div className="text-center py-2 text-indigo-600 dark:text-indigo-400">Searching...</div>
            )}

            {/* Post Grid (uses dark mode classes from previous fixes) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts?.map((post) => (
                    <Link
                        key={post.id}
                        href={`/post/${post.slug}`}
                        className="block border rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow bg-white dark:bg-gray-800 dark:border-gray-700"
                    >
                        <h2 className="text-2xl font-semibold text-blue-600 mb-2 truncate dark:text-indigo-400">
                            {post.title}
                        </h2>

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

                        <p className="text-gray-600 mb-4 text-sm line-clamp-3 dark:text-gray-300">
                            {getPostSnippet(post.content)}
                        </p>

                        <div className="text-sm text-gray-400 dark:text-gray-500">
                            {post.published ? 'Published' : 'Draft'} on {post.createdAt.toLocaleDateString()}
                        </div>
                    </Link>
                ))}
            </div>

            {/* No Results Message */}
            {!isLoading && !isFetching && posts?.length === 0 && (
                <div className="text-center text-gray-500 py-12 border-2 border-dashed rounded-lg dark:text-gray-400 dark:border-gray-700">
                    <p className="text-xl">No results found for "{searchQuery}".</p>
                </div>
            )}
        </div>
    );
}