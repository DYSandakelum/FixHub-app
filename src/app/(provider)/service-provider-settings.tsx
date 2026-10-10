import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Platform, ScrollView, StatusBar, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { settingsStore, useSettings } from './settingsStore';
import { useAuth } from '@/context/auth-context';

export default function ProviderSettingsScreen() {
    const router = useRouter();
    const { autoAccept, newRequestAlerts, appLanguage } = useSettings();
    const { t } = useTranslation();
    const { signOut } = useAuth();

    const handleLogout = () => {
        Alert.alert('Log Out', 'Are you sure you want to log out of your FixHub account?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Log Out',
                style: 'destructive',
                onPress: async () => {
                    await signOut();
                    router.replace('/(auth)/login');
                },
            },
        ]);
    };

    const [isEditingLanguage, setIsEditingLanguage] = useState(false);
    const [vacationMode, setVacationMode] = useState(false);
    const [quietHours, setQuietHours] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    const [startTime, setStartTime] = useState("8:00 AM");
    const [endTime, setEndTime] = useState("6:00 PM");
    const [isEditingHours, setIsEditingHours] = useState(false);
    const [tempStart, setTempStart] = useState("");
    const [tempEnd, setTempEnd] = useState("");

    const [bankName, setBankName] = useState("Commercial Bank of Ceylon");
    const [accNumber, setAccNumber] = useState("4821");
    const [isEditingPayout, setIsEditingPayout] = useState(false);
    const [tempBank, setTempBank] = useState("");
    const [tempAcc, setTempAcc] = useState("");

    const [payoutSchedule, setPayoutSchedule] = useState("Weekly");
    const [isEditingSchedule, setIsEditingSchedule] = useState(false);

    return (
        <View style={styles.screen}>
            <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

            {/* ── Dark Hero Section ── */}
            <View style={styles.heroBackground}>
                <SafeAreaView edges={['top']} style={{ flex: 1 }}>
                    <View style={styles.headerTop}>
                        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                            <MaterialIcons name="chevron-left" size={28} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitleBase}>{t('Settings')}</Text>
                        <View style={{ width: 44 }} />
                    </View>
                </SafeAreaView>
            </View>

            {/* ── Vacation Mode Overlapping Card ── */}
            <View style={styles.vacationCardWrapper}>
                <View style={[styles.cardBlock, { marginHorizontal: 20 }]}>
                    <View style={styles.rowItem}>
                        <View style={styles.vacationIconBox}>
                            <Feather name="sun" size={22} color="#D97706" />
                        </View>
                        <View style={styles.rowTextCol}>
                            <Text style={styles.itemTitle}>{t('Vacation mode')}</Text>
                            <Text style={styles.itemSubtitle}>{t('Pause new requests')}</Text>
                        </View>
                        <Switch
                            value={vacationMode}
                            onValueChange={setVacationMode}
                            trackColor={{ false: '#CBD5E1', true: '#2563EB' }}
                            thumbColor="#fff"
                            style={styles.switchPad}
                        />
                    </View>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* ── WORK PREFERENCES ── */}
                <Text style={styles.sectionLabel}>{t('WORK PREFERENCES')}</Text>
                <View style={[styles.cardBlock, { marginBottom: 24 }]}>
                    <TouchableOpacity style={styles.rowItem} onPress={() => { setTempStart(startTime); setTempEnd(endTime); setIsEditingHours(true); }}>
                        <View style={styles.iconBox}>
                            <Feather name="clock" size={20} color="#2563EB" />
                        </View>
                        <View style={styles.rowTextCol}>
                            <Text style={styles.itemTitle}>{t('Working hours')}</Text>
                        </View>
                        <Text style={styles.rowRightText}>{startTime} – {endTime}</Text>
                        <MaterialIcons name="chevron-right" size={22} color="#9CA3AF" />
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <View style={styles.rowItem}>
                        <View style={styles.iconBox}>
                            <Ionicons name="flash-outline" size={20} color="#2563EB" />
                        </View>
                        <View style={styles.rowTextCol}>
                            <Text style={styles.itemTitle}>{t('Auto-accept jobs')}</Text>
                            <Text style={styles.itemSubtitle}>{t('Only requests above')}</Text>
                        </View>
                        <Switch
                            value={autoAccept}
                            onValueChange={(val) => settingsStore.setAutoAccept(val)}
                            trackColor={{ false: '#CBD5E1', true: '#2563EB' }}
                            thumbColor="#fff"
                            style={styles.switchPad}
                        />
                    </View>
                </View>

                {/* ── NOTIFICATIONS ── */}
                <Text style={styles.sectionLabel}>{t('NOTIFICATIONS')}</Text>
                <View style={[styles.cardBlock, { marginBottom: 24 }]}>
                    <View style={styles.rowItem}>
                        <View style={styles.iconBox}>
                            <Ionicons name="notifications-outline" size={20} color="#2563EB" />
                        </View>
                        <View style={styles.rowTextCol}>
                            <Text style={styles.itemTitle}>{t('New request alerts')}</Text>
                            <Text style={styles.itemSubtitle}>{t('Sound and vibration')}</Text>
                        </View>
                        <Switch
                            value={newRequestAlerts}
                            onValueChange={(val) => settingsStore.setNewRequestAlerts(val)}
                            trackColor={{ false: '#CBD5E1', true: '#2563EB' }}
                            thumbColor="#fff"
                            style={styles.switchPad}
                        />
                    </View>
                    <View style={styles.divider} />
                    <TouchableOpacity style={styles.rowItem}>
                        <View style={styles.iconBox}>
                            <Ionicons name="timer-outline" size={20} color="#2563EB" />
                        </View>
                        <View style={styles.rowTextCol}>
                            <Text style={styles.itemTitle}>{t('Job reminders')}</Text>
                        </View>
                        <Text style={styles.rowRightText}>1 hr & 15 min</Text>
                        <MaterialIcons name="chevron-right" size={22} color="#9CA3AF" />
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <View style={styles.rowItem}>
                        <View style={styles.iconBox}>
                            <Ionicons name="moon-outline" size={20} color="#2563EB" />
                        </View>
                        <View style={styles.rowTextCol}>
                            <Text style={styles.itemTitle}>{t('Quiet hours')}</Text>
                            <Text style={styles.itemSubtitle}>10:00 PM – 6:00 AM</Text>
                        </View>
                        <Switch
                            value={quietHours}
                            onValueChange={setQuietHours}
                            trackColor={{ false: '#CBD5E1', true: '#2563EB' }}
                            thumbColor="#fff"
                            style={styles.switchPad}
                        />
                    </View>
                </View>

                {/* ── PAYMENTS ── */}
                <Text style={styles.sectionLabel}>{t('PAYMENTS')}</Text>
                <View style={[styles.cardBlock, { marginBottom: 24 }]}>
                    <TouchableOpacity style={styles.rowItem} onPress={() => { setTempBank(bankName); setTempAcc(accNumber); setIsEditingPayout(true); }}>
                        <View style={styles.iconBox}>
                            <Ionicons name="card-outline" size={20} color="#2563EB" />
                        </View>
                        <View style={styles.rowTextCol}>
                            <Text style={styles.itemTitle}>{t('Payout method')}</Text>
                            <Text style={styles.itemSubtitle}>{bankName}</Text>
                        </View>
                        <Text style={styles.rowRightText}>Bank ••{accNumber.slice(-4)}</Text>
                        <MaterialIcons name="chevron-right" size={22} color="#9CA3AF" />
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <TouchableOpacity style={styles.rowItem} onPress={() => setIsEditingSchedule(true)}>
                        <View style={styles.iconBox}>
                            <Ionicons name="calendar-outline" size={20} color="#2563EB" />
                        </View>
                        <View style={styles.rowTextCol}>
                            <Text style={styles.itemTitle}>{t('Payout schedule')}</Text>
                        </View>
                        <Text style={styles.rowRightText}>{t(payoutSchedule as any)}</Text>
                        <MaterialIcons name="chevron-right" size={22} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>

                {/* ── APP ── */}
                <Text style={styles.sectionLabel}>{t('APP')}</Text>
                <View style={styles.cardBlock}>
                    <TouchableOpacity style={styles.rowItem} onPress={() => setIsEditingLanguage(true)}>
                        <View style={styles.iconBox}>
                            <Ionicons name="globe-outline" size={20} color="#2563EB" />
                        </View>
                        <View style={styles.rowTextCol}>
                            <Text style={styles.itemTitle}>{t('Language')}</Text>
                        </View>
                        <Text style={styles.rowRightText}>{appLanguage}</Text>
                        <MaterialIcons name="chevron-right" size={22} color="#9CA3AF" />
                    </TouchableOpacity>
                    <View style={styles.divider} />
                    <View style={styles.rowItem}>
                        <View style={styles.iconBox}>
                            <Ionicons name="moon-outline" size={20} color="#2563EB" />
                        </View>
                        <View style={styles.rowTextCol}>
                            <Text style={styles.itemTitle}>{t('Dark mode')}</Text>
                        </View>
                        <Switch
                            value={darkMode}
                            onValueChange={setDarkMode}
                            trackColor={{ false: '#CBD5E1', true: '#2563EB' }}
                            thumbColor="#fff"
                            style={styles.switchPad}
                        />
                    </View>
                </View>

                {/* ── ACCOUNT / LOGOUT ── */}
                <Text style={styles.sectionLabel}>{t('ACCOUNT')}</Text>
                <View style={styles.cardBlock}>
                    <TouchableOpacity style={styles.rowItem} onPress={handleLogout} activeOpacity={0.7}>
                        <View style={[styles.iconBox, { backgroundColor: '#FEF2F2' }]}>
                            <MaterialIcons name="logout" size={20} color="#DC2626" />
                        </View>
                        <View style={styles.rowTextCol}>
                            <Text style={[styles.itemTitle, { color: '#DC2626' }]}>{t('Log out')}</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={22} color="#9CA3AF" />
                    </TouchableOpacity>
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>

            {/* ── Edit Hours Modal ── */}
            {isEditingHours && (
                <View style={styles.modalOverlay}>
                    <View style={styles.editModalContainer}>
                        <View style={styles.editModalHeader}>
                            <Text style={styles.editModalTitle}>Edit Working Hours</Text>
                            <Feather name="clock" size={18} color="#2563EB" />
                        </View>
                        <Text style={styles.editModalSubtitle}>Set your preferred availability</Text>

                        <View style={styles.editModalInputWrapper}>
                            <Text style={styles.editModalInputLabel}>Start Time</Text>
                            <TextInput
                                style={styles.editModalTextInput}
                                value={tempStart}
                                onChangeText={setTempStart}
                                placeholder="E.g. 8:00 AM"
                            />
                        </View>

                        <View style={[styles.editModalInputWrapper, { marginTop: 12 }]}>
                            <Text style={styles.editModalInputLabel}>End Time</Text>
                            <TextInput
                                style={styles.editModalTextInput}
                                value={tempEnd}
                                onChangeText={setTempEnd}
                                placeholder="E.g. 6:00 PM"
                            />
                        </View>

                        <View style={styles.editModalActionRow}>
                            <TouchableOpacity onPress={() => setIsEditingHours(false)}>
                                <Text style={styles.editModalCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.editModalSaveBtn}
                                onPress={() => {
                                    setStartTime(tempStart);
                                    setEndTime(tempEnd);
                                    setIsEditingHours(false);
                                }}
                            >
                                <Text style={styles.editModalSaveText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            {/* ── Edit Payout Modal ── */}
            {isEditingPayout && (
                <View style={styles.modalOverlay}>
                    <View style={styles.editModalContainer}>
                        <View style={styles.editModalHeader}>
                            <Text style={styles.editModalTitle}>Account Details</Text>
                            <Ionicons name="card-outline" size={18} color="#2563EB" />
                        </View>
                        <Text style={styles.editModalSubtitle}>Update your primary bank info</Text>

                        <View style={styles.editModalInputWrapper}>
                            <Text style={styles.editModalInputLabel}>Bank Name</Text>
                            <TextInput
                                style={styles.editModalTextInput}
                                value={tempBank}
                                onChangeText={setTempBank}
                                placeholder="E.g. Commercial Bank"
                            />
                        </View>

                        <View style={[styles.editModalInputWrapper, { marginTop: 12 }]}>
                            <Text style={styles.editModalInputLabel}>Account Number</Text>
                            <TextInput
                                style={styles.editModalTextInput}
                                value={tempAcc}
                                onChangeText={setTempAcc}
                                keyboardType="numeric"
                                placeholder="E.g. 19284759392"
                            />
                        </View>

                        <View style={styles.editModalActionRow}>
                            <TouchableOpacity onPress={() => setIsEditingPayout(false)}>
                                <Text style={styles.editModalCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.editModalSaveBtn}
                                onPress={() => {
                                    setBankName(tempBank);
                                    setAccNumber(tempAcc);
                                    setIsEditingPayout(false);
                                }}
                            >
                                <Text style={styles.editModalSaveText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            {/* ── Edit Schedule Modal ── */}
            {isEditingSchedule && (
                <View style={styles.modalOverlay}>
                    <View style={styles.editModalContainer}>
                        <View style={styles.editModalHeader}>
                            <Text style={styles.editModalTitle}>Payout Schedule</Text>
                            <Ionicons name="calendar-outline" size={18} color="#2563EB" />
                        </View>
                        <Text style={styles.editModalSubtitle}>When do you want to receive payments?</Text>

                        {['Hourly', 'Daily', 'Weekly', 'Monthly'].map((opt) => (
                            <TouchableOpacity
                                key={opt}
                                style={[
                                    styles.editModalInputWrapper,
                                    { marginBottom: 8, flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
                                    payoutSchedule === opt ? { backgroundColor: '#EFF6FF', borderColor: '#2563EB' } : { borderColor: '#E2E8F0' }
                                ]}
                                onPress={() => {
                                    setPayoutSchedule(opt);
                                    setIsEditingSchedule(false);
                                }}
                            >
                                <Ionicons
                                    name={payoutSchedule === opt ? "radio-button-on" : "radio-button-off"}
                                    size={20}
                                    color={payoutSchedule === opt ? "#2563EB" : "#9CA3AF"}
                                    style={{ marginRight: 12 }}
                                />
                                <Text style={[
                                    styles.editModalTextInput,
                                    { fontWeight: payoutSchedule === opt ? '700' : '500' }
                                ]}>{opt}</Text>
                            </TouchableOpacity>
                        ))}

                        <View style={[styles.editModalActionRow, { justifyContent: 'center' }]}>
                            <TouchableOpacity onPress={() => setIsEditingSchedule(false)}>
                                <Text style={styles.editModalCancelText}>{t('Cancel')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

            {/* ── Edit Language Modal ── */}
            {isEditingLanguage && (
                <View style={styles.modalOverlay}>
                    <View style={styles.editModalContainer}>
                        <View style={styles.editModalHeader}>
                            <Text style={styles.editModalTitle}>{t('Language')}</Text>
                            <Ionicons name="globe-outline" size={18} color="#2563EB" />
                        </View>

                        {['English', 'Sinhala'].map((opt: any) => (
                            <TouchableOpacity
                                key={opt}
                                style={[
                                    styles.editModalInputWrapper,
                                    { marginBottom: 8, flexDirection: 'row', alignItems: 'center', paddingVertical: 14, marginTop: 12 },
                                    appLanguage === opt ? { backgroundColor: '#EFF6FF', borderColor: '#2563EB' } : { borderColor: '#E2E8F0' }
                                ]}
                                onPress={() => {
                                    settingsStore.setAppLanguage(opt);
                                    setIsEditingLanguage(false);
                                }}
                            >
                                <Ionicons
                                    name={appLanguage === opt ? "radio-button-on" : "radio-button-off"}
                                    size={20}
                                    color={appLanguage === opt ? "#2563EB" : "#9CA3AF"}
                                    style={{ marginRight: 12 }}
                                />
                                <Text style={[
                                    styles.editModalTextInput,
                                    { fontWeight: appLanguage === opt ? '700' : '500' }
                                ]}>{opt}</Text>
                            </TouchableOpacity>
                        ))}

                        <View style={[styles.editModalActionRow, { justifyContent: 'center' }]}>
                            <TouchableOpacity onPress={() => setIsEditingLanguage(false)}>
                                <Text style={styles.editModalCancelText}>{t('Cancel')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}

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
        height: 140, // Height allowing the vacation card to perfectly overlap
        borderBottomLeftRadius: 36,
        borderBottomRightRadius: 36,
        paddingHorizontal: 20,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: Platform.OS === 'ios' ? 0 : 20,
        paddingBottom: 20,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#1E293B',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitleBase: {
        fontSize: 20,
        fontWeight: '800',
        color: '#fff',
    },

    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },

    // Vacation Card wrapper purely for negative margin
    vacationCardWrapper: {
        marginTop: -35,
        marginBottom: 24,
        zIndex: 10,
        elevation: 10,
    },

    // Reusable Card Style
    cardBlock: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 8,
        shadowColor: '#000',
        shadowOpacity: 0.02,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 1,
    },

    // Row Items
    rowItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 12,
    },
    iconBox: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    vacationIconBox: {
        width: 44,
        height: 44,
        borderRadius: 16, // squircle radius based on UI
        backgroundColor: '#FEF3C7',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    rowTextCol: {
        flex: 1,
        justifyContent: 'center',
    },
    itemTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0F172A',
    },
    itemSubtitle: {
        fontSize: 13,
        fontWeight: '500',
        color: '#64748B',
        marginTop: 2,
    },
    rowRightText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#475569',
        marginRight: 4,
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginHorizontal: 12,
    },
    switchPad: {
        transform: [{ scaleX: 0.9 }, { scaleY: 0.9 }],
    },

    // Section Headers
    sectionLabel: {
        fontSize: 12,
        fontWeight: '800',
        color: '#475569',
        letterSpacing: 0.5,
        marginBottom: 8,
        marginLeft: 12,
    },

    // Edit Modal Styles
    modalOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        elevation: 1000,
    },
    editModalContainer: {
        backgroundColor: '#fff',
        width: '90%',
        borderRadius: 24,
        padding: 24,
    },
    editModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    editModalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
    },
    editModalSubtitle: {
        fontSize: 15,
        color: '#6B7280',
        marginBottom: 24,
    },
    editModalInputWrapper: {
        borderWidth: 1.5,
        borderColor: '#2563EB',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    editModalInputLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#6B7280',
        marginBottom: 4,
    },
    editModalTextInput: {
        fontSize: 16,
        color: '#111827',
        fontWeight: '600',
        padding: 0,
    },
    editModalActionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 24,
    },
    editModalCancelText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
        paddingHorizontal: 12,
    },
    editModalSaveBtn: {
        backgroundColor: '#2563EB',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    editModalSaveText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});
