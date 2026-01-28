import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { useProfile } from '../context/ProfileContext';
import { useLanguage } from '../context/LanguageContext';
// Image picker is optional - will be imported dynamically if available
let ImagePicker: any = null;
try {
    ImagePicker = require('expo-image-picker');
} catch (e) {
    console.log('expo-image-picker not available');
}

interface Props {
    isVisible: boolean;
    onClose: () => void;
}

export default function EditProfileModal({ isVisible, onClose }: Props) {
    const { profile, updateProfile } = useProfile();
    const { t } = useLanguage();
    
    const [name, setName] = useState(profile.name);
    const [email, setEmail] = useState(profile.email || '');
    const [phone, setPhone] = useState(profile.phone || '');
    const [village, setVillage] = useState(profile.village || '');
    const [district, setDistrict] = useState(profile.district || '');
    const [profileImageUri, setProfileImageUri] = useState(profile.profileImageUri || '');
    const [isSaving, setIsSaving] = useState(false);

    const getInitials = (nameStr: string) => {
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
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <View className="flex-1 justify-end">
                    <BlurView intensity={80} tint="dark" className="absolute inset-0" />
                    
                    <View className="bg-white rounded-t-[40px] max-h-[90%]">
                        <LinearGradient
                            colors={['#FF8C00', '#FF4500']}
                            className="rounded-t-[40px] pt-6 pb-4 px-6"
                        >
                            <View className="flex-row items-center justify-between mb-4">
                                <Text className="text-2xl font-bold text-white">
                                    {t.profile.editProfile || 'Edit Profile'}
                                </Text>
                                <TouchableOpacity
                                    onPress={onClose}
                                    className="w-10 h-10 rounded-full bg-white/20 justify-center items-center"
                                >
                                    <Ionicons name="close" size={24} color="#FFF" />
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>

                        <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
                            {/* Profile Picture Section */}
                            <View className="items-center mb-6">
                                <TouchableOpacity onPress={showImageOptions} activeOpacity={0.8}>
                                    <View className="relative">
                                        {profileImageUri ? (
                                            <View className="w-[100px] h-[100px] rounded-full border-4 border-white overflow-hidden shadow-lg">
                                                <Image 
                                                    source={{ uri: profileImageUri }}
                                                    style={{ width: '100%', height: '100%' }}
                                                    contentFit="cover"
                                                />
                                            </View>
                                        ) : (
                                            <View className="w-[100px] h-[100px] rounded-full bg-white/30 border-4 border-white justify-center items-center shadow-lg">
                                                <Text className="text-white text-3xl font-bold">
                                                    {getInitials(name)}
                                                </Text>
                                            </View>
                                        )}
                                        <View className="absolute bottom-0 right-0 bg-[#FF4500] w-[35px] h-[35px] rounded-full justify-center items-center border-4 border-white shadow-lg">
                                            <Ionicons name="camera" size={18} color="#FFF" />
                                        </View>
                                    </View>
                                </TouchableOpacity>
                                <Text className="text-sm text-[#666] mt-2 font-medium">
                                    {t.profile.tapToChangePhoto || 'Tap to change photo'}
                                </Text>
                            </View>

                            {/* Form Fields */}
                            <View className="mb-4">
                                <Text className="text-sm font-semibold text-[#333] mb-2">
                                    {t.profile.name || 'Name'} *
                                </Text>
                                <View className="bg-[#F5F5F5] rounded-xl px-4 py-3 border border-[#E0E0E0]">
                                    <TextInput
                                        value={name}
                                        onChangeText={setName}
                                        placeholder={t.profile.namePlaceholder || 'Enter your name'}
                                        className="text-[15px] text-[#333]"
                                        autoCapitalize="words"
                                    />
                                </View>
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-semibold text-[#333] mb-2">
                                    {t.profile.email || 'Email'}
                                </Text>
                                <View className="bg-[#F5F5F5] rounded-xl px-4 py-3 border border-[#E0E0E0]">
                                    <TextInput
                                        value={email}
                                        onChangeText={setEmail}
                                        placeholder={t.profile.emailPlaceholder || 'Enter your email'}
                                        className="text-[15px] text-[#333]"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                </View>
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-semibold text-[#333] mb-2">
                                    {t.profile.phone || 'Phone'}
                                </Text>
                                <View className="bg-[#F5F5F5] rounded-xl px-4 py-3 border border-[#E0E0E0]">
                                    <TextInput
                                        value={phone}
                                        onChangeText={setPhone}
                                        placeholder={t.profile.phonePlaceholder || 'Enter your phone number'}
                                        className="text-[15px] text-[#333]"
                                        keyboardType="phone-pad"
                                    />
                                </View>
                            </View>

                            <View className="mb-4">
                                <Text className="text-sm font-semibold text-[#333] mb-2">
                                    {t.profile.village || 'Village'}
                                </Text>
                                <View className="bg-[#F5F5F5] rounded-xl px-4 py-3 border border-[#E0E0E0]">
                                    <TextInput
                                        value={village}
                                        onChangeText={setVillage}
                                        placeholder={t.profile.villagePlaceholder || 'Enter your village'}
                                        className="text-[15px] text-[#333]"
                                        autoCapitalize="words"
                                    />
                                </View>
                            </View>

                            <View className="mb-6">
                                <Text className="text-sm font-semibold text-[#333] mb-2">
                                    {t.profile.district || 'District'}
                                </Text>
                                <View className="bg-[#F5F5F5] rounded-xl px-4 py-3 border border-[#E0E0E0]">
                                    <TextInput
                                        value={district}
                                        onChangeText={setDistrict}
                                        placeholder={t.profile.districtPlaceholder || 'Enter your district'}
                                        className="text-[15px] text-[#333]"
                                        autoCapitalize="words"
                                    />
                                </View>
                            </View>

                            {/* Action Buttons */}
                            <View className="flex-row gap-3 mb-6">
                                <TouchableOpacity
                                    onPress={onClose}
                                    className="flex-1 bg-[#F5F5F5] rounded-xl py-4 items-center"
                                    activeOpacity={0.7}
                                >
                                    <Text className="text-[#666] font-bold text-base">
                                        {t.profile.cancel || 'Cancel'}
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={handleSave}
                                    disabled={isSaving}
                                    className="flex-1 bg-[#FF4500] rounded-xl py-4 items-center"
                                    activeOpacity={0.8}
                                >
                                    <LinearGradient
                                        colors={['#FF8C00', '#FF4500']}
                                        className="absolute inset-0 rounded-xl"
                                    />
                                    <Text className="text-white font-bold text-base">
                                        {isSaving ? (t.profile.saving || 'Saving...') : (t.profile.save || 'Save')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}
