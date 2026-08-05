'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Hotspot } from '@/services/aiService';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Map, Grid, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// Dynamically import Leaflet Hotspot map to avoid SSR issues
const LeafletHotspotMap = dynamic(
    () => import('./LeafletHotspotMap').then((mod) => mod.LeafletHotspotMap),
    { ssr: false, loading: () => <div className="h-[460px] bg-slate-50 flex items-center justify-center font-medium text-slate-500 rounded-2xl border border-slate-200">Loading AI Map View...</div> }
);

interface HotspotMapProps {
    hotspots: Hotspot[];
    loading?: boolean;
}

export const HotspotMap: React.FC<HotspotMapProps> = ({ hotspots, loading = false }) => {
    const [viewMode, setViewMode] = useState<'map' | 'cards'>('map');

    if (loading) {
        return (
            <div className="h-[350px] flex items-center justify-center text-slate-500 font-medium bg-slate-50 rounded-2xl border border-slate-200">
                Detecting AI Hotspots...
            </div>
        );
    }

    if (!hotspots || hotspots.length === 0) {
        return (
            <div className="h-[350px] flex flex-col items-center justify-center text-slate-500 font-medium bg-slate-50 rounded-2xl border border-slate-200">
                <AlertTriangle className="w-8 h-8 text-amber-500 mb-2" />
                <p className="font-bold text-slate-800">No hotspots detected</p>
                <p className="text-xs text-slate-500 mt-1">Ingest additional crime datasets to train AI risk clusters.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* View Mode Toggle Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">View Mode:</span>
                    <Button
                        variant={viewMode === 'map' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('map')}
                        className={viewMode === 'map' ? 'bg-indigo-600 text-white font-semibold' : 'border-slate-300 text-slate-700 font-medium'}
                    >
                        <Map className="w-4 h-4 mr-1" />
                        Interactive Map
                    </Button>
                    <Button
                        variant={viewMode === 'cards' ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('cards')}
                        className={viewMode === 'cards' ? 'bg-indigo-600 text-white font-semibold' : 'border-slate-300 text-slate-700 font-medium'}
                    >
                        <Grid className="w-4 h-4 mr-1" />
                        Grid Cards ({hotspots.length})
                    </Button>
                </div>
            </div>

            {/* View Mode Switcher */}
            {viewMode === 'map' ? (
                <LeafletHotspotMap hotspots={hotspots} />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {hotspots.map((hotspot, index) => (
                        <Card key={index} className="bg-white border border-slate-200 shadow-sm border-l-4 border-l-rose-500 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Hotspot #{index + 1}</p>
                                    <p className="text-lg font-extrabold text-slate-900 mt-0.5">
                                        {hotspot.level} RISK
                                    </p>
                                    <p className="text-xs font-medium text-slate-500 mt-0.5">
                                        {hotspot.crime_count ? `${hotspot.crime_count} incidents logged` : 'High density risk sector'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <Badge variant={hotspot.level.toLowerCase() as any}>
                                        {hotspot.risk}% Risk
                                    </Badge>
                                </div>
                            </div>
                            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-600 font-bold">
                                <span>📍 {hotspot.latitude.toFixed(4)}, {hotspot.longitude.toFixed(4)}</span>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Summary Stats Panel */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x divide-slate-100">
                    <div>
                        <p className="text-2xl font-extrabold text-slate-900">{hotspots.length}</p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Hotspots</p>
                    </div>
                    <div>
                        <p className="text-2xl font-extrabold text-rose-600">
                            {hotspots.filter(h => h.level === 'CRITICAL').length}
                        </p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Critical Sectors</p>
                    </div>
                    <div>
                        <p className="text-2xl font-extrabold text-amber-600">
                            {hotspots.filter(h => h.level === 'HIGH').length}
                        </p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">High Risk</p>
                    </div>
                    <div>
                        <p className="text-2xl font-extrabold text-indigo-600">
                            {Math.round(hotspots.reduce((acc, h) => acc + h.risk, 0) / hotspots.length)}%
                        </p>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Avg Risk Score</p>
                    </div>
                </div>
            </div>
        </div>
    );
};