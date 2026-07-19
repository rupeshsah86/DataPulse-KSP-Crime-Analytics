"use client";

import { useState, useEffect, useCallback } from "react";
import { dashboardService } from "@/services/dashboardService";
import toast from "react-hot-toast";

export interface DashboardStats {
  totalCrimes: number;
  activeCases: number;
  resolutionRate: number;
  crimesByDistrict: Array<[string, number]>;
  crimesByStatus: Array<[string, number]>;
  crimesBySeverity: Array<[string, number]>;
}

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Failed to fetch dashboard stats";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, fetchStats };
};
