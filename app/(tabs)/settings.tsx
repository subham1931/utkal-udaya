import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

export default function SettingsScreen() {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    const SettingItem = ({ icon, title, value, type = 'chevron' }: any) => (
        <TouchableOpacity style={styles.item}>
            <View style={styles.itemLeft}>
                <View style={styles.iconBox}>
                    <Ionicons name={icon} size={22} color="#555" />
                </View>
                <Text style={styles.itemTitle}>{title}</Text>
            </View>
            {type === 'chevron' ? (
                <Ionicons name="chevron-forward" size={20} color="#CCC" />
            ) : type === 'switch' ? (
                <Switch
                    value={value}
                    onValueChange={(val) => {
                        if (title === 'Notifications') setNotifications(val);
                        if (title === 'Dark Mode') setDarkMode(val);
                    }}
                    trackColor={{ false: '#EEE', true: '#FF8C00' }}
                />
            ) : null}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Settings</Text>
                </View>

                <View style={styles.profileSection}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>UU</Text>
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>Utkal Uday User</Text>
                        <Text style={styles.profileEmail}>user@utkaluday.com</Text>
                    </View>
                    <TouchableOpacity style={styles.editBtn}>
                        <Text style={styles.editBtnText}>Edit</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>App Settings</Text>
                    <View style={styles.card}>
                        <SettingItem icon="notifications-outline" title="Notifications" type="switch" value={notifications} />
                        <SettingItem icon="moon-outline" title="Dark Mode" type="switch" value={darkMode} />
                        <SettingItem icon="language-outline" title="Language" />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support</Text>
                    <View style={styles.card}>
                        <SettingItem icon="help-circle-outline" title="Help Center" />
                        <SettingItem icon="shield-checkmark-outline" title="Privacy Policy" />
                        <SettingItem icon="information-circle-outline" title="About App" />
                    </View>
                </View>

                <TouchableOpacity style={styles.logoutBtn}>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>Version 1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    header: {
        padding: 24,
        backgroundColor: '#FFF',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1A1A1A',
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#FFF',
        marginBottom: 20,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FF8C00',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    profileInfo: {
        flex: 1,
        marginLeft: 15,
    },
    profileName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
    },
    profileEmail: {
        fontSize: 14,
        color: '#666',
    },
    editBtn: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F0F0F0',
    },
    editBtnText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#555',
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#888',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 10,
        marginLeft: 5,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
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
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: '#F8F9FA',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    itemTitle: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    logoutBtn: {
        marginHorizontal: 24,
        padding: 18,
        borderRadius: 15,
        backgroundColor: '#FFF',
        alignItems: 'center',
        marginTop: 10,
        borderWidth: 1,
        borderColor: '#FFEBEB',
    },
    logoutText: {
        color: '#FF3B30',
        fontWeight: '700',
        fontSize: 16,
    },
    versionText: {
        textAlign: 'center',
        color: '#BBB',
        fontSize: 12,
        marginTop: 20,
        marginBottom: 40,
    }
});
