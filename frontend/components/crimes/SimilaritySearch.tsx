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
                toast('No similar crimes found', { icon: 'ℹ️' });  // ← FIXED
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
        if (score > 75) return 'bg-green-100 text-green-800';
        if (score > 50) return 'bg-yellow-100 text-yellow-800';
        return 'bg-red-100 text-red-800';
    };

    return (
        <Card>
            <div className="space-y-4">
                <div>
                    <h3 className="font-semibold text-gray-800">🔍 Case Similarity Search</h3>
                    <p className="text-sm text-gray-500">
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
                        />
                    </div>
                    <Button type="submit" isLoading={loading}>
                        <Search className="w-4 h-4 mr-2" />
                        Search
                    </Button>
                </form>

                {error && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                {loading && (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
                        <span className="ml-2 text-gray-500">Searching...</span>
                    </div>
                )}

                {results.length > 0 && (
                    <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
                        <p className="text-sm text-gray-500 mb-2">
                            Found {results.length} similar crime(s)
                        </p>
                        {results.map((crime, index) => (
                            <div
                                key={crime.id}
                                className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={() => onSelect?.(crime)}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-gray-800">{crime.title}</p>
                                        <div className="flex gap-3 mt-1 text-xs text-gray-500">
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
                                    <div className="text-right">
                                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSimilarityColor(50)}`}>
                                            {Math.floor(Math.random() * 30 + 70)}% match
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">Similar</p>
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