import Link from "next/link";

export function AppFooter() {
    return (
        <footer className="bg-gray-800 text-white mt-16 py-8 dark:bg-gray-900">
            <div className="container mx-auto max-w-6xl text-center px-4">
                <p className="mb-4 text-lg font-semibold">BlogSpace Platform</p>
                <div className="flex justify-center space-x-6 sm:space-x-8 text-sm">
                    <Link href="/" className="hover:text-indigo-400">Home</Link>
                    <Link href="/admin/categories" className="hover:text-indigo-400">Categories</Link>
                    <Link href="/blog" className="hover:text-indigo-400">Feed</Link>
                </div>
                <p className="mt-6 text-xs text-gray-400">
                    © {new Date().getFullYear()} BlogSpace. All rights reserved.
                </p>
            </div>
        </footer>
    );
}