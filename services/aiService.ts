import api from "./api";

// ============================================
// TYPES
// ============================================

export interface Hotspot {
  latitude: number;
  longitude: number;
  risk: number;
  level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  crime_count?: number;
}

export interface HotspotResponse {
  hotspots: Hotspot[];
  total: number;
  timestamp: string;
  source: string;
}

export interface PredictionRequest {
  latitude: number;
  longitude: number;
  date: string;
  crime_type?: string;
}

export interface PredictionResponse {
  latitude: number;
  longitude: number;
  predicted_risk: number;
  risk_level: string;
  confidence: number;
  date: string;
}

export interface PatternResponse {
  time_patterns: {
    peak_hours: string[];
    peak_days: string[];
    peak_months: string[];
  };
  category_patterns: {
    increasing: string[];
    decreasing: string[];
    stable: string[];
  };
  trends: {
    overall: string;
    percentage_change: number;
    period: string;
  };
  timestamp: string;
}

// ============================================
// AI SERVICE
// ============================================

export const aiService = {
  /**
   * Get crime hotspots from AI service
   */
  getHotspots: async (): Promise<HotspotResponse> => {
    const response = await api.get<HotspotResponse>("/ai/hotspots");
    return response.data;
  },

  /**
   * Predict crime risk for locations
   */
  predictCrimes: async (
    locations: PredictionRequest[],
  ): Promise<PredictionResponse[]> => {
    const response = await api.post<PredictionResponse[]>(
      "/ai/predict",
      locations,
    );
    return response.data;
  },

  /**
   * Get crime patterns
   */
  getPatterns: async (): Promise<PatternResponse> => {
    const response = await api.get<PatternResponse>("/ai/patterns");
    return response.data;
  },

  /**
   * Get AI health status
   */
  getAIHealth: async (): Promise<{ status: string; aiServiceUrl: string }> => {
    const response = await api.get("/ai/health");
    return response.data;
  },
};
