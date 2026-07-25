'use client';

import React, { useState } from 'react';
import { PredictionResponse } from '@/services/aiService';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { useAI } from '@/hooks/useAI';
import toast from 'react-hot-toast';

export const AIPredictions: React.FC = () => {
    const { predictCrimes, predicting, getRiskColor, getRiskLabel } = useAI();
    const [predictions, setPredictions] = useState<PredictionResponse[]>([]);
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');

    const handlePredict = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!latitude || !longitude) {
            toast.error('Please enter latitude and longitude');
            return;
        }

        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);

        if (isNaN(lat) || isNaN(lng)) {
            toast.error('Please enter valid numbers');
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

            console.log('🔍 Results received:', results);
            setPredictions(results);
            toast.success('Prediction complete! 🎉');
        } catch (error) {
            console.error('❌ Prediction error:', error);
            toast.error('Prediction failed');
        }
    };

    return (
        <div className="space-y-4">
            {/* Prediction Form */}
            <Card>
                <h3 className="font-semibold text-gray-800 mb-3">Predict Crime Risk</h3>
                <p className="text-sm text-gray-500 mb-4">
                    Enter coordinates to predict crime risk for a specific location.
                </p>

                <form onSubmit={handlePredict} className="flex flex-wrap gap-3">
                    <div className="flex-1 min-w-[150px]">
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
                    <div className="flex-1 min-w-[150px]">
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
                    <div className="flex items-end">
                        <Button type="submit" isLoading={predicting}>
                            Predict Risk
                        </Button>
                    </div>
                </form>
            </Card>

            {/* Prediction Results */}
            {predictions && predictions.length > 0 && (
                <Card title="📊 Prediction Results">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {predictions.map((pred, index) => (
                            <div
                                key={index}
                                className="p-4 rounded-lg border border-gray-200"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Location #{index + 1}</p>
                                        <p className="text-xs text-gray-400">
                                            📍 {pred.latitude.toFixed(4)}, {pred.longitude.toFixed(4)}
                                        </p>
                                    </div>
                                    <Badge variant={pred.risk_level.toLowerCase() as any}>
                                        {pred.risk_level}
                                    </Badge>
                                </div>

                                <div className="mt-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Risk Score</span>
                                        <span className="text-lg font-bold text-gray-800">
                                            {pred.predicted_risk}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                        <div
                                            className={`h-2 rounded-full transition-all duration-500 ${pred.predicted_risk > 75 ? 'bg-status-critical' :
                                                    pred.predicted_risk > 50 ? 'bg-status-high' :
                                                        pred.predicted_risk > 25 ? 'bg-status-medium' :
                                                            'bg-status-low'
                                                }`}
                                            style={{ width: `${pred.predicted_risk}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                                    <span>Confidence: {(pred.confidence * 100).toFixed(0)}%</span>
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