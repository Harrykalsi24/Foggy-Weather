import React, { useState, useRef, useEffect } from 'react';
import { Search, Crosshair, Settings, Wifi, Battery, Loader2 } from 'lucide-react';
import { TempUnit, ThemeMode } from '../types/weather';
import { searchGlobalCities, GeocodedCity, getCountryFlag } from '../services/weatherService';

interface MobileHeaderProps {
  onSelectCityLocation: (city: GeocodedCity) => void;
  onMyLocation: () => void;
  onOpenSettings: () => void;
  unit: TempUnit;
  onToggleUnit: () => void;
  theme?: ThemeMode;
  isLoading?: boolean;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  onSelectCityLocation,
  onMyLocation,
  onOpenSettings,
  unit,
  onToggleUnit,
  theme = 'dark',
  isLoading = false,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodedCity[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const isDark = theme === 'dark';

  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const cities = await searchGlobalCities(query.trim());
      setResults(cities);
      setIsSearching(false);
      setIsOpen(true);
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      className={`lg:hidden w-full flex flex-col pt-2 pb-3 px-4 border-b sticky top-0 z-30 transition-colors duration-300 ${
        isDark ? 'bg-[#0b111e] border-slate-800/60 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}
    >
      {/* iOS Status Bar Mock */}
      <div
        className={`flex items-center justify-between text-xs font-semibold px-1 pb-2 ${
          isDark ? 'text-slate-200' : 'text-slate-700'
        }`}
      >
        <span>9:41</span>
        <div className="flex items-center gap-2">
          <div className="flex items-end gap-0.5 h-3">
            <span className={`w-0.5 h-1.5 rounded-full ${isDark ? 'bg-white' : 'bg-slate-700'}`}></span>
            <span className={`w-0.5 h-2 rounded-full ${isDark ? 'bg-white' : 'bg-slate-700'}`}></span>
            <span className={`w-0.5 h-2.5 rounded-full ${isDark ? 'bg-white' : 'bg-slate-700'}`}></span>
            <span className={`w-0.5 h-3 rounded-full ${isDark ? 'bg-white' : 'bg-slate-700'}`}></span>
          </div>
          <Wifi className="w-3.5 h-3.5" />
          <div className="flex items-center gap-1">
            <span className="text-[10px]">87</span>
            <Battery className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* App Bar: Logo + Settings */}
      <div className="flex items-center justify-between py-1.5 mb-2.5">
        <div className="flex items-center gap-2.5">
          <div className="relative w-7 h-7 flex items-center justify-center">
            <svg viewBox="0 0 36 36" fill="none" className="w-7 h-7">
              <circle cx="15" cy="14" r="6" fill="#f59e0b" />
              <path
                d="M10 24.5H23a5 5 0 0 0 0-10 6.5 6.5 0 0 0-12.4-1.8A5 5 0 0 0 10 24.5z"
                fill={isDark ? '#ffffff' : '#f8fafc'}
              />
            </svg>
          </div>
          <span className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Foggy
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Unit Toggle Button */}
          <button
            onClick={onToggleUnit}
            className={`px-2 py-0.5 rounded-lg border text-xs font-bold transition-colors ${
              isDark
                ? 'bg-slate-800/80 border-slate-700/60 text-blue-400'
                : 'bg-slate-100 border-slate-200 text-blue-600'
            }`}
          >
            °{unit}
          </button>
          {/* Settings button */}
          <button
            onClick={onOpenSettings}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isDark
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-950'
            }`}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search Input Bar + Locate Button */}
      <div ref={searchRef} className="relative flex items-center gap-2">
        <div className="relative flex-1 flex items-center">
          {isSearching || isLoading ? (
            <Loader2 className="w-4 h-4 text-blue-500 absolute left-3.5 animate-spin" />
          ) : (
            <Search
              className={`w-4 h-4 absolute left-3.5 pointer-events-none ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            />
          )}
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => {
              if (results.length > 0) setIsOpen(true);
            }}
            placeholder="Search for any city..."
            className={`w-full h-10 pl-10 pr-3 rounded-2xl text-sm shadow-inner transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
              isDark
                ? 'bg-[#121a2d] border border-slate-800 text-slate-100 placeholder-slate-400 focus:border-blue-500'
                : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
            }`}
          />
        </div>

        <button
          onClick={onMyLocation}
          aria-label="Locate me"
          className={`w-10 h-10 rounded-2xl border flex items-center justify-center shadow-inner cursor-pointer transition-colors ${
            isDark
              ? 'bg-[#121a2d] border-slate-800 text-slate-300 hover:text-blue-400 hover:border-blue-500'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-blue-600 hover:border-slate-300'
          }`}
        >
          <Crosshair className="w-4 h-4" />
        </button>

        {/* Dropdown */}
        {isOpen && results.length > 0 && (
          <div
            className={`absolute top-12 left-0 right-12 rounded-2xl overflow-hidden shadow-2xl z-40 max-h-60 overflow-y-auto border transition-colors ${
              isDark ? 'bg-[#0f172a] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-xl'
            }`}
          >
            {results.map((c) => (
              <button
                key={`${c.id}-${c.latitude}-${c.longitude}`}
                onClick={() => {
                  onSelectCityLocation(c);
                  setQuery('');
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 flex items-center justify-between border-b last:border-0 cursor-pointer ${
                  isDark ? 'border-slate-800/60 hover:bg-slate-800' : 'border-slate-100 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{getCountryFlag(c.country_code)}</span>
                  <div>
                    <span className="text-sm font-semibold">{c.name}</span>
                    <span className={`text-xs ml-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {c.admin1 || c.country}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
