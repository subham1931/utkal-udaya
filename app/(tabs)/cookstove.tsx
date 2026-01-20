import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CookstoveScreen() {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Cookstove</Text>
                    <Text style={styles.headerSubtitle}>Monitor your clean cooking impact</Text>
                </View>

                <View style={styles.statsContainer}>
                    <LinearGradient
                        colors={['#4CAF50', '#2E7D32']}
                        style={styles.mainStatCard}
                    >
                        <View>
                            <Text style={styles.statLabel}>CO2 Saved</Text>
                            <Text style={styles.statValue}>12.5 kg</Text>
                        </View>
                        <Ionicons name="leaf-outline" size={50} color="rgba(255,255,255,0.4)" />
                    </LinearGradient>

                    <View style={styles.secondaryStats}>
                        <View style={styles.smallStatCard}>
                            <Text style={styles.smallStatLabel}>Status</Text>
                            <Text style={styles.smallStatValue}>Active</Text>
                        </View>
                        <View style={styles.smallStatCard}>
                            <Text style={styles.smallStatLabel}>Hours Used</Text>
                            <Text style={styles.smallStatValue}>24h</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Maintenance</Text>
                    <TouchableOpacity style={styles.actionCard}>
                        <View style={styles.actionIcon}>
                            <Ionicons name="construct-outline" size={24} color="#FF8C00" />
                        </View>
                        <View style={styles.actionInfo}>
                            <Text style={styles.actionTitle}>Service Check</Text>
                            <Text style={styles.actionDesc}>Next scheduled: 15 Feb 2026</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#CCC" />
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Usage History</Text>
                    <View style={styles.historyCard}>
                        <Text style={styles.historyText}>No recent usage logs available.</Text>
                    </View>
                </View>
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
    headerSubtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 4,
    },
    statsContainer: {
        padding: 20,
    },
    mainStatCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 30,
        borderRadius: 25,
        marginBottom: 20,
    },
    statLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 16,
        fontWeight: '500',
    },
    statValue: {
        color: '#FFF',
        fontSize: 36,
        fontWeight: 'bold',
    },
    secondaryStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    smallStatCard: {
        backgroundColor: '#FFF',
        width: '47%',
        padding: 20,
        borderRadius: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 5,
    },
    smallStatLabel: {
        color: '#888',
        fontSize: 14,
        marginBottom: 5,
    },
    smallStatValue: {
        color: '#1A1A1A',
        fontSize: 20,
        fontWeight: '700',
    },
    section: {
        padding: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#1A1A1A',
        marginBottom: 15,
    },
    actionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 15,
        elevation: 2,
    },
    actionIcon: {
        width: 45,
        height: 45,
        backgroundColor: '#FFF5E6',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionInfo: {
        flex: 1,
        marginLeft: 15,
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1A1A1A',
    },
    actionDesc: {
        fontSize: 13,
        color: '#888',
    },
    historyCard: {
        padding: 40,
        backgroundColor: '#FFF',
        borderRadius: 15,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#CCC',
        alignItems: 'center',
    },
    historyText: {
        color: '#999',
    },
});
