import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ke.co.ngindawarriorsfc.app',
  appName: 'Nginda Warriors FC',
  webDir: 'public',
  server: {
    url: process.env.CAPACITOR_SERVER_URL || 'https://nginda-warriors-fc-c549.vercel.app',
    cleartext: false,
    androidScheme: 'https',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2500,
      launchAutoHide: true,
      backgroundColor: '#08783E',
      androidSplashResourceName: 'splash',
      androidScaleType: 'CENTER_CROP',
      showSpinner: true,
      spinnerColor: '#F5D000',
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert'],
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#08783E',
    },
  },
};

export default config;
