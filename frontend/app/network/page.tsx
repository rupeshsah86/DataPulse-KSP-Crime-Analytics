'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout';
import { ProtectedRoute } from '@/components/auth';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { useNetwork } from '@/hooks/useNetwork';
import { NetworkGraph } from '@/components/network/NetworkGraph';
import { Users, Link as LinkIcon, Activity, AlertTriangle, Network as NetworkIcon, ListFilter } from 'lucide-react';

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

    const neighbors = selectedNode ? getNeighbors(selectedNode.id) : [];

    const rawLastUpdated = networkData?.metadata?.lastUpdated;
    const formattedLastUpdated =
        rawLastUpdated && !isNaN(new Date(rawLastUpdated).getTime())
            ? new Date(rawLastUpdated).toLocaleDateString()
            : 'Today';

    return (
        <ProtectedRoute>
            <Layout>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                <NetworkIcon className="w-7 h-7 text-indigo-600" />
                                Criminal Network Intelligence
                            </h1>
                            <p className="text-sm font-medium text-slate-500 mt-0.5">
                                Interactive force graph mapping relationship nodes and crime associations
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant={viewMode === 'graph' ? 'primary' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('graph')}
                                className={viewMode === 'graph' ? 'bg-indigo-600 text-white font-semibold' : 'border-slate-300 text-slate-700 font-medium'}
                            >
                                <NetworkIcon className="w-4 h-4 mr-1" />
                                Graph View
                            </Button>
                            <Button
                                variant={viewMode === 'list' ? 'primary' : 'outline'}
                                size="sm"
                                onClick={() => setViewMode('list')}
                                className={viewMode === 'list' ? 'bg-indigo-600 text-white font-semibold' : 'border-slate-300 text-slate-700 font-medium'}
                            >
                                <ListFilter className="w-4 h-4 mr-1" />
                                List View
                            </Button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between border-l-4 border-l-indigo-600">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Nodes</p>
                                <p className="text-2xl font-extrabold text-slate-900 mt-1">{networkData?.metadata?.totalNodes || nodes.length}</p>
                            </div>
                            <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                                <Users className="w-5 h-5" />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between border-l-4 border-l-purple-600">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Connections</p>
                                <p className="text-2xl font-extrabold text-slate-900 mt-1">{networkData?.metadata?.totalEdges || edges.length}</p>
                            </div>
                            <div className="w-11 h-11 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                                <LinkIcon className="w-5 h-5" />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between border-l-4 border-l-rose-500">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">High Risk Nodes</p>
                                <p className="text-2xl font-extrabold text-rose-600 mt-1">
                                    {nodes.filter(n => n.riskLevel === 'CRITICAL' || n.riskLevel === 'HIGH').length}
                                </p>
                            </div>
                            <div className="w-11 h-11 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex items-center justify-between border-l-4 border-l-emerald-600">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Last Updated</p>
                                <p className="text-xl font-extrabold text-slate-900 mt-1">{formattedLastUpdated}</p>
                            </div>
                            <div className="w-11 h-11 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                                <Activity className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    {/* Main Graph or List View */}
                    {viewMode === 'graph' ? (
                        <NetworkGraph
                            nodes={nodes}
                            edges={edges}
                            loading={loading}
                            onNodeClick={(node) => setSelectedNode(node)}
                        />
                    ) : (
                        <Card className="bg-white border border-slate-200 shadow-sm">
                            <div className="space-y-2.5">
                                {nodes.map((node) => (
                                    <div
                                        key={node.id}
                                        className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl transition-all cursor-pointer shadow-xs"
                                        onClick={() => setSelectedNode(node)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                                                style={{ backgroundColor: getNodeColor(node.riskLevel) }}
                                            />
                                            <div>
                                                <p className="font-bold text-sm text-slate-900">{node.name}</p>
                                                <p className="text-xs font-medium text-slate-500">Type: {node.type || 'Criminal'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
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

                    {/* Selected Node Details Drawer */}
                    {selectedNode ? (
                        <Card title={`🔍 Node Details: ${selectedNode.name}`} subtitle="Detailed relationship metadata" className="bg-white border border-slate-200 shadow-sm">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Type</p>
                                    <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedNode.type || 'Criminal'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Risk Level</p>
                                    <div className="mt-0.5">
                                        <Badge variant={selectedNode.riskLevel?.toLowerCase() as any || 'default'}>
                                            {selectedNode.riskLevel || 'Unknown'}
                                        </Badge>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Recorded Crimes</p>
                                    <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedNode.crimeCount || 0}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Direct Connections</p>
                                    <p className="font-bold text-slate-900 text-sm mt-0.5">{neighbors.length}</p>
                                </div>
                            </div>

                            {neighbors.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Connected Entities:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {neighbors.map((neighbor) => (
                                            <button
                                                key={neighbor.id}
                                                className="cursor-pointer hover:opacity-80 transition-opacity"
                                                onClick={() => setSelectedNode(neighbor)}
                                            >
                                                <Badge variant="default">
                                                    {neighbor.name}
                                                </Badge>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => setSelectedNode(null)} className="border-slate-300 text-slate-700 font-medium">
                                    Close Inspector
                                </Button>
                            </div>
                        </Card>
                    ) : (
                        <Card className="bg-white border border-slate-200 shadow-sm text-center py-6">
                            <p className="text-sm font-bold text-slate-700">👆 Select any node in the graph to inspect relationship metadata</p>
                            <p className="text-xs font-medium text-slate-500 mt-1">Double click a node to zoom directly into its criminal cluster</p>
                        </Card>
                    )}
                </div>
            </Layout>
        </ProtectedRoute>
    );
}