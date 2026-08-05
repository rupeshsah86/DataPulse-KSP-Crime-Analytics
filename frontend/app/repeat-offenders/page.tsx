'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
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
    Search,
    Eye,
    ArrowUpDown,
    ShieldAlert,
    Users,
    Activity,
    ChevronRight,
} from 'lucide-react';

export default function RepeatOffendersPage() {
    const router = useRouter();
    const { stats, offenders, loading, getRiskBadge } = useRepeatOffenders();
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
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                <Users className="w-7 h-7 text-indigo-600" />
                                Repeat Offender Intelligence
                            </h1>
                            <p className="text-sm font-medium text-slate-500 mt-0.5">
                                Track habitual offenders, criminal history, and high-risk repeat patterns
                            </p>
                        </div>
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-xs font-bold">
                            Active Criminal Profiling
                        </span>
                    </div>

                    {/* Stats Cards */}
                    {stats && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between border-l-4 border-l-indigo-600">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Offenders</p>
                                    <p className="text-2xl font-extrabold text-slate-900 mt-1">{stats.totalOffenders}</p>
                                </div>
                                <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                    <Users className="w-5 h-5" />
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between border-l-4 border-l-rose-500">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">High Risk (Critical)</p>
                                    <p className="text-2xl font-extrabold text-rose-600 mt-1">{stats.highRiskCount}</p>
                                </div>
                                <div className="w-11 h-11 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
                                    <ShieldAlert className="w-5 h-5" />
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between border-l-4 border-l-amber-500">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Medium Risk</p>
                                    <p className="text-2xl font-extrabold text-amber-600 mt-1">{stats.mediumRiskCount}</p>
                                </div>
                                <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                                    <AlertTriangle className="w-5 h-5" />
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between border-l-4 border-l-emerald-600">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Low Risk</p>
                                    <p className="text-2xl font-extrabold text-emerald-600 mt-1">{stats.lowRiskCount}</p>
                                </div>
                                <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                                    <Activity className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Search & Filter Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex-1 min-w-[240px]">
                            <Input
                                placeholder="Search offender by name or criminal badge ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                icon={<Search className="w-4 h-4 text-slate-400" />}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sort By:</span>
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
                                className={sortBy === 'crimeCount' ? 'bg-indigo-50 text-indigo-700 border-indigo-300 font-bold' : 'border-slate-300 text-slate-700 font-medium'}
                            >
                                <ArrowUpDown className="w-4 h-4 mr-1" />
                                Offenses Count
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
                                className={sortBy === 'name' ? 'bg-indigo-50 text-indigo-700 border-indigo-300 font-bold' : 'border-slate-300 text-slate-700 font-medium'}
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
                                className={sortBy === 'lastCrimeDate' ? 'bg-indigo-50 text-indigo-700 border-indigo-300 font-bold' : 'border-slate-300 text-slate-700 font-medium'}
                            >
                                <ArrowUpDown className="w-4 h-4 mr-1" />
                                Latest Date
                            </Button>
                        </div>
                    </div>

                    {/* Offenders List */}
                    <Card className="bg-white border border-slate-200 shadow-sm p-4">
                        {sortedOffenders.length === 0 ? (
                            <div className="text-center py-12">
                                <AlertTriangle className="w-12 h-12 mx-auto text-slate-400 mb-3" />
                                <p className="text-slate-800 font-bold">No repeat offenders matched</p>
                                <p className="text-xs text-slate-500 mt-1">Try adjusting your search filter or badge ID.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {sortedOffenders.map((offender) => {
                                    const isCritical = offender.riskLevel === 'CRITICAL';
                                    const isHigh = offender.riskLevel === 'HIGH';
                                    return (
                                        <div
                                            key={offender.id}
                                            className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-all duration-200 shadow-xs"
                                        >
                                            <div className="flex flex-wrap items-start justify-between gap-4">
                                                {/* Offender Info Header */}
                                                <div className="flex items-start gap-4">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-2xl flex items-center justify-center font-extrabold text-lg shadow-sm shrink-0">
                                                        <User className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-extrabold text-slate-900 text-base">{offender.name}</h3>
                                                            {offender.badgeNumber && (
                                                                <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md text-[11px] font-mono font-bold">
                                                                    ID: {offender.badgeNumber}
                                                                </span>
                                                            )}
                                                        </div>

                                                        <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                                            <span className="px-2.5 py-0.5 rounded-full bg-slate-900 text-white text-xs font-extrabold">
                                                                {offender.crimeCount} Offenses Logged
                                                            </span>
                                                            <Badge variant={offender.riskLevel.toLowerCase() as any}>
                                                                {getRiskBadge(offender.riskLevel)}
                                                            </Badge>
                                                        </div>

                                                        <div className="flex flex-wrap gap-4 mt-3 text-xs font-semibold text-slate-500">
                                                            <span className="flex items-center gap-1.5">
                                                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                                First Logged: <strong className="text-slate-700">{offender.firstCrimeDate}</strong>
                                                            </span>
                                                            <span className="flex items-center gap-1.5">
                                                                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                                                                Last Activity: <strong className="text-slate-700">{offender.lastCrimeDate}</strong>
                                                            </span>
                                                            <span className="flex items-center gap-1.5">
                                                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                                                Primary Jurisdiction: <strong className="text-slate-700">{offender.crimes[0]?.district || 'Bangalore Urban'}</strong>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Action Button */}
                                                <div>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => router.push(`/repeat-offenders/${offender.id}`)}
                                                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
                                                    >
                                                        <Eye className="w-4 h-4 mr-1" />
                                                        View Full Dossier
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Recent Crime Pills */}
                                            {offender.crimes.length > 0 && (
                                                <div className="mt-4 pt-3 border-t border-slate-200/80">
                                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Recent Associated Offenses:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {offender.crimes.slice(0, 3).map((crime) => (
                                                            <span
                                                                key={crime.id}
                                                                className="px-3 py-1 bg-white border border-slate-200 text-slate-800 rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5"
                                                            >
                                                                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                                                                {crime.title}
                                                            </span>
                                                        ))}
                                                        {offender.crimes.length > 3 && (
                                                            <span className="px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-xl text-xs font-bold">
                                                                +{offender.crimes.length - 3} more crimes
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </Card>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}