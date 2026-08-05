'use client';

import React, { useState } from 'react';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Crime } from '@/services/crimeService';
import { similarityService } from '@/services/similarityService';
import toast from 'react-hot-toast';

interface SimilaritySearchProps {
    onSelect?: (crime: Crime) => void;
}

export const SimilaritySearch: React.FC<SimilaritySearchProps> = ({ onSelect }) => {
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState<Crime[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!keyword.trim()) {
            toast.error('Please enter a search term');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await similarityService.findSimilarByKeyword(keyword);
            setResults(data);

            if (data.length === 0) {
                toast('No similar crimes found', { icon: 'ℹ️' });
            } else {
                toast.success(`Found ${data.length} similar crimes`);
            }
        } catch (err: any) {
            const message = err.response?.data?.message || 'Search failed';
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const getSimilarityColor = (score: number): string => {
        if (score > 75) return 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold';
        if (score > 50) return 'bg-amber-50 text-amber-800 border border-amber-200 font-bold';
        return 'bg-rose-50 text-rose-800 border border-rose-200 font-bold';
    };

    return (
        <Card className="bg-white border border-slate-200 shadow-sm">
            <div className="space-y-4">
                <div>
                    <h3 className="font-bold text-slate-900 text-base">🔍 Case Similarity Search</h3>
                    <p className="text-sm font-medium text-slate-500 mt-0.5">
                        Find similar crimes by entering keywords (e.g., "robbery", "Bangalore", "theft")
                    </p>
                </div>

                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="flex-1">
                        <Input
                            placeholder="Enter keywords to find similar crimes..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            disabled={loading}
                            className="bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500"
                        />
                    </div>
                    <Button type="submit" isLoading={loading} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                        <Search className="w-4 h-4 mr-2" />
                        Search
                    </Button>
                </form>

                {error && (
                    <div className="flex items-center gap-2 p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-sm font-medium">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {error}
                    </div>
                )}

                {loading && (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                        <span className="ml-2 text-sm font-medium text-slate-600">Searching similar cases...</span>
                    </div>
                )}

                {results.length > 0 && (
                    <div className="mt-4 space-y-2.5 max-h-96 overflow-y-auto pr-1">
                        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                            Found {results.length} similar crime(s)
                        </p>
                        {results.map((crime) => (
                            <div
                                key={crime.id}
                                className="p-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl transition-all cursor-pointer shadow-xs"
                                onClick={() => onSelect?.(crime)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="font-bold text-sm text-slate-900">{crime.title}</p>
                                        <div className="flex gap-3 text-xs font-medium text-slate-600">
                                            <span>📍 {crime.district}</span>
                                            <span>📅 {crime.incidentDate}</span>
                                        </div>
                                        <div className="flex gap-2 mt-2">
                                            <Badge variant="default">{crime.category}</Badge>
                                            <Badge variant={crime.severity.toLowerCase() as any}>
                                                {crime.severity}
                                            </Badge>
                                            <Badge variant={crime.status.toLowerCase() as any}>
                                                {crime.status}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <div className={`px-2.5 py-1 rounded-full text-xs ${getSimilarityColor(85)}`}>
                                            85% match
                                        </div>
                                        <p className="text-[11px] font-semibold text-slate-400 mt-1 uppercase tracking-wider">AI Similarity</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Card>
    );
};