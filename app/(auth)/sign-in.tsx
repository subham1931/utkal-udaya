import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useProfile } from '../../context/ProfileContext';

export default function SignInScreen() {
    const router = useRouter();
    const { updateProfile } = useProfile();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleValidation = async () => {
        // Await profile update before navigating
        // We are checking if it looks like an email or phone for better data integrity, 
        // but for now we will just save it to 'email' field or 'phone' based on simple check.
        const isEmail = phoneNumber.includes('@');
        await updateProfile({
            email: isEmail ? phoneNumber : undefined,
            phone: !isEmail ? phoneNumber : undefined,
            name: isEmail ? phoneNumber.split('@')[0] : 'User ' + phoneNumber // Temporary name derivation
        });

        router.replace('/(tabs)/home');
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar style="dark" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false} className="px-6">

                    {/* Header */}
                    <View className="mt-10 mb-12">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="w-10 h-10 bg-gray-50 rounded-full justify-center items-center mb-6 border border-gray-100"
                        >
                            <Ionicons name="arrow-back" size={24} color="#333" />
                        </TouchableOpacity>
                        <Text className="text-3xl font-bold text-[#333] mb-2">Let&apos;s Sign you in.</Text>
                        <Text className="text-2xl font-bold text-[#333]">Welcome Back.</Text>
                        <Text className="text-gray-400 mt-2 text-base font-medium">You&apos;ve been missed!</Text>
                    </View>

                    {/* Form */}
                    <View className="space-y-6">
                        {/* Phone Input */}
                        <View>
                            <Text className="text-gray-600 font-bold mb-3 ml-1">Phone Number / Email</Text>
                            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 focus:border-[#FF5722] focus:bg-white transition-all">
                                <Ionicons name="mail-outline" size={20} color="#9CA3AF" className="mr-3" />
                                <TextInput
                                    className="flex-1 text-[#333] text-base font-medium"
                                    placeholder="Enter your email or phone"
                                    placeholderTextColor="#9CA3AF"
                                    value={phoneNumber}
                                    onChangeText={setPhoneNumber}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        {/* Password Input */}
                        <View>
                            <Text className="text-gray-600 font-bold mb-3 ml-1">Password</Text>
                            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 focus:border-[#FF5722] focus:bg-white transition-all">
                                <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" className="mr-3" />
                                <TextInput
                                    className="flex-1 text-[#333] text-base font-medium"
                                    placeholder="Enter your password"
                                    placeholderTextColor="#9CA3AF"
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={setPassword}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                    <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#9CA3AF" />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Forgot Password */}
                        <TouchableOpacity className="items-end">
                            <Text className="text-[#FF5722] font-bold text-sm">Forgot Password?</Text>
                        </TouchableOpacity>

                        {/* Sign In Button */}
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={handleValidation}
                            className="shadow-lg shadow-orange-200 mt-4"
                        >
                            <LinearGradient
                                colors={['#FF8C00', '#FF5722']} // Orange gradient
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                className="py-4 rounded-2xl items-center"
                            >
                                <Text className="text-white text-lg font-bold">Sign In</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Divider */}
                        <View className="flex-row items-center my-6">
                            <View className="flex-1 h-[1px] bg-gray-200" />
                            <Text className="mx-4 text-gray-400 font-medium">Or continue with</Text>
                            <View className="flex-1 h-[1px] bg-gray-200" />
                        </View>

                        {/* Social Login (Mock) */}
                        <View className="flex-row justify-center space-x-6 gap-5">
                            <TouchableOpacity className="w-16 h-16 bg-white border border-gray-200 rounded-2xl justify-center items-center shadow-sm">
                                <Ionicons name="logo-google" size={28} color="#EA4335" />
                            </TouchableOpacity>
                            <TouchableOpacity className="w-16 h-16 bg-white border border-gray-200 rounded-2xl justify-center items-center shadow-sm">
                                <Ionicons name="logo-apple" size={28} color="#000" />
                            </TouchableOpacity>
                        </View>

                    </View>

                    {/* Footer */}
                    <View className="flex-row justify-center mt-auto py-8">
                        <Text className="text-gray-500 font-medium">Don&apos;t have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/sign-up')}>
                            <Text className="text-[#FF5722] font-bold">Register</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
