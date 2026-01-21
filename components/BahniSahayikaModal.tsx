import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated, Easing, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import * as Haptics from 'expo-haptics';
import { Audio } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../context/LanguageContext';

const { width, height } = Dimensions.get('window');

interface Props {
    isVisible: boolean;
    onClose: () => void;
}

export default function BahniSahayikaModal({ isVisible, onClose }: Props) {
    const { t, language } = useLanguage();
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [statusText, setStatusText] = useState(t.sahayika.tapToSpeak);
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        setupAudio();
    }, []);

    const setupAudio = async () => {
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
    };

    useEffect(() => {
        if (isVisible) {
            // Small delay to let the modal open smoothly before speaking
            setTimeout(() => {
                speakMessage(t.sahayika.greeting);
            }, 500);
            startPulse();
        } else {
            Speech.stop();
            setIsSpeaking(false);
        }
    }, [isVisible]);

    const startPulse = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.2,
                    duration: 1500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1500,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    const speakMessage = async (text: string) => {
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
    };

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
                        <Animated.View
                            style={{
                                transform: [{ scale: pulseAnim }],
                                opacity: isSpeaking || isListening ? 1 : 0.3
                            }}
                            className="absolute w-40 h-40 rounded-full border-2 border-[#FF4500]/50"
                        />
                        <Animated.View
                            style={{
                                transform: [{ scale: Animated.add(pulseAnim, 0.2) }],
                                opacity: isSpeaking || isListening ? 0.5 : 0.1
                            }}
                            className="absolute w-48 h-48 rounded-full border border-[#FF4500]/30"
                        />

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
