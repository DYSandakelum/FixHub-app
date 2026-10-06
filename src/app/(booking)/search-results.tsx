import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { searchProviders } from '../../lib/bookings';

export default function SearchResultsScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const [providers, setProviders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterVisible, setFilterVisible] = useState(false);
    const [selectedType, setSelectedType] = useState<string | undefined>(
        typeof params.category === 'string' ? params.category : undefined
    );
    const [maxPrice, setMaxPrice] = useState<number | undefined>(undefined);

    useEffect(() => {
        loadResults();
    }, [selectedType, maxPrice]);

    async function loadResults() {
        setLoading(true);
        const data = await searchProviders({ serviceType: selectedType, maxPrice });
        setProviders(data);
        setLoading(false);
    }

    const serviceTypes = ['Plumbing', 'Electrical', 'Cleaning'];
    const priceOptions = [2000, 3000, 5000];

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <Text style={styles.title}>Search Results</Text>
                <TouchableOpacity onPress={() => setFilterVisible(true)}>
                    <Text style={styles.filterLink}>Filter</Text>
                </TouchableOpacity>
            </View>

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
                    ListEmptyComponent={<Text>No providers match your filters.</Text>}
                />
            )}

            <Modal visible={filterVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Filter</Text>

                        <Text style={styles.filterLabel}>Service Type</Text>
                        <View style={styles.optionRow}>
                            {serviceTypes.map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    style={[styles.optionButton, selectedType === type && styles.optionButtonActive]}
                                    onPress={() => setSelectedType(selectedType === type ? undefined : type)}
                                >
                                    <Text style={selectedType === type ? styles.optionTextActive : styles.optionText}>
                                        {type}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.filterLabel}>Max Price</Text>
                        <View style={styles.optionRow}>
                            {priceOptions.map((price) => (
                                <TouchableOpacity
                                    key={price}
                                    style={[styles.optionButton, maxPrice === price && styles.optionButtonActive]}
                                    onPress={() => setMaxPrice(maxPrice === price ? undefined : price)}
                                >
                                    <Text style={maxPrice === price ? styles.optionTextActive : styles.optionText}>
                                        Rs. {price}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity style={styles.applyButton} onPress={() => setFilterVisible(false)}>
                            <Text style={styles.applyButtonText}>Apply Filters</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 60 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
    title: { fontSize: 18, fontWeight: '600' },
    filterLink: { color: '#1D9E75', fontWeight: '600' },
    providerCard: { padding: 12, borderWidth: 1, borderColor: '#eee', borderRadius: 8, marginBottom: 8 },
    providerName: { fontSize: 15, fontWeight: '600' },
    providerType: { color: '#60646C' },
    providerRate: { color: '#1D9E75', fontWeight: '600', marginTop: 4 },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 20 },
    modalTitle: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
    filterLabel: { fontWeight: '600', marginTop: 12, marginBottom: 8 },
    optionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    optionButton: { paddingVertical: 8, paddingHorizontal: 12, borderWidth: 1, borderColor: '#ccc', borderRadius: 8 },
    optionButtonActive: { backgroundColor: '#1D9E75', borderColor: '#1D9E75' },
    optionText: { color: '#333' },
    optionTextActive: { color: '#fff', fontWeight: '600' },
    applyButton: { backgroundColor: '#1D9E75', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 20 },
    applyButtonText: { color: '#fff', fontWeight: '600' },
});