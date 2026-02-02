import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface AuthHeaderProps {
    title: string;
    subtitle?: string;
    onBack?: () => void;
    showBackButton?: boolean;
}

const HIT_SLOP = { top: 12, bottom: 12, left: 12, right: 12 };

export default function AuthHeader({ title, subtitle, onBack, showBackButton = true }: AuthHeaderProps) {
    const router = useRouter();
    const handleBack = onBack ?? (() => router.back());

    return (
        <View className="mb-6">
            {showBackButton && (
                <TouchableOpacity
                    onPress={handleBack}
                    hitSlop={HIT_SLOP}
                    activeOpacity={0.7}
                    className="w-10 h-10 bg-gray-50 rounded-full justify-center items-center mb-5 border border-gray-100"
                    style={{ minWidth: 44, minHeight: 44 }}
                >
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
            )}
            <Text className="text-3xl font-bold text-[#333] mb-2" maxFontSizeMultiplier={1.3}>
                {title}
            </Text>
            {subtitle && (
                <Text className="text-gray-400 text-base font-medium leading-6" maxFontSizeMultiplier={1.3}>
                    {subtitle}
                </Text>
            )}
        </View>
    );
}
