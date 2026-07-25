"use client";

import { useState, useEffect, useCallback } from "react";
import {
  criminalService,
  NetworkData,
  NetworkNode,
  NetworkEdge,
} from "@/services/criminalService";
import toast from "react-hot-toast";

export const useNetwork = () => {
  const [networkData, setNetworkData] = useState<NetworkData | null>(null);
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [edges, setEdges] = useState<NetworkEdge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);

  const fetchNetwork = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await criminalService.getNetworkData();
      setNetworkData(data);
      setNodes(data.nodes || []);
      setEdges(data.edges || []);
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Failed to fetch network data";
      setError(message);
      toast.error(message);
      // Use mock data as fallback
      setNetworkData(getMockNetworkData());
      setNodes(getMockNetworkData().nodes);
      setEdges(getMockNetworkData().edges);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNetwork();
  }, [fetchNetwork]);

  const getNodeColor = (riskLevel?: string): string => {
    switch (riskLevel) {
      case "CRITICAL":
        return "#dc3545";
      case "HIGH":
        return "#fd7e14";
      case "MEDIUM":
        return "#ffc107";
      case "LOW":
        return "#28a745";
      default:
        return "#6c757d";
    }
  };

  const getNodeSize = (crimeCount?: number): number => {
    if (!crimeCount) return 20;
    return Math.min(20 + crimeCount * 5, 50);
  };

  const getRelationshipLabel = (type?: string): string => {
    switch (type) {
      case "direct":
        return "Direct";
      case "indirect":
        return "Indirect";
      default:
        return "Connected";
    }
  };

  const filterByRisk = (riskLevel: string): NetworkNode[] => {
    if (riskLevel === "ALL") return nodes;
    return nodes.filter((node) => node.riskLevel === riskLevel);
  };

  const getNodeById = (id: string): NetworkNode | undefined => {
    return nodes.find((node) => node.id === id);
  };

  const getNeighbors = (nodeId: string): NetworkNode[] => {
    const connectedIds = edges
      .filter((edge) => edge.source === nodeId || edge.target === nodeId)
      .map((edge) => (edge.source === nodeId ? edge.target : edge.source));

    return nodes.filter((node) => connectedIds.includes(node.id));
  };

  return {
    networkData,
    nodes,
    edges,
    loading,
    error,
    selectedNode,
    setSelectedNode,
    fetchNetwork,
    getNodeColor,
    getNodeSize,
    getRelationshipLabel,
    filterByRisk,
    getNodeById,
    getNeighbors,
  };
};

// ============================================
// MOCK DATA (Fallback) - group removed
// ============================================

const getMockNetworkData = (): NetworkData => ({
  nodes: [
    {
      id: "n1",
      name: "Ravi Kumar",
      type: "criminal",
      riskLevel: "CRITICAL",
      crimeCount: 5,
    },
    {
      id: "n2",
      name: "Suresh Reddy",
      type: "criminal",
      riskLevel: "HIGH",
      crimeCount: 3,
    },
    {
      id: "n3",
      name: "Priya Sharma",
      type: "criminal",
      riskLevel: "MEDIUM",
      crimeCount: 2,
    },
    {
      id: "n4",
      name: "Vikram Raj",
      type: "accomplice",
      riskLevel: "HIGH",
      crimeCount: 2,
    },
    {
      id: "n5",
      name: "Ananya Singh",
      type: "criminal",
      riskLevel: "MEDIUM",
      crimeCount: 2,
    },
    {
      id: "n6",
      name: "Deepak Shah",
      type: "accomplice",
      riskLevel: "LOW",
      crimeCount: 1,
    },
    {
      id: "n7",
      name: "Manoj Gupta",
      type: "criminal",
      riskLevel: "HIGH",
      crimeCount: 3,
    },
    {
      id: "n8",
      name: "Arjun Patel",
      type: "accomplice",
      riskLevel: "MEDIUM",
      crimeCount: 1,
    },
  ],
  edges: [
    {
      source: "n1",
      target: "n2",
      relationship: "Partner",
      strength: 8,
      type: "direct",
    },
    {
      source: "n1",
      target: "n4",
      relationship: "Associate",
      strength: 6,
      type: "direct",
    },
    {
      source: "n2",
      target: "n4",
      relationship: "Accomplice",
      strength: 7,
      type: "direct",
    },
    {
      source: "n3",
      target: "n5",
      relationship: "Partner",
      strength: 9,
      type: "direct",
    },
    {
      source: "n3",
      target: "n6",
      relationship: "Associate",
      strength: 5,
      type: "direct",
    },
    {
      source: "n5",
      target: "n6",
      relationship: "Accomplice",
      strength: 4,
      type: "direct",
    },
    {
      source: "n7",
      target: "n8",
      relationship: "Partner",
      strength: 7,
      type: "direct",
    },
    {
      source: "n1",
      target: "n7",
      relationship: "Connected",
      strength: 3,
      type: "indirect",
    },
  ],
  metadata: {
    totalNodes: 8,
    totalEdges: 8,
    lastUpdated: new Date().toISOString(),
  },
});
