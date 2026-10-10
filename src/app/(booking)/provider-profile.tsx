import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getProviderById } from '../../lib/bookings';

export default function ProviderProfileScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [provider, setProvider] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProvider();
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
                <StatusBar barStyle="dark-content" />
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.loadingText}>Loading provider details...</Text>
            </View>
        );
    }

    if (!provider) {
        return (
            <View style={styles.center}>
                <StatusBar barStyle="dark-content" />
                <MaterialIcons name="person-off" size={48} color="#94A3B8" />
                <Text style={styles.emptyTitle}>Provider not found</Text>
                <TouchableOpacity style={styles.backHomeBtn} onPress={() => router.back()}>
                    <Text style={styles.backHomeBtnText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

            {/* ── Curved Royal Blue Hero Section (Matching Provider Profile Setup) ── */}
            <View style={styles.blueHeaderSection}>
                <SafeAreaView edges={['top']} style={{ flex: 0 }} />
                <View style={styles.headerTop}>
                    <TouchableOpacity style={styles.headerBackBtn} onPress={() => router.back()} activeOpacity={0.7}>
                        <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitleBlue}>Provider Profile</Text>
                    <View style={{ width: 40 }} />
                </View>

                {/* Overlapping Floating Avatar Circle */}
                <View style={styles.uploadContainer}>
                    <View style={styles.uploadCircle}>
                        <MaterialIcons name="person" size={54} color="#2563EB" />
                    </View>
                    {provider.verified && (
                        <View style={styles.verifiedIconBadge}>
                            <MaterialIcons name="verified" size={16} color="#2563EB" />
                        </View>
                    )}
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* ── Name and Verification ── */}
                <View style={styles.profileHeaderBox}>
                    <Text style={styles.name}>{provider.users?.name ?? 'Service Provider'}</Text>
                    <View style={styles.badgeRow}>
                        {provider.verified ? (
                            <View style={styles.verifiedBadge}>
                                <MaterialIcons name="verified" size={13} color="#2563EB" />
                                <Text style={styles.verifiedText}> Verified Professional</Text>
                            </View>
                        ) : (
                            <View style={styles.unverifiedBadge}>
                                <MaterialIcons name="error-outline" size={13} color="#DC2626" />
                                <Text style={styles.unverifiedText}> Unverified Provider</Text>
                            </View>
                        )}
                        <View style={styles.ratingBadge}>
                            <MaterialIcons name="star" size={14} color="#F59E0B" />
                            <Text style={styles.ratingText}> 4.9 (38 jobs)</Text>
                        </View>
                    </View>
                </View>

                {/* ── Professional Info Card ── */}
                <Text style={styles.sectionSimpleTitle}>Professional Details</Text>
                <View style={styles.proProfileCard}>
                    <View style={styles.personalInfoField}>
                        <View style={styles.fieldIconCircle}>
                            <MaterialIcons name="handyman" size={20} color="#2563EB" />
                        </View>
                        <View style={styles.fieldTextCol}>
                            <Text style={styles.fieldLabelUpper}>SERVICE CATEGORY</Text>
                            <Text style={styles.fieldValueText}>{provider.service_type}</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={22} color="#CBD5E1" />
                    </View>

                    <View style={styles.personalInfoField}>
                        <View style={styles.fieldIconCircle}>
                            <MaterialIcons name="military-tech" size={20} color="#2563EB" />
                        </View>
                        <View style={styles.fieldTextCol}>
                            <Text style={styles.fieldLabelUpper}>EXPERIENCE</Text>
                            <Text style={styles.fieldValueText}>{provider.experience_years} years in field</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={22} color="#CBD5E1" />
                    </View>

                    <View style={[styles.personalInfoField, { marginBottom: 0 }]}>
                        <View style={styles.fieldIconCircle}>
                            <MaterialIcons name="payments" size={20} color="#2563EB" />
                        </View>
                        <View style={styles.fieldTextCol}>
                            <Text style={styles.fieldLabelUpper}>STARTING RATE</Text>
                            <Text style={styles.fieldValueText}>Rs. {provider.rate} / hour</Text>
                        </View>
                        <MaterialIcons name="chevron-right" size={22} color="#CBD5E1" />
                    </View>
                </View>

                {/* ── About Card ── */}
                <Text style={styles.sectionSimpleTitle}>About Provider</Text>
                <View style={styles.aboutCard}>
                    <Text style={styles.bio}>
                        {provider.bio || 'Experienced technician dedicated to providing fast, reliable, and high-quality home service solutions.'}
                    </Text>
                </View>

                {/* ── Working History / Reviews Card ── */}
                <Text style={styles.sectionSimpleTitle}>Recent Reviews</Text>
                <View style={styles.reviewsCard}>
                    <View style={styles.reviewItem}>
                        <View style={styles.reviewHeader}>
                            <View style={styles.reviewerAvatar}>
                                <Text style={styles.reviewerInitials}>SP</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.reviewerName}>Saman Perera</Text>
                                <View style={styles.reviewStarsRow}>
                                    <MaterialIcons name="star" size={13} color="#F59E0B" />
                                    <MaterialIcons name="star" size={13} color="#F59E0B" />
                                    <MaterialIcons name="star" size={13} color="#F59E0B" />
                                    <MaterialIcons name="star" size={13} color="#F59E0B" />
                                    <MaterialIcons name="star" size={13} color="#F59E0B" />
                                    <Text style={styles.reviewDate}> · 2 weeks ago</Text>
                                </View>
                            </View>
                        </View>
                        <Text style={styles.reviewComment}>
                            Arrived exactly on time and repaired the issue quickly. Very polite and thorough.
                        </Text>
                    </View>
                </View>

                <View style={{ height: 90 }} />
            </ScrollView>

            {/* ── Fixed Bottom Booking Bar ── */}
            <View style={styles.bottomBar}>
                <View style={styles.priceContainer}>
                    <Text style={styles.rateLabel}>RATE</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                        <Text style={styles.rateNumber}>Rs. {provider.rate}</Text>
                        <Text style={styles.rateUnit}> /hr</Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.bookActionBtn}
                    onPress={() => router.push(`/(booking)/booking?providerId=${provider.id}`)}
                    activeOpacity={0.85}
                >
                    <MaterialIcons name="event" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                    <Text style={styles.bookActionBtnText}>Book Service</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#EEF2F6', // Crisp Slate-Grey canvas
    },
    center: {
        flex: 1,
        backgroundColor: '#EEF2F6',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    loadingText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
        marginTop: 12,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0F172A',
        marginTop: 12,
    },
    backHomeBtn: {
        marginTop: 16,
        backgroundColor: '#2563EB',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
    },
    backHomeBtnText: {
        color: '#fff',
        fontWeight: '700',
    },

    // ── Curved Royal Blue Hero Section ──
    blueHeaderSection: {
        backgroundColor: '#2563EB',
        borderBottomLeftRadius: 36,
        borderBottomRightRadius: 36,
        paddingBottom: 48,
        zIndex: 10,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    headerBackBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitleBlue: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    uploadContainer: {
        position: 'absolute',
        bottom: -44,
        alignSelf: 'center',
        zIndex: 20,
    },
    uploadCircle: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#FFFFFF',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
    },
    verifiedIconBadge: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        backgroundColor: '#FFFFFF',
        width: 26,
        height: 26,
        borderRadius: 13,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#DBEAFE',
        elevation: 2,
    },

    // ── Content ──
    scrollContent: {
        padding: 16,
        paddingTop: 54, // Space for overlapping avatar
        paddingBottom: 24,
    },
    profileHeaderBox: {
        alignItems: 'center',
        marginBottom: 20,
    },
    name: {
        fontSize: 22,
        fontWeight: '800',
        color: '#0F172A',
        textAlign: 'center',
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 8,
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    verifiedText: {
        color: '#2563EB',
        fontSize: 11,
        fontWeight: '700',
    },
    unverifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF2F2',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    unverifiedText: {
        color: '#DC2626',
        fontSize: 11,
        fontWeight: '700',
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFBEB',
        paddingHorizontal: 9,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FDE68A',
    },
    ratingText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#92400E',
    },

    // ── Professional Details Card ──
    sectionSimpleTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 10,
        marginLeft: 2,
        marginTop: 10,
    },
    proProfileCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 14,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
        marginBottom: 14,
    },
    personalInfoField: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: 14,
        padding: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    fieldIconCircle: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    fieldTextCol: {
        flex: 1,
    },
    fieldLabelUpper: {
        fontSize: 11,
        fontWeight: '700',
        color: '#94A3B8',
        marginBottom: 2,
        letterSpacing: 0.5,
    },
    fieldValueText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#0F172A',
    },

    // ── About Card ──
    aboutCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
        marginBottom: 14,
    },
    bio: {
        color: '#475569',
        fontSize: 14,
        lineHeight: 22,
        fontWeight: '500',
    },

    // ── Reviews Card ──
    reviewsCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
        marginBottom: 14,
    },
    reviewItem: {
        gap: 8,
    },
    reviewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    reviewerAvatar: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#EFF6FF',
        borderWidth: 1,
        borderColor: '#DBEAFE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    reviewerInitials: {
        fontSize: 14,
        fontWeight: '800',
        color: '#2563EB',
    },
    reviewerName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0F172A',
    },
    reviewStarsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    reviewDate: {
        fontSize: 11,
        color: '#94A3B8',
        fontWeight: '500',
    },
    reviewComment: {
        fontSize: 13,
        color: '#475569',
        lineHeight: 19,
    },

    // ── Fixed Bottom Booking Bar ──
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        paddingHorizontal: 20,
        paddingVertical: 14,
        paddingBottom: Platform.OS === 'ios' ? 28 : 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 8,
    },
    priceContainer: {
        flex: 1,
    },
    rateLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#94A3B8',
        letterSpacing: 0.5,
    },
    rateNumber: {
        fontSize: 22,
        fontWeight: '800',
        color: '#0F172A',
    },
    rateUnit: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748B',
    },
    bookActionBtn: {
        backgroundColor: '#2563EB',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 16,
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    bookActionBtnText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 15,
    },
});