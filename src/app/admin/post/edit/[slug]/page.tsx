import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import { EditPostForm } from "@/app/_components/edit-post-form";
import { HydrateClient } from "@/trpc/server";


export default async function EditPostPage(props: any) {
    const { params } = props as { params: { slug: string } };

    const post = await api.post.getBySlug({ slug: params.slug });

    if (!post) {
        notFound();
    }

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