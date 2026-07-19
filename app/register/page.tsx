'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Mail, Lock, User, Phone, Building2, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterPage() {
    const router = useRouter();
    const { register, isLoading } = useAuth();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [policeStation, setPoliceStation] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!fullName || !email || !password || !confirmPassword) {
            setError('Please fill in all required fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        const success = await register({
            fullName,
            email,
            password,
            employeeId: employeeId || undefined,
            policeStation: policeStation || undefined,
            phoneNumber: phoneNumber || undefined,
            role: 'OFFICER',
        });

        if (success) {
            router.push('/login');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-6">
                    <div className="flex justify-center mb-3">
                        <div className="w-14 h-14 bg-white/10 rounded-2xl backdrop-blur-sm flex items-center justify-center">
                            <Shield className="w-9 h-9 text-white" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-white">DataPulse</h1>
                    <p className="text-white/60 text-sm">
                        AI-Driven Crime Analytics Platform
                    </p>
                </div>

                {/* Register Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-800">
                            Create Account
                        </h2>
                        <Link
                            href="/login"
                            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                        >
                            ← Back to Login
                        </Link>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        <Input
                            label="Full Name *"
                            type="text"
                            placeholder="Officer Ravi"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            icon={<User className="w-4 h-4" />}
                            required
                        />

                        <Input
                            label="Email Address *"
                            type="email"
                            placeholder="officer@police.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            icon={<Mail className="w-4 h-4" />}
                            required
                        />

                        <Input
                            label="Password *"
                            type="password"
                            placeholder="Min 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            icon={<Lock className="w-4 h-4" />}
                            required
                        />

                        <Input
                            label="Confirm Password *"
                            type="password"
                            placeholder="Re-enter password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            icon={<Lock className="w-4 h-4" />}
                            required
                        />

                        <Input
                            label="Employee ID (Optional)"
                            type="text"
                            placeholder="EMP001"
                            value={employeeId}
                            onChange={(e) => setEmployeeId(e.target.value)}
                            icon={<BadgeCheck className="w-4 h-4" />}
                        />

                        <Input
                            label="Police Station (Optional)"
                            type="text"
                            placeholder="City Center Police Station"
                            value={policeStation}
                            onChange={(e) => setPoliceStation(e.target.value)}
                            icon={<Building2 className="w-4 h-4" />}
                        />

                        <Input
                            label="Phone Number (Optional)"
                            type="tel"
                            placeholder="9876543210"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            icon={<Phone className="w-4 h-4" />}
                        />

                        {error && (
                            <p className="text-sm text-status-critical">{error}</p>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            isLoading={isLoading}
                            className="mt-2"
                        >
                            Create Account
                        </Button>
                    </form>

                    <div className="mt-4 text-center">
                        <p className="text-xs text-gray-400">
                            By creating an account, you agree to our Terms of Service
                        </p>
                    </div>

                    <div className="mt-4 text-center">
                        <p className="text-xs text-gray-400">
                            Already have an account?{' '}
                            <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}