'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileSpreadsheet, FileText, X, CheckCircle2, AlertTriangle, Download, ArrowRight, Database, Sparkles } from 'lucide-react';
import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { uploadService } from '@/services/uploadService';
import toast from 'react-hot-toast';

export default function UploadPage() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [result, setResult] = useState<{ total: number; saved: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const selectedFile = acceptedFiles[0];
            const validTypes = ['.csv', '.xlsx', '.xls'];
            const fileExt = selectedFile.name.substring(selectedFile.name.lastIndexOf('.'));
            if (!validTypes.includes(fileExt)) {
                toast.error('Please upload a valid CSV or Excel file');
                return;
            }
            setFile(selectedFile);
            setResult(null);
            setError(null);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'text/csv': ['.csv'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls'],
        },
        maxFiles: 1,
    });

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);

        try {
            const response = await uploadService.uploadFile(file);
            setResult({
                total: response.totalRecords,
                saved: response.savedRecords,
            });
            toast.success(`Successfully imported ${response.savedRecords} crime records! 🎉`);
            setFile(null);
        } catch (err: any) {
            const message = err.response?.data?.message || 'Upload failed. Please verify file column headers.';
            setError(message);
            toast.error(message);
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
        setResult(null);
        setError(null);
    };

    const downloadSampleCSV = () => {
        const sample = 'crimeNumber,title,description,category,severity,status,incidentDate,incidentTime,latitude,longitude,address,district,city,state,country,reportedBy,policeStation\nCRIME-001,Bank Robbery on MG Road,Armed robbery reported at city branch,ROBBERY,CRITICAL,OPEN,2026-07-17,14:30:00,12.9716,77.5946,123 MG Road,Bangalore Urban,Bangalore,Karnataka,India,Inspector Sharma,City Center';
        const blob = new Blob([sample], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sample_crimes_template.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Sample CSV template downloaded! 📥');
    };

    const requiredColumns = ['title', 'category', 'severity', 'status', 'incidentDate', 'district'];

    return (
        <ProtectedRoute>
            <Layout>
                <div className="space-y-6">
                    {/* Page Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                <Database className="w-7 h-7 text-indigo-600" />
                                Bulk Data Ingestion
                            </h1>
                            <p className="text-sm font-medium text-slate-500 mt-0.5">
                                Import crime records in bulk using structured CSV or Excel spreadsheets
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <a
                                href="/upload/document"
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                            >
                                📄 Scan FIR PDF / Image (OCR)
                            </a>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Drag & Drop Section */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card className="bg-white border border-slate-200 shadow-sm p-6">
                                {!file && !result && (
                                    <div
                                        {...getRootProps()}
                                        className={`
                                            border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-200
                                            ${isDragActive
                                                ? 'border-indigo-500 bg-indigo-50/60 scale-[1.01]'
                                                : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50/80'
                                            }
                                        `}
                                    >
                                        <input {...getInputProps()} />
                                        <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 shadow-xs">
                                            <UploadCloud className="w-8 h-8 animate-pulse" />
                                        </div>
                                        <p className="text-slate-900 font-bold text-base">
                                            {isDragActive ? 'Release file to drop' : 'Drag & drop your crime dataset here'}
                                        </p>
                                        <p className="text-sm font-medium text-slate-500 mt-1">
                                            or <span className="text-indigo-600 font-semibold underline">browse files</span> from your computer
                                        </p>
                                        <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-slate-100">
                                            <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold">.CSV</span>
                                            <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold">.XLSX</span>
                                            <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold">.XLS</span>
                                        </div>
                                    </div>
                                )}

                                {/* Selected File State */}
                                {file && !result && (
                                    <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-xs">
                                                    <FileSpreadsheet className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900 text-sm">{file.name}</p>
                                                    <p className="text-xs font-medium text-slate-500 mt-0.5">
                                                        {(file.size / 1024).toFixed(1)} KB • Ready for processing
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={handleRemoveFile}
                                                disabled={uploading}
                                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-200/60 rounded-lg transition-colors"
                                                title="Remove file"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleRemoveFile}
                                                disabled={uploading}
                                                className="border-slate-300 text-slate-700 font-medium"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={handleUpload}
                                                isLoading={uploading}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6"
                                            >
                                                Upload & Import Records
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Success State */}
                                {result && (
                                    <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-3">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle2 className="w-8 h-8 text-emerald-600 shrink-0" />
                                            <div>
                                                <p className="font-bold text-emerald-900 text-base">Data Ingestion Complete!</p>
                                                <p className="text-sm font-medium text-emerald-700 mt-0.5">
                                                    Successfully imported <strong>{result.saved}</strong> out of <strong>{result.total}</strong> records into PostgreSQL database.
                                                </p>
                                            </div>
                                        </div>
                                        <div className="pt-2 flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-emerald-300 text-emerald-800 hover:bg-emerald-100 font-semibold"
                                                onClick={() => setResult(null)}
                                            >
                                                Upload Another Dataset
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {/* Error State */}
                                {error && (
                                    <div className="p-5 bg-rose-50 border border-rose-200 rounded-2xl space-y-3">
                                        <div className="flex items-center gap-3">
                                            <AlertTriangle className="w-8 h-8 text-rose-600 shrink-0" />
                                            <div>
                                                <p className="font-bold text-rose-900 text-base">Import Error</p>
                                                <p className="text-sm font-medium text-rose-700 mt-0.5">{error}</p>
                                            </div>
                                        </div>
                                        <div className="pt-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="border-rose-300 text-rose-800 hover:bg-rose-100 font-semibold"
                                                onClick={() => setError(null)}
                                            >
                                                Try Again
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </Card>

                            {/* Recent Upload Activity */}
                            <Card className="bg-white border border-slate-200 shadow-sm" title="Recent Data Ingestions" subtitle="Audit log of previous dataset imports">
                                <div className="space-y-2.5">
                                    <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                                        <div className="flex items-center gap-2.5">
                                            <FileText className="w-4 h-4 text-indigo-600" />
                                            <div>
                                                <p className="font-bold text-slate-900">crimes_500.csv</p>
                                                <p className="text-slate-500 font-medium">500 records • Bangalore Urban</p>
                                            </div>
                                        </div>
                                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                                            Completed
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                                        <div className="flex items-center gap-2.5">
                                            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                                            <div>
                                                <p className="font-bold text-slate-900">crime_data_40_fixed.csv</p>
                                                <p className="text-slate-500 font-medium">40 records • State Jurisdiction</p>
                                            </div>
                                        </div>
                                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                                            Completed
                                        </span>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Schema Guidelines & Instructions Side Panel */}
                        <div className="space-y-6">
                            <Card className="bg-white border border-slate-200 shadow-sm" title="Upload Instructions" subtitle="Follow schema guidelines for bulk ingestion">
                                <ul className="space-y-3.5 text-xs text-slate-700 mb-5">
                                    <li className="flex items-start gap-3">
                                        <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">1</span>
                                        <span className="font-semibold pt-0.5">Format file as CSV UTF-8 or Excel (.xlsx).</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">2</span>
                                        <span className="font-semibold pt-0.5">Ensure required column headers match the exact names below.</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">3</span>
                                        <span className="font-semibold pt-0.5">Dates must follow YYYY-MM-DD format.</span>
                                    </li>
                                </ul>

                                <div className="pt-4 border-t border-slate-100 space-y-2">
                                    <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">Required Column Headers:</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {requiredColumns.map((col) => (
                                            <span key={col} className="px-2 py-1 bg-slate-100 text-slate-700 rounded-md text-[11px] font-mono font-bold border border-slate-200">
                                                {col}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full border-slate-300 text-slate-700 hover:bg-slate-50 font-bold flex items-center justify-center gap-2"
                                        onClick={downloadSampleCSV}
                                    >
                                        <Download className="w-4 h-4 text-indigo-600" />
                                        Download Sample CSV Template
                                    </Button>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}