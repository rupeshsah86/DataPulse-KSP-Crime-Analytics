'use client';

import React, { useState } from 'react';
import { AlertTriangle, Bell, ChevronRight, X } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Crime } from '@/services/crimeService';

interface AlertsPanelProps {
    crimes: Crime[];
    onAlertClick?: (crime: Crime) => void;
}

export const AlertsPanel: React.FC<AlertsPanelProps> = ({ crimes, onAlertClick }) => {
    const [dismissedIds, setDismissedIds] = useState<number[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);

    const activeAlerts = crimes.filter(
        (crime) =>
            (crime.severity === 'CRITICAL' || crime.severity === 'HIGH') &&
            !dismissedIds.includes(crime.id)
    );

    const dismissAlert = (id: number) => {
        setDismissedIds((prev) => [...prev, id]);
    };

    const dismissAll = () => {
        setDismissedIds(activeAlerts.map((c) => c.id));
    };

    const getTimeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        return `${diffDays}d ago`;
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'CRITICAL':
                return 'border-l-rose-500 bg-rose-50/70';
            case 'HIGH':
                return 'border-l-amber-500 bg-amber-50/70';
            default:
                return 'border-l-slate-400 bg-slate-50';
        }
    };

    if (activeAlerts.length === 0) {
        return (
            <Card className="bg-white border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-700">
                        <Bell className="w-5 h-5 text-emerald-600" />
                        <span className="font-bold text-sm">No critical alerts requiring action</span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">All clear</span>
                </div>
            </Card>
        );
    }

    return (
        <Card className="bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-rose-100 text-rose-600">
                        <Bell className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-base">
                            Live Alerts
                        </h3>
                        <p className="text-xs font-medium text-slate-500">
                            {activeAlerts.length} high-priority crime cases
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={dismissAll}
                        className="text-xs border-slate-200 text-slate-600 hover:bg-slate-100"
                    >
                        Dismiss All
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-xs border-slate-200 text-slate-600 hover:bg-slate-100"
                    >
                        {isExpanded ? 'Collapse' : 'Expand'}
                    </Button>
                </div>
            </div>

            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                {(isExpanded ? activeAlerts : activeAlerts.slice(0, 3)).map((alert) => (
                    <div
                        key={alert.id}
                        className={`p-3.5 rounded-xl border-l-4 ${getSeverityColor(alert.severity)} border-slate-200 hover:bg-slate-100/80 transition-colors cursor-pointer shadow-xs`}
                        onClick={() => onAlertClick?.(alert)}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                                    <p className="text-sm font-bold text-slate-900">
                                        {alert.title}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 mt-1.5 text-xs font-medium text-slate-600">
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
                                className="text-slate-400 hover:text-rose-600 bg-transparent hover:bg-slate-200/60"
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
                    <p className="text-xs font-bold text-slate-400 text-center pt-2">
                        +{activeAlerts.length - 3} more alerts. Click Expand to view all.
                    </p>
                )}
            </div>
        </Card>
    );
};