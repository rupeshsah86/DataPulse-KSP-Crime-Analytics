'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { crimeService, Crime } from '@/services/crimeService';
import { Sparkles, FileText, CheckCircle2, ShieldAlert, Users, Compass, ChevronRight, Loader2, RefreshCw, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

interface AnalysisResult {
  summary: string;
  leads: string[];
  relationships: {
    network_analysis: string;
    suspect_type: string;
    accomplice_probability: string;
    geographic_radius: string;
  };
  similar_cases: Array<{
    id: string | number;
    crimeNumber: string;
    title: string;
    category: string;
    severity: string;
    district: string;
    similarity_score: number;
    match_reason: string;
  }>;
}

export const InvestigationAssistant: React.FC = () => {
  const [crimes, setCrimes] = useState<Crime[]>([]);
  const [selectedCrimeId, setSelectedCrimeId] = useState<string>('');
  const [customCrime, setCustomCrime] = useState({
    title: 'Bank Robbery on MG Road',
    category: 'ROBBERY',
    severity: 'CRITICAL',
    district: 'Bangalore Urban',
    description: 'Masked armed assailants breached main vault area during cash delivery hours.',
    status: 'OPEN',
    reportedBy: 'Inspector Sharma'
  });

  const [useCustom, setUseCustom] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  useEffect(() => {
    fetchCrimes();
  }, []);

  const fetchCrimes = async () => {
    try {
      const data = await crimeService.getAll();
      setCrimes(data);
      if (data.length > 0) {
        setSelectedCrimeId(String(data[0].id));
      }
    } catch (err) {
      console.error('Failed to fetch crimes for assistant', err);
    }
  };

  const handleRunAnalysis = async () => {
    setAnalyzing(true);
    setAnalysis(null);

    let targetCrimeData: any = customCrime;
    if (!useCustom && selectedCrimeId) {
      const found = crimes.find((c) => String(c.id) === selectedCrimeId);
      if (found) {
        targetCrimeData = found;
      }
    }

    try {
      const res = await fetch('http://localhost:8000/api/investigation/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          crime: targetCrimeData,
          historical_crimes: crimes
        })
      });

      if (!res.ok) {
        throw new Error(`AI service responded with status ${res.status}`);
      }

      const data = await res.json();
      setAnalysis(data);
      toast.success('Investigation analysis complete! 🎯');
    } catch (err: any) {
      console.error('Analysis error:', err);
      toast.error('Failed to run AI investigation. Ensure AI Service is running on port 8000.');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Case Input Selector */}
      <Card className="bg-white border border-slate-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-base">Select Case for AI Investigation</h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setUseCustom(false)}
              className={`px-3 py-1 rounded-lg transition-colors ${!useCustom ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-100 text-slate-600'}`}
            >
              Select Active Case ({crimes.length})
            </button>
            <button
              type="button"
              onClick={() => setUseCustom(true)}
              className={`px-3 py-1 rounded-lg transition-colors ${useCustom ? 'bg-indigo-600 text-white font-bold' : 'bg-slate-100 text-slate-600'}`}
            >
              Custom Scenario
            </button>
          </div>
        </div>

        {!useCustom ? (
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex-1 min-w-[280px]">
              <select
                value={selectedCrimeId}
                onChange={(e) => setSelectedCrimeId(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {crimes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.crimeNumber || `CRIME-${c.id}`} • {c.title} ({c.category} - {c.district})
                  </option>
                ))}
              </select>
            </div>
            <Button
              onClick={handleRunAnalysis}
              isLoading={analyzing}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-[42px] px-6"
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              Analyze Case Leads
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Case Title"
                value={customCrime.title}
                onChange={(e) => setCustomCrime({ ...customCrime, title: e.target.value })}
              />
              <Input
                label="Category"
                value={customCrime.category}
                onChange={(e) => setCustomCrime({ ...customCrime, category: e.target.value })}
              />
              <Input
                label="District"
                value={customCrime.district}
                onChange={(e) => setCustomCrime({ ...customCrime, district: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Incident Description & Modus Operandi
              </label>
              <textarea
                rows={2}
                value={customCrime.description}
                onChange={(e) => setCustomCrime({ ...customCrime, description: e.target.value })}
                className="w-full p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex justify-end">
              <Button
                onClick={handleRunAnalysis}
                isLoading={analyzing}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6"
              >
                <Sparkles className="w-4 h-4 mr-1.5" />
                Analyze Custom Scenario
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Analysis Output Section */}
      {analysis && (
        <div className="space-y-6 animate-fadeIn">
          {/* Executive Summary */}
          <Card title="📋 Executive Case Summary" subtitle="Structured AI briefing & operational risk assessment" className="bg-white border border-slate-200 shadow-sm">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 leading-relaxed font-medium whitespace-pre-line">
              {analysis.summary}
            </div>
          </Card>

          {/* Tactical Leads & Network Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tactical Leads */}
            <Card title="🎯 Actionable Investigation Leads" subtitle="Prioritized field actions & interrogation angles" className="bg-white border border-slate-200 shadow-sm">
              <div className="space-y-3">
                {analysis.leads.map((lead, idx) => (
                  <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3 text-xs font-semibold text-slate-800">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{lead}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Network & Accomplice Analysis */}
            <Card title="🕸️ Criminal Network & Relationship Analysis" subtitle="Accomplice probability & geographic radius" className="bg-white border border-slate-200 shadow-sm">
              <div className="space-y-4 text-xs">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="font-bold text-slate-500 uppercase tracking-wider">Network Insights:</span>
                  <p className="font-semibold text-slate-800 text-sm leading-relaxed">
                    {analysis.relationships.network_analysis}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
                    <p className="font-bold text-indigo-900">{analysis.relationships.suspect_type}</p>
                    <p className="text-[11px] font-semibold text-indigo-600 uppercase">Suspect Profile</p>
                  </div>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="font-bold text-amber-900">{analysis.relationships.accomplice_probability}</p>
                    <p className="text-[11px] font-semibold text-amber-600 uppercase">Gang / Network</p>
                  </div>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <p className="font-bold text-emerald-900">{analysis.relationships.geographic_radius}</p>
                    <p className="text-[11px] font-semibold text-emerald-600 uppercase">Radius</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Similar Precedent Cases */}
          {analysis.similar_cases && analysis.similar_cases.length > 0 && (
            <Card title="🔁 Recommended Similar Precedent Cases" subtitle="Historical matching cases based on M.O. and district" className="bg-white border border-slate-200 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {analysis.similar_cases.map((match) => (
                  <div key={match.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-indigo-600 text-white rounded-md text-[10px] font-mono font-bold">
                        {match.similarity_score}% Match
                      </span>
                      <Badge variant={match.severity?.toLowerCase() as any}>
                        {match.severity}
                      </Badge>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm truncate">{match.title}</h4>
                    <p className="text-xs font-semibold text-slate-500">
                      {match.category} • {match.district}
                    </p>
                    <p className="text-[11px] font-medium text-slate-600 pt-1 border-t border-slate-200">
                      💡 {match.match_reason}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
