import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useProfile } from '../context/ProfileContext';

interface Props {
    size?: number;
    style?: StyleProp<ViewStyle>;
    borderColor?: string;
}

export default function HeaderProfileAvatar({
    size = 38,
    style,
    borderColor = 'rgba(255, 255, 255, 0.85)',
}: Props) {
    const router = useRouter();
    const { profile } = useProfile();

    const handlePress = () => {
        router.push('/(tabs)/profile');
    };

    const initials = profile?.initials || 'UU';

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={handlePress}
            accessibilityLabel="Go to profile"
            accessibilityRole="button"
            style={[
                styles.container,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    borderColor,
                },
                style,
            ]}
        >
            {profile?.profileImageUri ? (
                <Image
                    source={{ uri: profile.profileImageUri }}
                    style={{ width: '100%', height: '100%' }}
                    contentFit="cover"
                    transition={200}
                />
            ) : (
                <LinearGradient
                    colors={['#FF7A00', '#FF3D00']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={[styles.gradient, { width: '100%', height: '100%' }]}
                >
                    <Text
                        style={[
                            styles.initialsText,
                            { fontSize: Math.round(size * 0.38) },
                        ]}
                    >
                        {initials}
                    </Text>
                </LinearGradient>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 2,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        backgroundColor: '#FF5722',
    },
    gradient: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    initialsText: {
        color: '#FFFFFF',
        fontWeight: '800',
        letterSpacing: 0.5,
    },
});
