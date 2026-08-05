'use client';

import React, { useState } from 'react';
import { Edit, Trash2, Eye, CheckSquare, Square } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Crime } from '@/services/crimeService';

interface CrimeTableProps {
    crimes: Crime[];
    loading?: boolean;
    onEdit: (crime: Crime) => void;
    onDelete: (id: number) => void;
    onView: (crime: Crime) => void;
    onBulkDelete?: (ids: number[]) => void;
    selectedIds?: number[];
    onSelect?: (id: number) => void;
    onSelectAll?: () => void;
}

export const CrimeTable: React.FC<CrimeTableProps> = ({
    crimes,
    loading = false,
    onEdit,
    onDelete,
    onView,
    selectedIds = [],
    onSelect,
    onSelectAll,
}) => {
    const [expandedId, setExpandedId] = useState<number | null>(null);

    if (loading) {
        return (
            <div className="text-center py-8">
                <p className="text-slate-500 font-medium">Loading crimes...</p>
            </div>
        );
    }

    if (crimes.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-slate-500 font-medium">No crimes found. Start by adding a new crime!</p>
            </div>
        );
    }

    const allSelected = crimes.length > 0 && crimes.every(c => selectedIds.includes(c.id));

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80">
                        {onSelectAll && onSelect && (
                            <th className="py-3.5 px-3 text-slate-700 font-bold w-10">
                                <button
                                    onClick={onSelectAll}
                                    className="text-slate-400 hover:text-indigo-600 transition-colors"
                                >
                                    {allSelected ? (
                                        <CheckSquare className="w-4 h-4 text-indigo-600" />
                                    ) : (
                                        <Square className="w-4 h-4" />
                                    )}
                                </button>
                            </th>
                        )}
                        <th className="py-3.5 px-3 text-slate-700 font-bold">#</th>
                        <th className="py-3.5 px-3 text-slate-700 font-bold">Crime Number</th>
                        <th className="py-3.5 px-3 text-slate-700 font-bold">Title</th>
                        <th className="py-3.5 px-3 text-slate-700 font-bold">District</th>
                        <th className="py-3.5 px-3 text-slate-700 font-bold">Category</th>
                        <th className="py-3.5 px-3 text-slate-700 font-bold">Status</th>
                        <th className="py-3.5 px-3 text-slate-700 font-bold">Severity</th>
                        <th className="py-3.5 px-3 text-slate-700 font-bold">Date</th>
                        <th className="text-center py-3.5 px-3 text-slate-700 font-bold">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {crimes.map((crime, index) => (
                        <tr key={crime.id} className="hover:bg-slate-50/80 transition-colors">
                            {onSelect && (
                                <td className="py-3.5 px-3">
                                    <button
                                        onClick={() => onSelect(crime.id)}
                                        className="text-slate-400 hover:text-indigo-600 transition-colors"
                                    >
                                        {selectedIds.includes(crime.id) ? (
                                            <CheckSquare className="w-4 h-4 text-indigo-600" />
                                        ) : (
                                            <Square className="w-4 h-4" />
                                        )}
                                    </button>
                                </td>
                            )}
                            <td className="py-3.5 px-3 text-slate-500 font-medium">{index + 1}</td>
                            <td className="py-3.5 px-3 text-slate-600 font-mono text-xs font-semibold">
                                {crime.crimeNumber || 'N/A'}
                            </td>
                            <td className="py-3.5 px-3 text-slate-900 font-bold">{crime.title}</td>
                            <td className="py-3.5 px-3 text-slate-700 font-medium">{crime.district}</td>
                            <td className="py-3.5 px-3">
                                <Badge variant="default">{crime.category}</Badge>
                            </td>
                            <td className="py-3.5 px-3">
                                <Badge variant={crime.status.toLowerCase() as any}>
                                    {crime.status}
                                </Badge>
                            </td>
                            <td className="py-3.5 px-3">
                                <Badge variant={crime.severity.toLowerCase() as any}>
                                    {crime.severity}
                                </Badge>
                            </td>
                            <td className="py-3.5 px-3 text-slate-600 font-medium">{crime.incidentDate}</td>
                            <td className="py-3.5 px-3">
                                <div className="flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => onView(crime)}
                                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                        title="View"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onEdit(crime)}
                                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(crime.id)}
                                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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