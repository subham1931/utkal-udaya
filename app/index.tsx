import { Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useProfile } from '../context/ProfileContext';

export default function Index() {
    const { isLoggedIn, isLoading } = useProfile();

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
                <ActivityIndicator size="large" color="#FF5722" />
            </View>
        );
    }

    if (isLoggedIn) {
        return <Redirect href="/(tabs)/home" />;
    }

    return <Redirect href="/(auth)/welcome" />;
}
