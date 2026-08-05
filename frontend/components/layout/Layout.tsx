'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('datapulse_sidebar_collapsed');
        if (saved !== null) {
            setIsCollapsed(saved === 'true');
        }
    }, []);

    const toggleSidebar = () => {
        setIsCollapsed((prev) => {
            const nextState = !prev;
            localStorage.setItem('datapulse_sidebar_collapsed', String(nextState));
            return nextState;
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <Sidebar isCollapsed={isCollapsed} onToggle={toggleSidebar} />
            <Navbar isCollapsed={isCollapsed} onToggleSidebar={toggleSidebar} />
            <main
                className={`pt-16 p-6 transition-all duration-300 ease-in-out ${
                    isCollapsed ? 'ml-20' : 'ml-64'
                }`}
            >
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};