import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar style="dark" />
            <View className="flex-1 justify-between pb-10">

                {/* Top Graphics (Placeholder for now) */}
                <View className="items-center mt-20">
                    <View className="w-[80%] aspect-square bg-orange-100 rounded-full justify-center items-center overflow-hidden mb-10 shadow-lg shadow-orange-200">
                        {/* You can replace this with an actual Image component later */}
                        <LinearGradient
                            colors={['#FF8C00', '#FF5722']}
                            className="w-[200px] h-[200px] rounded-full opacity-80"
                        />
                        <Text className="absolute text-8xl">☀️</Text>
                    </View>

                    <Text className="text-4xl font-extrabold text-[#333] text-center mb-2 tracking-tight">
                        Utkal <Text className="text-[#FF5722]">Udaya</Text>
                    </Text>
                    <Text className="text-base text-gray-500 text-center px-10 font-medium leading-6">
                        Empowering rural communities with sustainable energy and smart monitoring.
                    </Text>
                </View>

                {/* Action Buttons */}
                <View className="px-8 space-y-4">
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => router.push('/(auth)/sign-in')}
                        className="w-full shadow-lg shadow-orange-300 transform active:scale-95 transition-all"
                    >
                        <LinearGradient
                            colors={['#FF8C00', '#FF4500']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            className="py-4 rounded-2xl items-center"
                        >
                            <Text className="text-white text-lg font-bold tracking-wide">Get Started</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <View className="flex-row justify-center mt-6">
                        <Text className="text-gray-500 font-medium">Already have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/sign-in')}>
                            <Text className="text-[#FF5722] font-bold">Log In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}
