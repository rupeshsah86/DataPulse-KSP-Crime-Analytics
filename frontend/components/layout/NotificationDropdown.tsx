'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Bell, AlertOctagon, TrendingUp, CheckCheck, ShieldAlert, Sparkles, X, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCrimeStream } from '@/hooks/useCrimeStream';
import { playAlertSound } from '@/utils/sounds';

export interface NotificationItem {
  id: string;
  type: 'CRITICAL_CRIME' | 'AI_HOTSPOT' | 'REPEAT_OFFENDER' | 'SYSTEM';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    type: 'CRITICAL_CRIME',
    title: 'Critical Incident Reported',
    message: 'Bank Robbery on MG Road reported under Bangalore Urban jurisdiction.',
    timestamp: '2 mins ago',
    read: false,
    link: '/crimes?search=Bank%20Robbery',
  },
  {
    id: 'n2',
    type: 'AI_HOTSPOT',
    title: 'AI Hotspot Warning',
    message: 'Crime risk level surged to HIGH (+35%) in Indiranagar sector.',
    timestamp: '15 mins ago',
    read: false,
    link: '/ai',
  },
  {
    id: 'n3',
    type: 'REPEAT_OFFENDER',
    title: 'Repeat Offender Flagged',
    message: 'Offender Rajesh Kumar linked to new burglary case #CRIME-008.',
    timestamp: '1 hour ago',
    read: false,
    link: '/repeat-offenders',
  },
  {
    id: 'n4',
    type: 'SYSTEM',
    title: 'Bulk Data Ingestion Complete',
    message: 'Excel import finished: 39 crime records updated successfully.',
    timestamp: '3 hours ago',
    read: true,
    link: '/upload',
  },
];

export const NotificationDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'ALL' | 'CRITICAL'>('ALL');
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Handle new live crime broadcasts from WebSocket
  useCrimeStream((newCrime) => {
    if (newCrime.severity === 'CRITICAL' || newCrime.severity === 'HIGH') {
      const newNotif: NotificationItem = {
        id: `live-${Date.now()}`,
        type: 'CRITICAL_CRIME',
        title: `🚨 LIVE: ${newCrime.title}`,
        message: `District: ${newCrime.district} | Severity: ${newCrime.severity}`,
        timestamp: 'Just now',
        read: false,
        link: `/crimes?search=${encodeURIComponent(newCrime.title)}`,
      };

      setNotifications((prev) => [newNotif, ...prev]);
      if (newCrime.severity === 'CRITICAL') {
        playAlertSound();
      }
    }
  });

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    markAsRead(notif.id);
    setIsOpen(false);
    if (notif.link) {
      router.push(notif.link);
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'CRITICAL') {
      return n.type === 'CRITICAL_CRIME' || n.type === 'AI_HOTSPOT';
    }
    return true;
  });

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'CRITICAL_CRIME':
        return <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />;
      case 'AI_HOTSPOT':
        return <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />;
      case 'REPEAT_OFFENDER':
        return <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />;
      case 'SYSTEM':
      default:
        return <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-slate-900 transition-colors rounded-xl hover:bg-slate-100 focus:outline-none"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <>
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping"></span>
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
          </>
        )}
      </button>

      {/* Popover Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 overflow-hidden animate-fadeIn">
          {/* Header */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-500 text-white">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark read
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex border-b border-slate-100 bg-white text-xs font-bold text-slate-500 px-4 pt-2">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`pb-2 px-3 border-b-2 transition-colors ${
                activeTab === 'ALL'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent hover:text-slate-800'
              }`}
            >
              All Notifications
            </button>
            <button
              onClick={() => setActiveTab('CRITICAL')}
              className={`pb-2 px-3 border-b-2 transition-colors ${
                activeTab === 'CRITICAL'
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent hover:text-slate-800'
              }`}
            >
              Critical & Risk
            </button>
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No notifications found
              </div>
            ) : (
              filteredNotifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer hover:bg-slate-50 ${
                    !n.read ? 'bg-indigo-50/30 font-semibold' : ''
                  }`}
                >
                  <div className="mt-0.5 p-2 rounded-xl bg-slate-100 shrink-0">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{n.title}</p>
                      <span className="text-[10px] text-slate-400 font-medium shrink-0">
                        {n.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-2">{n.message}</p>
                  </div>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-indigo-600 mt-2 shrink-0"></span>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
            <button
              onClick={() => {
                setIsOpen(false);
                router.push('/crimes');
              }}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center justify-center gap-1 mx-auto"
            >
              View all incident records <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
