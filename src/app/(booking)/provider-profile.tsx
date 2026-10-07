import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import BackButton from '../../components/BackButton';
import { getProviderById } from '../../lib/bookings';

export default function ProviderProfileScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [provider, setProvider] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) loadProvider();
    }, [id]);

    async function loadProvider() {
        setLoading(true);
        const data = await getProviderById(id as string);
        setProvider(data);
        setLoading(false);
    }

    if (loading) {
        return (
            <View style={styles.center}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!provider) {
        return (
            <View style={styles.center}>
                <Text>Provider not found.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <BackButton />
            <View style={styles.header}>
                <View style={styles.avatarPlaceholder} />
                <Text style={styles.name}>{provider.users?.name ?? 'Unnamed Provider'}</Text>
                {provider.verified ? (
                    <View style={styles.verifiedBadge}>
                        <Text style={styles.verifiedText}>Verified</Text>
                    </View>
                ) : (
                    <View style={styles.unverifiedBadge}>
                        <Text style={styles.unverifiedText}>Not Verified</Text>
                    </View>
                )}
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Service</Text>
                <Text style={styles.infoValue}>{provider.service_type}</Text>
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Experience</Text>
                <Text style={styles.infoValue}>{provider.experience_years} years</Text>
            </View>
            <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Rate</Text>
                <Text style={styles.infoValue}>Rs. {provider.rate}</Text>
            </View>

            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.bio}>{provider.bio}</Text>

            <Text style={styles.sectionTitle}>Reviews</Text>
            <Text style={styles.noReviews}>No reviews yet.</Text>

            <TouchableOpacity
                style={styles.bookButton}
                onPress={() => router.push(`/(booking)/booking?providerId=${provider.id}`)}
            >
                <Text style={styles.bookButtonText}>Book Now</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 60 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { alignItems: 'center', marginBottom: 20 },
    avatarPlaceholder: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#E0E1E6', marginBottom: 12 },
    name: { fontSize: 18, fontWeight: '600' },
    verifiedBadge: { backgroundColor: '#2563EB', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginTop: 6 },
    verifiedText: { color: '#fff', fontSize: 12, fontWeight: '600' },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
    infoLabel: { color: '#60646C' },
    infoValue: { fontWeight: '600' },
    sectionTitle: { fontSize: 15, fontWeight: '600', marginTop: 20, marginBottom: 8 },
    bio: { color: '#333', lineHeight: 20 },
    noReviews: { color: '#999', fontStyle: 'italic' },
    bookButton: { backgroundColor: '#2563EB', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 30, marginBottom: 40 },
    bookButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
    unverifiedBadge: { backgroundColor: '#FEE2E2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginTop: 6, borderWidth: 1, borderColor: '#DC2626' },
    unverifiedText: { color: '#DC2626', fontSize: 12, fontWeight: '600' },
});