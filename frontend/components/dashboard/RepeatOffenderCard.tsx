'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useRepeatOffenders } from '@/hooks/useRepeatOffenders';
import { Spinner } from '@/components/ui/Spinner';
import { AlertTriangle, User, Calendar, MapPin, TrendingUp } from 'lucide-react';

interface RepeatOffenderCardProps {
    limit?: number;
}

export const RepeatOffenderCard: React.FC<RepeatOffenderCardProps> = ({ limit = 5 }) => {
    const router = useRouter();
    const { stats, offenders, loading, getRiskColor, getRiskBadge } = useRepeatOffenders();

    if (loading) {
        return (
            <Card>
                <div className="flex items-center justify-center py-8">
                    <Spinner size="md" />
                </div>
            </Card>
        );
    }

    const topOffenders = offenders.slice(0, limit);

    return (
        <Card>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-semibold text-gray-800">🔄 Repeat Offenders</h3>
                    <p className="text-xs text-gray-500">Criminals with multiple offenses</p>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/repeat-offenders')}
                >
                    View All
                </Button>
            </div>

            {/* Stats Summary */}
            {stats && (
                <div className="grid grid-cols-4 gap-2 mb-4">
                    <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <p className="text-xl font-bold text-gray-800">{stats.totalOffenders}</p>
                        <p className="text-xs text-gray-500">Total</p>
                    </div>
                    <div className="text-center p-2 bg-red-50 rounded-lg">
                        <p className="text-xl font-bold text-red-600">{stats.highRiskCount}</p>
                        <p className="text-xs text-red-500">High Risk</p>
                    </div>
                    <div className="text-center p-2 bg-yellow-50 rounded-lg">
                        <p className="text-xl font-bold text-yellow-600">{stats.mediumRiskCount}</p>
                        <p className="text-xs text-yellow-500">Medium</p>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                        <p className="text-xl font-bold text-green-600">{stats.lowRiskCount}</p>
                        <p className="text-xs text-green-500">Low</p>
                    </div>
                </div>
            )}

            {/* Offenders List */}
            <div className="space-y-3">
                {topOffenders.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">No repeat offenders found</p>
                ) : (
                    topOffenders.map((offender) => (
                        <div
                            key={offender.id}
                            className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                            onClick={() => router.push(`/repeat-offenders/${offender.id}`)}
                        >
                            {/* Avatar */}
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold">
                                {offender.name.charAt(0)}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <p className="font-medium text-gray-800 text-sm truncate">
                                        {offender.name}
                                    </p>
                                    <Badge variant="default" className="text-xs">
                                        {offender.crimeCount} crimes
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {offender.lastCrimeDate}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" />
                                        {offender.crimes[0]?.district || 'Unknown'}
                                    </span>
                                </div>
                            </div>

                            {/* Risk Badge */}
                            <div className="text-right">
                                <Badge variant={offender.riskLevel.toLowerCase() as any}>
                                    {getRiskBadge(offender.riskLevel)}
                                </Badge>
                                <p className="text-xs text-gray-400 mt-1">
                                    <TrendingUp className="w-3 h-3 inline" />
                                    {offender.crimeCount} offenses
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {stats && stats.totalOffenders > limit && (
                <div className="mt-3 text-center">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="bg-transparent hover:bg-gray-100"
                        onClick={() => router.push('/repeat-offenders')}
                    >
                        View all {stats.totalOffenders} repeat offenders →
                    </Button>
                </div>
            )}
        </Card>
    );
};