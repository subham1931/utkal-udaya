import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

export default function SettingsScreen() {
    const SettingItem = ({ icon, title, subtitle, onPress, color = '#555' }: any) => (
        <TouchableOpacity style={styles.item} activeOpacity={0.7} onPress={onPress}>
            <View style={styles.itemLeft}>
                <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
                    <Ionicons name={icon} size={22} color={color} />
                </View>
                <View>
                    <Text style={styles.itemTitle}>{title}</Text>
                    {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
                </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#CCC" />
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Header */}
                <LinearGradient colors={['#FF8C00', '#FF4500']} style={styles.header}>
                    <Text style={styles.headerTitle}>ସେଟିଙ୍ଗସ୍ (Settings)</Text>
                    <Text style={styles.headerSubtitle}>Legal & Support Center</Text>
                </LinearGradient>

                <View style={styles.content}>
                    {/* Legal Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>ଆଇନଗତ (Legal)</Text>
                        <View style={styles.card}>
                            <SettingItem
                                icon="document-text-outline"
                                title="ନିୟମ ଏବଂ ସର୍ତ୍ତାବଳୀ"
                                subtitle="Terms of Services"
                                color="#FF8C00"
                            />
                            <SettingItem
                                icon="shield-checkmark-outline"
                                title="ଗୋପନୀୟତା ନୀତି"
                                subtitle="Privacy Policy"
                                color="#4CAF50"
                            />
                        </View>
                    </View>

                    {/* Support Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>ସହାୟତା (Support)</Text>
                        <View style={styles.card}>
                            <SettingItem
                                icon="call-outline"
                                title="ଆମ ସହିତ ଯୋଗାଯୋଗ କରନ୍ତୁ"
                                subtitle="Contact Us"
                                color="#0288D1"
                            />
                            <SettingItem
                                icon="mail-outline"
                                title="ଇମେଲ୍ ସହାୟତା"
                                subtitle="Email Support"
                                color="#E91E63"
                            />
                        </View>
                    </View>

                    {/* App Info Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>ଅନ୍ୟାନ୍ୟ (Others)</Text>
                        <View style={styles.card}>
                            <SettingItem
                                icon="star-outline"
                                title="ଆପ୍‌କୁ ରେଟିଂ ଦିଅନ୍ତୁ"
                                subtitle="Rate our App"
                                color="#FBC02D"
                            />
                            <SettingItem
                                icon="share-social-outline"
                                title="ସାଙ୍ଗମାନଙ୍କ ସହିତ ସେୟାର କରନ୍ତୁ"
                                subtitle="Share with Friends"
                                color="#673AB7"
                            />
                        </View>
                    </View>

                    <Text style={styles.footerVersion}>ଉତ୍କଳ ଉଦୟ v1.0.0</Text>
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
    header: {
        padding: 24,
        paddingBottom: 40,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 4,
    },
    content: {
        padding: 20,
    },
    section: {
        marginBottom: 25,
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 10,
        marginLeft: 5,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 20,
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
        fontWeight: '700',
        color: '#333',
    },
    itemSubtitle: {
        fontSize: 11,
        color: '#999',
        marginTop: 2,
    },
    footerVersion: {
        textAlign: 'center',
        color: '#AAA',
        fontSize: 12,
        marginTop: 10,
        marginBottom: 30,
    }
});
