import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.foggy.weather',
  appName: 'Foggy',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;

