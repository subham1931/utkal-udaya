import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface UserProfile {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    village?: string;
    district?: string;
    profileImageUri?: string;
    initials: string;
    co2Saved: number;
    badgesWon: number;
}

type ProfileContextType = {
    profile: UserProfile;
    updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
};

const defaultProfile: UserProfile = {
    id: 'UU-2026-001',
    name: 'ଉତ୍କଳ ଉଦୟ ବ୍ୟବହାରକାରୀ',
    initials: 'UU',
    co2Saved: 12.5,
    badgesWon: 4,
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
    const [profile, setProfile] = useState<UserProfile>(defaultProfile);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const savedProfile = await AsyncStorage.getItem('user-profile');
            if (savedProfile) {
                const parsed = JSON.parse(savedProfile);
                setProfile({ ...defaultProfile, ...parsed });
            }
        } catch (error) {
            console.error('Failed to load profile', error);
        } finally {
            setIsLoading(false);
        }
    };

    const updateProfile = async (updates: Partial<UserProfile>) => {
        try {
            const updatedProfile = { ...profile, ...updates };

            // Update initials if name changed
            if (updates.name) {
                const nameParts = updates.name.trim().split(' ');
                if (nameParts.length >= 2) {
                    updatedProfile.initials = (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
                } else if (nameParts.length === 1 && nameParts[0].length > 0) {
                    updatedProfile.initials = nameParts[0].substring(0, 2).toUpperCase();
                } else {
                    updatedProfile.initials = 'UU';
                }
            }

            setProfile(updatedProfile);
            await AsyncStorage.setItem('user-profile', JSON.stringify(updatedProfile));
        } catch (error) {
            console.error('Failed to update profile', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('user-profile');
            setProfile(defaultProfile);
        } catch (error) {
            console.error('Failed to logout', error);
        }
    };

    const value = {
        profile,
        updateProfile,
        logout,
        isLoading,
    };

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
}

export function useProfile() {
    const context = useContext(ProfileContext);
    if (context === undefined) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
}
