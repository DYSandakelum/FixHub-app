import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Platform,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useJobs } from './jobsStore';

export default function ProviderScheduleScreen() {
    const router = useRouter();

    // Convert current Date to string format used by Calendar (YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];
    const [selectedDate, setSelectedDate] = useState(today);

    const allJobs = useJobs();
    const dailyJobs = allJobs.filter(job => job.date === selectedDate);

    // Build marked dates for Calendar
    const marked: any = {};
    allJobs.forEach((job) => {
        // Red dot indicates an appointment
        marked[job.date] = { marked: true, dotColor: '#EF4444' };
    });

    // Highlight the explicitly selected date
    if (marked[selectedDate]) {
        marked[selectedDate].selected = true;
        marked[selectedDate].selectedColor = '#2563EB';
    } else {
        marked[selectedDate] = { selected: true, selectedColor: '#2563EB' };
    }

    return (
        <SafeAreaView style={styles.screen}>
            {/* ── Header ── */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <MaterialIcons name="chevron-left" size={28} color="#2563EB" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Schedule</Text>
                <View style={styles.onlineToggleContainer}>
                    <Text style={styles.onlineText}>Online</Text>
                    <Switch
                        value={true}
                        trackColor={{ false: '#E5E7EB', true: '#2563EB' }}
                        thumbColor={'#fff'}
                    />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                {/* ── Calendar React Native ── */}
                <View style={styles.calendarContainer}>
                    <Calendar
                        onDayPress={(day: any) => setSelectedDate(day.dateString)}
                        markedDates={marked}
                        theme={{
                            todayTextColor: '#2563EB',
                            arrowColor: '#2563EB',
                            selectedDayBackgroundColor: '#2563EB',
                            textDayFontWeight: '500',
                            textMonthFontWeight: 'bold',
                            textDayHeaderFontWeight: '600',
                        }}
                        style={styles.calendar}
                    />
                </View>

                {/* ── Assigned Jobs for the Day ── */}
                <View style={styles.jobsSection}>
                    <View style={styles.jobsSectionHeader}>
                        <Text style={styles.jobsSectionTitle}>Appointments</Text>
                        <Text style={styles.jobsCount}>{dailyJobs.length} Jobs</Text>
                    </View>

                    {dailyJobs.length === 0 ? (
                        <View style={styles.noJobsContainer}>
                            <MaterialIcons name="event-busy" size={48} color="#D1D5DB" />
                            <Text style={styles.noJobsText}>No appointments assigned for this day.</Text>
                        </View>
                    ) : (
                        dailyJobs.map(job => (
                            <View key={job.id} style={styles.jobCard}>
                                <View style={styles.jobHeaderRow}>
                                    <View style={styles.avatar}>
                                        <Text style={styles.avatarText}>{job.initial}</Text>
                                    </View>
                                    <View style={{ flex: 1, paddingLeft: 12 }}>
                                        <Text style={styles.jobName}>{job.customerName}</Text>
                                        <Text style={styles.jobService}>{job.serviceType}</Text>
                                    </View>
                                    {job.isNext && (
                                        <View style={styles.nextBadge}>
                                            <Text style={styles.nextBadgeText}>Next</Text>
                                        </View>
                                    )}
                                </View>

                                <View style={styles.jobFooter}>
                                    <View style={styles.jobIconRow}>
                                        <MaterialIcons name="schedule" size={16} color="#6B7280" />
                                        <Text style={styles.jobFooterText}>{job.time}</Text>
                                    </View>
                                    <View style={styles.jobIconRow}>
                                        <MaterialIcons name="location-pin" size={16} color="#6B7280" />
                                        <Text style={styles.jobFooterText}>{job.location}</Text>
                                    </View>
                                </View>
                            </View>
                        ))
                    )}
                </View>
                <View style={{ height: 20 }} />
            </ScrollView>

            {/* ── Bottom Navigation Bar ── */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(provider)/provider-dashboard')}>
                    <MaterialIcons name="dashboard" size={24} color="#9CA3AF" style={{ marginBottom: 4 }} />
                    <Text style={styles.navLabel}>Dashboard</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItemActive}>
                    <MaterialIcons name="calendar-today" size={24} color="#2563EB" style={{ marginBottom: 4 }} />
                    <Text style={styles.navLabelActive}>Schedule</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(provider)/provider-earnings')}>
                    <MaterialIcons name="account-balance-wallet" size={24} color="#9CA3AF" style={{ marginBottom: 4 }} />
                    <Text style={styles.navLabel}>Earnings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(provider)/provider-profile-setup')}>
                    <MaterialIcons name="person" size={24} color="#9CA3AF" style={{ marginBottom: 4 }} />
                    <Text style={styles.navLabel}>Profile</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F9FAFB', // Light clean gray
    },
    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 14,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
    onlineToggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    onlineText: { fontSize: 13, fontWeight: '600', color: '#10B981' },

    scrollContent: {
        paddingTop: 16,
        paddingBottom: 24,
    },

    // Calendar
    calendarContainer: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        borderRadius: 20,
        paddingBottom: 10,
        marginBottom: 20,
        // shadows
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 3,
        overflow: 'hidden',
    },
    calendar: {
        borderRadius: 20,
    },

    // Assigned Jobs List
    jobsSection: {
        paddingHorizontal: 20,
    },
    jobsSectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    jobsSectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#111827',
    },
    jobsCount: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2563EB',
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },

    noJobsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    noJobsText: {
        marginTop: 12,
        fontSize: 14,
        color: '#9CA3AF',
        fontWeight: '500',
    },

    jobCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    jobHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#111827',
    },
    jobName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 2,
    },
    jobService: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
    },
    nextBadge: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    nextBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#2563EB',
    },
    jobFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: 12,
    },
    jobIconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    jobFooterText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#4B5563',
    },

    // Bottom Nav
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    },
    navItem: { alignItems: 'center', flex: 1, gap: 4 },
    navLabel: { fontSize: 11, color: '#9CA3AF', fontWeight: '600' },
    navItemActive: { alignItems: 'center', flex: 1, gap: 4 },
    navLabelActive: { fontSize: 11, color: '#2563EB', fontWeight: '600' },
});
