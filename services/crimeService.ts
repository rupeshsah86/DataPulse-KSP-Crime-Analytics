import api from "./api";

// ============================================
// TYPES
// ============================================

export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type Status = "OPEN" | "INVESTIGATING" | "CLOSED" | "COLD_CASE";

export interface Crime {
  id: number;
  crimeNumber: string;
  title: string;
  description?: string;
  category: string;
  severity: Severity;
  status: Status;
  incidentDate: string;
  incidentTime?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  district: string;
  city?: string;
  state?: string;
  country?: string;
  reportedBy?: string;
  policeStation?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CrimeFilters {
  district?: string;
  category?: string;
  status?: Status;
  severity?: Severity;
  keyword?: string;
}

// ============================================
// CRIME SERVICE
// ============================================

export const crimeService = {
  /**
   * Get all crimes
   */
  getAll: async (): Promise<Crime[]> => {
    const response = await api.get<Crime[]>("/crimes");
    return response.data;
  },

  /**
   * Get crime by ID
   */
  getById: async (id: number): Promise<Crime> => {
    const response = await api.get<Crime>(`/crimes/${id}`);
    return response.data;
  },

  /**
   * Create new crime
   */
  create: async (data: Partial<Crime>): Promise<Crime> => {
    const response = await api.post<Crime>("/crimes", data);
    return response.data;
  },

  /**
   * Update crime
   */
  update: async (id: number, data: Partial<Crime>): Promise<Crime> => {
    const response = await api.put<Crime>(`/crimes/${id}`, data);
    return response.data;
  },

  /**
   * Delete crime
   */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/crimes/${id}`);
  },

  /**
   * Search crimes by keyword
   */
  search: async (keyword: string): Promise<Crime[]> => {
    const response = await api.get<Crime[]>(
      `/crimes/search?keyword=${encodeURIComponent(keyword)}`,
    );
    return response.data;
  },

  /**
   * Filter crimes by multiple criteria
   */
  filter: async (filters: CrimeFilters): Promise<Crime[]> => {
    const params = new URLSearchParams();
    if (filters.district) params.append("district", filters.district);
    if (filters.category) params.append("category", filters.category);
    if (filters.status) params.append("status", filters.status);
    if (filters.severity) params.append("severity", filters.severity);
    if (filters.keyword) params.append("keyword", filters.keyword);

    const response = await api.get<Crime[]>(
      `/crimes/filter?${params.toString()}`,
    );
    return response.data;
  },

  /**
   * Get high priority crimes (CRITICAL and HIGH severity)
   */
  getHighPriority: async (): Promise<Crime[]> => {
    const response = await api.get<Crime[]>("/crimes/high-priority");
    return response.data;
  },

  /**
   * Get crimes by date range
   */
  getByDateRange: async (start: string, end: string): Promise<Crime[]> => {
    const response = await api.get<Crime[]>(
      `/crimes/date-range?start=${start}&end=${end}`,
    );
    return response.data;
  },

  /**
   * Get crimes by district
   */
  getByDistrict: async (district: string): Promise<Crime[]> => {
    const response = await api.get<Crime[]>(`/crimes/district/${district}`);
    return response.data;
  },

  /**
   * Get crimes by category
   */
  getByCategory: async (category: string): Promise<Crime[]> => {
    const response = await api.get<Crime[]>(`/crimes/category/${category}`);
    return response.data;
  },

  /**
   * Get crimes by status
   */
  getByStatus: async (status: Status): Promise<Crime[]> => {
    const response = await api.get<Crime[]>(`/crimes/status/${status}`);
    return response.data;
  },

  /**
   * Get crimes by severity
   */
  getBySeverity: async (severity: Severity): Promise<Crime[]> => {
    const response = await api.get<Crime[]>(`/crimes/severity/${severity}`);
    return response.data;
  },
};
