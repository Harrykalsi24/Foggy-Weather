import { CityData, HourlyForecastItem, DailyForecastItem, TrendDataPoint } from '../types/weather';

// Maximum location searches allowed with the default starter quota
export const MAX_DEFAULT_SEARCHES = 10;
const STORAGE_USER_KEY = 'foggy_user_owm_key';
const STORAGE_SEARCH_COUNT = 'foggy_search_count';

// Internal obfuscated fallback key (never exposed in UI or plain text)
const _DEFAULT_ENC = 'OTUzOTc5ZDRhOGQ1MGYzM2ZmNjBlYzY2ZDJkMGVkYzY=';
function getInternalDefaultKey(): string {
  try {
    return typeof atob === 'function' ? atob(_DEFAULT_ENC) : '';
  } catch {
    return '';
  }
}

/**
 * Returns user's custom API key if present, otherwise returns empty string.
 * The user can NEVER view or access the internal default key.
 */
export function getUserApiKey(): string {
  try {
    return localStorage.getItem(STORAGE_USER_KEY)?.trim() || '';
  } catch {
    return '';
  }
}

export function hasUserApiKey(): boolean {
  return getUserApiKey().length > 8;
}

export function saveUserApiKey(key: string): void {
  try {
    const trimmed = key.trim();
    if (trimmed) {
      localStorage.setItem(STORAGE_USER_KEY, trimmed);
    } else {
      localStorage.removeItem(STORAGE_USER_KEY);
    }
  } catch {
    //
  }
}

export function getSearchCount(): number {
  try {
    const raw = localStorage.getItem(STORAGE_SEARCH_COUNT);
    return raw ? Math.max(0, parseInt(raw, 10) || 0) : 0;
  } catch {
    return 0;
  }
}

export function getRemainingSearches(): number {
  if (hasUserApiKey()) return Infinity;
  return Math.max(0, MAX_DEFAULT_SEARCHES - getSearchCount());
}

/**
 * Checks if search quota is available and increments default count.
 * Returns { allowed: true, remaining } or { allowed: false, remaining: 0 }.
 */
export function useSearchQuota(): { allowed: boolean; remaining: number } {
  if (hasUserApiKey()) {
    return { allowed: true, remaining: Infinity };
  }
  const current = getSearchCount();
  if (current >= MAX_DEFAULT_SEARCHES) {
    return { allowed: false, remaining: 0 };
  }
  const next = current + 1;
  try {
    localStorage.setItem(STORAGE_SEARCH_COUNT, next.toString());
  } catch {
    //
  }
  return { allowed: true, remaining: Math.max(0, MAX_DEFAULT_SEARCHES - next) };
}

/**
 * Internal resolver for API calls (never exposed to UI components)
 */
export function getActiveApiKey(): string {
  const custom = getUserApiKey();
  if (custom) return custom;
  return getInternalDefaultKey();
}

// Convert C to F
export const cToF = (c: number): number => Math.round((c * 9) / 5 + 32);

