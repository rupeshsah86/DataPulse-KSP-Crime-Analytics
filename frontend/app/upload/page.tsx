'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
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
                toast.error('Please upload CSV or Excel file');
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
            toast.success(`Uploaded ${response.savedRecords} records successfully! 🎉`);
            setFile(null);
        } catch (err: any) {
            const message = err.response?.data?.message || 'Upload failed';
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

    return (
        <ProtectedRoute>
            <Layout>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Upload Crime Data</h1>
                        <p className="text-sm text-gray-500">
                            Upload CSV or Excel files to import crime records in bulk
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <Card>
                                {!file && !result && (
                                    <div
                                        {...getRootProps()}
                                        className={`
                      border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all
                      ${isDragActive
                                                ? 'border-primary-500 bg-primary-50'
                                                : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                                            }
                    `}
                                    >
                                        <input {...getInputProps()} />
                                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600 font-medium">
                                            {isDragActive ? 'Drop your file here' : 'Drag & drop your file here'}
                                        </p>
                                        <p className="text-sm text-gray-400 mt-1">
                                            or click to browse
                                        </p>
                                        <p className="text-xs text-gray-400 mt-3">
                                            Supported formats: CSV, Excel (.xlsx, .xls)
                                        </p>
                                    </div>
                                )}

                                {file && !result && (
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <File className="w-8 h-8 text-primary-500" />
                                            <div>
                                                <p className="font-medium text-gray-700">{file.name}</p>
                                                <p className="text-xs text-gray-400">
                                                    {(file.size / 1024).toFixed(1)} KB
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleRemoveFile}
                                                disabled={uploading}
                                            >
                                                <X className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={handleUpload}
                                                isLoading={uploading}
                                            >
                                                Upload
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {result && (
                                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="w-8 h-8 text-green-500" />
                                            <div>
                                                <p className="font-medium text-green-700">Upload Successful!</p>
                                                <p className="text-sm text-green-600">
                                                    {result.saved} records imported successfully
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Total records: {result.total}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mt-3"
                                            onClick={() => setResult(null)}
                                        >
                                            Upload Another File
                                        </Button>
                                    </div>
                                )}

                                {error && (
                                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                                        <div className="flex items-center gap-3">
                                            <AlertCircle className="w-8 h-8 text-red-500" />
                                            <div>
                                                <p className="font-medium text-red-700">Upload Failed</p>
                                                <p className="text-sm text-red-600">{error}</p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="mt-3"
                                            onClick={() => setError(null)}
                                        >
                                            Try Again
                                        </Button>
                                    </div>
                                )}
                            </Card>
                        </div>

                        <div>
                            <Card>
                                <h3 className="font-semibold text-gray-800 mb-3">How to Upload</h3>
                                <ul className="space-y-2 text-sm text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary-500 font-bold">1.</span>
                                        <span>Prepare your CSV or Excel file</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary-500 font-bold">2.</span>
                                        <span>Drag and drop or click to select</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary-500 font-bold">3.</span>
                                        <span>Click Upload to import the data</span>
                                    </li>
                                </ul>

                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="text-xs text-gray-400">
                                        Required columns: title, category, severity, status, incidentDate, district
                                    </p>
                                </div>

                                <div className="mt-3">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full text-xs"
                                        onClick={() => {
                                            const sample = 'crimeNumber,title,description,category,severity,status,incidentDate,incidentTime,latitude,longitude,address,district,city,state,country,reportedBy,policeStation\nCRIME-001,Sample Crime,Description,THEFT,HIGH,OPEN,2026-07-17,14:30:00,12.9716,77.5946,123 Main St,Bangalore Urban,Bangalore,Karnataka,India,Officer Ravi,City Center';
                                            const blob = new Blob([sample], { type: 'text/csv' });
                                            const url = URL.createObjectURL(blob);
                                            const a = document.createElement('a');
                                            a.href = url;
                                            a.download = 'sample_crimes.csv';
                                            document.body.appendChild(a);
                                            a.click();
                                            document.body.removeChild(a);
                                            URL.revokeObjectURL(url);
                                        }}
                                    >
                                        Download Sample CSV
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