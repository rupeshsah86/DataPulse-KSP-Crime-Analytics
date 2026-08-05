'use client';

import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { PatrolMap, WaypointItem, ItineraryItem } from '@/components/patrol/PatrolMap';
import { Compass, Sparkles, Navigation, Shield, Download, RefreshCw, Layers } from 'lucide-react';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function PatrolPage() {
    const [district, setDistrict] = useState('Bangalore Urban');
    const [unitName, setUnitName] = useState('Patrol Unit Alpha-1');
    const [shiftTime, setShiftTime] = useState('Night Shift (22:00 - 06:00)');

    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    const [routeData, setRouteData] = useState<{
        summary: {
            total_distance_km: number;
            estimated_time_mins: number;
            waypoints_covered: number;
            critical_hotspots_covered: number;
        };
        route_points: WaypointItem[];
        itinerary: ItineraryItem[];
    } | null>(null);

    const districts = [
        'Bangalore Urban',
        'Indiranagar',
        'Koramangala',
        'Electronic City',
        'Whitefield',
        'Jayanagar',
        'All Districts'
    ];

    const units = [
        'Patrol Unit Alpha-1',
        'Interceptor Unit Beta-2',
        'Rapid Response Task Force-3',
        'Highway Patrol Delta-4',
        'Cyber & Financial Crime Squad'
    ];

    const shifts = [
        'Night Shift (22:00 - 06:00)',
        'Morning Patrol (06:00 - 14:00)',
        'Evening Peak Shift (14:00 - 22:00)',
        'Special Task Force Operations'
    ];

    useEffect(() => {
        fetchRoute();
    }, []);

    const fetchRoute = async () => {
        setGenerating(true);
        const payload = {
            district,
            unit_name: unitName,
            shift_time: shiftTime
        };

        try {
            // Try Spring Boot proxy endpoint
            const res = await api.post('/patrol/routes', payload);
            const data = res.data?.data || res.data;
            if (data && data.summary) {
                setRouteData(data);
                toast.success('AI Patrol Route generated successfully! 🚓');
                return;
            }
        } catch (proxyErr) {
            console.warn('Spring Boot Patrol Proxy note, trying direct AI service...', proxyErr);
        }

        // Direct FastAPI fallback
        try {
            const res = await fetch('http://localhost:8000/api/patrol/routes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                const data = await res.json();
                setRouteData(data);
                toast.success('AI Patrol Route generated successfully! 🚓');
            } else {
                throw new Error('AI Patrol Service returned non-200');
            }
        } catch (err) {
            console.error('Patrol Route error:', err);
            toast.error('Failed to generate route. Ensure AI Service is running.');
        } finally {
            setLoading(false);
            setGenerating(false);
        }
    };

    const handleExportDispatch = () => {
        window.print();
    };

    return (
        <ProtectedRoute>
            <Layout>
                <div className="space-y-6">
                    {/* Page Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                <Compass className="w-7 h-7 text-indigo-600" />
                                Predictive Patrol Dispatch
                            </h1>
                            <p className="text-sm font-medium text-slate-500 mt-0.5">
                                NetworkX spatial graph optimization for high-density crime deterrence patrols
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleExportDispatch}
                                className="border-slate-300 text-slate-700 font-medium"
                            >
                                <Download className="w-4 h-4 mr-1.5" />
                                Print Dispatch Order
                            </Button>
                        </div>
                    </div>

                    {/* Patrol Dispatch Controls Card */}
                    <Card className="bg-white border border-slate-200 shadow-sm p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles className="w-5 h-5 text-indigo-600" />
                            <h3 className="font-bold text-slate-900 text-base">Patrol Unit Deployment Parameters</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                                    Target Jurisdiction
                                </label>
                                <select
                                    value={district}
                                    onChange={(e) => setDistrict(e.target.value)}
                                    className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    {districts.map((d) => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                                    Assigned Unit Call-sign
                                </label>
                                <select
                                    value={unitName}
                                    onChange={(e) => setUnitName(e.target.value)}
                                    className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    {units.map((u) => (
                                        <option key={u} value={u}>{u}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                                    Operational Shift
                                </label>
                                <select
                                    value={shiftTime}
                                    onChange={(e) => setShiftTime(e.target.value)}
                                    className="w-full px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    {shifts.map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end pt-2 border-t border-slate-100">
                            <Button
                                onClick={fetchRoute}
                                isLoading={generating}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-xs"
                            >
                                <Navigation className="w-4 h-4 mr-1.5" />
                                Generate AI Patrol Route
                            </Button>
                        </div>
                    </Card>

                    {/* Patrol Map Component */}
                    {loading ? (
                        <div className="min-h-[400px] flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-slate-200">
                            <Spinner size="lg" />
                            <p className="text-sm font-semibold text-slate-500 mt-3">Computing NetworkX Patrol Graph...</p>
                        </div>
                    ) : routeData ? (
                        <PatrolMap
                            waypoints={routeData.route_points}
                            itinerary={routeData.itinerary}
                            summary={routeData.summary}
                            unitName={unitName}
                            shiftTime={shiftTime}
                        />
                    ) : (
                        <Card className="bg-white border border-slate-200 shadow-sm text-center py-12">
                            <Compass className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                            <p className="font-bold text-slate-800">No patrol route generated</p>
                            <p className="text-xs text-slate-500 mt-1">Select deployment parameters above and click Generate.</p>
                        </Card>
                    )}
                </div>
            </Layout>
        </ProtectedRoute>
    );
}
