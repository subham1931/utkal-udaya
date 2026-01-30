import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Linking, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../../context/LanguageContext';

import { useProfile } from '../../context/ProfileContext';

export default function SettingsScreen() {
    const router = useRouter();
    const { t, language, setLanguage } = useLanguage();
    const { profile, logout } = useProfile();

    const SettingItem = ({ icon, title, subtitle, onPress, color = '#555', rightElement }: any) => (
        <TouchableOpacity
            className="flex-row items-center justify-between p-4 border-b border-[#F5F5F5]"
            activeOpacity={0.7}
            onPress={onPress}
            disabled={!onPress}
        >
            <View className="flex-row items-center flex-1">
                <View
                    style={{ backgroundColor: color + '15' }}
                    className="w-10 h-10 rounded-xl justify-center items-center mr-[15px]"
                >
                    <Ionicons name={icon} size={22} color={color} />
                </View>
                <View className="flex-1">
                    <Text className="text-[15px] font-bold text-[#333]">{title}</Text>
                    {subtitle && <Text className="text-[11px] text-[#999] mt-0.5">{subtitle}</Text>}
                </View>
            </View>
            {rightElement ? rightElement : <Ionicons name="chevron-forward" size={18} color="#CCC" />}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-[#F0F7FF]">
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <LinearGradient
                    colors={['#FF8C00', '#FF4500']}
                    className="p-6 pb-10 rounded-b-[30px]"
                >
                    <Text className="text-[28px] font-bold text-white">{t.settings.title}</Text>
                    <Text className="text-sm text-white/80 mt-1">{t.settings.legalSupport}</Text>
                </LinearGradient>

                <View className="p-5">
                    {/* Profile Section */}
                    <View className="mb-[25px] -mt-5">
                        <View className="bg-white p-5 rounded-[25px] flex-row items-center elevation-4 shadow-black shadow-offset-[0px,4px] shadow-opacity-10 shadow-radius-10">
                            <View className="w-16 h-16 bg-[#FFF3E0] rounded-full justify-center items-center mr-4 border-2 border-white shadow-sm">
                                <Ionicons name="person" size={30} color="#FF6B00" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-xl font-bold text-[#333]">{profile.name}</Text>
                                <Text className="text-[#888] text-sm">{profile.email || profile.phone || 'Village #8'}</Text>
                            </View>
                            <TouchableOpacity className="w-10 h-10 bg-[#F8F9FA] rounded-full justify-center items-center border border-[#EEE]">
                                <Ionicons name="pencil" size={18} color="#666" />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* Language Section */}
                    <View className="mb-[25px]">
                        <Text className="text-sm font-bold text-[#666] mb-2.5 ml-[5px] uppercase tracking-widest">{t.settings.language}</Text>
                        <View className="bg-white rounded-[20px] shadow-sm shadow-black/10 elevation-4">
                            <View className="rounded-[20px] overflow-hidden">
                                <View className="flex-row p-4 items-center justify-around border-b border-[#F5F5F5]">
                                    <TouchableOpacity
                                        onPress={() => setLanguage('en')}
                                        className={`px-6 py-2 rounded-full border ${language === 'en' ? 'bg-[#FF4500] border-[#FF4500]' : 'border-[#DDD]'}`}
                                    >
                                        <Text className={`font-bold ${language === 'en' ? 'text-white' : 'text-[#666]'}`}>English</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => setLanguage('or')}
                                        className={`px-6 py-2 rounded-full border ${language === 'or' ? 'bg-[#FF4500] border-[#FF4500]' : 'border-[#DDD]'}`}
                                    >
                                        <Text className={`font-bold ${language === 'or' ? 'text-white' : 'text-[#666]'}`}>ଓଡ଼ିଆ</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Legal Section */}
                    <View className="mb-[25px]">
                        <Text className="text-sm font-bold text-[#666] mb-2.5 ml-[5px] uppercase tracking-widest">{t.settings.legal}</Text>
                        <View className="bg-white rounded-[20px] shadow-sm shadow-black/10 elevation-4">
                            <View className="rounded-[20px] overflow-hidden">
                                <SettingItem
                                    icon="document-text-outline"
                                    title={t.settings.terms}
                                    color="#FF8C00"
                                    onPress={() => WebBrowser.openBrowserAsync('https://meensou.com/termsofservice/')}
                                />
                                <SettingItem
                                    icon="shield-checkmark-outline"
                                    title={t.settings.privacy}
                                    color="#4CAF50"
                                    onPress={() => WebBrowser.openBrowserAsync('https://meensou.com/privacypolicy/')}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Support Section */}
                    <View className="mb-[25px]">
                        <Text className="text-sm font-bold text-[#666] mb-2.5 ml-[5px] uppercase tracking-widest">{t.settings.support}</Text>
                        <View className="bg-white rounded-[20px] shadow-sm shadow-black/10 elevation-4">
                            <View className="rounded-[20px] overflow-hidden">
                                <SettingItem
                                    icon="call-outline"
                                    title={t.settings.contact}
                                    color="#0288D1"
                                    onPress={() => WebBrowser.openBrowserAsync('https://www.meensou.com/connect')}
                                />
                                <SettingItem
                                    icon="mail-outline"
                                    title={t.settings.email}
                                    color="#E91E63"
                                    onPress={() => Linking.openURL('mailto:info@meensou.com')}
                                />
                            </View>
                        </View>
                    </View>

                    {/* App Info Section */}
                    <View className="mb-[25px]">
                        <Text className="text-sm font-bold text-[#666] mb-2.5 ml-[5px] uppercase tracking-widest">{t.common.others}</Text>
                        <View className="bg-white rounded-[20px] shadow-sm shadow-black/10 elevation-4">
                            <View className="rounded-[20px] overflow-hidden">
                                <SettingItem
                                    icon="star-outline"
                                    title={t.settings.rate}
                                    color="#FBC02D"
                                />
                                <SettingItem
                                    icon="share-social-outline"
                                    title={t.settings.share}
                                    color="#673AB7"
                                />
                            </View>
                        </View>
                    </View>

                    {/* Logout Section */}
                    <View className="mb-[25px]">
                        <TouchableOpacity
                            className="bg-[#FFEBEE] flex-row items-center justify-center p-4 rounded-[20px] elevation-2"
                            activeOpacity={0.7}
                            onPress={async () => {
                                await logout();
                                router.replace('/(auth)/sign-in');
                            }}
                        >
                            <Ionicons name="log-out-outline" size={22} color="#D32F2F" />
                            <Text className="text-[#D32F2F] font-bold text-[16px] ml-2">Log Out</Text>
                        </TouchableOpacity>
                    </View>

                    <Text className="text-center text-[#AAA] text-[12px] mt-2.5 mb-[30px]">{t.settings.version}</Text>
                    <View className="h-[100px]" />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
