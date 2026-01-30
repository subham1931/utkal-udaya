import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LogBox } from 'react-native';
import 'react-native-reanimated';
import { LanguageProvider } from '../context/LanguageContext';
import { ProfileProvider } from '../context/ProfileContext';
import "../global.css";

// Ignore SafeAreaView deprecation warning - we're already using react-native-safe-area-context
LogBox.ignoreLogs(['SafeAreaView has been deprecated']);

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <LanguageProvider>
      <ProfileProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack initialRouteName="index">
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/welcome" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/sign-in" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/sign-up" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="learn/[id]" options={{ presentation: 'card' }} />
            <Stack.Screen name="learn/story/[storyId]" options={{ presentation: 'card', title: 'News' }} />
            <Stack.Screen name="weather-detail" options={{ presentation: 'card', headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </ProfileProvider>
    </LanguageProvider>
  );
}
