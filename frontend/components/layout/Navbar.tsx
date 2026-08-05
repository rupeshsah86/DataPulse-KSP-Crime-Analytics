'use client';

import React from 'react';
import { Bell, Search, ChevronDown } from 'lucide-react';
import { getUser } from '@/utils/storage';

export const Navbar: React.FC = () => {
    const user = getUser();

    return (
        <header className="fixed top-0 right-0 left-64 h-16 bg-white border-b border-slate-200 z-40 flex items-center justify-between px-6 shadow-xs">
            {/* Left side - Search */}
            <div className="flex items-center flex-1 max-w-md">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search crimes, districts..."
                        className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                    />
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative p-2 text-slate-500 hover:text-slate-700 transition-colors rounded-lg hover:bg-slate-100">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full"></span>
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                    <div className="w-9 h-9 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-xs">
                        {user?.fullName?.charAt(0)?.toUpperCase() || 'O'}
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-bold text-slate-900">
                            {user?.fullName || 'Officer'}
                        </p>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                            {user?.role || 'OFFICER'}
                        </p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
            </div>
        </header>
    );
};