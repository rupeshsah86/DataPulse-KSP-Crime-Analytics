'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { crimeService, Crime } from '@/services/crimeService';
import { ArrowLeft, Calendar, MapPin, User, Building2, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CrimeDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [crime, setCrime] = useState<Crime | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCrime = async () => {
            try {
                const id = parseInt(params.id as string);
                const data = await crimeService.getById(id);
                setCrime(data);
            } catch (error) {
                toast.error('Crime not found');
                router.push('/crimes');
            } finally {
                setLoading(false);
            }
        };
        fetchCrime();
    }, [params.id, router]);

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

    if (!crime) {
        return (
            <ProtectedRoute>
                <Layout>
                    <div className="text-center py-12">
                        <p className="text-gray-500">Crime not found</p>
                        <Button className="mt-4" onClick={() => router.push('/crimes')}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Crimes
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
                    <Button variant="outline" onClick={() => router.push('/crimes')}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Crimes
                    </Button>

                    {/* Crime Details */}
                    <Card>
                        <div className="space-y-6">
                            {/* Header */}
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-800">{crime.title}</h1>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Crime Number: {crime.crimeNumber || 'N/A'}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant={crime.severity.toLowerCase() as any}>
                                        {crime.severity}
                                    </Badge>
                                    <Badge variant={crime.status.toLowerCase() as any}>
                                        {crime.status}
                                    </Badge>
                                    <Badge variant="default">{crime.category}</Badge>
                                </div>
                            </div>

                            {/* Divider */}
                            <hr className="border-gray-200" />

                            {/* Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Incident Date</p>
                                        <p className="font-medium text-gray-800">{crime.incidentDate}</p>
                                        {crime.incidentTime && (
                                            <p className="text-sm text-gray-500">{crime.incidentTime}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Location</p>
                                        <p className="font-medium text-gray-800">{crime.district}</p>
                                        {crime.address && (
                                            <p className="text-sm text-gray-500">{crime.address}</p>
                                        )}
                                        {crime.city && crime.state && (
                                            <p className="text-sm text-gray-500">{crime.city}, {crime.state}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <User className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Reported By</p>
                                        <p className="font-medium text-gray-800">{crime.reportedBy || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-gray-500">Police Station</p>
                                        <p className="font-medium text-gray-800">{crime.policeStation || 'N/A'}</p>
                                    </div>
                                </div>

                                {crime.latitude && crime.longitude && (
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">Coordinates</p>
                                            <p className="font-medium text-gray-800">
                                                {crime.latitude.toFixed(4)}, {crime.longitude.toFixed(4)}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {crime.createdAt && (
                                    <div className="flex items-start gap-3">
                                        <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">Created At</p>
                                            <p className="font-medium text-gray-800">
                                                {new Date(crime.createdAt).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            {crime.description && (
                                <div>
                                    <hr className="border-gray-200" />
                                    <div className="flex items-start gap-3">
                                        <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                                        <div>
                                            <p className="text-sm text-gray-500">Description</p>
                                            <p className="text-gray-700 mt-1 leading-relaxed">
                                                {crime.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}