import React, { useState, useEffect } from 'react';
import { X, Sliders, Bell, Compass, RefreshCw, Key, Check } from 'lucide-react';
import { TempUnit, ThemeMode } from '../types/weather';
import { getEffectiveApiKey, saveUserApiKey, OWM_KEY_POOL } from '../services/weatherService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  unit: TempUnit;
  onSetUnit: (unit: TempUnit) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  unit,
  onSetUnit,
  theme,
  onToggleTheme,
}) => {
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setApiKey(getEffectiveApiKey());
      setIsSaved(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isDark = theme === 'dark';

  const handleSaveKey = () => {
    saveUserApiKey(apiKey);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleUseFreeDefault = () => {
    setApiKey(OWM_KEY_POOL[0]);
    saveUserApiKey(OWM_KEY_POOL[0]);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`w-full max-w-lg border rounded-3xl p-6 shadow-2xl relative transition-colors duration-300 max-h-[90vh] overflow-y-auto ${
          isDark ? 'bg-[#0f172a] border-slate-700/80 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-5 right-5 p-1.5 rounded-lg transition-colors cursor-pointer ${
            isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-2xl bg-blue-600/20 text-blue-500">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Dashboard Settings</h2>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Customize units, API keys, map radar & preferences
            </p>
          </div>
        </div>

        {/* Options List */}
        <div className="space-y-3.5">
          {/* Weather API Key Section */}
          <div
            className={`p-4 rounded-2xl border transition-colors ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-bold">OpenWeatherMap API Key</span>
              </div>
              <span className="text-[11px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md">
                Active / Working
              </span>
            </div>

            <p className={`text-xs mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Key provided automatically. You can also paste your own personal key below or use zero-key free mode:
            </p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter OpenWeatherMap API Key"
                className={`flex-1 h-9 px-3 rounded-xl text-xs font-mono border transition-all focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                  isDark
                    ? 'bg-slate-800 border-slate-700 text-slate-100 placeholder-slate-500'
                    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                }`}
              />
              <button
                onClick={handleSaveKey}
                className="px-3 h-9 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-sm"
              >
                {isSaved ? <Check className="w-3.5 h-3.5" /> : null}
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>
            </div>

            <div className="mt-2.5 flex items-center justify-between">
              <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Open-Meteo & RainViewer Radar fallback active
              </span>
              <button
                onClick={handleUseFreeDefault}
                className="text-[11px] font-bold text-blue-500 hover:underline cursor-pointer"
              >
                Restore Default Key
              </button>
            </div>
          </div>

          {/* Temperature Unit */}
          <div
            className={`flex items-center justify-between p-3.5 rounded-2xl border transition-colors ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div>
              <p className="text-sm font-bold">Temperature Unit</p>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Choose between Celsius and Fahrenheit
              </p>
            </div>
            <div
              className={`flex items-center p-1 rounded-xl border ${
                isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
              }`}
            >
              <button
                onClick={() => onSetUnit('C')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  unit === 'C' ? 'bg-blue-600 text-white shadow-sm' : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                °C
              </button>
              <button
                onClick={() => onSetUnit('F')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  unit === 'F' ? 'bg-blue-600 text-white shadow-sm' : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                °F
              </button>
            </div>
          </div>

          {/* Theme Mode */}
          <div
            className={`flex items-center justify-between p-3.5 rounded-2xl border transition-colors ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div>
              <p className="text-sm font-bold">Color Theme</p>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Dark Midnight or Clean Daylight
              </p>
            </div>
            <button
              onClick={onToggleTheme}
              className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-slate-200 hover:text-white'
                  : 'bg-white border-slate-200 text-slate-700 hover:text-slate-950 shadow-sm'
              }`}
            >
              {theme === 'dark' ? 'Dark Mode 🌙' : 'Light Mode ☀️'}
            </button>
          </div>

          {/* Severe Weather Alerts */}
          <div
            className={`flex items-center justify-between p-3.5 rounded-2xl border transition-colors ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-amber-500" />
              <div>
                <p className="text-sm font-bold">Severe Weather Alerts</p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Storm & freeze warning pushes
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700 focus:ring-blue-500 cursor-pointer"
            />
          </div>

          {/* Auto Refresh */}
          <div
            className={`flex items-center justify-between p-3.5 rounded-2xl border transition-colors ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <RefreshCw className="w-4 h-4 text-emerald-500" />
              <div>
                <p className="text-sm font-bold">Live Auto-Refresh</p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Updates radar & telemetry every 5 mins
                </p>
              </div>
            </div>
            <input
              type="checkbox"
              defaultChecked
              className="w-4 h-4 rounded text-blue-600 bg-slate-800 border-slate-700 focus:ring-blue-500 cursor-pointer"
            />
          </div>

          {/* Geolocation */}
          <div
            className={`flex items-center justify-between p-3.5 rounded-2xl border transition-colors ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Compass className="w-4 h-4 text-sky-500" />
              <div>
                <p className="text-sm font-bold">Precise Geolocation</p>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Detect nearest weather station
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-500">Active</span>
          </div>
        </div>

        {/* Footer */}
        <div className={`mt-6 pt-4 border-t flex justify-end ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition-colors cursor-pointer shadow-lg shadow-blue-600/30"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
