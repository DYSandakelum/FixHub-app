import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getCustomerBookings } from '../../lib/bookings';

const TEMP_CUSTOMER_ID = '18b0a243-3adc-42fc-aadf-faa7cc698a6d'; // TODO: replace with real logged-in user once Auth is built

export default function MessagesScreen() {
    const router = useRouter();
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadConversations();
    }, []);

    async function loadConversations() {
        setLoading(true);
        const data = await getCustomerBookings(TEMP_CUSTOMER_ID);
        setBookings(data);
        setLoading(false);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.screenTitle}>Messages</Text>

            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <FlatList
                    data={bookings}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.card}
                            onPress={() => router.push(`/(transaction)/chat?bookingId=${item.id}`)}
                        >
                            <View style={styles.iconCircle}>
                                <Ionicons name="person" size={22} color="#fff" />
                            </View>
                            <View style={styles.cardInfo}>
                                <Text style={styles.providerName}>{item.providers?.users?.name ?? 'Unknown Provider'}</Text>
                                <Text style={styles.detail}>{item.providers?.service_type} · {item.service_date}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={18} color="#999" />
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Ionicons name="chatbubble-outline" size={40} color="#ccc" />
                            <Text style={styles.emptyText}>No conversations yet</Text>
                            <Text style={styles.emptySubtext}>Messages from your bookings will appear here</Text>
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
        alignItems: 'center',
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
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#2563EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardInfo: { flex: 1 },
    providerName: { fontSize: 15, fontWeight: '600' },
    detail: { color: '#60646C', fontSize: 13, marginTop: 2 },
    emptyState: { alignItems: 'center', marginTop: 60, gap: 6 },
    emptyText: { fontSize: 15, fontWeight: '600', color: '#666' },
    emptySubtext: { fontSize: 13, color: '#999', textAlign: 'center', paddingHorizontal: 30 },
});