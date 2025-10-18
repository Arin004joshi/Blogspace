"use client";

import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { createPostSchema } from "@/server/api/zod-schemas";


const RHFPostSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters."),
    content: z.string().min(10, "Content must be at least 10 characters."),
    published: z.boolean(),
    categoryIds: z.array(z.string()),
});

const MutationSchema = RHFPostSchema.extend({
    categoryIds: z.array(z.string()).transform((val) =>
        val.map(id => Number(id)).filter(id => !isNaN(id))
    ).optional(), 
});


type FormInput = z.infer<typeof RHFPostSchema>;
type MutationInput = z.infer<typeof MutationSchema>; 

const useCategories = () => api.category.getAll.useQuery();

export function PostForm() {
    const router = useRouter();
    const utils = api.useUtils();
    const { data: categories = [], isLoading: isLoadingCategories } = useCategories();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormInput>({
        resolver: zodResolver(RHFPostSchema),
        defaultValues: {
            title: "",
            content: "",
            published: false,
            categoryIds: [],
        },
    });

    const createPost = api.post.create.useMutation({
        onSuccess: async (postId) => {
            await utils.post.getAll.invalidate();

            router.push("/admin/dashboard");
        },
        onError: (err) => {
            console.error(err);
            alert(`Error creating post: ${err.message}`);
        },
    });

    const onSubmit: SubmitHandler<FormInput> = (rawFormData) => {
        const parsedResult = MutationSchema.safeParse(rawFormData);

        if (!parsedResult.success) {
            console.error("Form data parsing error:", parsedResult.error);
            alert("Internal form validation failed.");
            return;
        }

        const mutationPayload: MutationInput = {
            ...parsedResult.data,
            categoryIds: parsedResult.data.categoryIds,
        }

        createPost.mutate(mutationPayload as MutationInput);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-3xl mx-auto p-6 bg-gray-50 rounded-lg shadow-lg dark:bg-gray-800 dark:shadow-2xl">
            {/* ADDED dark:text-gray-100 */}
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Create New Post</h2>

            {/* Title Field */}
            <div>
                {/* ADDED dark:text-gray-300 */}
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
                <input
                    {...register("title")}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                    placeholder="A captivating title..."
                />
                {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>}
            </div>

            {/* Content Editor (Simple Text Area / Markdown Shortcut) */}
            <div>
                {/* ADDED dark:text-gray-300 */}
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content (Markdown)</label>
                <textarea
                    {...register("content")}
                    rows={15}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-3 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-400"
                    placeholder="Write your post content here using Markdown..."
                />
                {errors.content && <p className="mt-1 text-xs text-red-600">{errors.content.message}</p>}
            </div>

            {/* Category Selection */}
            {/* ADDED dark:border-gray-700 */}
            <div className="border p-4 rounded-md dark:border-gray-700">
                {/* ADDED dark:text-gray-300 */}
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Categories</label>
                {/* ADDED dark:text-gray-400 */}
                {isLoadingCategories && <p className="dark:text-gray-400">Loading categories...</p>}
                <div className="flex flex-wrap gap-4">
                    {categories.map((cat) => (
                        <label key={cat.id} className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                value={cat.id} // Ensure this is the ID number
                                {...register("categoryIds")}
                                className="rounded text-indigo-600 focus:ring-indigo-500"
                            />
                            {/* ADDED dark:text-gray-200 */}
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
                />
                {/* ADDED dark:text-gray-300 */}
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Publish Immediately?</label>
            </div>

            <button
                type="submit"
                className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
                disabled={createPost.isPending}
            >
                {createPost.isPending ? "Creating Post..." : "Create Post"}
            </button>

            {createPost.isError && (
                <p className="text-red-500 text-sm mt-2">
                    An unexpected error occurred: {createPost.error.message}
                </p>
            )}
        </form>
    );
}