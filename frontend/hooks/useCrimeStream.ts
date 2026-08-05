'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Crime } from '@/services/crimeService';
import { playAlertSound } from '@/utils/sounds';
import toast from 'react-hot-toast';

export type StreamStatus = 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED';

export interface CrimeStreamEvent {
  id: string;
  type: 'CRIME_ADDED' | 'CONNECTED';
  timestamp: string;
  data?: Crime;
}

export function useCrimeStream(onNewCrime?: (crime: Crime) => void) {
  const [status, setStatus] = useState<StreamStatus>('DISCONNECTED');
  const [liveCrimes, setLiveCrimes] = useState<Crime[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (socketRef.current && (socketRef.current.readyState === WebSocket.OPEN || socketRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    setStatus('CONNECTING');

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8083/ws/crimes';
    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      console.log('⚡ WebSocket Connected to Crime Stream');
      setStatus('CONNECTED');
    };

    ws.onmessage = (event) => {
      try {
        const payload: CrimeStreamEvent = JSON.parse(event.data);

        if (payload.type === 'CRIME_ADDED' && payload.data) {
          const newCrime = payload.data;
          
          setLiveCrimes((prev) => [newCrime, ...prev.slice(0, 49)]);

          // Callback to parent listener if provided
          onNewCrime?.(newCrime);

          // Play sound for CRITICAL and HIGH severity crimes
          if (newCrime.severity === 'CRITICAL' || newCrime.severity === 'HIGH') {
            playAlertSound();
            toast.error(`⚠️ REAL-TIME ALERT: ${newCrime.severity} Crime Reported in ${newCrime.district}!`, {
              duration: 6000,
              icon: '🚨',
            });
          } else {
            toast.success(`📢 New Crime Logged: ${newCrime.title}`, {
              duration: 4000,
              icon: '📝',
            });
          }
        }
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
      }
    };

    ws.onclose = () => {
      console.log('❌ WebSocket Disconnected. Reconnecting in 5s...');
      setStatus('DISCONNECTED');
      socketRef.current = null;

      // Auto reconnect after 5 seconds
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, 5000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
      ws.close();
    };
  }, [onNewCrime]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connect]);

  return {
    status,
    liveCrimes,
    reconnect: connect,
  };
}
