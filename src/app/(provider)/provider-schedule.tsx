import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProviderScheduleScreen() {
    const router = useRouter();

    // Sample state for schedule toggles
    const [schedule, setSchedule] = useState({
        mon: true,
        tue: true,
        wed: true,
        thu: true,
        fri: true,
        sat: true,
        sun: false,
    });

    const toggleDay = (day: keyof typeof schedule) => {
        setSchedule(prev => ({ ...prev, [day]: !prev[day] }));
    };

    return (
        <SafeAreaView style={styles.screen}>
            {/* ── Header ── */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backIcon}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Availability Settings</Text>
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

                {/* ── Weekly Working Hours ── */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Weekly Working Hours</Text>

                    <View style={styles.dayRow}>
                        <Text style={styles.dayText}>Mon</Text>
                        <Text style={[styles.timeText, !schedule.mon && styles.timeTextOff]}>
                            {schedule.mon ? '8:00 AM – 5:00 PM' : 'Day off'}
                        </Text>
                        <Switch
                            value={schedule.mon}
                            onValueChange={() => toggleDay('mon')}
                            trackColor={{ false: '#E5E7EB', true: '#2563EB' }}
                            thumbColor={'#fff'}
                        />
                    </View>
                    <View style={styles.divider} />

                    <View style={styles.dayRow}>
                        <Text style={styles.dayText}>Tue</Text>
                        <Text style={[styles.timeText, !schedule.tue && styles.timeTextOff]}>
                            {schedule.tue ? '8:00 AM – 5:00 PM' : 'Day off'}
                        </Text>
                        <Switch
                            value={schedule.tue}
                            onValueChange={() => toggleDay('tue')}
                            trackColor={{ false: '#E5E7EB', true: '#2563EB' }}
                            thumbColor={'#fff'}
                        />
                    </View>
                    <View style={styles.divider} />

                    <View style={styles.dayRow}>
                        <Text style={styles.dayText}>Wed</Text>
                        <Text style={[styles.timeText, !schedule.wed && styles.timeTextOff]}>
                            {schedule.wed ? '8:00 AM – 5:00 PM' : 'Day off'}
                        </Text>
                        <Switch
                            value={schedule.wed}
                            onValueChange={() => toggleDay('wed')}
                            trackColor={{ false: '#E5E7EB', true: '#2563EB' }}
                            thumbColor={'#fff'}
                        />
                    </View>
                    <View style={styles.divider} />

                    <View style={styles.dayRow}>
                        <Text style={styles.dayText}>Thu</Text>
                        <Text style={[styles.timeText, !schedule.thu && styles.timeTextOff]}>
                            {schedule.thu ? '8:00 AM – 5:00 PM' : 'Day off'}
                        </Text>
                        <Switch
                            value={schedule.thu}
                            onValueChange={() => toggleDay('thu')}
                            trackColor={{ false: '#E5E7EB', true: '#2563EB' }}
                            thumbColor={'#fff'}
                        />
                    </View>
                    <View style={styles.divider} />

                    <View style={styles.dayRow}>
                        <Text style={styles.dayText}>Fri</Text>
                        <Text style={[styles.timeText, !schedule.fri && styles.timeTextOff]}>
                            {schedule.fri ? '8:00 AM – 3:00 PM' : 'Day off'}
                        </Text>
                        <Switch
                            value={schedule.fri}
                            onValueChange={() => toggleDay('fri')}
                            trackColor={{ false: '#E5E7EB', true: '#2563EB' }}
                            thumbColor={'#fff'}
                        />
                    </View>
                    <View style={styles.divider} />

                    <View style={styles.dayRow}>
                        <Text style={styles.dayText}>Sat</Text>
                        <Text style={[styles.timeText, !schedule.sat && styles.timeTextOff]}>
                            {schedule.sat ? '9:00 AM – 1:00 PM' : 'Day off'}
                        </Text>
                        <Switch
                            value={schedule.sat}
                            onValueChange={() => toggleDay('sat')}
                            trackColor={{ false: '#E5E7EB', true: '#2563EB' }}
                            thumbColor={'#fff'}
                        />
                    </View>
                    <View style={styles.divider} />

                    <View style={styles.dayRow}>
                        <Text style={styles.dayText}>Sun</Text>
                        <Text style={[styles.timeText, !schedule.sun && styles.timeTextOff]}>
                            {schedule.sun ? '8:00 AM – 5:00 PM' : 'Day off'}
                        </Text>
                        <Switch
                            value={schedule.sun}
                            onValueChange={() => toggleDay('sun')}
                            trackColor={{ false: '#E5E7EB', true: '#2563EB' }}
                            thumbColor={'#fff'}
                        />
                    </View>
                </View>

                {/* ── Travel Buffer ── */}
                <View style={styles.actionCard}>
                    <View style={styles.actionCardContent}>
                        <Text style={styles.actionCardTitle}>Travel buffer</Text>
                        <Text style={styles.actionCardSubtitle}>Gap between jobs</Text>
                    </View>
                    <TouchableOpacity style={styles.badgeButton}>
                        <Text style={styles.badgeText}>30 min</Text>
                    </TouchableOpacity>
                </View>

                {/* ── Service Area ── */}
                <View style={styles.actionCard}>
                    <View style={styles.actionCardContent}>
                        <Text style={styles.actionCardTitle}>Service area</Text>
                        <Text style={styles.actionCardSubtitle}>Within 15 km of Nugegoda</Text>
                    </View>
                    <TouchableOpacity style={styles.badgeButton}>
                        <Text style={styles.badgeText}>Edit</Text>
                    </TouchableOpacity>
                </View>

                {/* ── Block a Date ── */}
                <View style={styles.actionCard}>
                    <View style={styles.actionCardContent}>
                        <Text style={styles.actionCardTitle}>Block a date</Text>
                        <Text style={styles.actionCardSubtitle}>Holidays, leave, training</Text>
                    </View>
                    <TouchableOpacity style={styles.badgeButton}>
                        <Text style={styles.badgeText}>+ Add</Text>
                    </TouchableOpacity>
                </View>

                {/* ── Save Button ── */}
                <TouchableOpacity style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Save changes</Text>
                </TouchableOpacity>

                <View style={{ height: 30 }} />
            </ScrollView>

            {/* ── Bottom Navigation Bar ── */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(provider)/provider-dashboard')}>
                    <Text style={styles.navIcon}>🏠</Text>
                    <Text style={styles.navLabel}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItemActive}>
                    <Text style={styles.navIconActive}>📅</Text>
                    <Text style={styles.navLabelActive}>Schedule</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(provider)/provider-earnings')}>
                    <Text style={styles.navIcon}>💰</Text>
                    <Text style={styles.navLabel}>Earnings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(provider)/provider-profile-setup')}>
                    <Text style={styles.navIcon}>👤</Text>
                    <Text style={styles.navLabel}>Profile</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#FAFAFA',
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
    backIcon: { fontSize: 24, color: '#2563EB', lineHeight: 28 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
    onlineToggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
    },
    onlineText: { fontSize: 13, fontWeight: '600', color: '#10B981' },

    scrollContent: {
        padding: 20,
    },

    // Weekly Working Hours Card
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    cardTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 16 },
    dayRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    dayText: { fontSize: 15, fontWeight: '700', color: '#111827', width: 45 },
    timeText: { fontSize: 15, fontWeight: '500', color: '#374151', flex: 1, paddingLeft: 10 },
    timeTextOff: { color: '#9CA3AF' },
    divider: { height: 1, backgroundColor: '#F3F4F6' },

    // Action Cards
    actionCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    actionCardContent: {
        flex: 1,
    },
    actionCardTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 4 },
    actionCardSubtitle: { fontSize: 13, fontWeight: '500', color: '#6B7280' },
    badgeButton: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
    },
    badgeText: { fontSize: 13, fontWeight: '700', color: '#2563EB' },

    // Save Button
    saveButton: {
        backgroundColor: '#2563EB',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    saveButtonText: { fontSize: 16, fontWeight: '700', color: '#fff' },

    // Bottom Nav
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    navItem: { alignItems: 'center' },
    navIcon: { fontSize: 24, opacity: 0.5, marginBottom: 4 },
    navLabel: { fontSize: 12, color: '#9CA3AF', fontWeight: '500' },
    navItemActive: { alignItems: 'center' },
    navIconActive: { fontSize: 24, opacity: 1, marginBottom: 4 },
    navLabelActive: { fontSize: 12, color: '#2563EB', fontWeight: '600' },
});
