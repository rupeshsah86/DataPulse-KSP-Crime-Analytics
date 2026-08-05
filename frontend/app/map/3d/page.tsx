'use client';

import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useCrimes } from '@/hooks/useCrimes';
import { use3DMap } from '@/hooks/use3DMap';
import { processCrimesTo3DGrid, Crime3DPoint } from '@/utils/mapDataProcessor';
import { CrimeMap3D } from '@/components/map/CrimeMap3D';
import { Box, Layers, RotateCw, ZoomIn, ArrowLeft, Sparkles, Sliders } from 'lucide-react';
import Link from 'next/link';

export default function Map3DPage() {
  const { crimes, loading } = useCrimes();
  const {
    autoRotate,
    rotationSpeed,
    heightScale,
    selectedSeverity,
    selectedPoint,
    setAutoRotate,
    setRotationSpeed,
    setHeightScale,
    setSelectedSeverity,
    setSelectedPoint,
    toggleAutoRotate,
    resetCamera,
  } = use3DMap();

  const [processedPoints, setProcessedPoints] = useState<Crime3DPoint[]>([]);

  useEffect(() => {
    if (crimes && crimes.length > 0) {
      let filtered = crimes;
      if (selectedSeverity !== 'ALL') {
        filtered = crimes.filter((c) => c.severity === selectedSeverity);
      }
      const points = processCrimesTo3DGrid(filtered, heightScale);
      setProcessedPoints(points);
    }
  }, [crimes, selectedSeverity, heightScale]);

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <Link
                href="/map"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 mb-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to 2D Spatial Map
              </Link>
              <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Box className="w-7 h-7 text-indigo-600" />
                3D Crime Spatial Heatmap & Height Elevation Map
              </h1>
              <p className="text-sm font-medium text-slate-500 mt-0.5">
                WebGL Three.js 3D rendering of crime density towers, incident elevation, and spatial threat vectors
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full text-xs font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                Three.js WebGL Engine
              </span>
            </div>
          </div>

          {/* 3D Map Viewport */}
          {loading ? (
            <div className="h-[520px] bg-slate-900 flex flex-col items-center justify-center rounded-2xl border border-slate-800">
              <Spinner size="lg" />
              <p className="text-sm font-semibold text-slate-400 mt-3">Initializing WebGL 3D Engine...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Controls Bar */}
              <Card className="bg-slate-900 border border-slate-800 p-4 text-white shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={toggleAutoRotate}
                      className={`px-3 py-1.5 rounded-xl transition-colors font-bold flex items-center gap-1.5 ${
                        autoRotate ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
                      Orbit Auto-Rotate: {autoRotate ? 'ON' : 'OFF'}
                    </button>

                    <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
                      <span className="text-slate-400">Height Scale:</span>
                      <input
                        type="range"
                        min="0.5"
                        max="3.0"
                        step="0.1"
                        value={heightScale}
                        onChange={(e) => setHeightScale(parseFloat(e.target.value))}
                        className="w-24 accent-indigo-500 cursor-pointer"
                      />
                      <span className="text-indigo-400 font-mono font-bold">{heightScale.toFixed(1)}x</span>
                    </div>
                  </div>

                  {/* Severity Filter Pills */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-400 mr-1">Filter:</span>
                    {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => (
                      <button
                        key={sev}
                        onClick={() => setSelectedSeverity(sev)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-colors ${
                          selectedSeverity === sev
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {sev}
                      </button>
                    ))}
                    <button
                      onClick={resetCamera}
                      className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 ml-2"
                    >
                      Reset View
                    </button>
                  </div>
                </div>
              </Card>

              {/* Three.js Canvas */}
              <CrimeMap3D
                points={processedPoints}
                autoRotate={autoRotate}
                rotationSpeed={rotationSpeed}
                onSelectPoint={setSelectedPoint}
              />

              {/* Selected Hotspot Drawer */}
              {selectedPoint && (
                <Card title="🎯 Selected 3D Hotspot Inspector" subtitle="Detailed Spatial Telemetry" className="bg-white border border-slate-200 shadow-sm p-4 animate-fadeIn">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-semibold">
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <span className="text-slate-500 font-bold uppercase text-[10px]">Incident Title</span>
                      <p className="text-slate-900 font-extrabold text-sm truncate">{selectedPoint.title}</p>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <span className="text-slate-500 font-bold uppercase text-[10px]">Category / District</span>
                      <p className="text-slate-900 font-bold text-xs">{selectedPoint.category} • {selectedPoint.district}</p>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <span className="text-slate-500 font-bold uppercase text-[10px]">Coordinates</span>
                      <p className="text-slate-900 font-mono font-bold text-xs">📍 {selectedPoint.latitude.toFixed(4)}, {selectedPoint.longitude.toFixed(4)}</p>
                    </div>
                    <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl space-y-1">
                      <span className="text-indigo-600 font-bold uppercase text-[10px]">3D Density Score</span>
                      <p className="text-indigo-900 font-extrabold text-sm">{selectedPoint.density * 20}% Risk Weight</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
