import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';

export default function CookstoveScreen() {
    const [serialNo, setSerialNo] = useState('');
    const [aadhaarNo, setAadhaarNo] = useState('');

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Modern Hero Header */}
                    <LinearGradient colors={['#FF8C00', '#FF4500']} style={styles.heroHeader}>
                        <Text style={styles.heroTitle}>ଉନ୍ନତ ଚୁଲି</Text>
                        <Text style={styles.heroSubtitle}>ଆପଣଙ୍କ ସ୍ୱଚ୍ଛ ରୋଷେଇର ପ୍ରଭାବ ଦେଖନ୍ତୁ</Text>
                    </LinearGradient>

                    <View style={styles.statsContainer}>
                        <LinearGradient
                            colors={['#4CAF50', '#2E7D32']}
                            style={styles.mainStatCard}
                        >
                            <View>
                                <Text style={styles.statLabel}>CO2 ବଞ୍ଚାଗଲା</Text>
                                <Text style={styles.statValue}>12.5 କି.ଗ୍ରା</Text>
                            </View>
                            <Ionicons name="leaf-outline" size={50} color="rgba(255,255,255,0.4)" />
                        </LinearGradient>

                        <View style={styles.secondaryStats}>
                            <View style={styles.smallStatCard}>
                                <Text style={styles.smallStatLabel}>ସ୍ଥିତି</Text>
                                <Text style={styles.smallStatValue}>ସକ୍ରିୟ</Text>
                            </View>
                            <View style={styles.smallStatCard}>
                                <Text style={styles.smallStatLabel}>ବ୍ୟବହାର ସମୟ</Text>
                                <Text style={styles.smallStatValue}>24 ଘଣ୍ଟା</Text>
                            </View>
                        </View>
                    </View>

                    {/* Village Leaderboard Snippet */}
                    <View style={styles.leaderboardCard}>
                        <View style={styles.leaderHeader}>
                            <Ionicons name="trophy-outline" size={20} color="#FFD700" />
                            <Text style={styles.leaderTitle}>ଗ୍ରାମ ସ୍ତରୀୟ ମାନ୍ୟତା (Village Rank)</Text>
                        </View>
                        <View style={styles.leaderRow}>
                            <Text style={styles.leaderRank}># ୮</Text>
                            <Text style={styles.leaderName}>ଆପଣଙ୍କ ସ୍ଥିତି</Text>
                            <Text style={styles.leaderPoints}>୧୨୫ କାର୍ବନ ପଏଣ୍ଟ</Text>
                        </View>
                    </View>

                    {/* Maintenance Checklist */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>ପରିଚାଳନା ଯାଞ୍ଚ ତାଲିକା (Maintenance)</Text>
                        <View style={styles.checklistCard}>
                            {[
                                { task: 'ଚୁଲିକୁ ସଫା ରଖନ୍ତୁ', status: true },
                                { task: 'ଫାଟ ଯାଞ୍ଚ କରନ୍ତୁ', status: true },
                                { task: 'ଠିକ ଭାବେ କାଠ ବ୍ୟବହାର', status: false },
                            ].map((item, idx) => (
                                <View key={idx} style={styles.checkItem}>
                                    <View style={[styles.checkCircle, item.status && styles.checkActive]}>
                                        <Ionicons name={item.status ? "checkmark" : "time-outline"} size={14} color="#FFF" />
                                    </View>
                                    <Text style={[styles.checkText, !item.status && styles.checkPending]}>{item.task}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Modern Callback Section */}
                    <View style={styles.callbackCard}>
                        <View style={styles.callbackHeader}>
                            <View style={styles.iconCircle}>
                                <Ionicons name="call-outline" size={24} color="#FF4500" />
                            </View>
                            <Text style={styles.callbackQuestion}>
                                ଆପଣ କୌଣସି ସମସ୍ୟାର ସମ୍ମୁଖୀନ ହେଉଛନ୍ତି କି?
                            </Text>
                        </View>

                        <Text style={styles.callbackDesc}>
                            କେବଳ ଏକ କଲ ପାଇଁ ଅନୁରୋଧ କରନ୍ତୁ, ଏବଂ ଆମେ ଯଥାଶୀଘ୍ର ଆପଣଙ୍କ ନିକଟରେ ପହଞ୍ଚିବୁ ।
                        </Text>

                        <View style={styles.formGroup}>
                            <Text style={styles.inputLabel}>ଚୁଲି ସିରିଏଲ ନମ୍ବର (Serial No.)</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="barcode-outline" size={20} color="#666" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter Serial Number"
                                    value={serialNo}
                                    onChangeText={setSerialNo}
                                    placeholderTextColor="#999"
                                />
                            </View>
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.inputLabel}>ଆଧାର ନମ୍ବର (Aadhaar No.)</Text>
                            <View style={styles.inputWrapper}>
                                <Ionicons name="card-outline" size={20} color="#666" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="xxxx xxxx xxxx"
                                    value={aadhaarNo}
                                    onChangeText={setAadhaarNo}
                                    keyboardType="numeric"
                                    placeholderTextColor="#999"
                                    maxLength={14}
                                />
                            </View>
                        </View>

                        <TouchableOpacity style={styles.submitBtn} activeOpacity={0.8}>
                            <LinearGradient
                                colors={['#4CAF50', '#388E3C']}
                                style={styles.btnGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Text style={styles.submitText}>କଲବ୍ୟାକ୍ ଅନୁରୋଧ କରନ୍ତୁ</Text>
                                <Ionicons name="paper-plane" size={18} color="#FFF" style={{ marginLeft: 10 }} />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.bottomSpace} />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F7FF',
    },
    heroHeader: {
        padding: 24,
        paddingBottom: 60,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    heroTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF',
    },
    heroSubtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.9)',
        marginTop: 5,
    },
    statsContainer: {
        padding: 20,
        marginTop: -40,
    },
    mainStatCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 25,
        borderRadius: 25,
        marginBottom: 15,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
    },
    statLabel: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 15,
        fontWeight: '600',
    },
    statValue: {
        color: '#FFF',
        fontSize: 32,
        fontWeight: 'bold',
    },
    secondaryStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    smallStatCard: {
        backgroundColor: '#FFF',
        width: '48%',
        padding: 18,
        borderRadius: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    smallStatLabel: {
        color: '#888',
        fontSize: 13,
        marginBottom: 5,
        fontWeight: '600',
    },
    smallStatValue: {
        color: '#1A1A1A',
        fontSize: 20,
        fontWeight: '700',
    },
    leaderboardCard: {
        backgroundColor: '#FFF',
        marginHorizontal: 20,
        padding: 20,
        borderRadius: 25,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        marginBottom: 20,
    },
    leaderHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    leaderTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#444',
        marginLeft: 8,
    },
    leaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        padding: 12,
        borderRadius: 15,
    },
    leaderRank: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF8C00',
    },
    leaderName: {
        fontSize: 14,
        color: '#333',
        fontWeight: '600',
    },
    leaderPoints: {
        fontSize: 12,
        color: '#2E7D32',
        fontWeight: 'bold',
    },
    sectionContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    checklistCard: {
        backgroundColor: '#FFF',
        borderRadius: 25,
        padding: 20,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    checkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    checkCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    checkActive: {
        backgroundColor: '#4CAF50',
    },
    checkText: {
        fontSize: 14,
        color: '#333',
        fontWeight: '500',
    },
    checkPending: {
        color: '#888',
    },
    callbackCard: {
        backgroundColor: '#FFF',
        margin: 20,
        padding: 24,
        borderRadius: 25,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    callbackHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    iconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFF5F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    callbackQuestion: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        lineHeight: 24,
    },
    callbackDesc: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 25,
    },
    formGroup: {
        marginBottom: 18,
    },
    inputLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#555',
        marginBottom: 8,
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#EDEFEF',
        paddingHorizontal: 15,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
        color: '#333',
        fontSize: 15,
    },
    submitBtn: {
        marginTop: 10,
        height: 55,
        borderRadius: 15,
        overflow: 'hidden',
    },
    btnGradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    submitText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    bottomSpace: {
        height: 40,
    },
});
