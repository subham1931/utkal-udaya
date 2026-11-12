import * as Location from 'expo-location';
import { Platform } from 'react-native';
import { registerForPushNotifications } from './notifications';

/**
 * Ask for notification + location access used by weather and news alerts.
 * Safe to call on every cold start; OS only re-prompts when status is undetermined.
 */
export async function requestLaunchPermissions(): Promise<void> {
  try {
    await registerForPushNotifications();
  } catch (error) {
    console.warn('Notification permission request failed:', error);
  }

  try {
    if (Platform.OS === 'web') {
      // Browser will prompt via geolocation when weather fetch runs.
      return;
    }
    await Location.requestForegroundPermissionsAsync();
  } catch (error) {
    console.warn('Location permission request failed:', error);
  }
}
