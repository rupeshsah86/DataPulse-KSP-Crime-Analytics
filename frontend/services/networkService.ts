import api from "./api";

export interface NetworkNode {
  id: string;
  name: string;
  type: "criminal" | "accomplice" | "victim" | "unknown";
  riskLevel?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  crimeCount?: number;
  group?: string;
}

export interface NetworkEdge {
  source: string;
  target: string;
  relationship: string;
  strength?: number;
  type?: "direct" | "indirect";
}

export interface NetworkData {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  metadata: {
    totalNodes: number;
    totalEdges: number;
    lastUpdated: string;
  };
}

export const networkService = {
  getNetwork: async (): Promise<NetworkData> => {
    const response = await api.get<NetworkData>("/network");
    return response.data;
  },

  getNetworkByCriminal: async (criminalId: string): Promise<NetworkData> => {
    const response = await api.get<NetworkData>(`/network/${criminalId}`);
    return response.data;
  },
};
