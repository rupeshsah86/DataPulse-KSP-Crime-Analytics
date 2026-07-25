'use client';

import React, { useMemo } from 'react';
import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useCrimes } from '@/hooks/useCrimes';
import { CrimeTrendChart } from '@/components/analytics/CrimeTrendChart';
import { CrimeCategoryChart } from '@/components/analytics/CrimeCategoryChart';
import { DistrictChart } from '@/components/analytics/DistrictChart';
import { StatusChart } from '@/components/analytics/StatusChart';
import { Download, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import toast from 'react-hot-toast';

export default function AnalyticsPage() {
    const { crimes, loading } = useCrimes();

    const chartData = useMemo(() => {
        if (!crimes || crimes.length === 0) return null;

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

        const categoryMap = new Map<string, number>();
        crimes.forEach(c => {
            categoryMap.set(c.category, (categoryMap.get(c.category) || 0) + 1);
        });
        const categoryData = Array.from(categoryMap.entries())
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);

        const districtMap = new Map<string, number>();
        crimes.forEach(c => {
            districtMap.set(c.district, (districtMap.get(c.district) || 0) + 1);
        });
        const districtData = Array.from(districtMap.entries())
            .map(([district, crimes]) => ({ district, crimes }))
            .sort((a, b) => b.crimes - a.crimes);

        const statusMap = new Map<string, number>();
        crimes.forEach(c => {
            statusMap.set(c.status, (statusMap.get(c.status) || 0) + 1);
        });
        const statusData = Array.from(statusMap.entries())
            .map(([status, count]) => ({ status, count }));

        return { trendData, categoryData, districtData, statusData };
    }, [crimes]);

    // ============================================
    // EXPORT TO CSV
    // ============================================
    const handleExportCSV = () => {
        if (!chartData) {
            toast.error('No data to export');
            return;
        }

        try {
            const rows = [];
            rows.push(['=== Crime Categories ===']);
            rows.push(['Category', 'Count']);
            chartData.categoryData.forEach(d => rows.push([d.name, d.value]));
            rows.push([]);
            rows.push(['=== District-wise Crime ===']);
            rows.push(['District', 'Count']);
            chartData.districtData.forEach(d => rows.push([d.district, d.crimes]));
            rows.push([]);
            rows.push(['=== Case Status ===']);
            rows.push(['Status', 'Count']);
            chartData.statusData.forEach(d => rows.push([d.status, d.count]));

            const csvContent = rows.map(row => row.join(',')).join('\n');
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `analytics_data_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            toast.success('Analytics data exported! 📥');
        } catch (error) {
            toast.error('Export failed');
            console.error(error);
        }
    };

    // ============================================
    // EXPORT TO EXCEL
    // ============================================
    const handleExportExcel = () => {
        if (!chartData) {
            toast.error('No data to export');
            return;
        }

        try {
            const wb = XLSX.utils.book_new();

            const categoryData = chartData.categoryData.map(d => ({
                'Category': d.name,
                'Count': d.value,
                'Percentage': `${((d.value / crimes.length) * 100).toFixed(1)}%`
            }));
            const ws1 = XLSX.utils.json_to_sheet(categoryData);
            XLSX.utils.book_append_sheet(wb, ws1, 'Categories');

            const districtData = chartData.districtData.map(d => ({
                'District': d.district,
                'Crimes': d.crimes,
                'Percentage': `${((d.crimes / crimes.length) * 100).toFixed(1)}%`
            }));
            const ws2 = XLSX.utils.json_to_sheet(districtData);
            XLSX.utils.book_append_sheet(wb, ws2, 'Districts');

            const statusData = chartData.statusData.map(d => ({
                'Status': d.status,
                'Count': d.count,
                'Percentage': `${((d.count / crimes.length) * 100).toFixed(1)}%`
            }));
            const ws3 = XLSX.utils.json_to_sheet(statusData);
            XLSX.utils.book_append_sheet(wb, ws3, 'Status');

            const trendData = chartData.trendData.map(d => ({
                'Date': d.date,
                'Crimes': d.crimes
            }));
            const ws4 = XLSX.utils.json_to_sheet(trendData);
            XLSX.utils.book_append_sheet(wb, ws4, 'Trend');

            XLSX.writeFile(wb, `analytics_data_${new Date().toISOString().split('T')[0]}.xlsx`);

            toast.success('Analytics data exported to Excel! 📊');
        } catch (error) {
            toast.error('Export failed');
            console.error(error);
        }
    };

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
                    {/* ✅ HEADER WITH EXPORT BUTTONS */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
                            <p className="text-sm text-gray-500">Visualize crime trends and patterns</p>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={handleExportCSV}>
                                <Download className="w-4 h-4 mr-1" />
                                CSV
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleExportExcel}>
                                <FileSpreadsheet className="w-4 h-4 mr-1" />
                                Excel
                            </Button>
                        </div>
                    </div>

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

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card title="Crime Trend" subtitle="Last 7 days">
                            <CrimeTrendChart data={chartData.trendData} />
                        </Card>

                        <Card title="Crime Categories" subtitle="Distribution by category">
                            <CrimeCategoryChart data={chartData.categoryData} />
                        </Card>

                        <Card title="District-wise Crime" subtitle="Crimes by district">
                            <DistrictChart data={chartData.districtData} />
                        </Card>

                        <Card title="Case Status" subtitle="Distribution by status">
                            <StatusChart data={chartData.statusData} />
                        </Card>
                    </div>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}