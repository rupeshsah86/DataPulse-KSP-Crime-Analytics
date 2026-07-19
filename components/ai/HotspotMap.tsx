'use client';

import React from 'react';
import { Hotspot } from '@/services/aiService';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface HotspotMapProps {
    hotspots: Hotspot[];
    loading?: boolean;
}

export const HotspotMap: React.FC<HotspotMapProps> = ({ hotspots, loading = false }) => {
    if (loading) {
        return (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
                Loading hotspots...
            </div>
        );
    }

    if (!hotspots || hotspots.length === 0) {
        return (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
                No hotspots found. Add more crime data.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hotspots.map((hotspot, index) => (
                    <Card key={index} className="border-l-4 border-l-status-critical">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Hotspot #{index + 1}</p>
                                <p className="text-lg font-bold text-gray-800">
                                    {hotspot.level}
                                </p>
                                <p className="text-xs text-gray-400">
                                    {hotspot.crime_count ? `${hotspot.crime_count} crimes` : 'High risk area'}
                                </p>
                            </div>
                            <div className="text-right">
                                <Badge variant={hotspot.level.toLowerCase() as any}>
                                    {hotspot.risk}% Risk
                                </Badge>
                            </div>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                            📍 {hotspot.latitude.toFixed(4)}, {hotspot.longitude.toFixed(4)}
                        </div>
                    </Card>
                ))}
            </div>

            {/* Summary Stats */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                        <p className="text-2xl font-bold text-gray-800">{hotspots.length}</p>
                        <p className="text-xs text-gray-500">Total Hotspots</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-status-critical">
                            {hotspots.filter(h => h.level === 'CRITICAL').length}
                        </p>
                        <p className="text-xs text-gray-500">Critical</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-status-high">
                            {hotspots.filter(h => h.level === 'HIGH').length}
                        </p>
                        <p className="text-xs text-gray-500">High</p>
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-gray-800">
                            {Math.round(hotspots.reduce((acc, h) => acc + h.risk, 0) / hotspots.length)}%
                        </p>
                        <p className="text-xs text-gray-500">Avg Risk</p>
                    </div>
                </div>
            </div>
        </div>
    );
};