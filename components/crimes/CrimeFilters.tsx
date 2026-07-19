'use client';

import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { STATUS_OPTIONS, SEVERITY_OPTIONS, CRIME_CATEGORIES } from '@/utils/constants';

interface CrimeFiltersProps {
    onSearch: (keyword: string) => void;
    onFilter: (filters: any) => void;
}

export const CrimeFilters: React.FC<CrimeFiltersProps> = ({ onSearch, onFilter }) => {
    const [keyword, setKeyword] = useState('');
    const [district, setDistrict] = useState('');
    const [category, setCategory] = useState('');
    const [status, setStatus] = useState('');
    const [severity, setSeverity] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(keyword);
    };

    const handleApplyFilters = () => {
        onFilter({ district, category, status, severity });
    };

    const handleClearFilters = () => {
        setDistrict('');
        setCategory('');
        setStatus('');
        setSeverity('');
        onFilter({});
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-2">
                <div className="flex-1">
                    <Input
                        placeholder="Search crimes by title, description..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        icon={<Search className="w-4 h-4" />}
                    />
                </div>
                <Button type="submit">Search</Button>
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                </Button>
            </form>

            {/* Filters Panel */}
            {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                            <Input
                                placeholder="Enter district"
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">All Categories</option>
                                {CRIME_CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                <option value="">All Status</option>
                                {STATUS_OPTIONS.map((s) => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                value={severity}
                                onChange={(e) => setSeverity(e.target.value)}
                            >
                                <option value="">All Severity</option>
                                {SEVERITY_OPTIONS.map((s) => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                        <Button onClick={handleApplyFilters}>Apply Filters</Button>
                        <Button variant="outline" onClick={handleClearFilters}>
                            <X className="w-4 h-4 mr-2" />
                            Clear
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};