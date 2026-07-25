import api from "./api";

export interface OfficerStats {
  name: string;
  designation: string;
  totalCases: number;
  resolvedCases: number;
  resolutionRate: number;
  activeCases: number;
  rank?: number;
  trend?: "up" | "down" | "stable";
  change?: number;
}

export interface OfficerPerformance {
  officer: OfficerStats;
  rank: number;
  trend: "up" | "down" | "stable";
  change: number;
}

export const officerService = {
  /**
   * Get all officer performance stats from backend
   */
  getAll: async (): Promise<OfficerPerformance[]> => {
    const response = await api.get<OfficerStats[]>("/officers/performance");

    return response.data.map((item) => ({
      officer: {
        name: item.name,
        designation: item.designation || "Officer",
        totalCases: item.totalCases,
        resolvedCases: item.resolvedCases,
        resolutionRate: item.resolutionRate,
        activeCases: item.activeCases || 0,
      },
      rank: item.rank || 0,
      trend: item.trend || "stable",
      change: item.change || 0,
    }));
  },

  /**
   * Get top performing officers
   */
  getTopPerformers: async (
    limit: number = 5,
  ): Promise<OfficerPerformance[]> => {
    const all = await officerService.getAll();
    return all.slice(0, limit);
  },
};
