'use client';

import React, { useState } from 'react';
import {
    User,
    Mail,
    Shield,
    Key,
    Building2,
    Phone,
    CheckCircle2,
    AlertCircle,
    Save,
    BadgeCheck,
    MapPin,
    ChevronDown,
    Settings as SettingsIcon,
    Bell,
    Volume2,
    Lock,
    ShieldAlert,
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

    const [badgeNumber, setBadgeNumber] = useState(user?.badgeNumber || 'KSP123456');
    const [department, setDepartment] = useState(user?.department || 'District Police');
    const [rankName, setRankName] = useState(user?.rankName || 'Inspector');
    const [policeStation, setPoliceStation] = useState(user?.policeStation || 'City Center');
    const [district, setDistrict] = useState(user?.district || 'Bangalore Urban');

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [soundAlerts, setSoundAlerts] = useState(true);
    const [liveStreamAuto, setLiveStreamAuto] = useState(true);

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
                fullName: `${firstName} ${lastName}`,
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
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                <SettingsIcon className="w-7 h-7 text-indigo-600" />
                                Account & System Settings
                            </h1>
                            <p className="text-sm font-medium text-slate-500 mt-0.5">
                                Manage officer profile, security credentials, and live alert preferences
                            </p>
                        </div>
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Active Officer Session
                        </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Profile Settings Column */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card title="Officer Profile Settings" subtitle="Personal details & jurisdiction assignment" className="bg-white border border-slate-200 shadow-sm">
                                <form onSubmit={handleUpdateProfile} className="space-y-4">
                                    {/* Profile Avatar Header */}
                                    <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white rounded-2xl flex items-center justify-center font-extrabold text-2xl shadow-sm">
                                            {(firstName?.charAt(0) || lastName?.charAt(0) || 'O')}
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-extrabold text-slate-900 text-base">{firstName || 'Officer'} {lastName}</h3>
                                                <span className="px-2 py-0.5 bg-indigo-100 text-indigo-800 rounded-md text-xs font-extrabold">
                                                    {user?.role || 'OFFICER'}
                                                </span>
                                            </div>
                                            <p className="text-xs font-semibold text-slate-500">
                                                {department || 'District Police'} • {district || 'Bangalore Urban'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Input
                                            label="First Name"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            icon={<User className="w-4 h-4 text-slate-400" />}
                                            required
                                        />
                                        <Input
                                            label="Last Name"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            icon={<User className="w-4 h-4 text-slate-400" />}
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Input
                                            label="Email Address"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            icon={<Mail className="w-4 h-4 text-slate-400" />}
                                            disabled
                                        />
                                        <Input
                                            label="Phone Number"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            icon={<Phone className="w-4 h-4 text-slate-400" />}
                                            placeholder="Enter official phone number"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <Input
                                            label="Badge Number"
                                            value={badgeNumber}
                                            onChange={(e) => setBadgeNumber(e.target.value)}
                                            icon={<BadgeCheck className="w-4 h-4 text-slate-400" />}
                                            placeholder="KSP123456"
                                        />

                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                                                Department
                                            </label>
                                            <div className="relative">
                                                <select
                                                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                                                    value={department}
                                                    onChange={(e) => setDepartment(e.target.value)}
                                                >
                                                    <option value="">Select Department</option>
                                                    {departments.map((dept) => (
                                                        <option key={dept} value={dept}>{dept}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                                                Official Rank
                                            </label>
                                            <div className="relative">
                                                <select
                                                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
                                                    value={rankName}
                                                    onChange={(e) => setRankName(e.target.value)}
                                                >
                                                    <option value="">Select Rank</option>
                                                    {ranks.map((rank) => (
                                                        <option key={rank} value={rank}>{rank}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Input
                                            label="Police Station"
                                            value={policeStation}
                                            onChange={(e) => setPoliceStation(e.target.value)}
                                            icon={<Building2 className="w-4 h-4 text-slate-400" />}
                                            placeholder="Enter police station"
                                        />
                                        <Input
                                            label="District Jurisdiction"
                                            value={district}
                                            onChange={(e) => setDistrict(e.target.value)}
                                            icon={<MapPin className="w-4 h-4 text-slate-400" />}
                                            placeholder="Enter district"
                                        />
                                    </div>

                                    {error && (
                                        <div className="flex items-center gap-2 p-3 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold">
                                            <AlertCircle className="w-4 h-4 shrink-0" />
                                            {error}
                                        </div>
                                    )}

                                    {success && (
                                        <div className="flex items-center gap-2 p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold">
                                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                                            {success}
                                        </div>
                                    )}

                                    <div className="pt-2 flex justify-end">
                                        <Button
                                            type="submit"
                                            isLoading={loading}
                                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 shadow-xs"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            Save Profile Changes
                                        </Button>
                                    </div>
                                </form>
                            </Card>
                        </div>

                        {/* Security & System Preferences Column */}
                        <div className="space-y-6">
                            {/* Password Security */}
                            <Card title="Security Credentials" subtitle="Update access password" className="bg-white border border-slate-200 shadow-sm">
                                <form onSubmit={handleChangePassword} className="space-y-4">
                                    <Input
                                        label="Current Password"
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        icon={<Key className="w-4 h-4 text-slate-400" />}
                                        placeholder="Enter current password"
                                        required
                                    />

                                    <Input
                                        label="New Password"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        icon={<Lock className="w-4 h-4 text-slate-400" />}
                                        placeholder="Enter new password"
                                        required
                                    />

                                    <Input
                                        label="Confirm New Password"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        icon={<Shield className="w-4 h-4 text-slate-400" />}
                                        placeholder="Confirm new password"
                                        required
                                    />

                                    <p className="text-[11px] font-medium text-slate-400">
                                        Must be at least 6 characters with mixed alphanumeric characters.
                                    </p>

                                    <Button
                                        type="submit"
                                        isLoading={passwordLoading}
                                        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-xs"
                                    >
                                        <Key className="w-4 h-4 mr-2" />
                                        Update Password
                                    </Button>
                                </form>
                            </Card>

                            {/* System Preferences Toggle Card */}
                            <Card title="System & Alert Preferences" subtitle="Live stream & emergency sirens" className="bg-white border border-slate-200 shadow-sm">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <Volume2 className="w-5 h-5 text-indigo-600" />
                                            <div>
                                                <p className="text-xs font-bold text-slate-900">Critical Alarm Sound</p>
                                                <p className="text-[11px] text-slate-500 font-medium">Dual-tone siren for critical crimes</p>
                                            </div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={soundAlerts}
                                            onChange={(e) => setSoundAlerts(e.target.checked)}
                                            className="w-4 h-4 text-indigo-600 rounded-md focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
                                        />
                                    </div>

                                    <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <Bell className="w-5 h-5 text-emerald-600" />
                                            <div>
                                                <p className="text-xs font-bold text-slate-900">WebSocket Live Stream</p>
                                                <p className="text-[11px] text-slate-500 font-medium">Real-time incident pushes</p>
                                            </div>
                                        </div>
                                        <input
                                            type="checkbox"
                                            checked={liveStreamAuto}
                                            onChange={(e) => setLiveStreamAuto(e.target.checked)}
                                            className="w-4 h-4 text-indigo-600 rounded-md focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
                                        />
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}