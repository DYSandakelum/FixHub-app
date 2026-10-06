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

    const categories = ['Plumbing', 'Electrical', 'Cleaning'];

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchBar}
                placeholder="Search services..."
                onSubmitEditing={() => router.push('/(booking)/search-results')}
            />

            <View style={styles.categoryRow}>
                {categories.map((cat) => (
                    <TouchableOpacity
                        key={cat}
                        style={styles.categoryButton}
                        onPress={() => router.push(`/(booking)/search-results?category=${cat}`)}
                    >
                        <Text style={styles.categoryText}>{cat}</Text>
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
                            <Text style={styles.providerName}>{item.users?.name ?? 'Unnamed Provider'}</Text>
                            <Text style={styles.providerType}>{item.service_type}</Text>
                            <Text style={styles.providerRate}>Rs. {item.rate}</Text>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={<Text>No providers found yet.</Text>}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 60 },
    searchBar: {
        height: 44,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 12,
        marginBottom: 16,
    },
    categoryRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
    categoryButton: {
        flex: 1,
        padding: 12,
        borderWidth: 1,
        borderColor: '#2563EB',
        borderRadius: 8,
        alignItems: 'center',
    },
    categoryText: { color: '#2563EB', fontWeight: '600' },
    sectionTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
    providerCard: {
        padding: 12,
        borderWidth: 1,
        borderColor: '#eee',
        borderRadius: 8,
        marginBottom: 8,
    },
    providerName: { fontSize: 15, fontWeight: '600' },
    providerType: { color: '#60646C' },
    providerRate: { color: '#2563EB', fontWeight: '600', marginTop: 4 },
});