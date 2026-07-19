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

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-4">
                            <p className="text-sm text-gray-500">Total Crimes</p>
                            <p className="text-2xl font-bold text-gray-800">{crimes.length}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-4">
                            <p className="text-sm text-gray-500">On Map</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {crimes.filter(c => c.latitude && c.longitude).length}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-4">
                            <p className="text-sm text-gray-500">Critical</p>
                            <p className="text-2xl font-bold text-status-critical">
                                {crimes.filter(c => c.severity === 'CRITICAL').length}
                            </p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-4">
                            <p className="text-sm text-gray-500">Districts</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {new Set(crimes.map(c => c.district)).size}
                            </p>
                        </div>
                    </div>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}