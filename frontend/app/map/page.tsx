'use client';

import React from 'react';
import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth';
import { Card } from '@/components/ui/Card';
import CrimeMap from '@/components/map/CrimeMapWrapper';
import { useCrimes } from '@/hooks/useCrimes';
import { Spinner } from '@/components/ui/Spinner';

export default function MapPage() {
    const { crimes, loading } = useCrimes();

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
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Crime Map</h1>
                        <p className="text-sm text-gray-500">
                            Visualize crime locations and hotspots
                        </p>
                    </div>

                    <Card>
                        <CrimeMap crimes={crimes} loading={loading} />
                    </Card>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-5 flex items-center justify-between border-l-4 border-l-blue-600">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Crimes</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{crimes.length}</p>
                                <p className="text-[11px] text-slate-500 mt-0.5">Recorded incidents</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-5 flex items-center justify-between border-l-4 border-l-emerald-500">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Geocoded on Map</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                                    {crimes.filter(c => c.latitude && c.longitude).length}
                                </p>
                                <p className="text-[11px] text-slate-500 mt-0.5">With lat/lng coordinates</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-5 flex items-center justify-between border-l-4 border-l-rose-500">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Critical Incidents</p>
                                <p className="text-2xl font-bold text-rose-600 mt-1">
                                    {crimes.filter(c => c.severity === 'CRITICAL').length}
                                </p>
                                <p className="text-[11px] text-slate-500 mt-0.5">High severity hotspots</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200/80 dark:border-slate-800 p-5 flex items-center justify-between border-l-4 border-l-purple-500">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Districts Mapped</p>
                                <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                                    {new Set(crimes.map(c => c.district)).size}
                                </p>
                                <p className="text-[11px] text-slate-500 mt-0.5">Active geographic areas</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}