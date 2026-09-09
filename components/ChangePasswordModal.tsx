import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { useAppTheme } from '../context/ThemeContext';

interface Props {
    isVisible: boolean;
    onClose: () => void;
}

export default function ChangePasswordModal({ isVisible, onClose }: Props) {
    const { isDark, colors } = useAppTheme();
    const { language } = useLanguage();
    const isOdia = language === 'or';
    const { height: screenHeight } = useWindowDimensions();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetState = () => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowCurrent(false);
        setShowNew(false);
        setShowConfirm(false);
        setError(null);
        setIsSubmitting(false);
    };

    const handleClose = () => {
        resetState();
        onClose();
    };

    const handleSavePassword = async () => {
        setError(null);

        if (!currentPassword.trim()) {
            setError(isOdia ? 'ଦୟାକରି ବର୍ତ୍ତମାନର ପାସୱାର୍ଡ଼ ଦିଅନ୍ତୁ' : 'Please enter your current password');
            return;
        }

        if (!newPassword.trim()) {
            setError(isOdia ? 'ଦୟାକରି ନୂତନ ପାସୱାର୍ଡ଼ ଦିଅନ୍ତୁ' : 'Please enter your new password');
            return;
        }

        if (newPassword.length < 6) {
            setError(isOdia ? 'ପାସୱାର୍ଡ଼ ଅତି କମରେ ୬ ଅକ୍ଷର ବିଶିଷ୍ଟ ହେବା ଉଚିତ୍' : 'New password must be at least 6 characters');
            return;
        }

        if (newPassword === currentPassword) {
            setError(isOdia ? 'ନୂତନ ପାସୱାର୍ଡ଼ ପୁରୁଣା ପାସୱାର୍ଡ଼ ଠାରୁ ଭିନ୍ନ ହେବା ଆବଶ୍ୟକ' : 'New password must be different from current password');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError(isOdia ? 'ନୂତନ ପାସୱାର୍ଡ଼ ମେଳ ଖାଉନାହିଁ' : 'Passwords do not match');
            return;
        }

        setIsSubmitting(true);
        try {
            // Persist the new password
            await AsyncStorage.setItem('user-password', newPassword);

            Alert.alert(
                isOdia ? 'ସଫଳତା' : 'Success',
                isOdia ? 'ପାସୱାର୍ଡ଼ ସଫଳତାର ସହିତ ପରିବର୍ତ୍ତନ ହେଲା।' : 'Your password has been updated successfully.',
                [
                    {
                        text: isOdia ? 'ଠିକ୍ ଅଛି' : 'OK',
                        onPress: () => {
                            handleClose();
                        },
                    },
                ]
            );
        } catch (e) {
            console.error('Error saving password:', e);
            setError(isOdia ? 'ପାସୱାର୍ଡ଼ ପରିବର୍ତ୍ତନ ବିଫଳ ହେଲା । ଦୟାକରି ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ ।' : 'Failed to update password. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={handleClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                    {/* Backdrop */}
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={handleClose}
                        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                    >
                        <BlurView intensity={30} tint="dark" style={{ flex: 1 }} />
                    </TouchableOpacity>

                    {/* Sheet Container */}
                    <View
                        style={{
                            backgroundColor: colors.card,
                            borderTopLeftRadius: 32,
                            borderTopRightRadius: 32,
                            maxHeight: screenHeight * 0.85,
                            overflow: 'hidden',
                            elevation: 20,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: -4 },
                            shadowOpacity: 0.25,
                            shadowRadius: 10,
                            borderWidth: 1,
                            borderColor: isDark ? colors.cardBorder : '#F0F0F0',
                        }}
                    >
                        {/* Header */}
                        <LinearGradient
                            colors={['#FF8C00', '#FF4500']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{
                                paddingHorizontal: 22,
                                paddingTop: 18,
                                paddingBottom: 16,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 18,
                                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        marginRight: 10,
                                    }}
                                >
                                    <Ionicons name="lock-closed" size={18} color="#FFF" />
                                </View>
                                <Text style={{ fontSize: 20, fontWeight: '800', color: '#FFF' }}>
                                    {isOdia ? 'ପାସୱାର୍ଡ଼ ପରିବର୍ତ୍ତନ' : 'Change Password'}
                                </Text>
                            </View>

                            <TouchableOpacity
                                onPress={handleClose}
                                style={{
                                    width: 34,
                                    height: 34,
                                    borderRadius: 17,
                                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <Ionicons name="close" size={20} color="#FFF" />
                            </TouchableOpacity>
                        </LinearGradient>

                        <ScrollView
                            contentContainerStyle={{ paddingHorizontal: 22, paddingTop: 22, paddingBottom: 40 }}
                            keyboardShouldPersistTaps="handled"
                            showsVerticalScrollIndicator={false}
                        >
                            {error ? (
                                <View
                                    style={{
                                        backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2',
                                        paddingHorizontal: 14,
                                        paddingVertical: 10,
                                        borderRadius: 12,
                                        marginBottom: 16,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        borderWidth: 1,
                                        borderColor: isDark ? 'rgba(239, 68, 68, 0.3)' : '#FECACA',
                                    }}
                                >
                                    <Ionicons name="alert-circle" size={18} color="#EF4444" style={{ marginRight: 8 }} />
                                    <Text style={{ color: '#EF4444', fontSize: 13, fontWeight: '600', flex: 1 }}>
                                        {error}
                                    </Text>
                                </View>
                            ) : null}

                            {/* Current Password Field */}
                            <View style={{ marginBottom: 18 }}>
                                <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 8 }}>
                                    {isOdia ? 'ବର୍ତ୍ତମାନର ପାସୱାର୍ଡ଼' : 'Current Password'}
                                </Text>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                                        borderRadius: 14,
                                        borderWidth: 1,
                                        borderColor: isDark ? '#334155' : '#E2E8F0',
                                        paddingHorizontal: 14,
                                    }}
                                >
                                    <Ionicons name="key-outline" size={18} color={colors.textSecondary} style={{ marginRight: 10 }} />
                                    <TextInput
                                        value={currentPassword}
                                        onChangeText={setCurrentPassword}
                                        placeholder={isOdia ? 'ଆପଣଙ୍କ ପାସୱାର୍ଡ଼ ଦିଅନ୍ତୁ' : 'Enter current password'}
                                        placeholderTextColor={colors.textSecondary}
                                        secureTextEntry={!showCurrent}
                                        style={{ flex: 1, paddingVertical: 13, fontSize: 15, color: colors.text }}
                                        autoCapitalize="none"
                                    />
                                    <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)} style={{ padding: 6 }}>
                                        <Ionicons
                                            name={showCurrent ? 'eye-outline' : 'eye-off-outline'}
                                            size={20}
                                            color={colors.textSecondary}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* New Password Field */}
                            <View style={{ marginBottom: 18 }}>
                                <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 8 }}>
                                    {isOdia ? 'ନୂତନ ପାସୱାର୍ଡ଼ (ଅତି କମରେ ୬ ଅକ୍ଷର)' : 'New Password (min 6 characters)'}
                                </Text>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                                        borderRadius: 14,
                                        borderWidth: 1,
                                        borderColor: isDark ? '#334155' : '#E2E8F0',
                                        paddingHorizontal: 14,
                                    }}
                                >
                                    <Ionicons name="lock-closed-outline" size={18} color={colors.textSecondary} style={{ marginRight: 10 }} />
                                    <TextInput
                                        value={newPassword}
                                        onChangeText={setNewPassword}
                                        placeholder={isOdia ? 'ନୂତନ ପାସୱାର୍ଡ଼ ଲେଖନ୍ତୁ' : 'Enter new password'}
                                        placeholderTextColor={colors.textSecondary}
                                        secureTextEntry={!showNew}
                                        style={{ flex: 1, paddingVertical: 13, fontSize: 15, color: colors.text }}
                                        autoCapitalize="none"
                                    />
                                    <TouchableOpacity onPress={() => setShowNew(!showNew)} style={{ padding: 6 }}>
                                        <Ionicons
                                            name={showNew ? 'eye-outline' : 'eye-off-outline'}
                                            size={20}
                                            color={colors.textSecondary}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Confirm Password Field */}
                            <View style={{ marginBottom: 24 }}>
                                <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text, marginBottom: 8 }}>
                                    {isOdia ? 'ନୂତନ ପାସୱାର୍ଡ଼ ନିଶ୍ଚିତ କରନ୍ତୁ' : 'Confirm New Password'}
                                </Text>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        backgroundColor: isDark ? '#1E293B' : '#F8FAFC',
                                        borderRadius: 14,
                                        borderWidth: 1,
                                        borderColor: isDark ? '#334155' : '#E2E8F0',
                                        paddingHorizontal: 14,
                                    }}
                                >
                                    <Ionicons name="checkmark-circle-outline" size={18} color={colors.textSecondary} style={{ marginRight: 10 }} />
                                    <TextInput
                                        value={confirmPassword}
                                        onChangeText={setConfirmPassword}
                                        placeholder={isOdia ? 'ପୁଣି ଥରେ ନୂତନ ପାସୱାର୍ଡ଼ ଲେଖନ୍ତୁ' : 'Re-enter new password'}
                                        placeholderTextColor={colors.textSecondary}
                                        secureTextEntry={!showConfirm}
                                        style={{ flex: 1, paddingVertical: 13, fontSize: 15, color: colors.text }}
                                        autoCapitalize="none"
                                    />
                                    <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={{ padding: 6 }}>
                                        <Ionicons
                                            name={showConfirm ? 'eye-outline' : 'eye-off-outline'}
                                            size={20}
                                            color={colors.textSecondary}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Actions */}
                            <View style={{ flexDirection: 'row', gap: 12 }}>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={handleClose}
                                    style={{
                                        flex: 1,
                                        paddingVertical: 14,
                                        borderRadius: 14,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: isDark ? '#334155' : '#F1F5F9',
                                    }}
                                >
                                    <Text style={{ fontSize: 15, fontWeight: '700', color: colors.textSecondary }}>
                                        {isOdia ? 'ବାତିଲ୍' : 'Cancel'}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    onPress={handleSavePassword}
                                    disabled={isSubmitting}
                                    style={{
                                        flex: 2,
                                        paddingVertical: 14,
                                        borderRadius: 14,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: '#FF4500',
                                    }}
                                >
                                    {isSubmitting ? (
                                        <ActivityIndicator size="small" color="#FFF" />
                                    ) : (
                                        <Text style={{ fontSize: 15, fontWeight: '800', color: '#FFF' }}>
                                            {isOdia ? 'ପରିବର୍ତ୍ତନ କରନ୍ତୁ' : 'Update Password'}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}
