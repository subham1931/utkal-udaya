import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Dimensions, Platform, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AuthButton from '../../components/auth/AuthButton';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const IS_SMALL_DEVICE = SCREEN_HEIGHT < 700;

const HERO_CIRCLE_STYLE = {
    minHeight: 160,
    maxHeight: 220,
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
};

export default function WelcomeScreen() {
    const router = useRouter();

    const bottomPadding = Platform.OS === 'android' ? 48 : 24;

    return (
        <SafeAreaView className="flex-1 bg-white" edges={['top', 'bottom']}>
            <StatusBar style="dark" />
            <View className="flex-1 px-6" style={{ paddingBottom: bottomPadding }}>
                {/* Hero Section */}
                <View
                    className="items-center flex-1 justify-center"
                    style={{
                        marginTop: IS_SMALL_DEVICE ? 16 : 40,
                        marginBottom: IS_SMALL_DEVICE ? 16 : 24,
                    }}
                >
                    <View
                        className="w-[75%] max-w-[280px] aspect-square rounded-full justify-center items-center overflow-hidden mb-6"
                        style={[HERO_CIRCLE_STYLE, { backgroundColor: '#FF8C00' }]}
                    >
                        <LinearGradient
                            colors={['#FF8C00', '#FF5722']}
                            className="w-full h-full rounded-full justify-center items-center"
                            style={{ opacity: 1 }}
                        >
                            <Text className="text-7xl" style={{ fontSize: 68 }}>
                                🔥
                            </Text>
                        </LinearGradient>
                    </View>

                    <Text
                        className="text-[#333] text-center font-extrabold tracking-tight mb-2"
                        style={{ fontSize: IS_SMALL_DEVICE ? 28 : 36 }}
                        maxFontSizeMultiplier={1.3}
                    >
                        Prathamesh <Text className="text-[#FF5722]">Cookstove</Text>
                    </Text>
                    <Text
                        className="text-gray-500 text-center font-medium leading-6 px-4"
                        style={{ fontSize: IS_SMALL_DEVICE ? 14 : 16 }}
                        maxFontSizeMultiplier={1.3}
                    >
                        Empowering beneficiaries with clean cooking solutions. Track your impact, access support, and lead a healthier life.
                    </Text>
                </View>

                {/* CTA Section - separate Views to prevent Android overlap */}
                <View style={{ paddingTop: 24, paddingBottom: 16 }}>
                    <AuthButton
                        title="Get Started"
                        onPress={() => router.push('/(auth)/sign-up')}
                        variant="primary"
                    />
                </View>
                <View
                    className="flex-row justify-center items-center flex-wrap bg-white"
                    style={{ paddingVertical: 16 }}
                >
                    <Text className="text-gray-500 font-medium" maxFontSizeMultiplier={1.3}>
                        Already have an account?{' '}
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.push('/(auth)/sign-in')}
                        activeOpacity={0.7}
                        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    >
                        <Text className="text-[#FF5722] font-bold" maxFontSizeMultiplier={1.3}>
                            Log In
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
