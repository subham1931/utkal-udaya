import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
// import { useColorScheme } from '@/hooks/use-color-scheme'; // Unused

export default function TabLayout() {
  // const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FF4500',
        tabBarInactiveTintColor: '#888',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '500',
          marginBottom: 0,
        },
        tabBarStyle: {
          backgroundColor: '#1A1A1A',
          borderTopWidth: 0,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -5 },
          shadowOpacity: 0.3,
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
          href: null,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Ionicons size={24} name="settings-outline" color={color} />,
        }}
      />
    </Tabs>
  );
}
