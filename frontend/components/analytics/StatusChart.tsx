'use client';

import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from 'recharts';

interface StatusChartProps {
    data: Array<{
        status: string;
        count: number;
    }>;
}

const STATUS_COLORS: Record<string, string> = {
    OPEN: '#3B82F6', // Blue
    INVESTIGATING: '#06B6D4', // Cyan
    CLOSED: '#10B981', // Emerald
    COLD_CASE: '#64748B', // Slate
};

export const StatusChart: React.FC<StatusChartProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
                No status data available
            </div>
        );
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            const color = STATUS_COLORS[label] || '#3B82F6';
            return (
                <div className="bg-slate-900/90 backdrop-blur-md text-white text-xs p-3 rounded-lg shadow-xl border border-slate-700/50">
                    <p className="font-semibold text-slate-300 mb-1">{label}</p>
                    <p className="font-bold flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }}></span>
                        <span>{payload[0].value} Cases</span>
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 15, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis
                    dataKey="status"
                    tick={{ fill: '#64748B', fontSize: 11 }}
                    axisLine={{ stroke: '#E2E8F0' }}
                    tickLine={false}
                />
                <YAxis
                    tick={{ fill: '#64748B', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {data.map((entry) => (
                        <Cell
                            key={`cell-${entry.status}`}
                            fill={STATUS_COLORS[entry.status] || '#3B82F6'}
                        />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};