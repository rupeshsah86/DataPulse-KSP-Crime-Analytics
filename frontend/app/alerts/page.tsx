'use client';

import React from 'react';
import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useCrimes } from '@/hooks/useCrimes';
import { AlertTriangle, Clock } from 'lucide-react';

export default function AlertsPage() {
    const { crimes, loading } = useCrimes();

    const alerts = crimes
        ?.filter((c) => c.severity === 'CRITICAL' || c.severity === 'HIGH')
        .sort((a, b) => new Date(b.incidentDate).getTime() - new Date(a.incidentDate).getTime());

    return (
        <ProtectedRoute>
            <Layout>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Alert History</h1>
                        <p className="text-sm text-gray-500">View all past alerts</p>
                    </div>

                    <Card>
                        {alerts?.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>No alerts found</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {alerts?.map((alert) => (
                                    <div key={alert.id} className="p-4 border rounded-lg">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-gray-800">{alert.title}</p>
                                                <p className="text-sm text-gray-500">{alert.district}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Badge variant={alert.severity.toLowerCase() as any}>
                                                    {alert.severity}
                                                </Badge>
                                                <Badge variant={alert.status.toLowerCase() as any}>
                                                    {alert.status}
                                                </Badge>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-2">
                                            <Clock className="w-3 h-3 inline mr-1" />
                                            {alert.incidentDate}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}