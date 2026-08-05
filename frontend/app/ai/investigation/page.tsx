'use client';

import React from 'react';
import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth';
import { InvestigationAssistant } from '@/components/ai/InvestigationAssistant';
import { Sparkles, ArrowLeft, Bot, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function InvestigationPage() {
    return (
        <ProtectedRoute>
            <Layout>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Link
                                    href="/ai"
                                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                                >
                                    <ArrowLeft className="w-3.5 h-3.5" />
                                    Back to AI Analytics
                                </Link>
                            </div>
                            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                <Bot className="w-7 h-7 text-indigo-600" />
                                AI Investigation Assistant
                            </h1>
                            <p className="text-sm font-medium text-slate-500 mt-0.5">
                                Automated case briefing, tactical lead generation, accomplice network analysis, and precedent case matching
                            </p>
                        </div>
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-xs font-bold flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                            Groq Llama-3.3 Intelligence
                        </span>
                    </div>

                    {/* Investigation Assistant Component */}
                    <InvestigationAssistant />
                </div>
            </Layout>
        </ProtectedRoute>
    );
}
