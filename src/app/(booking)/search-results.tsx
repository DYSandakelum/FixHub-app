import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Modal,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

    const serviceTypes = ['All', 'Plumbing', 'Electrical', 'Cleaning'];
    const priceOptions = [2000, 3000, 5000];

    const hasActiveFilters = Boolean(selectedType || maxPrice);

    return (
        <View style={styles.screen}>
            <StatusBar barStyle="light-content" backgroundColor="#1E293B" />

            {/* ── Dark Navy Hero Header ── */}
            <View style={styles.heroBackground}>
                <SafeAreaView edges={['top']} style={{ flex: 0 }} />
                <View style={styles.headerTop}>
                    <TouchableOpacity style={styles.backBtn} onPress={() => router.back()} activeOpacity={0.7}>
                        <MaterialIcons name="arrow-back" size={22} color="#FFFFFF" />
                    </TouchableOpacity>
                    <View style={styles.headerTitleBox}>
                        <Text style={styles.headerTitle}>Find Providers</Text>
                        <Text style={styles.headerSubtitle}>
                            {selectedType ? `${selectedType} Services` : 'All Categories'} · {providers.length} found
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.filterBtn, hasActiveFilters && styles.filterBtnActive]}
                        onPress={() => setFilterVisible(true)}
                        activeOpacity={0.7}
                    >
                        <MaterialIcons name="tune" size={18} color={hasActiveFilters ? '#FFFFFF' : '#FFFFFF'} />
                        {hasActiveFilters && <View style={styles.activeFilterDot} />}
                    </TouchableOpacity>
                </View>

                {/* Horizontal Quick Category Filters */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoryScroll}
                >
                    {serviceTypes.map((type) => {
                        const isSelected = type === 'All' ? !selectedType : selectedType === type;
                        return (
                            <TouchableOpacity
                                key={type}
                                style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
                                onPress={() => setSelectedType(type === 'All' ? undefined : type)}
                                activeOpacity={0.7}
                            >
                                <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextActive]}>
                                    {type}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            {/* ── Provider Results List ── */}
            {loading ? (
                <View style={styles.centerLoading}>
                    <ActivityIndicator size="large" color="#2563EB" />
                    <Text style={styles.loadingText}>Searching available providers...</Text>
                </View>
            ) : (
                <FlatList
                    data={providers}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.providerCard}
                            onPress={() => router.push(`/(booking)/provider-profile?id=${item.id}`)}
                            activeOpacity={0.85}
                        >
                            <View style={styles.cardHeader}>
                                <View style={styles.avatarWrapper}>
                                    <View style={styles.avatarPlaceholder}>
                                        <MaterialIcons name="person" size={26} color="#2563EB" />
                                    </View>
                                    <View style={styles.onlineDot} />
                                </View>

                                <View style={styles.cardInfo}>
                                    <View style={styles.nameBadgeRow}>
                                        <Text style={styles.providerName} numberOfLines={1}>
                                            {item.users?.name ?? 'Service Provider'}
                                        </Text>
                                        {item.verified ? (
                                            <View style={styles.verifiedBadge}>
                                                <MaterialIcons name="verified" size={12} color="#2563EB" />
                                                <Text style={styles.verifiedBadgeText}> Verified</Text>
                                            </View>
                                        ) : (
                                            <View style={styles.unverifiedBadge}>
                                                <MaterialIcons name="error-outline" size={12} color="#DC2626" />
                                                <Text style={styles.unverifiedBadgeText}> Unverified</Text>
                                            </View>
                                        )}
                                    </View>

                                    <View style={styles.categoryPillRow}>
                                        <View style={styles.servicePill}>
                                            <Text style={styles.providerType}>{item.service_type}</Text>
                                        </View>
                                        <View style={styles.ratingBadge}>
                                            <MaterialIcons name="star" size={13} color="#F59E0B" />
                                            <Text style={styles.ratingText}> 4.9</Text>
                                        </View>
                                    </View>

                                    <View style={styles.cardFooter}>
                                        <View style={styles.rateRow}>
                                            <MaterialIcons name="payments" size={15} color="#2563EB" />
                                            <Text style={styles.providerRate}> Rs. {item.rate}</Text>
                                            <Text style={styles.rateUnit}>/hr</Text>
                                        </View>
                                        <View style={styles.viewBtn}>
                                            <Text style={styles.viewBtnText}>View</Text>
                                            <MaterialIcons name="chevron-right" size={15} color="#2563EB" />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <View style={styles.emptyIconCircle}>
                                <MaterialIcons name="search-off" size={44} color="#94A3B8" />
                            </View>
                            <Text style={styles.emptyTitle}>No matching providers</Text>
                            <Text style={styles.emptySubtext}>Try clearing or broadening your filters</Text>
                        </View>
                    }
                />
            )}

            {/* ── Filter Modal ── */}
            <Modal visible={filterVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalTopRow}>
                            <Text style={styles.modalTitle}>Filter Services</Text>
                            <TouchableOpacity onPress={() => setFilterVisible(false)} style={styles.modalCloseBtn}>
                                <MaterialIcons name="close" size={22} color="#64748B" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.filterLabel}>SERVICE TYPE</Text>
                        <View style={styles.optionRow}>
                            {['Plumbing', 'Electrical', 'Cleaning'].map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    style={[styles.optionButton, selectedType === type && styles.optionButtonActive]}
                                    onPress={() => setSelectedType(selectedType === type ? undefined : type)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={selectedType === type ? styles.optionTextActive : styles.optionText}>
                                        {type}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.filterLabel}>MAX HOURLY RATE</Text>
                        <View style={styles.optionRow}>
                            {priceOptions.map((price) => (
                                <TouchableOpacity
                                    key={price}
                                    style={[styles.optionButton, maxPrice === price && styles.optionButtonActive]}
                                    onPress={() => setMaxPrice(maxPrice === price ? undefined : price)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={maxPrice === price ? styles.optionTextActive : styles.optionText}>
                                        Up to Rs. {price}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.modalActionsRow}>
                            <TouchableOpacity
                                style={styles.resetButton}
                                onPress={() => {
                                    setSelectedType(undefined);
                                    setMaxPrice(undefined);
                                }}
                            >
                                <Text style={styles.resetButtonText}>Reset</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.applyButton} onPress={() => setFilterVisible(false)}>
                                <Text style={styles.applyButtonText}>Apply Filters</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#EEF2F6', // Crisp Slate-Grey canvas
    },
    heroBackground: {
        backgroundColor: '#1E293B', // Dark slate hero matching provider screens
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingBottom: 16,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'android' ? 12 : 8,
        paddingBottom: 12,
    },
    backBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitleBox: {
        flex: 1,
        marginHorizontal: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    headerSubtitle: {
        fontSize: 12,
        fontWeight: '500',
        color: '#94A3B8',
        marginTop: 1,
    },
    filterBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    filterBtnActive: {
        backgroundColor: '#2563EB',
    },
    activeFilterDot: {
        position: 'absolute',
        top: 6,
        right: 6,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#60A5FA',
        borderWidth: 1.5,
        borderColor: '#1E293B',
    },
    categoryScroll: {
        paddingHorizontal: 16,
        gap: 8,
        paddingTop: 4,
        paddingBottom: 4,
    },
    categoryChip: {
        paddingHorizontal: 14,
        paddingVertical: 7,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    categoryChipActive: {
        backgroundColor: '#2563EB',
        borderColor: '#2563EB',
    },
    categoryChipText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#CBD5E1',
    },
    categoryChipTextActive: {
        color: '#FFFFFF',
        fontWeight: '700',
    },

    // ── List & Cards ──
    listContent: {
        padding: 16,
        paddingBottom: 36,
    },
    providerCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    avatarWrapper: {
        position: 'relative',
    },
    avatarPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#EFF6FF',
        borderWidth: 1.5,
        borderColor: '#DBEAFE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    onlineDot: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#10B981',
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    cardInfo: {
        flex: 1,
    },
    nameBadgeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    providerName: {
        fontSize: 15,
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
        marginTop: 5,
    },
    servicePill: {
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    providerType: {
        fontSize: 12,
        fontWeight: '600',
        color: '#475569',
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        color: '#1E293B',
        fontSize: 12,
        fontWeight: '700',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    rateRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    providerRate: {
        fontSize: 15,
        fontWeight: '800',
        color: '#2563EB',
    },
    rateUnit: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '600',
    },
    viewBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    viewBtnText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#2563EB',
    },

    // ── Loading & Empty ──
    centerLoading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
        marginTop: 12,
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 50,
        paddingHorizontal: 24,
    },
    emptyIconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 4,
    },
    emptySubtext: {
        fontSize: 13,
        color: '#64748B',
        textAlign: 'center',
    },

    // ── Filter Modal ──
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 24,
        paddingBottom: Platform.OS === 'ios' ? 36 : 24,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: -6 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 10,
    },
    modalTopRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0F172A',
    },
    modalCloseBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterLabel: {
        fontSize: 11,
        fontWeight: '800',
        color: '#94A3B8',
        letterSpacing: 0.5,
        marginTop: 14,
        marginBottom: 10,
    },
    optionRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    optionButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 14,
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    optionButtonActive: {
        backgroundColor: '#2563EB',
        borderColor: '#2563EB',
    },
    optionText: {
        color: '#475569',
        fontSize: 13,
        fontWeight: '600',
    },
    optionTextActive: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '700',
    },
    modalActionsRow: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 28,
    },
    resetButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F1F5F9',
    },
    resetButtonText: {
        color: '#64748B',
        fontWeight: '700',
        fontSize: 14,
    },
    applyButton: {
        flex: 2,
        backgroundColor: '#2563EB',
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
    },
    applyButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 15,
    },
});