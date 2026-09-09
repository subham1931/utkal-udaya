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
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EditProfileModal from '../../components/EditProfileModal';
import ChangePasswordModal from '../../components/ChangePasswordModal';
import { useLanguage } from '../../context/LanguageContext';
import { useProfile } from '../../context/ProfileContext';
import { useAppTheme } from '../../context/ThemeContext';

export default function ProfileScreen() {
    const router = useRouter();
    const { profile, logout } = useProfile();
    const { t, language, setLanguage } = useLanguage();
    const { isDark, toggleTheme, colors } = useAppTheme();
    const isOdia = language === 'or';

    const [notifications, setNotifications] = useState(true);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);

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
        onPress,
        rightElement,
        showDivider = true,
    }: {
        icon: keyof typeof Ionicons.glyphMap;
        title: string;
        subtitle?: string;
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
                borderBottomColor: colors.divider,
            }}
        >
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: 10,
                        backgroundColor: isDark ? '#1E293B' : '#F1F5F9',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 14,
                    }}
                >
                    <Ionicons name={icon} size={19} color={isDark ? '#CBD5E1' : '#475569'} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text }}>{title}</Text>
                    {subtitle ? (
                        <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 1 }}>{subtitle}</Text>
                    ) : null}
                </View>
            </View>
            {rightElement ? rightElement : <Ionicons name="chevron-forward" size={18} color={isDark ? '#64748B' : '#94A3B8'} />}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
            <ScrollView showsVerticalScrollIndicator={false}>

                {/* Profile Header */}
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
                    {/* Header Top Bar */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                        <Text style={{ fontSize: 26, fontWeight: '900', color: '#FFF', letterSpacing: 0.3 }}>
                            {isOdia ? 'ପ୍ରୋଫାଇଲ୍' : 'Profile'}
                        </Text>
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
                                        width: 92,
                                        height: 92,
                                        borderRadius: 46,
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
                                        width: 92,
                                        height: 92,
                                        borderRadius: 46,
                                        backgroundColor: 'rgba(255, 255, 255, 0.25)',
                                        borderWidth: 3,
                                        borderColor: '#FFFFFF',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text style={{ color: '#FFFFFF', fontSize: 30, fontWeight: '900' }}>
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
                                    width: 30,
                                    height: 30,
                                    borderRadius: 15,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    borderWidth: 2,
                                    borderColor: '#FFFFFF',
                                    elevation: 4,
                                }}
                            >
                                <Ionicons name="camera" size={15} color="#FFF" />
                            </View>
                        </TouchableOpacity>

                        <Text style={{ fontSize: 22, fontWeight: '800', color: '#FFFFFF', letterSpacing: 0.2 }}>
                            {profile.name || 'User'}
                        </Text>
                        <Text style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', marginTop: 3, fontWeight: '500' }}>
                            {profile.email || profile.phone || (isOdia ? 'କେନ୍ଦ୍ରାପଡ଼ା, ଓଡ଼ିଶା' : 'Kendrapara, Odisha')}
                        </Text>

                        {/* Edit Profile Button */}
                        <TouchableOpacity
                            onPress={() => setIsEditModalVisible(true)}
                            activeOpacity={0.8}
                            style={{
                                marginTop: 12,
                                backgroundColor: 'rgba(255, 255, 255, 0.22)',
                                paddingHorizontal: 16,
                                paddingVertical: 7,
                                borderRadius: 20,
                                borderWidth: 1,
                                borderColor: 'rgba(255, 255, 255, 0.4)',
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                        >
                            <Ionicons name="create-outline" size={15} color="#FFF" style={{ marginRight: 6 }} />
                            <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '700' }}>
                                {isOdia ? 'ପ୍ରୋଫାଇଲ୍ ସଂପାଦନ' : 'Edit Profile'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>

                <View style={{ paddingHorizontal: 18, paddingTop: 18 }}>

                    {/* Beneficiary Details Card */}
                    <View
                        style={{
                            backgroundColor: colors.card,
                            borderRadius: 20,
                            padding: 16,
                            marginBottom: 20,
                            elevation: 3,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: isDark ? 0.25 : 0.06,
                            shadowRadius: 6,
                            borderWidth: isDark ? 1 : 0,
                            borderColor: colors.cardBorder,
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 8,
                                        backgroundColor: isDark ? '#334155' : '#F1F5F9',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        marginRight: 10,
                                    }}
                                >
                                    <Ionicons name="person-outline" size={17} color={isDark ? '#CBD5E1' : '#475569'} />
                                </View>
                                <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>
                                    {isOdia ? 'ଉପଭୋକ୍ତା ବିବରଣୀ' : 'Beneficiary Details'}
                                </Text>
                            </View>

                            <View
                                style={{
                                    backgroundColor: isDark ? 'rgba(34, 197, 94, 0.15)' : '#DCFCE7',
                                    paddingHorizontal: 8,
                                    paddingVertical: 3,
                                    borderRadius: 12,
                                }}
                            >
                                <Text style={{ color: '#16A34A', fontSize: 11, fontWeight: '700' }}>
                                    {isOdia ? 'ସକ୍ରିୟ' : 'Active'}
                                </Text>
                            </View>
                        </View>

                        <View style={{ height: 1, backgroundColor: colors.divider, marginBottom: 12 }} />

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                            <Text style={{ fontSize: 13, color: colors.textSecondary, fontWeight: '500' }}>
                                {isOdia ? 'ଉପଭୋକ୍ତା ଆଇଡି' : 'Beneficiary ID'}
                            </Text>
                            <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text }}>
                                {profile.id || 'UU-2026-001'}
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                            <Text style={{ fontSize: 13, color: colors.textSecondary, fontWeight: '500' }}>
                                {isOdia ? 'ଚୁଲି ମଡେଲ୍' : 'Cookstove Model'}
                            </Text>
                            <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text }}>
                                Prathamesh Cookstove
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 13, color: colors.textSecondary, fontWeight: '500' }}>
                                {isOdia ? 'ସ୍ଥାନ' : 'Location'}
                            </Text>
                            <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text }}>
                                {[profile.village, profile.district].filter(Boolean).join(', ') || (isOdia ? 'କେନ୍ଦ୍ରାପଡ଼ା, ଓଡ଼ିଶା' : 'Kendrapara, Odisha')}
                            </Text>
                        </View>
                    </View>

                    {/* Account Settings */}
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontSize: 14, fontWeight: '700', color: colors.textSecondary, marginBottom: 8, marginLeft: 2 }}>
                            {isOdia ? 'ଆକାଉଣ୍ଟ' : 'Account'}
                        </Text>
                        <View
                            style={{
                                backgroundColor: colors.card,
                                borderRadius: 20,
                                overflow: 'hidden',
                                elevation: 3,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: isDark ? 0.3 : 0.06,
                                shadowRadius: 6,
                                borderWidth: isDark ? 1 : 0,
                                borderColor: colors.cardBorder,
                            }}
                        >
                            <SettingRow
                                icon="person-outline"
                                title={isOdia ? 'ପ୍ରୋଫାଇଲ୍ ସଂପାଦନ' : 'Edit Profile'}
                                subtitle={isOdia ? 'ନାମ, ଫୋନ୍, ଗ୍ରାମ ଓ ଫଟୋ ଅପଡେଟ୍ କରନ୍ତୁ' : 'Update name, phone, village & photo'}
                                onPress={() => setIsEditModalVisible(true)}
                            />
                            <SettingRow
                                icon="lock-closed-outline"
                                title={isOdia ? 'ପାସୱାର୍ଡ଼ ପରିବର୍ତ୍ତନ' : 'Change Password'}
                                subtitle={isOdia ? 'ଆପଣଙ୍କର ଆକାଉଣ୍ଟ ପାସୱାର୍ଡ଼ ବଦଳାନ୍ତୁ' : 'Update your account password'}
                                showDivider={false}
                                onPress={() => setIsPasswordModalVisible(true)}
                            />
                        </View>
                    </View>

                    {/* Language Selector */}
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontSize: 14, fontWeight: '700', color: colors.textSecondary, marginBottom: 8, marginLeft: 2 }}>
                            {isOdia ? 'ଭାଷା' : 'Language'}
                        </Text>
                        <View
                            style={{
                                backgroundColor: colors.card,
                                borderRadius: 16,
                                padding: 4,
                                elevation: 2,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 1 },
                                shadowOpacity: isDark ? 0.25 : 0.05,
                                shadowRadius: 4,
                                borderWidth: isDark ? 1 : 0,
                                borderColor: colors.cardBorder,
                                flexDirection: 'row',
                            }}
                        >
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => setLanguage('en')}
                                style={{
                                    flex: 1,
                                    paddingVertical: 10,
                                    borderRadius: 12,
                                    alignItems: 'center',
                                    backgroundColor: language === 'en' ? '#FF4500' : 'transparent',
                                }}
                            >
                                <Text style={{ fontSize: 14, fontWeight: '700', color: language === 'en' ? '#FFFFFF' : colors.textSecondary }}>
                                    English
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => setLanguage('or')}
                                style={{
                                    flex: 1,
                                    paddingVertical: 10,
                                    borderRadius: 12,
                                    alignItems: 'center',
                                    backgroundColor: language === 'or' ? '#FF4500' : 'transparent',
                                }}
                            >
                                <Text style={{ fontSize: 14, fontWeight: '700', color: language === 'or' ? '#FFFFFF' : colors.textSecondary }}>
                                    ଓଡ଼ିଆ (Odia)
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* App Preferences */}
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontSize: 14, fontWeight: '700', color: colors.textSecondary, marginBottom: 8, marginLeft: 2 }}>
                            {isOdia ? 'ପସନ୍ଦ ଓ ସେଟିଂସ୍' : 'Preferences'}
                        </Text>
                        <View
                            style={{
                                backgroundColor: colors.card,
                                borderRadius: 20,
                                overflow: 'hidden',
                                elevation: 3,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: isDark ? 0.3 : 0.06,
                                shadowRadius: 6,
                                borderWidth: isDark ? 1 : 0,
                                borderColor: colors.cardBorder,
                            }}
                        >
                            <SettingRow
                                icon="notifications-outline"
                                title={t.profile.notifications}
                                subtitle={isOdia ? 'ବାର୍ତ୍ତା ଏବଂ ଚୁଲି ଅପଡେଟ୍' : 'News and stove reminders'}
                                rightElement={
                                    <Switch
                                        value={notifications}
                                        onValueChange={setNotifications}
                                        trackColor={{ false: isDark ? '#334155' : '#E2E8F0', true: '#FED7AA' }}
                                        thumbColor={notifications ? '#FF4500' : (isDark ? '#94A3B8' : '#F1F5F9')}
                                    />
                                }
                            />
                            <SettingRow
                                icon="moon-outline"
                                title={t.profile.darkMode}
                                subtitle={isOdia ? 'ରାତ୍ରି ସମୟ ପାଇଁ ଡାର୍କ ଥିମ୍' : 'Low-light dark mode'}
                                showDivider={false}
                                rightElement={
                                    <Switch
                                        value={isDark}
                                        onValueChange={() => toggleTheme()}
                                        trackColor={{ false: isDark ? '#334155' : '#E2E8F0', true: '#FED7AA' }}
                                        thumbColor={isDark ? '#FF4500' : '#F1F5F9'}
                                    />
                                }
                            />
                        </View>
                    </View>

                    {/* Support & Legal */}
                    <View style={{ marginBottom: 20 }}>
                        <Text style={{ fontSize: 14, fontWeight: '700', color: colors.textSecondary, marginBottom: 8, marginLeft: 2 }}>
                            {isOdia ? 'ସହାୟତା' : 'Support & Legal'}
                        </Text>
                        <View
                            style={{
                                backgroundColor: colors.card,
                                borderRadius: 20,
                                overflow: 'hidden',
                                elevation: 3,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: isDark ? 0.3 : 0.06,
                                shadowRadius: 6,
                                borderWidth: isDark ? 1 : 0,
                                borderColor: colors.cardBorder,
                            }}
                        >
                            <SettingRow
                                icon="call-outline"
                                title={t.settings.contact}
                                subtitle="www.meensou.com/connect"
                                onPress={() => WebBrowser.openBrowserAsync('https://www.meensou.com/connect')}
                            />
                            <SettingRow
                                icon="mail-outline"
                                title={t.settings.email}
                                subtitle="info@meensou.com"
                                onPress={() => Linking.openURL('mailto:info@meensou.com')}
                            />
                            <SettingRow
                                icon="document-text-outline"
                                title={t.settings.terms}
                                onPress={() => WebBrowser.openBrowserAsync('https://meensou.com/termsofservice/')}
                            />
                            <SettingRow
                                icon="shield-checkmark-outline"
                                title={t.settings.privacy}
                                onPress={() => WebBrowser.openBrowserAsync('https://meensou.com/privacypolicy/')}
                            />
                            <SettingRow
                                icon="share-social-outline"
                                title={t.settings.share}
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
                                backgroundColor: isDark ? 'rgba(239, 68, 68, 0.12)' : '#FEF2F2',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingVertical: 14,
                                borderRadius: 16,
                                borderWidth: 1,
                                borderColor: isDark ? 'rgba(239, 68, 68, 0.3)' : '#FEE2E2',
                            }}
                        >
                            <Ionicons name="log-out-outline" size={19} color="#EF4444" style={{ marginRight: 8 }} />
                            <Text style={{ fontSize: 15, fontWeight: '700', color: '#EF4444' }}>
                                {isOdia ? 'ଲଗ୍ ଆଉଟ୍' : 'Log Out'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Version */}
                    <Text style={{ textAlign: 'center', fontSize: 12, color: colors.textSecondary, fontWeight: '500', marginBottom: 20 }}>
                        Utkal Udaya v1.0.0
                    </Text>

                    {/* Bottom Spacer for floating Tab Bar */}
                    <View style={{ height: 120 }} />
                </View>
            </ScrollView>

            <EditProfileModal
                isVisible={isEditModalVisible}
                onClose={() => setIsEditModalVisible(false)}
            />

            <ChangePasswordModal
                isVisible={isPasswordModalVisible}
                onClose={() => setIsPasswordModalVisible(false)}
            />
        </SafeAreaView>
    );
}
