'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Crime } from '@/services/crimeService';
import { StreamStatus } from '@/hooks/useCrimeStream';
import { playAlertSound } from '@/utils/sounds';
import { Activity, AlertOctagon, Radio, Volume2, RefreshCw, Clock, MapPin, RadioReceiver } from 'lucide-react';

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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            LIVE STREAM
          </span>
        );
      case 'CONNECTING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30">
            <RefreshCw className="w-3 h-3 animate-spin text-amber-600" />
            CONNECTING...
          </span>
        );
      case 'DISCONNECTED':
      default:
        return (
          <button
            onClick={onReconnect}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 transition-colors"
          >
            <Radio className="w-3 h-3 text-rose-600" />
            RECONNECT
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
    <Card className="relative overflow-hidden border border-indigo-100 dark:border-slate-800 shadow-md h-full flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-500/30">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                Real-Time Crime Feed
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
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
              className="p-2 text-slate-600 hover:text-indigo-600 hover:border-indigo-200"
            >
              <Volume2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {liveCrimes.length === 0 ? (
          <div className="py-12 px-4 text-center bg-gradient-to-b from-indigo-50/40 to-slate-50/60 dark:from-slate-800/40 dark:to-slate-900/40 rounded-2xl border border-indigo-100/80 dark:border-slate-800">
            <div className="w-12 h-12 mx-auto rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 shadow-inner">
              <RadioReceiver className="w-6 h-6 animate-pulse" />
            </div>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Listening for live crime events...</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
              New incidents logged by police stations will stream here automatically without page refresh.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
            {liveCrimes.map((crime) => (
              <div
                key={`${crime.id}-${crime.createdAt || Math.random()}`}
                onClick={() => onSelectCrime?.(crime)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer shadow-xs hover:shadow-sm ${
                  crime.severity === 'CRITICAL'
                    ? 'bg-rose-50/90 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 hover:bg-rose-100/90'
                    : crime.severity === 'HIGH'
                    ? 'bg-amber-50/90 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 hover:bg-amber-100/90'
                    : 'bg-white dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {crime.severity === 'CRITICAL' && (
                        <AlertOctagon className="w-4 h-4 text-rose-600 animate-pulse shrink-0" />
                      )}
                      <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {crime.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1 font-medium">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {crime.district}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {crime.incidentDate}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {getSeverityBadge(crime.severity)}
                    <span className="text-[10px] font-mono text-slate-400 font-medium">{crime.crimeNumber}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};
