import { useState } from 'react';
import { CITIES_DATA } from './data/mockWeather';
import { TempUnit, ThemeMode, ActiveTab, CityData } from './types/weather';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { HeroCard } from './components/HeroCard';
import { MapWidget } from './components/MapWidget';
import { AirQualityCard } from './components/AirQualityCard';
import { HourlyForecast } from './components/HourlyForecast';
import { TrendsChart } from './components/TrendsChart';
import { SevenDayForecast } from './components/SevenDayForecast';
import { MobileHeader } from './components/MobileHeader';
import { MobileQuickStats } from './components/MobileQuickStats';
import { MobileNav } from './components/MobileNav';
import { MapView } from './components/MapView';
import { SettingsModal } from './components/SettingsModal';
import { fetchFullWeatherData, GeocodedCity } from './services/weatherService';

export function App() {
  const [currentCity, setCurrentCity] = useState<CityData>(CITIES_DATA.toronto);
  const [unit, setUnit] = useState<TempUnit>('C');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleUnit = () => {
    setUnit((prev) => (prev === 'C' ? 'F' : 'C'));
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (tab === 'charts') {
      const el = document.getElementById('weather-trends-section');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'settings') {
      setIsSettingsOpen(true);
    }
  };

  const handleSelectCityLocation = async (city: GeocodedCity) => {
    setIsLoading(true);
    try {
      const data = await fetchFullWeatherData(
        city.latitude,
        city.longitude,
        city.name,
        city.admin1,
        city.country,
        city.country_code
      );
      setCurrentCity(data);
    } catch (err) {
      console.error('Failed to load real-time weather', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMyLocation = () => {
    if (!navigator.geolocation) {
      setCurrentCity(CITIES_DATA.toronto);
      return;
    }

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const data = await fetchFullWeatherData(lat, lon, 'Current Location');
          setCurrentCity(data);
        } catch {
          setCurrentCity(CITIES_DATA.toronto);
        } finally {
          setIsLoading(false);
        }
      },
      () => {
        setCurrentCity(CITIES_DATA.toronto);
        setIsLoading(false);
      }
    );
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 font-sans ${
        theme === 'dark' ? 'bg-[#0b111e] text-slate-100' : 'bg-slate-100 text-slate-900'
      }`}
    >
      {/* ===================== DESKTOP VIEWPORT (lg+) ===================== */}
      <div className="hidden lg:flex min-h-screen">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header
            onSelectCityLocation={handleSelectCityLocation}
            onMyLocation={handleMyLocation}
            unit={unit}
            onToggleUnit={handleToggleUnit}
            theme={theme}
            isLoading={isLoading}
          />

          {activeTab === 'map' ? (
            <MapView
              city={currentCity}
              unit={unit}
              theme={theme}
              onBackToHome={() => setActiveTab('home')}
              onMyLocation={handleMyLocation}
              onUpdateCity={setCurrentCity}
            />
          ) : (
            <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
              {/* Top Grid: Hero Card (col-span-8) + Map & AQI (col-span-4) */}
              <div className="grid grid-cols-12 gap-6 items-stretch">
                {/* Hero Card */}
                <div className="col-span-8 flex">
                  <HeroCard city={currentCity} unit={unit} theme={theme} />
                </div>

                {/* Right Column: Map Widget Preview + Air Quality Card */}
                <div className="col-span-4 flex flex-col gap-4">
                  <div className="w-full">
                    <MapWidget
                      coordinates={currentCity.coordinates}
                      cityName={currentCity.name}
                      onExpand={() => setActiveTab('map')}
                      onLocate={handleMyLocation}
                      theme={theme}
                    />
                  </div>
                  <AirQualityCard
                    aqiValue={currentCity.aqiValue}
                    aqiStatus={currentCity.aqiStatus}
                    theme={theme}
                  />
                </div>
              </div>

              {/* Middle Section: Hourly Forecast */}
              <div>
                <HourlyForecast hourly={currentCity.hourly} unit={unit} theme={theme} />
              </div>

              {/* Bottom Grid: Weather Trends Chart + 7-Day Forecast */}
              <div id="weather-trends-section" className="grid grid-cols-12 gap-6 items-stretch">
                {/* Trends Chart */}
                <div className="col-span-6 flex">
                  <TrendsChart data={currentCity.trends} unit={unit} theme={theme} />
                </div>

                {/* 7-Day Forecast */}
                <div className="col-span-6 flex">
                  <SevenDayForecast daily={currentCity.daily} unit={unit} theme={theme} />
                </div>
              </div>
            </main>
          )}
        </div>
      </div>

      {/* ===================== MOBILE VIEWPORT (<lg) ===================== */}
      <div className="lg:hidden flex flex-col min-h-screen pb-24">
        {/* Mobile Header with iOS Status & Search */}
        <MobileHeader
          onSelectCityLocation={handleSelectCityLocation}
          onMyLocation={handleMyLocation}
          onOpenSettings={() => setIsSettingsOpen(true)}
          unit={unit}
          onToggleUnit={handleToggleUnit}
          theme={theme}
          isLoading={isLoading}
        />

        {activeTab === 'map' ? (
          <MapView
            city={currentCity}
            unit={unit}
            theme={theme}
            onBackToHome={() => setActiveTab('home')}
            onMyLocation={handleMyLocation}
            onUpdateCity={setCurrentCity}
          />
        ) : (
          /* Mobile Body Content */
          <main className="flex-1 px-4 py-3 space-y-4 max-w-lg mx-auto w-full">
            {/* Hero Card */}
            <HeroCard city={currentCity} unit={unit} theme={theme} />

            {/* Quick 4 Stats Grid */}
            <MobileQuickStats stats={currentCity.stats} theme={theme} />

            {/* Hourly Forecast */}
            <HourlyForecast hourly={currentCity.hourly} unit={unit} isMobile={true} theme={theme} />

            {/* Nearby Map Card */}
            <div className="w-full">
              <MapWidget
                coordinates={currentCity.coordinates}
                cityName={currentCity.name}
                isMobile={true}
                onExpand={() => setActiveTab('map')}
                onLocate={handleMyLocation}
                theme={theme}
              />
            </div>

            {/* 7-Day Forecast */}
            <SevenDayForecast daily={currentCity.daily} unit={unit} theme={theme} />
          </main>
        )}

        {/* Floating Mobile Bottom Nav */}
        <MobileNav
          activeTab={activeTab}
          onTabChange={handleTabChange}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => {
          setIsSettingsOpen(false);
          if (activeTab === 'settings') setActiveTab('home');
        }}
        unit={unit}
        onSetUnit={setUnit}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />
    </div>
  );
}

export default App;
