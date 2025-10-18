"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/trpc/react";

import { createCategorySchema } from "@/server/api/zod-schemas";
type CategoryInput = z.infer<typeof createCategorySchema>;

export default function CategoryManagementPage() {
    const {
        data: categories = [],
        isLoading: isFetching,
        isError: isFetchError
    } = api.category.getAll.useQuery();

    const utils = api.useUtils();

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<CategoryInput>({
        resolver: zodResolver(createCategorySchema),
    });

    const createCategory = api.category.create.useMutation({
        onSuccess: async () => {
            alert("Category created successfully!");
            reset();
            await utils.category.getAll.invalidate();
        },
        onError: (err) => {
            alert(`Error creating category: ${err.message}`);
        },
    });

    const deleteCategory = api.category.delete.useMutation({
        onSuccess: async () => {
            alert("Category deleted successfully!");
            await utils.category.getAll.invalidate();
        },
        onError: (err) => {
            alert(`Error deleting category: ${err.message}`);
        },
    });

    const onDelete = (id: number) => {
        if (confirm("Are you sure you want to delete this category?")) {
            deleteCategory.mutate({ id });
        }
    };

    const onCreate = (data: CategoryInput) => {
        createCategory.mutate(data);
    };

    return (
        <div className="container mx-auto p-8 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8">Category Management</h1>

            {/* Create New Category Form */}
            <form onSubmit={handleSubmit(onCreate)} className="mb-8 p-6 border rounded-lg shadow-md bg-white dark:bg-gray-800">
                <h2 className="text-2xl font-semibold mb-4">Create New Category</h2>
                <div className="flex gap-4 items-end">
                    <div className="flex-grow">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Category Name</label>
                        <input
                            id="name"
                            {...register("name")}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                            placeholder="e.g., Technology"
                            disabled={createCategory.isPending}
                        />
                        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
                    </div>
                    <button
                        type="submit"
                        disabled={createCategory.isPending}
                        className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition-colors h-fit"
                    >
                        {createCategory.isPending ? "Adding..." : "Add Category"}
                    </button>
                </div>
                {createCategory.isError && <p className="text-red-500 text-sm mt-2">Error: {createCategory.error.message}</p>}
            </form>

            {/* Category List */}
            <h2 className="text-2xl font-semibold mb-4">Existing Categories</h2>

            {isFetching && <p>Loading categories...</p>}
            {isFetchError && <p className="text-red-500">Error loading categories.</p>}

            {!isFetching && categories.length > 0 && (
                <ul className="space-y-3">
                    {categories.map((cat) => (
                        <li key={cat.id} className="flex justify-between items-center p-3 border rounded-md bg-gray-50 dark:bg-gray-800">
                            <span className="font-medium white">{cat.name} ({cat.slug})</span>
                            <button
                                onClick={() => onDelete(cat.id)}
                                disabled={deleteCategory.isPending}
                                className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            {!isFetching && categories.length === 0 && <p className="text-gray-500">No categories defined yet.</p>}
        </div>
    );
}