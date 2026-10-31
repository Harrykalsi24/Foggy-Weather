import React, { useState } from 'react';
import { Calendar, Droplets, ArrowRight, X } from 'lucide-react';
import { DailyForecastItem, TempUnit, ThemeMode } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';

interface SevenDayForecastProps {
  daily: DailyForecastItem[];
  unit: TempUnit;
  theme?: ThemeMode;
}

export const SevenDayForecast: React.FC<SevenDayForecastProps> = ({
  daily,
  unit,
  theme = 'dark',
}) => {
  const [showModal, setShowModal] = useState(false);
  const isDark = theme === 'dark';

  return (
    <>
      <div
        className={`w-full rounded-2xl backdrop-blur-md border p-4 sm:p-5 shadow-lg flex flex-col justify-between transition-colors duration-300 ${
          isDark
            ? 'bg-[#121a2d]/90 border-slate-800/80 text-white'
            : 'bg-white border-slate-200 text-slate-900 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between pb-3 border-b mb-3 ${
            isDark ? 'border-slate-800/60' : 'border-slate-100'
          }`}
        >
          <div className="flex items-center gap-2">
            <Calendar className={`w-4 h-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`} />
            <h2 className={`text-sm font-bold tracking-wide ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              7-Day Forecast
            </h2>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className={`flex items-center gap-1 text-xs font-semibold transition-colors cursor-pointer ${
              isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-blue-600'
            }`}
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 7 Columns Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center pt-1 pb-1">
          {daily.map((item, index) => {
            const high = unit === 'C' ? item.highC : item.highF;
            const low = unit === 'C' ? item.lowC : item.lowF;

            return (
              <div
                key={index}
                className={`flex flex-col items-center justify-between py-1.5 px-0.5 sm:px-1 rounded-xl transition-all cursor-pointer ${
                  isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                }`}
                onClick={() => setShowModal(true)}
              >
                {/* Day name & Date */}
                <div className="flex flex-col mb-2">
                  <span
                    className={`text-[11px] sm:text-xs font-bold ${
                      isDark ? 'text-slate-200' : 'text-slate-800'
                    }`}
                  >
                    {item.dayName}
                  </span>
                  <span
                    className={`text-[10px] sm:text-[11px] font-medium ${
                      isDark ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    {item.dateStr}
                  </span>
                </div>

                {/* Weather icon */}
                <div className="my-1.5 flex items-center justify-center h-8">
                  <WeatherIcon type={item.condition} size={26} />
                </div>

                {/* High / Low temps */}
                <div
                  className={`text-[11px] sm:text-xs font-bold mt-2 flex items-center justify-center whitespace-nowrap ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  <span>{high}°</span>
                  <span className={`mx-0.5 font-normal ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>/</span>
                  <span className={`font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{low}°</span>
                </div>

                {/* Precipitation */}
                <div className="flex items-center gap-0.5 text-[10px] sm:text-[11px] font-semibold text-sky-500 mt-1.5">
                  <Droplets className="w-2.5 h-2.5 fill-sky-500" />
                  <span>{item.pop}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Details Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className={`w-full max-w-lg rounded-3xl border p-6 shadow-2xl relative transition-colors ${
              isDark
                ? 'bg-[#0f172a] border-slate-700 text-white'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <button
              onClick={() => setShowModal(false)}
              className={`absolute top-5 right-5 p-1.5 rounded-lg transition-colors cursor-pointer ${
                isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-500" />
              <span>7-Day Detailed Outlook</span>
            </h3>
            <div className={`divide-y space-y-3 ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
              {daily.map((item, idx) => {
                const high = unit === 'C' ? item.highC : item.highF;
                const low = unit === 'C' ? item.lowC : item.lowF;
                return (
                  <div key={idx} className="flex items-center justify-between pt-3">
                    <div className="flex items-center gap-3">
                      <WeatherIcon type={item.condition} size={24} />
                      <div>
                        <p className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {item.dayName}, {item.dateStr}
                        </p>
                        <p className={`text-xs capitalize ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {item.condition.replace('-', ' ')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1 text-xs text-sky-500 font-semibold">
                        <Droplets className="w-3.5 h-3.5 fill-sky-500" />
                        <span>{item.pop}%</span>
                      </div>
                      <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {high}° <span className={isDark ? 'text-slate-500 font-normal' : 'text-slate-400 font-normal'}>/ {low}°</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
