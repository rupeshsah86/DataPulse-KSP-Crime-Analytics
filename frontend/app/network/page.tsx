'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useNetwork } from '@/hooks/useNetwork';
import { NetworkGraph } from '@/components/network/NetworkGraph';
import { Users, User, Link, Activity, TrendingUp, AlertTriangle } from 'lucide-react';

export default function NetworkPage() {
    const router = useRouter();
    const {
        nodes,
        edges,
        loading,
        selectedNode,
        setSelectedNode,
        getNeighbors,
        getNodeColor,
        networkData
    } = useNetwork();

    const [viewMode, setViewMode] = useState<'graph' | 'list'>('graph');

    // Debug: log when selectedNode changes
    useEffect(() => {
        console.log('🔄 selectedNode changed:', selectedNode);
    }, [selectedNode]);

    if (loading) {
        return (
            <ProtectedRoute>
                <Layout>
                    <div className="min-h-[400px] flex items-center justify-center">
                        <Spinner size="lg" />
                    </div>
                </Layout>
            </ProtectedRoute>
        );
    }

    // Get neighbors of selected node
    const neighbors = selectedNode ? getNeighbors(selectedNode.id) : [];

    return (
        <ProtectedRoute>
            <Layout>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">🔗 Criminal Network Analysis</h1>
                            <p className="text-sm text-gray-500">
                                Visualize relationships between criminals and their connections
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={viewMode === 'graph' ? 'primary' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('graph')}
                            >
                                Graph View
                            </Button>
                            <Button
                                variant={viewMode === 'list' ? 'primary' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('list')}
                            >
                                List View
                            </Button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    {networkData && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Card>
                                <div className="flex items-center gap-3">
                                    <Users className="w-5 h-5 text-primary-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Total Nodes</p>
                                        <p className="text-xl font-bold">{networkData.metadata?.totalNodes || nodes.length}</p>
                                    </div>
                                </div>
                            </Card>
                            <Card>
                                <div className="flex items-center gap-3">
                                    <Link className="w-5 h-5 text-primary-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Total Connections</p>
                                        <p className="text-xl font-bold">{networkData.metadata?.totalEdges || edges.length}</p>
                                    </div>
                                </div>
                            </Card>
                            <Card>
                                <div className="flex items-center gap-3">
                                    <AlertTriangle className="w-5 h-5 text-status-critical" />
                                    <div>
                                        <p className="text-sm text-gray-500">High Risk Nodes</p>
                                        <p className="text-xl font-bold text-status-critical">
                                            {nodes.filter(n => n.riskLevel === 'CRITICAL' || n.riskLevel === 'HIGH').length}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                            <Card>
                                <div className="flex items-center gap-3">
                                    <Activity className="w-5 h-5 text-primary-500" />
                                    <div>
                                        <p className="text-sm text-gray-500">Last Updated</p>
                                        <p className="text-sm font-medium">
                                            {networkData?.metadata?.lastUpdated ?
                                                new Date(networkData.metadata.lastUpdated).toLocaleDateString() :
                                                'Today'}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                    {/* Network Graph */}
                    {viewMode === 'graph' ? (
                        <Card className="p-0 overflow-hidden">
                            <NetworkGraph
                                nodes={nodes}
                                edges={edges}
                                loading={loading}
                                onNodeClick={(node) => {
                                    console.log('📌 Node clicked in page:', node);
                                    setSelectedNode(node);
                                }}
                            />
                        </Card>
                    ) : (
                        <Card>
                            <div className="space-y-3">
                                {nodes.map((node) => (
                                    <div
                                        key={node.id}
                                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                                        onClick={() => {
                                            console.log('📌 List item clicked:', node);
                                            setSelectedNode(node);
                                        }}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: getNodeColor(node.riskLevel) }}
                                            />
                                            <div>
                                                <p className="font-medium text-gray-800">{node.name}</p>
                                                <p className="text-xs text-gray-500">Type: {node.type || 'Unknown'}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {node.crimeCount && (
                                                <Badge variant="default">{node.crimeCount} crimes</Badge>
                                            )}
                                            {node.riskLevel && (
                                                <Badge variant={node.riskLevel.toLowerCase() as any}>
                                                    {node.riskLevel}
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {/* Selected Node Details - FIXED */}
                    {selectedNode ? (
                        <Card title={`🔍 ${selectedNode.name}`} subtitle="Node Details">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Type</p>
                                    <p className="font-medium">{selectedNode.type || 'Unknown'}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Risk Level</p>
                                    <Badge variant={selectedNode.riskLevel?.toLowerCase() as any || 'default'}>
                                        {selectedNode.riskLevel || 'Unknown'}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Crimes</p>
                                    <p className="font-medium">{selectedNode.crimeCount || 0}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Connections</p>
                                    <p className="font-medium">{neighbors.length}</p>
                                </div>
                            </div>

                            {neighbors.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Connected To:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {neighbors.map((neighbor) => (
                                            <button
                                                key={neighbor.id}
                                                className="cursor-pointer hover:opacity-80 transition-opacity"
                                                onClick={() => {
                                                    console.log('📌 Neighbor clicked:', neighbor);
                                                    setSelectedNode(neighbor);
                                                }}
                                            >
                                                <Badge variant="default">
                                                    {neighbor.name}
                                                </Badge>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-4 flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => setSelectedNode(null)}>
                                    Close
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        alert(`Node: ${selectedNode.name}\nRisk: ${selectedNode.riskLevel}\nCrimes: ${selectedNode.crimeCount}\nConnections: ${neighbors.length}`);
                                    }}
                                >
                                    View Details
                                </Button>
                            </div>
                        </Card>
                    ) : (
                        <Card>
                            <div className="text-center py-8 text-gray-500">
                                <p>👆 Click on a node in the graph above to view details</p>
                                <p className="text-xs mt-1">Or switch to List View and click on any row</p>
                            </div>
                        </Card>
                    )}
                </div>
            </Layout>
        </ProtectedRoute >
    );
}