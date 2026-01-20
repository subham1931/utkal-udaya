import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

export default function CookstoveScreen() {
    const { t } = useLanguage();
    const [serialNo, setSerialNo] = useState('');
    const [aadhaarNo, setAadhaarNo] = useState('');

    return (
        <SafeAreaView className="flex-1 bg-[#F0F7FF]">
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Hero Header */}
                    <LinearGradient colors={['#FF8C00', '#FF4500']} className="p-6 pb-[60px] rounded-b-[30px]">
                        <Text className="text-[32px] font-bold text-white">{t.cookstove.title}</Text>
                        <Text className="text-base text-white/90 mt-1">{t.cookstove.subtitle}</Text>
                    </LinearGradient>

                    <View className="p-5 -mt-10">
                        <LinearGradient
                            colors={['#4CAF50', '#2E7D32']}
                            className="flex-row justify-between items-center p-6 rounded-[25px] mb-[15px] elevation-10 shadow-black shadow-offset-[0px,5px] shadow-opacity-20 shadow-radius-10"
                        >
                            <View>
                                <Text className="text-white/80 text-[15px] font-semibold">{t.cookstove.co2Saved}</Text>
                                <Text className="text-white text-[32px] font-bold">12.5 {t.common.kg}</Text>
                            </View>
                            <Ionicons name="leaf-outline" size={50} color="rgba(255,255,255,0.4)" />
                        </LinearGradient>

                        <View className="flex-row justify-between">
                            <View className="bg-white w-[48%] p-[18px] rounded-[20px] elevation-4 shadow-black shadow-offset-[0px,2px] shadow-opacity-10 shadow-radius-5">
                                <Text className="text-[#888] text-[13px] mb-[5px] font-semibold">{t.cookstove.status}</Text>
                                <Text className="text-[#1A1A1A] text-xl font-bold">{t.common.active}</Text>
                            </View>
                            <View className="bg-white w-[48%] p-[18px] rounded-[20px] elevation-4 shadow-black shadow-offset-[0px,2px] shadow-opacity-10 shadow-radius-5">
                                <Text className="text-[#888] text-[13px] mb-[5px] font-semibold">{t.cookstove.usageTime}</Text>
                                <Text className="text-[#1A1A1A] text-xl font-bold">24 {t.cookstove.hours}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Village Leaderboard Snippet */}
                    <View className="bg-white mx-5 p-5 rounded-[25px] elevation-4 shadow-black shadow-offset-[0px,2px] shadow-opacity-10 shadow-radius-5 mb-5">
                        <View className="flex-row items-center mb-[15px]">
                            <Ionicons name="trophy-outline" size={20} color="#FFD700" />
                            <Text className="text-[14px] font-bold text-[#444] ml-2">{t.cookstove.villageRank}</Text>
                        </View>
                        <View className="flex-row justify-between items-center bg-[#F8F9FA] p-3 rounded-[15px]">
                            <Text className="text-lg font-bold text-[#FF8C00]"># 8</Text>
                            <Text className="text-[14px] text-[#333] font-semibold">{t.cookstove.yourPosition}</Text>
                            <Text className="text-[12px] text-[#2E7D32] font-bold">125 {t.common.carbonPoints}</Text>
                        </View>
                    </View>

                    {/* Maintenance Checklist */}
                    <View className="px-5 mb-5">
                        <Text className="text-base font-bold text-[#333] mb-3">{t.cookstove.maintenance}</Text>
                        <View className="bg-white rounded-[25px] p-5 elevation-4 shadow-black shadow-offset-[0px,2px] shadow-opacity-10 shadow-radius-5">
                            {t.cookstove.tasks.map((task: string, idx: number) => (
                                <View key={idx} className="flex-row items-center mb-3">
                                    <View className={`w-6 h-6 rounded-full justify-center items-center mr-3 ${idx < 2 ? 'bg-[#4CAF50]' : 'bg-[#E0E0E0]'}`}>
                                        <Ionicons name={idx < 2 ? "checkmark" : "time-outline"} size={14} color="#FFF" />
                                    </View>
                                    <Text className={`text-[14px] font-medium ${idx < 2 ? 'text-[#333]' : 'text-[#888]'}`}>{task}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Callback Section */}
                    <View className="bg-white m-5 p-6 rounded-[25px] elevation-8 shadow-black shadow-offset-[0px,4px] shadow-opacity-10 shadow-radius-10">
                        <View className="flex-row items-center mb-[15px]">
                            <View className="w-11 h-11 rounded-full bg-[#FFF5F0] justify-center items-center mr-[15px]">
                                <Ionicons name="call-outline" size={24} color="#FF4500" />
                            </View>
                            <Text className="flex-1 text-lg font-bold text-[#333] leading-6">
                                {t.cookstove.supportTitle}
                            </Text>
                        </View>

                        <Text className="text-[14px] text-[#666] leading-5 mb-[25px]">
                            {t.cookstove.supportDesc}
                        </Text>

                        <View className="mb-[18px]">
                            <Text className="text-[13px] font-bold text-[#555] mb-2 ml-1">{t.cookstove.serialNo} (Serial No.)</Text>
                            <View className="flex-row items-center bg-[#F8F9FA] rounded-[15px] border border-[#EDEFEF] px-[15px]">
                                <Ionicons name="barcode-outline" size={20} color="#666" className="mr-2.5" />
                                <TextInput
                                    className="flex-1 h-[50px] text-[#333] text-[15px]"
                                    placeholder="Enter Serial Number"
                                    value={serialNo}
                                    onChangeText={setSerialNo}
                                    placeholderTextColor="#999"
                                />
                            </View>
                        </View>

                        <View className="mb-[18px]">
                            <Text className="text-[13px] font-bold text-[#555] mb-2 ml-1">{t.cookstove.aadhaarNo} (Aadhaar No.)</Text>
                            <View className="flex-row items-center bg-[#F8F9FA] rounded-[15px] border border-[#EDEFEF] px-[15px]">
                                <Ionicons name="card-outline" size={20} color="#666" className="mr-2.5" />
                                <TextInput
                                    className="flex-1 h-[50px] text-[#333] text-[15px]"
                                    placeholder="xxxx xxxx xxxx"
                                    value={aadhaarNo}
                                    onChangeText={setAadhaarNo}
                                    keyboardType="numeric"
                                    placeholderTextColor="#999"
                                    maxLength={14}
                                />
                            </View>
                        </View>

                        <TouchableOpacity activeOpacity={0.8} className="mt-2.5 h-[55px] rounded-[15px] overflow-hidden">
                            <LinearGradient
                                colors={['#4CAF50', '#388E3C']}
                                className="flex-1 flex-row items-center justify-center"
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Text className="text-white text-base font-bold">{t.cookstove.requestCallback}</Text>
                                <Ionicons name="paper-plane" size={18} color="#FFF" className="ml-2.5" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    <View className="h-[100px]" />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
