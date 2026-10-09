import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCurrency } from './settingsStore';

export default function RequestDetailsScreen() {
    const { formatCurrency } = useCurrency();
    const router = useRouter();
    const routeCoordinates = [
        { latitude: 47.5950, longitude: -122.3380 },
        { latitude: 47.5980, longitude: -122.3360 },
        { latitude: 47.6020, longitude: -122.3340 },
        { latitude: 47.6062, longitude: -122.3321 },
    ];

    const [providerLocation, setProviderLocation] = useState(routeCoordinates[0]);

    useEffect(() => {
        let step = 0;
        let segment = 0;
        const totalSteps = 15; // Smoothness factor per segment

        const timer = setInterval(() => {
            if (segment >= routeCoordinates.length - 1) {
                clearInterval(timer);
                return;
            }

            const startPt = routeCoordinates[segment];
            const endPt = routeCoordinates[segment + 1];

            step++;
            const progress = step / totalSteps;

            setProviderLocation({
                latitude: startPt.latitude + (endPt.latitude - startPt.latitude) * progress,
                longitude: startPt.longitude + (endPt.longitude - startPt.longitude) * progress,
            });

            if (step >= totalSteps) {
                step = 0;
                segment++;
            }
        }, 300); // 300ms update rate

        return () => clearInterval(timer);
    }, []);

    return (
        <View style={styles.screen}>
            {/* ── Background Map ── */}
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '55%' }}>
                <MapView
                    style={{ width: '100%', height: '100%' }}
                    initialRegion={{
                        latitude: 47.6010,
                        longitude: -122.3350,
                        latitudeDelta: 0.03,
                        longitudeDelta: 0.03,
                    }}
                >
                    <Polyline
                        coordinates={routeCoordinates}
                        strokeColor="#059669"
                        strokeWidth={4}
                    />
                    <Marker
                        coordinate={providerLocation}
                        pinColor="orange"
                    />
                    <Marker
                        coordinate={{ latitude: 47.6062, longitude: -122.3321 }}
                        pinColor="green"
                    />
                </MapView>
            </View>

            <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
                {/* ── Header ── */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <MaterialIcons name="chevron-left" size={28} color="#111827" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.moreButton}>
                        <MaterialIcons name="my-location" size={24} color="#111827" />
                    </TouchableOpacity>
                </View>

                {/* ── Scrollable Sheet ── */}
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.sheetContainer}>

                        {/* ── Header Address (Like Ride Share) ── */}
                        <View style={{ marginBottom: 24 }}>
                            <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827', marginBottom: 6 }}>1248 Oakwood Dr, Apt 4B</Text>
                            <Text style={{ fontSize: 13, color: '#6B7280', fontWeight: '500' }}>Seattle WA • 2.4 km away (Est. 8 min)</Text>
                        </View>

                        {/* ── Profile Card ── */}
                        <View style={styles.profileCard}>
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarInitials}>AC</Text>
                            </View>
                            <View style={styles.profileInfo}>
                                <Text style={styles.profileName}>Alice Cooper</Text>
                                <View style={styles.ratingRow}>
                                    <Text style={styles.starIcon}>★</Text>
                                    <Text style={styles.ratingText}>4.9 (42 reviews)</Text>
                                </View>
                            </View>
                        </View>

                        {/* ── Info Box ── */}
                        <View style={styles.infoBox}>
                            <View style={styles.infoRow}>
                                <View style={styles.iconBox}><MaterialIcons name="calendar-today" size={16} color="#6B7280" /></View>
                                <View style={styles.infoTextContainer}>
                                    <Text style={styles.infoLabel}>DATE & TIME</Text>
                                    <Text style={styles.infoValue}>Today, Oct 16 • 2:00 PM - 4:00 PM</Text>
                                </View>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.infoRow}>
                                <View style={styles.iconBox}><Text style={styles.icon}>💳</Text></View>
                                <View style={styles.infoTextContainer}>
                                    <Text style={styles.infoLabel}>ESTIMATED PAYOUT</Text>
                                    <Text style={styles.payoutValue}>{formatCurrency('85.00')}</Text>
                                </View>
                            </View>
                        </View>

                        {/* ── Description of Work ── */}
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Description of Work</Text>
                        </View>
                        <Text style={styles.descriptionText}>
                            Water dripping beneath the master kitchen sink cupboard. Requires checking the seal and replacing standard trap or pipeline components if split.
                        </Text>
                    </View>
                </ScrollView>

                {/* ── Bottom Action Bar ── */}
                <View style={styles.bottomBar}>
                    <TouchableOpacity style={styles.chatButton} onPress={() => router.push('/(provider)/chat')}>
                        <MaterialIcons name="chat-bubble-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                        <Text style={styles.chatButtonText}>Message Customer</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#fff',
    },
    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 14,
        zIndex: 10,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    moreButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Scroll Content
    scrollContent: {
        paddingTop: '60%',
    },
    sheetContainer: {
        backgroundColor: '#FAFAFA',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        paddingTop: 32,
        paddingBottom: 40,
        minHeight: 700,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },

    // Profile Card
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    avatarPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FDE68A',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    avatarInitials: {
        color: '#D97706',
        fontSize: 18,
        fontWeight: '700',
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starIcon: {
        color: '#F59E0B',
        fontSize: 14,
        marginRight: 4,
    },
    ratingText: {
        color: '#6B7280',
        fontSize: 13,
        fontWeight: '500',
    },

    // Info Box
    infoBox: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        marginTop: 2,
    },
    icon: {
        fontSize: 16,
    },
    infoTextContainer: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#9CA3AF',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    infoValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
        lineHeight: 22,
    },
    payoutValue: {
        fontSize: 24,
        fontWeight: '800',
        color: '#2563EB',
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 16,
        marginLeft: 48,
    },

    // Section Titles
    sectionHeader: {
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
    },

    // Map Configuration
    mapTouchableContainer: {
        height: 120,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20,
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapOverlay: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    mapOverlayText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#2563EB',
    },

    // Description
    descriptionText: {
        fontSize: 15,
        color: '#6B7280',
        lineHeight: 24,
    },

    // Bottom Action Bar
    bottomBar: {
        flexDirection: 'column',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        gap: 12,
    },
    chatButton: {
        backgroundColor: '#2563EB',
        borderRadius: 12,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    chatButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
});
