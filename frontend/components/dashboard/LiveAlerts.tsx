'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Crime } from '@/services/crimeService';
import { StreamStatus } from '@/hooks/useCrimeStream';
import { playAlertSound } from '@/utils/sounds';
import { Activity, AlertOctagon, Radio, Volume2, RefreshCw, Clock, MapPin } from 'lucide-react';

interface LiveAlertsProps {
  status: StreamStatus;
  liveCrimes: Crime[];
  onReconnect?: () => void;
  onSelectCrime?: (crime: Crime) => void;
}

export const LiveAlerts: React.FC<LiveAlertsProps> = ({
  status,
  liveCrimes,
  onReconnect,
  onSelectCrime,
}) => {
  const getStatusBadge = () => {
    switch (status) {
      case 'CONNECTED':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            LIVE STREAM
          </span>
        );
      case 'CONNECTING':
        return (
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
            <RefreshCw className="w-3 h-3 animate-spin" />
            CONNECTING...
          </span>
        );
      case 'DISCONNECTED':
      default:
        return (
          <button
            onClick={onReconnect}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 border border-rose-500/20 hover:bg-rose-500/20 transition-colors"
          >
            <Radio className="w-3 h-3" />
            OFFLINE (RECONNECT)
          </button>
        );
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return <Badge variant="critical">CRITICAL</Badge>;
      case 'HIGH':
        return <Badge variant="high">HIGH</Badge>;
      case 'MEDIUM':
        return <Badge variant="medium">MEDIUM</Badge>;
      case 'LOW':
      default:
        return <Badge variant="low">LOW</Badge>;
    }
  };

  return (
    <Card className="relative overflow-hidden border-2 border-indigo-500/10 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              Real-Time Crime Feed
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Live updates via WebSocket stream
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge()}
          <Button
            variant="outline"
            size="sm"
            onClick={() => playAlertSound()}
            title="Test alert audio"
            className="p-2 text-gray-500 hover:text-indigo-600"
          >
            <Volume2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {liveCrimes.length === 0 ? (
        <div className="py-8 text-center bg-gray-50/50 dark:bg-gray-800/30 rounded-xl border border-dashed border-gray-200 dark:border-gray-700">
          <Radio className="w-8 h-8 mx-auto text-indigo-400 mb-2 animate-bounce" />
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Listening for live crime events...</p>
          <p className="text-xs text-gray-400 mt-1">New incidents logged by police stations will stream here instantly.</p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
          {liveCrimes.map((crime) => (
            <div
              key={`${crime.id}-${crime.createdAt || Math.random()}`}
              onClick={() => onSelectCrime?.(crime)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                crime.severity === 'CRITICAL'
                  ? 'bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/50 hover:bg-rose-100/80'
                  : crime.severity === 'HIGH'
                  ? 'bg-amber-50/80 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50 hover:bg-amber-100/80'
                  : 'bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 hover:bg-gray-100/80'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    {crime.severity === 'CRITICAL' && (
                      <AlertOctagon className="w-4 h-4 text-rose-600 animate-pulse" />
                    )}
                    <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                      {crime.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      {crime.district}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      {crime.incidentDate}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {getSeverityBadge(crime.severity)}
                  <span className="text-[10px] font-mono text-gray-400">{crime.crimeNumber}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
