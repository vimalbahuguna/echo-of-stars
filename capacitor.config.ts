import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.echoofstars.app',
  appName: 'Echo of Stars',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
