'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Hotspot } from '@/services/aiService';
import { Badge } from '@/components/ui/Badge';

interface LeafletHotspotMapProps {
    hotspots: Hotspot[];
}

const MapController: React.FC<{ hotspots: Hotspot[] }> = ({ hotspots }) => {
    const map = useMap();

    useEffect(() => {
        if (hotspots.length > 0) {
            const valid = hotspots.filter(h => h.latitude && h.longitude);
            if (valid.length > 0) {
                const lat = valid.reduce((sum, h) => sum + h.latitude, 0) / valid.length;
                const lng = valid.reduce((sum, h) => sum + h.longitude, 0) / valid.length;
                map.setView([lat, lng], 12);
            }
        }
    }, [hotspots, map]);

    return null;
};

const getRiskColor = (level: string): string => {
    switch (level) {
        case 'CRITICAL': return '#EF4444';
        case 'HIGH': return '#F97316';
        case 'MEDIUM': return '#F59E0B';
        case 'LOW': return '#10B981';
        default: return '#6366F1';
    }
};

export const LeafletHotspotMap: React.FC<LeafletHotspotMapProps> = ({ hotspots }) => {
    const defaultCenter: [number, number] = [12.9716, 77.5946];

    return (
        <div className="h-[460px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative z-0">
            <MapContainer
                center={defaultCenter}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapController hotspots={hotspots} />

                {hotspots.map((hotspot, index) => {
                    const color = getRiskColor(hotspot.level);
                    return (
                        <CircleMarker
                            key={index}
                            center={[hotspot.latitude, hotspot.longitude]}
                            radius={16 + (hotspot.risk / 10)}
                            pathOptions={{
                                color: color,
                                fillColor: color,
                                fillOpacity: 0.45,
                                weight: 3,
                            }}
                        >
                            <Popup>
                                <div className="p-1 space-y-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <h4 className="font-bold text-slate-900 text-sm">Hotspot #{index + 1}</h4>
                                        <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: color }}>
                                            {hotspot.risk}% Risk
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-600 font-medium">Risk Level: <strong>{hotspot.level}</strong></p>
                                    <p className="text-[11px] text-slate-500 font-mono">
                                        📍 {hotspot.latitude.toFixed(4)}, {hotspot.longitude.toFixed(4)}
                                    </p>
                                </div>
                            </Popup>
                        </CircleMarker>
                    );
                })}
            </MapContainer>
        </div>
    );
};
