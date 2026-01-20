import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    const SettingItem = ({ icon, title, value, type = 'chevron', color = '#555' }: any) => (
        <TouchableOpacity style={styles.item} activeOpacity={0.7}>
            <View style={styles.itemLeft}>
                <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
                    <Ionicons name={icon} size={22} color={color} />
                </View>
                <Text style={styles.itemTitle}>{title}</Text>
            </View>
            {type === 'switch' ? (
                <Switch
                    value={value}
                    onValueChange={(val) => {
                        if (title.includes('ବାର୍ତ୍ତା')) setNotifications(val);
                        if (title.includes('ଡାର୍କ ମୋଡ୍')) setDarkMode(val);
                    }}
                    trackColor={{ false: '#EEE', true: '#FF8C00' }}
                    thumbColor={value ? '#FF4500' : '#f4f3f4'}
                />
            ) : (
                <Ionicons name="chevron-forward" size={18} color="#CCC" />
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Modern Profile Hero */}
                <LinearGradient colors={['#FF8C00', '#FF4500']} style={styles.hero}>
                    <View style={styles.profileHeader}>
                        <View style={styles.avatarContainer}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>UU</Text>
                            </View>
                            <TouchableOpacity style={styles.cameraIcon}>
                                <Ionicons name="camera" size={16} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.profileName}>ଉତ୍କଳ ଉଦୟ ବ୍ୟବହାରକାରୀ</Text>
                        <Text style={styles.profileId}>ID: UU-2026-001</Text>
                    </View>
                </LinearGradient>

                <View style={styles.content}>
                    {/* Achievement Summary Card */}
                    <View style={styles.impactCard}>
                        <View style={styles.impactItem}>
                            <Text style={styles.impactValue}>୧୨.୫ କେଜି</Text>
                            <Text style={styles.impactLabel}>CO2 ବଞ୍ଚାଗଲା</Text>
                        </View>
                        <View style={styles.impactDivider} />
                        <View style={styles.impactItem}>
                            <Text style={styles.impactValue}>୪</Text>
                            <Text style={styles.impactLabel}>ପଦକ ଜିତିଛନ୍ତି</Text>
                        </View>
                    </View>

                    {/* Badges Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>ମୋର ପଦକ (My Badges)</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgeScroll}>
                            {[
                                { name: 'ପ୍ରକୃତି ବନ୍ଧୁ', icon: 'leaf', color: '#4CAF50' },
                                { name: 'ସ୍ୱଚ୍ଛ ରନ୍ଧନ', icon: 'flame', color: '#FF8C00' },
                                { name: 'ସଚେତନ କୃଷକ', icon: 'school', color: '#0288D1' },
                                { name: 'ପରିବେଶ ରକ୍ଷକ', icon: 'shield', color: '#D81B60' },
                            ].map((badge, idx) => (
                                <View key={idx} style={styles.badgeItem}>
                                    <View style={[styles.badgeIcon, { backgroundColor: badge.color + '20' }]}>
                                        <Ionicons name={badge.icon as any} size={28} color={badge.color} />
                                    </View>
                                    <Text style={styles.badgeText}>{badge.name}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>ଆଭିମୁଖ୍ୟ ଓ ନୀତି (Preferences)</Text>
                        <View style={styles.card}>
                            <SettingItem icon="notifications-outline" title="ବାର୍ତ୍ତା (Notifications)" type="switch" value={notifications} color="#FF4500" />
                            <SettingItem icon="moon-outline" title="ଡାର୍କ ମୋଡ୍ (Dark Mode)" type="switch" value={darkMode} color="#5E35B1" />
                            <SettingItem icon="language-outline" title="ଭାଷା (Language)" color="#00897B" />
                        </View>
                    </View>

                    <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.8}>
                        <LinearGradient
                            colors={['#FFF', '#FFF']}
                            style={styles.logoutGradient}
                        >
                            <Ionicons name="log-out-outline" size={22} color="#FF3B30" />
                            <Text style={styles.logoutText}>ଲଗ୍ ଆଉଟ୍</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <Text style={styles.versionText}>ସଂସ୍କରଣ (Version) 1.0.0</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F7FF',
    },
    hero: {
        paddingTop: 30,
        paddingBottom: 40,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        alignItems: 'center',
    },
    profileHeader: {
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderWidth: 3,
        borderColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#FFF',
        fontSize: 36,
        fontWeight: 'bold',
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        backgroundColor: '#FF4500',
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFF',
    },
    profileName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFF',
        marginBottom: 4,
    },
    profileId: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '500',
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
        marginBottom: 12,
        marginLeft: 5,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 25,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    itemTitle: {
        fontSize: 15,
        color: '#333',
        fontWeight: '600',
    },
    logoutBtn: {
        marginTop: 10,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    logoutGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        backgroundColor: '#FFF',
    },
    logoutText: {
        color: '#FF3B30',
        fontWeight: 'bold',
        fontSize: 16,
        marginLeft: 10,
    },
    impactCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 25,
        padding: 20,
        marginBottom: 25,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    impactItem: {
        alignItems: 'center',
    },
    impactValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    impactLabel: {
        fontSize: 10,
        color: '#666',
        marginTop: 4,
        fontWeight: '600',
    },
    impactDivider: {
        width: 1,
        height: 30,
        backgroundColor: '#EEE',
    },
    badgeScroll: {
        marginBottom: 10,
    },
    badgeItem: {
        alignItems: 'center',
        marginRight: 20,
    },
    badgeIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#444',
    },
    versionText: {
        textAlign: 'center',
        color: '#AAA',
        fontSize: 12,
        marginTop: 30,
        marginBottom: 40,
    }
});
