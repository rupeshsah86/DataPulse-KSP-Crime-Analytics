'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Compass, Navigation, Clock, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

const LeafletPatrolMap = dynamic(
    () => import('./LeafletPatrolMap').then((mod) => mod.LeafletPatrolMap),
    { ssr: false, loading: () => <div className="h-[520px] bg-slate-50 flex items-center justify-center font-semibold text-slate-500 rounded-2xl border border-slate-200">Loading Patrol Route Map...</div> }
);

export interface WaypointItem {
    step: number;
    id: number | string;
    name: string;
    latitude: number;
    longitude: number;
    risk: number;
    level: string;
}

export interface ItineraryItem {
    step: number;
    location_name: string;
    latitude: number;
    longitude: number;
    risk_level: string;
    risk_score: number;
    distance_from_prev_km: number;
    eta_mins: number;
    recommended_action: string;
}

interface PatrolMapProps {
    waypoints: WaypointItem[];
    itinerary: ItineraryItem[];
    summary: {
        total_distance_km: number;
        estimated_time_mins: number;
        waypoints_covered: number;
        critical_hotspots_covered: number;
    };
    unitName: string;
    shiftTime: string;
}

export const PatrolMap: React.FC<PatrolMapProps> = ({
    waypoints,
    itinerary,
    summary,
    unitName,
    shiftTime,
}) => {
    return (
        <div className="space-y-6">
            {/* Patrol Summary Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between border-l-4 border-l-indigo-600">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Route Distance</p>
                        <p className="text-2xl font-extrabold text-slate-900 mt-1">{summary.total_distance_km} km</p>
                    </div>
                    <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                        <Navigation className="w-5 h-5" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between border-l-4 border-l-purple-600">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Est. Duration</p>
                        <p className="text-2xl font-extrabold text-slate-900 mt-1">{summary.estimated_time_mins} mins</p>
                    </div>
                    <div className="w-11 h-11 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                        <Clock className="w-5 h-5" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between border-l-4 border-l-rose-500">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Critical Hotspots</p>
                        <p className="text-2xl font-extrabold text-rose-600 mt-1">{summary.critical_hotspots_covered}</p>
                    </div>
                    <div className="w-11 h-11 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
                        <ShieldAlert className="w-5 h-5" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between border-l-4 border-l-emerald-600">
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Waypoints</p>
                        <p className="text-2xl font-extrabold text-slate-900 mt-1">{summary.waypoints_covered} Stops</p>
                    </div>
                    <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                        <Compass className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Map & Itinerary Side-by-Side Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Interactive Leaflet Patrol Map */}
                <div className="lg:col-span-2 space-y-4">
                    <Card title={`🗺️ Patrol Route Map (${unitName})`} subtitle={`Optimized path for ${shiftTime}`} className="bg-white border border-slate-200 shadow-sm p-4">
                        <LeafletPatrolMap waypoints={waypoints} />
                    </Card>
                </div>

                {/* Step-by-Step Patrol Itinerary */}
                <div>
                    <Card title="📌 Patrol Dispatch Itinerary" subtitle="Turn-by-turn waypoint schedule & tactical actions" className="bg-white border border-slate-200 shadow-sm p-4">
                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                            {itinerary.map((item) => {
                                const isBase = item.risk_level === 'BASE';
                                return (
                                    <div
                                        key={item.step}
                                        className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                                                    {item.step}
                                                </span>
                                                <h4 className="font-bold text-slate-900 text-xs truncate max-w-[160px]">{item.location_name}</h4>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                isBase ? 'bg-indigo-100 text-indigo-700' :
                                                item.risk_level === 'CRITICAL' ? 'bg-rose-100 text-rose-700' :
                                                item.risk_level === 'HIGH' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                                            }`}>
                                                {item.risk_level}
                                            </span>
                                        </div>

                                        <p className="text-[11px] font-medium text-slate-600 leading-snug">
                                            💡 {item.recommended_action}
                                        </p>

                                        <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-500 pt-1 border-t border-slate-200/60">
                                            <span>+{item.distance_from_prev_km} km</span>
                                            <span>ETA: {item.eta_mins} mins</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};
