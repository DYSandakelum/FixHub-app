import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../../components/BackButton';
import { supabase } from '../../lib/supabase';

export default function PaymentScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const bookingId = params.bookingId as string | undefined;

    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [paying, setPaying] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState<'card' | 'cash' | 'wallet'>('card');

    useEffect(() => {
        if (bookingId) {
            loadBooking();
        } else {
            setLoading(false);
        }
    }, [bookingId]);

    async function loadBooking() {
        setLoading(true);
        const { data } = await supabase
            .from('bookings')
            .select(`
                id,
                service_date,
                service_time,
                price,
                status,
                providers (
                    service_type,
                    rate,
                    users ( name )
                )
            `)
            .eq('id', bookingId)
            .single();

        if (data) {
            setBooking(data);
        }
        setLoading(false);
    }

    const bData: any = booking;
    const prov: any = Array.isArray(bData?.providers) ? bData?.providers[0] : bData?.providers;
    const usr: any = Array.isArray(prov?.users) ? prov?.users[0] : prov?.users;

    const providerName = usr?.name ?? 'Professional';
    const serviceType = prov?.service_type ?? 'Home Repair';
    const serviceDate = booking?.service_date ?? 'Upcoming';
    const serviceTime = booking?.service_time ?? 'Scheduled Time';
    const basePrice = booking?.price ?? 2500;
    const platformFee = 150;
    const totalAmount = basePrice + platformFee;

    async function handleProcessPayment() {
        setPaying(true);

        if (bookingId) {
            await supabase
                .from('bookings')
                .update({ status: 'Confirmed' })
                .eq('id', bookingId);
        }

        setTimeout(() => {
            setPaying(false);
            Alert.alert(
                'Payment Successful',
                `Payment of Rs. ${totalAmount.toLocaleString()} confirmed for ${serviceType} with ${providerName}.`,
                [
                    {
                        text: 'Track Booking',
                        onPress: () => router.push(`/(transaction)/booking-tracking?bookingId=${bookingId ?? ''}`),
                    },
                    {
                        text: 'View My Bookings',
                        onPress: () => router.push('/(customer)/bookings'),
                    },
                ]
            );
        }, 800);
    }

    if (loading) {
        return (
            <View style={styles.centerScreen}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.loadingText}>Loading checkout details...</Text>
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            <StatusBar barStyle="light-content" backgroundColor="#1E293B" />

            {/* ── Dark Navy Hero Header ── */}
            <View style={styles.heroBackground}>
                <SafeAreaView edges={['top']} style={styles.safeArea}>
                    <View style={styles.headerTop}>
                        <BackButton color="#FFFFFF" />
                        <Text style={styles.headerTitle}>Checkout & Payment</Text>
                        <View style={{ width: 40 }} />
                    </View>
                </SafeAreaView>

                <View style={styles.heroInfoBox}>
                    <Text style={styles.heroAmountLabel}>TOTAL AMOUNT DUE</Text>
                    <Text style={styles.heroAmountValue}>Rs. {totalAmount.toLocaleString()}</Text>
                    <Text style={styles.heroSubtitle}>Protected by FixHub Escrow Guarantee</Text>
                </View>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Service Summary Card ── */}
                <View style={styles.card}>
                    <Text style={styles.cardHeaderTitle}>Service Summary</Text>

                    <View style={styles.summaryProviderRow}>
                        <View style={styles.providerAvatar}>
                            <MaterialIcons name="build" size={20} color="#2563EB" />
                        </View>
                        <View style={styles.summaryProviderInfo}>
                            <Text style={styles.summaryProviderName}>{providerName}</Text>
                            <View style={styles.summaryPill}>
                                <Text style={styles.summaryPillText}>{serviceType}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.detailRow}>
                        <View style={styles.detailItem}>
                            <MaterialIcons name="calendar-today" size={15} color="#64748B" />
                            <Text style={styles.detailText}>{serviceDate}</Text>
                        </View>
                        <View style={styles.detailItem}>
                            <MaterialIcons name="schedule" size={15} color="#64748B" />
                            <Text style={styles.detailText}>{serviceTime}</Text>
                        </View>
                    </View>
                </View>

                {/* ── Cost Breakdown Card ── */}
                <View style={styles.card}>
                    <Text style={styles.cardHeaderTitle}>Pricing Breakdown</Text>

                    <View style={styles.breakdownRow}>
                        <Text style={styles.breakdownLabel}>Estimated Service Labor</Text>
                        <Text style={styles.breakdownVal}>Rs. {basePrice.toLocaleString()}</Text>
                    </View>

                    <View style={styles.breakdownRow}>
                        <Text style={styles.breakdownLabel}>Platform & Insurance Fee</Text>
                        <Text style={styles.breakdownVal}>Rs. {platformFee.toLocaleString()}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.breakdownTotalRow}>
                        <Text style={styles.totalLabel}>Total Payable</Text>
                        <Text style={styles.totalVal}>Rs. {totalAmount.toLocaleString()}</Text>
                    </View>
                </View>

                {/* ── Payment Method Selector ── */}
                <View style={styles.card}>
                    <Text style={styles.cardHeaderTitle}>Choose Payment Method</Text>

                    {/* Card Option */}
                    <TouchableOpacity
                        style={[styles.methodOption, selectedMethod === 'card' && styles.methodOptionActive]}
                        onPress={() => setSelectedMethod('card')}
                        activeOpacity={0.8}
                    >
                        <View style={styles.methodLeft}>
                            <View style={[styles.methodIconBox, selectedMethod === 'card' && styles.methodIconBoxActive]}>
                                <MaterialIcons name="credit-card" size={22} color={selectedMethod === 'card' ? '#2563EB' : '#64748B'} />
                            </View>
                            <View>
                                <Text style={styles.methodName}>Credit / Debit Card</Text>
                                <Text style={styles.methodDesc}>Visa, MasterCard, Amex</Text>
                            </View>
                        </View>
                        <View style={[styles.radioCircle, selectedMethod === 'card' && styles.radioCircleActive]}>
                            {selectedMethod === 'card' && <View style={styles.radioInner} />}
                        </View>
                    </TouchableOpacity>

                    {/* Cash Option */}
                    <TouchableOpacity
                        style={[styles.methodOption, selectedMethod === 'cash' && styles.methodOptionActive]}
                        onPress={() => setSelectedMethod('cash')}
                        activeOpacity={0.8}
                    >
                        <View style={styles.methodLeft}>
                            <View style={[styles.methodIconBox, selectedMethod === 'cash' && styles.methodIconBoxActive]}>
                                <MaterialIcons name="payments" size={22} color={selectedMethod === 'cash' ? '#2563EB' : '#64748B'} />
                            </View>
                            <View>
                                <Text style={styles.methodName}>Cash on Completion</Text>
                                <Text style={styles.methodDesc}>Pay professional after service</Text>
                            </View>
                        </View>
                        <View style={[styles.radioCircle, selectedMethod === 'cash' && styles.radioCircleActive]}>
                            {selectedMethod === 'cash' && <View style={styles.radioInner} />}
                        </View>
                    </TouchableOpacity>

                    {/* Wallet Option */}
                    <TouchableOpacity
                        style={[styles.methodOption, selectedMethod === 'wallet' && styles.methodOptionActive, { marginBottom: 0 }]}
                        onPress={() => setSelectedMethod('wallet')}
                        activeOpacity={0.8}
                    >
                        <View style={styles.methodLeft}>
                            <View style={[styles.methodIconBox, selectedMethod === 'wallet' && styles.methodIconBoxActive]}>
                                <MaterialIcons name="account-balance-wallet" size={22} color={selectedMethod === 'wallet' ? '#2563EB' : '#64748B'} />
                            </View>
                            <View>
                                <Text style={styles.methodName}>Mobile Wallet / QR</Text>
                                <Text style={styles.methodDesc}>Genie, FriMi, Koko, LankaQR</Text>
                            </View>
                        </View>
                        <View style={[styles.radioCircle, selectedMethod === 'wallet' && styles.radioCircleActive]}>
                            {selectedMethod === 'wallet' && <View style={styles.radioInner} />}
                        </View>
                    </TouchableOpacity>
                </View>

                {/* ── Security Trust Badge ── */}
                <View style={styles.trustBadge}>
                    <MaterialIcons name="verified-user" size={18} color="#10B981" />
                    <Text style={styles.trustText}>
                        Protected by FixHub 100% Satisfaction Guarantee. Payment is held securely.
                    </Text>
                </View>

                {/* ── Pay Button ── */}
                <TouchableOpacity
                    style={[styles.payButton, paying && styles.payButtonDisabled]}
                    onPress={handleProcessPayment}
                    disabled={paying}
                    activeOpacity={0.85}
                >
                    {paying ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <>
                            <MaterialIcons name="lock" size={18} color="#FFFFFF" />
                            <Text style={styles.payButtonText}>
                                {selectedMethod === 'cash' ? 'Confirm Booking with Cash' : `Pay Rs. ${totalAmount.toLocaleString()}`}
                            </Text>
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#EEF2F6', // Crisp Slate-Grey canvas
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    centerScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EEF2F6',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
    },

    // ── Dark Navy Hero ──
    heroBackground: {
        backgroundColor: '#1E293B',
        paddingHorizontal: 20,
        paddingBottom: 28,
        borderBottomLeftRadius: 36,
        borderBottomRightRadius: 36,
    },
    safeArea: {
        paddingTop: Platform.OS === 'android' ? 12 : 0,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    heroInfoBox: {
        alignItems: 'center',
        marginTop: 10,
    },
    heroAmountLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#94A3B8',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    heroAmountValue: {
        fontSize: 32,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    heroSubtitle: {
        fontSize: 12,
        color: '#60A5FA',
        fontWeight: '500',
    },

    // ── Cards ──
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 18,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    cardHeaderTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 14,
    },
    summaryProviderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    providerAvatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#EFF6FF',
        borderWidth: 1.5,
        borderColor: '#DBEAFE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    summaryProviderInfo: {
        flex: 1,
    },
    summaryProviderName: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 2,
    },
    summaryPill: {
        alignSelf: 'flex-start',
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    summaryPillText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#475569',
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginVertical: 12,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    detailText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748B',
    },

    // ── Breakdown Rows ──
    breakdownRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    breakdownLabel: {
        fontSize: 14,
        color: '#64748B',
    },
    breakdownVal: {
        fontSize: 14,
        fontWeight: '700',
        color: '#1E293B',
    },
    breakdownTotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0F172A',
    },
    totalVal: {
        fontSize: 20,
        fontWeight: '800',
        color: '#2563EB',
    },

    // ── Payment Methods ──
    methodOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F8FAFC',
        borderRadius: 14,
        padding: 12,
        marginBottom: 10,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
    },
    methodOptionActive: {
        borderColor: '#2563EB',
        backgroundColor: '#EFF6FF',
    },
    methodLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    methodIconBox: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    methodIconBoxActive: {
        borderColor: '#BFDBFE',
    },
    methodName: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0F172A',
    },
    methodDesc: {
        fontSize: 11,
        color: '#64748B',
        marginTop: 1,
    },
    radioCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#94A3B8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioCircleActive: {
        borderColor: '#2563EB',
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#2563EB',
    },

    // ── Trust Badge ──
    trustBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ECFDF5',
        borderWidth: 1,
        borderColor: '#A7F3D0',
        borderRadius: 14,
        padding: 12,
        marginBottom: 18,
        gap: 8,
    },
    trustText: {
        flex: 1,
        fontSize: 12,
        color: '#065F46',
        lineHeight: 16,
        fontWeight: '500',
    },

    // ── Pay Button ──
    payButton: {
        backgroundColor: '#2563EB',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        paddingVertical: 15,
        gap: 8,
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    payButtonDisabled: {
        opacity: 0.6,
    },
    payButtonText: {
        fontSize: 16,
        fontWeight: '800',
        color: '#FFFFFF',
    },
});