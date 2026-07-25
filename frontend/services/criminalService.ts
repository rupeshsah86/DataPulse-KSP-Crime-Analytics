import api from "./api";

export interface Criminal {
  id: number;
  criminalId: string;
  fullName: string;
  alias?: string;
  age?: number;
  gender?: string;
  address?: string;
  riskScore?: number;
  crimeCount?: number;
  isHabitual: boolean;
  isAbsconding: boolean;
  lastCrimeDate?: string;
}

export interface CriminalNetwork {
  id: number;
  criminal1: Criminal;
  criminal2: Criminal;
  relationshipType: string;
  relationshipDescription?: string;
  strength: number;
  caseNumber?: string;
  connectionDate: string;
}

export interface NetworkNode {
  id: string;
  name: string;
  riskLevel: string;
  crimeCount: number;
  type: string;
}

export interface NetworkEdge {
  source: string;
  target: string;
  relationship: string;
  strength: number;
  type: string;
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

export const criminalService = {
  /**
   * Get all criminals
   */
  getAll: async (): Promise<Criminal[]> => {
    const response = await api.get<Criminal[]>("/criminals");
    return response.data;
  },

  /**
   * Get criminal by ID
   */
  getById: async (id: number): Promise<Criminal> => {
    const response = await api.get<Criminal>(`/criminals/${id}`);
    return response.data;
  },

  /**
   * Create criminal
   */
  create: async (data: Partial<Criminal>): Promise<Criminal> => {
    const response = await api.post<Criminal>("/criminals", data);
    return response.data;
  },

  /**
   * Delete criminal
   */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/criminals/${id}`);
  },

  /**
   * Add connection between criminals
   */
  addConnection: async (
    criminal1Id: number,
    criminal2Id: number,
    relationshipType: string,
  ): Promise<CriminalNetwork> => {
    const response = await api.post<CriminalNetwork>(
      `/criminals/${criminal1Id}/connect/${criminal2Id}?relationshipType=${relationshipType}`,
    );
    return response.data;
  },

  /**
   * Get criminal network (connections for a specific criminal)
   */
  getNetwork: async (criminalId: number): Promise<CriminalNetwork[]> => {
    const response = await api.get<CriminalNetwork[]>(
      `/criminals/${criminalId}/network`,
    );
    return response.data;
  },

  /**
   * Get complete network data for graph visualization
   */
  getNetworkData: async (): Promise<NetworkData> => {
    const response = await api.get<NetworkData>("/criminals/network-data");
    return response.data;
  },
};
