'use client';

import React from 'react';
import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { useAI } from '@/hooks/useAI';
import { HotspotMap } from '@/components/ai/HotspotMap';
import { AIPredictions } from '@/components/ai/AIPredictions';
import { RAGChat } from '@/components/ai/RAGChat';
import { Activity, TrendingUp, AlertTriangle, MapPin, Clock, BarChart3, TrendingDown, Bot } from 'lucide-react';

export default function AIPage() {
    const { hotspots, patterns, loading } = useAI();

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
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                <Bot className="w-7 h-7 text-indigo-600" />
                                AI Crime Analytics & Intelligence
                            </h1>
                            <p className="text-sm font-medium text-slate-500 mt-0.5">
                                AI-powered crime prediction, hotspot detection, and RAG copilot assistant
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <a
                                href="/ai/investigation"
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                            >
                                ⚡ Open AI Investigation Assistant
                            </a>
                        </div>
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
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Critical Sectors</p>
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

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between border-l-4 border-l-indigo-600">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Patterns Analyzed</p>
                                <p className="text-2xl font-extrabold text-slate-900 mt-1">
                                    {patterns ? Object.keys(patterns.category_patterns || {}).length : 0}
                                </p>
                            </div>
                            <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                <MapPin className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    {/* Hotspots Section */}
                    <Card title="Crime Hotspots & Risk Heatmap" subtitle="Interactive map & high-risk area clusters derived from spatial data" className="bg-white border border-slate-200 shadow-sm">
                        <HotspotMap hotspots={hotspots || []} loading={loading} />
                    </Card>

                    {/* Predictions Section */}
                    <AIPredictions />

                    {/* Patterns Section */}
                    {patterns && (
                        <Card title="Crime Patterns & Temporal Intelligence" subtitle="Machine learning spatial & temporal trend decomposition" className="bg-white border border-slate-200 shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                                    <div className="flex items-center gap-2 text-indigo-600">
                                        <Clock className="w-4 h-4" />
                                        <h4 className="font-bold text-slate-900 text-sm">Temporal Peak Analysis</h4>
                                    </div>
                                    <div className="space-y-1.5 text-xs text-slate-700">
                                        <p className="flex justify-between border-b border-slate-200/60 pb-1">
                                            <span className="text-slate-500 font-medium">Peak Hours:</span>
                                            <strong className="text-slate-900">{patterns.time_patterns?.peak_hours?.join(', ') || 'N/A'}</strong>
                                        </p>
                                        <p className="flex justify-between border-b border-slate-200/60 pb-1">
                                            <span className="text-slate-500 font-medium">Peak Days:</span>
                                            <strong className="text-slate-900">{patterns.time_patterns?.peak_days?.join(', ') || 'N/A'}</strong>
                                        </p>
                                        <p className="flex justify-between">
                                            <span className="text-slate-500 font-medium">Peak Months:</span>
                                            <strong className="text-slate-900">{patterns.time_patterns?.peak_months?.join(', ') || 'N/A'}</strong>
                                        </p>
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                                    <div className="flex items-center gap-2 text-indigo-600">
                                        <BarChart3 className="w-4 h-4" />
                                        <h4 className="font-bold text-slate-900 text-sm">Category Dynamics</h4>
                                    </div>
                                    <div className="space-y-1.5 text-xs">
                                        <p className="flex justify-between border-b border-slate-200/60 pb-1">
                                            <span className="text-slate-500 font-medium">Surging:</span>
                                            <strong className="text-rose-600 font-bold">{patterns.category_patterns?.increasing?.join(', ') || 'None'}</strong>
                                        </p>
                                        <p className="flex justify-between border-b border-slate-200/60 pb-1">
                                            <span className="text-slate-500 font-medium">Declining:</span>
                                            <strong className="text-emerald-600 font-bold">{patterns.category_patterns?.decreasing?.join(', ') || 'None'}</strong>
                                        </p>
                                        <p className="flex justify-between">
                                            <span className="text-slate-500 font-medium">Stable:</span>
                                            <strong className="text-slate-700 font-semibold">{patterns.category_patterns?.stable?.join(', ') || 'N/A'}</strong>
                                        </p>
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                                    <div className="flex items-center gap-2 text-indigo-600">
                                        <TrendingUp className="w-4 h-4" />
                                        <h4 className="font-bold text-slate-900 text-sm">Macro Rate Trajectory</h4>
                                    </div>
                                    <div className="space-y-1.5 text-xs text-slate-700">
                                        <p className="flex justify-between border-b border-slate-200/60 pb-1">
                                            <span className="text-slate-500 font-medium">Trajectory:</span>
                                            <span className={`font-extrabold uppercase ${patterns.trends?.overall === 'increasing' ? 'text-rose-600' : 'text-emerald-600'}`}>
                                                {patterns.trends?.overall || 'N/A'}
                                            </span>
                                        </p>
                                        <p className="flex justify-between border-b border-slate-200/60 pb-1">
                                            <span className="text-slate-500 font-medium">MoM Variation:</span>
                                            <strong className="text-slate-900">{patterns.trends?.percentage_change || 0}%</strong>
                                        </p>
                                        <p className="flex justify-between">
                                            <span className="text-slate-500 font-medium">Evaluation Interval:</span>
                                            <strong className="text-slate-900">{patterns.trends?.period || 'Last 30 Days'}</strong>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* RAG AI Assistant Section */}
                    <Card title="💬 RAG Crime Copilot Assistant" subtitle="Natural language query engine powered by FastAPI & Gemini RAG" className="bg-white border border-slate-200 shadow-sm">
                        <RAGChat />
                    </Card>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}