import React, { useState, useRef, useEffect } from 'react';
import { Search, Navigation, Loader2 } from 'lucide-react';
import { TempUnit, ThemeMode } from '../types/weather';
import { searchGlobalCities, GeocodedCity, getCountryFlag } from '../services/weatherService';

interface HeaderProps {
  onSelectCityLocation: (city: GeocodedCity) => void;
  onMyLocation: () => void;
  unit: TempUnit;
  onToggleUnit: () => void;
  theme: ThemeMode;
  isLoading?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectCityLocation,
  onMyLocation,
  unit,
  onToggleUnit,
  theme,
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
    <header
      className={`w-full flex items-center justify-between gap-4 py-3.5 px-6 border-b backdrop-blur-md sticky top-0 z-30 transition-colors duration-300 ${
        isDark
          ? 'border-slate-800/80 bg-[#0b111e]/90 text-slate-100'
          : 'border-slate-200/90 bg-white/90 text-slate-900 shadow-sm'
      }`}
    >
      {/* Search Input Box */}
      <div ref={searchRef} className="relative flex-1 max-w-md">
        <div className="relative flex items-center">
          {isSearching || isLoading ? (
            <Loader2 className="w-4 h-4 text-blue-500 absolute left-4 animate-spin" />
          ) : (
            <Search
              className={`w-4 h-4 absolute left-4 pointer-events-none transition-colors ${
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
            placeholder="Search for any city, landmark, or town..."
            className={`w-full h-10 pl-11 pr-4 rounded-xl text-sm transition-all shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
              isDark
                ? 'bg-[#121a2d] border border-slate-800 text-slate-100 placeholder-slate-400 focus:border-blue-500'
                : 'bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-500 focus:border-blue-500'
            }`}
          />
        </div>

        {/* Global Autocomplete Dropdown */}
        {isOpen && results.length > 0 && (
          <div
            className={`absolute top-12 left-0 right-0 rounded-2xl overflow-hidden shadow-2xl z-40 max-h-72 overflow-y-auto border transition-colors ${
              isDark
                ? 'bg-[#0f172a] border-slate-700/80 text-white'
                : 'bg-white border-slate-200 text-slate-900 shadow-xl'
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
                className={`w-full text-left px-4 py-3 flex items-center justify-between border-b last:border-0 cursor-pointer transition-colors ${
                  isDark
                    ? 'border-slate-800/60 hover:bg-slate-800/80'
                    : 'border-slate-100 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-lg">{getCountryFlag(c.country_code)}</span>
                  <div>
                    <span className="text-sm font-semibold">{c.name}</span>
                    <span className={`text-xs ml-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {[c.admin1, c.country].filter(Boolean).join(', ')}
                    </span>
                  </div>
                </div>
                <span className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {c.latitude.toFixed(2)}°, {c.longitude.toFixed(2)}°
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right Controls (Only Location and Unit toggle; redundant theme button removed) */}
      <div className="flex items-center gap-3">
        {/* My Location button */}
        <button
          onClick={onMyLocation}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer ${
            isDark
              ? 'bg-[#121a2d] border border-slate-800 text-slate-200 hover:text-white hover:border-slate-700'
              : 'bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-950 hover:border-slate-300'
          }`}
        >
          <Navigation className="w-3.5 h-3.5 text-blue-500 -rotate-45" />
          <span>My Location</span>
        </button>

        {/* Unit Toggle: °C / °F */}
        <div
          className={`flex items-center p-1 rounded-xl border transition-colors ${
            isDark ? 'bg-[#121a2d] border-slate-800' : 'bg-slate-100 border-slate-200'
          }`}
        >
          <button
            onClick={() => unit !== 'C' && onToggleUnit()}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              unit === 'C'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/50'
                : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            °C
          </button>
          <button
            onClick={() => unit !== 'F' && onToggleUnit()}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              unit === 'F'
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/50'
                : isDark
                ? 'text-slate-400 hover:text-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            °F
          </button>
        </div>
      </div>
    </header>
  );
};
