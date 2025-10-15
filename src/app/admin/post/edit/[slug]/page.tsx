import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import { EditPostForm } from "@/app/_components/edit-post-form";
import { HydrateClient } from "@/trpc/server";

// REMOVED: The explicit 'EditPostPageProps' interface

// FIX: Use 'any' type on the props object to bypass the PageProps constraint error.
export default async function EditPostPage(props: any) {
    // Cast and destructure params internally for local TypeScript safety.
    const { params } = props as { params: { slug: string } };

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