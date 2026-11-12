const fs = require('fs');
const path = require('path');

// Load local .env into process.env when Expo hasn't already (EAS secrets still win).
try {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq <= 0) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (key && process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  }
} catch {
  // ignore missing/unreadable .env
}

/** @type {import('expo/config').ExpoConfig} */
const config = {
  name: 'Utkal Udaya',
  slug: 'utkal-uday',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'utkaludaya',
  userInterfaceStyle: 'automatic',
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.meensou.utkaludaya',
    infoPlist: {
      NSLocationWhenInUseUsageDescription:
        'Allow Utkal Udaya to use your location to show local weather.',
    },
  },
  android: {
    package: 'com.meensou.utkaludaya',
    versionCode: 1,
    adaptiveIcon: {
      backgroundColor: '#E3F2FD',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    [
      'expo-router',
      {
        asyncRoutes: {
          web: false,
        },
      },
    ],
    [
      'expo-audio',
      {
        microphonePermission: false,
        recordAudioAndroid: false,
        enableBackgroundPlayback: false,
        enableBackgroundRecording: false,
      },
    ],
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#000000',
        dark: {
          backgroundColor: '#000000',
        },
      },
    ],
    'expo-font',
    'expo-image',
    'expo-asset',
    [
      'expo-location',
      {
        locationWhenInUsePermission:
          'Allow Utkal Udaya to use your location to show local weather.',
      },
    ],
    [
      'expo-notifications',
      {
        icon: './assets/images/icon.png',
        color: '#FF8C00',
        defaultChannel: 'news',
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission:
          'Allow Utkal Udaya to access your photos to update your profile picture.',
        cameraPermission:
          'Allow Utkal Udaya to use the camera to take a profile picture.',
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    playStoreUrl: process.env.EXPO_PUBLIC_PLAY_STORE_URL ?? '',
    apiBaseUrl:
      process.env.EXPO_PUBLIC_API_BASE_URL ??
      'https://meensou.com/myclimate/app/beneficiary/api/utkal_api.php',
    eas: {
      projectId:
        process.env.EAS_PROJECT_ID || '7c641fa8-82ce-4ee2-9a3d-c99e59f50bca',
    },
  },
};

module.exports = { expo: config };
