'use client';

import React from 'react';
import Link from 'next/link';
import {
  Shield,
  BarChart3,
  MapPin,
  Upload,
  TrendingUp,
  AlertTriangle,
  Users,
  FileText,
  ArrowRight,
  CheckCircle,
  Clock,
  LayoutDashboard
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  const features = [
    {
      icon: <LayoutDashboard className="w-8 h-8 text-primary-500" />,
      title: 'Interactive Dashboards',
      description: 'Real-time crime analytics with KPI cards, charts, and trend visualization.'
    },
    {
      icon: <MapPin className="w-8 h-8 text-primary-500" />,
      title: 'Geospatial Mapping',
      description: 'Interactive maps with crime hotspots, heatmaps, and district-wise visualization.'
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-primary-500" />,
      title: 'AI-Powered Analytics',
      description: 'Advanced crime prediction, pattern detection, and anomaly identification using AI.'
    },
    {
      icon: <Upload className="w-8 h-8 text-primary-500" />,
      title: 'Bulk Data Upload',
      description: 'Upload CSV and Excel files to import large crime datasets instantly.'
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary-500" />,
      title: 'Crime Trends',
      description: 'Visualize crime patterns over time with interactive charts and reports.'
    },
    {
      icon: <AlertTriangle className="w-8 h-8 text-primary-500" />,
      title: 'Intelligent Alerts',
      description: 'Get real-time alerts for critical crimes and high-risk areas.'
    },
  ];

  const stats = [
    { value: '15+', label: 'Crime Categories' },
    { value: '1000+', label: 'Crimes Analyzed' },
    { value: '24/7', label: 'Real-time Monitoring' },
    { value: '99.9%', label: 'Data Accuracy' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ============================================
          NAVBAR
          ============================================ */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-primary-700">DataPulse</span>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                Features
              </Link>
              <Link href="#about" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                About
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-primary-50 via-white to-primary-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium">
                <Shield className="w-4 h-4" />
                AI-Powered Crime Analytics
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Transform Crime Data Into{' '}
                <span className="text-primary-600">Actionable Intelligence</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-lg">
                DataPulse is an AI-driven crime analytics platform that helps law enforcement
                agencies detect patterns, predict hotspots, and make data-driven decisions.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/register">
                  <Button size="lg">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <div key={index}>
                    <p className="text-2xl font-bold text-primary-600">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Illustration */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative">
                <div className="w-80 h-80 bg-primary-500/10 rounded-full absolute -top-10 -right-10"></div>
                <div className="w-80 h-80 bg-primary-500/5 rounded-full absolute -bottom-10 -left-10"></div>
                <div className="relative bg-white rounded-2xl shadow-2xl p-6 border border-gray-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="ml-2 text-sm font-medium text-gray-600">Dashboard Preview</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-4 h-4 text-primary-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Total Crimes</p>
                          <p className="text-xs text-gray-500">Last 30 days</p>
                        </div>
                      </div>
                      <p className="text-lg font-bold text-gray-900">1,247</p>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                          <Clock className="w-4 h-4 text-cyan-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Active Cases</p>
                          <p className="text-xs text-gray-500">Under investigation</p>
                        </div>
                      </div>
                      <p className="text-lg font-bold text-gray-900">342</p>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Resolved Cases</p>
                          <p className="text-xs text-gray-500">Closed successfully</p>
                        </div>
                      </div>
                      <p className="text-lg font-bold text-gray-900">905</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          FEATURES SECTION
          ============================================ */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Why Choose <span className="text-primary-600">DataPulse</span>?
            </h2>
            <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
              Empower your law enforcement agency with cutting-edge AI and analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          ABOUT/CTA SECTION
          ============================================ */}
      <section id="about" className="py-20 px-4 bg-primary-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Crime Analytics?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of law enforcement agencies using DataPulse to make data-driven decisions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register">
              <Button size="lg">
                Get Started Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================================
          FOOTER
          ============================================ */}
      <footer className="py-8 px-4 bg-primary-900 text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent-500" />
            <span className="font-bold">DataPulse</span>
            <span className="text-primary-400 text-sm">© 2026 All rights reserved</span>
          </div>
          <div className="flex gap-6 text-sm text-primary-300">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}