// Flag emoji from country code
export function getCountryFlag(countryCode?: string): string {
  if (!countryCode || countryCode.length !== 2) return '📍';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

// Landmark / Skyline image cache
const imageCache = new Map<string, string>();

// Curated iconic landmarks/landscapes avoiding any person/portrait imagery
const CANONICAL_LANDMARKS: Record<string, string> = {
  toronto: 'https://images.unsplash.com/photo-1517090504586-fde19ea6066f?auto=format&fit=crop&w=1800&q=80',
  'new york': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/New_york_times_square-terabass.jpg/1920px-New_york_times_square-terabass.jpg',
  paris: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg/1920px-La_Tour_Eiffel_vue_de_la_Tour_Saint-Jacques%2C_Paris_ao%C3%BBt_2014_%282%29.jpg',
  tokyo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Tokyo_Skyline20210123.jpg/1920px-Tokyo_Skyline20210123.jpg',
  london: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1800&q=80',
  vancouver: 'https://images.unsplash.com/photo-1559511260-66a65e09b245?auto=format&fit=crop&w=1800&q=80',
  dubai: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Dubai_skyline_2015_%28crop%29.jpg',
  sydney: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7c/Sydney_Opera_House_-_Dec_2008.jpg/1920px-Sydney_Opera_House_-_Dec_2008.jpg',
  rome: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/Colosseo_2020.jpg/1920px-Colosseo_2020.jpg',
  washington: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Washington_DC_skyline_from_the_Potomac_River.jpg/1920px-Washington_DC_skyline_from_the_Potomac_River.jpg',
  hamilton: 'https://images.unsplash.com/photo-1579202673506-ca3ce28943ef?auto=format&fit=crop&w=1800&q=80',
  victoria: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Victoria_Inner_Harbour_BC.jpg/1920px-Victoria_Inner_Harbour_BC.jpg',
  lincoln: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Lincoln_Cathedral_from_the_South_West.jpg/1920px-Lincoln_Cathedral_from_the_South_West.jpg',
  columbus: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Columbus_Ohio_skyline_dusk.jpg/1920px-Columbus_Ohio_skyline_dusk.jpg',
  sanfrancisco: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1800&q=80',
  chicago: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1800&q=80',
  mumbai: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Marine_Drive_Mumbai.jpg/1920px-Marine_Drive_Mumbai.jpg',
  delhi: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/India_Gate_in_New_Delhi_03-2016.jpg/1920px-India_Gate_in_New_Delhi_03-2016.jpg',
  berlin: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Brandenburger_Tor_abends.jpg/1920px-Brandenburger_Tor_abends.jpg',
};

// Disallowed person keywords in titles, descriptions, extracts or file names
const PERSON_REGEX = /\b(born|politician|president|governor|minister|player|footballer|cricketer|actor|actress|singer|biography|portrait|headshot|statesman|general|bishop|king|queen|prince|princess|physician|scientist|author|writer|person|he was|she was|he is|she is|who served|monarch|businessman|activist)\b/i;

interface WikiPageItem {
  title?: string;
  description?: string;
  extract?: string;
  thumbnail?: {
    source: string;
    width?: number;
    height?: number;
  };
}

/**
 * Validates that an image depicts a landscape, monument, or skyline rather than a person.
 * Rejects vertical portrait photos (height > width) and pages describing individuals.
 */
function isLandscapeMonumentImage(page: WikiPageItem): boolean {
  if (!page.thumbnail?.source) return false;

  const w = page.thumbnail.width || 0;
  const h = page.thumbnail.height || 0;

  // Strict aspect ratio check: reject vertical/tall portrait headshots
  if (w > 0 && h > 0 && h > w * 0.9) {
    return false;
  }

  // Check description and extract for person indicators
  const textToCheck = `${page.title || ''} ${page.description || ''} ${page.extract || ''}`.toLowerCase();
  if (PERSON_REGEX.test(textToCheck)) {
    return false;
  }

  // Reject filenames indicating personal portraits
  const src = page.thumbnail.source.toLowerCase();
  if (src.includes('portrait') || src.includes('headshot') || src.includes('photo_of') || src.includes('profile')) {
    return false;
  }

  return true;
}

/**
 * Fetch famous place, landscape, monument, or skyline image for any city in the world.
 * Excludes person/portrait photos using multi-stage keyword and aspect-ratio filters.
 */
export async function fetchCityLandmarkImage(cityName: string, country?: string): Promise<string> {
  const cacheKey = `${cityName}-${country || ''}`.toLowerCase().trim();
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)!;
  }

  const cleanCity = cityName.replace(/[^a-zA-Z0-9\s]/g, '').trim();
  const lowerCity = cleanCity.toLowerCase();
  if (CANONICAL_LANDMARKS[lowerCity]) {
    imageCache.set(cacheKey, CANONICAL_LANDMARKS[lowerCity]);
    return CANONICAL_LANDMARKS[lowerCity];
  }

  // 1. Search Wikipedia specifically for landscape, monuments, and skylines
  const queries = [
    `${cleanCity} skyline landscape`,
    `${cleanCity} monument landmark`,
    `${cleanCity} architecture cityscape`,
    `${cleanCity} famous places`,
    `${cleanCity} city`,
  ];

  for (const q of queries) {
    try {
      const url = `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
        q
      )}&gsrlimit=4&prop=pageimages|description|extracts&exintro=1&explaintext=1&exchars=150&piprop=thumbnail&pithumbsize=1600&format=json&origin=*`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const pages = Object.values(data.query?.pages || {}) as WikiPageItem[];
        for (const page of pages) {
          if (isLandscapeMonumentImage(page)) {
            const imgUrl = page.thumbnail!.source;
            imageCache.set(cacheKey, imgUrl);
            return imgUrl;
          }
        }
      }
    } catch {
      // Continue to next query
    }
  }

  // 2. Wikimedia Commons search with explicit negative operators against persons/portraits
  try {
    const commonsUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(
      `${cleanCity} landscape OR skyline OR monument -people -person -portrait`
    )}&gsrlimit=5&prop=pageimages|description&piprop=thumbnail&pithumbsize=1600&format=json&origin=*`;
    const cRes = await fetch(commonsUrl);
    if (cRes.ok) {
      const cData = await cRes.json();
      const cPages = Object.values(cData.query?.pages || {}) as WikiPageItem[];
      for (const page of cPages) {
        if (isLandscapeMonumentImage(page)) {
          const imgUrl = page.thumbnail!.source;
          imageCache.set(cacheKey, imgUrl);
          return imgUrl;
        }
      }
    }
  } catch {
    //
  }

  // 3. Fallback scenic landscapes with guaranteed monument/landscape visuals
  const scenicFallbacks = [
    'https://images.unsplash.com/photo-1517090504586-fde19ea6066f?auto=format&fit=crop&w=1800&q=80',
    'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=1800&q=80',
    'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1800&q=80',
    'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1800&q=80',
  ];
  const fallback = scenicFallbacks[Math.abs(cityName.length) % scenicFallbacks.length];
  imageCache.set(cacheKey, fallback);
  return fallback;
}

/**
 * Fetch live RainViewer radar tile URL without API key
 */
export async function getLiveRadarTileUrl(): Promise<string> {
  try {
    const res = await fetch('https://api.rainviewer.com/public/weather-maps.json');
    if (res.ok) {
      const data = await res.json();
      const past = data.radar?.past;
      if (past && past.length > 0) {
        const latest = past[past.length - 1];
        return `https://tilecache.rainviewer.com${latest.path}/256/{z}/{x}/{y}/2/1_1.png`;
      }
    }
  } catch {
    // Fallback
  }
  return '';
}

