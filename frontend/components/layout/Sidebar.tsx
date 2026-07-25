'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    FileText,
    MapPin,
    BarChart3,
    Upload,
    Settings,
    LogOut,
    Shield,
    Brain,
    Users,
    Network,  // ✅ ADDED
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { authService } from '@/services/authService';

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
}

export const Sidebar: React.FC = () => {
    const pathname = usePathname();

    const navItems: NavItem[] = [
        {
            label: 'Dashboard',
            href: '/dashboard',
            icon: <LayoutDashboard className="w-5 h-5" />,
        },
        {
            label: 'Crimes',
            href: '/crimes',
            icon: <FileText className="w-5 h-5" />,
        },
        {
            label: 'Analytics',
            href: '/analytics',
            icon: <BarChart3 className="w-5 h-5" />,
        },
        {
            label: 'Map',
            href: '/map',
            icon: <MapPin className="w-5 h-5" />,
        },
        {
            label: 'AI Insights',
            href: '/ai',
            icon: <Brain className="w-5 h-5" />,
        },
        {
            label: 'Repeat Offenders',
            href: '/repeat-offenders',
            icon: <Users className="w-5 h-5" />,
        },
        {
            label: 'Criminal Network',  // ✅ ADDED
            href: '/network',
            icon: <Network className="w-5 h-5" />,
        },
        {
            label: 'Upload',
            href: '/upload',
            icon: <Upload className="w-5 h-5" />,
        },
        {
            label: 'Settings',
            href: '/settings',
            icon: <Settings className="w-5 h-5" />,
        },
    ];

    const handleLogout = () => {
        authService.logout();
    };

    return (
        <aside className="fixed left-0 top-0 h-full w-64 bg-primary-700 text-white shadow-xl z-50">
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-6 border-b border-primary-600">
                <div className="w-10 h-10 bg-accent-500 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-primary-900" />
                </div>
                <div>
                    <h1 className="text-xl font-bold">DataPulse</h1>
                    <p className="text-xs text-primary-300">Crime Analytics</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                            pathname === item.href
                                ? 'bg-primary-600 text-white shadow-lg'
                                : 'text-primary-200 hover:bg-primary-600 hover:text-white'
                        )}
                    >
                        {item.icon}
                        {item.label}
                    </Link>
                ))}
            </nav>

            {/* Logout */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-primary-600">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-primary-200 hover:bg-primary-600 hover:text-white transition-all duration-200"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </aside>
    );
};