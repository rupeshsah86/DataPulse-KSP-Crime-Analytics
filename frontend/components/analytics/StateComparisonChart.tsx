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

export interface StateDataPoint {
  state: string;
  totalCrimes: number;
  criticalCrimes: number;
  highCrimes: number;
  resolutionRate: number;
}

interface StateComparisonChartProps {
  data: StateDataPoint[];
}

export const StateComparisonChart: React.FC<StateComparisonChartProps> = ({ data }) => {
  return (
    <div className="h-[360px] w-full pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis
            dataKey="state"
            tick={{ fill: '#475569', fontSize: 12, fontWeight: 600 }}
            axisLine={{ stroke: '#CBD5E1' }}
          />
          <YAxis
            yAxisId="left"
            orientation="left"
            stroke="#475569"
            tick={{ fill: '#475569', fontSize: 11 }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke="#10B981"
            tickFormatter={(v) => `${v}%`}
            tick={{ fill: '#10B981', fontSize: 11 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0F172A',
              borderColor: '#1E293B',
              borderRadius: '12px',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 600,
            }}
          />
          <Legend wrapperStyle={{ paddingTop: 10, fontSize: '12px', fontWeight: 600 }} />
          <Bar yAxisId="left" dataKey="totalCrimes" name="Total Incidents" fill="#4F46E5" radius={[6, 6, 0, 0]} />
          <Bar yAxisId="left" dataKey="criticalCrimes" name="Critical Incidents" fill="#EF4444" radius={[6, 6, 0, 0]} />
          <Bar yAxisId="right" dataKey="resolutionRate" name="Resolution Rate (%)" fill="#10B981" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
