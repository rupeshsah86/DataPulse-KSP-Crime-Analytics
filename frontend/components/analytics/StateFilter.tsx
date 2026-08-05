'use client';

import React from 'react';
import { MapPin, ChevronDown } from 'lucide-react';

interface StateFilterProps {
  selectedState: string;
  onStateChange: (state: string) => void;
}

export const STATES_LIST = [
  'All States',
  'Karnataka',
  'Maharashtra',
  'Tamil Nadu',
  'Telangana',
  'Kerala',
  'Delhi',
];

export const StateFilter: React.FC<StateFilterProps> = ({ selectedState, onStateChange }) => {
  return (
    <div className="relative flex items-center">
      <MapPin className="w-4 h-4 text-indigo-600 absolute left-3 pointer-events-none z-10" />
      <select
        value={selectedState}
        onChange={(e) => onStateChange(e.target.value)}
        className="pl-9 pr-8 py-2 text-xs font-bold text-slate-900 bg-white border border-slate-200 rounded-xl shadow-xs appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
      >
        {STATES_LIST.map((st) => (
          <option key={st} value={st}>
            {st === 'All States' ? '🌐 National (All States)' : `📍 ${st}`}
          </option>
        ))}
      </select>
      <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 pointer-events-none" />
    </div>
  );
};
