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
  CheckCircle2,
  Clock,
  LayoutDashboard,
  Bot,
  Compass,
  Globe,
  Box,
  Smartphone,
  Network,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  const updatedFeatures = [
    {
      icon: <Bot className="w-7 h-7 text-indigo-600" />,
      tag: 'Groq Llama-3.3-70b',
      title: 'AI Investigation Assistant',
      description: 'Generates structured executive case briefings, tactical field leads, suspect network correlation, and historical precedent matches.'
    },
    {
      icon: <Compass className="w-7 h-7 text-indigo-600" />,
      tag: 'NetworkX Graph Engine',
      title: 'Predictive Patrol Routes',
      description: 'Computes optimal risk-weighted patrol paths connecting high-density crime hotspots with turn-by-turn dispatch itineraries.'
    },
    {
      icon: <Globe className="w-7 h-7 text-indigo-600" />,
      tag: 'Cross-State Intelligence',
      title: 'Multi-State Crime Analytics',
      description: 'Provides cross-jurisdictional crime volume benchmarks across Karnataka, Maharashtra, Tamil Nadu, Telangana, Kerala, and Delhi.'
    },
    {
      icon: <Box className="w-7 h-7 text-indigo-600" />,
      tag: 'Three.js WebGL Engine',
      title: '3D Spatial Heatmap Towers',
      description: 'Visualizes crime density in 3D WebGL space with height elevation columns, spatial threat radii, and orbit camera controls.'
    },
    {
      icon: <FileText className="w-7 h-7 text-indigo-600" />,
      tag: 'Tesseract OCR & PyPDF',
      title: 'OCR FIR Document Scanner',
      description: 'Scans paper FIR PDF & image documents, extracts raw text, and auto-fills official crime registry forms with one click.'
    },
    {
      icon: <Smartphone className="w-7 h-7 text-indigo-600" />,
      tag: 'React Native & Expo',
      title: 'DataPulse Mobile Officer App',
      description: 'Equips field officers with offline AsyncStorage data caching, live GPS telemetry tracking, and camera evidence capture.'
    },
    {
      icon: <Network className="w-7 h-7 text-indigo-600" />,
      tag: 'Vis Network Graph',
      title: 'Criminal Network Analysis',
      description: 'Maps complex gang relationships, accomplice node connections, and repeat offender criminal histories.'
    },
    {
      icon: <MapPin className="w-7 h-7 text-indigo-600" />,
      tag: 'Leaflet GIS Engine',
      title: 'Real-Time Heatmap & Feed',
      description: 'Live WebSocket crime stream and interactive GIS maps with critical hotspot cluster detection.'
    },
  ];

  const systemStats = [
    { value: '6+', label: 'AI & Analytics Modules' },
    { value: '100%', label: 'Real-Time Stream' },
    { value: '50-100%', label: 'Deterrence Impact' },
    { value: '24/7', label: 'Command Uptime' },
  ];

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      {/* Top Police Command Navbar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-200">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-black text-slate-900 tracking-wider">DATAPULSE</span>
                <span className="text-[10px] font-bold text-indigo-600 block -mt-1 tracking-widest uppercase">KSP Crime Analytics</span>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600 uppercase tracking-wider">
              <a href="#features" className="hover:text-indigo-600 transition-colors">Features & AI Engine</a>
              <a href="#mobile" className="hover:text-indigo-600 transition-colors">Mobile App</a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="outline" size="sm" className="border-slate-300 text-slate-700 hover:bg-slate-50 font-bold text-xs">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200">
                  Register Officer
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-indigo-50/70 via-white to-slate-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-bold shadow-xs">
                <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
                Karnataka State Police Next-Gen AI Intelligence Platform
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-tight tracking-tight">
                Transforming Crime Data Into{' '}
                <span className="text-indigo-600">
                  Predictive Police Intelligence
                </span>
              </h1>

              <p className="text-base text-slate-600 max-w-xl leading-relaxed font-medium">
                DataPulse empowers law enforcement agencies with Groq LLM case reasoning, NetworkX spatial patrol routing, 3D WebGL spatial heatmaps, multi-state analytics, and OCR document scanning.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link href="/login">
                  <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-8 shadow-lg shadow-indigo-200">
                    Access Police Portal
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <a href="#features">
                  <Button variant="outline" size="lg" className="border-slate-300 text-slate-700 hover:bg-slate-50 font-bold">
                    Explore Platform Features
                  </Button>
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-slate-200">
                {systemStats.map((stat, idx) => (
                  <div key={idx}>
                    <p className="text-2xl font-black text-indigo-600">{stat.value}</p>
                    <p className="text-xs font-bold text-slate-500 uppercase mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Card Preview */}
            <div className="lg:col-span-5">
              <div className="relative bg-white border border-slate-200 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-slate-600 ml-2">Command Center Stream</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md text-[10px] font-mono font-bold">
                    LIVE WEBSOCKET
                  </span>
                </div>

                <div className="space-y-3 font-sans">
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3">
                    <div className="w-8 h-8 bg-rose-50 border border-rose-200 rounded-xl flex items-center justify-center text-rose-600 shrink-0">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">Armed Heist on MG Road</span>
                        <span className="text-[10px] font-mono text-rose-600 font-bold">CRITICAL</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">Bangalore Urban • AI Auto-Summarized</p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3">
                    <div className="w-8 h-8 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                      <Compass className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">Patrol Unit Alpha-1 Dispatched</span>
                        <span className="text-[10px] font-mono text-indigo-600 font-bold">54.0 km</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">NetworkX 6-Stop Optimized Route</p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-start gap-3">
                    <div className="w-8 h-8 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">OCR FIR Document Scanned</span>
                        <span className="text-[10px] font-mono text-emerald-600 font-bold">AUTO-FILLED</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">FIR/2026/BLR/9941 Extracted</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Platform Features & <span className="text-indigo-600">AI Intelligence Core</span>
            </h2>
            <p className="text-sm font-medium text-slate-500 max-w-2xl mx-auto">
              Built for modern law enforcement operations across Spring Boot, Python FastAPI, Next.js, and React Native.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {updatedFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="p-6 bg-slate-50/60 border border-slate-200 hover:border-indigo-500 rounded-3xl space-y-3 transition-all hover:shadow-lg hover:shadow-indigo-100 group"
              >
                <div className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                  {feat.icon}
                </div>
                <span className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-md text-[10px] font-mono font-bold">
                  {feat.tag}
                </span>
                <h3 className="text-base font-extrabold text-slate-900">{feat.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-medium">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-white text-sm">DATAPULSE</span>
              <span className="text-xs text-slate-400 block">Karnataka State Police Crime Analytics Platform © 2026</span>
            </div>
          </div>
          <div className="flex gap-6 text-xs font-bold text-slate-400">
            <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link href="/register" className="hover:text-white transition-colors">Register</Link>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
          </div>
        </div>
      </footer>
    </div>
  );
}