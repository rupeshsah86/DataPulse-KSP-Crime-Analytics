'use client';

import React, { useEffect, useRef, useState } from 'react';
import { NetworkNode, NetworkEdge } from '@/services/criminalService';
import { Spinner } from '@/components/ui/Spinner';

// vis-network imports
import { Network } from 'vis-network';
import 'vis-network/styles/vis-network.css';

const getNodeColor = (riskLevel?: string): string => {
    switch (riskLevel) {
        case 'CRITICAL': return '#dc3545';
        case 'HIGH': return '#fd7e14';
        case 'MEDIUM': return '#ffc107';
        case 'LOW': return '#28a745';
        default: return '#6c757d';
    }
};

interface NetworkGraphProps {
    nodes: NetworkNode[];
    edges: NetworkEdge[];
    loading?: boolean;
    onNodeClick?: (node: NetworkNode | null) => void;
}

export const NetworkGraph: React.FC<NetworkGraphProps> = ({
    nodes,
    edges,
    loading = false,
    onNodeClick,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const networkRef = useRef<Network | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted || loading || !containerRef.current || nodes.length === 0) return;

        // Clean up previous network
        if (networkRef.current) {
            networkRef.current.destroy();
            networkRef.current = null;
        }

        // Prepare data for vis-network with proper node styling
        const visNodes = nodes.map((node) => ({
            id: node.id,
            label: node.name,
            title: `${node.name}\nRisk: ${node.riskLevel || 'Unknown'}\nCrimes: ${node.crimeCount || 0}`,
            color: {
                background: getNodeColor(node.riskLevel),
                border: getNodeColor(node.riskLevel),
                highlight: {
                    background: getNodeColor(node.riskLevel),
                    border: '#ffffff',
                },
            },
            size: 15 + (node.crimeCount || 1) * 3,
            borderWidth: 2,
            borderWidthSelected: 4,
            font: {
                size: 12,
                color: '#ffffff',
                strokeWidth: 2,
                strokeColor: '#000000',
            },
            shape: 'dot',
            scaling: {
                min: 10,
                max: 30,
                label: {
                    enabled: true,
                },
            },
        }));

        // ✅ FIXED: Added roundness to smooth property
        const visEdges = edges.map((edge) => ({
            from: edge.source,
            to: edge.target,
            label: edge.relationship || 'Connected',
            title: edge.relationship || 'Connected',
            width: edge.strength ? edge.strength * 0.5 + 1 : 2,
            arrows: 'to',
            font: {
                size: 10,
                align: 'top',
                color: '#666666',
            },
            color: {
                color: '#888888',
                highlight: '#1a5276',
            },
            smooth: {
                enabled: true,
                type: 'dynamic',
                roundness: 0.5,  // ← REQUIRED by vis-network types
            },
        }));

        const data = {
            nodes: visNodes,
            edges: visEdges,
        };

        const options: any = {
            layout: {
                hierarchical: false,
                improvedLayout: true,
            },
            physics: {
                enabled: true,
                solver: 'forceAtlas2Based',
                stabilization: {
                    iterations: 150,
                    updateInterval: 25,
                },
                forceAtlas2Based: {
                    gravitationalConstant: -50,
                    centralGravity: 0.01,
                    springLength: 100,
                    springConstant: 0.08,
                    damping: 0.4,
                },
            },
            interaction: {
                hover: true,
                tooltipDelay: 100,
                navigationButtons: true,
                zoomView: true,
                dragView: true,
                multiselect: false,
            },
            nodes: {
                shape: 'dot',
                scaling: {
                    min: 10,
                    max: 30,
                    label: {
                        enabled: true,
                    },
                },
            },
            edges: {
                smooth: {
                    enabled: true,
                    type: 'dynamic',
                    roundness: 0.5,  // ← Also added here for consistency
                },
            },
        };

        // Create network
        const network = new Network(containerRef.current, data, options);
        networkRef.current = network;

        // ✅ FIXED: Click handler with proper event handling
        network.on('click', (params) => {
            console.log('🔍 Network click event:', params);

            if (params.nodes && params.nodes.length > 0) {
                const nodeId = params.nodes[0];
                console.log('🔍 Node clicked - ID:', nodeId);

                const nodeData = nodes.find((n) => n.id === nodeId);
                console.log('🔍 Node data found:', nodeData);

                if (nodeData) {
                    setSelectedNodeId(nodeId);
                    if (onNodeClick) {
                        onNodeClick(nodeData);
                    }
                }
            } else {
                // Clicked on empty space - deselect
                setSelectedNodeId(null);
                if (onNodeClick) {
                    onNodeClick(null);
                }
            }
        });

        // Double click handler - zoom to node
        network.on('doubleClick', (params) => {
            if (params.nodes && params.nodes.length > 0) {
                const nodeId = params.nodes[0];
                const nodeData = nodes.find((n) => n.id === nodeId);
                if (nodeData) {
                    // Focus on the node
                    network.focus(nodeId, {
                        scale: 1.5,
                        animation: true,
                    });
                }
            }
        });

        // Hover handler
        network.on('hoverNode', (params) => {
            if (params.node) {
                containerRef.current!.style.cursor = 'pointer';
            }
        });

        network.on('blurNode', () => {
            containerRef.current!.style.cursor = 'default';
        });

        // Right-click handler
        network.on('oncontext', (params) => {
            if (params.nodes && params.nodes.length > 0) {
                const nodeId = params.nodes[0];
                const nodeData = nodes.find((n) => n.id === nodeId);
                if (nodeData && onNodeClick) {
                    onNodeClick(nodeData);
                }
            }
        });

        // Cleanup on unmount
        return () => {
            if (networkRef.current) {
                networkRef.current.destroy();
                networkRef.current = null;
            }
        };
    }, [nodes, edges, loading, isMounted, onNodeClick]);

    if (loading || !isMounted) {
        return (
            <div className="flex items-center justify-center h-[500px] bg-gray-50 rounded-xl">
                <Spinner size="lg" />
            </div>
        );
    }

    if (nodes.length === 0 || edges.length === 0) {
        return (
            <div className="flex items-center justify-center h-[500px] bg-gray-50 rounded-xl">
                <div className="text-center">
                    <p className="text-gray-500">No network data available</p>
                    <p className="text-xs text-gray-400 mt-1">Add more crime data to build the network</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            <div
                ref={containerRef}
                className="h-[500px] w-full border border-gray-200 rounded-xl overflow-hidden bg-white"
            />
            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-md border border-gray-200">
                <p className="text-xs font-medium text-gray-700 mb-2">Risk Levels:</p>
                <div className="flex gap-3">
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#dc3545' }}></div>
                        <span className="text-xs text-gray-600">Critical</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#fd7e14' }}></div>
                        <span className="text-xs text-gray-600">High</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#ffc107' }}></div>
                        <span className="text-xs text-gray-600">Medium</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#28a745' }}></div>
                        <span className="text-xs text-gray-600">Low</span>
                    </div>
                </div>
            </div>

            {/* Instructions */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-md border border-gray-200 text-xs text-gray-500">
                💡 Click node to view details
            </div>
        </div>
    );
};