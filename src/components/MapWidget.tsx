import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Plus, Minus, Crosshair, MapPin, ArrowUpRight } from 'lucide-react';
import { ThemeMode } from '../types/weather';

interface MapWidgetProps {
  coordinates: [number, number];
  cityName: string;
  isMobile?: boolean;
  onExpand?: () => void;
  onLocate?: () => void;
  theme?: ThemeMode;
}

export const MapWidget: React.FC<MapWidgetProps> = ({
  coordinates,
  cityName,
  isMobile = false,
  onExpand,
  onLocate,
  theme = 'dark',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  const isDark = theme === 'dark';

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Clean previous instance
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const map = L.map(mapContainerRef.current, {
      center: coordinates,
      zoom: 10,
      minZoom: 3,
      maxZoom: 19,
      zoomControl: false,
      attributionControl: false,
      scrollWheelZoom: false,
    });

    // Universal OpenStreetMap tile layer (zero API key, zero zoom limit warnings)
    const tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      minZoom: 3,
      className: isDark ? 'dark-tiles' : '',
    });

    tileLayer.addTo(map);

    // Custom pulsing target marker
    const customIcon = L.divIcon({
      className: 'custom-pulse-marker',
      html: `
        <div class="relative flex flex-col items-center select-none pointer-events-none">
          <div class="relative flex items-center justify-center">
            <span class="absolute inline-flex h-10 w-10 animate-ping rounded-full bg-blue-500 opacity-60"></span>
            <span class="relative inline-flex h-6 w-6 rounded-full border-2 border-white bg-blue-600 shadow-lg shadow-blue-500/50"></span>
            <span class="absolute inline-flex h-2 w-2 rounded-full bg-white"></span>
          </div>
          <span class="mt-1 font-bold text-[11px] px-2 py-0.5 rounded-md shadow-md whitespace-nowrap ${
            isDark
              ? 'text-white bg-slate-900/90 border border-slate-700/80 shadow-black/60'
              : 'text-slate-900 bg-white/95 border border-slate-200 shadow-slate-300/60'
          }">
            ${cityName}
          </span>
        </div>
      `,
      iconSize: [100, 52],
      iconAnchor: [50, 26],
    });

    const marker = L.marker(coordinates, { icon: customIcon }).addTo(map);
    markerRef.current = marker;
    mapInstanceRef.current = map;

    // Invalidate size to ensure full tile rendering after flex layout mounts
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
  }, [coordinates[0], coordinates[1], cityName, isDark]);

  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleRecenter = () => {
    mapInstanceRef.current?.flyTo(coordinates, 10, { duration: 0.8 });
    onLocate?.();
  };

  return (
    <div
      className={`relative w-full h-[195px] sm:h-[205px] rounded-2xl overflow-hidden border shadow-lg group transition-colors duration-300 ${
        isDark ? 'bg-[#121a2d] border-slate-800/80' : 'bg-white border-slate-200 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]'
      }`}
    >
      {/* Map canvas container */}
      <div ref={mapContainerRef} className="absolute inset-0 z-0 w-full h-full min-h-[195px]" />

      {/* Subtle overlay gradient */}
      <div
        className={`pointer-events-none absolute inset-0 z-10 ${
          isDark
            ? 'bg-gradient-to-t from-[#0e1628]/60 via-transparent to-[#0e1628]/20'
            : 'bg-gradient-to-t from-white/30 via-transparent to-white/10'
        }`}
      />

      {/* Mobile Top Header */}
      {isMobile ? (
        <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-auto">
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl backdrop-blur-md border text-xs font-bold shadow-md ${
              isDark
                ? 'bg-slate-900/85 border-slate-700/60 text-slate-200'
                : 'bg-white/90 border-slate-200 text-slate-800'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-blue-500" />
            <span>Nearby Map</span>
          </div>
          <button
            onClick={onExpand}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl backdrop-blur-md border text-xs font-bold transition-all cursor-pointer shadow-md ${
              isDark
                ? 'bg-slate-900/85 border-slate-700/60 text-slate-300 hover:text-white'
                : 'bg-white/90 border-slate-200 text-slate-700 hover:text-slate-950'
            }`}
          >
            <span>Expand</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        /* Top region tag for desktop */
        <div className="absolute top-3 left-4 z-20 pointer-events-none">
          <span
            className={`text-xs font-bold tracking-wide drop-shadow-md ${
              isDark ? 'text-slate-200' : 'text-slate-800'
            }`}
          >
            {cityName} Metro Area
          </span>
        </div>
      )}

      {/* Map Controls */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-1.5 pointer-events-auto">
        <div
          className={`flex flex-col backdrop-blur-md border rounded-xl overflow-hidden shadow-md transition-colors ${
            isDark ? 'bg-slate-900/85 border-slate-700/70' : 'bg-white/95 border-slate-200'
          }`}
        >
          <button
            onClick={handleZoomIn}
            aria-label="Zoom in"
            className={`p-1.5 transition-colors cursor-pointer border-b ${
              isDark
                ? 'text-slate-300 hover:text-white hover:bg-slate-800/80 border-slate-800'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100 border-slate-100'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomOut}
            aria-label="Zoom out"
            className={`p-1.5 transition-colors cursor-pointer ${
              isDark
                ? 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
            }`}
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          onClick={handleRecenter}
          aria-label="Target Location"
          className={`p-1.5 backdrop-blur-md border rounded-xl transition-colors shadow-md cursor-pointer flex items-center justify-center ${
            isDark
              ? 'bg-slate-900/85 border-slate-700/70 text-slate-300 hover:text-blue-400 hover:bg-slate-800/80'
              : 'bg-white/95 border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-100'
          }`}
        >
          <Crosshair className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Bottom Actions */}
      {isMobile ? (
        <div className="absolute bottom-3 left-3 z-20 pointer-events-auto">
          <button
            onClick={handleRecenter}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl backdrop-blur-md border text-xs font-bold shadow-md cursor-pointer transition-colors ${
              isDark
                ? 'bg-slate-900/90 border-slate-700/80 text-slate-200 hover:bg-slate-800'
                : 'bg-white/95 border-slate-200 text-slate-800 hover:bg-slate-100'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5 text-blue-500" />
            <span>My Location</span>
          </button>
        </div>
      ) : (
        <div className="absolute bottom-3 left-3 z-20 pointer-events-auto">
          <button
            onClick={onExpand}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl backdrop-blur-md border text-xs font-bold shadow-md cursor-pointer transition-all ${
              isDark
                ? 'bg-slate-900/90 border-slate-700/80 text-slate-200 hover:text-white hover:border-blue-500/50 hover:bg-slate-800'
                : 'bg-white/95 border-slate-200 text-slate-800 hover:text-blue-600 hover:border-blue-400 hover:bg-slate-50'
            }`}
          >
            <MapPin className="w-3.5 h-3.5 text-blue-500" />
            <span>View Full Map →</span>
          </button>
        </div>
      )}
    </div>
  );
};
