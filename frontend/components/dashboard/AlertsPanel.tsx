'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Bell, Clock, X, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Crime } from '@/services/crimeService';
import toast from 'react-hot-toast';

interface AlertsPanelProps {
    crimes: Crime[];
    onAlertClick?: (crime: Crime) => void;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ crimes, onAlertClick }) => {
    const [alerts, setAlerts] = useState<Crime[]>([]);
    const [dismissedAlerts, setDismissedAlerts] = useState<Set<number>>(new Set());
    const [isExpanded, setIsExpanded] = useState(false);

    // Filter high-priority crimes
    useEffect(() => {
        if (!crimes) return;

        const highPriorityCrimes = crimes.filter(
            (c) =>
                (c.severity === 'CRITICAL' || c.severity === 'HIGH') &&
                (c.status === 'OPEN' || c.status === 'INVESTIGATING')
        );

        // Sort by date (newest first)
        const sorted = highPriorityCrimes.sort((a, b) =>
            new Date(b.incidentDate).getTime() - new Date(a.incidentDate).getTime()
        );

        setAlerts(sorted);
    }, [crimes]);

    const dismissAlert = (id: number) => {
        setDismissedAlerts((prev) => new Set(prev).add(id));
        toast.success('Alert dismissed');
    };

    const dismissAll = () => {
        alerts.forEach((alert) => {
            setDismissedAlerts((prev) => new Set(prev).add(alert.id));
        });
        toast.success('All alerts dismissed');
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'CRITICAL': return 'bg-status-critical';
            case 'HIGH': return 'bg-status-high';
            default: return 'bg-status-medium';
        }
    };

    const getTimeAgo = (date: string) => {
        const diff = new Date().getTime() - new Date(date).getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours < 1) return 'Just now';
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    };

    const activeAlerts = alerts.filter((a) => !dismissedAlerts.has(a.id));

    if (activeAlerts.length === 0) {
        return (
            <Card className="border-l-4 border-l-green-500">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-800">All Clear! 🎉</p>
                        <p className="text-xs text-gray-500">No active alerts</p>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card className="relative">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Bell className="w-5 h-5 text-status-critical" />
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-status-critical text-white text-[10px] rounded-full flex items-center justify-center">
                            {activeAlerts.length}
                        </span>
                    </div>
                    <h3 className="font-semibold text-gray-800">Live Alerts</h3>
                    <Badge variant="critical">{activeAlerts.length} Active</Badge>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={dismissAll}>
                        Dismiss All
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        {isExpanded ? 'Collapse' : 'Expand'}
                    </Button>
                </div>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {(isExpanded ? activeAlerts : activeAlerts.slice(0, 3)).map((alert) => (
                    <div
                        key={alert.id}
                        className={`p-3 rounded-lg border-l-4 ${getSeverityColor(alert.severity)} bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer`}
                        onClick={() => onAlertClick?.(alert)}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-status-critical" />
                                    <p className="text-sm font-medium text-gray-800">
                                        {alert.title}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                    <span>📍 {alert.district}</span>
                                    <span>📅 {alert.incidentDate}</span>
                                    <span>🕐 {getTimeAgo(alert.incidentDate)}</span>
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <Badge variant={alert.severity.toLowerCase() as any}>
                                        {alert.severity}
                                    </Badge>
                                    <Badge variant={alert.status.toLowerCase() as any}>
                                        {alert.status}
                                    </Badge>
                                </div>
                            </div>
                            <Button
                                variant="secondary"
                                size="sm"
                                className="text-gray-400 hover:text-gray-600 bg-transparent hover:bg-gray-100"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    dismissAlert(alert.id);
                                }}
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                ))}

                {!isExpanded && activeAlerts.length > 3 && (
                    <p className="text-xs text-gray-400 text-center pt-2">
                        +{activeAlerts.length - 3} more alerts. Click Expand to view all.
                    </p>
                )}
            </div>
        </Card>
    );
};