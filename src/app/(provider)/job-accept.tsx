import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
    Image,
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCurrency } from './settingsStore';

export default function RequestDetailsScreen() {
    const { formatCurrency } = useCurrency();
    const router = useRouter();

    return (
        <SafeAreaView style={styles.screen}>
            {/* ── Header ── */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <MaterialIcons name="chevron-left" size={28} color="#2563EB" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Request Details</Text>
                <TouchableOpacity style={styles.moreButton}>
                    <MaterialIcons name="more-horiz" size={24} color="#9CA3AF" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

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
                    {/* Date & Time */}
                    <View style={styles.infoRow}>
                        <View style={styles.iconBox}>
                            <MaterialIcons name="calendar-today" size={16} color="#6B7280" />
                        </View>
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>DATE & TIME</Text>
                            <Text style={styles.infoValue}>Today, Oct 16 • 2:00 PM - 4:00 PM</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Service Address */}
                    <View style={styles.infoRow}>
                        <View style={styles.iconBox}>
                            <Text style={styles.icon}>📍</Text>
                        </View>
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>SERVICE ADDRESS</Text>
                            <Text style={styles.infoValue}>1248 Oakwood Dr, Apt 4B, Seattle WA</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Estimated Payout */}
                    <View style={styles.infoRow}>
                        <View style={styles.iconBox}>
                            <Text style={styles.icon}>💳</Text>
                        </View>
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoLabel}>ESTIMATED PAYOUT</Text>
                            <Text style={styles.payoutValue}>{formatCurrency('85.00')}</Text>
                        </View>
                    </View>
                </View>

                {/* ── Location Map ── */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Location Map</Text>
                </View>
                <TouchableOpacity
                    style={styles.mapTouchableContainer}
                    activeOpacity={0.8}
                    onPress={() => {
                        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
                        const latLng = `47.6062,-122.3321`;
                        const label = 'Job Location';
                        const url = Platform.select({
                            ios: `${scheme}${label}@${latLng}`,
                            android: `${scheme}${latLng}(${label})`
                        }) || '';
                        Linking.openURL(url);
                    }}
                >
                    <Image
                        source={{ uri: 'https://staticmap.openstreetmap.de/staticmap.php?center=47.6062,-122.3321&zoom=14&size=600x300&markers=47.6062,-122.3321,red-pushpin' }}
                        style={{ width: '100%', height: '100%', position: 'absolute' }}
                        resizeMode="cover"
                    />
                    <View style={styles.mapOverlay}>
                        <Text style={styles.mapOverlayText}>Open in Maps</Text>
                    </View>
                </TouchableOpacity>

                {/* ── Description of Work ── */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Description of Work</Text>
                </View>
                <Text style={styles.descriptionText}>
                    Water dripping beneath the master kitchen sink cupboard. Requires checking the seal and replacing standard trap or pipeline components if split.
                </Text>

            </ScrollView>

            {/* ── Bottom Action Bar ── */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={styles.declineButton} onPress={() => router.back()}>
                    <Text style={styles.declineButtonText}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.acceptButton}>
                    <Text style={styles.acceptButtonText}>Accept Request</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 14,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: {
        fontSize: 24,
        color: '#2563EB',
        lineHeight: 28, // better centering
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    moreButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    moreIcon: {
        fontSize: 20,
        color: '#9CA3AF',
        fontWeight: '700',
    },

    // Scroll Content
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
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
    declineButton: {
        borderWidth: 1.5,
        borderColor: '#2563EB',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    declineButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2563EB',
    },
    acceptButton: {
        backgroundColor: '#2563EB',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    acceptButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
});
