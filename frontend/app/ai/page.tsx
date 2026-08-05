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
                        <h1 className="text-2xl font-bold text-slate-900">AI Crime Analytics</h1>
                        <p className="text-sm font-medium text-slate-500">
                            AI-powered crime prediction, hotspot detection, and pattern analysis
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between border-l-4 border-l-rose-500">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Hotspots Detected</p>
                                <p className="text-2xl font-extrabold text-slate-900 mt-1">{hotspots?.length || 0}</p>
                            </div>
                            <div className="w-11 h-11 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between border-l-4 border-l-orange-500">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Critical Areas</p>
                                <p className="text-2xl font-extrabold text-rose-600 mt-1">
                                    {hotspots?.filter(h => h.level === 'CRITICAL').length || 0}
                                </p>
                            </div>
                            <div className="w-11 h-11 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                                <TrendingUp className="w-5 h-5" />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between border-l-4 border-l-amber-500">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">High Risk Areas</p>
                                <p className="text-2xl font-extrabold text-amber-600 mt-1">
                                    {hotspots?.filter(h => h.level === 'HIGH').length || 0}
                                </p>
                            </div>
                            <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                                <Activity className="w-5 h-5" />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between border-l-4 border-l-emerald-500">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Patterns Detected</p>
                                <p className="text-2xl font-extrabold text-slate-900 mt-1">
                                    {patterns ? Object.keys(patterns.category_patterns || {}).length : 0}
                                </p>
                            </div>
                            <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                                <MapPin className="w-5 h-5" />
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