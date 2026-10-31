import React from 'react';
import { MapPin, Leaf, Droplets } from 'lucide-react';
import { CityData, TempUnit, ThemeMode } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';

interface HeroCardProps {
  city: CityData;
  unit: TempUnit;
  theme?: ThemeMode;
  onCityClick?: () => void;
}

export const HeroCard: React.FC<HeroCardProps> = ({ city, unit, theme = 'dark' }) => {
  const currentTemp = unit === 'C' ? city.tempC : city.tempF;
  const feelsLike = unit === 'C' ? city.feelsLikeC : city.feelsLikeF;
  const highTemp = unit === 'C' ? city.highC : city.highF;
  const lowTemp = unit === 'C' ? city.lowC : city.lowF;

  const isDark = theme === 'dark';

  return (
    <div
      className={`relative w-full rounded-3xl overflow-hidden shadow-2xl min-h-[300px] sm:min-h-[320px] flex flex-col justify-between p-6 sm:p-7 group transition-all duration-300 border ${
        isDark
          ? 'bg-[#0c1424] border-slate-700/50'
          : 'bg-[#0c1424] border-slate-300/80 shadow-[0_12px_36px_-6px_rgba(0,0,0,0.18)]'
      }`}
    >
      {/* Background Skyline Image: padded on left so full monument/landscape is visible on right with slight temp overlap & enhanced brightness */}
      <div
        className="absolute inset-y-0 right-0 left-[16%] sm:left-[24%] md:left-[28%] bg-cover bg-center transition-transform duration-700 group-hover:scale-105 filter brightness-115 contrast-105"
        style={{
          backgroundImage: `url('${city.bgSkylineUrl}')`,
          maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.85) 16%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.85) 16%, black 100%)',
        }}
      />

      {/* Subtle gentle vignette to preserve image clarity on right while giving left edge seamless blend */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0c1424] via-[#0c1424]/75 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0c1424]/80 via-transparent to-black/20 pointer-events-none" />

      {/* Top Header Row */}
      <div className="relative z-10 flex flex-wrap items-start justify-between gap-3">
        <div className="bg-[#0c1424]/75 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/10 shadow-lg">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300" />
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>{city.name}, {city.region}</span>
              <span className="text-base">{city.flag}</span>
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5 font-medium pl-6">
            {city.datetime}
          </p>
        </div>

        {/* Air Quality Pill */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/85 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-xs font-semibold shadow-md">
          <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Leaf className="w-2.5 h-2.5 text-emerald-400" />
          </div>
          <span>{city.aqiBadge}</span>
        </div>
      </div>

      {/* Middle & Bottom Temperature & Conditions: with slightly increased opacity backing plate that gently overlaps image */}
      <div className="relative z-10 mt-4 sm:mt-6 bg-[#0c1424]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 sm:p-5 shadow-2xl max-w-fit">
        <div className="flex items-baseline">
          <span className="text-6xl sm:text-7xl font-extrabold tracking-tighter text-white leading-none drop-shadow-md">
            {currentTemp}
          </span>
          <span className="text-3xl sm:text-4xl font-semibold text-slate-200 ml-1">
            °{unit}
          </span>
        </div>
        <p className="text-sm font-medium text-slate-300 mt-1">
          Feels like {feelsLike}°{unit}
        </p>

        {/* Condition description with glowing icon */}
        <div className="flex items-center gap-2.5 mt-3 sm:mt-4">
          <WeatherIcon type={city.conditionIcon} size={26} />
          <span className="text-base sm:text-lg font-semibold text-white tracking-wide">
            {city.conditionText}
          </span>
        </div>

        {/* High / Low & Precipitation Stats */}
        <div className="flex items-center gap-3 mt-3 text-xs sm:text-sm font-medium text-slate-300">
          <span>H: {highTemp}°</span>
          <span>L: {lowTemp}°</span>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1 text-sky-400">
            <Droplets className="w-3.5 h-3.5 fill-sky-400 text-sky-400" />
            <span>{city.pop}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
