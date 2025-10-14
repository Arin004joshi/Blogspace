// src/app/post/[slug]/page.tsx
import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import parse from "html-react-parser"; // Used to render simple content (assuming Markdown text)

interface PostPageProps {
    params: {
        slug: string;
    };
}

export default async function IndividualPostPage({ params }: PostPageProps) {
    // 1. Server-side fetch one post by slug
    const post = await api.post.getBySlug({ slug: params.slug });

    // 2. Handle 404 Case
    if (!post || !post.published) {
        notFound();
    }

    // NOTE: If you decide to use a dedicated Markdown or Rich Text library 
    // later (like react-markdown or Tiptap), you will replace `parse(post.content)` 
    // with that library's rendering component.
    const renderedContent = parse(post.content);

    return (
        <article className="container mx-auto p-8 max-w-4xl bg-white shadow-xl rounded-lg my-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                {post.title}
            </h1>

            {/* Categories and Date */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-8 border-b pb-4">
                <p>Published on: {post.createdAt.toLocaleDateString()}</p>
                <div className="flex gap-2">
                    {post.postsToCategories.map(({ category }) => (
                        <span key={category.id} className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                            {category.name}
                        </span>
                    ))}
                </div>
            </div>

            {/* Post Content Area */}
            <div className="prose max-w-none">
                {/* 'prose' is a Tailwind Typography class for nice text formatting */}
                {renderedContent}
            </div>
        </article>
    );
}