import React from 'react';
import { Home, Map, BarChart2, Settings, Sun, Moon } from 'lucide-react';
import { ActiveTab, ThemeMode } from '../types/weather';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  theme,
  onToggleTheme,
}) => {
  const isDark = theme === 'dark';

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'map', label: 'Map', icon: Map },
    { id: 'charts', label: 'Charts', icon: BarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <aside
      className={`w-60 shrink-0 h-screen sticky top-0 border-r p-5 flex flex-col justify-between select-none transition-colors duration-300 z-20 ${
        isDark ? 'bg-[#0c1220] border-slate-800/80 text-slate-100' : 'bg-white border-slate-200/90 text-slate-800 shadow-sm'
      }`}
    >
      {/* Top Branding */}
      <div>
        <div className="flex items-center gap-3 px-2 py-3 mb-6">
          {/* Cloud Sun Logo */}
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 drop-shadow-[0_4px_10px_rgba(251,191,36,0.3)]"
            >
              <circle cx="16" cy="15" r="7" fill="#f59e0b" />
              <path
                d="M11 25.5H25a5.5 5.5 0 0 0 0-11 7 7 0 0 0-13.4-2A5.5 5.5 0 0 0 11 25.5z"
                fill={isDark ? '#ffffff' : '#f8fafc'}
                opacity="0.95"
              />
            </svg>
          </div>
          <div>
            <h1 className={`text-lg font-bold tracking-tight leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Foggy
            </h1>
            <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Weather Dashboard
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Theme Switch & Attribution */}
      <div className={`pt-4 border-t flex flex-col items-center ${isDark ? 'border-slate-800/60' : 'border-slate-200'}`}>
        {/* Sleek Day / Night Toggle Switch */}
        <div
          onClick={onToggleTheme}
          role="button"
          tabIndex={0}
          aria-label="Toggle theme"
          className={`relative w-22 h-10 rounded-full border p-1 flex items-center justify-between cursor-pointer transition-all duration-300 shadow-inner ${
            isDark
              ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
              : 'bg-slate-100 border-slate-300 hover:border-slate-400'
          }`}
        >
          <div className="w-8 h-8 flex items-center justify-center text-amber-500">
            <Sun className="w-4 h-4" />
          </div>
          <div className="w-8 h-8 flex items-center justify-center text-slate-400">
            <Moon className="w-4 h-4" />
          </div>
          {/* Animated slider pill */}
          <div
            className={`absolute top-1 bottom-1 w-8 h-8 rounded-full bg-blue-600 shadow-md transition-transform duration-300 flex items-center justify-center text-white ${
              isDark ? 'translate-x-11' : 'translate-x-0'
            }`}
          >
            {isDark ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-200" />}
          </div>
        </div>

        {/* Footer Credit */}
        <p className={`text-[11px] font-medium mt-4 text-center ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Made with <span className="text-rose-500">❤️</span><br />by Harry
        </p>
      </div>
    </aside>
  );
};
