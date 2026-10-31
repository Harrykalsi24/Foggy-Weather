import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import {
  Crosshair,
  ArrowLeft,
  Droplets,
  Search,
  Loader2,
  MapPin
} from 'lucide-react';
import { CityData, TempUnit, ThemeMode } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { searchGlobalCities, GeocodedCity, fetchFullWeatherData } from '../services/weatherService';

interface MapViewProps {
  city: CityData;
  unit: TempUnit;
  theme: ThemeMode;
  onBackToHome: () => void;
  onMyLocation: () => void;
  onUpdateCity?: (newCity: CityData) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  city,
  unit,
  theme,
  onBackToHome,
  onMyLocation,
  onUpdateCity,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  // Search state on map
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodedCity[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFetchingWeather, setIsFetchingWeather] = useState(false);

  const isDark = theme === 'dark';
  const curTemp = unit === 'C' ? city.tempC : city.tempF;

  // Search handler
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

  // Leaflet map setup
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: city.coordinates,
      zoom: 10,
      minZoom: 2,
      maxZoom: 19,
      zoomControl: false,
      attributionControl: false,
    });

    // Pure OpenStreetMap tiles (supports all zoom levels 0-19 seamlessly without limits)
    const tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      minZoom: 2,
      className: isDark ? 'dark-tiles' : '',
    });

    tileLayer.addTo(map);

    // Custom Target Marker
    const customIcon = L.divIcon({
      className: 'custom-pulse-marker',
      html: `
        <div class="relative flex flex-col items-center select-none pointer-events-none">
          <div class="relative flex items-center justify-center">
            <span class="absolute inline-flex h-12 w-12 animate-ping rounded-full bg-blue-500 opacity-60"></span>
            <span class="relative inline-flex h-7 w-7 rounded-full border-2 border-white bg-blue-600 shadow-xl shadow-blue-500/50"></span>
            <span class="absolute inline-flex h-2.5 w-2.5 rounded-full bg-white"></span>
          </div>
          <span class="mt-1 font-bold text-xs px-2.5 py-1 rounded-lg shadow-lg whitespace-nowrap ${
            isDark
              ? 'text-white bg-slate-900/90 border border-slate-700/80 shadow-black/80'
              : 'text-slate-900 bg-white/95 border border-slate-200 shadow-slate-300/80'
          }">
            ${city.name} • ${curTemp}°${unit}
          </span>
        </div>
      `,
      iconSize: [120, 56],
      iconAnchor: [60, 28],
    });

    const marker = L.marker(city.coordinates, { icon: customIcon }).addTo(map);
    markerRef.current = marker;

    // Click anywhere on map to select and fetch location weather!
    map.on('click', async (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      setIsFetchingWeather(true);
      try {
        const newData = await fetchFullWeatherData(lat, lng, 'Selected Pin', '', '');
        onUpdateCity?.(newData);
        map.flyTo([lat, lng], map.getZoom(), { duration: 0.6 });
      } catch (err) {
        console.error('Failed to fetch weather for coordinates', err);
      } finally {
        setIsFetchingWeather(false);
      }
    });

    mapInstanceRef.current = map;

    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);

    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [city.coordinates[0], city.coordinates[1], city.name, isDark, curTemp, unit]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleRecenter = () => {
    mapInstanceRef.current?.flyTo(city.coordinates, 11, { duration: 0.8 });
    onMyLocation();
  };

  const handleSelectSearchedCity = async (c: GeocodedCity) => {
    setIsFetchingWeather(true);
    setIsOpen(false);
    setQuery('');
    try {
      const newData = await fetchFullWeatherData(
        c.latitude,
        c.longitude,
        c.name,
        c.admin1,
        c.country,
        c.country_code
      );
      onUpdateCity?.(newData);
      mapInstanceRef.current?.flyTo([c.latitude, c.longitude], 11, { duration: 0.8 });
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetchingWeather(false);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col relative h-[calc(100vh-80px)] overflow-hidden">
      {/* Top Floating Bar: Back Button + Clean City Search & Location Selector (Navbar with temperature/wind removed) */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left: Back to Home + City Badge */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={onBackToHome}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl backdrop-blur-md border text-xs font-bold transition-all shadow-lg cursor-pointer ${
              isDark
                ? 'bg-slate-900/90 border-slate-700/80 text-slate-200 hover:text-white hover:bg-slate-800'
                : 'bg-white/90 border-slate-200 text-slate-800 hover:text-blue-600'
            }`}
          >
            <ArrowLeft className="w-4 h-4 text-blue-500" />
            <span>Dashboard</span>
          </button>

          <div
            className={`px-3.5 py-2.5 rounded-2xl backdrop-blur-md border text-xs font-bold flex items-center gap-2 shadow-lg ${
              isDark ? 'bg-slate-900/90 border-slate-700/80 text-white' : 'bg-white/90 border-slate-200 text-slate-900'
            }`}
          >
            <span>{city.flag}</span>
            <span>{city.name}, {city.region}</span>
          </div>
        </div>

        {/* Right: City Search & Location Selector */}
        <div className="relative w-full max-w-xs pointer-events-auto">
          <div className="relative flex items-center">
            {isSearching || isFetchingWeather ? (
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
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => {
                if (results.length > 0) setIsOpen(true);
              }}
              placeholder="Search & jump to any city..."
              className={`w-full h-10 pl-10 pr-3 rounded-2xl text-xs font-semibold backdrop-blur-md border shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
                isDark
                  ? 'bg-slate-900/90 border-slate-700/80 text-white placeholder-slate-400'
                  : 'bg-white/95 border-slate-200 text-slate-900 placeholder-slate-500'
              }`}
            />
          </div>

          {/* Autocomplete Dropdown */}
          {isOpen && results.length > 0 && (
            <div
              className={`absolute top-12 left-0 right-0 rounded-2xl overflow-hidden shadow-2xl z-40 max-h-60 overflow-y-auto border ${
                isDark ? 'bg-[#0f172a] border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-xl'
              }`}
            >
              {results.map((c) => (
                <button
                  key={`${c.id}-${c.latitude}-${c.longitude}`}
                  onClick={() => handleSelectSearchedCity(c)}
                  className={`w-full text-left px-4 py-2.5 flex items-center justify-between border-b last:border-0 cursor-pointer ${
                    isDark ? 'border-slate-800 hover:bg-slate-800' : 'border-slate-100 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-blue-500" />
                    <div>
                      <span className="text-xs font-bold">{c.name}</span>
                      <span className={`text-[11px] ml-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
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

      {/* Map Canvas */}
      <div ref={mapContainerRef} className="absolute inset-0 z-0 w-full h-full cursor-crosshair" />

      {/* Zoom and Locate Controls */}
      <div className="absolute right-4 bottom-24 sm:bottom-6 z-20 flex flex-col gap-2">
        <div
          className={`flex flex-col backdrop-blur-md border rounded-2xl overflow-hidden shadow-xl ${
            isDark ? 'bg-slate-900/90 border-slate-700/80' : 'bg-white/95 border-slate-200'
          }`}
        >
          <button
            onClick={handleZoomIn}
            className={`p-2.5 font-bold transition-colors cursor-pointer border-b ${
              isDark
                ? 'text-slate-300 hover:text-white hover:bg-slate-800 border-slate-800'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100 border-slate-100'
            }`}
          >
            +
          </button>
          <button
            onClick={handleZoomOut}
            className={`p-2.5 font-bold transition-colors cursor-pointer ${
              isDark
                ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            -
          </button>
        </div>

        <button
          onClick={handleRecenter}
          aria-label="Target Location"
          className={`p-2.5 backdrop-blur-md border rounded-2xl transition-colors shadow-xl cursor-pointer flex items-center justify-center ${
            isDark
              ? 'bg-slate-900/90 border-slate-700/80 text-slate-300 hover:text-blue-400 hover:bg-slate-800'
              : 'bg-white/95 border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-100'
          }`}
        >
          <Crosshair className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Left Live Location Card: Click Map to Select Any Location */}
      <div className="absolute left-4 bottom-24 sm:bottom-6 z-20 max-w-xs pointer-events-auto">
        <div
          className={`p-4 rounded-3xl backdrop-blur-xl border shadow-2xl transition-colors duration-300 ${
            isDark
              ? 'bg-[#0f172a]/95 border-slate-700/80 text-white'
              : 'bg-white/95 border-slate-200 text-slate-900'
          }`}
        >
          <div className="flex items-center justify-between gap-4 mb-2">
            <div>
              <p className="text-[11px] font-bold text-blue-500 uppercase tracking-wider">Interactive Map</p>
              <h3 className="text-base font-bold flex items-center gap-1.5">
                <span>{city.name}</span>
                <span className="text-sm font-normal text-slate-400">({city.region})</span>
              </h3>
            </div>
            <WeatherIcon type={city.conditionIcon} size={28} />
          </div>

          <div className="flex items-baseline gap-2 mb-2.5">
            <span className="text-3xl font-extrabold">{curTemp}°{unit}</span>
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Feels like {unit === 'C' ? city.feelsLikeC : city.feelsLikeF}°
            </span>
          </div>

          <p className={`text-[11px] font-medium mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Click anywhere on the map to pin & inspect that location.
          </p>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-700/50 text-center">
            <div className="flex flex-col items-center">
              <span className={`text-[10px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Rain</span>
              <span className="text-xs font-bold text-sky-500 flex items-center gap-0.5">
                <Droplets className="w-2.5 h-2.5 fill-sky-500" />
                {city.pop}%
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className={`text-[10px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Wind</span>
              <span className="text-xs font-bold">{city.stats.windSpeed} km/h</span>
            </div>
            <div className="flex flex-col items-center">
              <span className={`text-[10px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>AQI</span>
              <span className="text-xs font-bold text-emerald-500">{city.aqiValue}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
