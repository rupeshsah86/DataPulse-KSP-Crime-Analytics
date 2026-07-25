'use client';

import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from './Button';

export const ThemeToggle: React.FC = () => {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        const isDark = localStorage.getItem('theme') === 'dark';
        setDark(isDark);
        if (isDark) {
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleTheme = () => {
        const newDark = !dark;
        setDark(newDark);
        if (newDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className="p-2 rounded-full w-10 h-10"
            aria-label="Toggle theme"
        >
            {dark ? (
                <Sun className="w-4 h-4 text-yellow-500" />
            ) : (
                <Moon className="w-4 h-4 text-gray-600" />
            )}
        </Button>
    );
};