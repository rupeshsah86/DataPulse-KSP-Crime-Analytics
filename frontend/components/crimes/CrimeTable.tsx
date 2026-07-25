'use client';

import React, { useState } from 'react';
import { Edit, Trash2, Eye, CheckSquare, Square } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Crime } from '@/services/crimeService';
import { Button } from '@/components/ui/Button';

interface CrimeTableProps {
    crimes: Crime[];
    loading?: boolean;
    onEdit: (crime: Crime) => void;
    onDelete: (id: number) => void;
    onView: (crime: Crime) => void;
    onBulkDelete?: (ids: number[]) => void;  // ✅ NEW
    selectedIds?: number[];  // ✅ NEW
    onSelect?: (id: number) => void;  // ✅ NEW
    onSelectAll?: () => void;  // ✅ NEW
}

export const CrimeTable: React.FC<CrimeTableProps> = ({
    crimes,
    loading = false,
    onEdit,
    onDelete,
    onView,
    onBulkDelete,
    selectedIds = [],
    onSelect,
    onSelectAll,
}) => {
    const [expandedId, setExpandedId] = useState<number | null>(null);

    if (loading) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">Loading crimes...</p>
            </div>
        );
    }

    if (crimes.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">No crimes found. Start by adding a new crime!</p>
            </div>
        );
    }

    const allSelected = crimes.length > 0 && crimes.every(c => selectedIds.includes(c.id));

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-200">
                        {/* ✅ SELECT ALL CHECKBOX */}
                        {onSelectAll && onSelect && (
                            <th className="py-3 px-2 text-gray-600 font-medium w-10">
                                <button
                                    onClick={onSelectAll}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {allSelected ? (
                                        <CheckSquare className="w-4 h-4" />
                                    ) : (
                                        <Square className="w-4 h-4" />
                                    )}
                                </button>
                            </th>
                        )}
                        <th className="text-left py-3 px-2 text-gray-600 font-medium">#</th>
                        <th className="text-left py-3 px-2 text-gray-600 font-medium">Crime Number</th>
                        <th className="text-left py-3 px-2 text-gray-600 font-medium">Title</th>
                        <th className="text-left py-3 px-2 text-gray-600 font-medium">District</th>
                        <th className="text-left py-3 px-2 text-gray-600 font-medium">Category</th>
                        <th className="text-left py-3 px-2 text-gray-600 font-medium">Status</th>
                        <th className="text-left py-3 px-2 text-gray-600 font-medium">Severity</th>
                        <th className="text-left py-3 px-2 text-gray-600 font-medium">Date</th>
                        <th className="text-center py-3 px-2 text-gray-600 font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {crimes.map((crime, index) => (
                        <tr key={crime.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            {/* ✅ SELECT CHECKBOX */}
                            {onSelect && (
                                <td className="py-3 px-2">
                                    <button
                                        onClick={() => onSelect(crime.id)}
                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {selectedIds.includes(crime.id) ? (
                                            <CheckSquare className="w-4 h-4 text-primary-500" />
                                        ) : (
                                            <Square className="w-4 h-4" />
                                        )}
                                    </button>
                                </td>
                            )}
                            <td className="py-3 px-2 text-gray-500">{index + 1}</td>
                            <td className="py-3 px-2 text-gray-600 font-mono text-xs">
                                {crime.crimeNumber || 'N/A'}
                            </td>
                            <td className="py-3 px-2 text-gray-700 font-medium">{crime.title}</td>
                            <td className="py-3 px-2 text-gray-600">{crime.district}</td>
                            <td className="py-3 px-2">
                                <Badge variant="default">{crime.category}</Badge>
                            </td>
                            <td className="py-3 px-2">
                                <Badge variant={crime.status.toLowerCase() as any}>
                                    {crime.status}
                                </Badge>
                            </td>
                            <td className="py-3 px-2">
                                <Badge variant={crime.severity.toLowerCase() as any}>
                                    {crime.severity}
                                </Badge>
                            </td>
                            <td className="py-3 px-2 text-gray-500">{crime.incidentDate}</td>
                            <td className="py-3 px-2">
                                <div className="flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => onView(crime)}
                                        className="p-1 text-gray-400 hover:text-primary-500 transition-colors"
                                        title="View"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onEdit(crime)}
                                        className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                                        title="Edit"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(crime.id)}
                                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};