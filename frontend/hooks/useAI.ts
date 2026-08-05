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
  // FETCH HOTSPOTS - FIXED
  // ============================================
  const fetchHotspots = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await aiService.getHotspots();
      console.log("🔍 Hotspots response:", response);

      // Extract hotspots from response structure
      let hotspotsData: Hotspot[] = [];

      // Check if response has hotspots array directly
      if (response && response.hotspots && Array.isArray(response.hotspots)) {
        hotspotsData = response.hotspots;
      }
      // Check if response has data.hotspots
      else if (response && response.data && response.data.hotspots && Array.isArray(response.data.hotspots)) {
        hotspotsData = response.data.hotspots;
      }
      // Check if response is an array itself
      else if (Array.isArray(response)) {
        hotspotsData = response;
      }
      // If response has a data property that's an array
      else if (response && response.data && Array.isArray(response.data)) {
        hotspotsData = response.data;
      }

      setHotspots(hotspotsData);
    } catch (err: any) {
      const message = err.response?.data?.message || "Failed to fetch hotspots";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================
  // FETCH PATTERNS - UNWRAP RESPONSE
  // ============================================
  const fetchPatterns = useCallback(async () => {
    try {
      const response: any = await aiService.getPatterns();
      console.log("🔍 Patterns raw response:", response);

      let patternsData = response;
      if (response && response.data && typeof response.data === "object" && "time_patterns" in response.data) {
        patternsData = response.data;
      } else if (response && response.time_patterns) {
        patternsData = response;
      }

      setPatterns(patternsData);
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

        console.log("🔍 Raw predict response:", response);

        let predictionsData = response;
        if (!Array.isArray(predictionsData)) {
          console.warn("⚠️ Predictions is not an array:", predictionsData);
          predictionsData = [];
        }

        console.log("🔍 Setting predictions:", predictionsData);
        setPredictions(predictionsData);
        return predictionsData;
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