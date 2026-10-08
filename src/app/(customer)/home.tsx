import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getProviders } from '../../lib/bookings';

export default function HomeScreen() {
    const router = useRouter();
    const [providers, setProviders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProviders();
    }, []);

    async function loadProviders() {
        setLoading(true);
        const data = await getProviders();
        setProviders(data);
        setLoading(false);
    }

    const categories = [
        { name: 'Plumbing', icon: 'water-outline' },
        { name: 'Electrical', icon: 'flash-outline' },
        { name: 'Cleaning', icon: 'sparkles-outline' },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.screenTitle}>FixHub</Text>

            <View style={styles.searchBarContainer}>
                <Ionicons name="search" size={18} color="#999" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search services..."
                    onSubmitEditing={() => router.push('/(booking)/search-results')}
                />
            </View>

            <View style={styles.categoryRow}>
                {categories.map((cat) => (
                    <TouchableOpacity
                        key={cat.name}
                        style={styles.categoryButton}
                        onPress={() => router.push(`/(booking)/search-results?category=${cat.name}`)}
                    >
                        <Ionicons name={cat.icon as any} size={22} color="#2563EB" />
                        <Text style={styles.categoryText}>{cat.name}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Text style={styles.sectionTitle}>Nearby Providers</Text>

            {loading ? (
                <Text>Loading...</Text>
            ) : (
                <FlatList
                    data={providers}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.providerCard}
                            onPress={() => router.push(`/(booking)/provider-profile?id=${item.id}`)}
                        >
                            <View style={styles.avatarPlaceholder}>
                                <Ionicons name="person" size={24} color="#fff" />
                            </View>
                            <View style={styles.providerInfo}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.providerName}>{item.users?.name ?? 'Unnamed Provider'}</Text>
                                    {item.verified ? (
                                        <View style={styles.verifiedBadge}>
                                            <Ionicons name="checkmark-circle" size={12} color="#fff" />
                                            <Text style={styles.verifiedBadgeText}> Verified</Text>
                                        </View>
                                    ) : (
                                        <View style={styles.unverifiedBadge}>
                                            <Text style={styles.unverifiedBadgeText}>Not Verified</Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={styles.providerType}>{item.service_type}</Text>
                                <View style={styles.cardFooter}>
                                    <Ionicons name="pricetag-outline" size={14} color="#2563EB" />
                                    <Text style={styles.providerRate}> Rs. {item.rate}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Ionicons name="search-outline" size={40} color="#ccc" />
                            <Text style={styles.emptyText}>No providers found</Text>
                            <Text style={styles.emptySubtext}>Check back soon</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 60, backgroundColor: '#fff' },
    screenTitle: { fontSize: 24, fontWeight: '700', marginBottom: 16, color: '#2563EB' },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F0F3',
        borderRadius: 12,
        paddingHorizontal: 14,
        height: 46,
        gap: 8,
        marginBottom: 20,
    },
    searchInput: { flex: 1, fontSize: 14 },
    categoryRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
    categoryButton: {
        flex: 1,
        paddingVertical: 14,
        backgroundColor: '#fff',
        borderRadius: 12,
        alignItems: 'center',
        gap: 6,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    categoryText: { color: '#2563EB', fontWeight: '600', fontSize: 12 },
    sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
    providerCard: {
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
    avatarPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#2563EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    providerInfo: { flex: 1 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    providerName: { fontSize: 15, fontWeight: '600' },
    providerType: { color: '#60646C', marginTop: 2 },
    cardFooter: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
    providerRate: { color: '#2563EB', fontWeight: '600' },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2563EB',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
    },
    verifiedBadgeText: { color: '#fff', fontSize: 11, fontWeight: '600' },
    unverifiedBadge: {
        backgroundColor: '#FEE2E2',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#DC2626',
    },
    unverifiedBadgeText: { color: '#DC2626', fontSize: 11, fontWeight: '600' },
    emptyState: { alignItems: 'center', marginTop: 40, gap: 6 },
    emptyText: { fontSize: 15, fontWeight: '600', color: '#666' },
    emptySubtext: { fontSize: 13, color: '#999' },
});