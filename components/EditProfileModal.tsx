import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform, useWindowDimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useLanguage } from '../context/LanguageContext';
import { useProfile } from '../context/ProfileContext';
import { useAppTheme } from '../context/ThemeContext';
import * as ImagePicker from 'expo-image-picker';

interface Props {
    isVisible: boolean;
    onClose: () => void;
}

export default function EditProfileModal({ isVisible, onClose }: Props) {
    const { profile, updateProfile } = useProfile();
    const { t } = useLanguage();
    const { isDark, colors } = useAppTheme();
    const { height: screenHeight } = useWindowDimensions();

    const [name, setName] = useState(profile.name);
    const [email, setEmail] = useState(profile.email || '');
    const [phone, setPhone] = useState(profile.phone || '');
    const [village, setVillage] = useState(profile.village || '');
    const [district, setDistrict] = useState(profile.district || '');
    const [profileImageUri, setProfileImageUri] = useState(profile.profileImageUri || '');
    const [isSaving, setIsSaving] = useState(false);

    const getInitials = (nameStr?: string) => {
        if (!nameStr || !nameStr.trim()) return 'UU';
        const nameParts = nameStr.trim().split(' ');
        if (nameParts.length >= 2) {
            return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
        } else if (nameParts.length === 1 && nameParts[0].length > 0) {
            return nameParts[0].substring(0, 2).toUpperCase();
        }
        return 'UU';
    };

    useEffect(() => {
        if (isVisible) {
            setName(profile.name);
            setEmail(profile.email || '');
            setPhone(profile.phone || '');
            setVillage(profile.village || '');
            setDistrict(profile.district || '');
            setProfileImageUri(profile.profileImageUri || '');
        }
    }, [isVisible, profile]);

    const handleSave = async () => {
        if (!name.trim()) {
            Alert.alert(
                t.profile.validationError || 'Validation Error',
                t.profile.nameRequired || 'Name is required'
            );
            return;
        }

        setIsSaving(true);
        try {
            await updateProfile({
                name: name.trim(),
                email: email.trim() || undefined,
                phone: phone.trim() || undefined,
                village: village.trim() || undefined,
                district: district.trim() || undefined,
                profileImageUri: profileImageUri || undefined,
            });
            onClose();
        } catch (error) {
            Alert.alert(
                t.profile.saveError || 'Error',
                t.profile.saveErrorMessage || 'Failed to save profile. Please try again.'
            );
        } finally {
            setIsSaving(false);
        }
    };

    const pickImage = async () => {
        if (!ImagePicker) {
            Alert.alert(
                t.profile.error || 'Error',
                'Image picker is not available. Please install expo-image-picker.'
            );
            return;
        }
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    t.profile.permissionDenied || 'Permission Denied',
                    t.profile.cameraPermissionMessage || 'We need camera roll permissions to update your profile picture.'
                );
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                setProfileImageUri(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert(
                t.profile.error || 'Error',
                t.profile.imagePickerError || 'Failed to pick image. Please try again.'
            );
        }
    };

    const takePhoto = async () => {
        if (!ImagePicker) {
            Alert.alert(
                t.profile.error || 'Error',
                'Image picker is not available. Please install expo-image-picker.'
            );
            return;
        }
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    t.profile.permissionDenied || 'Permission Denied',
                    t.profile.cameraPermissionMessage || 'We need camera permissions to take a photo.'
                );
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                setProfileImageUri(result.assets[0].uri);
            }
        } catch (error) {
            console.error('Error taking photo:', error);
            Alert.alert(
                t.profile.error || 'Error',
                t.profile.cameraError || 'Failed to take photo. Please try again.'
            );
        }
    };

    const showImageOptions = () => {
        Alert.alert(
            t.profile.updatePhoto || 'Update Photo',
            t.profile.choosePhotoSource || 'Choose an option',
            [
                { text: t.profile.cancel || 'Cancel', style: 'cancel' },
                { text: t.profile.takePhoto || 'Take Photo', onPress: takePhoto },
                { text: t.profile.chooseFromLibrary || 'Choose from Library', onPress: pickImage },
            ]
        );
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{ flex: 1 }}
            >
                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                    {/* Clickable Backdrop */}
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={onClose}
                        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
                    >
                        <BlurView intensity={80} tint="dark" style={{ flex: 1 }} />
                    </TouchableOpacity>
                    
                    <View
                        style={{
                            backgroundColor: colors.card,
                            borderTopLeftRadius: 36,
                            borderTopRightRadius: 36,
                            height: Math.min(screenHeight * 0.88, 750),
                            overflow: 'hidden',
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: -4 },
                            shadowOpacity: isDark ? 0.4 : 0.15,
                            shadowRadius: 16,
                            elevation: 20,
                        }}
                    >
                        <LinearGradient
                            colors={['#FF8C00', '#FF4500']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={{
                                borderTopLeftRadius: 36,
                                borderTopRightRadius: 36,
                                paddingTop: 20,
                                paddingBottom: 16,
                                paddingHorizontal: 24,
                            }}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: 22, fontWeight: '800', color: '#FFF' }}>
                                    {t.profile.editProfile || 'Edit Profile'}
                                </Text>
                                <TouchableOpacity
                                    onPress={onClose}
                                    style={{
                                        width: 36,
                                        height: 36,
                                        borderRadius: 18,
                                        backgroundColor: 'rgba(255, 255, 255, 0.25)',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                >
                                    <Ionicons name="close" size={22} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>

                        <ScrollView
                            style={{ flex: 1 }}
                            contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 24, paddingBottom: 50 }}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >
                            {/* Profile Picture Section */}
                            <View className="items-center mb-6">
                                <TouchableOpacity onPress={showImageOptions} activeOpacity={0.8}>
                                    <View className="relative">
                                        {profileImageUri ? (
                                            <View className="w-[100px] h-[100px] rounded-full border-4 border-[#FF5722] overflow-hidden shadow-lg">
                                                <Image 
                                                    source={{ uri: profileImageUri }}
                                                    style={{ width: '100%', height: '100%' }}
                                                    contentFit="cover"
                                                />
                                            </View>
                                        ) : (
                                            <View
                                                style={{
                                                    width: 100,
                                                    height: 100,
                                                    borderRadius: 50,
                                                    backgroundColor: '#FF5722',
                                                    borderWidth: 4,
                                                    borderColor: isDark ? colors.cardBorder : '#FFF',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    elevation: 6,
                                                    shadowColor: '#000',
                                                    shadowOffset: { width: 0, height: 4 },
                                                    shadowOpacity: 0.2,
                                                    shadowRadius: 8,
                                                }}
                                            >
                                                <Text style={{ color: '#FFF', fontSize: 32, fontWeight: '800' }}>
                                                    {getInitials(name)}
                                                </Text>
                                            </View>
                                        )}
                                        <View className="absolute bottom-0 right-0 bg-[#FF4500] w-[35px] h-[35px] rounded-full justify-center items-center border-4 border-white shadow-lg">
                                            <Ionicons name="camera" size={18} color="#FFF" />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 8, fontWeight: '500' }}>
                                    {t.profile.tapToChangePhoto || 'Tap to change photo'}
                                </Text>
                            </View>

                            {/* Form Fields */}
                            <View className="mb-4">
                                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 }}>
                                    {t.profile.name || 'Name'} *
                                </Text>
                                <View style={{ backgroundColor: colors.inputBg, borderRadius: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: colors.inputBorder, height: 50, justifyContent: 'center' }}>
                                    <TextInput
                                        value={name}
                                        onChangeText={setName}
                                        placeholder={t.profile.namePlaceholder || 'Enter your name'}
                                        placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                                        style={{
                                            fontSize: 15,
                                            height: '100%',
                                            paddingVertical: 0,
                                            textAlignVertical: 'center',
                                            color: colors.text,
                                        }}
                                        autoCapitalize="words"
                                    />
                                </View>
                            </View>

                            <View className="mb-4">
                                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 }}>
                                    {t.profile.email || 'Email'}
                                </Text>
                                <View style={{ backgroundColor: colors.inputBg, borderRadius: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: colors.inputBorder, height: 50, justifyContent: 'center' }}>
                                    <TextInput
                                        value={email}
                                        onChangeText={setEmail}
                                        placeholder={t.profile.emailPlaceholder || 'Enter your email'}
                                        placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                                        style={{
                                            fontSize: 15,
                                            height: '100%',
                                            paddingVertical: 0,
                                            textAlignVertical: 'center',
                                            color: colors.text,
                                        }}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </View>
                            </View>

                            <View className="mb-4">
                                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 }}>
                                    {t.profile.phone || 'Phone'}
                                </Text>
                                <View style={{ backgroundColor: colors.inputBg, borderRadius: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: colors.inputBorder, height: 50, justifyContent: 'center' }}>
                                    <TextInput
                                        value={phone}
                                        onChangeText={setPhone}
                                        placeholder={t.profile.phonePlaceholder || 'Enter your phone number'}
                                        placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                                        style={{
                                            fontSize: 15,
                                            height: '100%',
                                            paddingVertical: 0,
                                            textAlignVertical: 'center',
                                            color: colors.text,
                                        }}
                                        keyboardType="phone-pad"
                                    />
                                </View>
                            </View>

                            <View className="mb-4">
                                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 }}>
                                    {t.profile.village || 'Village'}
                                </Text>
                                <View style={{ backgroundColor: colors.inputBg, borderRadius: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: colors.inputBorder, height: 50, justifyContent: 'center' }}>
                                    <TextInput
                                        value={village}
                                        onChangeText={setVillage}
                                        placeholder={t.profile.villagePlaceholder || 'Enter your village'}
                                        placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                                        style={{
                                            fontSize: 15,
                                            height: '100%',
                                            paddingVertical: 0,
                                            textAlignVertical: 'center',
                                            color: colors.text,
                                        }}
                                        autoCapitalize="words"
                                    />
                                </View>
                            </View>

                            <View className="mb-6">
                                <Text style={{ fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: 8 }}>
                                    {t.profile.district || 'District'}
                                </Text>
                                <View style={{ backgroundColor: colors.inputBg, borderRadius: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: colors.inputBorder, height: 50, justifyContent: 'center' }}>
                                    <TextInput
                                        value={district}
                                        onChangeText={setDistrict}
                                        placeholder={t.profile.districtPlaceholder || 'Enter your district'}
                                        placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
                                        style={{
                                            fontSize: 15,
                                            height: '100%',
                                            paddingVertical: 0,
                                            textAlignVertical: 'center',
                                            color: colors.text,
                                        }}
                                        autoCapitalize="words"
                                    />
                                </View>
                            </View>

                            {/* Action Buttons */}
                            <View className="flex-row gap-3 mb-6">
                                <TouchableOpacity
                                    onPress={onClose}
                                    style={{
                                        flex: 1,
                                        backgroundColor: isDark ? '#334155' : '#F1F5F9',
                                        borderRadius: 14,
                                        paddingVertical: 15,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <Text style={{ color: isDark ? '#E2E8F0' : '#64748B', fontWeight: '700', fontSize: 16 }}>
                                        {t.profile.cancel || 'Cancel'}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleSave}
                                    disabled={isSaving}
                                    style={{
                                        flex: 1,
                                        borderRadius: 14,
                                        overflow: 'hidden',
                                    }}
                                    activeOpacity={0.8}
                                >
                                    <LinearGradient
                                        colors={['#FF8C00', '#FF4500']}
                                        style={{
                                            paddingVertical: 15,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderRadius: 14,
                                        }}
                                    >
                                        <Text style={{ color: '#FFF', fontWeight: '700', fontSize: 16 }}>
                                            {isSaving ? (t.profile.saving || 'Saving...') : (t.profile.save || 'Save')}
                                        </Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}
