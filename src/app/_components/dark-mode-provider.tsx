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
    const [theme, setInternalTheme] = useState<Theme>('light');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as Theme;
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme: Theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

        document.documentElement.classList.toggle('dark', initialTheme === 'dark');
        setInternalTheme(initialTheme);
    }, []); 

    const setTheme = (newTheme: Theme) => {
        setInternalTheme(newTheme);
        localStorage.setItem('theme', newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
    };

    const toggleTheme = () => {
        setInternalTheme(prevTheme => {
            const newTheme = prevTheme === 'light' ? 'dark' : 'light';

            localStorage.setItem('theme', newTheme);
            document.documentElement.classList.toggle('dark', newTheme === 'dark');

            return newTheme;
        });
    };

    return (
        <DarkModeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </DarkModeContext.Provider>
    );
};

export const useDarkMode = () => {
    const context = useContext(DarkModeContext);
    if (context === undefined) {
        throw new Error('useDarkMode must be used within a DarkModeProvider');
    }
    return context;
};