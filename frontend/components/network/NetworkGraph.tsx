'use client';

import React, { useEffect, useRef, useState } from 'react';
import { NetworkNode, NetworkEdge } from '@/services/criminalService';
import { Spinner } from '@/components/ui/Spinner';
import { ZoomIn, ZoomOut, RefreshCw, Maximize2, ShieldAlert } from 'lucide-react';

import { Network } from 'vis-network';
import 'vis-network/styles/vis-network.css';

const getNodeColor = (riskLevel?: string): string => {
    switch (riskLevel) {
        case 'CRITICAL': return '#EF4444'; // Bright Red
        case 'HIGH': return '#F97316';     // Vibrant Orange
        case 'MEDIUM': return '#F59E0B';   // Amber Gold
        case 'LOW': return '#10B981';      // Emerald Green
        default: return '#64748B';         // Slate
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

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted || loading || !containerRef.current || nodes.length === 0) return;

        if (networkRef.current) {
            networkRef.current.destroy();
            networkRef.current = null;
        }

        // Format Vis.js Nodes with prominent size, spaced layout, and high-contrast labels
        const visNodes = nodes.map((node) => ({
            id: node.id,
            label: node.name,
            title: `<b>${node.name}</b><br/>Type: ${node.type || 'Criminal'}<br/>Risk Level: ${node.riskLevel || 'Unknown'}<br/>Crime Incidents: ${node.crimeCount || 0}`,
            color: {
                background: getNodeColor(node.riskLevel),
                border: '#FFFFFF',
                highlight: {
                    background: getNodeColor(node.riskLevel),
                    border: '#0F172A',
                },
                hover: {
                    background: getNodeColor(node.riskLevel),
                    border: '#4F46E5',
                }
            },
            size: 32 + Math.min((node.crimeCount || 1) * 4, 16),
            borderWidth: 4,
            borderWidthSelected: 6,
            font: {
                size: 14,
                color: '#0F172A',
                face: 'Inter, system-ui, sans-serif',
                strokeWidth: 4,
                strokeColor: '#FFFFFF',
                bold: { color: '#0F172A', size: 14 },
                vadjust: 4,
            },
            shape: 'dot',
            shadow: {
                enabled: true,
                color: 'rgba(0,0,0,0.18)',
                size: 10,
                x: 2,
                y: 4,
            },
        }));

        // Format Vis.js Edges with distinct line styles & labels
        const visEdges = edges.map((edge) => {
            const isSameCategory = edge.relationship?.toLowerCase().includes('category');
            return {
                from: edge.source,
                to: edge.target,
                label: edge.relationship === 'Connected' ? '' : edge.relationship || '',
                title: edge.relationship || 'Associated Incident Connection',
                width: 3,
                color: {
                    color: isSameCategory ? '#818CF8' : '#94A3B8',
                    highlight: '#4F46E5',
                    hover: '#6366F1',
                },
                font: {
                    size: 11,
                    align: 'top',
                    color: '#334155',
                    strokeWidth: 3,
                    strokeColor: '#FFFFFF',
                },
                smooth: {
                    enabled: true,
                    type: 'continuous',
                    roundness: 0.4,
                },
            };
        });

        const data = {
            nodes: visNodes,
            edges: visEdges,
        };

        const options: any = {
            nodes: {
                shape: 'dot',
            },
            edges: {
                smooth: {
                    enabled: true,
                    type: 'continuous',
                },
            },
            physics: {
                enabled: true,
                solver: 'barnesHut',
                barnesHut: {
                    gravitationalConstant: -16000, // Strong repulsion to spread out nodes nicely
                    centralGravity: 0.05,           // Gentle centering force
                    springLength: 200,              // Spacious edges between criminal nodes
                    springConstant: 0.03,
                    damping: 0.09,
                    avoidOverlap: 1.0,              // Prevent node overlaps
                },
                stabilization: {
                    enabled: true,
                    iterations: 1200,
                    updateInterval: 50,
                    onlyDynamicEdges: false,
                    fit: true,
                },
            },
            interaction: {
                hover: true,
                tooltipDelay: 50,
                navigationButtons: false,
                zoomView: true,
                dragView: true,
                multiselect: false,
            },
        };

        const network = new Network(containerRef.current, data, options);
        networkRef.current = network;

        // Auto zoom and center on node graph after physics stabilization
        network.once('stabilized', () => {
            network.fit({
                animation: {
                    duration: 600,
                    easingFunction: 'easeInOutQuad',
                },
            });
            if (network.getScale() < 0.85) {
                network.moveTo({ scale: 1.0, animation: true });
            }
        });

        // Event Handlers
        network.on('click', (params) => {
            if (params.nodes && params.nodes.length > 0) {
                const nodeId = params.nodes[0];
                const nodeData = nodes.find((n) => n.id === nodeId);
                if (nodeData && onNodeClick) {
                    onNodeClick(nodeData);
                }
            } else {
                if (onNodeClick) {
                    onNodeClick(null);
                }
            }
        });

        network.on('hoverNode', () => {
            if (containerRef.current) {
                containerRef.current.style.cursor = 'pointer';
            }
        });

        network.on('blurNode', () => {
            if (containerRef.current) {
                containerRef.current.style.cursor = 'default';
            }
        });

        return () => {
            if (networkRef.current) {
                networkRef.current.destroy();
                networkRef.current = null;
            }
        };
    }, [nodes, edges, loading, isMounted, onNodeClick]);

    const handleZoomIn = () => {
        if (networkRef.current) {
            const scale = networkRef.current.getScale();
            networkRef.current.moveTo({ scale: scale * 1.3, animation: true });
        }
    };

    const handleZoomOut = () => {
        if (networkRef.current) {
            const scale = networkRef.current.getScale();
            networkRef.current.moveTo({ scale: scale * 0.7, animation: true });
        }
    };

    const handleReset = () => {
        if (networkRef.current) {
            networkRef.current.fit({ animation: true });
            if (networkRef.current.getScale() < 0.85) {
                networkRef.current.moveTo({ scale: 1.0, animation: true });
            }
        }
    };

    if (loading || !isMounted) {
        return (
            <div className="flex flex-col items-center justify-center h-[560px] bg-slate-50 rounded-2xl border border-slate-200">
                <Spinner size="lg" />
                <p className="text-sm font-semibold text-slate-500 mt-3">Rendering Criminal Network Intelligence Graph...</p>
            </div>
        );
    }

    if (nodes.length === 0 || edges.length === 0) {
        return (
            <div className="flex items-center justify-center h-[560px] bg-slate-50 rounded-2xl border border-slate-200">
                <div className="text-center p-6">
                    <ShieldAlert className="w-10 h-10 mx-auto text-slate-400 mb-2" />
                    <p className="text-sm font-bold text-slate-700">No network connections available</p>
                    <p className="text-xs text-slate-500 mt-1">Add crime incidents to automatically map suspect and officer relationships.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="relative bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Graph Canvas */}
            <div
                ref={containerRef}
                className="h-[560px] w-full bg-gradient-to-br from-slate-50/80 via-white to-slate-50/80"
            />

            {/* Interactive Control Floating Toolbar */}
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md p-1.5 rounded-xl shadow-md border border-slate-200 flex items-center gap-1 z-10">
                <button
                    onClick={handleZoomIn}
                    className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Zoom In"
                >
                    <ZoomIn className="w-4 h-4" />
                </button>
                <button
                    onClick={handleZoomOut}
                    className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Zoom Out"
                >
                    <ZoomOut className="w-4 h-4" />
                </button>
                <button
                    onClick={handleReset}
                    className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Reset Fit View"
                >
                    <Maximize2 className="w-4 h-4" />
                </button>
            </div>

            {/* Clean Legend Box */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md p-3.5 rounded-xl shadow-md border border-slate-200 z-10">
                <p className="text-xs font-bold text-slate-700 mb-2">Risk Classification:</p>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                        <span className="text-xs font-semibold text-slate-700">Critical</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                        <span className="text-xs font-semibold text-slate-700">High</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                        <span className="text-xs font-semibold text-slate-700">Medium</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                        <span className="text-xs font-semibold text-slate-700">Low</span>
                    </div>
                </div>
            </div>

            {/* Instruction Tip */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-sm border border-slate-200 text-xs font-medium text-slate-600 z-10">
                💡 Click any node to inspect relationship details
            </div>
        </div>
    );
};