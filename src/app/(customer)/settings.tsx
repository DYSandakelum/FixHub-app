import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    Alert,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUserProfile } from '../../lib/users';

const TEMP_CUSTOMER_ID = '18b0a243-3adc-42fc-aadf-faa7cc698a6d';

export default function SettingsScreen() {
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);

    // Customer-specific toggle states (preserving identical styling)
    const [expressBooking, setExpressBooking] = useState(true);
    const [emergencyRequests, setEmergencyRequests] = useState(false);
    const [bookingAlerts, setBookingAlerts] = useState(true);
    const [quietHours, setQuietHours] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    const loadProfile = useCallback(async () => {
        const data = await getUserProfile(TEMP_CUSTOMER_ID);
        if (data) setProfile(data);
    }, []);

    useFocusEffect(
        useCallback(() => {
            loadProfile();
        }, [loadProfile])
    );

    function handleBack() {
        if (router.canGoBack()) {
            router.back();
        } else {
            router.push('/(customer)/home');
        }
    }

    function handleServiceHours() {
        Alert.alert('Preferred Service Hours', 'Choose when technicians can visit your location.\nCurrent: 8:00 AM – 6:00 PM');
    }

    function handleAppointmentReminders() {
        Alert.alert('Appointment Reminders', 'Set advance reminder time before technician arrives.\nCurrent: 1 hr before service');
    }

    function handlePaymentMethod() {
        Alert.alert('Saved Payment Method', 'Primary Payment Method:\nVisa ••4821\nCommercial Bank');
    }

    function handleBillingHistory() {
        Alert.alert('Billing History', 'View past booking invoices and payment receipts in the Bookings tab.');
    }

    function handleLanguage() {
        Alert.alert('Language', 'Current app language: English (US)');
    }

    function handleLogout() {
        Alert.alert('Log Out', 'Are you sure you want to log out of your FixHub account?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Log Out',
                style: 'destructive',
                onPress: () => {
                    Alert.alert('Logged out', 'You have been logged out.');
                },
            },
        ]);
    }

    return (
        <View style={styles.screen}>
            <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

            {/* ── Dark Navy Curved Hero Header (Matching Screenshot) ── */}
            <View style={styles.headerHero}>
                <SafeAreaView edges={['top']} style={styles.safeArea}>
                    <View style={styles.headerRow}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={handleBack}
                            activeOpacity={0.7}
                        >
                            <MaterialIcons name="chevron-left" size={26} color="#FFFFFF" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Settings</Text>
                    </View>
                </SafeAreaView>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Standalone Feature Card: Express Booking ── */}
                <View style={styles.vacationCard}>
                    <View style={styles.cardLeft}>
                        <View style={styles.sunIconBox}>
                            <MaterialIcons name="bolt" size={24} color="#D97706" />
                        </View>
                        <View style={styles.cardTextCol}>
                            <Text style={styles.vacationTitle}>Express booking</Text>
                            <Text style={styles.cardSubtitle}>Auto-confirm available verified experts</Text>
                        </View>
                    </View>
                    <Switch
                        value={expressBooking}
                        onValueChange={setExpressBooking}
                        trackColor={{ false: '#CBD5E1', true: '#2563EB' }}
                        thumbColor="#FFFFFF"
                    />
                </View>

                {/* ── BOOKING PREFERENCES ── */}
                <Text style={styles.sectionHeader}>BOOKING PREFERENCES</Text>
                <View style={styles.groupedCard}>
                    {/* Preferred service hours */}
                    <TouchableOpacity
                        style={styles.settingRow}
                        onPress={handleServiceHours}
                        activeOpacity={0.7}
                    >
                        <View style={styles.settingRowLeft}>
                            <View style={styles.iconBox}>
                                <Feather name="clock" size={18} color="#2563EB" />
                            </View>
                            <Text style={styles.rowTitle}>Preferred service hours</Text>
                        </View>
                        <View style={styles.rowRight}>
                            <Text style={styles.rowValueText}>8:00 AM – 6:00 PM</Text>
                            <MaterialIcons name="chevron-right" size={20} color="#94A3B8" />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    {/* Emergency repair requests */}
                    <View style={styles.settingRow}>
                        <View style={styles.settingRowLeft}>
                            <View style={styles.iconBox}>
                                <Feather name="zap" size={18} color="#2563EB" />
                            </View>
                            <View style={styles.cardTextCol}>
                                <Text style={styles.rowTitle}>Emergency repair requests</Text>
                                <Text style={styles.cardSubtitle}>Priority dispatch for urgent home issues</Text>
                            </View>
                        </View>
                        <Switch
                            value={emergencyRequests}
                            onValueChange={setEmergencyRequests}
                            trackColor={{ false: '#CBD5E1', true: '#2563EB' }}
                            thumbColor="#FFFFFF"
                        />
                    </View>
                </View>

                {/* ── NOTIFICATIONS ── */}
                <Text style={styles.sectionHeader}>NOTIFICATIONS</Text>
                <View style={styles.groupedCard}>
                    {/* Booking status alerts */}
                    <View style={styles.settingRow}>
                        <View style={styles.settingRowLeft}>
                            <View style={styles.iconBox}>
                                <Feather name="bell" size={18} color="#2563EB" />
                            </View>
                            <View style={styles.cardTextCol}>
                                <Text style={styles.rowTitle}>Booking status alerts</Text>
                                <Text style={styles.cardSubtitle}>Sound and vibration updates</Text>
                            </View>
                        </View>
                        <Switch
                            value={bookingAlerts}
                            onValueChange={setBookingAlerts}
                            trackColor={{ false: '#CBD5E1', true: '#2563EB' }}
                            thumbColor="#FFFFFF"
                        />
                    </View>

                    <View style={styles.divider} />

                    {/* Appointment reminders */}
                    <TouchableOpacity
                        style={styles.settingRow}
                        onPress={handleAppointmentReminders}
                        activeOpacity={0.7}
                    >
                        <View style={styles.settingRowLeft}>
                            <View style={styles.iconBox}>
                                <MaterialIcons name="timer" size={19} color="#2563EB" />
                            </View>
                            <Text style={styles.rowTitle}>Appointment reminders</Text>
                        </View>
                        <View style={styles.rowRight}>
                            <Text style={styles.rowValueText}>1 hr before</Text>
                            <MaterialIcons name="chevron-right" size={20} color="#94A3B8" />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    {/* Quiet hours */}
                    <View style={styles.settingRow}>
                        <View style={styles.settingRowLeft}>
                            <View style={styles.iconBox}>
                                <Feather name="moon" size={18} color="#2563EB" />
                            </View>
                            <View style={styles.cardTextCol}>
                                <Text style={styles.rowTitle}>Quiet hours</Text>
                                <Text style={styles.cardSubtitle}>10:00 PM – 6:00 AM</Text>
                            </View>
                        </View>
                        <Switch
                            value={quietHours}
                            onValueChange={setQuietHours}
                            trackColor={{ false: '#CBD5E1', true: '#2563EB' }}
                            thumbColor="#FFFFFF"
                        />
                    </View>
                </View>

                {/* ── PAYMENTS & BILLING ── */}
                <Text style={styles.sectionHeader}>PAYMENTS & BILLING</Text>
                <View style={styles.groupedCard}>
                    {/* Saved payment method */}
                    <TouchableOpacity
                        style={styles.settingRow}
                        onPress={handlePaymentMethod}
                        activeOpacity={0.7}
                    >
                        <View style={styles.settingRowLeft}>
                            <View style={styles.iconBox}>
                                <Feather name="credit-card" size={18} color="#2563EB" />
                            </View>
                            <Text style={styles.rowTitle}>Payment method</Text>
                        </View>
                        <View style={styles.rowRight}>
                            <Text style={styles.rowValueText}>Visa ••4821</Text>
                            <MaterialIcons name="chevron-right" size={20} color="#94A3B8" />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    {/* Billing history */}
                    <TouchableOpacity
                        style={styles.settingRow}
                        onPress={handleBillingHistory}
                        activeOpacity={0.7}
                    >
                        <View style={styles.settingRowLeft}>
                            <View style={styles.iconBox}>
                                <Feather name="file-text" size={18} color="#2563EB" />
                            </View>
                            <Text style={styles.rowTitle}>Billing & receipts</Text>
                        </View>
                        <View style={styles.rowRight}>
                            <Text style={styles.rowValueText}>View history</Text>
                            <MaterialIcons name="chevron-right" size={20} color="#94A3B8" />
                        </View>
                    </TouchableOpacity>
                </View>

                {/* ── APP ── */}
                <Text style={styles.sectionHeader}>APP</Text>
                <View style={styles.groupedCard}>
                    {/* Language */}
                    <TouchableOpacity
                        style={styles.settingRow}
                        onPress={handleLanguage}
                        activeOpacity={0.7}
                    >
                        <View style={styles.settingRowLeft}>
                            <View style={styles.iconBox}>
                                <Feather name="globe" size={18} color="#2563EB" />
                            </View>
                            <Text style={styles.rowTitle}>Language</Text>
                        </View>
                        <View style={styles.rowRight}>
                            <Text style={styles.rowValueText}>English</Text>
                            <MaterialIcons name="chevron-right" size={20} color="#94A3B8" />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    {/* Dark mode */}
                    <View style={styles.settingRow}>
                        <View style={styles.settingRowLeft}>
                            <View style={styles.iconBox}>
                                <Feather name="moon" size={18} color="#2563EB" />
                            </View>
                            <Text style={styles.rowTitle}>Dark mode</Text>
                        </View>
                        <Switch
                            value={darkMode}
                            onValueChange={setDarkMode}
                            trackColor={{ false: '#CBD5E1', true: '#2563EB' }}
                            thumbColor="#FFFFFF"
                        />
                    </View>
                </View>

                {/* ── ACCOUNT / EDIT PROFILE ── */}
                <Text style={styles.sectionHeader}>ACCOUNT</Text>
                <View style={styles.groupedCard}>
                    <TouchableOpacity
                        style={styles.settingRow}
                        onPress={() => router.push('/(customer)/edit-profile')}
                        activeOpacity={0.7}
                    >
                        <View style={styles.settingRowLeft}>
                            <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
                                <Feather name="user" size={18} color="#2563EB" />
                            </View>
                            <View style={styles.cardTextCol}>
                                <Text style={styles.rowTitle}>My Account</Text>
                                <Text style={styles.cardSubtitle}>
                                    {profile?.name ? profile.name : 'Personal details & preferences'}
                                </Text>
                            </View>
                        </View>
                        <MaterialIcons name="chevron-right" size={20} color="#94A3B8" />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity
                        style={styles.settingRow}
                        onPress={handleLogout}
                        activeOpacity={0.7}
                    >
                        <View style={styles.settingRowLeft}>
                            <View style={[styles.iconBox, { backgroundColor: '#FEE2E2' }]}>
                                <MaterialIcons name="logout" size={18} color="#DC2626" />
                            </View>
                            <Text style={[styles.rowTitle, { color: '#DC2626' }]}>Log Out</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={20} color="#FCA5A5" />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F1F5F9', // Soft light gray/slate
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 48,
    },

    // ── Curved Dark Navy Header ──
    headerHero: {
        backgroundColor: '#0F172A',
        borderBottomLeftRadius: 36,
        borderBottomRightRadius: 36,
        paddingBottom: 22,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 6,
    },
    safeArea: {
        paddingTop: Platform.OS === 'android' ? 12 : 0,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 8,
        gap: 14,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.14)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 0.2,
    },

    // ── Standalone Feature Card ──
    vacationCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
    cardLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 10,
    },
    sunIconBox: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: '#FEF3C7',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    cardTextCol: {
        flex: 1,
    },
    vacationTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#0F172A',
    },
    cardSubtitle: {
        fontSize: 12,
        fontWeight: '500',
        color: '#64748B',
        marginTop: 2,
    },

    // ── Section Headers ──
    sectionHeader: {
        fontSize: 12,
        fontWeight: '800',
        color: '#64748B',
        letterSpacing: 0.8,
        textTransform: 'uppercase',
        marginTop: 22,
        marginBottom: 8,
        paddingHorizontal: 4,
    },

    // ── Grouped Card Containers ──
    groupedCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        overflow: 'hidden',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 13,
        minHeight: 58,
    },
    settingRowLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        marginRight: 12,
    },
    iconBox: {
        width: 38,
        height: 38,
        borderRadius: 12,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    rowTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0F172A',
    },
    rowRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    rowValueText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748B',
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginLeft: 66,
    },
});