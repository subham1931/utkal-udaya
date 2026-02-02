import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AuthButton from '../../components/auth/AuthButton';
import AuthHeader from '../../components/auth/AuthHeader';
import AuthInput from '../../components/auth/AuthInput';
import { useProfile } from '../../context/ProfileContext';

function validateEmailOrPhone(value: string): boolean {
    if (!value.trim()) return false;
    if (value.includes('@')) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    }
    return /^[0-9]{10,14}$/.test(value.replace(/\s/g, ''));
}

export default function SignInScreen() {
    const router = useRouter();
    const { updateProfile } = useProfile();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [errors, setErrors] = useState<{
        email?: string;
        password?: string;
    }>({});

    const validate = () => {
        const newErrors: typeof errors = {};

        if (!phoneNumber.trim()) {
            newErrors.email = 'Email or phone is required';
        } else if (!validateEmailOrPhone(phoneNumber)) {
            newErrors.email = 'Enter a valid email or 10–14 digit phone number';
        }

        if (!password.trim()) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSignIn = async () => {
        if (!validate()) return;

        setIsLoading(true);
        try {
            const isEmail = phoneNumber.includes('@');
            await updateProfile({
                email: isEmail ? phoneNumber : undefined,
                phone: !isEmail ? phoneNumber : undefined,
                name: isEmail ? phoneNumber.split('@')[0] : 'User ' + phoneNumber,
            });
            router.replace('/(tabs)/home');
        } catch (error) {
            setErrors({ ...errors, password: 'Something went wrong. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const keyboardBehavior = Platform.OS === 'ios' ? 'padding' : 'height';
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 0 : 20;

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
            <StatusBar style="dark" />
            <KeyboardAvoidingView
                behavior={keyboardBehavior}
                className="flex-1"
                keyboardVerticalOffset={keyboardVerticalOffset}
            >
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingHorizontal: 24,
                        paddingTop: 14,
                        paddingBottom: 32,
                    }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <AuthHeader
                        title="Let's Sign you in."
                        subtitle="Welcome Back. You've been missed!"
                    />

                    <AuthInput
                        label="Phone Number / Email"
                        placeholder="Enter your email or phone"
                        value={phoneNumber}
                        onChangeText={(text) => {
                            setPhoneNumber(text);
                            if (errors.email) setErrors({ ...errors, email: undefined });
                        }}
                        icon="mail-outline"
                        error={errors.email}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <AuthInput
                        label="Password"
                        placeholder="Enter your password"
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            if (errors.password) setErrors({ ...errors, password: undefined });
                        }}
                        icon="lock-closed-outline"
                        error={errors.password}
                        secureTextEntry
                        showPasswordToggle
                        isPasswordVisible={showPassword}
                        onTogglePasswordVisibility={() => setShowPassword(!showPassword)}
                    />

                    <TouchableOpacity
                        className="items-end mb-4"
                        activeOpacity={0.7}
                        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    >
                        <Text className="text-[#FF5722] font-bold text-sm" maxFontSizeMultiplier={1.3}>
                            Forgot Password?
                        </Text>
                    </TouchableOpacity>

                    <AuthButton
                        title="Sign In"
                        onPress={handleSignIn}
                        variant="primary"
                        loading={isLoading}
                        disabled={isLoading}
                    />

                    <View className="flex-row items-center my-6">
                        <View className="flex-1 h-[1px] bg-gray-200" />
                        <Text className="mx-4 text-gray-400 font-medium text-sm" maxFontSizeMultiplier={1.3}>
                            Or continue with
                        </Text>
                        <View className="flex-1 h-[1px] bg-gray-200" />
                    </View>

                    <View className="flex-row justify-center gap-5">
                        <TouchableOpacity
                            activeOpacity={0.7}
                            disabled
                            className="w-14 h-14 bg-white border border-gray-200 rounded-2xl justify-center items-center"
                            style={{ minWidth: 56, minHeight: 56 }}
                        >
                            <Ionicons name="logo-google" size={26} color="#EA4335" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            disabled
                            className="w-14 h-14 bg-white border border-gray-200 rounded-2xl justify-center items-center"
                            style={{ minWidth: 56, minHeight: 56 }}
                        >
                            <Ionicons name="logo-apple" size={26} color="#000" />
                        </TouchableOpacity>
                    </View>

                    <View className="flex-row justify-center items-center flex-wrap mt-8">
                        <Text className="text-gray-500 font-medium" maxFontSizeMultiplier={1.3}>
                            Don't have an account?{' '}
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push('/(auth)/sign-up')}
                            activeOpacity={0.7}
                            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                        >
                            <Text className="text-[#FF5722] font-bold" maxFontSizeMultiplier={1.3}>
                                Register
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
