import React from 'react';
import { Leaf } from 'lucide-react';
import { ThemeMode } from '../types/weather';

interface AirQualityCardProps {
  aqiValue: number;
  aqiStatus: string;
  theme?: ThemeMode;
}

export const AirQualityCard: React.FC<AirQualityCardProps> = ({
  aqiValue,
  aqiStatus,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const markerPos = Math.min(Math.max((aqiValue / 150) * 100, 8), 92);

  return (
    <div
      className={`w-full rounded-2xl backdrop-blur-md border p-4 shadow-lg flex flex-col justify-between transition-colors duration-300 ${
        isDark
          ? 'bg-[#121a2d]/90 border-slate-800/80 text-white'
          : 'bg-white border-slate-200 text-slate-900 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <Leaf className="w-4 h-4 text-emerald-500" />
        <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
          Air Quality Index
        </span>
      </div>

      {/* Value & Indicator */}
      <div className="mt-2.5 flex items-center justify-between gap-4">
        <div className="flex items-baseline gap-2">
          <span className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {aqiValue}
          </span>
          <span className="text-sm font-semibold text-emerald-500">{aqiStatus}</span>
        </div>

        {/* Gradient bar */}
        <div
          className={`relative flex-1 max-w-[170px] h-2.5 rounded-full overflow-visible transition-colors ${
            isDark ? 'bg-slate-800' : 'bg-slate-200'
          }`}
        >
          {/* Multi-step gradient bar */}
          <div className="w-full h-full rounded-full bg-gradient-to-r from-emerald-400 via-yellow-400 via-orange-400 to-rose-500" />

          {/* Active pointer marker */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] -ml-2 transition-all duration-500"
            style={{ left: `${markerPos}%` }}
          />
        </div>
      </div>
    </div>
  );
};
