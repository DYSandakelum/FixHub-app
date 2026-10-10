import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Platform,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getProviders } from '../../lib/bookings';

export default function HomeScreen() {
    const router = useRouter();
    const [providers, setProviders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

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
        { name: 'Plumbing', icon: 'plumbing' },
        { name: 'Electrical', icon: 'flash-on' },
        { name: 'Cleaning', icon: 'cleaning-services' },
    ];

    const handleSearchSubmit = () => {
        if (searchQuery.trim()) {
            router.push(`/(booking)/search-results?query=${encodeURIComponent(searchQuery.trim())}`);
        } else {
            router.push('/(booking)/search-results');
        }
    };

    const renderHeader = () => (
        <View>
            {/* ── Dark Navy Curved Hero Header (Matching Provider Dashboard) ── */}
            <View style={styles.heroBackground}>
                <SafeAreaView edges={['top']} style={styles.safeArea}>
                    <View style={styles.heroTopBar}>
                        <View style={styles.brandContainer}>
                            <View style={styles.brandIconCircle}>
                                <MaterialIcons name="build" size={16} color="#fff" />
                            </View>
                            <Text style={styles.brandName}>FixHub</Text>
                        </View>
                        <View style={styles.heroTopRight}>
                            <View style={styles.locationPill}>
                                <MaterialIcons name="location-on" size={13} color="#60A5FA" />
                                <Text style={styles.locationText}>Colombo</Text>
                            </View>
                            <TouchableOpacity style={styles.bellButton}>
                                <MaterialIcons name="notifications-none" size={20} color="#fff" />
                                <View style={styles.bellBadge} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.heroTextContainer}>
                        <Text style={styles.heroGreeting}>Find Trusted Experts</Text>
                        <Text style={styles.heroSubtitle}>Verified home professionals ready for instant booking</Text>
                    </View>
                </SafeAreaView>
            </View>

            {/* ── Floating Overlapping Search Bar ── */}
            <View style={styles.floatingSearchWrapper}>
                <View style={styles.searchBarContainer}>
                    <MaterialIcons name="search" size={22} color="#2563EB" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search services (plumbing, electrical...)"
                        placeholderTextColor="#94A3B8"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        onSubmitEditing={handleSearchSubmit}
                        returnKeyType="search"
                    />
                    <TouchableOpacity style={styles.searchActionBtn} onPress={handleSearchSubmit}>
                        <MaterialIcons name="arrow-forward" size={18} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* ── Highlight Banner (Styled like Provider New Request Card) ── */}
            <View style={styles.promoWrapper}>
                <View style={styles.promoCard}>
                    <View style={styles.promoHeader}>
                        <View style={styles.promoBadge}>
                            <MaterialIcons name="bolt" size={14} color="#D97706" />
                            <Text style={styles.promoBadgeText}>FAST RESPONSE</Text>
                        </View>
                        <Text style={styles.promoTag}>Under 30 mins</Text>
                    </View>
                    <Text style={styles.promoTitle}>Emergency Repair Service</Text>
                    <Text style={styles.promoSubtitle}>Get matched with available verified experts right now in your area.</Text>
                    <TouchableOpacity
                        style={styles.promoButton}
                        onPress={() => router.push('/(booking)/search-results')}
                    >
                        <Text style={styles.promoButtonText}>Find Available Experts</Text>
                        <MaterialIcons name="chevron-right" size={18} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* ── Categories Section ── */}
            <View style={styles.sectionPadding}>
                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>Categories</Text>
                    <TouchableOpacity onPress={() => router.push('/(booking)/search-results')}>
                        <Text style={styles.seeAllLink}>See all</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.categoryGrid}>
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat.name}
                            style={styles.categoryCard}
                            onPress={() => router.push(`/(booking)/search-results?category=${cat.name}`)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.categoryIconCircle}>
                                <MaterialIcons name={cat.icon as any} size={22} color="#2563EB" />
                            </View>
                            <Text style={styles.categoryText}>{cat.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.sectionHeaderRow}>
                    <Text style={styles.sectionTitle}>Top Rated Providers</Text>
                    <View style={styles.countBadge}>
                        <Text style={styles.countBadgeText}>{providers.length} available</Text>
                    </View>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.screen}>
            <StatusBar barStyle="light-content" backgroundColor="#1E293B" />

            <FlatList
                data={providers}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.providerCard}
                        onPress={() => router.push(`/(booking)/provider-profile?id=${item.id}`)}
                        activeOpacity={0.85}
                    >
                        <View style={styles.avatarWrapper}>
                            <View style={styles.avatarPlaceholder}>
                                <MaterialIcons name="person" size={26} color="#2563EB" />
                            </View>
                            <View style={styles.onlineDot} />
                        </View>

                        <View style={styles.providerInfo}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.providerName} numberOfLines={1}>
                                    {item.users?.name ?? 'Service Provider'}
                                </Text>
                                {item.verified ? (
                                    <View style={styles.verifiedBadge}>
                                        <MaterialIcons name="verified" size={13} color="#2563EB" />
                                        <Text style={styles.verifiedBadgeText}> Verified</Text>
                                    </View>
                                ) : (
                                    <View style={styles.unverifiedBadge}>
                                        <MaterialIcons name="error-outline" size={13} color="#DC2626" />
                                        <Text style={styles.unverifiedBadgeText}> Unverified</Text>
                                    </View>
                                )}
                            </View>

                            <View style={styles.categoryPillRow}>
                                <View style={styles.serviceTypeBadge}>
                                    <Text style={styles.providerType}>{item.service_type}</Text>
                                </View>
                                <View style={styles.ratingBadge}>
                                    <MaterialIcons name="star" size={13} color="#D97706" />
                                    <Text style={styles.ratingText}>4.9</Text>
                                </View>
                            </View>

                            <View style={styles.cardFooter}>
                                <View style={styles.rateRow}>
                                    <Text style={styles.rateCurrency}>Rs.</Text>
                                    <Text style={styles.providerRate}> {item.rate}</Text>
                                    <Text style={styles.rateUnit}>/hr</Text>
                                </View>
                                <View style={styles.viewProfileBtn}>
                                    <Text style={styles.viewProfileText}>Book Service</Text>
                                    <MaterialIcons name="chevron-right" size={16} color="#fff" />
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    loading ? (
                        <View style={styles.emptyState}>
                            <ActivityIndicator size="large" color="#2563EB" />
                            <Text style={styles.loadingText}>Finding nearby providers...</Text>
                        </View>
                    ) : (
                        <View style={styles.emptyState}>
                            <View style={styles.emptyIconCircle}>
                                <MaterialIcons name="search-off" size={40} color="#94A3B8" />
                            </View>
                            <Text style={styles.emptyText}>No providers found</Text>
                            <Text style={styles.emptySubtext}>Try adjusting your search criteria</Text>
                        </View>
                    )
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#EEF2F6', // Crisp Slate-Grey background matching provider screens
    },
    listContent: {
        paddingBottom: 36,
    },

    // ── Dark Navy Hero Header ──
    heroBackground: {
        backgroundColor: '#1E293B', // Dark slate matching provider dashboard
        paddingHorizontal: 20,
        paddingBottom: 48,
        borderBottomLeftRadius: 36,
        borderBottomRightRadius: 36,
    },
    safeArea: {
        paddingTop: Platform.OS === 'android' ? 12 : 0,
    },
    heroTopBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
    },
    brandContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    brandIconCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#2563EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    brandName: {
        fontSize: 20,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    heroTopRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    locationPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
        gap: 4,
    },
    locationText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#E2E8F0',
    },
    bellButton: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: 'rgba(255, 255, 255, 0.12)',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    bellBadge: {
        position: 'absolute',
        top: 8,
        right: 9,
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: '#EF4444',
    },
    heroTextContainer: {
        marginTop: 14,
        marginBottom: 8,
    },
    heroGreeting: {
        fontSize: 24,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    heroSubtitle: {
        fontSize: 13,
        fontWeight: '500',
        color: '#94A3B8',
        lineHeight: 18,
    },

    // ── Floating Overlapping Search Bar ──
    floatingSearchWrapper: {
        paddingHorizontal: 16,
        marginTop: -32,
        zIndex: 20,
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingHorizontal: 16,
        height: 54,
        gap: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 6,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
        color: '#0F172A',
    },
    searchActionBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#2563EB',
        justifyContent: 'center',
        alignItems: 'center',
    },

    // ── Highlight Promo Banner ──
    promoWrapper: {
        paddingHorizontal: 16,
        marginTop: 18,
    },
    promoCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
    promoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    promoBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF3C7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        gap: 4,
    },
    promoBadgeText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#D97706',
        letterSpacing: 0.5,
    },
    promoTag: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748B',
    },
    promoTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 4,
    },
    promoSubtitle: {
        fontSize: 13,
        color: '#64748B',
        lineHeight: 18,
        marginBottom: 12,
    },
    promoButton: {
        backgroundColor: '#2563EB',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 14,
        gap: 4,
    },
    promoButtonText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    // ── Sections ──
    sectionPadding: {
        paddingHorizontal: 16,
        marginTop: 20,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0F172A',
    },
    seeAllLink: {
        fontSize: 13,
        fontWeight: '700',
        color: '#2563EB',
    },
    countBadge: {
        backgroundColor: '#E2E8F0',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    countBadgeText: {
        fontSize: 11,
        fontWeight: '700',
        color: '#475569',
    },

    // ── Categories Grid ──
    categoryGrid: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 22,
    },
    categoryCard: {
        flex: 1,
        paddingVertical: 14,
        paddingHorizontal: 6,
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        alignItems: 'center',
        gap: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#0F172A',
        shadowOpacity: 0.04,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    categoryIconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#EFF6FF',
        borderWidth: 1,
        borderColor: '#DBEAFE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryText: {
        color: '#1E293B',
        fontWeight: '700',
        fontSize: 13,
    },

    // ── Provider Card ──
    providerCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 12,
        gap: 14,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#0F172A',
        shadowOpacity: 0.04,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    avatarWrapper: {
        position: 'relative',
    },
    avatarPlaceholder: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#EFF6FF',
        borderWidth: 1.5,
        borderColor: '#DBEAFE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    onlineDot: {
        position: 'absolute',
        bottom: 1,
        right: 1,
        width: 13,
        height: 13,
        borderRadius: 7,
        backgroundColor: '#10B981',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    providerInfo: {
        flex: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    providerName: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0F172A',
        flex: 1,
        marginRight: 8,
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#DBEAFE',
    },
    verifiedBadgeText: {
        color: '#2563EB',
        fontSize: 11,
        fontWeight: '700',
    },
    unverifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF2F2',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    unverifiedBadgeText: {
        color: '#DC2626',
        fontSize: 11,
        fontWeight: '700',
    },
    categoryPillRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 6,
    },
    serviceTypeBadge: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    providerType: {
        fontSize: 12,
        fontWeight: '600',
        color: '#475569',
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFBEB',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
        gap: 3,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#D97706',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    rateRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    rateCurrency: {
        fontSize: 13,
        fontWeight: '700',
        color: '#64748B',
    },
    providerRate: {
        fontSize: 17,
        fontWeight: '800',
        color: '#0F172A',
    },
    rateUnit: {
        fontSize: 12,
        fontWeight: '500',
        color: '#94A3B8',
    },
    viewProfileBtn: {
        backgroundColor: '#2563EB',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 7,
        paddingHorizontal: 14,
        borderRadius: 12,
        gap: 2,
    },
    viewProfileText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
    },

    // ── Empty & Loading States ──
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        paddingHorizontal: 32,
    },
    emptyIconCircle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    loadingText: {
        marginTop: 14,
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
    },
    emptyText: {
        fontSize: 17,
        fontWeight: '700',
        color: '#1E293B',
    },
    emptySubtext: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 4,
        textAlign: 'center',
    },
});