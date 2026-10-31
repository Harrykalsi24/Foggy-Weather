import React from 'react';
import { Droplets, Wind, Gauge, Eye } from 'lucide-react';
import { WeatherStats, ThemeMode } from '../types/weather';

interface MobileQuickStatsProps {
  stats: WeatherStats;
  theme?: ThemeMode;
}

export const MobileQuickStats: React.FC<MobileQuickStatsProps> = ({ stats, theme = 'dark' }) => {
  const isDark = theme === 'dark';

  const items = [
    {
      label: 'Humidity',
      value: `${stats.humidity}%`,
      icon: <Droplets className="w-5 h-5 text-sky-500" />,
    },
    {
      label: 'Wind',
      value: `${stats.windSpeed} km/h`,
      icon: <Wind className="w-5 h-5 text-cyan-500" />,
    },
    {
      label: 'Pressure',
      value: `${stats.pressure} hPa`,
      icon: <Gauge className="w-5 h-5 text-blue-500" />,
    },
    {
      label: 'Visibility',
      value: `${stats.visibility} km`,
      icon: <Eye className="w-5 h-5 text-indigo-500" />,
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full">
      {items.map((item, idx) => (
        <div
          key={idx}
          className={`flex flex-col items-center justify-center p-3 rounded-2xl backdrop-blur-md border shadow-md text-center transition-colors duration-300 ${
            isDark
              ? 'bg-[#121a2d]/90 border-slate-800/80'
              : 'bg-white border-slate-200 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.05)]'
          }`}
        >
          <div className="mb-1.5 flex items-center justify-center">
            {item.icon}
          </div>
          <span className={`text-[11px] font-semibold mb-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {item.label}
          </span>
          <span className={`text-xs sm:text-sm font-bold whitespace-nowrap ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {item.value}
          </span>
        </div>
      ))}
    </div>
  );
};
