'use client';

import React, { useState } from 'react';
import {
    User,
    Mail,
    Shield,
    Key,
    Building2,
    Phone,
    CheckCircle,
    AlertCircle,
    Save,
    BadgeCheck,
    MapPin,
    ChevronDown
} from 'lucide-react';
import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/authStore';
import api from '@/services/api';
import toast from 'react-hot-toast';

export default function SettingsPage() {
    const { user, setAuth } = useAuthStore();

    const [firstName, setFirstName] = useState(user?.firstName || '');
    const [lastName, setLastName] = useState(user?.lastName || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');

    const [badgeNumber, setBadgeNumber] = useState(user?.badgeNumber || '');
    const [department, setDepartment] = useState(user?.department || '');
    const [rankName, setRankName] = useState(user?.rankName || '');
    const [policeStation, setPoliceStation] = useState(user?.policeStation || '');
    const [district, setDistrict] = useState(user?.district || '');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const departments = [
        'State Crime Records Bureau',
        'District Police',
        'Police Station',
        'Traffic Police',
        'Cyber Crime Cell',
        'Criminal Investigation Department',
        'Other'
    ];

    const ranks = [
        'Constable',
        'Head Constable',
        'Assistant Sub-Inspector',
        'Sub-Inspector',
        'Inspector',
        'Deputy Superintendent',
        'Superintendent',
        'Senior Superintendent',
        'Deputy Commissioner',
        'Commissioner'
    ];

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await api.put('/users/profile', {
                firstName,
                lastName,
                phoneNumber,
                badgeNumber,
                department,
                rankName,
                policeStation,
                district
            });

            const updatedUser = {
                email: user?.email || '',
                firstName,
                lastName,
                fullName: `${firstName} ${lastName}`,  // ← ADD THIS
                phoneNumber,
                badgeNumber,
                department,
                rankName,
                policeStation,
                district,
                role: user?.role || 'OFFICER'
            };

            const token = localStorage.getItem('datapulse_token');
            if (token) {
                setAuth(updatedUser, token);
            }

            toast.success('Profile updated successfully! ✅');
            setSuccess('Profile updated successfully!');
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to update profile';
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordLoading(true);
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            toast.error('Passwords do not match');
            setPasswordLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            toast.error('Password must be at least 6 characters');
            setPasswordLoading(false);
            return;
        }

        try {
            await api.put('/users/password', { currentPassword, newPassword });
            toast.success('Password changed successfully! 🔒');
            setSuccess('Password changed successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to change password';
            setError(message);
            toast.error(message);
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <ProtectedRoute>
            <Layout>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
                        <p className="text-sm text-gray-500">
                            Manage your profile and account settings
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card title="Profile Settings" subtitle="Update your personal information">
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-xl">
                                        {(firstName?.charAt(0) || lastName?.charAt(0) || 'U')}
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800">{firstName} {lastName}</p>
                                        <p className="text-sm text-gray-500">{user?.role || 'Officer'}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <Input
                                        label="First Name"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        icon={<User className="w-4 h-4" />}
                                    />
                                    <Input
                                        label="Last Name"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        icon={<User className="w-4 h-4" />}
                                    />
                                </div>

                                <Input
                                    label="Email Address"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    icon={<Mail className="w-4 h-4" />}
                                    disabled
                                />

                                <Input
                                    label="Phone Number"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    icon={<Phone className="w-4 h-4" />}
                                    placeholder="Enter phone number"
                                />

                                <Input
                                    label="Badge Number"
                                    value={badgeNumber}
                                    onChange={(e) => setBadgeNumber(e.target.value)}
                                    icon={<BadgeCheck className="w-4 h-4" />}
                                    placeholder="KSP123456"
                                />

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Department
                                    </label>
                                    <div className="relative">
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white"
                                            value={department}
                                            onChange={(e) => setDepartment(e.target.value)}
                                        >
                                            <option value="">Select Department</option>
                                            {departments.map((dept) => (
                                                <option key={dept} value={dept}>{dept}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Rank
                                    </label>
                                    <div className="relative">
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white"
                                            value={rankName}
                                            onChange={(e) => setRankName(e.target.value)}
                                        >
                                            <option value="">Select Rank</option>
                                            {ranks.map((rank) => (
                                                <option key={rank} value={rank}>{rank}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                <Input
                                    label="Police Station"
                                    value={policeStation}
                                    onChange={(e) => setPoliceStation(e.target.value)}
                                    icon={<Building2 className="w-4 h-4" />}
                                    placeholder="Enter police station"
                                />

                                <Input
                                    label="District"
                                    value={district}
                                    onChange={(e) => setDistrict(e.target.value)}
                                    icon={<MapPin className="w-4 h-4" />}
                                    placeholder="Enter district"
                                />

                                {error && (
                                    <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                                        <AlertCircle className="w-4 h-4" />
                                        {error}
                                    </div>
                                )}

                                {success && (
                                    <div className="flex items-center gap-2 p-3 bg-green-50 text-green-600 rounded-lg text-sm">
                                        <CheckCircle className="w-4 h-4" />
                                        {success}
                                    </div>
                                )}

                                <Button type="submit" isLoading={loading}>
                                    <Save className="w-4 h-4 mr-2" />
                                    Save Changes
                                </Button>
                            </form>
                        </Card>

                        <Card title="Security" subtitle="Change your password">
                            <form onSubmit={handleChangePassword} className="space-y-4">
                                <Input
                                    label="Current Password"
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    icon={<Key className="w-4 h-4" />}
                                    placeholder="Enter current password"
                                    required
                                />

                                <Input
                                    label="New Password"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    icon={<Shield className="w-4 h-4" />}
                                    placeholder="Enter new password"
                                    required
                                />

                                <Input
                                    label="Confirm New Password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    icon={<Shield className="w-4 h-4" />}
                                    placeholder="Confirm new password"
                                    required
                                />

                                <div className="text-xs text-gray-400">
                                    Password must be at least 6 characters long
                                </div>

                                <Button
                                    type="submit"
                                    isLoading={passwordLoading}
                                    variant="outline"
                                >
                                    <Key className="w-4 h-4 mr-2" />
                                    Change Password
                                </Button>
                            </form>
                        </Card>
                    </div>

                    <Card>
                        <h3 className="font-semibold text-gray-800 mb-2">Account Information</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div>
                                <p className="text-gray-500">Role</p>
                                <p className="font-medium text-gray-700">{user?.role || 'Officer'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Status</p>
                                <p className="font-medium text-green-600 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Active
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500">Badge</p>
                                <p className="font-medium text-gray-700">{badgeNumber || 'Not set'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Department</p>
                                <p className="font-medium text-gray-700">{department || 'Not set'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">Rank</p>
                                <p className="font-medium text-gray-700">{rankName || 'Not set'}</p>
                            </div>
                            <div>
                                <p className="text-gray-500">District</p>
                                <p className="font-medium text-gray-700">{district || 'Not set'}</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}