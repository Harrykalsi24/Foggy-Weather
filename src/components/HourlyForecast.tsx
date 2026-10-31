import React, { useRef } from 'react';
import { Clock, ChevronLeft, ChevronRight, Droplets, ArrowRight } from 'lucide-react';
import { HourlyForecastItem, TempUnit, ThemeMode } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';

interface HourlyForecastProps {
  hourly: HourlyForecastItem[];
  unit: TempUnit;
  isMobile?: boolean;
  theme?: ThemeMode;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({
  hourly,
  unit,
  isMobile = false,
  theme = 'dark',
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 240;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  return (
    <div
      className={`w-full rounded-2xl backdrop-blur-md border p-4 sm:p-5 shadow-lg relative group transition-colors duration-300 ${
        isDark
          ? 'bg-[#121a2d]/90 border-slate-800/80 text-white'
          : 'bg-white border-slate-200 text-slate-900 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]'
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between pb-3 border-b mb-4 ${
          isDark ? 'border-slate-800/60' : 'border-slate-100'
        }`}
      >
        <div className="flex items-center gap-2">
          <Clock className={`w-4 h-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`} />
          <h2 className={`text-sm font-bold tracking-wide ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
            Hourly Forecast
          </h2>
        </div>
        <button
          onClick={() => scroll('right')}
          className={`flex items-center gap-1 text-xs font-semibold transition-colors cursor-pointer ${
            isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-blue-600'
          }`}
        >
          <span>{isMobile ? 'Next 6 Hours' : 'Next 24 Hours'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Carousel Container with Arrow buttons */}
      <div className="relative">
        {/* Left Arrow Button */}
        <button
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          className={`hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -ml-2 z-10 w-8 h-8 rounded-full border items-center justify-center transition-all shadow-md cursor-pointer ${
            isDark
              ? 'bg-slate-900/90 border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800'
              : 'bg-white border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-100'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Scrollable Items */}
        <div
          ref={scrollContainerRef}
          className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar smooth-scroll py-1 px-1 select-none"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            overscrollBehaviorX: 'contain',
            scrollSnapType: 'x proximity',
          }}
        >
          {hourly.map((item, index) => {
            const temp = unit === 'C' ? item.tempC : item.tempF;
            return (
              <div
                key={index}
                style={{ scrollSnapAlign: 'start' }}
                className={`flex flex-col items-center justify-between min-w-[72px] sm:min-w-[84px] py-2 px-1.5 rounded-xl transition-all cursor-pointer flex-shrink-0 ${
                  isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                }`}
              >
                {/* Time */}
                <span className={`text-xs font-semibold mb-2.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {item.time}
                </span>

                {/* Weather Icon */}
                <div className="my-1.5 flex items-center justify-center h-8">
                  <WeatherIcon type={item.condition} size={28} />
                </div>

                {/* Temperature */}
                <span className={`text-sm font-bold mt-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {temp}°
                </span>

                {/* Precipitation */}
                <div className="flex items-center gap-0.5 text-[11px] font-semibold text-sky-500 mt-1">
                  <Droplets className="w-2.5 h-2.5 fill-sky-500" />
                  <span>{item.pop}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          className={`hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 -mr-2 z-10 w-8 h-8 rounded-full border items-center justify-center transition-all shadow-md cursor-pointer ${
            isDark
              ? 'bg-slate-900/90 border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800'
              : 'bg-white border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-100'
          }`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
