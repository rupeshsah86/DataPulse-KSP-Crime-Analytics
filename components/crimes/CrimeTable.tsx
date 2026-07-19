'use client';

import React from 'react';
import { Edit, Trash2, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Crime } from '@/services/crimeService';
import { Button } from '@/components/ui/Button';

interface CrimeTableProps {
    crimes: Crime[];
    loading?: boolean;
    onEdit: (crime: Crime) => void;
    onDelete: (id: number) => void;
    onView: (crime: Crime) => void;
}

export const CrimeTable: React.FC<CrimeTableProps> = ({
    crimes,
    loading = false,
    onEdit,
    onDelete,
    onView,
}) => {
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

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-3 text-gray-600 font-medium">#</th>
                        <th className="text-left py-3 px-3 text-gray-600 font-medium">Crime Number</th>
                        <th className="text-left py-3 px-3 text-gray-600 font-medium">Title</th>
                        <th className="text-left py-3 px-3 text-gray-600 font-medium">District</th>
                        <th className="text-left py-3 px-3 text-gray-600 font-medium">Category</th>
                        <th className="text-left py-3 px-3 text-gray-600 font-medium">Status</th>
                        <th className="text-left py-3 px-3 text-gray-600 font-medium">Severity</th>
                        <th className="text-left py-3 px-3 text-gray-600 font-medium">Date</th>
                        <th className="text-center py-3 px-3 text-gray-600 font-medium">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {crimes.map((crime, index) => (
                        <tr key={crime.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="py-3 px-3 text-gray-500">{index + 1}</td>
                            <td className="py-3 px-3 text-gray-600 font-mono text-xs">
                                {crime.crimeNumber || 'N/A'}
                            </td>
                            <td className="py-3 px-3 text-gray-700 font-medium">{crime.title}</td>
                            <td className="py-3 px-3 text-gray-600">{crime.district}</td>
                            <td className="py-3 px-3">
                                <Badge variant="default">{crime.category}</Badge>
                            </td>
                            <td className="py-3 px-3">
                                <Badge variant={crime.status.toLowerCase() as any}>
                                    {crime.status}
                                </Badge>
                            </td>
                            <td className="py-3 px-3">
                                <Badge variant={crime.severity.toLowerCase() as any}>
                                    {crime.severity}
                                </Badge>
                            </td>
                            <td className="py-3 px-3 text-gray-500">{crime.incidentDate}</td>
                            <td className="py-3 px-3">
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