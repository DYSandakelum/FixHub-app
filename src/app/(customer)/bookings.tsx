import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCustomerBookings } from '../../lib/bookings';
import { useAuth } from '@/context/auth-context';

export default function BookingsScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState<string>('All');

    useEffect(() => {
        loadBookings();
    }, [user?.id]);

    async function loadBookings() {
        if (!user?.id) {
            setBookings([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        const data = await getCustomerBookings(user.id);
        setBookings(data);
        setLoading(false);
    }

    const filterOptions = ['All', 'Confirmed', 'Completed', 'Cancelled'];

    const filteredBookings = bookings.filter((b) => {
        if (selectedStatus === 'All') return true;
        return b.status?.toLowerCase() === selectedStatus.toLowerCase();
    });

    function statusColor(status: string) {
        switch (status) {
            case 'Confirmed':
                return { bg: '#EFF6FF', text: '#2563EB', border: '#BFDBFE', icon: 'check-circle' };
            case 'Completed':
                return { bg: '#ECFDF5', text: '#059669', border: '#A7F3D0', icon: 'done-all' };
            case 'Cancelled':
                return { bg: '#FEF2F2', text: '#DC2626', border: '#FECACA', icon: 'cancel' };
            default:
                return { bg: '#FEF3C7', text: '#D97706', border: '#FDE68A', icon: 'schedule' };
        }
    }

    const renderHeader = () => (
        <View>
            {/* ── Dark Navy Curved Hero Header ── */}
            <View style={styles.heroBackground}>
                <SafeAreaView edges={['top']} style={styles.safeArea}>
                    <View style={styles.heroTopBar}>
                        <View style={styles.headerLeft}>
                            <View style={styles.headerIconCircle}>
                                <MaterialIcons name="event-available" size={18} color="#fff" />
                            </View>
                            <Text style={styles.heroTitle}>My Bookings</Text>
                        </View>
                        <View style={styles.countBadge}>
                            <Text style={styles.countBadgeText}>{bookings.length} Total</Text>
                        </View>
                    </View>
                    <Text style={styles.heroSubtitle}>Manage your appointments & service history</Text>
                </SafeAreaView>
            </View>

            {/* ── Status Segmented Filter Bar ── */}
            <View style={styles.filterBarContainer}>
                <View style={styles.filterBar}>
                    {filterOptions.map((opt) => {
                        const isActive = selectedStatus === opt;
                        return (
                            <TouchableOpacity
                                key={opt}
                                style={[styles.filterChip, isActive && styles.filterChipActive]}
                                onPress={() => setSelectedStatus(opt)}
                                activeOpacity={0.7}
                            >
                                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                                    {opt}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.screen}>
            <StatusBar barStyle="light-content" backgroundColor="#1E293B" />

            <FlatList
                data={filteredBookings}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                    const statusStyle = statusColor(item.status);
                    return (
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => router.push(`/(transaction)/booking-tracking?bookingId=${item.id}`)}
                            activeOpacity={0.85}
                        >
                            <View style={styles.cardTopRow}>
                                <View style={styles.avatarCircle}>
                                    <MaterialIcons name="build" size={22} color="#2563EB" />
                                </View>
                                <View style={styles.cardMainInfo}>
                                    <Text style={styles.providerName} numberOfLines={1}>
                                        {item.providers?.users?.name ?? 'Service Provider'}
                                    </Text>
                                    <View style={styles.servicePill}>
                                        <Text style={styles.servicePillText}>{item.providers?.service_type}</Text>
                                    </View>
                                </View>
                                <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg, borderColor: statusStyle.border }]}>
                                    <MaterialIcons name={statusStyle.icon as any} size={12} color={statusStyle.text} />
                                    <Text style={[styles.statusText, { color: statusStyle.text }]}> {item.status}</Text>
                                </View>
                            </View>

                            <View style={styles.cardDivider} />

                            <View style={styles.cardBottomRow}>
                                <View style={styles.dateCol}>
                                    <MaterialIcons name="calendar-today" size={14} color="#64748B" />
                                    <Text style={styles.dateTimeText}>
                                        {item.service_date} · {item.service_time}
                                    </Text>
                                </View>
                                <View style={styles.cardActionsRow}>
                                    <TouchableOpacity
                                        style={styles.chatActionBtn}
                                        onPress={() => router.push(`/(transaction)/chat?bookingId=${item.id}`)}
                                        activeOpacity={0.8}
                                    >
                                        <MaterialIcons name="chat" size={16} color="#2563EB" />
                                    </TouchableOpacity>

                                    {item.status === 'Completed' ? (
                                        <TouchableOpacity
                                            style={styles.reviewActionBtn}
                                            onPress={() => router.push(`/(transaction)/rate-review?bookingId=${item.id}`)}
                                            activeOpacity={0.8}
                                        >
                                            <MaterialIcons name="star-rate" size={15} color="#D97706" />
                                            <Text style={styles.reviewText}>Review</Text>
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity
                                            style={styles.trackAction}
                                            onPress={() => router.push(`/(transaction)/booking-tracking?bookingId=${item.id}`)}
                                            activeOpacity={0.8}
                                        >
                                            <Text style={styles.trackText}>Track Status</Text>
                                            <MaterialIcons name="chevron-right" size={16} color="#fff" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                }}
                ListEmptyComponent={
                    loading ? (
                        <View style={styles.emptyState}>
                            <ActivityIndicator size="large" color="#2563EB" />
                            <Text style={styles.loadingText}>Loading your bookings...</Text>
                        </View>
                    ) : (
                        <View style={styles.emptyState}>
                            <View style={styles.emptyIconCircle}>
                                <MaterialIcons name="event-busy" size={42} color="#94A3B8" />
                            </View>
                            <Text style={styles.emptyText}>No {selectedStatus !== 'All' ? selectedStatus.toLowerCase() : ''} bookings</Text>
                            <Text style={styles.emptySubtext}>Your scheduled service requests will appear here</Text>
                        </View>
                    )
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#EEF2F6', // Crisp Slate-Grey background matching provider screens
    },
    listContent: {
        paddingBottom: 36,
    },

    // ── Dark Navy Hero Header ──
    heroBackground: {
        backgroundColor: '#1E293B',
        paddingHorizontal: 20,
        paddingBottom: 32,
        borderBottomLeftRadius: 36,
        borderBottomRightRadius: 36,
    },
    safeArea: {
        paddingTop: Platform.OS === 'android' ? 12 : 0,
    },
    heroTopBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerIconCircle: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#2563EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    countBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 14,
    },
    countBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#E2E8F0',
    },
    heroSubtitle: {
        fontSize: 13,
        fontWeight: '500',
        color: '#94A3B8',
        marginTop: 2,
    },

    // ── Filter Bar ──
    filterBarContainer: {
        paddingHorizontal: 16,
        marginTop: 18,
        marginBottom: 14,
    },
    filterBar: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 5,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        elevation: 2,
        shadowColor: '#0F172A',
        shadowOpacity: 0.04,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    },
    filterChip: {
        flex: 1,
        paddingVertical: 9,
        alignItems: 'center',
        borderRadius: 12,
    },
    filterChipActive: {
        backgroundColor: '#2563EB',
    },
    filterChipText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748B',
    },
    filterChipTextActive: {
        color: '#FFFFFF',
        fontWeight: '700',
    },

    // ── Card ──
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    cardTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatarCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#EFF6FF',
        borderWidth: 1.5,
        borderColor: '#DBEAFE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardMainInfo: {
        flex: 1,
    },
    providerName: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 4,
    },
    servicePill: {
        alignSelf: 'flex-start',
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    servicePillText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#475569',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 9,
        paddingVertical: 5,
        borderRadius: 12,
        borderWidth: 1,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '700',
    },
    cardDivider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginVertical: 12,
    },
    cardBottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateCol: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dateTimeText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#475569',
    },
    cardActionsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    chatActionBtn: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#EFF6FF',
        borderWidth: 1,
        borderColor: '#DBEAFE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    reviewActionBtn: {
        backgroundColor: '#FFFBEB',
        borderWidth: 1,
        borderColor: '#FDE68A',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 12,
        gap: 4,
    },
    reviewText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#D97706',
    },
    trackAction: {
        backgroundColor: '#2563EB',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 12,
        gap: 2,
    },
    trackText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    // ── Empty & Loading States ──
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
        paddingHorizontal: 32,
    },
    emptyIconCircle: {
        width: 76,
        height: 76,
        borderRadius: 38,
        backgroundColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14,
    },
    loadingText: {
        marginTop: 14,
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
    },
    emptyText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1E293B',
    },
    emptySubtext: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 4,
        textAlign: 'center',
    },
});