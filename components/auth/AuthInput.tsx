import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

interface AuthInputProps {
    label: string;
    placeholder: string;
    value: string;
    onChangeText: (text: string) => void;
    icon: keyof typeof Ionicons.glyphMap;
    error?: string;
    secureTextEntry?: boolean;
    keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    maxLength?: number;
    showPasswordToggle?: boolean;
    isPasswordVisible?: boolean;
    onTogglePasswordVisibility?: () => void;
}

const HIT_SLOP = { top: 12, bottom: 12, left: 12, right: 12 };

export default function AuthInput({
    label,
    placeholder,
    value,
    onChangeText,
    icon,
    error,
    secureTextEntry = false,
    keyboardType = 'default',
    autoCapitalize = 'sentences',
    maxLength,
    showPasswordToggle = false,
    isPasswordVisible = false,
    onTogglePasswordVisibility,
}: AuthInputProps) {
    const isMasked = showPasswordToggle ? !isPasswordVisible : secureTextEntry;
    const borderColor = error ? 'border-red-400' : 'border-gray-200';
    const bgColor = error ? 'bg-red-50/50' : 'bg-gray-50';

    return (
        <View className="mb-5">
            <Text className="text-gray-600 font-bold mb-2 ml-1" maxFontSizeMultiplier={1.3}>
                {label}
            </Text>
            <View
                className={`flex-row items-center rounded-2xl px-4 border ${borderColor} ${bgColor}`}
                style={{
                    minHeight: 52,
                    paddingVertical: 14,
                }}
            >
                <Ionicons
                    name={icon}
                    size={20}
                    color={error ? '#EF4444' : '#9CA3AF'}
                    style={{ marginRight: 12 }}
                />
                <TextInput
                    className="flex-1 text-[#333] text-base font-medium"
                    placeholder={placeholder}
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onChangeText={onChangeText}
                    secureTextEntry={isMasked}
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    maxLength={maxLength}
                    editable={true}
                    accessibilityLabel={label}
                    accessibilityHint={placeholder}
                />
                {showPasswordToggle && (
                    <TouchableOpacity
                        onPress={onTogglePasswordVisibility}
                        hitSlop={HIT_SLOP}
                        activeOpacity={0.7}
                        style={{ minWidth: 44, minHeight: 44, justifyContent: 'center', alignItems: 'center' }}
                    >
                        <Ionicons
                            name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'}
                            size={20}
                            color="#9CA3AF"
                        />
                    </TouchableOpacity>
                )}
            </View>
            {error && (
                <Text className="text-red-500 text-sm font-medium mt-1.5 ml-1" maxFontSizeMultiplier={1.3}>
                    {error}
                </Text>
            )}
        </View>
    );
}
