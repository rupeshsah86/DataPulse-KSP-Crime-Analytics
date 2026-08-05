import { Crime } from '@/services/crimeService';

export interface Crime3DPoint {
  id: string | number;
  title: string;
  category: string;
  severity: string;
  district: string;
  latitude: number;
  longitude: number;
  // 3D Spatial attributes
  x: number;
  y: number;
  z: number;
  height: number;
  radius: number;
  color: string;
  density: number;
}

export const processCrimesTo3DGrid = (
  crimes: Crime[],
  heightMultiplier: number = 1.0
): Crime3DPoint[] => {
  if (!crimes || crimes.length === 0) return [];

  // Center reference origin (Bangalore center coordinates)
  const centerLat = 12.9716;
  const centerLng = 77.5946;
  const scale = 250; // Spatial scaling factor for 3D viewport canvas

  return crimes.map((crime, idx) => {
    const lat = crime.latitude || centerLat + (Math.random() - 0.5) * 0.1;
    const lng = crime.longitude || centerLng + (Math.random() - 0.5) * 0.1;

    // Convert lat/lng delta into 3D WebGL XZ plane coordinates
    const x = (lng - centerLng) * scale;
    const z = (centerLat - lat) * scale;

    let baseHeight = 1.5;
    let color = '#10B981'; // Green (Low)
    let density = 1;

    switch (crime.severity) {
      case 'CRITICAL':
        baseHeight = 6.0;
        color = '#EF4444'; // Red
        density = 5;
        break;
      case 'HIGH':
        baseHeight = 4.2;
        color = '#F97316'; // Orange
        density = 3;
        break;
      case 'MEDIUM':
        baseHeight = 2.8;
        color = '#F59E0B'; // Amber
        density = 2;
        break;
      default:
        baseHeight = 1.5;
        color = '#10B981';
        density = 1;
        break;
    }

    const calculatedHeight = Math.max(1.0, baseHeight * heightMultiplier);
    const y = calculatedHeight / 2; // Elevator center Y position in Three.js

    return {
      id: crime.id || idx,
      title: crime.title || 'Crime Incident',
      category: crime.category || 'GENERAL',
      severity: crime.severity || 'MEDIUM',
      district: crime.district || 'Bangalore Urban',
      latitude: lat,
      longitude: lng,
      x,
      y,
      z,
      height: calculatedHeight,
      radius: 0.6 + density * 0.15,
      color,
      density,
    };
  });
};
