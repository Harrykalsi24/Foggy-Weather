import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { X, Layers, CloudRain, Wind, Thermometer, Crosshair } from 'lucide-react';
import { CityData, ThemeMode } from '../types/weather';

interface FullMapModalProps {
  city: CityData;
  isOpen: boolean;
  onClose: () => void;
  theme?: ThemeMode;
}

export const FullMapModal: React.FC<FullMapModalProps> = ({
  city,
  isOpen,
  onClose,
  theme = 'dark',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [activeLayer, setActiveLayer] = useState<'temp' | 'radar' | 'wind'>('temp');

  const isDark = theme === 'dark';

  useEffect(() => {
    if (!isOpen || !mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: city.coordinates,
      zoom: 11,
      minZoom: 3,
      maxZoom: 19,
      zoomControl: true,
      attributionControl: false,
    });

    const tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      minZoom: 3,
      className: isDark ? 'dark-tiles' : '',
    });

    tileLayer.addTo(map);

    // Weather radar circle layer simulation
    const radarCircle = L.circle(city.coordinates, {
      radius: 12000,
      color: activeLayer === 'temp' ? '#38bdf8' : activeLayer === 'radar' ? '#10b981' : '#a855f7',
      fillColor: activeLayer === 'temp' ? '#3b82f6' : activeLayer === 'radar' ? '#059669' : '#8b5cf6',
      fillOpacity: 0.25,
      weight: 2,
    }).addTo(map);

    // Marker
    const marker = L.marker(city.coordinates).addTo(map);
    marker.bindPopup(`<b>${city.name}</b><br>${city.conditionText} • ${city.tempC}°C`).openPopup();

    mapInstanceRef.current = map;

    return () => {
      radarCircle.remove();
      marker.remove();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [isOpen, city, activeLayer, isDark]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-5xl h-[85vh] border rounded-3xl overflow-hidden shadow-2xl flex flex-col relative transition-colors duration-300 ${
          isDark ? 'bg-[#0f172a] border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Top Bar */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b z-10 transition-colors ${
            isDark ? 'border-slate-800 bg-[#0c1220]' : 'border-slate-200 bg-white shadow-sm'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-500">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                <span>Weather Radar & Live Map</span>
                <span className={`text-sm font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  — {city.name}, {city.region}
                </span>
              </h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Interactive satellite view with real-time precipitation radar & temperature grids
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Layer Toggles */}
            <div
              className={`hidden sm:flex items-center p-1 rounded-xl border text-xs transition-colors ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
              }`}
            >
              <button
                onClick={() => setActiveLayer('temp')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeLayer === 'temp'
                    ? 'bg-blue-600 text-white'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <Thermometer className="w-3.5 h-3.5" />
                <span>Temperature</span>
              </button>
              <button
                onClick={() => setActiveLayer('radar')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeLayer === 'radar'
                    ? 'bg-emerald-600 text-white'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <CloudRain className="w-3.5 h-3.5" />
                <span>Precipitation</span>
              </button>
              <button
                onClick={() => setActiveLayer('wind')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeLayer === 'wind'
                    ? 'bg-purple-600 text-white'
                    : isDark
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                <Wind className="w-3.5 h-3.5" />
                <span>Wind Flow</span>
              </button>
            </div>

            <button
              onClick={() => mapInstanceRef.current?.flyTo(city.coordinates, 12)}
              title="Center location"
              className={`p-2 rounded-xl border cursor-pointer transition-colors ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-950'
              }`}
            >
              <Crosshair className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className={`p-2 rounded-xl border cursor-pointer transition-colors ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                  : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-950'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Map Canvas */}
        <div className="flex-1 w-full relative">
          <div ref={mapContainerRef} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};
