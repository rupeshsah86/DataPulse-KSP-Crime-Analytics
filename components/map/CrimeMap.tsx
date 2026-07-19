'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Crime } from '@/services/crimeService';
import { Badge } from '@/components/ui/Badge';

// Fix Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/images/marker-icon-2x.png',
    iconUrl: '/images/marker-icon.png',
    shadowUrl: '/images/marker-shadow.png',
});

interface CrimeMapProps {
    crimes: Crime[];
    loading?: boolean;
}

// Component to set map view based on crimes
const MapController: React.FC<{ crimes: Crime[] }> = ({ crimes }) => {
    const map = useMap();

    useEffect(() => {
        const defaultLat = 12.9716;
        const defaultLng = 77.5946;

        if (crimes.length > 0) {
            const validCrimes = crimes.filter(c => c.latitude && c.longitude);
            if (validCrimes.length > 0) {
                const lat = validCrimes.reduce((sum, c) => sum + (c.latitude || 0), 0) / validCrimes.length;
                const lng = validCrimes.reduce((sum, c) => sum + (c.longitude || 0), 0) / validCrimes.length;
                map.setView([lat, lng], 12);
            } else {
                map.setView([defaultLat, defaultLng], 12);
            }
        } else {
            map.setView([defaultLat, defaultLng], 12);
        }
    }, [crimes, map]);

    return null;
};

// Get marker color based on severity
const getMarkerColor = (severity: string): string => {
    switch (severity) {
        case 'CRITICAL':
            return '#dc3545';
        case 'HIGH':
            return '#fd7e14';
        case 'MEDIUM':
            return '#ffc107';
        case 'LOW':
            return '#28a745';
        default:
            return '#1a5276';
    }
};

// Create custom marker icon
const createMarkerIcon = (severity: string) => {
    const color = getMarkerColor(severity);
    return L.divIcon({
        className: 'custom-marker',
        html: `<div style="
      width: 24px;
      height: 24px;
      background-color: ${color};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      color: white;
      font-weight: bold;
    ">📍</div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
    });
};

export const CrimeMap: React.FC<CrimeMapProps> = ({ crimes, loading = false }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const validCrimes = crimes.filter(c => c.latitude && c.longitude);

    if (!mounted || loading) {
        return (
            <div className="h-[500px] bg-gray-100 rounded-xl flex items-center justify-center">
                <p className="text-gray-500">Loading map...</p>
            </div>
        );
    }

    if (validCrimes.length === 0) {
        return (
            <div className="h-[500px] bg-gray-100 rounded-xl flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-500">No crime locations to display</p>
                    <p className="text-xs text-gray-400 mt-1">Add latitude/longitude to crimes</p>
                </div>
            </div>
        );
    }

    const centerLat = validCrimes.reduce((sum, c) => sum + (c.latitude || 0), 0) / validCrimes.length;
    const centerLng = validCrimes.reduce((sum, c) => sum + (c.longitude || 0), 0) / validCrimes.length;

    return (
        <div className="h-[500px] rounded-xl overflow-hidden border border-gray-200">
            <MapContainer
                center={[centerLat, centerLng]}
                zoom={12}
                style={{ height: '100%', width: '100%' }}
                zoomControl={true}
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapController crimes={validCrimes} />

                {validCrimes.map((crime) => (
                    <Marker
                        key={crime.id}
                        position={[crime.latitude || 0, crime.longitude || 0]}
                        icon={createMarkerIcon(crime.severity)}
                    >
                        <Popup>
                            <div className="p-1 min-w-[200px]">
                                <h3 className="font-semibold text-gray-800">{crime.title}</h3>
                                <p className="text-sm text-gray-600">District: {crime.district}</p>
                                <div className="flex gap-2 mt-2 flex-wrap">
                                    <Badge variant={crime.status.toLowerCase() as any}>
                                        {crime.status}
                                    </Badge>
                                    <Badge variant={crime.severity.toLowerCase() as any}>
                                        {crime.severity}
                                    </Badge>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">{crime.incidentDate}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};