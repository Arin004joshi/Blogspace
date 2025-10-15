// src/app/_components/dark-mode-provider.tsx
"use client";

import { useState, useEffect, createContext, useContext, type ReactNode } from "react";


type Theme = 'light' | 'dark';
type DarkModeContextType = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    toggleTheme: () => void;
};

const DarkModeContext = createContext<DarkModeContextType | undefined>(undefined);

export const DarkModeProvider = ({ children }: { children: ReactNode }) => {
    // Initialize state to a dummy value or what the server renders ('light')
    const [theme, setInternalTheme] = useState<Theme>('light');

    // 1. New useEffect: ONLY load the theme on the client and apply the class once.
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme;
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme: Theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

        // Apply the class to the documentElement immediately
        document.documentElement.classList.toggle('dark', initialTheme === 'dark');
        setInternalTheme(initialTheme);
    }, []); // Run only once on mount

    // 2. Function to update theme state and localStorage
    const setTheme = (newTheme: Theme) => {
        setInternalTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    // 3. THE FIX: Use the functional update form to ensure non-stale state.
    const toggleTheme = () => {
        setInternalTheme(prevTheme => {
            const newTheme = prevTheme === 'light' ? 'dark' : 'light';

            // Reapply the side-effects here to ensure the DOM and localStorage update
            // with the new theme calculated from the latest state.
            localStorage.setItem('theme', newTheme);
            document.documentElement.classList.toggle('dark', newTheme === 'dark');

            return newTheme;
        });
    };

    // The Provider wrapper is always returned, fixing the context error.
    return (
        <DarkModeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </DarkModeContext.Provider>
    );
};

// Hook for consuming the theme context (remains the same)
export const useDarkMode = () => {
    const context = useContext(DarkModeContext);
    if (context === undefined) {
        throw new Error('useDarkMode must be used within a DarkModeProvider');
    }
    return context;
};