export interface WeatherStats {
  humidity: number; // percentage
  windSpeed: number; // km/h
  pressure: number; // hPa
  visibility: number; // km
}

export interface HourlyForecastItem {
  time: string;
  hour: number;
  tempC: number;
  tempF: number;
  condition: 'clear-night' | 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy';
  pop: number; // probability of precipitation %
}

export interface DailyForecastItem {
  dayName: string;
  dateStr: string;
  highC: number;
  lowC: number;
  highF: number;
  lowF: number;
  condition: 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy';
  pop: number; // probability of precipitation %
}

export interface TrendDataPoint {
  day: string;
  tempC: number;
  tempF: number;
  precip: number; // %
  wind: number; // km/h
  humidity: number; // %
  label?: string;
}

export interface CityData {
  id: string;
  name: string;
  region: string;
  country: string;
  flag: string;
  datetime: string;
  tempC: number;
  tempF: number;
  feelsLikeC: number;
  feelsLikeF: number;
  highC: number;
  lowC: number;
  highF: number;
  lowF: number;
  conditionText: string;
  conditionIcon: 'clear-night' | 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy';
  pop: number;
  aqiValue: number;
  aqiStatus: 'Good' | 'Moderate' | 'Unhealthy';
  aqiBadge: string;
  bgSkylineUrl: string;
  coordinates: [number, number];
  stats: WeatherStats;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  trends: TrendDataPoint[];
}

export type TempUnit = 'C' | 'F';
export type ThemeMode = 'dark' | 'light';
export type ActiveTab = 'home' | 'map' | 'charts' | 'settings';
export type TrendMetric = 'Temperature' | 'Precipitation' | 'Wind' | 'Humidity';

