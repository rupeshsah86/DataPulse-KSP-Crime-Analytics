'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Mail, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';

export default function LoginPage() {
    const router = useRouter();
    const { login, isLoading } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please fill in all fields');
            return;
        }

        const success = await login({ email, password });
        if (success) {
            router.push('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-sm flex items-center justify-center">
                            <Shield className="w-10 h-10 text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-white">DataPulse</h1>
                    <p className="text-white/60 mt-1 text-sm">
                        AI-Driven Crime Analytics Platform
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-6">
                        Welcome Back
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="officer@police.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            icon={<Mail className="w-4 h-4" />}
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            icon={<Lock className="w-4 h-4" />}
                            required
                        />

                        {error && (
                            <p className="text-sm text-status-critical">{error}</p>
                        )}

                        <Button
                            type="submit"
                            fullWidth
                            isLoading={isLoading}
                            className="mt-4"
                        >
                            Sign In
                        </Button>
                    </form>

                    {/* ✅ ADDED: Create Account Link */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link href="/register" className="text-primary-600 hover:text-primary-700 font-medium">
                                Create Account
                            </Link>
                        </p>
                    </div>

                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-500">
                            Demo Credentials:
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                            Email: ravi@police.com | Password: password123
                        </p>
                    </div>

                    <div className="mt-4 text-center">
                        <p className="text-xs text-gray-400">
                            © 2026 DataPulse. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}