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

    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Bookings</Text>
            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <FlatList
                    data={bookings}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => router.push(`/(transaction)/booking-tracking?bookingId=${item.id}`)}
                        >
                            <Text style={styles.providerName}>{item.providers?.users?.name ?? 'Unknown Provider'}</Text>
                            <Text style={styles.detail}>{item.providers?.service_type}</Text>
                            <Text style={styles.detail}>{item.service_date} · {item.service_time}</Text>
                            <View style={styles.statusBadge}>
                                <Text style={styles.statusText}>{item.status}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={<Text style={styles.empty}>No bookings yet.</Text>}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 60 },
    title: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
    card: { padding: 14, borderWidth: 1, borderColor: '#eee', borderRadius: 10, marginBottom: 10 },
    providerName: { fontSize: 15, fontWeight: '600' },
    detail: { color: '#60646C', fontSize: 13, marginTop: 2 },
    statusBadge: { alignSelf: 'flex-start', backgroundColor: '#E0E1E6', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10, marginTop: 8 },
    statusText: { fontSize: 11, fontWeight: '600', color: '#333' },
    empty: { color: '#999', fontStyle: 'italic', textAlign: 'center', marginTop: 20 },
});