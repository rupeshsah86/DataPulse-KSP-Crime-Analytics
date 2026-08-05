'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, PanelLeftClose, PanelLeftOpen, LogOut, User, Settings, ShieldCheck } from 'lucide-react';
import { getUser } from '@/utils/storage';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import { NotificationDropdown } from './NotificationDropdown';
import { VoiceSearch } from '../voice/VoiceSearch';
import Link from 'next/link';

interface NavbarProps {
    isCollapsed?: boolean;
    onToggleSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ isCollapsed = false, onToggleSidebar }) => {
    const user = getUser();
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);
    const clearAuth = useAuthStore((state) => state.clearAuth);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        setIsOpen(false);
        clearAuth();
        authService.logout();
    };

    return (
        <header
            className={`fixed top-0 right-0 h-16 bg-white border-b border-slate-200 z-40 flex items-center justify-between px-6 shadow-xs transition-all duration-300 ease-in-out ${
                isCollapsed ? 'left-20' : 'left-64'
            }`}
        >
            {/* Left side - Sidebar Toggle & Search */}
            <div className="flex items-center gap-3 flex-1 max-w-md">
                {onToggleSidebar && (
                    <button
                        onClick={onToggleSidebar}
                        className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
                        title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
                    >
                        {isCollapsed ? (
                            <PanelLeftOpen className="w-5 h-5" />
                        ) : (
                            <PanelLeftClose className="w-5 h-5" />
                        )}
                    </button>
                )}
                <div className="relative w-full flex items-center">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search crimes, districts... (or speak 🎙️)"
                        className="w-full pl-10 pr-10 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    />
                    <div className="absolute right-1 top-1/2 -translate-y-1/2">
                        <VoiceSearch onSearch={(text) => setSearchQuery(text)} />
                    </div>
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
                {/* Interactive Notification Dropdown */}
                <NotificationDropdown />

                {/* User Profile & Logout Dropdown */}
                <div className="relative border-l border-slate-200 pl-4" ref={dropdownRef}>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-100 transition-colors focus:outline-none"
                    >
                        <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-xs">
                            {user?.fullName?.charAt(0)?.toUpperCase() || 'O'}
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-bold text-slate-900 leading-tight">
                                {user?.fullName || 'Officer Sidh Sah'}
                            </p>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                                {user?.role || 'OFFICER'}
                            </p>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Profile Dropdown Menu */}
                    {isOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fadeIn">
                            {/* Officer Header */}
                            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                                <p className="text-xs font-bold text-slate-900">{user?.fullName || 'Officer Sidh Sah'}</p>
                                <p className="text-[11px] font-medium text-slate-500 truncate">{user?.email || 'officer@ksp.gov.in'}</p>
                                <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 border border-indigo-200 rounded-md text-[10px] font-bold text-indigo-700">
                                    <ShieldCheck className="w-3 h-3 text-indigo-600" />
                                    KSP Verified Official
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div className="p-1 space-y-0.5">
                                <Link
                                    href="/settings"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                                >
                                    <Settings className="w-4 h-4 text-slate-500" />
                                    Account & System Settings
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2.5 w-full text-left px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors mt-1 border-t border-slate-100"
                                >
                                    <LogOut className="w-4 h-4 text-rose-600" />
                                    Logout & Exit to Landing Page
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};