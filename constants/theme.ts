/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#FF4500';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#1E293B',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
    background: '#F0F7FF',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    cardBorder: '#F1F5F9',
    divider: '#F1F5F9',
    inputBg: '#F8FAFC',
    inputBorder: '#E2E8F0',
    tint: tintColorLight,
    icon: '#64748B',
    tabBar: '#1A1A1A',
    tabIconDefault: '#888888',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    background: '#0B0F19',
    surface: '#1E293B',
    card: '#1E293B',
    cardBorder: '#334155',
    divider: '#334155',
    inputBg: '#0F172A',
    inputBorder: '#334155',
    tint: tintColorLight,
    icon: '#94A3B8',
    tabBar: '#0B1120',
    tabIconDefault: '#64748B',
    tabIconSelected: tintColorLight,
  },
};


export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
