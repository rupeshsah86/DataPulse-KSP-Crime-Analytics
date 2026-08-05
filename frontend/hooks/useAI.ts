"use client";

import { useState, useEffect, useCallback } from "react";
import {
  aiService,
  Hotspot,
  PredictionResponse,
  PatternResponse,
} from "@/services/aiService";
import toast from "react-hot-toast";

const FALLBACK_HOTSPOTS: Hotspot[] = [
  { latitude: 12.9716, longitude: 77.5946, risk: 85, level: "CRITICAL", crime_count: 12 },
  { latitude: 12.9784, longitude: 77.6408, risk: 72, level: "HIGH", crime_count: 8 },
  { latitude: 12.9352, longitude: 77.6245, risk: 65, level: "HIGH", crime_count: 6 },
  { latitude: 12.9698, longitude: 77.7499, risk: 58, level: "MEDIUM", crime_count: 4 },
  { latitude: 12.9421, longitude: 77.5718, risk: 45, level: "MEDIUM", crime_count: 3 },
];

const FALLBACK_PATTERNS: PatternResponse = {
  time_patterns: {
    peak_hours: ["18:00-20:00", "22:00-23:00"],
    peak_days: ["Friday", "Saturday"],
    peak_months: ["July", "August", "December"],
  },
  category_patterns: {
    increasing: ["CYBER_CRIME", "VEHICLE_THEFT"],
    decreasing: ["BURGLARY"],
    stable: ["ASSAULT", "ROBBERY"],
  },
  trends: {
    overall: "Slight Increase in Cyber Crimes",
    percentage_change: 4.2,
    period: "Last 30 Days",
  },
  timestamp: new Date().toISOString(),
};

export const useAI = () => {
  const [hotspots, setHotspots] = useState<Hotspot[]>(FALLBACK_HOTSPOTS);
  const [patterns, setPatterns] = useState<PatternResponse | null>(FALLBACK_PATTERNS);
  const [predictions, setPredictions] = useState<PredictionResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // FETCH HOTSPOTS
  // ============================================
  const fetchHotspots = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response: any = await aiService.getHotspots();
      let hotspotsData: Hotspot[] = [];

      if (response && Array.isArray(response.data)) {
        hotspotsData = response.data;
      } else if (response && response.hotspots && Array.isArray(response.hotspots)) {
        hotspotsData = response.hotspots;
      } else if (response && response.data && response.data.hotspots && Array.isArray(response.data.hotspots)) {
        hotspotsData = response.data.hotspots;
      } else if (Array.isArray(response)) {
        hotspotsData = response;
      }

      if (hotspotsData.length > 0) {
        setHotspots(hotspotsData);
      }
    } catch (err: any) {
      console.warn("Using fallback hotspots:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // FETCH PATTERNS
  // ============================================
  const fetchPatterns = useCallback(async () => {
    try {
      const response: any = await aiService.getPatterns();
      let patternsData = response;
      if (response && response.data && typeof response.data === "object" && "time_patterns" in response.data) {
        patternsData = response.data;
      } else if (response && response.time_patterns) {
        patternsData = response;
      }

      if (patternsData && patternsData.time_patterns) {
        setPatterns(patternsData);
      }
    } catch (err: any) {
      console.warn("Using fallback patterns:", err);
    }
  }, []);

  // ============================================
  // PREDICT CRIME RISK
  // ============================================
  const predictCrimes = useCallback(
    async (
      locations: Array<{ latitude: number; longitude: number; date: string }>,
    ) => {
      setPredicting(true);
      setError(null);

      try {
        const response = await aiService.predictCrimes(locations);
        let predictionsData = response;
        if (!Array.isArray(predictionsData)) {
          predictionsData = [];
        }
        setPredictions(predictionsData);
        return predictionsData;
      } catch (err: any) {
        const message = err.response?.data?.message || "Failed to predict crimes";
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setPredicting(false);
      }
    },
    [],
  );

  const getRiskColor = (level: string): string => {
    switch (level) {
      case "CRITICAL":
        return "text-status-critical bg-red-100";
      case "HIGH":
        return "text-status-high bg-orange-100";
      case "MEDIUM":
        return "text-status-medium bg-yellow-100";
      case "LOW":
        return "text-status-low bg-green-100";
      default:
        return "text-gray-500 bg-gray-100";
    }
  };

  const getRiskLabel = (level: string): string => {
    switch (level) {
      case "CRITICAL":
        return "🚨 Critical";
      case "HIGH":
        return "⚠️ High";
      case "MEDIUM":
        return "📊 Medium";
      case "LOW":
        return "✅ Low";
      default:
        return "Unknown";
    }
  };

  useEffect(() => {
    fetchHotspots();
    fetchPatterns();
  }, [fetchHotspots, fetchPatterns]);

  return {
    hotspots,
    patterns,
    predictions,
    loading,
    predicting,
    error,
    fetchHotspots,
    fetchPatterns,
    predictCrimes,
    getRiskColor,
    getRiskLabel,
  };
};