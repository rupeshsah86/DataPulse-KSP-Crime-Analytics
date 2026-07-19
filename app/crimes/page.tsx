'use client';

import React, { useState } from 'react';
import { Plus, FileDown } from 'lucide-react';
import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CrimeFilters } from '@/components/crimes/CrimeFilters';
import { CrimeTable } from '@/components/crimes/CrimeTable';
import { CrimeModal } from '@/components/crimes/CrimeModal';
import { useCrimes } from '@/hooks/useCrimes';
import { Crime } from '@/services/crimeService';
import { Spinner } from '@/components/ui/Spinner';
import toast from 'react-hot-toast';

export default function CrimesPage() {
    const { crimes, loading, fetchCrimes, deleteCrime, searchCrimes, createCrime, updateCrime } = useCrimes();
    const [selectedCrime, setSelectedCrime] = useState<Crime | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const handleSearch = async (keyword: string) => {
        await searchCrimes(keyword);
    };

    const handleFilter = async (filters: any) => {
        await fetchCrimes();
    };

    const handleEdit = (crime: Crime) => {
        setSelectedCrime(crime);
        setIsEditModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this crime?')) {
            await deleteCrime(id);
        }
    };

    const handleView = (crime: Crime) => {
        console.log('View crime:', crime);
    };

    const handleCreate = async (data: Partial<Crime>) => {
        await createCrime(data);
    };

    const handleUpdate = async (data: Partial<Crime>) => {
        if (selectedCrime?.id) {
            await updateCrime(selectedCrime.id, data);
        }
    };

    const handleDownloadPDF = async () => {
        try {
            const token = localStorage.getItem('datapulse_token');
            if (!token) {
                toast.error('Please login first');
                return;
            }

            toast.loading('Generating PDF...', { id: 'pdf-loading' });

            const response = await fetch('http://localhost:8082/api/v1/reports/pdf', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            toast.dismiss('pdf-loading');

            if (!response.ok) {
                throw new Error('Failed to generate PDF');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `crime_report_${new Date().toISOString().split('T')[0]}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            toast.success('PDF downloaded successfully! 📄');
        } catch (error) {
            toast.error('Failed to download PDF');
            console.error('PDF download error:', error);
        }
    };

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
                    {/* Page Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Crime Management</h1>
                            <p className="text-sm text-gray-500">View and manage all crime records</p>
                        </div>
                        <div className="flex gap-3">
                            <Button variant="outline" onClick={handleDownloadPDF}>
                                <FileDown className="w-4 h-4 mr-2" />
                                Download Report
                            </Button>
                            <Button onClick={() => setIsCreateModalOpen(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Crime
                            </Button>
                        </div>
                    </div>

                    {/* Filters */}
                    <CrimeFilters onSearch={handleSearch} onFilter={handleFilter} />

                    {/* Table */}
                    <Card>
                        <CrimeTable
                            crimes={crimes}
                            loading={loading}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onView={handleView}
                        />
                    </Card>

                    {/* Create Modal */}
                    <CrimeModal
                        isOpen={isCreateModalOpen}
                        onClose={() => setIsCreateModalOpen(false)}
                        onSave={handleCreate}
                        title="Add New Crime"
                    />

                    {/* Edit Modal */}
                    <CrimeModal
                        isOpen={isEditModalOpen}
                        onClose={() => {
                            setIsEditModalOpen(false);
                            setSelectedCrime(null);
                        }}
                        onSave={handleUpdate}
                        crime={selectedCrime}
                        title="Edit Crime"
                    />
                </div>
            </Layout>
        </ProtectedRoute>
    );
}