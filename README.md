# 🌫️ Foggy Weather

> A sleek, responsive, real-time global weather dashboard with live interactive map and landmark imagery.

🌐 **Live Website:** [https://harrykalsi24.github.io/foggy-weather/](https://harrykalsi24.github.io/foggy-weather/)  
📱 **Android APK:** Available via [GitHub Releases](https://github.com/Harrykalsi24/foggy-weather/releases) / Actions Artifacts

---

## ✨ Features

- **Iconic City Imagery**: Automatically fetches high-resolution photos of famous landmarks and skylines (Toronto skyline, Times Square NYC, Eiffel Tower, Tokyo skyline, etc.) for any city in the world via Wikipedia API.
- **Real-Time Weather Pipeline**: Powered by Open-Meteo & OpenWeatherMap APIs with complete hourly forecast, 7-day outlook, air quality index, and quick telemetry stats.
- **Interactive Global Map**: Full Leaflet map with pure OpenStreetMap tiles supporting zoom levels 2–19 without limits or API keys. Click anywhere on the map to pin and fetch real-time weather.
- **Responsive Adaptive Design**: Pixel-perfect layout across desktop widescreen and mobile devices (with iOS status bar, bottom quick stats, and navigation).
- **Dark & Light Mode**: Sleek dark midnight theme and daylight theme with seamless high-contrast transitions.
- **Android APK**: Packaged natively via Capacitor.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4
- **Mobile**: Capacitor Android
- **Maps**: Leaflet + OpenStreetMap
- **APIs**: Open-Meteo, OpenWeatherMap, Wikipedia REST API
- **Icons**: Lucide React

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Build production bundle
npm run build
```

---

## 📱 Android APK Build

```bash
# Build web assets and sync to native Android project
npm run build
npx cap sync android

# Open in Android Studio or build via Gradle
cd android
./gradlew assembleDebug
```
The generated APK will be at `android/app/build/outputs/apk/debug/app-debug.apk`.
