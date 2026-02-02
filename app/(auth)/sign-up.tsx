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

const MIN_PASSWORD_LENGTH = 8;

function validateEmailOrPhone(value: string): boolean {
    if (!value.trim()) return false;
    if (value.includes('@')) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
    }
    return /^[0-9]{10,14}$/.test(value.replace(/\s/g, ''));
}

export default function SignUpScreen() {
    const router = useRouter();
    const { updateProfile } = useProfile();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [errors, setErrors] = useState<{
        name?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
        terms?: string;
    }>({});

    const validate = () => {
        const newErrors: typeof errors = {};

        if (!name.trim()) {
            newErrors.name = 'Name is required';
        } else if (name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!email.trim()) {
            newErrors.email = 'Email or phone is required';
        } else if (!validateEmailOrPhone(email)) {
            newErrors.email = 'Enter a valid email or 10–14 digit phone number';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < MIN_PASSWORD_LENGTH) {
            newErrors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!agreedToTerms) {
            newErrors.terms = 'Please agree to the Terms and Privacy Policy';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async () => {
        if (!validate()) return;

        setIsLoading(true);
        try {
            await updateProfile({
                name: name.trim(),
                email: email.trim(),
                id: 'UU-' + Math.floor(Math.random() * 10000),
            });
            router.replace('/(tabs)/home');
        } catch (error) {
            setErrors({ ...errors, email: 'Something went wrong. Please try again.' });
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
                        title="Create Account"
                        subtitle="Join us and start your journey for a cleaner future."
                    />

                    <AuthInput
                        label="Full Name"
                        placeholder="Enter your full name"
                        value={name}
                        onChangeText={(text) => {
                            setName(text);
                            if (errors.name) setErrors({ ...errors, name: undefined });
                        }}
                        icon="person-outline"
                        error={errors.name}
                    />

                    <AuthInput
                        label="Email or Phone"
                        placeholder="Enter email or phone number"
                        value={email}
                        onChangeText={(text) => {
                            setEmail(text);
                            if (errors.email) setErrors({ ...errors, email: undefined });
                        }}
                        icon="mail-outline"
                        error={errors.email}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <AuthInput
                        label="Password"
                        placeholder="Create a password (min 8 characters)"
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            if (errors.password) setErrors({ ...errors, password: undefined });
                            if (confirmPassword && text !== confirmPassword) {
                                setErrors((e) => ({ ...e, confirmPassword: 'Passwords do not match' }));
                            } else if (errors.confirmPassword) {
                                setErrors({ ...errors, confirmPassword: undefined });
                            }
                        }}
                        icon="lock-closed-outline"
                        error={errors.password}
                        secureTextEntry
                    />

                    <AuthInput
                        label="Confirm Password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChangeText={(text) => {
                            setConfirmPassword(text);
                            if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: undefined });
                        }}
                        icon="shield-checkmark-outline"
                        error={errors.confirmPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => {
                            setAgreedToTerms(!agreedToTerms);
                            if (errors.terms) setErrors({ ...errors, terms: undefined });
                        }}
                        className="flex-row items-start mt-1 mb-4"
                        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    >
                        <Ionicons
                            name={agreedToTerms ? 'checkbox' : 'checkbox-outline'}
                            size={22}
                            color={agreedToTerms ? '#FF5722' : '#9CA3AF'}
                            style={{ marginRight: 10, marginTop: 2 }}
                        />
                        <Text className="text-gray-500 text-sm leading-5 flex-1" maxFontSizeMultiplier={1.3}>
                            By registering, you agree to our{' '}
                            <Text className="text-[#FF5722] font-bold">Terms of Service</Text> and{' '}
                            <Text className="text-[#FF5722] font-bold">Privacy Policy</Text>.
                        </Text>
                    </TouchableOpacity>
                    {errors.terms && (
                        <Text className="text-red-500 text-sm font-medium mb-2 ml-1" maxFontSizeMultiplier={1.3}>
                            {errors.terms}
                        </Text>
                    )}

                    <AuthButton
                        title="Create Account"
                        onPress={handleRegister}
                        variant="primary"
                        loading={isLoading}
                        disabled={isLoading}
                    />

                    <View className="flex-row justify-center items-center flex-wrap mt-8">
                        <Text className="text-gray-500 font-medium" maxFontSizeMultiplier={1.3}>
                            Already have an account?{' '}
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.push('/(auth)/sign-in')}
                            activeOpacity={0.7}
                            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                        >
                            <Text className="text-[#FF5722] font-bold" maxFontSizeMultiplier={1.3}>
                                Login
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
