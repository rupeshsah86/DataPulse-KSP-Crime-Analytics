'use client';

import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

interface CrimeCategoryChartProps {
    data: Array<{
        name: string;
        value: number;
    }>;
}

const CATEGORY_COLORS = [
    '#6366F1', // Indigo
    '#EC4899', // Pink
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#3B82F6', // Blue
    '#8B5CF6', // Purple
    '#14B8A6', // Teal
    '#F97316', // Orange
    '#06B6D4', // Cyan
    '#EF4444', // Red
    '#84CC16', // Lime
    '#A855F7', // Violet
];

export const CrimeCategoryChart: React.FC<CrimeCategoryChartProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="h-[340px] flex items-center justify-center text-slate-400 font-medium">
                No category data available
            </div>
        );
    }

    const totalCount = data.reduce((acc, curr) => acc + curr.value, 0);

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const item = payload[0];
            const percent = ((item.value / totalCount) * 100).toFixed(1);
            return (
                <div className="bg-slate-900 text-white text-xs p-3 rounded-lg shadow-xl border border-slate-700">
                    <p className="font-bold text-slate-100 mb-1">{item.name}</p>
                    <p className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: item.payload.fill }}></span>
                        <span>Incidents: <strong className="text-white">{item.value}</strong> ({percent}%)</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-4">
            <div className="relative h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            paddingAngle={3}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                                    stroke="#FFFFFF"
                                    strokeWidth={2}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
                {/* Donut Center Summary */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-extrabold text-slate-900">{totalCount}</span>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total</span>
                </div>
            </div>

            {/* Custom Clean Legend Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-3 border-t border-slate-100 max-h-[120px] overflow-y-auto pr-1">
                {data.map((item, index) => {
                    const percent = ((item.value / totalCount) * 100).toFixed(1);
                    const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
                    return (
                        <div key={item.name} className="flex items-center justify-between p-1.5 rounded-md hover:bg-slate-50 text-xs transition-colors">
                            <div className="flex items-center gap-1.5 min-w-0 pr-1">
                                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }}></span>
                                <span className="font-bold text-slate-700 truncate" title={item.name}>
                                    {item.name}
                                </span>
                            </div>
                            <span className="font-semibold text-slate-500 shrink-0 text-[11px]">
                                {item.value} ({percent}%)
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};