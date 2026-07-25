'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterPage() {
    const router = useRouter();
    const { register, isLoading } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [badgeNumber, setBadgeNumber] = useState('');
    const [department, setDepartment] = useState('District Police');
    const [policeStation, setPoliceStation] = useState('Test Station');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('🔍 Form submitted!');
        console.log('🔍 Email:', email);
        console.log('🔍 Password:', password);
        console.log('🔍 First Name:', firstName);
        console.log('🔍 Last Name:', lastName);
        console.log('🔍 Badge Number:', badgeNumber);

        setError('');

        if (!firstName || !lastName || !email || !password || !confirmPassword || !badgeNumber) {
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

        try {
            const success = await register({
                firstName,
                lastName,
                email,
                password,
                phoneNumber: '9876543210',
                badgeNumber,
                department,
                rankName: 'Inspector',
                policeStation,
                district: 'Bangalore',
                role: 'OFFICER',
            });

            if (success) {
                router.push('/login');
            }
        } catch (err) {
            console.error('Registration error:', err);
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Register</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="First Name *"
                            placeholder="Rupesh"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                        <Input
                            label="Last Name *"
                            placeholder="Sah"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                        <Input
                            label="Email *"
                            type="email"
                            placeholder="officer@police.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Input
                            label="Badge Number *"
                            placeholder="KSP123456"
                            value={badgeNumber}
                            onChange={(e) => setBadgeNumber(e.target.value)}
                            required
                        />
                        <Input
                            label="Password *"
                            type="password"
                            placeholder="Min 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Input
                            label="Confirm Password *"
                            type="password"
                            placeholder="Re-enter password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <Button type="submit" fullWidth isLoading={isLoading}>
                            Register
                        </Button>
                    </form>

                    <div className="mt-4 text-center">
                        <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                            Already have an account? Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}