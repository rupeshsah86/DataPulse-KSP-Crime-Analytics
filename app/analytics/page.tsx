'use client';

import React, { useMemo } from 'react';
import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { useCrimes } from '@/hooks/useCrimes';
import { CrimeTrendChart } from '@/components/analytics/CrimeTrendChart';
import { CrimeCategoryChart } from '@/components/analytics/CrimeCategoryChart';
import { DistrictChart } from '@/components/analytics/DistrictChart';
import { StatusChart } from '@/components/analytics/StatusChart';

export default function AnalyticsPage() {
    const { crimes, loading } = useCrimes();

    // Process data for charts
    const chartData = useMemo(() => {
        if (!crimes || crimes.length === 0) return null;

        // Trend data (last 7 days)
        const trendMap = new Map<string, number>();
        const sorted = [...crimes].sort((a, b) =>
            new Date(a.incidentDate).getTime() - new Date(b.incidentDate).getTime()
        );
        const last7Days = sorted.slice(-7);
        last7Days.forEach(c => {
            trendMap.set(c.incidentDate, (trendMap.get(c.incidentDate) || 0) + 1);
        });
        const trendData = Array.from(trendMap.entries())
            .map(([date, crimes]) => ({ date, crimes }));

        // Category data
        const categoryMap = new Map<string, number>();
        crimes.forEach(c => {
            categoryMap.set(c.category, (categoryMap.get(c.category) || 0) + 1);
        });
        const categoryData = Array.from(categoryMap.entries())
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

        // District data
        const districtMap = new Map<string, number>();
        crimes.forEach(c => {
            districtMap.set(c.district, (districtMap.get(c.district) || 0) + 1);
        });
        const districtData = Array.from(districtMap.entries())
            .map(([district, crimes]) => ({ district, crimes }))
            .sort((a, b) => b.crimes - a.crimes);

        // Status data
        const statusMap = new Map<string, number>();
        crimes.forEach(c => {
            statusMap.set(c.status, (statusMap.get(c.status) || 0) + 1);
        });
        const statusData = Array.from(statusMap.entries())
            .map(([status, count]) => ({ status, count }));

        return { trendData, categoryData, districtData, statusData };
    }, [crimes]);

    if (loading) {
        return (
            <ProtectedRoute>
                <Layout>
                    <div className="min-h-[400px] flex items-center justify-center">
                        <Spinner size="lg" />
                    </div>
                </Layout>
            </ProtectedRoute>
        );
    }

    if (!chartData) {
        return (
            <ProtectedRoute>
                <Layout>
                    <div className="min-h-[400px] flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-gray-500">No data available for analytics</p>
                            <p className="text-xs text-gray-400 mt-1">Add some crimes to see analytics</p>
                        </div>
                    </div>
                </Layout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <Layout>
                <div className="space-y-6">
                    {/* Page Header */}
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
                        <p className="text-sm text-gray-500">
                            Visualize crime trends and patterns
                        </p>
                    </div>

                    {/* Stats Summary */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-4">
                            <p className="text-sm text-gray-500">Total Crimes</p>
                            <p className="text-2xl font-bold text-gray-800">{crimes.length}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-4">
                            <p className="text-sm text-gray-500">Categories</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {new Set(crimes.map(c => c.category)).size}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-4">
                            <p className="text-sm text-gray-500">Districts</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {new Set(crimes.map(c => c.district)).size}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-4">
                            <p className="text-sm text-gray-500">Average per Day</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {(crimes.length / 30).toFixed(1)}
                            </p>
                        </div>
                    </div>

                    {/* Charts Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Trend Chart */}
                        <Card title="Crime Trend" subtitle="Last 7 days">
                            <CrimeTrendChart data={chartData.trendData} />
                        </Card>

                        {/* Category Chart */}
                        <Card title="Crime Categories" subtitle="Distribution by category">
                            <CrimeCategoryChart data={chartData.categoryData} />
                        </Card>

                        {/* District Chart */}
                        <Card title="District-wise Crime" subtitle="Crimes by district">
                            <DistrictChart data={chartData.districtData} />
                        </Card>

                        {/* Status Chart */}
                        <Card title="Case Status" subtitle="Distribution by status">
                            <StatusChart data={chartData.statusData} />
                        </Card>
                    </div>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}