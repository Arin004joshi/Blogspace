"use client";

import { useState, useEffect } from 'react';
import { useDarkMode } from "./dark-mode-provider";
const SunIcon = (props: { className: string }) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16.862 4.487L18.55 2.8M5.45 2.8L7.138 4.487M12 7a5 5 0 100 10 5 5 0 000-10z" /></svg>;
const MoonIcon = (props: { className: string }) => <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0112 21.75c-5.385 0-9.75-4.365-9.75-9.75S6.615 2.25 12 2.25a9.718 9.718 0 019.752 6.749H12a2.25 2.25 0 00-2.25 2.25v1.5a2.25 2.25 0 002.25 2.25h9.752z" /></svg>;


export function DarkModeToggle() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const { theme, toggleTheme } = useDarkMode();

    if (!mounted) {
        return (
            <button
                aria-label="Toggle Dark Mode Placeholder"
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors opacity-0 pointer-events-none"
            />
        );
    }

    return (
        <button
            onClick={toggleTheme}
            aria-label="Toggle Dark Mode"
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
        >
            {theme === 'dark' ? (
                <SunIcon className="h-6 w-6" />
            ) : (
                <MoonIcon className="h-6 w-6" />
            )}
        </button>
    );
}