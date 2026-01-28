import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import * as Speech from 'expo-speech';
import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions, Modal, Text, TouchableOpacity, View } from 'react-native';
import Animated, { Easing as ReanimatedEasing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { useLanguage } from '../context/LanguageContext';

const { width } = Dimensions.get('window');

interface Props {
    isVisible: boolean;
    onClose: () => void;
}

export default function BahniSahayikaModal({ isVisible, onClose }: Props) {
    const { t, language } = useLanguage();
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [statusText, setStatusText] = useState(t.sahayika.tapToSpeak);

    // Modern Reanimated pulse
    const pulse = useSharedValue(1);

    const setupAudio = useCallback(async () => {
        try {
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                playsInSilentModeIOS: true,
                staysActiveInBackground: false,
                shouldDuckAndroid: true,
            });
        } catch (e) {
            console.log('Audio mode error:', e);
        }
    }, []);

    const speakMessage = useCallback(async (text: string) => {
        const isSpeechSupported = await Speech.isSpeakingAsync();
        if (isSpeechSupported) {
            await Speech.stop();
        }

        setIsSpeaking(true);
        setStatusText(text);

        const speechOptions = {
            language: language === 'or' ? 'hi-IN' : 'en-US',
            pitch: 1.0,
            rate: 0.9,
            onDone: () => setIsSpeaking(false),
            onError: (err: any) => {
                console.log('Speech Error:', err);
                setIsSpeaking(false);
            },
        };

        Speech.speak(text, speechOptions);
    }, [language]);

    useEffect(() => {
        setupAudio();
    }, [setupAudio]);

    useEffect(() => {
        if (isVisible) {
            // Start pulse
            pulse.value = withRepeat(
                withTiming(1.2, {
                    duration: 1500,
                    easing: ReanimatedEasing.inOut(ReanimatedEasing.ease),
                }),
                -1,
                true
            );

            // Small delay to let the modal open smoothly before speaking
            setTimeout(() => {
                speakMessage(t.sahayika.greeting);
            }, 500);
        } else {
            Speech.stop();
            setIsSpeaking(false);
            pulse.value = 1; // Reset pulse
        }
    }, [isVisible, pulse, speakMessage, t.sahayika.greeting]);

    const innerPulseStyle = useAnimatedStyle(() => ({
        position: 'absolute',
        width: 160,
        height: 160,
        borderRadius: 80,
        borderWidth: 2,
        borderColor: 'rgba(255, 69, 0, 0.5)',
        transform: [{ scale: pulse.value }],
        opacity: isSpeaking || isListening ? 1 : 0.3
    }));

    const outerPulseStyle = useAnimatedStyle(() => ({
        position: 'absolute',
        width: 192,
        height: 192,
        borderRadius: 96,
        borderWidth: 1,
        borderColor: 'rgba(255, 69, 0, 0.3)',
        transform: [{ scale: pulse.value + 0.2 }],
        opacity: isSpeaking || isListening ? 0.5 : 0.1
    }));


    const handleMicPress = () => {
        if (isSpeaking) {
            Speech.stop();
            setIsSpeaking(false);
            return;
        }

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setIsListening(true);
        setStatusText(t.sahayika.listening);

        // Simulate STT delay
        setTimeout(() => {
            setIsListening(false);
            // Simulate hearing "maintenance"
            handleResponse('maintenance');
        }, 3000);
    };

    const handleResponse = (type: 'maintenance' | 'benefits' | 'usage') => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        const response = t.sahayika.responses[type];
        speakMessage(response);
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center">
                <BlurView intensity={80} tint="dark" className="absolute inset-0" />

                <View className="w-[90%] bg-white/10 rounded-[40px] p-8 items-center border border-white/20">
                    <TouchableOpacity
                        onPress={onClose}
                        className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/20 justify-center items-center"
                    >
                        <Ionicons name="close" size={24} color="#FFF" />
                    </TouchableOpacity>

                    <View className="items-center mb-8">
                        <View className="w-16 h-16 rounded-full bg-[#FF4500] items-center justify-center mb-4">
                            <Ionicons name="sparkles" size={32} color="#FFF" />
                        </View>
                        <Text className="text-2xl font-bold text-white tracking-wider">{t.sahayika.title}</Text>
                    </View>

                    {/* Visualization */}
                    <View className="relative justify-center items-center h-[200px] mb-8">
                        <Animated.View style={innerPulseStyle} />
                        <Animated.View style={outerPulseStyle} />

                        <TouchableOpacity
                            onPress={handleMicPress}
                            activeOpacity={0.8}
                            className={`w-32 h-32 rounded-full justify-center items-center shadow-2xl elevation-10 ${isListening ? 'bg-[#FF4500]' : 'bg-white/10'}`}
                        >
                            <LinearGradient
                                colors={isListening ? ['#FF4500', '#FF8C00'] : ['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
                                className="w-full h-full rounded-full justify-center items-center"
                            >
                                <Ionicons
                                    name={isSpeaking ? "volume-high" : isListening ? "mic" : "mic-outline"}
                                    size={48}
                                    color={isListening || isSpeaking ? "#FFF" : "#FF4500"}
                                />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    <View className="items-center mb-10 px-4">
                        <Text className="text-white text-center text-lg font-medium leading-7">
                            {statusText}
                        </Text>
                    </View>

                    {/* Suggestion Chips */}
                    <View className="flex-row flex-wrap justify-center">
                        {[
                            { id: 'maintenance', label: language === 'or' ? 'ଚୁଲିର ଯତ୍ନ' : 'Maintenance' },
                            { id: 'benefits', label: language === 'or' ? 'ଚୁଲିର ଲାଭ' : 'Benefits' },
                            { id: 'usage', label: language === 'or' ? 'ବ୍ୟବହାର ବିଧି' : 'How to Use' },
                        ].map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => handleResponse(item.id as any)}
                                className="bg-white/20 px-5 py-3 rounded-full m-2 border border-white/10"
                            >
                                <Text className="text-white font-bold">{item.label}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
        </Modal>
    );
}
