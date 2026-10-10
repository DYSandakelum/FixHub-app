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
    UIManager,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import { getRoleNameString, settingsStore, useSettings } from './settingsStore';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

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

export default function ProviderDashboardScreen() {
    const router = useRouter();
    const { serviceCategory, autoAccept, newRequestAlerts, providerName, vacationMode } = useSettings();
    const isOnline = !vacationMode;
    const [isWaiting, setIsWaiting] = useState(true);
    const [newRequest, setNewRequest] = useState<any>(null);
    const [selectedJob, setSelectedJob] = useState<any>(null);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showBreakdown, setShowBreakdown] = useState(false);

    const [workingHistory, setWorkingHistory] = useState(WORKING_HISTORY);
    const [earningsTotal, setEarningsTotal] = useState(1240.50);
    const [completedJobsCount, setCompletedJobsCount] = useState(14);

    // Static state for the schedule list that gets updated when job is accepted
    const [scheduledJobs, setScheduledJobs] = useState([
        {
            id: '1',
            initial: 'DK',
            customerName: 'Dunil K.',
            serviceType: 'Pipe leak',
            address: 'Highlevel Rd, Maharagama',
            time: '11:30 AM',
            isNext: true,
            isTomorrow: false,
        }
    ]);

    const handleAcceptJob = (jobPayload?: any) => {
        setIsWaiting(true);
        // Push the accepted job into the schedule
        setScheduledJobs(prev => [...prev, {
            id: jobPayload?.id?.toString() || Math.random().toString(),
            initial: jobPayload?.customerName ? jobPayload.customerName[0] : 'N',
            customerName: jobPayload?.customerName || 'New Customer',
            serviceType: jobPayload?.serviceType || jobPayload?.service_title || 'AC repair',
            time: jobPayload?.time || jobPayload?.scheduled_time || '16:00',
            address: jobPayload?.address || '1248 Oakwood Dr, Apt 4B',
            isNext: false,
            isTomorrow: true,
        }]);
        setNewRequest(null);
    };

    useEffect(() => {
        if (isOnline && !isWaiting && autoAccept) {
            // Check if provider is free at the exact time of the new request (simulated at 16:00)
            const isFree = scheduledJobs.every(job => job.time !== '16:00' && job.time !== '4:00 PM');
            if (isFree) {
                const timer = setTimeout(() => {
                    handleAcceptJob();
                }, 1500); // Wait 1.5 seconds simulating check before auto accepting
                return () => clearTimeout(timer);
            }
        }
    }, [isOnline, isWaiting, autoAccept, scheduledJobs.length]);

    useEffect(() => {
        if (!isOnline) {
            // Keep UI offline/waiting if vacation mode is on
            return;
        }

        const requestChannel = supabase
            .channel('public:job_requests')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'job_requests' },
                (payload) => {
                    console.log('New request received!', payload.new);
                    if (autoAccept) {
                        handleAcceptJob(payload.new);
                        setShowNotifications(true);
                    } else {
                        setNewRequest(payload.new);
                        setIsWaiting(false);
                    }
                }
            )
            .subscribe();

        const paymentChannel = supabase
            .channel('public:payments')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'payments' }, (payload) => {
                const amount = parseFloat(payload.new.amount || payload.new.price || 0);
                setEarningsTotal(prev => prev + amount);
                setCompletedJobsCount(prev => prev + 1);
            })
            .subscribe();

        const scheduleChannel = supabase
            .channel('public:jobs')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'jobs' }, (payload) => {
                setScheduledJobs(prev => [...prev, {
                    id: payload.new.id || Math.random().toString(),
                    initial: (payload.new.customerName || 'N')[0],
                    customerName: payload.new.customerName || 'New Customer',
                    serviceType: payload.new.serviceType || payload.new.serviceTitle || 'Scheduled Job',
                    time: payload.new.time || '14:00',
                    address: payload.new.address || '1248 Oakwood Dr, Apt 4B',
                    isNext: false,
                    isTomorrow: false,
                }]);
            })
            .subscribe();

        const reviewChannel = supabase
            .channel('public:reviews')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reviews' }, (payload) => {
                setWorkingHistory(prev => [{
                    id: payload.new.id || Math.random().toString(),
                    customerName: payload.new.customerName || 'Happy Customer',
                    serviceTitle: payload.new.serviceTitle || 'Completed Service',
                    date: payload.new.date || 'Today',
                    rating: payload.new.rating || 5.0,
                    review: payload.new.review || 'Great work!'
                }, ...prev]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(requestChannel);
            supabase.removeChannel(paymentChannel);
            supabase.removeChannel(scheduleChannel);
            supabase.removeChannel(reviewChannel);
        };
    }, [isOnline, autoAccept]);

    return (
        <View style={styles.screen}>
            <StatusBar barStyle="light-content" backgroundColor="#0B132B" />

            <View style={styles.heroBackground}>
                <SafeAreaView edges={['top']} style={{ flex: 1 }}>

                    <View style={styles.heroTopRow}>
                        <View style={styles.profileSection}>
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>MV</Text>
                            </View>
                            <View>
                                <Text style={styles.profileName}>{providerName}</Text>
                                <Text style={styles.profileSubtitle}>{getRoleNameString(serviceCategory)} jobs</Text>
                            </View>
                        </View>
                        <View style={styles.actionButtons}>
                            <TouchableOpacity style={styles.iconButton} onPress={() => setShowNotifications(true)}>
                                <Feather name="bell" size={20} color="#fff" />
                                {newRequestAlerts && <View style={styles.notificationDot} />}
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/(provider)/service-provider-settings')}>
                                <Feather name="settings" size={20} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.statusBox}>
                        <View style={styles.statusBoxLeft}>
                            <View style={[styles.statusDot, !isOnline && { backgroundColor: '#94A3B8' }]} />
                            <View>
                                <Text style={styles.statusTitle}>
                                    {isOnline ? "You're online" : "You're offline"}
                                </Text>
                                <Text style={styles.statusSubtitle}>
                                    {isOnline ? "Receiving new job requests" : "Vacation mode active"}
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={isOnline}
                            onValueChange={(val) => {
                                settingsStore.setVacationMode(!val);
                                // If toggling offline while a request is pending (isWaiting === false), auto delete it
                                if (!val && !isWaiting) {
                                    setIsWaiting(true);
                                }
                            }}
                            trackColor={{ false: '#475569', true: '#10B981' }}
                            thumbColor="#fff"
                        />
                    </View>
                </SafeAreaView>
            </View>

            {/* ── Fixed Earnings Card (Overlapping Hero) ── */}
            <View style={styles.earningsCardContainer}>
                <View style={styles.earningsCard}>
                    <View style={styles.earningsCardHeader}>
                        <Text style={styles.earningsTitle}>TODAY'S EARNINGS</Text>
                        <Text style={styles.earningsDate}>Oct 19, 2026</Text>
                    </View>

                    <View style={styles.earningsAmountRow}>
                        <Text style={styles.currencySymbol}>Rs</Text>
                        <Text style={styles.earningsAmount}>{earningsTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Text>
                    </View>

                    <View style={styles.jobsCompletedBadge}>
                        <Feather name="check" size={14} color="#059669" />
                        <Text style={styles.jobsCompletedText}>{completedJobsCount} jobs completed</Text>
                    </View>

                    <View style={styles.earningsDivider} />

                    <View style={styles.payoutRow}>
                        <Text style={styles.payoutText}>Last payment: <Text style={styles.payoutTextBold}>Today, 2:30 PM</Text></Text>
                        <TouchableOpacity style={styles.breakdownBtn} onPress={() => setShowBreakdown(true)}>
                            <Text style={styles.breakdownText}>View breakdown</Text>
                            <MaterialIcons name="chevron-right" size={18} color="#2563EB" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>


            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* ── New Request Card / Waiting State ── */}
                {!isOnline ? (
                    <View style={[styles.newRequestCard, { justifyContent: 'center', alignItems: 'center', minHeight: 220, paddingHorizontal: 30 }]}>
                        <MaterialIcons name="power-settings-new" size={40} color="#9CA3AF" style={{ marginBottom: 16 }} />
                        <Text style={{ fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 8 }}>You are currently offline</Text>
                        <Text style={{ fontSize: 13, color: '#6B7280', textAlign: 'center', lineHeight: 18, fontWeight: '500' }}>Go online to receive new job requests matching your category.</Text>
                    </View>
                ) : (isWaiting && !autoAccept) ? (
                    <View style={[styles.newRequestCard, { justifyContent: 'center', alignItems: 'center', minHeight: 220, paddingHorizontal: 30 }]}>
                        <ActivityIndicator size="large" color="#2563EB" style={{ marginBottom: 16 }} />
                        <Text style={{ fontSize: 16, fontWeight: '800', color: '#111827', marginBottom: 8 }}>Waiting for new requests...</Text>
                        <Text style={{ fontSize: 13, color: '#6B7280', textAlign: 'center', lineHeight: 18, fontWeight: '500' }}>Keep your profile active. We'll notify you when a job matches your area.</Text>
                    </View>
                ) : (newRequest && !autoAccept) ? (
                    <View style={styles.newRequestCard}>
                        <View style={styles.requestCardHeader}>
                            <Text style={styles.requestTitleText}>New request</Text>
                            <View style={styles.expiresBadge}>
                                <Feather name="clock" size={12} color="#B45309" />
                                <Text style={styles.expiresText}>Expires in 59:00</Text>
                            </View>
                        </View>

                        <View style={styles.progressBarContainer}>
                            <View style={styles.progressBarFill} />
                        </View>

                        <Text style={styles.serviceTitle}>{newRequest?.service_title || newRequest?.title || 'AC repair and gas refill'}</Text>

                        <View style={styles.timeLocRow}>
                            <View style={styles.infoPill}>
                                <Feather name="calendar" size={14} color="#4B5563" />
                                <Text style={styles.infoPillText}>{newRequest?.date || newRequest?.scheduled_time || 'Tomorrow, 16:00'}</Text>
                            </View>
                            <View style={styles.infoPill}>
                                <Feather name="map-pin" size={14} color="#4B5563" />
                                <Text style={styles.infoPillText}>{newRequest?.location || newRequest?.city || 'Nugegoda'}</Text>
                            </View>
                        </View>

                        <Text style={styles.estimatedEarningLabel}>Estimated earning</Text>
                        <View style={styles.priceRow}>
                            <View style={styles.priceContainer}>
                                <Text style={styles.priceTextSmall}>Rs </Text>
                                <Text style={styles.priceTextBig}>{newRequest?.price || newRequest?.amount || '6,500'}</Text>
                            </View>
                            <Text style={styles.distanceText}>{newRequest?.distance || '3.2 km'} away</Text>
                        </View>

                        <View style={styles.actionsRow}>
                            <TouchableOpacity style={styles.declineBtn} onPress={() => setIsWaiting(true)}>
                                <Text style={styles.declineBtnText}>Decline</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.acceptBtn} onPress={handleAcceptJob} activeOpacity={0.8}>
                                <Text style={styles.acceptBtnText}>Accept job</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : null}

                {/* ── Today's Schedule ── */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Today's schedule</Text>
                    <View style={styles.blueBadge}>
                        <Text style={styles.blueBadgeText}>{scheduledJobs.length} jobs</Text>
                    </View>
                </View>

                {scheduledJobs.map((job) => (
                    <TouchableOpacity key={job.id} style={styles.jobItemCard} onPress={() => {
                        settingsStore.setActiveJobDetails(job);
                        const urlStr = `/(provider)/request-details?customerName=${encodeURIComponent(job.customerName)}&serviceType=${encodeURIComponent(job.serviceType)}&initial=${encodeURIComponent(job.initial)}&address=${encodeURIComponent(job.address)}`;
                        router.push(urlStr as any);
                    }}>
                        <View style={job.isTomorrow ? styles.jobItemAvatarLight : styles.jobItemAvatar}>
                            <Text style={job.isTomorrow ? styles.jobItemAvatarTextLight : styles.jobItemAvatarText}>{job.initial}</Text>
                        </View>
                        <View style={styles.jobItemInfo}>
                            <Text style={styles.jobItemName}>{job.customerName}</Text>
                            <Text style={styles.jobItemDesc}>{job.serviceType}</Text>
                        </View>
                        <View style={styles.jobItemRight}>
                            <Text style={styles.jobItemTime}>{job.time}</Text>
                            {job.isNext && (
                                <View style={{ backgroundColor: '#2563EB', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16 }}>
                                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>Start</Text>
                                </View>
                            )}
                            {job.isTomorrow && (
                                <Text style={styles.jobItemTomorrow}>Tomorrow</Text>
                            )}
                        </View>
                    </TouchableOpacity>
                ))}

                {/* ── Working History ── */}
                <View style={[styles.sectionHeader, { marginTop: 16 }]}>
                    <Text style={styles.sectionTitle}>Working History & Reviews</Text>
                </View>
                {workingHistory.map((item) => (
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

            </ScrollView>

            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItemActive}>
                    <View style={styles.activeIconContainer}>
                        <MaterialIcons name="grid-view" size={24} color="#2563EB" />
                    </View>
                    <Text style={styles.navLabelActive}>Dashboard</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(provider)/provider-schedule')}>
                    <Feather name="calendar" size={24} color="#6B7280" style={{ marginBottom: 4 }} />
                    <Text style={styles.navLabel}>Schedule</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(provider)/provider-earnings')}>
                    <MaterialIcons name="account-balance-wallet" size={24} color="#6B7280" style={{ marginBottom: 4 }} />
                    <Text style={styles.navLabel}>Earnings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(provider)/providerSetup-profile')}>
                    <Feather name="user" size={24} color="#6B7280" style={{ marginBottom: 4 }} />
                    <Text style={styles.navLabel}>Profile</Text>
                </TouchableOpacity>
            </View>


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
                                <Text style={styles.breakdownValue}>Rs 1,100.00</Text>
                            </View>
                            <View style={styles.breakdownRow}>
                                <Text style={styles.breakdownLabel}>Customer Tips</Text>
                                <Text style={styles.breakdownValue}>Rs 150.50</Text>
                            </View>
                            <View style={styles.breakdownRow}>
                                <Text style={styles.breakdownLabel}>Platform Fee (5%)</Text>
                                <Text style={styles.breakdownValueNegative}>-Rs 10.00</Text>
                            </View>

                            <View style={styles.breakdownDivider} />

                            <View style={styles.breakdownTotalRow}>
                                <Text style={styles.breakdownTotalLabel}>Total Earnings</Text>
                                <Text style={styles.breakdownTotalValue}>Rs 1,240.50</Text>
                            </View>
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
        backgroundColor: '#F3F4F6', // Off-white/grey background
    },
    heroBackground: {
        backgroundColor: '#0B132B',
        paddingHorizontal: 20,
        height: 260,
        borderBottomLeftRadius: 36,
        borderBottomRightRadius: 36,
    },
    heroTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10,
        marginBottom: 20,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        fontSize: 16,
        fontWeight: '900',
        color: '#0B132B',
    },
    profileName: {
        fontSize: 18,
        fontWeight: '800',
        color: '#fff',
        letterSpacing: 0.2,
    },
    profileSubtitle: {
        fontSize: 13,
        fontWeight: '500',
        color: '#9CA3AF',
        marginTop: 2,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#1E293B',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    notificationDot: {
        position: 'absolute',
        top: 10,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4444',
        borderWidth: 1,
        borderColor: '#1E293B',
    },
    statusBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#1C263A',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    statusBoxLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#10B981',
    },
    statusTitle: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 15,
    },
    statusSubtitle: {
        color: '#9CA3AF',
        fontWeight: '500',
        fontSize: 13,
        marginTop: 1,
    },

    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },

    // Earnings Card
    earningsCardContainer: {
        paddingHorizontal: 16,
        marginTop: -60,
        zIndex: 10,
        elevation: 10,
    },
    earningsCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 8 },
        elevation: 5,
    },
    earningsCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    earningsTitle: {
        fontSize: 12,
        fontWeight: '800',
        color: '#64748B',
        letterSpacing: 0.5,
    },
    earningsDate: {
        fontSize: 13,
        fontWeight: '700',
        color: '#64748B',
    },
    earningsAmountRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginTop: 10,
        marginBottom: 10,
    },
    currencySymbol: {
        fontSize: 18,
        fontWeight: '800',
        color: '#475569',
        marginTop: 8,
        marginRight: 4,
    },
    earningsAmount: {
        fontSize: 48,
        fontWeight: '900',
        color: '#0F172A',
        letterSpacing: -1,
    },
    jobsCompletedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#D1FAE5',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 4,
        marginBottom: 24,
    },
    jobsCompletedText: {
        color: '#065F46',
        fontWeight: '800',
        fontSize: 13,
    },
    earningsDivider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginBottom: 16,
    },
    payoutRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    payoutText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#64748B',
    },
    payoutTextBold: {
        color: '#0F172A',
        fontWeight: '800',
    },
    breakdownBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    breakdownText: {
        color: '#2563EB',
        fontWeight: '800',
        fontSize: 14,
        marginRight: 2,
    },

    // New Request Card
    newRequestCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 20,
        borderWidth: 1.5,
        borderColor: '#FDE68A', // Orange outline
        marginBottom: 24,
        shadowColor: '#F59E0B',
        shadowOpacity: 0.05,
        shadowRadius: 15,
        shadowOffset: { width: 0, height: 8 },
        elevation: 5,
    },
    requestCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    requestTitleText: {
        fontSize: 18,
        fontWeight: '900',
        color: '#0F172A',
    },
    expiresBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 6,
    },
    expiresText: {
        color: '#B45309',
        fontWeight: '800',
        fontSize: 12,
    },
    progressBarContainer: {
        height: 5,
        backgroundColor: '#FEF3C7',
        borderRadius: 3,
        marginBottom: 20,
        width: '100%',
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        width: '94%',
        backgroundColor: '#D97706',
        borderRadius: 3,
    },
    serviceTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#0F172A',
        marginBottom: 12,
    },
    timeLocRow: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 20,
    },
    infoPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        gap: 6,
    },
    infoPillText: {
        fontSize: 13,
        fontWeight: '800',
        color: '#0F172A',
    },
    estimatedEarningLabel: {
        fontSize: 12,
        fontWeight: '700',
        color: '#64748B',
        marginBottom: 4,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 24,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    priceTextSmall: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 4,
    },
    priceTextBig: {
        fontSize: 28,
        fontWeight: '900',
        color: '#0F172A',
        letterSpacing: -0.5,
    },
    distanceText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#64748B',
        marginBottom: 4,
    },
    actionsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    declineBtn: {
        flex: 1,
        borderRadius: 16,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
    },
    declineBtnText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#475569',
    },
    acceptBtn: {
        flex: 1,
        backgroundColor: '#2563EB',
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        shadowColor: '#2563EB',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
    },
    acceptBtnText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#fff',
    },

    // Today's schedule
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#0F172A',
        letterSpacing: -0.5,
    },
    blueBadge: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    blueBadgeText: {
        color: '#2563EB',
        fontWeight: '800',
        fontSize: 13,
    },
    jobItemCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 20,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
    },
    jobItemAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    jobItemAvatarText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#0F172A',
    },
    jobItemAvatarLight: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    jobItemAvatarTextLight: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1D4ED8',
    },
    jobItemInfo: {
        flex: 1,
    },
    jobItemName: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 2,
    },
    jobItemDesc: {
        fontSize: 13,
        fontWeight: '500',
        color: '#64748B',
    },
    jobItemRight: {
        alignItems: 'flex-end',
    },
    jobItemTime: {
        fontSize: 15,
        fontWeight: '900',
        color: '#0F172A',
        marginBottom: 4,
    },
    nextBadge: {
        backgroundColor: '#2563EB',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    nextBadgeText: {
        color: '#fff',
        fontWeight: '800',
        fontSize: 11,
    },
    jobItemTomorrow: {
        fontSize: 13,
        fontWeight: '700',
        color: '#64748B',
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

    // Modals
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
        borderRadius: 24,
        width: '100%',
        padding: 24,
    },
    notificationsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    notificationsTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#0F172A',
    },
    notificationItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 14,
        paddingVertical: 14,
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
        color: '#0F172A',
        marginBottom: 4,
    },
    notificationItemTime: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '500',
    },
    breakdownRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    breakdownLabel: {
        fontSize: 15,
        color: '#4B5563',
        fontWeight: '500',
    },
    breakdownValue: {
        fontSize: 15,
        fontWeight: '800',
        color: '#0F172A',
    },
    breakdownValueNegative: {
        fontSize: 15,
        fontWeight: '800',
        color: '#EF4444',
    },
    breakdownDivider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 6,
    },
    breakdownTotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    breakdownTotalLabel: {
        fontSize: 16,
        fontWeight: '900',
        color: '#0F172A',
    },
    breakdownTotalValue: {
        fontSize: 20,
        fontWeight: '900',
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
    },
});