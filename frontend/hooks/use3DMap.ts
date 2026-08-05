'use client';

import { useState, useCallback } from 'react';
import { Crime3DPoint } from '@/utils/mapDataProcessor';

export const use3DMap = () => {
  const [autoRotate, setAutoRotate] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(0.5);
  const [heightScale, setHeightScale] = useState(1.2);
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [selectedPoint, setSelectedPoint] = useState<Crime3DPoint | null>(null);

  const toggleAutoRotate = useCallback(() => {
    setAutoRotate((prev) => !prev);
  }, []);

  const resetCamera = useCallback(() => {
    setSelectedPoint(null);
    setAutoRotate(true);
    setHeightScale(1.2);
  }, []);

  return {
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
  };
};
