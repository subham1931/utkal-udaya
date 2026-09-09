import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { useAppTheme } from '@/context/ThemeContext';

export default function TabLayout() {
  const { isDark } = useAppTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FF4500',
        tabBarInactiveTintColor: isDark ? '#64748B' : '#888',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          marginBottom: 0,
        },
        tabBarStyle: {
          backgroundColor: isDark ? '#0F172A' : '#1A1A1A',
          borderTopWidth: isDark ? 1 : 0,
          borderTopColor: isDark ? '#1E293B' : 'transparent',
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -5 },
          shadowOpacity: isDark ? 0.5 : 0.3,
          shadowRadius: 10,
          height: 80, // Slightly taller to cover safe area + labels comfortably
          paddingBottom: 25, // Specifically clear the home indicator
          paddingTop: 12,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
          position: 'absolute', // This helps align with the bottom edge
          bottom: 0,
          left: 0,
          right: 0,
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="home-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'News',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="newspaper-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="cookstove"
        options={{
          title: 'Cookstove',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="flame-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="person-outline" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
