'use client';

import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { StateFilter } from '@/components/analytics/StateFilter';
import { StateComparisonChart, StateDataPoint } from '@/components/analytics/StateComparisonChart';
import { Globe, TrendingUp, ShieldAlert, CheckCircle2, MapPin, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function MultiStateAnalyticsPage() {
  const [selectedState, setSelectedState] = useState('All States');
  const [loading, setLoading] = useState(true);
  const [statesData, setStatesData] = useState<StateDataPoint[]>([]);

  useEffect(() => {
    fetchMultiStateData();
  }, []);

  const fetchMultiStateData = async () => {
    try {
      const res = await fetch('http://localhost:8083/api/v1/analytics/multi-state');
      if (res.ok) {
        const payload = await res.json();
        if (payload.success && payload.data?.statesData) {
          setStatesData(payload.data.statesData);
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.warn('Backend unavailable. Using comparative multi-state fallback data.');
    }

    // Default comparative fallback dataset across Indian states
    const fallback: StateDataPoint[] = [
      { state: 'Karnataka', totalCrimes: 39, criticalCrimes: 8, highCrimes: 14, resolutionRate: 10.3 },
      { state: 'Maharashtra', totalCrimes: 45, criticalCrimes: 11, highCrimes: 18, resolutionRate: 15.2 },
      { state: 'Tamil Nadu', totalCrimes: 32, criticalCrimes: 6, highCrimes: 11, resolutionRate: 18.4 },
      { state: 'Telangana', totalCrimes: 28, criticalCrimes: 5, highCrimes: 9, resolutionRate: 12.1 },
      { state: 'Kerala', totalCrimes: 22, criticalCrimes: 3, highCrimes: 7, resolutionRate: 24.8 },
      { state: 'Delhi', totalCrimes: 54, criticalCrimes: 16, highCrimes: 22, resolutionRate: 8.9 },
    ];
    setStatesData(fallback);
    setLoading(false);
  };

  const displayedData = selectedState === 'All States'
    ? statesData
    : statesData.filter((d) => d.state === selectedState);

  const totalNational = statesData.reduce((acc, curr) => acc + curr.totalCrimes, 0);
  const totalCritical = statesData.reduce((acc, curr) => acc + curr.criticalCrimes, 0);

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Link
                href="/analytics"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mb-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Standard Analytics
              </Link>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Globe className="w-7 h-7 text-indigo-600" />
                Multi-State Crime Analytics & Inter-State Intelligence
              </h1>
              <p className="text-sm font-medium text-slate-500 mt-0.5">
                Cross-jurisdictional crime volume comparison, critical incident density, and state resolution benchmarks
              </p>
            </div>
            <StateFilter selectedState={selectedState} onStateChange={setSelectedState} />
          </div>

          {/* National Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between border-l-4 border-l-indigo-600">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Tracked National Crimes</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">{totalNational}</p>
              </div>
              <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <Globe className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between border-l-4 border-l-rose-500">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Inter-State Criticals</p>
                <p className="text-2xl font-extrabold text-rose-600 mt-1">{totalCritical}</p>
              </div>
              <div className="w-11 h-11 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
                <ShieldAlert className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between border-l-4 border-l-amber-500">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">States Tracked</p>
                <p className="text-2xl font-extrabold text-slate-900 mt-1">{statesData.length} States</p>
              </div>
              <div className="w-11 h-11 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                <MapPin className="w-5 h-5" />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between border-l-4 border-l-emerald-600">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Benchmark State</p>
                <p className="text-xl font-extrabold text-emerald-600 mt-1">Kerala (24.8%)</p>
              </div>
              <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Comparative Chart Card */}
          <Card title="📊 State-by-State Crime Volume & Resolution Comparison" subtitle="Comparative analysis of incident density and case resolution efficiency" className="bg-white border border-slate-200 shadow-sm p-4">
            {loading ? (
              <div className="h-[360px] flex items-center justify-center">
                <Spinner size="lg" />
              </div>
            ) : (
              <StateComparisonChart data={displayedData} />
            )}
          </Card>

          {/* State Comparison Table */}
          <Card title="📋 State Jurisdiction Benchmark Summary" subtitle="Detailed breakdown of state crime counts, high-risk cases, and resolution rates" className="bg-white border border-slate-200 shadow-sm p-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-3">Rank</th>
                    <th className="p-3">State / Jurisdiction</th>
                    <th className="p-3 text-right">Total Crimes</th>
                    <th className="p-3 text-right">Critical Cases</th>
                    <th className="p-3 text-right">High Risk</th>
                    <th className="p-3 text-right">Resolution Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-800">
                  {statesData.map((row, idx) => (
                    <tr key={row.state} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-bold text-slate-500">#{idx + 1}</td>
                      <td className="p-3 font-bold text-slate-900 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                        {row.state}
                      </td>
                      <td className="p-3 text-right font-extrabold text-slate-900">{row.totalCrimes}</td>
                      <td className="p-3 text-right font-extrabold text-rose-600">{row.criticalCrimes}</td>
                      <td className="p-3 text-right font-bold text-amber-600">{row.highCrimes}</td>
                      <td className="p-3 text-right font-extrabold text-emerald-600">{row.resolutionRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
