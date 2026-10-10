import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProviderScheduleScreen() {
    const router = useRouter();

    const [selectedDate, setSelectedDate] = useState('2026-10-08');

    // Hardcode the UI to exactly match the Figma design
    const marked: any = {
        '2026-10-08': { selected: true, marked: true, dotColor: '#ffffff' },
        '2026-10-19': { marked: true, dotColor: '#EF4444' },
        '2026-10-21': { marked: true, dotColor: '#EF4444' },
    };

    const currentMonthText = 'October 2026';
    const dateFormatted = 'Thu, 08 Oct 2026';

    const MOCK_JOB = {
        id: '1',
        initial: 'NC',
        customerName: 'New Customer',
        serviceType: 'AC repair and gas refill',
        time: 'Tomorrow, 16:00',
        location: 'Nugegoda',
        isNext: true,
        status: 'Confirmed'
    };

    return (
        <View style={styles.screen}>
            <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

            {/* ── Dark Hero Header ── */}
            <View style={styles.heroBackground}>
                <SafeAreaView edges={['top']} style={{ flex: 1 }}>
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                                <MaterialIcons name="chevron-left" size={26} color="#fff" />
                            </TouchableOpacity>
                            <View>
                                <Text style={styles.headerTitle}>My Schedule</Text>
                                <Text style={styles.headerSubtitle}>{currentMonthText}</Text>
                            </View>
                        </View>
                        <View style={styles.onlineToggleContainer}>
                            <Text style={styles.onlineText}>ONLINE</Text>
                            <Switch
                                value={true}
                                trackColor={{ false: '#475569', true: '#10B981' }}
                                thumbColor={'#fff'}
                                style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                            />
                        </View>
                    </View>
                </SafeAreaView>
            </View>

            {/* ── Calendar (Overlapping Hero) ── */}
            <View style={styles.calendarWrapper}>
                <View style={styles.calendarContainer}>

                    {/* Custom Calendar Header from Figma */}
                    <View style={styles.customCalendarHeader}>
                        <View style={styles.calendarHeaderTitleRow}>
                            <TouchableOpacity>
                                <MaterialIcons name="chevron-left" size={24} color="#111827" />
                            </TouchableOpacity>
                            <Text style={styles.customMonthTitle}>October 2026</Text>
                            <TouchableOpacity>
                                <MaterialIcons name="chevron-right" size={24} color="#111827" />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity style={styles.todayBtn} onPress={() => setSelectedDate('2026-10-08')}>
                            <Text style={styles.todayBtnText}>Today</Text>
                        </TouchableOpacity>
                    </View>

                    <Calendar
                        current={'2026-10-08'}
                        onDayPress={(day: DateData) => setSelectedDate(day.dateString)}
                        markedDates={marked}
                        hideArrows={true}
                        renderHeader={() => <View />} /* Hides default header keeping standard days */
                        theme={{
                            backgroundColor: '#ffffff',
                            calendarBackground: '#ffffff',
                            textSectionTitleColor: '#6B7280',
                            selectedDayBackgroundColor: '#2563EB',
                            selectedDayTextColor: '#ffffff',
                            todayTextColor: '#2563EB',
                            dayTextColor: '#111827',
                            textDisabledColor: '#D1D5DB',
                            dotColor: '#EF4444',
                            selectedDotColor: '#ffffff',
                            textDayFontWeight: '600',
                            textDayHeaderFontWeight: '700',
                            textDayFontSize: 16,
                            'stylesheet.calendar.header': {
                                header: {
                                    height: 0,
                                    opacity: 0,
                                },
                                week: {
                                    marginTop: 0,
                                    flexDirection: 'row',
                                    justifyContent: 'space-around',
                                    paddingHorizontal: 10,
                                    paddingBottom: 10,
                                }
                            }
                        } as any}
                        style={styles.calendar}
                    />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* ── Assigned Jobs for the Day ── */}
                <View style={styles.jobsSection}>
                    <View style={styles.jobsSectionHeader}>
                        <View>
                            <Text style={styles.jobsSectionTitle}>Appointments</Text>
                            <Text style={styles.jobsSectionSubtitle}>{dateFormatted}</Text>
                        </View>
                        <View style={styles.jobsBadge}>
                            <Text style={styles.jobsCount}>1 Job</Text>
                        </View>
                    </View>

                    <View style={styles.jobCard}>
                        <View style={styles.nextJobHeader}>
                            <Text style={styles.nextJobTitle}>NEXT JOB</Text>
                            <View style={styles.nextJobRow}>
                                <Feather name="clock" size={14} color="#1D4ED8" />
                                <Text style={styles.nextJobTime}>Starts in 1d 5h</Text>
                            </View>
                        </View>
                        <View style={styles.jobCardContent}>
                            <View style={styles.jobHeaderRow}>
                                <View style={styles.avatarNext}>
                                    <Text style={styles.avatarTextNext}>{MOCK_JOB.initial}</Text>
                                </View>
                                <View style={{ flex: 1, paddingLeft: 14 }}>
                                    <Text style={styles.jobName}>{MOCK_JOB.customerName}</Text>
                                    <Text style={styles.jobService}>{MOCK_JOB.serviceType}</Text>
                                </View>
                                <View style={styles.statusBadge}>
                                    <View style={styles.statusDot} />
                                    <Text style={styles.statusText}>{MOCK_JOB.status}</Text>
                                </View>
                            </View>

                            <View style={styles.timeLocContainer}>
                                <View style={styles.infoBox}>
                                    <Feather name="clock" size={15} color="#4B5563" />
                                    <Text style={styles.infoBoxText}>{MOCK_JOB.time}</Text>
                                </View>
                                <View style={styles.infoBox}>
                                    <Feather name="map-pin" size={15} color="#4B5563" />
                                    <Text style={styles.infoBoxText}>{MOCK_JOB.location}</Text>
                                </View>
                            </View>

                            <View style={styles.actionsRow}>
                                <TouchableOpacity style={styles.iconBtn}>
                                    <Feather name="phone-call" size={20} color="#374151" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/(provider)/chat')}>
                                    <Feather name="message-square" size={20} color="#374151" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.detailsBtn}
                                    onPress={() => router.push({ pathname: '/(provider)/request-details', params: { id: MOCK_JOB.id } })}
                                >
                                    <Text style={styles.detailsBtnText}>View details</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ height: 40 }} />
            </ScrollView>

            {/* ── Bottom Navigation Bar ── */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(provider)/provider-dashboard')}>
                    <MaterialIcons name="grid-view" size={24} color="#6B7280" />
                    <Text style={styles.navLabel}>Dashboard</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItemActive}>
                    <View style={styles.activeIconContainer}>
                        <Feather name="calendar" size={20} color="#2563EB" />
                    </View>
                    <Text style={styles.navLabelActive}>Schedule</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(provider)/provider-earnings')}>
                    <MaterialIcons name="account-balance-wallet" size={24} color="#6B7280" />
                    <Text style={styles.navLabel}>Earnings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(provider)/providerSetup-profile')}>
                    <Feather name="user" size={24} color="#6B7280" />
                    <Text style={styles.navLabel}>Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    // Hero Dark Header
    heroBackground: {
        backgroundColor: '#0F172A',
        height: 240,
        borderBottomLeftRadius: 36,
        borderBottomRightRadius: 36,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#1E293B',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: { fontSize: 22, fontWeight: '800', color: '#fff', letterSpacing: 0.3 },
    headerSubtitle: { fontSize: 13, fontWeight: '500', color: '#94A3B8', marginTop: 2 },
    onlineToggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#1E293B',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    onlineText: { fontSize: 12, fontWeight: '800', color: '#10B981' },

    scrollContent: {
        paddingTop: 0,
        paddingBottom: 24,
    },

    // Calendar
    calendarWrapper: {
        marginTop: -120,
        paddingHorizontal: 20,
        marginBottom: 24,
        zIndex: 10,
    },
    calendarContainer: {
        backgroundColor: '#fff',
        borderRadius: 24,
        paddingBottom: 16,
        paddingTop: 16,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 8 },
        elevation: 6,
    },
    customCalendarHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 16,
    },
    calendarHeaderTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    customMonthTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0F172A',
    },
    todayBtn: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 16,
    },
    todayBtnText: {
        color: '#2563EB',
        fontWeight: '700',
        fontSize: 13,
    },
    calendar: {
        borderRadius: 24,
        paddingHorizontal: 10,
    },

    // Assigned Jobs List
    jobsSection: {
        paddingHorizontal: 20,
    },
    jobsSectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center', // Align properly
        marginBottom: 20,
    },
    jobsSectionTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#0F172A',
        letterSpacing: -0.5,
    },
    jobsSectionSubtitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
        marginTop: 4,
    },
    jobsBadge: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 20,
    },
    jobsCount: {
        fontSize: 14,
        fontWeight: '800',
        color: '#2563EB',
    },

    jobCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 3,
        overflow: 'hidden',
    },
    nextJobHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#EEF2FF', // lighter blue matching figma
        paddingHorizontal: 20,
        paddingVertical: 12,
    },
    nextJobTitle: {
        color: '#2563EB',
        fontWeight: '800',
        fontSize: 13,
        letterSpacing: 0.5,
    },
    nextJobRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    nextJobTime: {
        color: '#1D4ED8',
        fontWeight: '800',
        fontSize: 13,
    },
    jobCardContent: {
        padding: 20,
    },
    jobHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarNext: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#DBEAFE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarTextNext: {
        color: '#1E3A8A',
        fontSize: 16,
        fontWeight: '800',
    },
    jobName: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 4,
    },
    jobService: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#D1FAE5',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    statusDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#10B981',
    },
    statusText: {
        fontSize: 13,
        fontWeight: '800',
        color: '#065F46',
    },

    timeLocContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    infoBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F3F4F6',
        padding: 14,
        borderRadius: 14,
        gap: 10,
    },
    infoBoxText: {
        flex: 1,
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
    },

    actionsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    iconBtn: {
        width: 52,
        height: 52,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailsBtn: {
        flex: 1,
        backgroundColor: '#2563EB',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    detailsBtnText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 16,
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
