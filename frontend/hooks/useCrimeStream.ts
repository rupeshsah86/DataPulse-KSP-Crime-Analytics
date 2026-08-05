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
  const isUnmountedRef = useRef(false);

  // Store latest onNewCrime callback in ref to prevent re-triggering connect() effect
  const onNewCrimeRef = useRef(onNewCrime);
  useEffect(() => {
    onNewCrimeRef.current = onNewCrime;
  }, [onNewCrime]);

  const connect = useCallback(() => {
    if (isUnmountedRef.current) return;

    if (
      socketRef.current &&
      (socketRef.current.readyState === WebSocket.OPEN ||
        socketRef.current.readyState === WebSocket.CONNECTING)
    ) {
      return;
    }

    setStatus('CONNECTING');

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8083/ws/crimes';
    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      if (isUnmountedRef.current) {
        ws.close();
        return;
      }
      console.log('⚡ WebSocket Connected to Crime Stream');
      setStatus('CONNECTED');
    };

    ws.onmessage = (event) => {
      try {
        const payload: CrimeStreamEvent = JSON.parse(event.data);

        if (payload.type === 'CRIME_ADDED' && payload.data) {
          const newCrime = payload.data;

          setLiveCrimes((prev) => [newCrime, ...prev.slice(0, 49)]);

          // Call the latest callback ref
          onNewCrimeRef.current?.(newCrime);

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
      if (isUnmountedRef.current) return;
      console.log('❌ WebSocket Disconnected. Reconnecting in 5s...');
      setStatus('DISCONNECTED');
      socketRef.current = null;

      // Schedule reconnect if component is still mounted
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, 5000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
      // Let onclose handle state transition & reconnect
    };
  }, []); // Empty dependency array ensures connection is stable across renders

  useEffect(() => {
    isUnmountedRef.current = false;
    connect();

    return () => {
      isUnmountedRef.current = true;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        // Remove handlers before closing to prevent reconnection on unmount
        socketRef.current.onopen = null;
        socketRef.current.onmessage = null;
        socketRef.current.onerror = null;
        socketRef.current.onclose = null;
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [connect]);

  return {
    status,
    liveCrimes,
    reconnect: connect,
  };
}
