"use client";

import { useState, useEffect, useCallback } from "react";
import {
  repeatOffenderService,
  RepeatOffenderStats,
  OffenderRecord,
} from "@/services/repeatOffenderService";
import toast from "react-hot-toast";

export const useRepeatOffenders = () => {
  const [stats, setStats] = useState<RepeatOffenderStats | null>(null);
  const [offenders, setOffenders] = useState<OffenderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOffenders = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await repeatOffenderService.getAll();
      setStats(data);
      setOffenders(data.topOffenders || []);
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Failed to fetch repeat offenders";
      setError(message);
      toast.error(message);
      // Use mock data for demo
      setStats(getMockStats());
      setOffenders(getMockOffenders());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffenders();
  }, [fetchOffenders]);

  const getRiskColor = (level: string): string => {
    switch (level) {
      case "CRITICAL":
        return "bg-red-100 text-red-800";
      case "HIGH":
        return "bg-orange-100 text-orange-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "LOW":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getRiskBadge = (level: string): string => {
    switch (level) {
      case "CRITICAL":
        return "🔴 Critical";
      case "HIGH":
        return "🟠 High";
      case "MEDIUM":
        return "🟡 Medium";
      case "LOW":
        return "🟢 Low";
      default:
        return "⚪ Unknown";
    }
  };

  return {
    stats,
    offenders,
    loading,
    error,
    fetchOffenders,
    getRiskColor,
    getRiskBadge,
  };
};

// ============================================
// MOCK DATA (Fallback)
// ============================================

const getMockStats = (): RepeatOffenderStats => ({
  totalOffenders: 8,
  highRiskCount: 2,
  mediumRiskCount: 3,
  lowRiskCount: 3,
  topOffenders: getMockOffenders(),
});

const getMockOffenders = (): OffenderRecord[] => [
  {
    id: 1,
    name: "Ravi Kumar",
    badgeNumber: "KSP001",
    crimeCount: 5,
    lastCrimeDate: "2026-07-18",
    firstCrimeDate: "2026-01-15",
    riskLevel: "CRITICAL",
    crimes: [
      {
        id: 1,
        title: "Bank Robbery",
        category: "ROBBERY",
        severity: "CRITICAL",
        status: "OPEN",
        incidentDate: "2026-07-18",
        district: "Bangalore Urban",
      },
      {
        id: 2,
        title: "Armed Robbery",
        category: "ROBBERY",
        severity: "HIGH",
        status: "INVESTIGATING",
        incidentDate: "2026-06-20",
        district: "Bangalore Urban",
      },
    ],
  },
  {
    id: 2,
    name: "Priya Sharma",
    badgeNumber: "KSP002",
    crimeCount: 4,
    lastCrimeDate: "2026-07-16",
    firstCrimeDate: "2026-02-10",
    riskLevel: "HIGH",
    crimes: [
      {
        id: 3,
        title: "Cyber Fraud",
        category: "CYBER_CRIME",
        severity: "HIGH",
        status: "OPEN",
        incidentDate: "2026-07-16",
        district: "Bangalore Urban",
      },
      {
        id: 4,
        title: "Online Scam",
        category: "FRAUD",
        severity: "MEDIUM",
        status: "CLOSED",
        incidentDate: "2026-05-12",
        district: "Bangalore Urban",
      },
    ],
  },
  {
    id: 3,
    name: "Suresh Reddy",
    badgeNumber: "KSP003",
    crimeCount: 3,
    lastCrimeDate: "2026-07-14",
    firstCrimeDate: "2026-03-05",
    riskLevel: "MEDIUM",
    crimes: [
      {
        id: 5,
        title: "Burglary",
        category: "BURGLARY",
        severity: "MEDIUM",
        status: "OPEN",
        incidentDate: "2026-07-14",
        district: "Mysore",
      },
    ],
  },
  {
    id: 4,
    name: "Ananya Singh",
    badgeNumber: "KSP004",
    crimeCount: 3,
    lastCrimeDate: "2026-07-12",
    firstCrimeDate: "2026-04-20",
    riskLevel: "MEDIUM",
    crimes: [
      {
        id: 6,
        title: "Vehicle Theft",
        category: "VEHICLE_THEFT",
        severity: "MEDIUM",
        status: "INVESTIGATING",
        incidentDate: "2026-07-12",
        district: "Bangalore Urban",
      },
    ],
  },
  {
    id: 5,
    name: "Vikram Raj",
    badgeNumber: "KSP005",
    crimeCount: 2,
    lastCrimeDate: "2026-07-10",
    firstCrimeDate: "2026-05-25",
    riskLevel: "LOW",
    crimes: [
      {
        id: 7,
        title: "Theft",
        category: "THEFT",
        severity: "LOW",
        status: "CLOSED",
        incidentDate: "2026-07-10",
        district: "Hubli",
      },
    ],
  },
];
