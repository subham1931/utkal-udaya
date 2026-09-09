import AsyncStorage from '@react-native-async-storage/async-storage';
import { colorScheme as nwColorScheme } from 'nativewind';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import { Colors } from '../constants/theme';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeContextType {
    theme: 'light' | 'dark';
    themeMode: ThemeMode;
    isDark: boolean;
    setThemeMode: (mode: ThemeMode) => Promise<void>;
    toggleTheme: () => Promise<void>;
    colors: typeof Colors.light;
}

const THEME_STORAGE_KEY = 'utkal_udaya_theme_mode';

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
    const systemColorScheme = useRNColorScheme();
    const [themeMode, setThemeModeState] = useState<ThemeMode>('light');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        loadStoredTheme();
    }, []);

    const loadStoredTheme = async () => {
        try {
            const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            if (saved === 'dark' || saved === 'light' || saved === 'system') {
                setThemeModeState(saved);
                syncNativeWind(saved);
            } else {
                syncNativeWind('light');
            }
        } catch (e) {
            console.error('Failed to load theme mode', e);
        } finally {
            setIsLoaded(true);
        }
    };

    const syncNativeWind = (mode: ThemeMode) => {
        try {
            if (mode === 'system') {
                nwColorScheme.set('system');
            } else {
                nwColorScheme.set(mode);
            }
        } catch {
            // NativeWind colorScheme might not be initialized yet
        }
    };

    const setThemeMode = async (mode: ThemeMode) => {
        try {
            setThemeModeState(mode);
            syncNativeWind(mode);
            await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
        } catch (e) {
            console.error('Failed to save theme mode', e);
        }
    };

    const toggleTheme = async () => {
        const next = resolvedTheme === 'dark' ? 'light' : 'dark';
        await setThemeMode(next);
    };

    const resolvedTheme: 'light' | 'dark' =
        themeMode === 'system'
            ? (systemColorScheme === 'dark' ? 'dark' : 'light')
            : themeMode;

    const isDark = resolvedTheme === 'dark';
    const activeColors = isDark ? Colors.dark : Colors.light;

    const value = React.useMemo(() => ({
        theme: resolvedTheme,
        themeMode,
        isDark,
        setThemeMode,
        toggleTheme,
        colors: activeColors,
    }), [resolvedTheme, themeMode, isDark, activeColors]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useAppTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useAppTheme must be used within an AppThemeProvider');
    }
    return context;
}
