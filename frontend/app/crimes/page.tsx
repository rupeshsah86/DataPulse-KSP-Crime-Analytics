'use client';

import React, { useState } from 'react';
import { Plus, FileDown, Download, FileSpreadsheet, Trash2 } from 'lucide-react';
import * as XLSX from 'xlsx';
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
import { SimilaritySearch } from '@/components/crimes/SimilaritySearch';

export default function CrimesPage() {
    const { crimes, loading, fetchCrimes, deleteCrime, searchCrimes, createCrime, updateCrime } = useCrimes();
    const [selectedCrime, setSelectedCrime] = useState<Crime | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // ✅ BULK DELETE STATE
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    // ============================================
    // EXPORT TO CSV
    // ============================================
    const handleExportCSV = () => {
        if (!crimes || crimes.length === 0) {
            toast.error('No data to export');
            return;
        }

        try {
            const headers = ['ID', 'Crime Number', 'Title', 'Category', 'Severity', 'Status', 'District', 'Date'];
            const rows = crimes.map(c => [
                c.id,
                c.crimeNumber || '',
                `"${c.title.replace(/"/g, '""')}"`,
                c.category,
                c.severity,
                c.status,
                c.district,
                c.incidentDate
            ]);

            const csvContent = [
                headers.join(','),
                ...rows.map(row => row.join(','))
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `crimes_export_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            toast.success(`Exported ${crimes.length} crimes! 📥`);
        } catch (error) {
            toast.error('Export failed');
            console.error(error);
        }
    };

    // ============================================
    // EXPORT TO EXCEL
    // ============================================
    const handleExportExcel = () => {
        if (!crimes || crimes.length === 0) {
            toast.error('No data to export');
            return;
        }

        try {
            const data = crimes.map(c => ({
                'ID': c.id,
                'Crime Number': c.crimeNumber || '',
                'Title': c.title,
                'Category': c.category,
                'Severity': c.severity,
                'Status': c.status,
                'District': c.district,
                'Date': c.incidentDate,
                'Description': c.description || '',
                'Address': c.address || '',
                'City': c.city || '',
                'State': c.state || '',
                'Reported By': c.reportedBy || '',
                'Police Station': c.policeStation || '',
            }));

            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Crimes');
            XLSX.writeFile(wb, `crimes_export_${new Date().toISOString().split('T')[0]}.xlsx`);

            toast.success(`Exported ${crimes.length} crimes to Excel! 📊`);
        } catch (error) {
            toast.error('Export failed');
            console.error(error);
        }
    };
    {/* Similarity Search */ }
    <SimilaritySearch
        onSelect={(crime) => {
            console.log('Selected similar crime:', crime);
            // Navigate to crime details or highlight it
        }}
    />

    // ============================================
    // PDF DOWNLOAD
    // ============================================
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

    // ============================================
    // TOGGLE SELECT
    // ============================================
    const toggleSelect = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    // ============================================
    // TOGGLE SELECT ALL
    // ============================================
    const toggleSelectAll = () => {
        if (crimes.length === 0) return;
        const allIds = crimes.map(c => c.id);
        setSelectedIds(prev =>
            prev.length === allIds.length ? [] : allIds
        );
    };

    // ============================================
    // BULK DELETE
    // ============================================
    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) {
            toast.error('Please select crimes to delete');
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to delete ${selectedIds.length} crime(s)?`
        );

        if (!confirmed) return;

        try {
            await Promise.all(selectedIds.map(id => deleteCrime(id)));
            setSelectedIds([]);
            toast.success(`Deleted ${selectedIds.length} crime(s)! 🗑️`);
        } catch (error) {
            toast.error('Failed to delete some crimes');
        }
    };

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
            setSelectedIds(prev => prev.filter(i => i !== id));
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
                        <div className="flex gap-2 flex-wrap">
                            {/* ✅ BULK DELETE BUTTON */}
                            {selectedIds.length > 0 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleBulkDelete}
                                    className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                                >
                                    <Trash2 className="w-4 h-4 mr-1" />
                                    Delete ({selectedIds.length})
                                </Button>
                            )}
                            <Button variant="outline" size="sm" onClick={handleExportCSV}>
                                <Download className="w-4 h-4 mr-1" />
                                CSV
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleExportExcel}>
                                <FileSpreadsheet className="w-4 h-4 mr-1" />
                                Excel
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                                <FileDown className="w-4 h-4 mr-1" />
                                PDF
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
                            selectedIds={selectedIds}
                            onSelect={toggleSelect}
                            onSelectAll={toggleSelectAll}
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