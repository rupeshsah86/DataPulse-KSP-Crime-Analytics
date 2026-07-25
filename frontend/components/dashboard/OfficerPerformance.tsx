'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Trophy, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { officerService, type OfficerPerformance as OfficerPerformanceType } from '@/services/officerService';
import toast from 'react-hot-toast';
import { Spinner } from '@/components/ui/Spinner';

interface OfficerPerformanceProps {
    limit?: number;
}

export const OfficerPerformance: React.FC<OfficerPerformanceProps> = ({ limit = 5 }) => {
    const [officers, setOfficers] = useState<OfficerPerformanceType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOfficers();
    }, []);

    const loadOfficers = async () => {
        setLoading(true);
        try {
            const data = await officerService.getTopPerformers(limit);
            setOfficers(data);
        } catch (error) {
            console.error('Failed to load officer performance:', error);
            toast.error('Failed to load officer performance');
            setOfficers([]);
        } finally {
            setLoading(false);
        }
    };

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
            case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
            default: return <Minus className="w-4 h-4 text-yellow-500" />;
        }
    };

    const getRankColor = (rank: number) => {
        switch (rank) {
            case 1: return 'text-yellow-500';
            case 2: return 'text-gray-400';
            case 3: return 'text-amber-600';
            default: return 'text-gray-300';
        }
    };

    if (loading) {
        return (
            <Card>
                <div className="flex items-center justify-center py-8">
                    <Spinner size="md" />
                </div>
            </Card>
        );
    }

    if (officers.length === 0) {
        return (
            <Card>
                <div className="text-center py-8 text-gray-500">
                    No officer performance data available
                </div>
            </Card>
        );
    }

    return (
        <Card>
            <div className="flex items-center justify-between mb-4">
                <div>
                    <h3 className="font-semibold text-gray-800">👮 Officer Performance</h3>
                    <p className="text-xs text-gray-500">Top performing officers based on real data</p>
                </div>
                <Trophy className="w-5 h-5 text-yellow-500" />
            </div>

            <div className="space-y-3">
                {officers.map((item) => (
                    <div
                        key={item.officer.name}
                        className="flex items-center gap-4 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                        {/* Rank */}
                        <div className={`text-xl font-bold ${getRankColor(item.rank)} w-8 text-center`}>
                            #{item.rank}
                        </div>

                        {/* Avatar */}
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold">
                            {item.officer.name.charAt(0)}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <p className="font-medium text-gray-800 text-sm truncate">
                                    {item.officer.name}
                                </p>
                                <Badge variant="default" className="text-xs">
                                    {item.officer.designation}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                                <span>📋 {item.officer.totalCases} cases</span>
                                <span>✅ {item.officer.resolvedCases} resolved</span>
                                <span>📊 {item.officer.resolutionRate.toFixed(1)}% rate</span>
                            </div>
                        </div>

                        {/* Trend */}
                        <div className="text-right">
                            <div className="flex items-center gap-1">
                                {getTrendIcon(item.trend)}
                                <span className={`text-sm font-medium ${item.trend === 'up' ? 'text-green-600' :
                                        item.trend === 'down' ? 'text-red-600' :
                                            'text-yellow-600'
                                    }`}>
                                    {item.change > 0 ? '+' : ''}{item.change}%
                                </span>
                            </div>
                            <p className="text-xs text-gray-400">vs last month</p>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};