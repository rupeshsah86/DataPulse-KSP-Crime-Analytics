'use client';

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Crime, Severity, Status } from '@/services/crimeService';
import { STATUS_OPTIONS, SEVERITY_OPTIONS, CRIME_CATEGORIES } from '@/utils/constants';

interface CrimeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: Partial<Crime>) => Promise<void>;
    crime?: Crime | null;
    title: string;
}

export const CrimeModal: React.FC<CrimeModalProps> = ({
    isOpen,
    onClose,
    onSave,
    crime,
    title,
}) => {
    const [formData, setFormData] = useState<Partial<Crime>>({
        title: '',
        description: '',
        category: '',
        severity: 'MEDIUM' as Severity,
        status: 'OPEN' as Status,
        incidentDate: '',
        incidentTime: '',
        latitude: undefined,
        longitude: undefined,
        address: '',
        district: '',
        city: '',
        state: '',
        country: '',
        reportedBy: '',
        policeStation: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (crime) {
            setFormData({
                title: crime.title || '',
                description: crime.description || '',
                category: crime.category || '',
                severity: crime.severity || 'MEDIUM',
                status: crime.status || 'OPEN',
                incidentDate: crime.incidentDate || '',
                incidentTime: crime.incidentTime || '',
                latitude: crime.latitude || undefined,
                longitude: crime.longitude || undefined,
                address: crime.address || '',
                district: crime.district || '',
                city: crime.city || '',
                state: crime.state || '',
                country: crime.country || '',
                reportedBy: crime.reportedBy || '',
                policeStation: crime.policeStation || '',
            });
        } else {
            setFormData({
                title: '',
                description: '',
                category: '',
                severity: 'MEDIUM',
                status: 'OPEN',
                incidentDate: '',
                incidentTime: '',
                latitude: undefined,
                longitude: undefined,
                address: '',
                district: '',
                city: '',
                state: '',
                country: '',
                reportedBy: '',
                policeStation: '',
            });
        }
        setError('');
    }, [crime]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate required fields
        if (!formData.title?.trim()) {
            setError('Title is required');
            return;
        }
        if (!formData.category?.trim()) {
            setError('Category is required');
            return;
        }
        if (!formData.district?.trim()) {
            setError('District is required');
            return;
        }
        if (!formData.incidentDate) {
            setError('Incident date is required');
            return;
        }

        setLoading(true);
        try {
            await onSave(formData);
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to save crime');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Title *"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                        <Input
                            label="Category *"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            list="categories"
                            required
                        />
                        <datalist id="categories">
                            {CRIME_CATEGORIES.map((cat) => (
                                <option key={cat} value={cat} />
                            ))}
                        </datalist>

                        <Input
                            label="District *"
                            value={formData.district}
                            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                            required
                        />
                        <Input
                            label="Incident Date *"
                            type="date"
                            value={formData.incidentDate}
                            onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                            required
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Severity</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                value={formData.severity}
                                onChange={(e) => setFormData({ ...formData, severity: e.target.value as Severity })}
                            >
                                {SEVERITY_OPTIONS.map((s) => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as Status })}
                            >
                                {STATUS_OPTIONS.map((s) => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                        </div>

                        <Input
                            label="Description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                        <Input
                            label="Address"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />

                        <Input
                            label="Latitude"
                            type="number"
                            step="any"
                            value={formData.latitude || ''}
                            onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) || undefined })}
                        />
                        <Input
                            label="Longitude"
                            type="number"
                            step="any"
                            value={formData.longitude || ''}
                            onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) || undefined })}
                        />

                        <Input
                            label="City"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        />
                        <Input
                            label="State"
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        />

                        <Input
                            label="Reported By"
                            value={formData.reportedBy}
                            onChange={(e) => setFormData({ ...formData, reportedBy: e.target.value })}
                        />
                        <Input
                            label="Police Station"
                            value={formData.policeStation}
                            onChange={(e) => setFormData({ ...formData, policeStation: e.target.value })}
                        />
                        <Input
  label="Country"
  value={formData.country || ''}
  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
  placeholder="India"
/>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <Button type="submit" isLoading={loading}>
                            Save
                        </Button>
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};