import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Redirect } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useState } from 'react';
import {
    Linking,
    ScrollView,
    Share,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PLAY_STORE_URL } from '../../constants/config';
import { useLanguage } from '../../context/LanguageContext';
import { useAppTheme } from '../../context/ThemeContext';
import {
    areNotificationsEnabled,
    registerForPushNotifications,
    setNotificationsEnabled,
} from '../../utils/notifications';

type SettingRowProps = {
    icon: keyof typeof Ionicons.glyphMap;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    showDivider?: boolean;
    isDark: boolean;
    colors: {
        text: string;
        textSecondary: string;
        divider: string;
    };
};

function SettingRow({
    icon,
    title,
    subtitle,
    onPress,
    rightElement,
    showDivider = true,
    isDark,
    colors,
}: SettingRowProps) {
    return (
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
            {rightElement ? (
                rightElement
            ) : (
                <Ionicons name="chevron-forward" size={18} color={isDark ? '#64748B' : '#94A3B8'} />
            )}
        </TouchableOpacity>
    );
}

export function ProfileScreen() {
    const { t, language, setLanguage } = useLanguage();
    const { isDark, toggleTheme, colors } = useAppTheme();
    const insets = useSafeAreaInsets();
    const isOdia = language === 'or';

    const [notifications, setNotifications] = useState(true);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            const enabled = await areNotificationsEnabled();
            if (!cancelled) setNotifications(enabled);
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const handleNotificationsToggle = async (value: boolean) => {
        setNotifications(value);
        await setNotificationsEnabled(value);
        if (value) {
            await registerForPushNotifications();
        }
    };

    const handleShare = async () => {
        try {
            const storeLine = PLAY_STORE_URL
                ? `\n${PLAY_STORE_URL}`
                : '\n(Play Store link coming soon)';
            await Share.share({
                message:
                    'Utkal Udaya - Clean cooking, improved cookstoves, and daily agriculture news for Odisha.' +
                    storeLine,
                title: 'Utkal Udaya',
                url: PLAY_STORE_URL || undefined,
            });
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <View
                style={{
                    zIndex: 2,
                    overflow: 'hidden',
                    borderBottomLeftRadius: 28,
                    borderBottomRightRadius: 28,
                    backgroundColor: 'transparent',
                }}
            >
                <LinearGradient
                    colors={['#FF6F00', '#FF3D00']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                        height: 96 + insets.top,
                        paddingHorizontal: 20,
                        paddingTop: 16 + insets.top,
                        paddingBottom: 26,
                        justifyContent: 'center',
                    }}
                >
                    <Text style={{ fontSize: 28, fontWeight: '900', color: '#FFF', letterSpacing: 0.3 }} numberOfLines={1}>
                        {t.settings.title}
                    </Text>
                </LinearGradient>
            </View>

            <ScrollView
                style={{ flex: 1, backgroundColor: colors.background }}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ paddingHorizontal: 18, paddingTop: 18 }}>
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
                                isDark={isDark}
                                colors={colors}
                                icon="notifications-outline"
                                title={t.profile.notifications}
                                subtitle={isOdia ? 'ନୂଆ ଖବର ଆଲର୍ଟ' : 'Alerts for new agriculture news'}
                                rightElement={
                                    <Switch
                                        value={notifications}
                                        onValueChange={handleNotificationsToggle}
                                        trackColor={{ false: isDark ? '#334155' : '#E2E8F0', true: '#FED7AA' }}
                                        thumbColor={notifications ? '#FF4500' : (isDark ? '#94A3B8' : '#F1F5F9')}
                                    />
                                }
                            />
                            <SettingRow
                                isDark={isDark}
                                colors={colors}
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
                                isDark={isDark}
                                colors={colors}
                                icon="call-outline"
                                title={t.settings.contact}
                                subtitle="www.meensou.com/connect"
                                onPress={() => WebBrowser.openBrowserAsync('https://www.meensou.com/connect')}
                            />
                            <SettingRow
                                isDark={isDark}
                                colors={colors}
                                icon="mail-outline"
                                title={t.settings.email}
                                subtitle="info@meensou.com"
                                onPress={() => Linking.openURL('mailto:info@meensou.com')}
                            />
                            <SettingRow
                                isDark={isDark}
                                colors={colors}
                                icon="document-text-outline"
                                title={t.settings.terms}
                                onPress={() => WebBrowser.openBrowserAsync('https://meensou.com/termsofservice/')}
                            />
                            <SettingRow
                                isDark={isDark}
                                colors={colors}
                                icon="shield-checkmark-outline"
                                title={t.settings.privacy}
                                onPress={() => WebBrowser.openBrowserAsync('https://meensou.com/privacypolicy/')}
                            />
                            <SettingRow
                                isDark={isDark}
                                colors={colors}
                                icon="share-social-outline"
                                title={t.settings.share}
                                showDivider={false}
                                onPress={handleShare}
                            />
                        </View>
                    </View>

                    <Text style={{ textAlign: 'center', fontSize: 12, color: colors.textSecondary, fontWeight: '500', marginBottom: 20 }}>
                        Utkal Udaya v1.0.0
                    </Text>

                    <View style={{ height: 120 }} />
                </View>
            </ScrollView>
        </View>
    );
}

export default function ProfileRoute() {
    return <Redirect href="/(tabs)/settings" />;
}
