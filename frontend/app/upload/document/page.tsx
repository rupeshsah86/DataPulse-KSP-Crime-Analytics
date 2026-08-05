'use client';

import React from 'react';
import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth';
import { DocumentUpload } from '@/components/upload/DocumentUpload';
import { FileText, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function DocumentScanPage() {
    return (
        <ProtectedRoute>
            <Layout>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <Link
                                href="/upload"
                                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mb-1"
                            >
                                <ArrowLeft className="w-3.5 h-3.5" />
                                Back to Data Upload Center
                            </Link>
                            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                <FileText className="w-7 h-7 text-indigo-600" />
                                FIR Document OCR Scanner
                            </h1>
                            <p className="text-sm font-medium text-slate-500 mt-0.5">
                                Optical character recognition & Groq LLM field extraction for First Information Reports (FIRs)
                            </p>
                        </div>
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-xs font-bold flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                            Tesseract OCR & Groq LLM
                        </span>
                    </div>

                    {/* Document Upload Component */}
                    <DocumentUpload />
                </div>
            </Layout>
        </ProtectedRoute>
    );
}
