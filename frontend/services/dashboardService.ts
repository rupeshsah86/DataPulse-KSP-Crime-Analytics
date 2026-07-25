import api from "./api";

// ============================================
// TYPES
// ============================================

export interface DashboardStats {
  totalCrimes: number;
  activeCases: number;
  resolutionRate: number;
  crimesByDistrict: Array<[string, number]>;
  crimesByStatus: Array<[string, number]>;
  crimesBySeverity: Array<[string, number]>;
}

// ============================================
// DASHBOARD SERVICE
// ============================================

export const dashboardService = {
  /**
   * Get dashboard statistics
   */
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>("/crimes/dashboard/stats");
    return response.data;
  },
};
