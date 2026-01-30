import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useProfile } from '../../context/ProfileContext';

export default function SignUpScreen() {
    const router = useRouter();
    const { updateProfile } = useProfile();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async () => {
        // Demo registration logic
        // Save the new user details
        await updateProfile({
            name: name,
            email: email,
            id: 'UU-' + Math.floor(Math.random() * 10000) // Generate random ID for demo
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
                    <View className="mt-6 mb-8">
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="w-10 h-10 bg-gray-50 rounded-full justify-center items-center mb-6 border border-gray-100"
                        >
                            <Ionicons name="arrow-back" size={24} color="#333" />
                        </TouchableOpacity>
                        <Text className="text-3xl font-bold text-[#333] mb-2">Create Account</Text>
                        <Text className="text-gray-400 text-base font-medium">Join us and start your journey for a cleaner future.</Text>
                    </View>

                    {/* Form */}
                    <View className="space-y-5">

                        {/* Full Name */}
                        <View>
                            <Text className="text-gray-600 font-bold mb-3 ml-1">Full Name</Text>
                            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5">
                                <Ionicons name="person-outline" size={20} color="#9CA3AF" className="mr-3" />
                                <TextInput
                                    className="flex-1 text-[#333] text-base font-medium"
                                    placeholder="Enter your full name"
                                    placeholderTextColor="#9CA3AF"
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>
                        </View>

                        {/* Email/Phone */}
                        <View>
                            <Text className="text-gray-600 font-bold mb-3 ml-1">Email or Phone</Text>
                            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5">
                                <Ionicons name="mail-outline" size={20} color="#9CA3AF" className="mr-3" />
                                <TextInput
                                    className="flex-1 text-[#333] text-base font-medium"
                                    placeholder="Enter email or phone number"
                                    placeholderTextColor="#9CA3AF"
                                    value={email}
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        {/* Password */}
                        <View>
                            <Text className="text-gray-600 font-bold mb-3 ml-1">Password</Text>
                            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5">
                                <Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" className="mr-3" />
                                <TextInput
                                    className="flex-1 text-[#333] text-base font-medium"
                                    placeholder="Create a password"
                                    placeholderTextColor="#9CA3AF"
                                    secureTextEntry
                                    value={password}
                                    onChangeText={setPassword}
                                />
                            </View>
                        </View>

                        {/* Confirm Password */}
                        <View>
                            <Text className="text-gray-600 font-bold mb-3 ml-1">Confirm Password</Text>
                            <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5">
                                <Ionicons name="shield-checkmark-outline" size={20} color="#9CA3AF" className="mr-3" />
                                <TextInput
                                    className="flex-1 text-[#333] text-base font-medium"
                                    placeholder="Confirm your password"
                                    placeholderTextColor="#9CA3AF"
                                    secureTextEntry
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                />
                            </View>
                        </View>

                        <View className="flex-row items-start mt-2">
                            <Ionicons name="checkbox" size={20} color="#FF5722" className="mt-[2px] mr-2" />
                            <Text className="text-gray-500 text-sm leading-5 flex-1">
                                By registering, you agree to our <Text className="text-[#FF5722] font-bold">Terms of Service</Text> and <Text className="text-[#FF5722] font-bold">Privacy Policy</Text>.
                            </Text>
                        </View>

                        {/* Sign Up Button */}
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={handleRegister}
                            className="shadow-lg shadow-orange-200 mt-4"
                        >
                            <LinearGradient
                                colors={['#FF8C00', '#FF5722']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                className="py-4 rounded-2xl items-center"
                            >
                                <Text className="text-white text-lg font-bold">Create Account</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                    </View>

                    {/* Footer */}
                    <View className="flex-row justify-center mt-auto py-8">
                        <Text className="text-gray-500 font-medium">Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/sign-in')}>
                            <Text className="text-[#FF5722] font-bold">Login</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
