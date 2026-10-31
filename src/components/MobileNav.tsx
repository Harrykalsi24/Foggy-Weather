import React from 'react';
import { Home, BarChart2, Map, Settings, Sun, Moon } from 'lucide-react';
import { ActiveTab, ThemeMode } from '../types/weather';

interface MobileNavProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab,
  onTabChange,
  theme,
  onToggleTheme,
}) => {
  const isDark = theme === 'dark';

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden px-4 py-2.5 backdrop-blur-xl border-t shadow-2xl safe-area-bottom transition-colors duration-300 ${
        isDark ? 'bg-[#0c1220]/95 border-slate-800/80 text-white' : 'bg-white/95 border-slate-200/90 text-slate-800'
      }`}
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Home */}
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            activeTab === 'home'
              ? 'text-blue-500'
              : isDark
              ? 'text-slate-400 hover:text-slate-200'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div
            className={`p-1.5 rounded-xl transition-all ${
              activeTab === 'home' ? 'bg-blue-600/20 shadow-sm' : ''
            }`}
          >
            <Home className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold">Home</span>
        </button>

        {/* Charts */}
        <button
          onClick={() => onTabChange('charts')}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            activeTab === 'charts'
              ? 'text-blue-500'
              : isDark
              ? 'text-slate-400 hover:text-slate-200'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div
            className={`p-1.5 rounded-xl transition-all ${
              activeTab === 'charts' ? 'bg-blue-600/20 shadow-sm' : ''
            }`}
          >
            <BarChart2 className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold">Charts</span>
        </button>

        {/* Center Sun / Moon toggle pill */}
        <div
          onClick={onToggleTheme}
          role="button"
          tabIndex={0}
          aria-label="Toggle theme"
          className={`relative w-16 h-8 rounded-full border p-0.5 flex items-center justify-between cursor-pointer shadow-md transition-colors ${
            isDark ? 'bg-slate-900 border-slate-700/80' : 'bg-slate-100 border-slate-300'
          }`}
        >
          <div className="w-6 h-6 flex items-center justify-center text-amber-500">
            <Sun className="w-3.5 h-3.5" />
          </div>
          <div className="w-6 h-6 flex items-center justify-center text-slate-400">
            <Moon className="w-3.5 h-3.5" />
          </div>
          <div
            className={`absolute top-0.5 bottom-0.5 w-7 h-7 rounded-full bg-blue-600 shadow-md transition-transform duration-300 flex items-center justify-center text-white ${
              isDark ? 'translate-x-8' : 'translate-x-0'
            }`}
          >
            {isDark ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5 text-amber-200" />}
          </div>
        </div>

        {/* Map */}
        <button
          onClick={() => onTabChange('map')}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            activeTab === 'map'
              ? 'text-blue-500'
              : isDark
              ? 'text-slate-400 hover:text-slate-200'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div
            className={`p-1.5 rounded-xl transition-all ${
              activeTab === 'map' ? 'bg-blue-600/20 shadow-sm' : ''
            }`}
          >
            <Map className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold">Map</span>
        </button>

        {/* Settings */}
        <button
          onClick={() => onTabChange('settings')}
          className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
            activeTab === 'settings'
              ? 'text-blue-500'
              : isDark
              ? 'text-slate-400 hover:text-slate-200'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <div
            className={`p-1.5 rounded-xl transition-all ${
              activeTab === 'settings' ? 'bg-blue-600/20 shadow-sm' : ''
            }`}
          >
            <Settings className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold">Settings</span>
        </button>
      </div>
    </div>
  );
};
