"use client"; 

import Link from "next/link";

export function AppHeader() {
    return (
        <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-10">
            <div className="container mx-auto p-4 flex justify-between items-center max-w-6xl">
                <Link href="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    BlogSpace
                </Link>
                <nav className="flex space-x-4 sm:space-x-6 text-gray-600 dark:text-gray-300 items-center">
                    <Link href="/blog" className="hover:text-indigo-600 transition-colors hidden sm:block dark:hover:text-indigo-400">
                        Blog Feed
                    </Link>
                    <Link href="/admin/dashboard" className="hover:text-indigo-600 transition-colors dark:hover:text-indigo-400">
                        Dashboard
                    </Link>
                    <Link href="/admin/post/new" className="text-white bg-indigo-600 px-3 py-1 sm:px-4 sm:py-2 text-sm rounded-md hover:bg-indigo-700 transition-colors">
                        New Post
                    </Link>
                </nav>
            </div>
        </header>
    );
}