// src/app/_components/edit-post-form.tsx
"use client";

import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";

// --- Form and Mutation Schema adapted from post-form.tsx ---

// 1. Define the RAW data schema (what the HTML form sends)
const RHFPostSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters."),
    content: z.string().min(10, "Content must be at least 10 characters."),
    published: z.boolean(),
    categoryIds: z.array(z.string()).optional(),
});

// 2. Define the FINAL mutation payload schema (what tRPC expects)
const MutationSchema = RHFPostSchema.extend({
    id: z.number(),
    categoryIds: z.array(z.string()).transform((val) =>
        val.map(id => Number(id)).filter(id => !isNaN(id))
    ).optional(),
});

type FormInput = z.infer<typeof RHFPostSchema>;
type MutationInput = z.infer<typeof MutationSchema>;

// --- Component Props ---

interface EditPostFormProps {
    postId: number;
    initialTitle: string;
    initialContent: string;
    initialPublished: boolean;
    initialCategoryIds: string[]; // String array for form checkboxes
    postSlug: string;
}

const useCategories = () => api.category.getAll.useQuery();

export function EditPostForm({
    postId,
    initialTitle,
    initialContent,
    initialPublished,
    initialCategoryIds,
    postSlug,
}: EditPostFormProps) {
    const router = useRouter();
    const { data: categories = [], isLoading: isLoadingCategories } = useCategories();

    // 1. Initialize form with existing post data
    const {
        register,
        handleSubmit,
        formState: { errors },
        // reset is not needed for an edit form
    } = useForm<FormInput>({
        resolver: zodResolver(RHFPostSchema),
        defaultValues: {
            title: initialTitle,
            content: initialContent,
            published: initialPublished,
            categoryIds: initialCategoryIds,
        },
    });

    // 2. Update Mutation (U)
    const updatePost = api.post.update.useMutation({
        onSuccess: (data) => {
            alert("Post updated successfully!");
            // After successful update, redirect to the new slug (if the title changed, the slug might have implicitly changed on the backend via the router logic)
            router.push(`/post/${data?.slug || postSlug}`);
        },
        onError: (err) => {
            alert(`Error updating post: ${err.message}`);
        },
    });

    // 3. Delete Mutation (D)
    const deletePost = api.post.delete.useMutation({
        onSuccess: () => {
            alert("Post deleted successfully!");
            // Redirect to the dashboard after deletion
            router.push(`/admin/dashboard`);
        },
        onError: (err) => {
            alert(`Error deleting category: ${err.message}`);
        },
    });

    const onUpdate: SubmitHandler<FormInput> = (rawFormData) => {
        const parsedResult = MutationSchema.safeParse({
            ...rawFormData,
            id: postId, // Inject the required post ID
        });

        if (!parsedResult.success) {
            console.error("Form data parsing error:", parsedResult.error);
            alert("Internal form validation failed.");
            return;
        }

        updatePost.mutate(parsedResult.data as MutationInput);
    };

    const onDelete = () => {
        if (confirm(`Are you sure you want to delete "${initialTitle}"? This action cannot be undone.`)) {
            deletePost.mutate({ id: postId });
        }
    };

    return (
        // FIX 1: Add dark background and shadow for the form container
        <form onSubmit={handleSubmit(onUpdate)} className="space-y-6 max-w-3xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg dark:bg-gray-800 dark:shadow-2xl">
            {/* Title Field */}
            <div>
                {/* FIX 2: Add dark text color to label */}
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                <input
                    {...register("title")}
                    // FIX 3: Add dark colors to the input field
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                    placeholder="A captivating title..."
                    disabled={updatePost.isPending}
                />
                {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
            </div>

            {/* Content Editor (Markdown Support) */}
            <div>
                {/* FIX 4: Add dark text color to label */}
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content (Markdown)</label>
                <textarea
                    {...register("content")}
                    rows={15}
                    // FIX 5: Add dark colors to the textarea field
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                    placeholder="Write your post content here using Markdown..."
                    disabled={updatePost.isPending}
                />
                {errors.content && <p className="mt-1 text-xs text-red-600">{errors.content.message}</p>}
            </div>

            {/* Category Selection */}
            {/* FIX 6: Add dark border/background to the category selection box */}
            <div className="border p-4 rounded-md dark:border-gray-700">
                {/* FIX 7: Add dark text color to label */}
                <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Categories</label>
                {/* FIX 8: Add dark text color to loading message */}
                {isLoadingCategories && <p className="dark:text-gray-400">Loading categories...</p>}
                <div className="flex flex-wrap gap-4">
                    {categories.map((cat) => (
                        <label key={cat.id} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                value={String(cat.id)}
                                {...register("categoryIds")}
                                className="rounded text-indigo-600 focus:ring-indigo-500"
                                disabled={updatePost.isPending}
                            />
                            {/* FIX 9: Add dark text color to category name */}
                            <span className="text-sm text-gray-900 dark:text-gray-200">{cat.name}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Published Checkbox */}
            <div className="flex items-center space-x-2">
                <input
                    type="checkbox"
                    {...register("published")}
                    className="rounded text-green-600 focus:ring-green-500"
                    disabled={updatePost.isPending}
                />
                {/* FIX 10: Add dark text color to label */}
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Published</label>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
                {/* Delete button action color is fine, no change needed */}
                <button
                    type="button"
                    onClick={onDelete}
                    className="py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-red-600 hover:bg-red-700 transition-colors duration-150 disabled:opacity-50"
                    disabled={updatePost.isPending || deletePost.isPending}
                >
                    {deletePost.isPending ? "Deleting..." : "Delete Post"}
                </button>

                {/* Update button action color is fine, no change needed */}
                <button
                    type="submit"
                    className="flex-grow py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150 disabled:opacity-50"
                    disabled={updatePost.isPending || deletePost.isPending}
                >
                    {updatePost.isPending ? "Updating Post..." : "Update Post"}
                </button>
            </div>

            {(updatePost.isError || deletePost.isError) && (
                <p className="text-red-500 text-sm mt-2">
                    An unexpected error occurred: {updatePost.error?.message || deletePost.error?.message}
                </p>
            )}
        </form>
    );
}