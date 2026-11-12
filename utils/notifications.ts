import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const ENABLED_KEY = 'utkal_notifications_enabled';
const PUSH_TOKEN_KEY = 'utkal_expo_push_token';
const LAST_NEWS_IDS_KEY = 'utkal_last_notified_news_ids';
const NEWS_CHANNEL_ID = 'news';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function areNotificationsEnabled(): Promise<boolean> {
  const value = await AsyncStorage.getItem(ENABLED_KEY);
  // Default ON until the user turns them off in Settings.
  return value !== 'false';
}

export async function setNotificationsEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(ENABLED_KEY, enabled ? 'true' : 'false');
  if (!enabled) {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }
}

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(NEWS_CHANNEL_ID, {
    name: 'News & weather',
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF8C00',
  });
}

export async function registerForPushNotifications(): Promise<string | null> {
  if (Platform.OS === 'web') return null;

  await ensureAndroidChannel();

  if (!Device.isDevice) {
    // Simulators can still show local notifications; skip remote token.
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted' ? 'simulator-local' : null;
  }

  const existing = await Notifications.getPermissionsAsync();
  let status = existing.status;
  if (status !== 'granted') {
    const requested = await Notifications.requestPermissionsAsync();
    status = requested.status;
  }
  if (status !== 'granted') return null;

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;

  if (!projectId) {
    // Local notifications still work; remote Expo push needs `eas init`.
    return 'local-only';
  }

  try {
    const token = (
      await Notifications.getExpoPushTokenAsync({ projectId })
    ).data;
    await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);
    return token;
  } catch (error) {
    console.warn('Expo push token registration failed:', error);
    return 'local-only';
  }
}

export async function notifyNewNewsArticles(
  articles: Array<{ id: string; title: string }>
): Promise<void> {
  if (Platform.OS === 'web' || articles.length === 0) return;
  if (!(await areNotificationsEnabled())) return;

  const permission = await Notifications.getPermissionsAsync();
  if (permission.status !== 'granted') return;

  const previousRaw = await AsyncStorage.getItem(LAST_NEWS_IDS_KEY);
  const previousIds: string[] = previousRaw ? JSON.parse(previousRaw) : [];
  const currentIds = articles.map((a) => a.id).filter(Boolean);

  // First successful fetch: seed IDs quietly so we don't spam on install.
  if (previousIds.length === 0) {
    await AsyncStorage.setItem(LAST_NEWS_IDS_KEY, JSON.stringify(currentIds.slice(0, 20)));
    return;
  }

  const previousSet = new Set(previousIds);
  const fresh = articles.filter((a) => a.id && !previousSet.has(a.id));
  if (fresh.length === 0) {
    await AsyncStorage.setItem(LAST_NEWS_IDS_KEY, JSON.stringify(currentIds.slice(0, 20)));
    return;
  }

  const top = fresh[0];
  const extra = fresh.length - 1;
  const body =
    extra > 0
      ? `${top.title}\n+${extra} more agriculture update${extra === 1 ? '' : 's'}`
      : top.title;

  await ensureAndroidChannel();
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Utkal Udaya — New news',
      body,
      data: { type: 'news', id: top.id },
      sound: true,
      ...(Platform.OS === 'android' ? { channelId: NEWS_CHANNEL_ID } : {}),
    },
    trigger: null,
  });

  await AsyncStorage.setItem(LAST_NEWS_IDS_KEY, JSON.stringify(currentIds.slice(0, 20)));
}
