import api from "./api";

export interface Hotspot {
  latitude: number;
  longitude: number;
  risk: number;
  level: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  crime_count?: number;
}

export interface HotspotResponse {
  hotspots?: Hotspot[];
  data?: {
    hotspots: Hotspot[];
    total?: number;
    timestamp?: string;
    source?: string;
  };
  total?: number;
  timestamp?: string;
  source?: string;
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

export const aiService = {
  getHotspots: async (): Promise<HotspotResponse> => {
    const response = await api.get<HotspotResponse>("/ai/hotspots");
    return response.data;
  },

  predictCrimes: async (
    locations: PredictionRequest[],
  ): Promise<PredictionResponse[]> => {
    const response = await api.post("/ai/predict", locations);
    if (
      response.data &&
      typeof response.data === "object" &&
      "data" in response.data
    ) {
      return (response.data as any).data;
    }
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return response.data;
  },

  getPatterns: async (): Promise<PatternResponse> => {
    const response = await api.get<PatternResponse>("/ai/patterns");
    return response.data;
  },

  getAIHealth: async (): Promise<{ status: string; aiServiceUrl: string }> => {
    const response = await api.get("/ai/health");
    return response.data;
  },
};
