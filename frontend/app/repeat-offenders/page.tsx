'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';  // ✅ ADD THIS
import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Input } from '@/components/ui/Input';
import { useRepeatOffenders } from '@/hooks/useRepeatOffenders';
import {
    AlertTriangle,
    User,
    Calendar,
    MapPin,
    TrendingUp,
    Search,
    Eye,
    ArrowUpDown
} from 'lucide-react';

export default function RepeatOffendersPage() {
    const router = useRouter();  // ✅ ADD THIS
    const { stats, offenders, loading, getRiskColor, getRiskBadge } = useRepeatOffenders();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'crimeCount' | 'name' | 'lastCrimeDate'>('crimeCount');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const filteredOffenders = offenders.filter(o =>
        o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.badgeNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedOffenders = [...filteredOffenders].sort((a, b) => {
        if (sortBy === 'crimeCount') {
            return sortOrder === 'desc' ? b.crimeCount - a.crimeCount : a.crimeCount - b.crimeCount;
        }
        if (sortBy === 'name') {
            return sortOrder === 'desc' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
        }
        return sortOrder === 'desc'
            ? b.lastCrimeDate.localeCompare(a.lastCrimeDate)
            : a.lastCrimeDate.localeCompare(b.lastCrimeDate);
    });

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

    return (
        <ProtectedRoute>
            <Layout>
                <div className="space-y-6">
                    {/* Header */}
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">🔄 Repeat Offenders</h1>
                        <p className="text-sm text-gray-500">
                            Track criminals with multiple offenses and high-risk patterns
                        </p>
                    </div>

                    {/* Stats Cards */}
                    {stats && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card className="text-center">
                                <p className="text-2xl font-bold text-gray-800">{stats.totalOffenders}</p>
                                <p className="text-sm text-gray-500">Total Offenders</p>
                            </Card>
                            <Card className="text-center border-l-4 border-l-red-500">
                                <p className="text-2xl font-bold text-status-critical">{stats.highRiskCount}</p>
                                <p className="text-sm text-gray-500">High Risk</p>
                            </Card>
                            <Card className="text-center border-l-4 border-l-status-medium">
                                <p className="text-2xl font-bold text-status-medium">{stats.mediumRiskCount}</p>
                                <p className="text-sm text-gray-500">Medium Risk</p>
                            </Card>
                            <Card className="text-center border-l-4 border-l-status-low">
                                <p className="text-2xl font-bold text-status-low">{stats.lowRiskCount}</p>
                                <p className="text-sm text-gray-500">Low Risk</p>
                            </Card>
                        </div>
                    )}

                    {/* Search & Filter */}
                    <div className="flex flex-wrap gap-3">
                        <div className="flex-1 min-w-[200px]">
                            <Input
                                placeholder="Search by name or badge..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                icon={<Search className="w-4 h-4" />}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    if (sortBy === 'crimeCount') {
                                        setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
                                    } else {
                                        setSortBy('crimeCount');
                                        setSortOrder('desc');
                                    }
                                }}
                                className={sortBy === 'crimeCount' ? 'bg-primary-50' : ''}
                            >
                                <ArrowUpDown className="w-4 h-4 mr-1" />
                                Crimes
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    if (sortBy === 'name') {
                                        setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
                                    } else {
                                        setSortBy('name');
                                        setSortOrder('asc');
                                    }
                                }}
                                className={sortBy === 'name' ? 'bg-primary-50' : ''}
                            >
                                <ArrowUpDown className="w-4 h-4 mr-1" />
                                Name
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    if (sortBy === 'lastCrimeDate') {
                                        setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
                                    } else {
                                        setSortBy('lastCrimeDate');
                                        setSortOrder('desc');
                                    }
                                }}
                                className={sortBy === 'lastCrimeDate' ? 'bg-primary-50' : ''}
                            >
                                <ArrowUpDown className="w-4 h-4 mr-1" />
                                Date
                            </Button>
                        </div>
                    </div>

                    {/* Offenders List */}
                    <Card>
                        {sortedOffenders.length === 0 ? (
                            <div className="text-center py-12">
                                <AlertTriangle className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                <p className="text-gray-500">No repeat offenders found</p>
                                <p className="text-xs text-gray-400 mt-1">Try adjusting your search</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {sortedOffenders.map((offender) => (
                                    <div
                                        key={offender.id}
                                        className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            {/* Left */}
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-lg">
                                                    {offender.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-800">{offender.name}</h3>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        <Badge variant="default" className="text-xs">
                                                            {offender.crimeCount} offenses
                                                        </Badge>
                                                        <Badge variant={offender.riskLevel.toLowerCase() as any}>
                                                            {getRiskBadge(offender.riskLevel)}
                                                        </Badge>
                                                        {offender.badgeNumber && (
                                                            <span className="text-xs text-gray-400">Badge: {offender.badgeNumber}</span>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            First: {offender.firstCrimeDate}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            Last: {offender.lastCrimeDate}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" />
                                                            {offender.crimes[0]?.district || 'Unknown'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Right */}
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => router.push(`/repeat-offenders/${offender.id}`)}
                                                >
                                                    <Eye className="w-4 h-4 mr-1" />
                                                    View Details
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Recent Crimes */}
                                        {offender.crimes.length > 0 && (
                                            <div className="mt-3 pt-3 border-t border-gray-100">
                                                <p className="text-xs font-medium text-gray-500 mb-2">Recent Offenses:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {offender.crimes.slice(0, 3).map((crime) => (
                                                        <Badge key={crime.id} variant="default" className="text-xs">
                                                            {crime.title}
                                                        </Badge>
                                                    ))}
                                                    {offender.crimes.length > 3 && (
                                                        <Badge variant="default" className="text-xs">
                                                            +{offender.crimes.length - 3} more
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        )}
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