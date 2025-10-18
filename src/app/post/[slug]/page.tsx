import { api } from "@/trpc/server";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default async function IndividualPostPage(props: any) {
    const { params } = props as { params: { slug: string } };

    const post = await api.post.getBySlug({ slug: params.slug });

    if (!post || !post.published) {
        notFound();
    }

    return (
        <article className="container mx-auto p-8 max-w-4xl bg-white shadow-xl rounded-lg my-12 dark:bg-gray-800 dark:shadow-2xl">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
                {post.title}
            </h1>

            {/* Categories and Date */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-8 border-b pb-4 dark:text-gray-400 dark:border-gray-700">
                <p>Published on: {post.createdAt.toLocaleDateString()}</p>
                <div className="flex gap-2">
                    {post.postsToCategories.map(({ category }) => (
                        <span
                            key={category.id}
                            className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium"
                        >
                            {category.name}
                        </span>
                    ))}
                </div>
            </div>

            {/* Post Content */}
            <div className="prose max-w-none dark:text-gray-200">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {post.content}
                </ReactMarkdown>
            </div>
        </article>
    );
}