import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Types ────────────────────────────────────────────────────────────────────
type JobRequest = {
    id: string;
    customerName: string;
    location: string;
    time: string;
    serviceType: string;
    initial: string;
    isNext: boolean;
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const SCHEDULED_JOBS: JobRequest[] = [
    {
        id: '1',
        customerName: 'Sunil K.',
        location: 'Maharagama',
        time: '11:30 AM',
        serviceType: 'Pipe leak',
        initial: 'SK',
        isNext: true,
    },
    {
        id: '2',
        customerName: 'Ruwani P.',
        location: 'Dehiwala',
        time: '2:30 PM',
        serviceType: 'Tap fitting',
        initial: 'RP',
        isNext: false,
    },
];

const NEW_REQUEST = {
    id: 'req_1',
    serviceType: 'AC repair and gas refill',
    dateTime: 'Tomorrow, 10:00 AM',
    distance: '3.2 km away',
    location: 'Nugegoda',
    price: 6500,
    expiresInSeconds: 2400,
};

// ─── New Request Card ────────────────────────────────────────────────────────
function NewRequestCard() {
    const [timeLeft, setTimeLeft] = useState(NEW_REQUEST.expiresInSeconds);

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const progressWidth = (timeLeft / NEW_REQUEST.expiresInSeconds) * 100;

    if (timeLeft <= 0) {
        return null; // hide if expired
    }

    return (
        <View style={styles.newRequestCard}>
            <View style={styles.newRequestHeader}>
                <Text style={styles.newRequestTitle}>New request</Text>
                <View style={styles.expireBadge}>
                    <Text style={styles.expireText}>Expires in {formatTime(timeLeft)}</Text>
                </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
                <View style={[styles.progressBarFill, { width: `${progressWidth}%` }]} />
            </View>

            <View style={styles.newRequestDetails}>
                <Text style={styles.newRequestService}>{NEW_REQUEST.serviceType}</Text>
                <Text style={styles.newRequestTimeLoc}>
                    {NEW_REQUEST.dateTime} · {NEW_REQUEST.distance}
                </Text>

                <View style={styles.newRequestPriceRow}>
                    <Text style={styles.newRequestLocation}>{NEW_REQUEST.location}</Text>
                    <Text style={styles.newRequestPrice}>Rs {NEW_REQUEST.price.toLocaleString()}</Text>
                </View>

                <View style={styles.newRequestActions}>
                    <TouchableOpacity style={styles.declineBtn}>
                        <Text style={styles.declineBtnText}>Decline</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.acceptJobBtn}>
                        <Text style={styles.acceptJobBtnText}>Accept job</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}


// ─── Schedule Card ─────────────────────────────────────────────────────────
function ScheduleCard({ job }: { job: JobRequest }) {
    const router = useRouter();

    return (
        <TouchableOpacity
            style={styles.scheduleCard}
            onPress={() => router.push({ pathname: '/(provider)/request-details', params: { id: job.id } })}
        >
            <View style={styles.scheduleLeft}>
                <View style={styles.scheduleAvatar}>
                    <Text style={styles.scheduleAvatarText}>{job.initial}</Text>
                </View>
                <View>
                    <Text style={styles.scheduleNameService}>
                        {job.customerName} · {job.serviceType}
                    </Text>
                    <Text style={styles.scheduleTimeLoc}>
                        {job.time} · {job.location}
                    </Text>
                </View>
            </View>
            {job.isNext && (
                <View style={styles.nextBadge}>
                    <Text style={styles.nextBadgeText}>Next</Text>
                </View>
            )}
        </TouchableOpacity>
    );
}

// ─── Bottom Tab Bar ───────────────────────────────────────────────────────────
function BottomTabBar({ activeTab }: { activeTab: string }) {
    const router = useRouter();
    const tabs = [
        { name: 'Dashboard', icon: 'dashboard', route: '/(provider)/provider-dashboard' },
        { name: 'Schedule', icon: 'calendar-today', route: '/(provider)/provider-schedule' },
        { name: 'Earnings', icon: 'account-balance-wallet', route: '/(provider)/provider-earnings' },
        { name: 'Profile', icon: 'person', route: '/(provider)/provider-profile-setup' },
    ];

    return (
        <View style={styles.tabBar}>
            {tabs.map((tab) => {
                const isActive = activeTab === tab.name;
                return (
                    <TouchableOpacity
                        key={tab.name}
                        style={styles.tabItem}
                        onPress={() => {
                            if (tab.route) router.push(tab.route as any);
                        }}
                    >
                        <MaterialIcons
                            name={tab.icon as any}
                            size={24}
                            color={isActive ? '#2563EB' : '#9CA3AF'}
                        />
                        <Text style={[styles.tabLabel, isActive && styles.tabActiveLabel]}>
                            {tab.name}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ProviderDashboardScreen() {
    const [isOnline, setIsOnline] = useState(true);

    return (
        <SafeAreaView style={styles.screen}>
            {/* ── Header ── */}
            <View style={styles.header}>
                <View style={styles.profileRow}>
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarInitials}>MV</Text>
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>Marcus Vance</Text>
                        <Text style={styles.profileStatus}>
                            {isOnline ? 'Online & Accepting Jobs' : 'Offline'}
                        </Text>
                    </View>
                </View>
                <View style={styles.headerRight}>
                    <View style={styles.onlineToggle}>
                        <Text style={[styles.onlineLabel, isOnline && styles.onlineLabelActive]}>
                            {isOnline ? 'ONLINE' : 'OFFLINE'}
                        </Text>
                        <Switch
                            value={isOnline}
                            onValueChange={setIsOnline}
                            trackColor={{ false: '#ccc', true: '#2563EB' }}
                            thumbColor="#fff"
                        />
                    </View>
                    <TouchableOpacity style={styles.notificationButton}>
                        <MaterialIcons name="notifications-none" size={24} color="#374151" />
                        <View style={styles.notificationBadge} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Earnings Summary ── */}
                <View style={styles.earningsCard}>
                    <View style={styles.earningsCardHeader}>
                        <Text style={styles.earningsLabel}>TODAY'S EARNINGS</Text>
                        <Text style={styles.earningsDateRange}>Today, Oct 19</Text>
                    </View>
                    <Text style={styles.earningsAmount}>$1,240.50</Text>
                    <Text style={styles.jobsCompleted}>14 Jobs completed</Text>
                    <View style={styles.divider} />
                    <View style={styles.payoutRow}>
                        <Text style={styles.payoutText}>Next payout: Oct 21</Text>
                        <TouchableOpacity>
                            <Text style={styles.viewBreakdownLink}>View Breakdown</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <NewRequestCard />

                {/* ── Today's Schedule ── */}
                <View style={styles.scheduleSectionHeader}>
                    <Text style={styles.scheduleSectionTitle}>Today's schedule</Text>
                    <Text style={styles.scheduleCount}>{SCHEDULED_JOBS.length} jobs</Text>
                </View>

                {SCHEDULED_JOBS.map((job) => (
                    <ScheduleCard key={job.id} job={job} />
                ))}



                <View style={{ height: 20 }} />
            </ScrollView>

            {/* ── Bottom Tab Bar ── */}
            <BottomTabBar activeTab="Dashboard" />
        </SafeAreaView>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F2F4F7',
    },

    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatarPlaceholder: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: '#2563EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInitials: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    profileInfo: {
        gap: 2,
    },
    profileName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    profileStatus: {
        fontSize: 12,
        color: '#6B7280',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    notificationButton: {
        position: 'relative',
        padding: 4,
    },
    notificationBadge: {
        position: 'absolute',
        top: 2,
        right: 4,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4444',
        borderWidth: 1.5,
        borderColor: '#fff',
    },
    onlineToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    onlineLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#9CA3AF',
    },
    onlineLabelActive: {
        color: '#2563EB',
    },

    // Scroll
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        gap: 16,
    },

    // New Request Card
    newRequestCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#93C5FD',
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
        padding: 16,
        marginBottom: 8,
    },
    newRequestHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    newRequestTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#111827',
    },
    expireBadge: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#BFDBFE',
    },
    expireText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#2563EB',
    },
    progressBarContainer: {
        height: 6,
        backgroundColor: '#E5E7EB',
        borderRadius: 3,
        marginBottom: 16,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#2563EB',
        borderRadius: 3,
    },
    newRequestDetails: {
        gap: 4,
    },
    newRequestService: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    newRequestTimeLoc: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 8,
    },
    newRequestPriceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 20,
    },
    newRequestLocation: {
        fontSize: 14,
        color: '#4B5563',
    },
    newRequestPrice: {
        fontSize: 22,
        fontWeight: '800',
        color: '#111827',
    },
    newRequestActions: {
        flexDirection: 'row',
        gap: 12,
    },
    declineBtn: {
        flex: 1,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    declineBtnText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#374151',
    },
    acceptJobBtn: {
        flex: 1,
        backgroundColor: '#2563EB',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        shadowColor: '#2563EB',
        shadowOpacity: 0.3,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
    },
    acceptJobBtnText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#fff',
    },

    // Today's Schedule Section
    scheduleSectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 4,
        marginTop: 4,
    },
    scheduleSectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#111827',
    },
    scheduleCount: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
        marginBottom: 2,
    },
    scheduleCard: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
        marginBottom: 8,
    },
    scheduleLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    scheduleAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scheduleAvatarText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#374151',
    },
    scheduleNameService: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    scheduleTimeLoc: {
        fontSize: 13,
        color: '#6B7280',
    },
    nextBadge: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    nextBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#2563EB',
    },

    // Earnings Card
    earningsCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 18,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    earningsCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    earningsLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#6B7280',
        letterSpacing: 0.8,
    },
    earningsDateRange: {
        fontSize: 11,
        color: '#9CA3AF',
    },
    earningsAmount: {
        fontSize: 34,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 4,
    },
    jobsCompleted: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 14,
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginBottom: 12,
    },
    payoutRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    payoutText: {
        fontSize: 13,
        color: '#374151',
    },
    viewBreakdownLink: {
        fontSize: 13,
        fontWeight: '600',
        color: '#2563EB',
    },

    // Bottom Tab Bar
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingBottom: 8,
        paddingTop: 8,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        gap: 2,
        paddingVertical: 4,
    },
    tabIcon: {
        fontSize: 20,
        color: '#9CA3AF',
    },
    tabActiveIcon: {
        color: '#2563EB',
    },
    tabLabel: {
        fontSize: 11,
        color: '#9CA3AF',
    },
    tabActiveLabel: {
        color: '#2563EB',
        fontWeight: '600',
    },
});