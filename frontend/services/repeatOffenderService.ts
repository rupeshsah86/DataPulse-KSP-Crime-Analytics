import api from "./api";

export interface OffenderRecord {
  id: number;
  name: string;
  badgeNumber?: string;
  crimeCount: number;
  lastCrimeDate: string;
  firstCrimeDate: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  crimes: Array<{
    id: number;
    title: string;
    category: string;
    severity: string;
    status: string;
    incidentDate: string;
    district: string;
  }>;
}

export interface RepeatOffenderStats {
  totalOffenders: number;
  highRiskCount: number;
  mediumRiskCount: number;
  lowRiskCount: number;
  topOffenders: OffenderRecord[];
}

export const repeatOffenderService = {
  /**
   * Get all repeat offenders (crime count >= 2)
   */
  getAll: async (): Promise<RepeatOffenderStats> => {
    const response = await api.get<RepeatOffenderStats>("/offenders/repeat");
    return response.data;
  },

  /**
   * Get offender details by ID
   */
  getById: async (id: number): Promise<OffenderRecord> => {
    const response = await api.get<OffenderRecord>(`/offenders/${id}`);
    return response.data;
  },
};
