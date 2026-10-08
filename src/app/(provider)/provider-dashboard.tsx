import { Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { JobRequest, jobsStore, useJobs } from './jobsStore';
import { useCurrency } from './settingsStore';

const NEW_REQUEST = {
    id: 'req_1',
    serviceType: 'AC repair and gas refill',
    dateTime: 'Tomorrow, 16:00 PM',
    distance: '3.2 km away',
    location: 'Nugegoda',
    price: 6500,
    expiresInSeconds: 3557, // 59:17
};

// ─── Mock History ───
const WORKING_HISTORY = [
    {
        id: 'wh1',
        customerName: 'Saman Silva',
        serviceTitle: 'Plumbing Repair',
        date: 'Oct 15, 2026',
        rating: 5.0,
        review: 'Excellent service, arrived on time and fixed the leak perfectly.'
    },
    {
        id: 'wh2',
        customerName: 'Kamal Perera',
        serviceTitle: 'Water Heater Installation',
        date: 'Oct 12, 2026',
        rating: 4.8,
        review: 'Very professional, finished the job quickly. Highly recommended!'
    }
];

// ─── New Request Card ────────────────────────────────────────────────────────
function NewRequestCard({ onAccept }: { onAccept?: () => void }) {
    const [timeLeft, setTimeLeft] = useState(NEW_REQUEST.expiresInSeconds);
    const [isDeclined, setIsDeclined] = useState(false);

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

    const progressWidth = (timeLeft / 3600) * 100; // max 60 mins

    if (timeLeft <= 0 || isDeclined) {
        return (
            <View style={[styles.newRequestCard, { justifyContent: 'center', alignItems: 'center', minHeight: 220, paddingHorizontal: 30 }]}>
                <ActivityIndicator size="large" color="#2563EB" style={{ marginBottom: 16 }} />
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 8 }}>Waiting for new requests...</Text>
                <Text style={{ fontSize: 13, color: '#6B7280', textAlign: 'center', lineHeight: 18 }}>Keep your profile online. We'll notify you when a job matches your area.</Text>
            </View>
        );
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

                <View style={styles.timeLocRow}>
                    <View style={styles.timeLocBadge}>
                        <MaterialIcons name="calendar-today" size={14} color="#6B7280" />
                        <Text style={styles.timeLocText}>{NEW_REQUEST.dateTime}</Text>
                    </View>
                    <View style={styles.timeLocBadge}>
                        <MaterialIcons name="location-on" size={14} color="#6B7280" />
                        <Text style={styles.timeLocText}>{NEW_REQUEST.distance}</Text>
                    </View>
                </View>

                <View style={styles.newRequestPriceRow}>
                    <Text style={styles.newRequestLocation}>{NEW_REQUEST.location}</Text>
                    <Text style={styles.newRequestPrice}>Rs {NEW_REQUEST.price.toLocaleString()}</Text>
                </View>

                <View style={styles.newRequestActions}>
                    <TouchableOpacity style={styles.declineBtn} onPress={() => setIsDeclined(true)}>
                        <Text style={styles.declineBtnText}>Decline</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.acceptJobBtn} onPress={() => {
                        setIsDeclined(true);
                        if (onAccept) onAccept();
                    }}>
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
                <View style={{ flex: 1 }}>
                    <Text style={styles.scheduleNameService} numberOfLines={1}>
                        {job.time} - {job.customerName} - {job.serviceType}
                    </Text>
                    <Text style={styles.scheduleTimeLoc}>
                        {job.location}
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
    const { formatCurrency } = useCurrency();
    const [isOnline, setIsOnline] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showBreakdown, setShowBreakdown] = useState(false);

    const today = new Date().toISOString().split('T')[0];
    const scheduledJobs = useJobs();

    const todaysSchedule = scheduledJobs.filter(job => job.date === today || (job.date === '2026-10-19' && today !== '2026-10-21')); // Gracefully show mock data

    return (
        <View style={styles.screen}>
            <StatusBar barStyle="light-content" />

            {/* ── Dark Hero Background ── */}
            <View style={styles.heroBackground}>
                <SafeAreaView edges={['top']} style={{ flex: 1 }}>
                    <View style={styles.heroHeader}>
                        <Text style={styles.timeText}></Text>
                        <View style={styles.headerRightControls}>
                            <View style={styles.onlineToggle}>
                                <Text style={styles.onlineLabel}>
                                    {isOnline ? 'ONLINE' : 'OFFLINE'}
                                </Text>
                                <Switch
                                    value={isOnline}
                                    onValueChange={setIsOnline}
                                    trackColor={{ false: '#64748B', true: '#10B981' }}
                                    thumbColor="#fff"
                                    style={{ transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }}
                                />
                            </View>
                            <TouchableOpacity style={styles.notificationBtn} onPress={() => setShowNotifications(true)}>
                                <Feather name="bell" size={20} color="#fff" />
                                <View style={styles.notificationBadge} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.profileRow}>
                        <View style={styles.avatarPlaceholder}>
                            <Text style={styles.avatarInitials}>MV</Text>
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>Marcus Vaoce</Text>
                            <Text style={styles.profileStatus}>Electric & plumbing jobs</Text>
                        </View>
                    </View>
                </SafeAreaView>
            </View>

            {/* ── Fixed Earnings Card (Overlapping Hero) ── */}
            <View style={{ paddingHorizontal: 16, marginTop: -100, zIndex: 10 }}>
                <View style={[styles.earningsCard, { marginBottom: 0 }]}>
                    <View style={styles.earningsCardHeader}>
                        <Text style={styles.earningsLabel}>TODAY'S EARNINGS</Text>
                        <Text style={styles.earningsDateRange}>Oct 19, 2026</Text>
                    </View>
                    <Text style={styles.earningsAmount}>{formatCurrency('1,240.50')}</Text>
                    <Text style={styles.jobsCompleted}>14 Jobs completed</Text>

                    <View style={styles.payoutRow}>
                        <Text style={styles.payoutText}>Last payment: Today, 2:30 PM</Text>
                        <TouchableOpacity onPress={() => setShowBreakdown(true)}>
                            <Text style={styles.viewBreakdownLink}>View Breakdown</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* ── Main Scroll View ── */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >

                {/* ── New Request ── */}
                <NewRequestCard onAccept={() => {
                    const newJob: JobRequest = {
                        id: NEW_REQUEST.id,
                        customerName: 'New Customer', // Mock default
                        location: NEW_REQUEST.location,
                        time: 'Tomorrow, 16:00',
                        serviceType: NEW_REQUEST.serviceType,
                        initial: 'NC',
                        isNext: false,
                        date: today,
                    };
                    jobsStore.addJob(newJob);
                }} />

                {/* ── Today's Schedule ── */}
                <View style={styles.scheduleSectionHeader}>
                    <Text style={styles.scheduleSectionTitle}>Today's schedule</Text>
                    <Text style={styles.scheduleCount}>{todaysSchedule.length} jobs</Text>
                </View>

                {todaysSchedule.map((job) => (
                    <ScheduleCard key={job.id} job={job} />
                ))}

                {/* ── Working History ── */}
                <View style={[styles.scheduleSectionHeader, { marginTop: 16 }]}>
                    <Text style={styles.scheduleSectionTitle}>Working History & Reviews</Text>
                </View>
                {WORKING_HISTORY.map((item) => (
                    <View key={item.id} style={styles.historyCard}>
                        <View style={styles.historyHeader}>
                            <Text style={styles.historyCustomer}>{item.customerName}</Text>
                            <View style={styles.historyRatingRow}>
                                <MaterialIcons name="star" size={16} color="#F59E0B" />
                                <Text style={styles.historyRatingText}>{item.rating.toFixed(1)}</Text>
                            </View>
                        </View>
                        <View style={styles.historySubRow}>
                            <Text style={styles.historyService}>{item.serviceTitle}</Text>
                            <Text style={styles.historyDate}>{item.date}</Text>
                        </View>
                        <Text style={styles.historyReview}>"{item.review}"</Text>
                    </View>
                ))}

                <View style={{ height: 20 }} />
            </ScrollView>

            {/* ── Bottom Tab Bar ── */}
            <BottomTabBar activeTab="Dashboard" />

            {/* ── Notifications Modal ── */}
            {showNotifications && (
                <View style={styles.modalOverlay}>
                    <View style={styles.notificationsContainer}>
                        <View style={styles.notificationsHeader}>
                            <Text style={styles.notificationsTitle}>Notifications</Text>
                            <TouchableOpacity onPress={() => setShowNotifications(false)}>
                                <MaterialIcons name="close" size={24} color="#6B7280" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={{ maxHeight: 300 }}>
                            <View style={styles.notificationItem}>
                                <View style={[styles.notificationIcon, { backgroundColor: '#EFF6FF' }]}>
                                    <MaterialIcons name="build" size={20} color="#2563EB" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.notificationItemTitle}>New Request: Plumbing Repair</Text>
                                    <Text style={styles.notificationItemTime}>2 mins ago</Text>
                                </View>
                            </View>
                            <View style={styles.notificationItem}>
                                <View style={[styles.notificationIcon, { backgroundColor: '#ECFDF5' }]}>
                                    <MaterialIcons name="attach-money" size={20} color="#10B981" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.notificationItemTitle}>Payment received: Rs 4,500</Text>
                                    <Text style={styles.notificationItemTime}>1 hour ago</Text>
                                </View>
                            </View>
                            <View style={styles.notificationItem}>
                                <View style={[styles.notificationIcon, { backgroundColor: '#FEF2F2' }]}>
                                    <MaterialIcons name="close" size={20} color="#EF4444" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.notificationItemTitle}>Request canceled by user</Text>
                                    <Text style={styles.notificationItemTime}>Yesterday</Text>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            )}

            {/* ── Earnings Breakdown Modal ── */}
            {showBreakdown && (
                <View style={styles.modalOverlay}>
                    <View style={styles.notificationsContainer}>
                        <View style={styles.notificationsHeader}>
                            <Text style={styles.notificationsTitle}>Earnings Breakdown</Text>
                            <TouchableOpacity onPress={() => setShowBreakdown(false)}>
                                <MaterialIcons name="close" size={24} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        <View style={{ gap: 12 }}>
                            <View style={styles.breakdownRow}>
                                <Text style={styles.breakdownLabel}>Base Pay (14 jobs)</Text>
                                <Text style={styles.breakdownValue}>{formatCurrency('1,100.00')}</Text>
                            </View>
                            <View style={styles.breakdownRow}>
                                <Text style={styles.breakdownLabel}>Customer Tips</Text>
                                <Text style={styles.breakdownValue}>{formatCurrency('150.50')}</Text>
                            </View>
                            <View style={styles.breakdownRow}>
                                <Text style={styles.breakdownLabel}>Platform Fee (5%)</Text>
                                <Text style={styles.breakdownValueNegative}>-{formatCurrency('10.00')}</Text>
                            </View>

                            <View style={styles.breakdownDivider} />

                            <View style={styles.breakdownTotalRow}>
                                <Text style={styles.breakdownTotalLabel}>Total Earnings</Text>
                                <Text style={styles.breakdownTotalValue}>{formatCurrency('1,240.50')}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#E5E7EB',
    },

    // Hero Section
    heroBackground: {
        backgroundColor: '#1E293B', // Dark slate/blueish color simulating the dark top
        height: 250,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    heroHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    timeText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    headerRightControls: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    notificationBtn: {
        padding: 4,
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: -15,
    },
    avatarPlaceholder: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarInitials: {
        color: '#111827',
        fontSize: 18,
        fontWeight: '800',
    },
    profileInfo: {
        flex: 1,
        marginRight: 10,
    },
    profileName: {
        color: '#fff',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 2,
    },
    profileStatus: {
        color: '#9CA3AF',
        fontSize: 13,
        fontWeight: '500',
    },
    onlineToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginRight: 10,
    },
    onlineLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#9CA3AF',
    },

    // Main Scroll content
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 24,
        paddingTop: 16,
    },

    // Earnings Card
    earningsCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
        marginBottom: 16,
    },
    earningsCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    earningsLabel: {
        fontSize: 12,
        fontWeight: '800',
        color: '#111827', // dark text in the design
        letterSpacing: 0.5,
    },
    earningsDateRange: {
        fontSize: 13,
        fontWeight: '600',
        color: '#6B7280',
    },
    earningsAmount: {
        fontSize: 38,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 4,
    },
    jobsCompleted: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4B5563',
        marginBottom: 20,
    },
    payoutRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        paddingTop: 16,
    },
    payoutText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#374151',
    },
    viewBreakdownLink: {
        fontSize: 14,
        fontWeight: '700',
        color: '#2563EB',
        textDecorationLine: 'underline',
    },

    // New Request Card
    newRequestCard: {
        backgroundColor: '#F0F5FA', // Light blueish surface
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
    },
    newRequestHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    newRequestTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: '#111827',
    },
    expireBadge: {
        backgroundColor: '#FEF3C7', // Soft orange
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    expireText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#D97706',
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
        backgroundColor: '#D97706',
        borderRadius: 3,
    },
    newRequestDetails: {
        gap: 8,
    },
    newRequestService: {
        fontSize: 18,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 4,
    },
    timeLocRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    timeLocBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    timeLocText: {
        fontSize: 13,
        fontWeight: '500',
        color: '#4B5563',
    },
    newRequestPriceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    newRequestLocation: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
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
        borderRadius: 16,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    declineBtnText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#6B7280',
    },
    acceptJobBtn: {
        flex: 1,
        backgroundColor: '#2563EB', // Primary blue
        borderRadius: 16,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    acceptJobBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },

    // Today's schedule
    scheduleSectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    scheduleSectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#111827',
    },
    scheduleCount: {
        fontSize: 14,
        fontWeight: '600',
        color: '#4B5563',
    },
    scheduleCard: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.02,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    scheduleLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        flex: 1,
    },
    scheduleAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    scheduleAvatarText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#374151',
    },
    scheduleNameService: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 2,
    },
    scheduleTimeLoc: {
        fontSize: 13,
        fontWeight: '500',
        color: '#6B7280',
    },
    nextBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    nextBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#2563EB',
    },

    // Tab Bar
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingBottom: Platform.OS === 'ios' ? 24 : 12,
        paddingTop: 12,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        gap: 4,
    },
    tabLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#9CA3AF',
    },
    tabActiveLabel: {
        color: '#2563EB',
    },

    // Notifications Modal
    modalOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        zIndex: 100,
    },
    notificationsContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        width: '100%',
        padding: 20,
    },
    notificationsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    notificationsTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#111827',
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    notificationIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationItemTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 2,
    },
    notificationItemTime: {
        fontSize: 12,
        color: '#6B7280',
    },
    notificationBadge: {
        position: 'absolute',
        top: 4,
        right: 4,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4444',
        borderWidth: 1.5,
        borderColor: '#1E293B',
    },

    // Breakdown Styles
    breakdownRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    breakdownLabel: {
        fontSize: 15,
        color: '#4B5563',
    },
    breakdownValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
    },
    breakdownValueNegative: {
        fontSize: 15,
        fontWeight: '600',
        color: '#EF4444',
    },
    breakdownDivider: {
        height: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 4,
    },
    breakdownTotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    breakdownTotalLabel: {
        fontSize: 16,
        fontWeight: '800',
        color: '#111827',
    },
    breakdownTotalValue: {
        fontSize: 20,
        fontWeight: '800',
        color: '#2563EB',
    },

    // Working History Styles
    historyCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        marginBottom: 12,
        marginHorizontal: 16, // Dashboard width spacing
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    historyCustomer: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    historyRatingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFBEB',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    historyRatingText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#D97706',
        marginLeft: 4,
    },
    historySubRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    historyService: {
        fontSize: 13,
        fontWeight: '600',
        color: '#2563EB',
    },
    historyDate: {
        fontSize: 12,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    historyReview: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 20,
        fontStyle: 'italic',
    }
});