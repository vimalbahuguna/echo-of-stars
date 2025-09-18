import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.721d6be9c13c40b2b6c00d47ae060ee7',
  appName: 'echo-of-stars',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    url: 'https://721d6be9-c13c-40b2-b6c0-0d47ae060ee7.lovableproject.com?forceHideBadge=true',
    cleartext: true
  }
};

export default config;