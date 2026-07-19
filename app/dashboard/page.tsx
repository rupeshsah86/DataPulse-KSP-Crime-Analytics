'use client';

import React from 'react';
import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { useDashboard } from '@/hooks/useDashboard';
import { useCrimes } from '@/hooks/useCrimes';
import {
    AlertTriangle,
    CheckCircle,
    Clock,
    FileText,
    TrendingUp,
    Activity
} from 'lucide-react';

export default function DashboardPage() {
    const { stats, loading: statsLoading } = useDashboard();
    const { crimes, loading: crimesLoading } = useCrimes();

    if (statsLoading || crimesLoading) {
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

    const recentCrimes = crimes?.slice(0, 5) || [];

    const totalCrimes = stats?.totalCrimes || 0;
    const activeCases = stats?.activeCases || 0;
    const resolutionRate = stats?.resolutionRate || 0;
    const resolvedCases = Math.round((resolutionRate / 100) * totalCrimes);
    const criticalCount = stats?.crimesBySeverity?.find(([s]) => s === 'CRITICAL')?.[1] || 0;

    return (
        <ProtectedRoute>
            <Layout>
                <div className="space-y-6">
                    {/* Page Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                            <p className="text-sm text-gray-500">Welcome back! Here's what's happening with your crime data.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Last updated: Today</span>
                        </div>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="border-l-4 border-l-primary-500">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Total Crimes</p>
                                    <p className="text-2xl font-bold text-gray-800">{totalCrimes}</p>
                                    <p className="text-xs text-green-600 flex items-center gap-1">
                                        <TrendingUp className="w-3 h-3" />
                                        +5.2% from last month
                                    </p>
                                </div>
                                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-primary-500" />
                                </div>
                            </div>
                        </Card>

                        <Card className="border-l-4 border-l-status-investigating">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Active Cases</p>
                                    <p className="text-2xl font-bold text-gray-800">{activeCases}</p>
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        Under investigation
                                    </p>
                                </div>
                                <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                                    <Activity className="w-5 h-5 text-cyan-600" />
                                </div>
                            </div>
                        </Card>

                        <Card className="border-l-4 border-l-status-low">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Resolved Cases</p>
                                    <p className="text-2xl font-bold text-gray-800">{resolvedCases}</p>
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3 text-green-600" />
                                        {resolutionRate}% resolution rate
                                    </p>
                                </div>
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                </div>
                            </div>
                        </Card>

                        <Card className="border-l-4 border-l-status-critical">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Critical Alerts</p>
                                    <p className="text-2xl font-bold text-status-critical">{criticalCount}</p>
                                    <p className="text-xs text-status-critical flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" />
                                        Need immediate attention
                                    </p>
                                </div>
                                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5 text-status-critical" />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Recent Crimes */}
                    <Card title="Recent Crimes" subtitle="Latest 5 crime incidents">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-2 text-gray-600 font-medium">Title</th>
                                        <th className="text-left py-3 px-2 text-gray-600 font-medium">District</th>
                                        <th className="text-left py-3 px-2 text-gray-600 font-medium">Status</th>
                                        <th className="text-left py-3 px-2 text-gray-600 font-medium">Severity</th>
                                        <th className="text-left py-3 px-2 text-gray-600 font-medium">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentCrimes.length > 0 ? (
                                        recentCrimes.map((crime) => (
                                            <tr key={crime.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                <td className="py-3 px-2 text-gray-700 font-medium">{crime.title}</td>
                                                <td className="py-3 px-2 text-gray-600">{crime.district}</td>
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
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="py-8 text-center text-gray-500">
                                                No crimes found. Start by uploading a CSV file!
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}