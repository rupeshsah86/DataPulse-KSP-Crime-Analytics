"use client";

import { useState, useEffect, useCallback } from "react";
import {
  aiService,
  Hotspot,
  PredictionResponse,
  PatternResponse,
} from "@/services/aiService";
import toast from "react-hot-toast";

export const useAI = () => {
  const [hotspots, setHotspots] = useState<Hotspot[]>([]);
  const [patterns, setPatterns] = useState<PatternResponse | null>(null);
  const [predictions, setPredictions] = useState<PredictionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [predicting, setPredicting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================
  // FETCH HOTSPOTS
  // ============================================
  const fetchHotspots = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await aiService.getHotspots();
      setHotspots(response.data || []);
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to fetch hotspots";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // FETCH PATTERNS
  // ============================================
  const fetchPatterns = useCallback(async () => {
    try {
      const response = await aiService.getPatterns();
      setPatterns(response);
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to fetch patterns";
      toast.error(message);
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
        setPredictions(response);
        return response;
      } catch (err: any) {
        const message =
          err.response?.data?.message || "Failed to predict crimes";
        setError(message);
        toast.error(message);
        throw err;
      } finally {
        setPredicting(false);
      }
    },
    [],
  );

  // ============================================
  // GET RISK COLOR
  // ============================================
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

  // ============================================
  // GET RISK LEVEL LABEL
  // ============================================
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

  // ============================================
  // LOAD DATA ON MOUNT
  // ============================================
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
