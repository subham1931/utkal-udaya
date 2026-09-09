import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LogBox } from 'react-native';
import 'react-native-reanimated';
import { LanguageProvider } from '../context/LanguageContext';
import { ProfileProvider } from '../context/ProfileContext';
import { AppThemeProvider, useAppTheme } from '../context/ThemeContext';
import "../global.css";

// Ignore SafeAreaView deprecation warning - we're already using react-native-safe-area-context
LogBox.ignoreLogs(['SafeAreaView has been deprecated']);

export const unstable_settings = {
  initialRouteName: 'index',
};

function RootLayoutNav() {
  const { isDark } = useAppTheme();

  return (
    <ThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Stack
        initialRouteName="index"
        screenOptions={{
          headerBackTitle: 'Back',
          headerBackButtonDisplayMode: 'minimal',
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/welcome" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/sign-in" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)/sign-up" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false, title: 'Back' }} />
        <Stack.Screen name="learn/[id]" options={{ presentation: 'card', headerBackTitle: 'Back' }} />
        <Stack.Screen name="learn/story/[storyId]" options={{ presentation: 'card', title: 'News', headerBackTitle: 'Back' }} />
        <Stack.Screen name="weather-detail" options={{ presentation: 'card', headerShown: false }} />
        <Stack.Screen name="notifications" options={{ presentation: 'card', headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style={isDark ? 'light' : 'dark'} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppThemeProvider>
      <LanguageProvider>
        <ProfileProvider>
          <RootLayoutNav />
        </ProfileProvider>
      </LanguageProvider>
    </AppThemeProvider>
  );
}
