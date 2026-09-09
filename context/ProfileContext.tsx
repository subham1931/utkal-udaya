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
    login: (userData?: Partial<UserProfile>) => Promise<void>;
    logout: () => Promise<void>;
    isLoggedIn: boolean;
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
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const [savedProfile, loggedInFlag] = await Promise.all([
                AsyncStorage.getItem('user-profile'),
                AsyncStorage.getItem('is-logged-in'),
            ]);

            if (savedProfile) {
                const parsed = JSON.parse(savedProfile);
                setProfile({ ...defaultProfile, ...parsed });
            }

            // If user explicitly logged out previously
            if (loggedInFlag === 'false') {
                setIsLoggedIn(false);
            } else if (loggedInFlag === 'true' || savedProfile !== null) {
                setIsLoggedIn(true);
            } else {
                // If unset (active app session), keep logged in by default until explicit logout
                setIsLoggedIn(true);
            }
        } catch (error) {
            console.error('Failed to load profile', error);
            setIsLoggedIn(false);
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
            await Promise.all([
                AsyncStorage.setItem('user-profile', JSON.stringify(updatedProfile)),
                AsyncStorage.setItem('is-logged-in', 'true'),
            ]);
            setIsLoggedIn(true);
        } catch (error) {
            console.error('Failed to update profile', error);
            throw error;
        }
    };

    const login = async (userData?: Partial<UserProfile>) => {
        try {
            await AsyncStorage.setItem('is-logged-in', 'true');
            setIsLoggedIn(true);
            if (userData) {
                await updateProfile(userData);
            }
        } catch (error) {
            console.error('Failed to log in', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('user-profile');
            await AsyncStorage.setItem('is-logged-in', 'false');
            setProfile(defaultProfile);
            setIsLoggedIn(false);
        } catch (error) {
            console.error('Failed to logout', error);
        }
    };

    const value = {
        profile,
        updateProfile,
        login,
        logout,
        isLoggedIn,
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
