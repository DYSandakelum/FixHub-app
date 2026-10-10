import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Platform, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getRoleNameString, useSettings } from './settingsStore';

export default function ProviderProfileScreen() {
    const router = useRouter();
    const { serviceCategory, serviceArea, providerName } = useSettings();

    return (
        <View style={styles.screen}>
            <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

            {/* ── Dark Hero Section ── */}
            <View style={styles.heroBackground}>
                <SafeAreaView edges={['top']} style={{ flex: 1 }}>
                    <View style={styles.heroContainer}>
                        <View style={styles.avatarCircle}>
                            <Ionicons name="person-outline" size={40} color="#2563EB" />
                        </View>
                        <View style={styles.heroInfo}>
                            <Text style={styles.heroName}>{providerName}</Text>
                            <Text style={styles.heroSubtitle}>{getRoleNameString(serviceCategory)} · {serviceArea}</Text>
                        </View>
                    </View>
                </SafeAreaView>
            </View>

            {/* ── Overlapping Stats Card ── */}
            <View style={styles.statsCardWrapper}>
                <View style={styles.statsCard}>
                    <View style={styles.statCol}>
                        <Text style={styles.statValueText}>128</Text>
                        <Text style={styles.statLabelText}>Jobs done</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statCol}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons name="star" size={16} color="#F59E0B" style={{ marginRight: 4 }} />
                            <Text style={styles.statValueText}>4.8</Text>
                        </View>
                        <Text style={styles.statLabelText}>Rating</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statCol}>
                        <Text style={styles.statValueText}>5 yrs</Text>
                        <Text style={styles.statLabelText}>Experience</Text>
                    </View>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* ── Profile Strength ── */}
                <View style={[styles.cardBlock, { marginTop: 12 }]}>
                    <View style={styles.strengthHeader}>
                        <Text style={styles.cardTitle}>Profile strength</Text>
                        <Text style={styles.strengthPercent}>80%</Text>
                    </View>
                    <View style={styles.progressTrack}>
                        <View style={styles.progressFill} />
                    </View>
                    <Text style={styles.strengthHelperText}>Add a certificate to get more job requests.</Text>
                </View>

                {/* ── Nav Menu Card ── */}
                <View style={styles.menuCard}>
                    <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(provider)/serviceProvider-Myaccount')}>
                        <View style={styles.menuIconBox}>
                            <Ionicons name="person-outline" size={20} color="#2563EB" />
                        </View>
                        <View style={styles.menuTextCol}>
                            <Text style={styles.menuTitle}>My Account</Text>
                            <Text style={styles.menuSubtitle}>Name, phone, services and bio</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(provider)/service-provider-settings')}>
                        <View style={styles.menuIconBox}>
                            <Ionicons name="settings-outline" size={20} color="#2563EB" />
                        </View>
                        <View style={styles.menuTextCol}>
                            <Text style={styles.menuTitle}>Settings</Text>
                            <Text style={styles.menuSubtitle}>Hours, notifications, payouts</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={() => router.push('/(provider)/serviceProvider-Help')}>
                        <View style={styles.menuIconBox}>
                            <Ionicons name="help-circle-outline" size={20} color="#2563EB" />
                        </View>
                        <View style={styles.menuTextCol}>
                            <Text style={styles.menuTitle}>Help & support</Text>
                            <Text style={styles.menuSubtitle}>FAQs and contact us</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>

                {/* ── Log out Button ── */}
                <TouchableOpacity style={styles.logoutBtn} onPress={() => router.replace('/')}>
                    <MaterialIcons name="logout" size={20} color="#DC2626" />
                    <Text style={styles.logoutBtnText}>Log out</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>Version 1.0.0</Text>

            </ScrollView>

            {/* Bottom Nav */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(provider)/provider-dashboard')}>
                    <MaterialIcons name="grid-view" size={24} color="#6B7280" style={{ marginBottom: 4 }} />
                    <Text style={styles.navLabel}>Dashboard</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(provider)/provider-schedule')}>
                    <Feather name="calendar" size={24} color="#6B7280" style={{ marginBottom: 4 }} />
                    <Text style={styles.navLabel}>Schedule</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(provider)/provider-earnings')}>
                    <MaterialIcons name="account-balance-wallet" size={24} color="#6B7280" style={{ marginBottom: 4 }} />
                    <Text style={styles.navLabel}>Earnings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItemActive}>
                    <View style={styles.activeIconContainer}>
                        <Feather name="user" size={24} color="#2563EB" />
                    </View>
                    <Text style={styles.navLabelActive}>Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F3F4F6', // Off-white typical for dashboard apps
    },

    // Header
    heroBackground: {
        backgroundColor: '#0F172A',
        height: 180, // Approximate height accounting for content & overlap padding
        borderBottomLeftRadius: 36,
        borderBottomRightRadius: 36,
        paddingHorizontal: 20,
    },
    heroContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
    },
    avatarCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    heroInfo: {
        justifyContent: 'center',
    },
    heroName: {
        fontSize: 22,
        fontWeight: '800',
        color: '#fff',
        marginBottom: 4,
    },
    heroSubtitle: {
        fontSize: 14,
        color: '#9CA3AF',
        fontWeight: '500',
    },

    // Stats Card (Overlapping)
    statsCardWrapper: {
        paddingHorizontal: 20,
        marginTop: -45, // Critical overlap
        zIndex: 10,
        elevation: 10,
    },
    statsCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 10,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
    },
    statCol: {
        flex: 1,
        alignItems: 'center',
    },
    statValueText: {
        fontSize: 20,
        fontWeight: '900',
        color: '#0F172A',
        marginBottom: 2,
    },
    statLabelText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748B',
    },
    statDivider: {
        width: 1,
        height: 36,
        backgroundColor: '#F3F4F6',
    },

    scrollContent: {
        paddingHorizontal: 20,
        paddingTop: 8,
        paddingBottom: 40,
    },

    // Reusable Card Style
    cardBlock: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '900',
        color: '#0F172A',
    },

    // Profile Strength
    strengthHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    strengthPercent: {
        fontSize: 16,
        fontWeight: '800',
        color: '#2563EB',
    },
    progressTrack: {
        height: 8,
        backgroundColor: '#EEF2FF',
        borderRadius: 4,
        width: '100%',
        marginBottom: 12,
    },
    progressFill: {
        height: '100%',
        width: '80%',
        backgroundColor: '#2563EB',
        borderRadius: 4,
    },
    strengthHelperText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4B5563',
    },

    // Menu Card
    menuCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.03,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 18,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    menuIconBox: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    menuTextCol: {
        flex: 1,
        justifyContent: 'center',
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 2,
    },
    menuSubtitle: {
        fontSize: 13,
        fontWeight: '500',
        color: '#64748B',
    },

    // Logout
    logoutBtn: {
        backgroundColor: '#FEF2F2',
        borderRadius: 16,
        paddingVertical: 18,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    logoutBtnText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#DC2626',
        marginLeft: 8,
    },
    versionText: {
        textAlign: 'center',
        fontSize: 13,
        color: '#9CA3AF',
        fontWeight: '500',
        marginBottom: 20,
    },

    // Bottom Nav
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: '#fff',
        paddingBottom: Platform.OS === 'ios' ? 24 : 12,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: -4 },
        elevation: 10,
    },
    navItem: { alignItems: 'center', flex: 1, gap: 6, paddingTop: 6 },
    navLabel: { fontSize: 11, color: '#4B5563', fontWeight: '700' },
    navItemActive: { alignItems: 'center', flex: 1, gap: 4 },
    activeIconContainer: {
        backgroundColor: '#EFF6FF',
        width: 52,
        height: 36,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 18,
    },
    navLabelActive: { fontSize: 12, color: '#2563EB', fontWeight: '800' },
});