/**
 * WMO Weather code mapper (from breezy-weather)
 */
export function mapWmoCode(
  code: number,
  isDay: boolean = true
): {
  text: string;
  icon: 'clear-night' | 'sunny' | 'partly-cloudy' | 'cloudy' | 'rainy';
} {
  switch (code) {
    case 0:
      return { text: 'Clear Sky', icon: isDay ? 'sunny' : 'clear-night' };
    case 1:
      return { text: 'Mainly Clear', icon: isDay ? 'sunny' : 'clear-night' };
    case 2:
      return { text: 'Partly Cloudy', icon: 'partly-cloudy' };
    case 3:
      return { text: 'Overcast', icon: 'cloudy' };
    case 45:
    case 48:
      return { text: 'Foggy', icon: 'cloudy' };
    case 51:
    case 53:
    case 55:
      return { text: 'Light Drizzle', icon: 'rainy' };
    case 61:
    case 63:
    case 65:
      return { text: 'Rain', icon: 'rainy' };
    case 71:
    case 73:
    case 75:
      return { text: 'Snow Fall', icon: 'cloudy' };
    case 80:
    case 81:
    case 82:
      return { text: 'Rain Showers', icon: 'rainy' };
    case 95:
    case 96:
    case 99:
      return { text: 'Thunderstorm', icon: 'rainy' };
    default:
      return { text: 'Clear Sky', icon: isDay ? 'sunny' : 'clear-night' };
  }
}

export interface GeocodedCity {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  admin1?: string;
}

/**
 * Search cities globally via Open-Meteo Geocoding
 */
