"use client";

import Link from "next/link";
import { api } from "@/trpc/react";
const PencilIcon = (props: { className: string }) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 18.07a4.5 4.5 0 01-1.897 1.13L6 20l1.128-3.372a4.5 4.5 0 011.13-1.897l8.283-8.283z" /><path strokeLinecap="round" strokeLinejoin="round" d="M10.582 18.07L16.863 11.79" /></svg>;
const TrashIcon = (props: { className: string }) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.425 4.75a.5.5 0 00-.5-.5H6.075a.5.5 0 00-.5.5L5.05 6.002m14.28 0a.75.75 0 00-.01-.15C18.17 6.326 15.86 6.5 12 6.5s-6.17-2.324-6.397-2.75A.75.75 0 005.42 6.002m14.28 0a.75.75 0 01-1.022.166L14.74 9m-4.788 0l-4.788 9m-1.022.166A1.5 1.5 0 014.25 18v2.25c0 .414.336.75.75.75h13.5a.75.75 0 00.75-.75V18a1.5 1.5 0 01-.447-1.066L14.74 9" /></svg>;
const EyeIcon = (props: { className: string }) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.32c.3.568.8.848 1.4.848h18.128c.6 0 1.1-.28 1.4-.848a3.15 3.15 0 000-2.64c-.3-.568-.8-.848-1.4-.848H3.436c-.6 0-1.1.28-1.4.848a3.15 3.15 0 000 2.64z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 9a3 3 0 100 6 3 3 0 000-6z" /></svg>;

export default function DashboardPage() {
    const { data: posts = [], isLoading, isError, error } = api.post.getAll.useQuery();
    const utils = api.useUtils();

    const deletePost = api.post.delete.useMutation({
        onSuccess: async () => {
            await utils.post.getAll.invalidate(); 
        },
        onError: (err) => {
            console.error(err);
            alert(`Error deleting post: ${err.message}`);
        },
    });

    const handleDelete = (id: number, title: string) => {
        if (confirm(`Are you sure you want to delete the post: "${title}"?`)) {
            deletePost.mutate({ id });
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto p-8 max-w-6xl text-center">
                <h1 className="text-4xl font-bold mb-8 dark:text-gray-50">Post Dashboard</h1>
                <div className="flex justify-center items-center h-40">
                    <p className="text-lg text-indigo-600">Loading posts...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="container mx-auto p-8 max-w-6xl text-center">
                <h1 className="text-4xl font-bold mb-8 text-red-600">Error</h1>
                <p className="text-lg text-red-500">Failed to load posts: {error.message}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 sm:p-8 max-w-6xl">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-50">Post Dashboard</h1>
                <Link href="/admin/post/new" className="bg-indigo-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm sm:text-base">
                    + New Post
                </Link>
            </div>

            {posts.length === 0 ? (
                <div className="text-center text-gray-500 py-12 border-2 border-dashed rounded-lg dark:text-gray-400 dark:border-gray-700">
                    <p className="text-xl mb-4">No posts found.</p>
                    <Link href="/admin/post/new" className="text-indigo-600 hover:text-indigo-800 font-medium dark:text-indigo-400 dark:hover:text-indigo-300">
                        Click here to create your first post!
                    </Link>
                </div>
            ) : (
                <div className="shadow-xl rounded-lg overflow-x-auto dark:bg-gray-800 dark:shadow-2xl">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px] dark:text-gray-300">Title</th>
                                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell dark:text-gray-300">Categories</th>
                                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">Status</th>
                                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px] dark:text-gray-300">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                            {posts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-xs dark:text-gray-100">
                                        {post.title}
                                    </td>
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell dark:text-gray-300">
                                        <div className="flex flex-wrap gap-1">
                                            {post.postsToCategories.map(({ category }) => (
                                                <span key={category.id} className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full dark:bg-indigo-900 dark:text-indigo-200">
                                                    {category.name}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${post.published ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                            }`}>
                                            {post.published ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-3">
                                            {/* View Post link */}
                                            {post.published && (
                                                <Link
                                                    href={`/post/${post.slug}`}
                                                    target="_blank"
                                                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                    title="View Published Post"
                                                >
                                                    <EyeIcon className="h-5 w-5" />
                                                </Link>
                                            )}

                                            {/* Edit Post link */}
                                            <Link
                                                href={`/admin/post/edit/${post.slug}`}
                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                title="Edit Post"
                                            >
                                                <PencilIcon className="h-5 w-5" />
                                            </Link>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => handleDelete(post.id, post.title)}
                                                disabled={deletePost.isPending}
                                                className="text-red-600 hover:text-red-900 disabled:opacity-50 dark:text-red-400 dark:hover:text-red-300"
                                                title="Delete Post"
                                            >
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}