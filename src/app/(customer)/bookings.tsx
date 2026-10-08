import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getCustomerBookings } from '../../lib/bookings';

const TEMP_CUSTOMER_ID = '18b0a243-3adc-42fc-aadf-faa7cc698a6d'; // TODO: replace with real logged-in user once Auth is built

export default function BookingsScreen() {
    const router = useRouter();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBookings();
    }, []);

    async function loadBookings() {
        setLoading(true);
        const data = await getCustomerBookings(TEMP_CUSTOMER_ID);
        setBookings(data);
        setLoading(false);
    }

    function statusColor(status: string) {
        switch (status) {
            case 'Confirmed':
                return { bg: '#DBEAFE', text: '#2563EB' };
            case 'Completed':
                return { bg: '#DCFCE7', text: '#16A34A' };
            case 'Cancelled':
                return { bg: '#FEE2E2', text: '#DC2626' };
            default:
                return { bg: '#F0F0F3', text: '#60646C' };
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.screenTitle}>My Bookings</Text>

            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <FlatList
                    data={bookings}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                        const statusStyle = statusColor(item.status);
                        return (
                            <TouchableOpacity
                                style={styles.card}
                                onPress={() => router.push(`/(transaction)/booking-tracking?bookingId=${item.id}`)}
                            >
                                <View style={styles.iconCircle}>
                                    <Ionicons name="briefcase-outline" size={22} color="#fff" />
                                </View>
                                <View style={styles.cardInfo}>
                                    <Text style={styles.providerName}>{item.providers?.users?.name ?? 'Unknown Provider'}</Text>
                                    <Text style={styles.detail}>{item.providers?.service_type}</Text>
                                    <View style={styles.dateRow}>
                                        <Ionicons name="calendar-outline" size={13} color="#60646C" />
                                        <Text style={styles.detail}> {item.service_date} · {item.service_time}</Text>
                                    </View>
                                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                                        <Text style={[styles.statusText, { color: statusStyle.text }]}>{item.status}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Ionicons name="calendar-outline" size={40} color="#ccc" />
                            <Text style={styles.emptyText}>No bookings yet</Text>
                            <Text style={styles.emptySubtext}>Book a service to see it here</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 60, backgroundColor: '#fff' },
    screenTitle: { fontSize: 24, fontWeight: '700', marginBottom: 20, color: '#2563EB' },
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 14,
        marginBottom: 12,
        gap: 12,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#2563EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardInfo: { flex: 1 },
    providerName: { fontSize: 15, fontWeight: '600' },
    detail: { color: '#60646C', fontSize: 13 },
    dateRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10, marginTop: 8 },
    statusText: { fontSize: 11, fontWeight: '600' },
    emptyState: { alignItems: 'center', marginTop: 60, gap: 6 },
    emptyText: { fontSize: 15, fontWeight: '600', color: '#666' },
    emptySubtext: { fontSize: 13, color: '#999' },
});