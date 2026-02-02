import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';

type AuthButtonVariant = 'primary' | 'secondary' | 'outline';

interface AuthButtonProps {
    title: string;
    onPress: () => void;
    variant?: AuthButtonVariant;
    loading?: boolean;
    disabled?: boolean;
    icon?: keyof typeof Ionicons.glyphMap;
}

const HIT_SLOP = { top: 12, bottom: 12, left: 12, right: 12 };
const BUTTON_HEIGHT = 54;
// iOS requires backgroundColor for shadow to render; use gradient start color
const PRIMARY_BUTTON_SHADOW = {
    width: '100%' as const,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    backgroundColor: '#FF8C00', // Required for iOS shadow; gradient covers it
};

export default function AuthButton({
    title,
    onPress,
    variant = 'primary',
    loading = false,
    disabled = false,
    icon,
}: AuthButtonProps) {
    const isDisabled = disabled || loading;

    if (variant === 'primary') {
        return (
            <TouchableOpacity
                onPress={onPress}
                disabled={isDisabled}
                activeOpacity={0.8}
                hitSlop={HIT_SLOP}
                style={[PRIMARY_BUTTON_SHADOW, isDisabled && { backgroundColor: '#9CA3AF' }]}
            >
                <LinearGradient
                    colors={isDisabled ? ['#D1D5DB', '#9CA3AF'] : ['#FF8C00', '#FF5722']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    className="rounded-[16px] items-center justify-center flex-row"
                    style={{ minHeight: BUTTON_HEIGHT, paddingVertical: 16, width: '100%' }}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" size="small" />
                    ) : (
                        <>
                            {icon && (
                                <Ionicons name={icon} size={20} color="#FFF" style={{ marginRight: 8 }} />
                            )}
                            <Text
                                className="text-white text-lg font-bold tracking-wide text-center"
                                maxFontSizeMultiplier={1.3}
                            >
                                {title}
                            </Text>
                        </>
                    )}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    if (variant === 'outline') {
        return (
            <TouchableOpacity
                onPress={onPress}
                disabled={isDisabled}
                activeOpacity={0.8}
                hitSlop={HIT_SLOP}
                className="w-full border-2 border-[#FF5722] rounded-2xl items-center justify-center flex-row"
                style={{ minHeight: BUTTON_HEIGHT, paddingVertical: 16 }}
            >
                {loading ? (
                    <ActivityIndicator color="#FF5722" size="small" />
                ) : (
                    <Text
                        className="text-[#FF5722] text-lg font-bold"
                        maxFontSizeMultiplier={1.3}
                    >
                        {title}
                    </Text>
                )}
            </TouchableOpacity>
        );
    }

    // secondary - text style
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.7}
            hitSlop={HIT_SLOP}
            style={{ minHeight: 44, justifyContent: 'center', alignItems: 'center' }}
        >
            <Text
                className="text-[#FF5722] font-bold text-base"
                maxFontSizeMultiplier={1.3}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );
}
