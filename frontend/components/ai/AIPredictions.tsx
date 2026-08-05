'use client';

import React, { useState } from 'react';
import { PredictionResponse } from '@/services/aiService';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useAI } from '@/hooks/useAI';
import { Sparkles, MapPin, Target, BrainCircuit } from 'lucide-react';
import toast from 'react-hot-toast';

export const AIPredictions: React.FC = () => {
    const { predictCrimes, predicting } = useAI();
    const [predictions, setPredictions] = useState<PredictionResponse[]>([]);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    const presetLocations = [
        { name: 'Bangalore Center', lat: '12.9716', lng: '77.5946' },
        { name: 'Indiranagar', lat: '12.9784', lng: '77.6408' },
        { name: 'Electronic City', lat: '12.8399', lng: '77.6770' },
        { name: 'Koramangala', lat: '12.9352', lng: '77.6245' },
    ];

    const handlePredict = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!latitude || !longitude) {
            toast.error('Please enter latitude and longitude');
            return;
        }

        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);

        if (isNaN(lat) || isNaN(lng)) {
            toast.error('Please enter valid numerical coordinates');
            return;
        }

        try {
            const results = await predictCrimes([
                {
                    latitude: lat,
                    longitude: lng,
                    date: new Date().toISOString().split('T')[0],
                },
            ]);

            setPredictions(results);
            toast.success('AI Prediction analysis complete! 🎯');
        } catch (error) {
            toast.error('AI Prediction failed');
        }
    };

    const fillPreset = (lat: string, lng: string) => {
        setLatitude(lat);
        setLongitude(lng);
    };

    return (
        <div className="space-y-4">
            {/* Prediction Form Card */}
            <Card className="bg-white border border-slate-200 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-1">
                    <BrainCircuit className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-bold text-slate-900 text-base">Predict Geo Risk Index</h3>
                </div>
                <p className="text-xs font-medium text-slate-500 mb-4">
                    Enter target coordinates or select a location preset to compute real-time AI crime risk.
                </p>

                {/* Preset Chips */}
                <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">Presets:</span>
                    {presetLocations.map((loc) => (
                        <button
                            key={loc.name}
                            type="button"
                            onClick={() => fillPreset(loc.lat, loc.lng)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-600 rounded-lg text-xs font-semibold border border-slate-200 transition-colors shrink-0 flex items-center gap-1"
                        >
                            <MapPin className="w-3 h-3" />
                            {loc.name}
                        </button>
                    ))}
                </div>

                <form onSubmit={handlePredict} className="flex flex-wrap items-end gap-3">
                    <div className="flex-1 min-w-[160px]">
                        <Input
                            label="Latitude"
                            type="number"
                            step="any"
                            placeholder="12.9716"
                            value={latitude}
                            onChange={(e) => setLatitude(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex-1 min-w-[160px]">
                        <Input
                            label="Longitude"
                            type="number"
                            step="any"
                            placeholder="77.5946"
                            value={longitude}
                            onChange={(e) => setLongitude(e.target.value)}
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        isLoading={predicting}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-[42px] px-6"
                    >
                        <Sparkles className="w-4 h-4 mr-1" />
                        Run AI Model
                    </Button>
                </form>
            </Card>

            {/* Prediction Results */}
            {predictions && predictions.length > 0 && (
                <Card title="📊 Risk Analysis Output" className="bg-white border border-slate-200 shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {predictions.map((pred, index) => (
                            <div
                                key={index}
                                className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Location Sector #{index + 1}</p>
                                        <p className="text-xs font-mono font-bold text-slate-700 mt-0.5">
                                            📍 {pred.latitude.toFixed(4)}, {pred.longitude.toFixed(4)}
                                        </p>
                                    </div>
                                    <Badge variant={pred.risk_level.toLowerCase() as any}>
                                        {pred.risk_level} RISK
                                    </Badge>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                                        <span>Calculated Risk Index</span>
                                        <span className="text-base text-slate-900 font-extrabold">{pred.predicted_risk}%</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2.5 mt-1.5 overflow-hidden">
                                        <div
                                            className={`h-2.5 rounded-full transition-all duration-500 ${
                                                pred.predicted_risk > 75 ? 'bg-rose-500' :
                                                pred.predicted_risk > 50 ? 'bg-amber-500' :
                                                pred.predicted_risk > 25 ? 'bg-yellow-500' : 'bg-emerald-500'
                                            }`}
                                            style={{ width: `${pred.predicted_risk}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 pt-1">
                                    <span>AI Model Confidence: <strong>{(pred.confidence * 100).toFixed(0)}%</strong></span>
                                    <span>Date: {pred.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
};