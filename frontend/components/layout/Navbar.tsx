'use client';

import React from 'react';
import { Bell, Search, User, ChevronDown } from 'lucide-react';
import { getUser } from '@/utils/storage';

export const Navbar: React.FC = () => {
    const user = getUser();

    return (
        <header className="fixed top-0 right-0 left-64 h-16 bg-white border-b border-gray-200 z-40 flex items-center justify-between px-6">
            {/* Left side - Search */}
            <div className="flex items-center flex-1 max-w-md">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search crimes, districts..."
                        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-status-critical rounded-full"></span>
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                    <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold text-sm">
                        {user?.fullName?.charAt(0) || 'U'}
                    </div>
                    <div className="hidden md:block">
                        <p className="text-sm font-medium text-gray-700">
                            {user?.fullName || 'User'}
                        </p>
                        <p className="text-xs text-gray-500">
                            {user?.role || 'Officer'}
                        </p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
            </div>
        </header>
    );
};