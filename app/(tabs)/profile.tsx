import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import {
    Alert,
    Dimensions,
    Linking,
    ScrollView,
    Share,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EditProfileModal from '../../components/EditProfileModal';
import { useLanguage } from '../../context/LanguageContext';
import { useProfile } from '../../context/ProfileContext';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
    const router = useRouter();
    const { profile, logout } = useProfile();
    const { t, language, setLanguage } = useLanguage();
    const isOdia = language === 'or';

    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);

    const handleShare = async () => {
        try {
            await Share.share({
                message: 'Utkal Udaya - Clean cooking, improved cookstoves, and daily agriculture news for Odisha.',
                title: 'Utkal Udaya',
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            isOdia ? 'ଲଗ୍ ଆଉଟ୍' : 'Log Out',
            isOdia ? 'ଆପଣ ନିଶ୍ଚିତ ଭାବରେ ଲଗ୍ ଆଉଟ୍ କରିବାକୁ ଚାହୁଁଛନ୍ତି କି?' : 'Are you sure you want to log out of your account?',
            [
                { text: isOdia ? 'ନାହିଁ' : 'Cancel', style: 'cancel' },
                {
                    text: isOdia ? 'ହଁ, ଲଗ୍ ଆଉଟ୍' : 'Log Out',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                        router.replace('/(auth)/sign-in');
                    },
                },
            ]
        );
    };

    const SettingRow = ({
        icon,
        title,
        subtitle,
        color = '#FF4500',
        onPress,
        rightElement,
        showDivider = true,
    }: {
        icon: keyof typeof Ionicons.glyphMap;
        title: string;
        subtitle?: string;
        color?: string;
        onPress?: () => void;
        rightElement?: React.ReactNode;
        showDivider?: boolean;
    }) => (
        <TouchableOpacity
            activeOpacity={onPress ? 0.7 : 1}
            onPress={onPress}
            disabled={!onPress}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 14,
                paddingHorizontal: 16,
                borderBottomWidth: showDivider ? 1 : 0,
                borderBottomColor: '#F1F5F9',
            }}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View
                    style={{
                        width: 38,
                        height: 38,
                        borderRadius: 12,
                        backgroundColor: color + '15',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 14,
                    }}
                >
                    <Ionicons name={icon} size={20} color={color} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: '#1E293B' }}>{title}</Text>
                    {subtitle && <Text style={{ fontSize: 12, color: '#64748B', marginTop: 1 }}>{subtitle}</Text>}
                </View>
            </View>
            {rightElement ? rightElement : <Ionicons name="chevron-forward" size={18} color="#94A3B8" />}
        </TouchableOpacity>
    );

    const BADGES = [
        { name: isOdia ? 'ପ୍ରକୃତି ବନ୍ଧୁ' : 'Eco Hero', icon: 'leaf', color: '#16A34A', bg: '#DCFCE7' },
        { name: isOdia ? 'ସ୍ୱଚ୍ଛ ରନ୍ଧନ' : 'Clean Cook', icon: 'flame', color: '#EA580C', bg: '#FFEDD5' },
        { name: isOdia ? 'ସଚେତନ କୃଷକ' : 'Smart Farmer', icon: 'school', color: '#0284C7', bg: '#E0F2FE' },
        { name: isOdia ? 'ପରିବେଶ ରକ୍ଷକ' : 'Green Guard', icon: 'shield-checkmark', color: '#9333EA', bg: '#F3E8FF' },
    ];

    return (
        <SafeAreaView className="flex-1 bg-[#F0F7FF]" edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Hero Profile Header */}
                <LinearGradient
                    colors={['#FF6F00', '#FF3D00']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        paddingHorizontal: 20,
                        paddingTop: 16,
                        paddingBottom: 28,
                        borderBottomLeftRadius: 32,
                        borderBottomRightRadius: 32,
                        elevation: 6,
                        shadowColor: '#FF4500',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.25,
                        shadowRadius: 8,
                    }}
                >
                    {/* Header Top Tag */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                paddingHorizontal: 10,
                                paddingVertical: 4,
                                borderRadius: 20,
                                borderWidth: 1,
                                borderColor: 'rgba(255, 255, 255, 0.3)',
                            }}
                        >
                            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#4ADE80', marginRight: 6 }} />
                            <Text style={{ color: '#FFF', fontSize: 10, fontWeight: '800', letterSpacing: 0.5, textTransform: 'uppercase' }}>
                                {isOdia ? 'ଉପଭୋକ୍ତା ପ୍ରୋଫାଇଲ୍' : 'BENEFICIARY PROFILE'}
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={() => setIsEditModalVisible(true)}
                            activeOpacity={0.8}
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: 18,
                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Ionicons name="pencil" size={17} color="#FFF" />
                        </TouchableOpacity>
                    </View>

                    {/* Avatar & User Details */}
                    <View style={{ alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={() => setIsEditModalVisible(true)}
                            activeOpacity={0.85}
                            style={{ position: 'relative', marginBottom: 12 }}
                        >
                            {profile.profileImageUri ? (
                                <View
                                    style={{
                                        width: 94,
                                        height: 94,
                                        borderRadius: 47,
                                        borderWidth: 3,
                                        borderColor: '#FFFFFF',
                                        overflow: 'hidden',
                                        elevation: 4,
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 3 },
                                        shadowOpacity: 0.2,
                                        shadowRadius: 6,
                                    }}
                                >
                                    <Image
                                        source={{ uri: profile.profileImageUri }}
                                        style={{ width: '100%', height: '100%' }}
                                        contentFit="cover"
                                    />
                                </View>
                            ) : (
                                <View
                                    style={{
                                        width: 94,
                                        height: 94,
                                        borderRadius: 47,
                                        backgroundColor: 'rgba(255, 255, 255, 0.25)',
                                        borderWidth: 3,
                                        borderColor: '#FFFFFF',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text style={{ color: '#FFFFFF', fontSize: 32, fontWeight: '900' }}>
                                        {profile.initials || 'UU'}
                                    </Text>
                                </View>
                            )}
                            <View
                                style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    right: 0,
                                    backgroundColor: '#FF4500',
                                    width: 32,
                                    height: 32,
                                    borderRadius: 16,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderWidth: 2,
                                    borderColor: '#FFFFFF',
                                    elevation: 4,
                                }}
                            >
                                <Ionicons name="camera" size={16} color="#FFF" />
                            </View>
                        </TouchableOpacity>

                        <Text style={{ fontSize: 24, fontWeight: '900', color: '#FFFFFF', letterSpacing: 0.3 }}>
                            {profile.name || 'User'}
                        </Text>
                        <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', marginTop: 3, fontWeight: '500' }}>
                            {profile.email || profile.phone || (isOdia ? 'ଗ୍ରାମ: କେନ୍ଦ୍ରାପଡ଼ା' : 'Odisha Beneficiary')}
                        </Text>

                        {/* Edit Button Pill */}
                        <TouchableOpacity
                            onPress={() => setIsEditModalVisible(true)}
                            activeOpacity={0.8}
                            style={{
                                marginTop: 12,
                                backgroundColor: 'rgba(255, 255, 255, 0.22)',
                                paddingHorizontal: 16,
                                paddingVertical: 6,
                                borderRadius: 20,
                                borderWidth: 1,
                                borderColor: 'rgba(255, 255, 255, 0.4)',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Ionicons name="create-outline" size={14} color="#FFF" style={{ marginRight: 6 }} />
                            <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '800' }}>
                                {isOdia ? 'ପ୍ରୋଫାଇଲ୍ ସଂପାଦନ' : 'Edit Profile'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>

                <View style={{ paddingHorizontal: 18, paddingTop: 18 }}>
                    {/* Impact Statistics Card */}
                    <View
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: 24,
                            paddingVertical: 18,
                            paddingHorizontal: 14,
                            marginBottom: 20,
                            elevation: 5,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 3 },
                            shadowOpacity: 0.08,
                            shadowRadius: 8,
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            alignItems: 'center',
                        }}
                    >
                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontSize: 22, fontWeight: '900', color: '#16A34A' }}>
                                {profile.co2Saved || '120'} kg
                            </Text>
                            <Text style={{ fontSize: 11, color: '#64748B', marginTop: 2, fontWeight: '600' }}>
                                {isOdia ? 'CO2 ସଞ୍ଚୟ' : 'CO2 Saved'}
                            </Text>
                        </View>

                        <View style={{ width: 1, height: 32, backgroundColor: '#E2E8F0' }} />

                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontSize: 22, fontWeight: '900', color: '#EA580C' }}>
                                4
                            </Text>
                            <Text style={{ fontSize: 11, color: '#64748B', marginTop: 2, fontWeight: '600' }}>
                                {isOdia ? 'ପଦକ ଅର୍ଜିତ' : 'Badges Won'}
                            </Text>
                        </View>

                        <View style={{ width: 1, height: 32, backgroundColor: '#E2E8F0' }} />

                        <View style={{ alignItems: 'center' }}>
                            <Text style={{ fontSize: 22, fontWeight: '900', color: '#0284C7' }}>
                                48 hrs
                            </Text>
                            <Text style={{ fontSize: 11, color: '#64748B', marginTop: 2, fontWeight: '600' }}>
                                {isOdia ? 'ରନ୍ଧନ ସମୟ' : 'Cook Time'}
                            </Text>
                        </View>
                    </View>

                    {/* Badges Section */}
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontSize: 16, fontWeight: '800', color: '#1E293B', marginBottom: 12, marginLeft: 2 }}>
                            {isOdia ? 'ମୋର ପଦକ ଓ ସଫଳତା' : 'My Achievements & Badges'}
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -4 }}>
                            {BADGES.map((badge, idx) => (
                                <View
                                    key={idx}
                                    style={{
                                        alignItems: 'center',
                                        backgroundColor: '#FFFFFF',
                                        paddingHorizontal: 14,
                                        paddingVertical: 12,
                                        borderRadius: 20,
                                        marginHorizontal: 4,
                                        minWidth: 92,
                                        elevation: 2,
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.05,
                                        shadowRadius: 4,
                                    }}
                                >
                                    <View
                                        style={{
                                            width: 48,
                                            height: 48,
                                            borderRadius: 24,
                                            backgroundColor: badge.bg,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginBottom: 6,
                                        }}
                                    >
                                        <Ionicons name={badge.icon as any} size={24} color={badge.color} />
                                    </View>
                                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#334155' }}>
                                        {badge.name}
                                    </Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>

                    {/* Language Selector */}
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontSize: 14, fontWeight: '800', color: '#64748B', marginBottom: 8, marginLeft: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            {t.settings.language} ({isOdia ? 'ଭାଷା ଚୟନ' : 'SELECT LANGUAGE'})
                        </Text>
                        <View
                            style={{
                                backgroundColor: '#FFFFFF',
                                borderRadius: 20,
                                padding: 8,
                                elevation: 3,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.06,
                                shadowRadius: 6,
                                flexDirection: 'row',
                            }}
                        >
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => setLanguage('en')}
                                style={{
                                    flex: 1,
                                    paddingVertical: 11,
                                    borderRadius: 14,
                                    alignItems: 'center',
                                    backgroundColor: language === 'en' ? '#FF4500' : 'transparent',
                                }}
                            >
                                <Text style={{ fontSize: 14, fontWeight: '800', color: language === 'en' ? '#FFFFFF' : '#64748B' }}>
                                    English
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => setLanguage('or')}
                                style={{
                                    flex: 1,
                                    paddingVertical: 11,
                                    borderRadius: 14,
                                    alignItems: 'center',
                                    backgroundColor: language === 'or' ? '#FF4500' : 'transparent',
                                }}
                            >
                                <Text style={{ fontSize: 14, fontWeight: '800', color: language === 'or' ? '#FFFFFF' : '#64748B' }}>
                                    ଓଡ଼ିଆ (Odia)
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* App Preferences */}
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontSize: 14, fontWeight: '800', color: '#64748B', marginBottom: 8, marginLeft: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            {isOdia ? 'ପସନ୍ଦ ଓ ସେଟିଂସ୍' : 'PREFERENCES'}
                        </Text>
                        <View
                            style={{
                                backgroundColor: '#FFFFFF',
                                borderRadius: 22,
                                overflow: 'hidden',
                                elevation: 3,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.06,
                                shadowRadius: 6,
                            }}
                        >
                            <SettingRow
                                icon="notifications-outline"
                                title={t.profile.notifications}
                                subtitle={isOdia ? 'ନୂଆ ଖବର ଓ ଚୁଲି ଅପଡେଟ୍' : 'News & cookstove reminders'}
                                color="#FF6F00"
                                rightElement={
                                    <Switch
                                        value={notifications}
                                        onValueChange={setNotifications}
                                        trackColor={{ false: '#E2E8F0', true: '#FED7AA' }}
                                        thumbColor={notifications ? '#FF4500' : '#F1F5F9'}
                                    />
                                }
                            />
                            <SettingRow
                                icon="moon-outline"
                                title={t.profile.darkMode}
                                subtitle={isOdia ? 'ରାତ୍ରି ସମୟ ପାଇଁ ଡାର୍କ ଥିମ୍' : 'Low-light theme'}
                                color="#8B5CF6"
                                showDivider={false}
                                rightElement={
                                    <Switch
                                        value={darkMode}
                                        onValueChange={setDarkMode}
                                        trackColor={{ false: '#E2E8F0', true: '#DDD6FE' }}
                                        thumbColor={darkMode ? '#8B5CF6' : '#F1F5F9'}
                                    />
                                }
                            />
                        </View>
                    </View>

                    {/* Support & Legal */}
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontSize: 14, fontWeight: '800', color: '#64748B', marginBottom: 8, marginLeft: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                            {isOdia ? 'ସହାୟତା ଓ ଆଇନଗତ' : 'SUPPORT & LEGAL'}
                        </Text>
                        <View
                            style={{
                                backgroundColor: '#FFFFFF',
                                borderRadius: 22,
                                overflow: 'hidden',
                                elevation: 3,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.06,
                                shadowRadius: 6,
                            }}
                        >
                            <SettingRow
                                icon="call-outline"
                                title={t.settings.contact}
                                subtitle="www.meensou.com/connect"
                                color="#0284C7"
                                onPress={() => WebBrowser.openBrowserAsync('https://www.meensou.com/connect')}
                            />
                            <SettingRow
                                icon="mail-outline"
                                title={t.settings.email}
                                subtitle="info@meensou.com"
                                color="#EC4899"
                                onPress={() => Linking.openURL('mailto:info@meensou.com')}
                            />
                            <SettingRow
                                icon="document-text-outline"
                                title={t.settings.terms}
                                color="#F59E0B"
                                onPress={() => WebBrowser.openBrowserAsync('https://meensou.com/termsofservice/')}
                            />
                            <SettingRow
                                icon="shield-checkmark-outline"
                                title={t.settings.privacy}
                                color="#10B981"
                                onPress={() => WebBrowser.openBrowserAsync('https://meensou.com/privacypolicy/')}
                            />
                            <SettingRow
                                icon="share-social-outline"
                                title={t.settings.share}
                                subtitle={isOdia ? 'ସାଙ୍ଗମାନଙ୍କ ସହିତ ସେୟାର କରନ୍ତୁ' : 'Share Utkal Udaya with friends'}
                                color="#6366F1"
                                showDivider={false}
                                onPress={handleShare}
                            />
                        </View>
                    </View>

                    {/* Logout Button */}
                    <View style={{ marginBottom: 20 }}>
                        <TouchableOpacity
                            activeOpacity={0.8}
                            onPress={handleLogout}
                            style={{
                                backgroundColor: '#FEE2E2',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingVertical: 14,
                                borderRadius: 18,
                                borderWidth: 1,
                                borderColor: '#FECACA',
                            }}
                        >
                            <Ionicons name="log-out-outline" size={20} color="#DC2626" style={{ marginRight: 8 }} />
                            <Text style={{ fontSize: 16, fontWeight: '800', color: '#DC2626' }}>
                                {isOdia ? 'ଲଗ୍ ଆଉଟ୍ (Log Out)' : 'Log Out'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Version */}
                    <Text style={{ textAlign: 'center', fontSize: 12, color: '#94A3B8', fontWeight: '600', marginBottom: 20 }}>
                        Utkal Udaya v1.0.0 • Clean Energy Initiative
                    </Text>

                    {/* Bottom Spacer for floating Tab Bar */}
                    <View style={{ height: 120 }} />
                </View>
            </ScrollView>

            <EditProfileModal
                isVisible={isEditModalVisible}
                onClose={() => setIsEditModalVisible(false)}
            />
        </SafeAreaView>
    );
}
