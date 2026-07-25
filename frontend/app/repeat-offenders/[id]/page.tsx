'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useRepeatOffenders } from '@/hooks/useRepeatOffenders';
import { ArrowLeft, Calendar, MapPin, User, AlertTriangle, Activity } from 'lucide-react';

export default function OffenderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { offenders, loading, getRiskBadge } = useRepeatOffenders();
    const [offender, setOffender] = useState<any>(null);

    useEffect(() => {
        if (!loading && offenders.length > 0) {
            const found = offenders.find(o => o.id === parseInt(params.id as string));
            setOffender(found || null);
        }
    }, [loading, offenders, params.id]);

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

    if (!offender) {
        return (
            <ProtectedRoute>
                <Layout>
                    <div className="text-center py-12">
                        <AlertTriangle className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500">Offender not found</p>
                        <Button className="mt-4" onClick={() => router.push('/repeat-offenders')}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                    </div>
                </Layout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <Layout>
                <div className="space-y-6">
                    {/* Back Button */}
                    <Button variant="outline" onClick={() => router.push('/repeat-offenders')}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Repeat Offenders
                    </Button>

                    {/* Offender Details */}
                    <Card>
                        <div className="space-y-6">
                            {/* Header */}
                            <div className="flex items-center justify-between flex-wrap gap-3">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800">{offender.name}</h1>
                                    <p className="text-sm text-gray-500">
                                        Badge: {offender.badgeNumber || 'N/A'}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Badge variant={offender.riskLevel.toLowerCase() as any}>
                                        {getRiskBadge(offender.riskLevel)}
                                    </Badge>
                                    <Badge variant="default">
                                        {offender.crimeCount} Crimes
                                    </Badge>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                                <div>
                                    <p className="text-sm text-gray-500">Total Crimes</p>
                                    <p className="text-xl font-bold text-gray-800">{offender.crimeCount}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">First Crime</p>
                                    <p className="font-medium">{offender.firstCrimeDate}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Last Crime</p>
                                    <p className="font-medium">{offender.lastCrimeDate}</p>
                                </div>
                            </div>

                            {/* Crime History */}
                            <div>
                                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                    <Activity className="w-4 h-4" />
                                    Crime History
                                </h3>
                                <div className="space-y-3">
                                    {offender.crimes.map((crime: any) => (
                                        <div
                                            key={crime.id}
                                            className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                            onClick={() => router.push(`/crimes/${crime.id}`)}
                                        >
                                            <div className="flex items-center justify-between flex-wrap gap-2">
                                                <div>
                                                    <p className="font-medium text-gray-800">{crime.title}</p>
                                                    <div className="flex flex-wrap gap-3 mt-1 text-sm text-gray-500">
                                                        <span>📍 {crime.district}</span>
                                                        <span>📅 {crime.incidentDate}</span>
                                                        <span>Category: {crime.category}</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Badge variant={crime.severity.toLowerCase() as any}>
                                                        {crime.severity}
                                                    </Badge>
                                                    <Badge variant={crime.status.toLowerCase() as any}>
                                                        {crime.status}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}