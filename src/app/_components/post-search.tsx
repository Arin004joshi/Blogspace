"use client";

import { api } from "@/trpc/react";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";

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

const getPostSnippet = (content: string, length = 150) => {
    const cleanText = content.replace(/(\*\*|__|\*|_|#)/g, '').trim();
    return cleanText.length > length
        ? cleanText.substring(0, length) + '...'
        : cleanText;
}


export function PostSearch() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>(undefined);

    const debouncedSearchQuery = useDebounce(searchQuery, 500); 

    const { data: categories = [] } = api.category.getAll.useQuery(undefined, {
        staleTime: Infinity,
    });

    const { data: posts, isLoading, isFetching } = api.post.search.useQuery(
        {
            query: debouncedSearchQuery,
            categoryId: selectedCategoryId, // Pass the category ID
        },
        {
            placeholderData: (previousData) => previousData,
        }
    );

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setSelectedCategoryId(value ? Number(value) : undefined);
    }

    return (
        <div>
            {/* The filter UI is here, in the same row as the search input */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {/* Search Input Field */}
                <input
                    type="text"
                    placeholder="Search posts by title or content..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-grow p-3 border border-gray-300 rounded-lg shadow-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                />

                {/* CATEGORY FILTER DROPDOWN */}
                <select
                    onChange={handleCategoryChange}
                    value={selectedCategoryId ?? ''} // Use empty string for unselected state
                    className="p-3 border border-gray-300 rounded-lg shadow-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Loading/Status Messages */}
            {(isLoading || isFetching) && posts === undefined && (
                <div className="text-center py-10 text-indigo-600 dark:text-indigo-400">Loading initial results...</div>
            )}

            {isFetching && posts !== undefined && (
                <div className="text-center py-2 text-indigo-600 dark:text-indigo-400">Searching...</div>
            )}

            {/* Post Grid (omitted for brevity) */}
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