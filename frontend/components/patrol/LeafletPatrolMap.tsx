'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Polyline, Popup, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/images/marker-icon-2x.png',
    iconUrl: '/images/marker-icon.png',
    shadowUrl: '/images/marker-shadow.png',
});

interface Waypoint {
    step: number;
    id: number | string;
    name: string;
    latitude: number;
    longitude: number;
    risk: number;
    level: string;
}

interface LeafletPatrolMapProps {
    waypoints: Waypoint[];
}

const MapController: React.FC<{ waypoints: Waypoint[] }> = ({ waypoints }) => {
    const map = useMap();

    useEffect(() => {
        if (waypoints.length > 0) {
            const bounds = L.latLngBounds(waypoints.map(w => [w.latitude, w.longitude]));
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [waypoints, map]);

    return null;
};

const getLevelColor = (level: string) => {
    switch (level) {
        case 'BASE': return '#3B82F6';
        case 'CRITICAL': return '#EF4444';
        case 'HIGH': return '#F97316';
        case 'MEDIUM': return '#F59E0B';
        default: return '#10B981';
    }
};

export const LeafletPatrolMap: React.FC<LeafletPatrolMapProps> = ({ waypoints }) => {
    const polylinePositions: [number, number][] = waypoints.map(w => [w.latitude, w.longitude]);
    const defaultCenter: [number, number] = waypoints.length > 0
        ? [waypoints[0].latitude, waypoints[0].longitude]
        : [12.9716, 77.5946];

    return (
        <div className="h-[520px] w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative z-0">
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
                <MapController waypoints={waypoints} />

                {/* Polyline Path */}
                {polylinePositions.length > 1 && (
                    <Polyline
                        positions={polylinePositions}
                        pathOptions={{
                            color: '#4F46E5',
                            weight: 5,
                            opacity: 0.8,
                            dashArray: '8, 6',
                        }}
                    />
                )}

                {/* Waypoint Circle Markers */}
                {waypoints.map((wp, index) => {
                    const color = getLevelColor(wp.level);
                    return (
                        <CircleMarker
                            key={`${wp.id}-${index}`}
                            center={[wp.latitude, wp.longitude]}
                            radius={wp.level === 'BASE' ? 14 : 18}
                            pathOptions={{
                                color: '#FFFFFF',
                                fillColor: color,
                                fillOpacity: 0.9,
                                weight: 3,
                            }}
                        >
                            <Popup>
                                <div className="p-1 space-y-1">
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white bg-slate-900">
                                            Step #{wp.step}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: color }}>
                                            {wp.level}
                                        </span>
                                    </div>
                                    <h4 className="font-bold text-slate-900 text-sm mt-1">{wp.name}</h4>
                                    {wp.level !== 'BASE' && (
                                        <p className="text-xs text-slate-600 font-medium">Risk Score: <strong>{wp.risk}%</strong></p>
                                    )}
                                    <p className="text-[11px] text-slate-500 font-mono">
                                        📍 {wp.latitude.toFixed(4)}, {wp.longitude.toFixed(4)}
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
