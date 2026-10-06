import { useCallback, useEffect, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getDashboardStats, getPendingProviders, rejectProvider, verifyProvider } from '../../lib/admin';

export default function AdminDashboardScreen() {
    const [pendingProviders, setPendingProviders] = useState<any[]>([]);
    const [stats, setStats] = useState({ totalProviders: 0, totalBookings: 0, pendingVerifications: 0 });
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

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

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Admin Dashboard</Text>

            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{stats.totalProviders}</Text>
                    <Text style={styles.statLabel}>Providers</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{stats.totalBookings}</Text>
                    <Text style={styles.statLabel}>Bookings</Text>
                </View>
                <View style={[styles.statCard, styles.statCardAlert]}>
                    <Text style={[styles.statValue, styles.statValueAlert]}>{stats.pendingVerifications}</Text>
                    <Text style={styles.statLabel}>Pending</Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Pending Provider Verifications</Text>

            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <FlatList
                    data={pendingProviders}
                    keyExtractor={(item) => item.id}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    renderItem={({ item }) => (
                        <View style={styles.providerCard}>
                            <Text style={styles.providerName}>{item.users?.name ?? 'Unnamed'}</Text>
                            <Text style={styles.providerDetail}>{item.service_type} · {item.experience_years} yrs experience</Text>
                            <Text style={styles.providerDetail}>{item.users?.phone}</Text>
                            <Text style={styles.providerBio}>{item.bio}</Text>

                            <View style={styles.actionRow}>
                                <TouchableOpacity
                                    style={styles.verifyButton}
                                    onPress={() => handleVerify(item.id, item.users?.name)}
                                >
                                    <Text style={styles.verifyButtonText}>Verify</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.rejectButton}
                                    onPress={() => handleReject(item.id, item.users?.name)}
                                >
                                    <Text style={styles.rejectButtonText}>Reject</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    ListEmptyComponent={<Text style={styles.empty}>No pending verifications.</Text>}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 60 },
    title: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
    statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
    statCard: { flex: 1, backgroundColor: '#F0F0F3', borderRadius: 10, padding: 14, alignItems: 'center' },
    statCardAlert: { backgroundColor: '#FDF1E0' },
    statValue: { fontSize: 22, fontWeight: '700', color: '#2563EB' },
    statValueAlert: { color: '#EF9F27' },
    statLabel: { fontSize: 12, color: '#60646C', marginTop: 4 },
    sectionTitle: { fontSize: 15, fontWeight: '600', marginBottom: 10 },
    providerCard: { padding: 14, borderWidth: 1, borderColor: '#eee', borderRadius: 10, marginBottom: 10 },
    providerName: { fontSize: 15, fontWeight: '600' },
    providerDetail: { color: '#60646C', fontSize: 13, marginTop: 2 },
    providerBio: { color: '#333', fontSize: 13, marginTop: 6, fontStyle: 'italic' },
    actionRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
    verifyButton: { flex: 1, backgroundColor: '#2563EB', padding: 10, borderRadius: 8, alignItems: 'center' },
    verifyButtonText: { color: '#fff', fontWeight: '600' },
    rejectButton: { flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#DC2626', padding: 10, borderRadius: 8, alignItems: 'center' },
    rejectButtonText: { color: '#DC2626', fontWeight: '600' },
    empty: { color: '#999', fontStyle: 'italic', textAlign: 'center', marginTop: 20 },
});