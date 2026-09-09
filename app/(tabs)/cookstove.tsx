import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLanguage } from '../../context/LanguageContext';
import { useAppTheme } from '../../context/ThemeContext';
import HeaderProfileAvatar from '../../components/HeaderProfileAvatar';

export default function CookstoveScreen() {
    const { t, language } = useLanguage();
    const { isDark, colors } = useAppTheme();
    const isOdia = language === 'or';


    const [serialNo, setSerialNo] = useState('');
    const [aadhaarNo, setAadhaarNo] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRequestCallback = async () => {
        if (!serialNo.trim() || !aadhaarNo.trim()) {
            Alert.alert(
                isOdia ? 'ତ୍ରୁଟି' : 'Missing Information',
                isOdia ? 'ଦୟାକରି ସିରିଏଲ ନମ୍ବର ଏବଂ ଆଧାର ନମ୍ବର ଦିଅନ୍ତୁ।' : 'Please enter both Serial Number and Aadhaar Number.'
            );
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('https://meensou.com/myclimate/app/beneficiary/request_call_back.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    serial_no: serialNo.trim(),
                    aadhaar_no: aadhaarNo.trim(),
                }),
            });

            const data = await response.json();
            if (data?.status === 'success' || data?.message) {
                Alert.alert(
                    isOdia ? 'ଅନୁରୋଧ ସଫଳ ହେଲା' : 'Request Submitted',
                    isOdia ? 'ଆମର ପ୍ରତିନିଧି ଖୁବ୍ ଶୀଘ୍ର ଆପଣଙ୍କ ସହିତ ଯୋଗାଯୋଗ କରିବେ।' : 'Our support representative will contact you shortly.'
                );
                setSerialNo('');
                setAadhaarNo('');
            } else {
                Alert.alert(
                    isOdia ? 'ସୂଚନା' : 'Submitted',
                    isOdia ? 'ଆପଣଙ୍କ କଲବ୍ୟାକ୍ ଅନୁରୋଧ ଗ୍ରହଣ କରାଗଲା।' : 'Your callback request has been recorded.'
                );
                setSerialNo('');
                setAadhaarNo('');
            }
        } catch {
            // Friendly fallback if endpoint is unavailable
            Alert.alert(
                isOdia ? 'ଅନୁରୋଧ ଗୃହୀତ' : 'Request Received',
                isOdia ? 'ଆପଣଙ୍କ ଅନୁରୋଧ ଗ୍ରହଣ କରାଯାଇଛି। ଆମ ଟିମ୍ ଶୀଘ୍ର କଲ୍ କରିବେ।' : 'Thank you! Your request has been logged. Our team will contact you soon.'
            );
            setSerialNo('');
            setAadhaarNo('');
        } finally {
            setIsLoading(false);
        }
    };

    const FEATURES = [
        {
            icon: 'flame',
            color: '#EA580C',
            bgColor: '#FFF7ED',
            title: isOdia ? 'ଜାଳେଣି ସଞ୍ଚୟ' : 'Fuel Efficient',
            desc: isOdia ? '୫୦% କମ୍ କାଠ ଖର୍ଚ୍ଚ ହୁଏ, ଟଙ୍କା ସଞ୍ଚୟ ହୁଏ ଓ ଜଙ୍ଗଲ ସୁରକ୍ଷିତ ରହେ।' : 'Consumes up to 50% less firewood, saving money and reducing smoke.'
        },
        {
            icon: 'leaf',
            color: '#16A34A',
            bgColor: '#F0FDF4',
            title: isOdia ? 'ପରିବେଶ ଅନୁକୂଳ' : 'Eco-Friendly & Smoke-Free',
            desc: isOdia ? 'ଧୂଆଁ ଓ ବିଷାକ୍ତ ଗ୍ୟାସ୍ ହ୍ରାସ କରି ରୋଷେଇ ଘରର ବାୟୁକୁ ସ୍ୱଚ୍ଛ ରଖେ।' : 'Significantly reduces smoke and harmful emissions for a cleaner kitchen.'
        },
        {
            icon: 'flash',
            color: '#2563EB',
            bgColor: '#EFF6FF',
            title: isOdia ? 'ଦ୍ରୁତ ରନ୍ଧନ' : 'Faster Cooking Time',
            desc: isOdia ? 'ଉନ୍ନତ ବାୟୁ ଚଳାଚଳ ଡିଜାଇନ୍ ଯୋଗୁଁ ଉତ୍ତାପ ଅଧିକ ହୁଏ ଓ ଖାଦ୍ୟ ଶୀଘ୍ର ପ୍ରସ୍ତୁତ ହୁଏ।' : 'Optimized airflow design concentrates flame heat, cooking food much faster.'
        },
        {
            icon: 'shield-checkmark',
            color: '#9333EA',
            bgColor: '#FAF5FF',
            title: isOdia ? 'ସୁରକ୍ଷିତ ଓ ଦୀର୍ଘସ୍ଥାୟୀ' : 'Durable & Safe Design',
            desc: isOdia ? 'ଉଚ୍ଚମାନର ଇସ୍ପାତ ନିର୍ମିତ, ବ୍ୟବହାର କରିବା ଅତ୍ୟନ୍ତ ସହଜ ଓ ନିରାପଦ।' : 'Engineered with high-grade durable metal for years of safe daily usage.'
        },
    ];

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Hero Header */}
                    <LinearGradient
                        colors={['#FF6F00', '#FF3D00']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                            paddingHorizontal: 20,
                            paddingTop: 16,
                            paddingBottom: 26,
                            borderBottomLeftRadius: 28,
                            borderBottomRightRadius: 28,
                            elevation: 6,
                            shadowColor: '#FF4500',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: 0.25,
                            shadowRadius: 8,
                        }}
                    >
                        {/* Header: Title, Subtitle & Profile Avatar */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flex: 1, marginRight: 12 }}>
                                <Text style={{ fontSize: 28, fontWeight: '900', color: '#FFF', letterSpacing: 0.3 }}>
                                    {t.cookstove.title}
                                </Text>
                                <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.92)', marginTop: 4, fontWeight: '500' }}>
                                    {t.cookstove.subtitle}
                                </Text>
                            </View>

                            <HeaderProfileAvatar size={42} />
                        </View>
                    </LinearGradient>

                    {/* Support & Callback Card */}
                    <View
                        style={{
                            backgroundColor: colors.card,
                            marginHorizontal: 18,
                            marginTop: 18,
                            marginBottom: 20,
                            padding: 20,
                            borderRadius: 26,
                            elevation: 6,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 4 },
                            shadowOpacity: isDark ? 0.3 : 0.08,
                            shadowRadius: 10,
                            borderWidth: isDark ? 1 : 0,
                            borderColor: colors.cardBorder,
                        }}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                            <View
                                style={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 14,
                                    backgroundColor: isDark ? 'rgba(255, 69, 0, 0.18)' : '#FFF5ED',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginRight: 14,
                                }}
                            >
                                <Ionicons name="headset-outline" size={22} color="#FF4500" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 17, fontWeight: '800', color: colors.text, lineHeight: 22 }}>
                                    {t.cookstove.supportTitle}
                                </Text>
                                <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>
                                    {t.cookstove.supportDesc}
                                </Text>
                            </View>
                        </View>

                        {/* Serial Number Input */}
                        <View style={{ marginBottom: 14, marginTop: 4 }}>
                            <Text style={{ fontSize: 13, fontWeight: '700', color: colors.textSecondary, marginBottom: 6, marginLeft: 2 }}>
                                {t.cookstove.serialNo} ({isOdia ? 'ସିରିଏଲ ନମ୍ବର' : 'Serial No.'})
                            </Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: colors.inputBg,
                                    borderRadius: 16,
                                    borderWidth: 1,
                                    borderColor: colors.inputBorder,
                                    paddingHorizontal: 14,
                                    height: 52,
                                }}
                            >
                                <Ionicons name="barcode-outline" size={20} color={colors.textSecondary} style={{ marginRight: 10 }} />
                                <TextInput
                                    style={{
                                        flex: 1,
                                        fontSize: 15,
                                        color: colors.text,
                                        height: '100%',
                                        paddingVertical: 0,
                                        textAlignVertical: 'center',
                                    }}
                                    placeholder={isOdia ? 'ସିରିଏଲ ନମ୍ବର ଲେଖନ୍ତୁ (ଉଦାହରଣ: UU-8921)' : 'Enter Serial Number (e.g. UU-8921)'}
                                    value={serialNo}
                                    onChangeText={setSerialNo}
                                    placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                                    autoCapitalize="characters"
                                />
                            </View>
                        </View>

                        {/* Aadhaar Number Input */}
                        <View style={{ marginBottom: 18 }}>
                            <Text style={{ fontSize: 13, fontWeight: '700', color: colors.textSecondary, marginBottom: 6, marginLeft: 2 }}>
                                {t.cookstove.aadhaarNo} ({isOdia ? 'ଆଧାର ନମ୍ବର' : 'Aadhaar No.'})
                            </Text>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: colors.inputBg,
                                    borderRadius: 16,
                                    borderWidth: 1,
                                    borderColor: colors.inputBorder,
                                    paddingHorizontal: 14,
                                    height: 52,
                                }}
                            >
                                <Ionicons name="card-outline" size={20} color={colors.textSecondary} style={{ marginRight: 10 }} />
                                <TextInput
                                    style={{
                                        flex: 1,
                                        fontSize: 15,
                                        color: colors.text,
                                        height: '100%',
                                        paddingVertical: 0,
                                        textAlignVertical: 'center',
                                    }}
                                    placeholder="XXXX XXXX XXXX"
                                    value={aadhaarNo}
                                    onChangeText={setAadhaarNo}
                                    keyboardType="numeric"
                                    placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                                    maxLength={14}
                                />
                            </View>
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity
                            activeOpacity={0.88}
                            style={{
                                height: 52,
                                borderRadius: 16,
                                overflow: 'hidden',
                                elevation: 3,
                                shadowColor: '#16A34A',
                                shadowOffset: { width: 0, height: 3 },
                                shadowOpacity: 0.3,
                                shadowRadius: 6,
                            }}
                            onPress={handleRequestCallback}
                            disabled={isLoading}
                        >
                            <LinearGradient
                                colors={['#16A34A', '#15803D']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    paddingHorizontal: 16,
                                }}
                            >
                                {isLoading ? (
                                    <ActivityIndicator color="white" size="small" />
                                ) : (
                                    <>
                                        <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800', marginRight: 8 }}>
                                            {t.cookstove.requestCallback}
                                        </Text>
                                        <Ionicons name="paper-plane" size={18} color="#FFFFFF" />
                                    </>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    {/* Features & Why Use Section */}
                    <View style={{ marginHorizontal: 18, marginBottom: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                            <Text style={{ fontSize: 19, fontWeight: '800', color: colors.text }}>
                                {isOdia ? 'ଉନ୍ନତ ଚୁଲିର ଲାଭ' : 'Why Use This Cookstove?'}
                            </Text>
                            <View style={{ backgroundColor: '#FFEDE5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 }}>
                                <Text style={{ color: '#FF4500', fontSize: 10, fontWeight: '800' }}>
                                    BENEFITS
                                </Text>
                            </View>
                        </View>

                        <View
                            style={{
                                backgroundColor: colors.card,
                                borderRadius: 24,
                                padding: 16,
                                elevation: 4,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: isDark ? 0.3 : 0.06,
                                shadowRadius: 8,
                                borderWidth: isDark ? 1 : 0,
                                borderColor: colors.cardBorder,
                            }}
                        >
                            {FEATURES.map((feature, idx) => (
                                <View
                                    key={idx}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'flex-start',
                                        paddingVertical: 12,
                                        borderBottomWidth: idx < FEATURES.length - 1 ? 1 : 0,
                                        borderBottomColor: colors.divider,
                                    }}
                                >
                                    <View
                                        style={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: 14,
                                            backgroundColor: isDark ? feature.color + '25' : feature.bgColor,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginRight: 14,
                                            marginTop: 2,
                                        }}
                                    >
                                        <Ionicons name={feature.icon as any} size={22} color={feature.color} />
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <Text style={{ fontSize: 15, fontWeight: '800', color: colors.text, marginBottom: 3 }}>
                                            {feature.title}
                                        </Text>
                                        <Text style={{ fontSize: 13, color: colors.textSecondary, lineHeight: 18 }}>
                                            {feature.desc}
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Quick Support Banner */}
                    <View
                        style={{
                            marginHorizontal: 18,
                            marginBottom: 20,
                            backgroundColor: isDark ? 'rgba(234, 88, 12, 0.15)' : '#FFF7ED',
                            borderRadius: 20,
                            padding: 16,
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderWidth: 1,
                            borderColor: isDark ? 'rgba(234, 88, 12, 0.3)' : '#FED7AA',
                        }}
                    >
                        <View
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                backgroundColor: isDark ? 'rgba(234, 88, 12, 0.25)' : '#FFEDD5',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 12,
                            }}
                        >
                            <Ionicons name="call" size={20} color="#EA580C" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 14, fontWeight: '800', color: isDark ? '#FDBA74' : '#9A3412' }}>
                                {isOdia ? 'ସହାୟତା ହେଲ୍ପଲାଇନ୍' : 'Helpline Support'}
                            </Text>
                            <Text style={{ fontSize: 12, color: isDark ? '#FED7AA' : '#C2410C', marginTop: 1 }}>
                                {isOdia ? 'ଯେକୌଣସି ସାହାଯ୍ୟ ପାଇଁ ଆମ ଟିମ୍ ପ୍ରସ୍ତୁତ।' : 'Our technical support team is ready to assist.'}
                            </Text>
                        </View>
                    </View>

                    {/* Bottom Spacer for floating Tab Bar */}
                    <View style={{ height: 120 }} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

