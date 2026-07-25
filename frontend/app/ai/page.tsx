'use client';

import React from 'react';
import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { useAI } from '@/hooks/useAI';
import { HotspotMap } from '@/components/ai/HotspotMap';
import { AIPredictions } from '@/components/ai/AIPredictions';
import { RAGChat } from '@/components/ai/RAGChat';  // ← ADD THIS IMPORT
import { Activity, TrendingUp, AlertTriangle, MapPin, MessageSquare } from 'lucide-react';

export default function AIPage() {
    const { hotspots, patterns, loading, getRiskLabel } = useAI();

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

    return (
        <ProtectedRoute>
            <Layout>
                <div className="space-y-6">
                    {/* Page Header */}
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">AI Crime Analytics</h1>
                        <p className="text-sm text-gray-500">
                            AI-powered crime prediction, hotspot detection, and pattern analysis
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Hotspots Detected</p>
                                    <p className="text-2xl font-bold text-gray-800">{hotspots?.length || 0}</p>
                                </div>
                                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5 text-red-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Critical Areas</p>
                                    <p className="text-2xl font-bold text-status-critical">
                                        {hotspots?.filter(h => h.level === 'CRITICAL').length || 0}
                                    </p>
                                </div>
                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-orange-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">High Risk Areas</p>
                                    <p className="text-2xl font-bold text-status-high">
                                        {hotspots?.filter(h => h.level === 'HIGH').length || 0}
                                    </p>
                                </div>
                                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                                    <Activity className="w-5 h-5 text-yellow-600" />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-500">Patterns Detected</p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {patterns ? Object.keys(patterns.category_patterns || {}).length : 0}
                                    </p>
                                </div>
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-green-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hotspots Section */}
                    <Card title="Crime Hotspots" subtitle="AI-detected high-risk areas based on historical data">
                        <HotspotMap hotspots={hotspots || []} loading={loading} />
                    </Card>

                    {/* Predictions Section */}
                    <AIPredictions />

                    {/* Patterns Section */}
                    {patterns && (
                        <Card title="Crime Patterns" subtitle="AI-detected patterns and trends">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <h4 className="font-medium text-gray-700 mb-2">⏰ Peak Times</h4>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Hours:</span> {patterns.time_patterns?.peak_hours?.join(', ') || 'N/A'}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Days:</span> {patterns.time_patterns?.peak_days?.join(', ') || 'N/A'}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Months:</span> {patterns.time_patterns?.peak_months?.join(', ') || 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium text-gray-700 mb-2">📊 Category Trends</h4>
                                    <div className="space-y-1">
                                        <p className="text-sm text-green-600">
                                            <span className="font-medium">Increasing:</span> {patterns.category_patterns?.increasing?.join(', ') || 'N/A'}
                                        </p>
                                        <p className="text-sm text-red-600">
                                            <span className="font-medium">Decreasing:</span> {patterns.category_patterns?.decreasing?.join(', ') || 'N/A'}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Stable:</span> {patterns.category_patterns?.stable?.join(', ') || 'N/A'}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-medium text-gray-700 mb-2">📈 Overall Trend</h4>
                                    <div className="space-y-1">
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Direction:</span>{' '}
                                            <span className={patterns.trends?.overall === 'increasing' ? 'text-red-600' : 'text-green-600'}>
                                                {patterns.trends?.overall || 'N/A'}
                                            </span>
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Change:</span> {patterns.trends?.percentage_change || 0}%
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-medium">Period:</span> {patterns.trends?.period || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* ✅ RAG Chat Section - ADD THIS */}
                    <div className="grid grid-cols-1 gap-6">
                        <Card title="💬 AI Crime Assistant" subtitle="Ask questions about your crime data">
                            <RAGChat />
                        </Card>
                    </div>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}