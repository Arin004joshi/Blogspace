// src/app/admin/post/edit/[slug]/page.tsx
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import { EditPostForm } from "@/app/_components/edit-post-form";
import { HydrateClient } from "@/trpc/server";

// REMOVED: interface EditPostPageProps
/*
interface EditPostPageProps {
    params: {
        slug: string;
    };
}
*/

// FIX: The function signature is updated to use an inline type annotation,
// which resolves the conflict with Next.js's internal PageProps types.
export default async function EditPostPage({
    params
}: {
    params: { slug: string };
}) {
    // 1. Fetch the existing post data
    const post = await api.post.getBySlug({ slug: params.slug });

    if (!post) {
        notFound();
    }

    // 2. Prepare initial values for the form
    const initialCategoryIds = post.postsToCategories.map(({ category }) => String(category.id));

    return (
        <HydrateClient>
            <div className="container mx-auto p-8 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8">Edit Post: {post.title}</h1>
                <EditPostForm
                    postId={post.id}
                    initialTitle={post.title}
                    initialContent={post.content}
                    initialPublished={post.published}
                    initialCategoryIds={initialCategoryIds}
                    postSlug={post.slug}
                />
            </div>
        </HydrateClient>
    );
}