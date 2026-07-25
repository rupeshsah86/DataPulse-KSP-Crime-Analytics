'use client';

import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

interface StatusChartProps {
    data: Array<{
        status: string;
        count: number;
    }>;
}

const STATUS_COLORS = {
    OPEN: '#007bff',
    INVESTIGATING: '#17a2b8',
    CLOSED: '#28a745',
    COLD_CASE: '#6c757d',
};

export const StatusChart: React.FC<StatusChartProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
                No data available
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="status" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#1a5276" radius={[4, 4, 0, 0]}>
                    {data.map((entry) => (
                        <Bar
                            key={entry.status}
                            dataKey="count"
                            fill={STATUS_COLORS[entry.status as keyof typeof STATUS_COLORS] || '#1a5276'}
                        />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
};