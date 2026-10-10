import { MaterialIcons } from '@expo/vector-icons';
import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Platform,
    RefreshControl,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { getDashboardStats, getPendingProviders, rejectProvider, verifyProvider } from '../../lib/admin';
import { useAuth } from '@/context/auth-context';

export default function AdminDashboardScreen() {
    const router = useRouter();
    const { user, role, isLoading: authLoading } = useAuth();
    const [checkingAccess, setCheckingAccess] = useState(true);
    const [pendingProviders, setPendingProviders] = useState<any[]>([]);
    const [stats, setStats] = useState({ totalProviders: 0, totalBookings: 0, pendingVerifications: 0 });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (authLoading) return;

        if (!user) {
            router.replace('/(auth)/login');
            return;
        }

        if (role !== 'admin') {
            Alert.alert('Access Restricted', 'Administrator privileges are required to access this portal.');
            if (role === 'provider') {
                router.replace('/(provider)/provider-dashboard');
            } else {
                router.replace('/(customer)/home');
            }
            return;
        }

        setCheckingAccess(false);
        loadData();
    }, [user, role, authLoading]);

    async function loadData() {
        setLoading(true);
        const [pending, dashboardStats] = await Promise.all([getPendingProviders(), getDashboardStats()]);
        setPendingProviders(pending);
        setStats(dashboardStats);
        setLoading(false);
    }

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    }, []);

    async function handleVerify(providerId: string, name: string) {
        const result = await verifyProvider(providerId);
        if (result) {
            Alert.alert('Verified', `${name} has been verified.`);
            loadData();
        } else {
            Alert.alert('Error', 'Could not verify this provider.');
        }
    }

    async function handleReject(providerId: string, name: string) {
        Alert.alert('Reject Provider', `Are you sure you want to reject ${name}'s application?`, [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Reject',
                style: 'destructive',
                onPress: async () => {
                    const success = await rejectProvider(providerId);
                    if (success) {
                        Alert.alert('Rejected', `${name}'s application has been removed.`);
                        loadData();
                    } else {
                        Alert.alert('Error', 'Could not reject this provider.');
                    }
                },
            },
        ]);
    }

    if (authLoading || checkingAccess) {
        return (
            <View style={[styles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
                <StatusBar barStyle="light-content" backgroundColor="#1E293B" />
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.loadingText}>Verifying administrator privileges...</Text>
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            <StatusBar barStyle="light-content" backgroundColor="#1E293B" />

            {/* ── Dark Navy Curved Hero Header ── */}
            <View style={styles.heroBackground}>
                <SafeAreaView edges={['top']} style={{ flex: 0 }} />
                <View style={styles.heroTopBar}>
                    <View style={styles.heroBrandRow}>
                        <View style={styles.heroIconCircle}>
                            <MaterialIcons name="admin-panel-settings" size={18} color="#FFFFFF" />
                        </View>
                        <Text style={styles.heroTitle}>Admin Dashboard</Text>
                    </View>
                    <View style={styles.roleBadge}>
                        <Text style={styles.roleBadgeText}>FixHub Staff</Text>
                    </View>
                </View>
                <Text style={styles.heroSubtitle}>Platform operations and provider verifications</Text>
            </View>

            {/* ── Floating Overlapping Stats Row ── */}
            <View style={styles.floatingStatsWrapper}>
                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <View style={styles.statIconContainer}>
                            <MaterialIcons name="engineering" size={18} color="#2563EB" />
                        </View>
                        <Text style={styles.statValue}>{stats.totalProviders}</Text>
                        <Text style={styles.statLabel}>Providers</Text>
                    </View>
                    <View style={styles.statCard}>
                        <View style={styles.statIconContainer}>
                            <MaterialIcons name="event-available" size={18} color="#2563EB" />
                        </View>
                        <Text style={styles.statValue}>{stats.totalBookings}</Text>
                        <Text style={styles.statLabel}>Bookings</Text>
                    </View>
                    <View style={[styles.statCard, styles.statCardAlert]}>
                        <View style={[styles.statIconContainer, styles.statIconContainerAlert]}>
                            <MaterialIcons name="pending-actions" size={18} color="#D97706" />
                        </View>
                        <Text style={[styles.statValue, styles.statValueAlert]}>{stats.pendingVerifications}</Text>
                        <Text style={[styles.statLabel, styles.statLabelAlert]}>Pending</Text>
                    </View>
                </View>
            </View>

            {/* ── Section Title ── */}
            <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Pending Verifications</Text>
                <View style={styles.countBadge}>
                    <Text style={styles.countBadgeText}>{pendingProviders.length} to review</Text>
                </View>
            </View>

            {loading ? (
                <View style={styles.centerLoading}>
                    <ActivityIndicator size="large" color="#2563EB" />
                    <Text style={styles.loadingText}>Loading verifications...</Text>
                </View>
            ) : (
                <FlatList
                    data={pendingProviders}
                    keyExtractor={(item) => item.id}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <View style={styles.providerCard}>
                            <View style={styles.cardHeader}>
                                <View style={styles.providerAvatar}>
                                    <MaterialIcons name="person" size={26} color="#2563EB" />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.providerName}>{item.users?.name ?? 'Provider Application'}</Text>
                                    <View style={styles.detailRow}>
                                        <MaterialIcons name="handyman" size={13} color="#64748B" />
                                        <Text style={styles.providerDetail}>
                                            {item.service_type} · {item.experience_years} yrs exp
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.pendingChip}>
                                    <Text style={styles.pendingChipText}>Needs Review</Text>
                                </View>
                            </View>

                            {item.users?.phone ? (
                                <View style={[styles.detailRow, { marginTop: 8 }]}>
                                    <MaterialIcons name="phone" size={13} color="#64748B" />
                                    <Text style={styles.providerDetail}>{item.users?.phone}</Text>
                                </View>
                            ) : null}

                            {item.bio ? (
                                <Text style={styles.providerBio}>{item.bio}</Text>
                            ) : null}

                            <View style={styles.actionRow}>
                                <TouchableOpacity
                                    style={styles.verifyButton}
                                    onPress={() => handleVerify(item.id, item.users?.name)}
                                    activeOpacity={0.8}
                                >
                                    <MaterialIcons name="check" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
                                    <Text style={styles.verifyButtonText}>Approve & Verify</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.rejectButton}
                                    onPress={() => handleReject(item.id, item.users?.name)}
                                    activeOpacity={0.8}
                                >
                                    <MaterialIcons name="close" size={16} color="#DC2626" style={{ marginRight: 4 }} />
                                    <Text style={styles.rejectButtonText}>Reject</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <View style={styles.emptyIconCircle}>
                                <MaterialIcons name="verified" size={42} color="#10B981" />
                            </View>
                            <Text style={styles.emptyText}>All caught up!</Text>
                            <Text style={styles.emptySubtext}>There are no pending provider applications to review.</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#EEF2F6', // Crisp Slate-Grey canvas
    },
    heroBackground: {
        backgroundColor: '#1E293B', // Dark slate hero
        paddingHorizontal: 20,
        paddingBottom: 36,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
    },
    heroTopBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? 12 : 8,
        paddingBottom: 4,
    },
    heroBrandRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    heroIconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#2563EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    roleBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 14,
    },
    roleBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#E2E8F0',
    },
    heroSubtitle: {
        fontSize: 12,
        fontWeight: '500',
        color: '#94A3B8',
        marginTop: 4,
    },

    // ── Floating Overlapping Stats Row ──
    floatingStatsWrapper: {
        paddingHorizontal: 16,
        marginTop: -22,
        zIndex: 20,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 10,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    statCardAlert: {
        backgroundColor: '#FFFBEB',
        borderColor: '#FDE68A',
    },
    statIconContainer: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
    },
    statIconContainerAlert: {
        backgroundColor: '#FEF3C7',
    },
    statValue: {
        fontSize: 20,
        fontWeight: '800',
        color: '#0F172A',
    },
    statValueAlert: {
        color: '#D97706',
    },
    statLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#64748B',
        marginTop: 2,
    },
    statLabelAlert: {
        color: '#B45309',
    },

    // ── Section ──
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginTop: 20,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0F172A',
    },
    countBadge: {
        backgroundColor: '#E2E8F0',
        paddingHorizontal: 9,
        paddingVertical: 3,
        borderRadius: 12,
    },
    countBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#475569',
    },

    // ── List & Provider Cards ──
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 36,
    },
    providerCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 12,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    providerAvatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#EFF6FF',
        borderWidth: 1.5,
        borderColor: '#DBEAFE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    providerName: {
        fontSize: 15,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 3,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    providerDetail: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '500',
    },
    pendingChip: {
        backgroundColor: '#FFFBEB',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#FDE68A',
    },
    pendingChipText: {
        fontSize: 10,
        fontWeight: '700',
        color: '#B45309',
    },
    providerBio: {
        fontSize: 13,
        color: '#475569',
        marginTop: 10,
        lineHeight: 18,
        backgroundColor: '#F8FAFC',
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    actionRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 14,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    verifyButton: {
        flex: 2,
        backgroundColor: '#2563EB',
        borderRadius: 12,
        paddingVertical: 11,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    verifyButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 13,
    },
    rejectButton: {
        flex: 1,
        backgroundColor: '#FEF2F2',
        borderRadius: 12,
        paddingVertical: 11,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    rejectButtonText: {
        color: '#DC2626',
        fontWeight: '700',
        fontSize: 13,
    },

    // ── Loading & Empty ──
    centerLoading: {
        alignItems: 'center',
        marginTop: 50,
    },
    loadingText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
        marginTop: 12,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 50,
        paddingHorizontal: 24,
    },
    emptyIconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#ECFDF5',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#A7F3D0',
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 4,
    },
    emptySubtext: {
        fontSize: 13,
        color: '#64748B',
        textAlign: 'center',
    },
});