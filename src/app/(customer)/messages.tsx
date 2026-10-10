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
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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

    const renderHeader = () => (
        <View>
            {/* ── Dark Navy Curved Hero Header ── */}
            <View style={styles.heroBackground}>
                <SafeAreaView edges={['top']} style={styles.safeArea}>
                    <View style={styles.heroTopBar}>
                        <View style={styles.headerLeft}>
                            <View style={styles.headerIconCircle}>
                                <MaterialIcons name="chat" size={18} color="#fff" />
                            </View>
                            <Text style={styles.heroTitle}>Messages</Text>
                        </View>
                        <View style={styles.countBadge}>
                            <Text style={styles.countBadgeText}>{bookings.length} Chats</Text>
                        </View>
                    </View>
                    <Text style={styles.heroSubtitle}>Direct communication with your booked professionals</Text>
                </SafeAreaView>
            </View>
            <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Recent Conversations</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.screen}>
            <StatusBar barStyle="light-content" backgroundColor="#1E293B" />

            <FlatList
                data={bookings}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.card}
                        onPress={() => router.push(`/(transaction)/chat?bookingId=${item.id}`)}
                        activeOpacity={0.85}
                    >
                        <View style={styles.avatarWrapper}>
                            <View style={styles.iconCircle}>
                                <MaterialIcons name="person" size={24} color="#2563EB" />
                            </View>
                            <View style={styles.onlineDot} />
                        </View>

                        <View style={styles.cardInfo}>
                            <View style={styles.nameRow}>
                                <Text style={styles.providerName} numberOfLines={1}>
                                    {item.providers?.users?.name ?? 'Service Provider'}
                                </Text>
                                <Text style={styles.dateText}>{item.service_date}</Text>
                            </View>

                            <View style={styles.detailRow}>
                                <View style={styles.servicePill}>
                                    <Text style={styles.servicePillText}>{item.providers?.service_type}</Text>
                                </View>
                                <Text style={styles.previewText} numberOfLines={1}>
                                    Tap to view chat history
                                </Text>
                            </View>
                        </View>

                        <MaterialIcons name="chevron-right" size={20} color="#94A3B8" />
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    loading ? (
                        <View style={styles.emptyState}>
                            <ActivityIndicator size="large" color="#2563EB" />
                            <Text style={styles.loadingText}>Loading conversations...</Text>
                        </View>
                    ) : (
                        <View style={styles.emptyState}>
                            <View style={styles.emptyIconCircle}>
                                <MaterialIcons name="chat-bubble-outline" size={42} color="#94A3B8" />
                            </View>
                            <Text style={styles.emptyText}>No conversations yet</Text>
                            <Text style={styles.emptySubtext}>Messages from your scheduled bookings will appear here</Text>
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

    // ── Hero Header ──
    heroBackground: {
        backgroundColor: '#1E293B',
        paddingHorizontal: 20,
        paddingBottom: 32,
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
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerIconCircle: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: '#2563EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    countBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 14,
    },
    countBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#E2E8F0',
    },
    heroSubtitle: {
        fontSize: 13,
        fontWeight: '500',
        color: '#94A3B8',
        marginTop: 2,
    },

    // ── Section ──
    sectionHeaderRow: {
        paddingHorizontal: 20,
        marginTop: 20,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: '#0F172A',
    },

    // ── Card ──
    card: {
        flexDirection: 'row',
        alignItems: 'center',
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
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
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
    nameRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    providerName: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0F172A',
        flex: 1,
        marginRight: 8,
    },
    dateText: {
        fontSize: 12,
        color: '#94A3B8',
        fontWeight: '500',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    servicePill: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
    },
    servicePillText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#475569',
    },
    previewText: {
        fontSize: 13,
        color: '#64748B',
        flex: 1,
    },

    // ── Empty & Loading States ──
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
        paddingHorizontal: 32,
    },
    emptyIconCircle: {
        width: 76,
        height: 76,
        borderRadius: 38,
        backgroundColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14,
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