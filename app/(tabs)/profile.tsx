import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    const SettingItem = ({ icon, title, value, type = 'chevron', color = '#555' }: any) => (
        <TouchableOpacity className="flex-row items-center justify-between p-4 border-b border-[#F5F5F5]" activeOpacity={0.7}>
            <View className="flex-row items-center">
                <View style={{ backgroundColor: color + '15' }} className="w-10 h-10 rounded-xl justify-center items-center mr-[15px]">
                    <Ionicons name={icon} size={22} color={color} />
                </View>
                <Text className="text-[15px] text-[#333] font-semibold">{title}</Text>
            </View>
            {type === 'switch' ? (
                <Switch
                    value={value}
                    onValueChange={(val) => {
                        if (title.includes('ବାର୍ତ୍ତା')) setNotifications(val);
                        if (title.includes('ଡାର୍କ ମୋଡ୍')) setDarkMode(val);
                    }}
                    trackColor={{ false: '#EEE', true: '#FF8C00' }}
                    thumbColor={value ? '#FF4500' : '#f4f3f4'}
                />
            ) : (
                <Ionicons name="chevron-forward" size={18} color="#CCC" />
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-[#F0F7FF]">
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Profile Hero */}
                <LinearGradient colors={['#FF8C00', '#FF4500']} className="pt-[30px] pb-10 rounded-b-[40px] items-center">
                    <View className="items-center">
                        <View className="relative mb-[15px]">
                            <View className="w-[100px] h-[100px] rounded-full bg-white/30 border-2 border-white justify-center items-center">
                                <Text className="text-white text-4xl font-bold">UU</Text>
                            </View>
                            <TouchableOpacity className="absolute bottom-[5px] right-[5px] bg-[#FF4500] w-[30px] h-[30px] rounded-full justify-center items-center border-2 border-white">
                                <Ionicons name="camera" size={16} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                        <Text className="text-[22px] font-bold text-white mb-1">ଉତ୍କଳ ଉଦୟ ବ୍ୟବହାରକାରୀ</Text>
                        <Text className="text-sm text-white/80 font-medium">ID: UU-2026-001</Text>
                    </View>
                </LinearGradient>

                <View className="px-5 pt-5">
                    {/* Impact Card */}
                    <View className="bg-white rounded-[25px] mb-[25px] shadow-lg shadow-black/10 elevation-5">
                        <View className="flex-row p-5 justify-around items-center rounded-[25px] overflow-hidden">
                            <View className="items-center">
                                <Text className="text-xl font-bold text-[#1A1A1A]">୧୨.୫ କେଜି</Text>
                                <Text className="text-[10px] color-[#666] mt-1 font-semibold">CO2 ବଞ୍ଚାଗଲା</Text>
                            </View>
                            <View className="w-[1px] h-[30px] bg-[#EEE]" />
                            <View className="items-center">
                                <Text className="text-xl font-bold text-[#1A1A1A]">୪</Text>
                                <Text className="text-[10px] color-[#666] mt-1 font-semibold">ପଦକ ଜିତିଛନ୍ତି</Text>
                            </View>
                        </View>
                    </View>

                    {/* Badges Section */}
                    <View className="mb-[25px]">
                        <Text className="text-base font-bold text-[#333] mb-3 ml-[5px]">ମୋର ପଦକ (My Badges)</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2.5">
                            {[
                                { name: 'ପ୍ରକୃତି ବନ୍ଧୁ', icon: 'leaf', color: '#4CAF50' },
                                { name: 'ସ୍ୱଚ୍ଛ ରନ୍ଧନ', icon: 'flame', color: '#FF8C00' },
                                { name: 'ସଚେତନ କୃଷକ', icon: 'school', color: '#0288D1' },
                                { name: 'ପରିବେଶ ରକ୍ଷକ', icon: 'shield', color: '#D81B60' },
                            ].map((badge, idx) => (
                                <View key={idx} className="items-center mr-5">
                                    <View style={{ backgroundColor: badge.color + '20' }} className="w-[60px] h-[60px] rounded-full justify-center items-center mb-2">
                                        <Ionicons name={badge.icon as any} size={28} color={badge.color} />
                                    </View>
                                    <Text className="text-[11px] font-bold text-[#444]">{badge.name}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Preferences Section */}
                    <View className="mb-[25px]">
                        <Text className="text-base font-bold text-[#333] mb-3 ml-[5px]">ଆଭିମୁଖ୍ୟ ଓ ନୀତି (Preferences)</Text>
                        <View className="bg-white rounded-[25px] shadow-sm shadow-black/10 elevation-4">
                            <View className="rounded-[25px] overflow-hidden">
                                <SettingItem icon="notifications-outline" title="ବାର୍ତ୍ତା (Notifications)" type="switch" value={notifications} color="#FF4500" />
                                <SettingItem icon="moon-outline" title="ଡାର୍କ ମୋଡ୍ (Dark Mode)" type="switch" value={darkMode} color="#5E35B1" />
                                <SettingItem icon="language-outline" title="ଭାଷା (Language)" color="#00897B" />
                            </View>
                        </View>
                    </View>

                    <View className="mt-2.5 rounded-[20px] shadow-sm shadow-black/10 elevation-2">
                        <TouchableOpacity className="rounded-[20px] overflow-hidden" activeOpacity={0.8}>
                            <View className="flex-row items-center justify-center py-4 bg-white">
                                <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
                                <Text className="text-[#FF3B30] font-bold text-base ml-2.5">ଲଗ୍ ଆଉଟ୍</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <Text className="text-center text-[#AAA] text-[12px] mt-[30px] mb-10">ସଂସ୍କରଣ (Version) 1.0.0</Text>
                    <View className="h-[100px]" />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