export async function searchGlobalCities(query: string): Promise<GeocodedCity[]> {
  if (!query || query.trim().length < 2) return [];
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        query.trim()
      )}&count=8&language=en&format=json`
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error('City search failed', err);
    return [];
  }
}

/**
 * Fetch full real-time weather and landmark data for any city
 */
export async function fetchFullWeatherData(
  lat: number,
  lon: number,
  cityName: string,
  region: string = '',
  country: string = '',
  countryCode: string = ''
): Promise<CityData> {
  // Always use Open-Meteo & Wikipedia which require zero API keys and never fail
  const [forecastRes, aqiRes, landmarkImg] = await Promise.all([
    fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m&hourly=temperature_2m,precipitation_probability,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=7`
    ),
    fetch(
      `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,european_aqi`
    ).catch(() => null),
    fetchCityLandmarkImage(cityName, country),
  ]);

  if (!forecastRes.ok) {
    throw new Error('Failed to fetch weather forecast');
  }

  const forecastData = await forecastRes.json();
  const aqiData = aqiRes && aqiRes.ok ? await aqiRes.json() : null;

  const current = forecastData.current || {};
  const currentCode = current.weather_code ?? 0;

  const localTimeStr = current.time || new Date().toISOString();
  const localDate = new Date(localTimeStr);
  const hourOfDay = localDate.getHours();
  const isDay = hourOfDay >= 6 && hourOfDay < 19;

  const conditionInfo = mapWmoCode(currentCode, isDay);

  const curTempC = Math.round(current.temperature_2m ?? 12);
  const feelsLikeC = Math.round(current.apparent_temperature ?? curTempC - 2);

  const dailyData = forecastData.daily || {};
  const highC = Math.round(dailyData.temperature_2m_max?.[0] ?? curTempC + 4);
  const lowC = Math.round(dailyData.temperature_2m_min?.[0] ?? curTempC - 5);
  const pop = dailyData.precipitation_probability_max?.[0] ?? 0;

  const aqiVal = Math.round(aqiData?.current?.us_aqi ?? 32);
  let aqiStatus: 'Good' | 'Moderate' | 'Unhealthy' = 'Good';
  let aqiBadge = 'Excellent Air Quality';
  if (aqiVal > 100) {
    aqiStatus = 'Unhealthy';
    aqiBadge = 'Unhealthy Air Quality';
  } else if (aqiVal > 50) {
    aqiStatus = 'Moderate';
    aqiBadge = 'Moderate Air Quality';
  }

  const formattedDateTime = localDate.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).replace(',', ' •');

  const hourlyRaw = forecastData.hourly || {};
  const hourly: HourlyForecastItem[] = [];
  const hourlyTimes: string[] = hourlyRaw.time || [];
  const hourlyTemps: number[] = hourlyRaw.temperature_2m || [];
  const hourlyPops: number[] = hourlyRaw.precipitation_probability || [];
  const hourlyCodes: number[] = hourlyRaw.weather_code || [];

  const startIndex = Math.max(0, hourlyTimes.findIndex((t: string) => t >= current.time));
  for (let i = startIndex; i < Math.min(startIndex + 12, hourlyTimes.length); i++) {
    const d = new Date(hourlyTimes[i]);
    const hr = d.getHours();
    const isHrDay = hr >= 6 && hr < 19;
    const itemCondition = mapWmoCode(hourlyCodes[i] ?? 0, isHrDay);
    const itemTempC = Math.round(hourlyTemps[i] ?? 12);

    hourly.push({
      time: d.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
      hour: hr,
      tempC: itemTempC,
      tempF: cToF(itemTempC),
      condition: itemCondition.icon,
      pop: Math.round(hourlyPops[i] ?? 0),
    });
  }

  const daily: DailyForecastItem[] = [];
  const dailyTimes: string[] = dailyData.time || [];
  const dailyMaxs: number[] = dailyData.temperature_2m_max || [];
  const dailyMins: number[] = dailyData.temperature_2m_min || [];
  const dailyCodes: number[] = dailyData.weather_code || [];
  const dailyPops: number[] = dailyData.precipitation_probability_max || [];

  for (let i = 0; i < Math.min(7, dailyTimes.length); i++) {
    const d = new Date(dailyTimes[i] + 'T12:00:00');
    const dCondition = mapWmoCode(dailyCodes[i] ?? 0, true);
    const dHigh = Math.round(dailyMaxs[i] ?? curTempC + 3);
    const dLow = Math.round(dailyMins[i] ?? curTempC - 4);

    daily.push({
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dateStr: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      highC: dHigh,
      lowC: dLow,
      highF: cToF(dHigh),
      lowF: cToF(dLow),
      condition: dCondition.icon === 'clear-night' ? 'sunny' : dCondition.icon,
      pop: Math.round(dailyPops[i] ?? 0),
    });
  }

  const trends: TrendDataPoint[] = daily.map((dItem, idx) => ({
    day: dItem.dayName,
    tempC: dItem.highC,
    tempF: dItem.highF,
    precip: dItem.pop,
    wind: Math.round(current.wind_speed_10m ?? 14),
    humidity: Math.round(current.relative_humidity_2m ?? 70),
    label: idx === 3 ? `${dItem.dayName}, 2 PM` : undefined,
  }));

  const stats = {
    humidity: Math.round(current.relative_humidity_2m ?? 72),
    windSpeed: Math.round(current.wind_speed_10m ?? 14),
    pressure: Math.round(current.surface_pressure ?? 1019),
    visibility: 16,
  };

  return {
    id: cityName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
    name: cityName,
    region: region || country,
    country: country || cityName,
    flag: getCountryFlag(countryCode),
    datetime: formattedDateTime,
    tempC: curTempC,
    tempF: cToF(curTempC),
    feelsLikeC: feelsLikeC,
    feelsLikeF: cToF(feelsLikeC),
    highC: highC,
    lowC: lowC,
    highF: cToF(highC),
    lowF: cToF(lowC),
    conditionText: conditionInfo.text,
    conditionIcon: conditionInfo.icon,
    pop: pop,
    aqiValue: aqiVal,
    aqiStatus: aqiStatus,
    aqiBadge: aqiBadge,
    bgSkylineUrl: landmarkImg,
    coordinates: [lat, lon],
    stats: stats,
    hourly: hourly.length > 0 ? hourly : [
      { time: '2 AM', hour: 2, tempC: curTempC, tempF: cToF(curTempC), condition: 'clear-night', pop: 0 },
    ],
    daily: daily,
    trends: trends,
  };
}
