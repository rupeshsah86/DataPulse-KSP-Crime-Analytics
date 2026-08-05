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
    Network,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { authService } from '@/services/authService';

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
}

interface SidebarProps {
    isCollapsed?: boolean;
    onToggle?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed = false, onToggle }) => {
    const pathname = usePathname();

    const navItems: NavItem[] = [
        {
            label: 'Dashboard',
            href: '/dashboard',
            icon: <LayoutDashboard className="w-5 h-5 shrink-0" />,
        },
        {
            label: 'Crimes',
            href: '/crimes',
            icon: <FileText className="w-5 h-5 shrink-0" />,
        },
        {
            label: 'Analytics',
            href: '/analytics',
            icon: <BarChart3 className="w-5 h-5 shrink-0" />,
        },
        {
            label: 'Map',
            href: '/map',
            icon: <MapPin className="w-5 h-5 shrink-0" />,
        },
        {
            label: 'AI Insights',
            href: '/ai',
            icon: <Brain className="w-5 h-5 shrink-0" />,
        },
        {
            label: 'Repeat Offenders',
            href: '/repeat-offenders',
            icon: <Users className="w-5 h-5 shrink-0" />,
        },
        {
            label: 'Criminal Network',
            href: '/network',
            icon: <Network className="w-5 h-5 shrink-0" />,
        },
        {
            label: 'Upload',
            href: '/upload',
            icon: <Upload className="w-5 h-5 shrink-0" />,
        },
        {
            label: 'Settings',
            href: '/settings',
            icon: <Settings className="w-5 h-5 shrink-0" />,
        },
    ];

    const handleLogout = () => {
        authService.logout();
    };

    return (
        <aside
            className={cn(
                'fixed left-0 top-0 h-full bg-[#0A212F] text-white shadow-xl z-50 transition-all duration-300 ease-in-out flex flex-col justify-between',
                isCollapsed ? 'w-20' : 'w-64'
            )}
        >
            {/* Header / Logo Section */}
            <div>
                <div className="relative flex items-center gap-3 px-5 py-5 border-b border-[#15425E]/60 min-h-[72px]">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-md shrink-0">
                        <Shield className="w-6 h-6 text-[#0A212F]" />
                    </div>
                    {!isCollapsed && (
                        <div className="overflow-hidden transition-all duration-200">
                            <h1 className="text-xl font-extrabold tracking-tight text-white">DataPulse</h1>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Crime Analytics</p>
                        </div>
                    )}

                    {/* Edge Collapse Button */}
                    {onToggle && (
                        <button
                            onClick={onToggle}
                            className="absolute -right-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-amber-500 hover:bg-amber-400 text-[#0A212F] rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
                            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                        >
                            {isCollapsed ? (
                                <ChevronRight className="w-4 h-4 stroke-[3]" />
                            ) : (
                                <ChevronLeft className="w-4 h-4 stroke-[3]" />
                            )}
                        </button>
                    )}
                </div>

                {/* Navigation Items */}
                <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-160px)]">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                title={isCollapsed ? item.label : undefined}
                                className={cn(
                                    'flex items-center gap-3 py-3 rounded-xl text-sm font-semibold transition-all duration-200',
                                    isCollapsed ? 'justify-center px-0' : 'px-4',
                                    isActive
                                        ? 'bg-[#15425E] text-white shadow-md border-l-4 border-l-amber-400'
                                        : 'text-slate-300 hover:bg-[#15425E]/50 hover:text-white'
                                )}
                            >
                                {item.icon}
                                {!isCollapsed && (
                                    <span className="truncate">{item.label}</span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Logout Footer */}
            <div className="p-3 border-t border-[#15425E]/60 bg-[#071924]">
                <button
                    onClick={handleLogout}
                    title={isCollapsed ? 'Logout' : undefined}
                    className={cn(
                        'flex items-center gap-3 w-full py-3 rounded-xl text-sm font-semibold text-slate-300 hover:bg-rose-900/40 hover:text-rose-300 transition-all duration-200',
                        isCollapsed ? 'justify-center px-0' : 'px-4'
                    )}
                >
                    <LogOut className="w-5 h-5 shrink-0" />
                    {!isCollapsed && <span>Logout</span>}
                </button>
            </div>
        </aside>
    );
};