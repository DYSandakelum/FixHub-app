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

export default function BookingTrackingScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const bookingId = params.bookingId as string | undefined;

    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (bookingId) {
            loadBookingDetails();
        } else {
            setLoading(false);
        }
    }, [bookingId]);

    async function loadBookingDetails() {
        setLoading(true);
        const { data, error } = await supabase
            .from('bookings')
            .select(`
                id,
                service_date,
                service_time,
                status,
                price,
                providers (
                    id,
                    service_type,
                    rate,
                    users (
                        name,
                        phone
                    )
                )
            `)
            .eq('id', bookingId)
            .single();

        if (data) {
            setBooking(data);
        }
        setLoading(false);
    }

    const steps = [
        { title: 'Booking Confirmed', sub: 'Your request was placed & confirmed', done: true, current: false },
        { title: 'Professional Assigned', sub: 'Provider accepted your appointment', done: true, current: false },
        { title: 'On the Way', sub: 'Provider is traveling to your location', done: false, current: true },
        { title: 'Service in Progress', sub: 'Repair & work in progress', done: false, current: false },
        { title: 'Job Completed', sub: 'Inspection & payment release', done: false, current: false },
    ];

    const bData: any = booking;
    const prov: any = Array.isArray(bData?.providers) ? bData?.providers[0] : bData?.providers;
    const usr: any = Array.isArray(prov?.users) ? prov?.users[0] : prov?.users;

    const providerName = usr?.name ?? 'Assigned Professional';
    const serviceType = prov?.service_type ?? 'Home Repair';
    const serviceDate = booking?.service_date ?? 'Today';
    const serviceTime = booking?.service_time ?? '02:00 PM';
    const price = booking?.price ?? 2500;

    return (
        <View style={styles.screen}>
            <StatusBar barStyle="light-content" backgroundColor="#1E293B" />

            {/* ── Dark Navy Curved Hero Header ── */}
            <View style={styles.heroBackground}>
                <SafeAreaView edges={['top']} style={styles.safeArea}>
                    <View style={styles.headerTop}>
                        <BackButton color="#FFFFFF" />
                        <Text style={styles.headerTitle}>Track Service</Text>
                        <TouchableOpacity
                            style={styles.headerActionBtn}
                            onPress={() => Alert.alert('Support', 'Contact FixHub dispatch: +94 11 234 5678')}
                        >
                            <MaterialIcons name="support-agent" size={22} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </SafeAreaView>

                <View style={styles.heroInfoBox}>
                    <View style={styles.livePulseBadge}>
                        <View style={styles.pulseDot} />
                        <Text style={styles.pulseText}>LIVE STATUS</Text>
                    </View>
                    <Text style={styles.heroMainStatus}>Professional is On the Way</Text>
                    <Text style={styles.heroEstArrival}>Estimated arrival in ~25 mins</Text>
                </View>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Provider Card ── */}
                <View style={styles.providerCard}>
                    <View style={styles.providerLeft}>
                        <View style={styles.avatarCircle}>
                            <MaterialIcons name="person" size={28} color="#2563EB" />
                        </View>
                        <View style={styles.providerTextCol}>
                            <Text style={styles.providerName}>{providerName}</Text>
                            <View style={styles.providerSubRow}>
                                <View style={styles.servicePill}>
                                    <Text style={styles.servicePillText}>{serviceType}</Text>
                                </View>
                                <View style={styles.ratingPill}>
                                    <MaterialIcons name="star" size={13} color="#D97706" />
                                    <Text style={styles.ratingText}>4.9</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.providerActionRow}>
                        <TouchableOpacity
                            style={styles.callButton}
                            onPress={() => Alert.alert('Calling', `Connecting to ${providerName}...`)}
                            activeOpacity={0.8}
                        >
                            <MaterialIcons name="phone" size={18} color="#2563EB" />
                            <Text style={styles.callButtonText}>Call</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.chatButton}
                            onPress={() => router.push(`/(transaction)/chat?bookingId=${bookingId ?? ''}`)}
                            activeOpacity={0.8}
                        >
                            <MaterialIcons name="chat" size={18} color="#FFFFFF" />
                            <Text style={styles.chatButtonText}>Chat</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ── Timeline Tracking Card ── */}
                <View style={styles.timelineCard}>
                    <Text style={styles.cardHeaderTitle}>Service Progress</Text>

                    <View style={styles.timelineContainer}>
                        {steps.map((step, idx) => {
                            const isLast = idx === steps.length - 1;
                            return (
                                <View key={step.title} style={styles.timelineItem}>
                                    <View style={styles.timelineLeftCol}>
                                        <View
                                            style={[
                                                styles.timelineDot,
                                                step.done && styles.timelineDotDone,
                                                step.current && styles.timelineDotCurrent,
                                            ]}
                                        >
                                            {step.done ? (
                                                <MaterialIcons name="check" size={14} color="#FFFFFF" />
                                            ) : step.current ? (
                                                <View style={styles.innerActiveDot} />
                                            ) : null}
                                        </View>
                                        {!isLast && (
                                            <View
                                                style={[
                                                    styles.timelineLine,
                                                    step.done && styles.timelineLineDone,
                                                ]}
                                            />
                                        )}
                                    </View>

                                    <View style={styles.timelineRightCol}>
                                        <Text
                                            style={[
                                                styles.stepTitle,
                                                (step.done || step.current) && styles.stepTitleActive,
                                            ]}
                                        >
                                            {step.title}
                                        </Text>
                                        <Text style={styles.stepSub}>{step.sub}</Text>
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                </View>

                {/* ── Appointment Summary Card ── */}
                <View style={styles.summaryCard}>
                    <Text style={styles.cardHeaderTitle}>Appointment Details</Text>

                    <View style={styles.infoFieldRow}>
                        <View style={styles.fieldIconCircle}>
                            <MaterialIcons name="calendar-today" size={18} color="#2563EB" />
                        </View>
                        <View style={styles.fieldTextCol}>
                            <Text style={styles.fieldLabelUpper}>SCHEDULED DATE & TIME</Text>
                            <Text style={styles.fieldValueText}>
                                {serviceDate} · {serviceTime}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.infoFieldRow}>
                        <View style={styles.fieldIconCircle}>
                            <MaterialIcons name="location-on" size={18} color="#2563EB" />
                        </View>
                        <View style={styles.fieldTextCol}>
                            <Text style={styles.fieldLabelUpper}>SERVICE LOCATION</Text>
                            <Text style={styles.fieldValueText}>Havelock Road, Colombo 05</Text>
                        </View>
                    </View>

                    <View style={[styles.infoFieldRow, { marginBottom: 0 }]}>
                        <View style={styles.fieldIconCircle}>
                            <MaterialIcons name="payments" size={18} color="#2563EB" />
                        </View>
                        <View style={styles.fieldTextCol}>
                            <Text style={styles.fieldLabelUpper}>ESTIMATED CHARGE</Text>
                            <Text style={styles.fieldValuePrice}>Rs. {price.toLocaleString()}</Text>
                        </View>
                    </View>
                </View>

                {/* ── Transaction Action Buttons ── */}
                <View style={styles.transactionActionsContainer}>
                    <TouchableOpacity
                        style={styles.payActionBtn}
                        onPress={() => router.push(`/(transaction)/payment?bookingId=${bookingId ?? ''}`)}
                        activeOpacity={0.85}
                    >
                        <MaterialIcons name="payment" size={18} color="#FFFFFF" />
                        <Text style={styles.payActionBtnText}>Proceed to Payment</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.reviewActionBtn}
                        onPress={() => router.push(`/(transaction)/rate-review?bookingId=${bookingId ?? ''}`)}
                        activeOpacity={0.85}
                    >
                        <MaterialIcons name="star-rate" size={18} color="#2563EB" />
                        <Text style={styles.reviewActionBtnText}>Rate & Review Service</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#EEF2F6', // Crisp Slate-Grey canvas matching provider screens
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },

    // ── Dark Navy Hero Header ──
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
    headerActionBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroInfoBox: {
        marginTop: 12,
    },
    livePulseBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 6,
        marginBottom: 8,
    },
    pulseDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10B981',
    },
    pulseText: {
        fontSize: 11,
        fontWeight: '800',
        color: '#34D399',
        letterSpacing: 0.5,
    },
    heroMainStatus: {
        fontSize: 22,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    heroEstArrival: {
        fontSize: 13,
        fontWeight: '500',
        color: '#94A3B8',
    },

    // ── Provider Card ──
    providerCard: {
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
    providerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        marginBottom: 16,
    },
    avatarCircle: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#EFF6FF',
        borderWidth: 2,
        borderColor: '#DBEAFE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    providerTextCol: {
        flex: 1,
    },
    providerName: {
        fontSize: 17,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 4,
    },
    providerSubRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    servicePill: {
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    servicePillText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#475569',
    },
    ratingPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFBEB',
        paddingHorizontal: 7,
        paddingVertical: 3,
        borderRadius: 8,
        gap: 3,
    },
    ratingText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#D97706',
    },
    providerActionRow: {
        flexDirection: 'row',
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
        paddingTop: 14,
    },
    callButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#EFF6FF',
        borderWidth: 1,
        borderColor: '#DBEAFE',
        borderRadius: 14,
        paddingVertical: 12,
        gap: 6,
    },
    callButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#2563EB',
    },
    chatButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2563EB',
        borderRadius: 14,
        paddingVertical: 12,
        gap: 6,
    },
    chatButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
    },

    // ── Timeline Card ──
    timelineCard: {
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
        marginBottom: 16,
    },
    timelineContainer: {
        paddingLeft: 6,
    },
    timelineItem: {
        flexDirection: 'row',
        minHeight: 52,
    },
    timelineLeftCol: {
        alignItems: 'center',
        width: 28,
        marginRight: 12,
    },
    timelineDot: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#E2E8F0',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    timelineDotDone: {
        backgroundColor: '#10B981',
    },
    timelineDotCurrent: {
        backgroundColor: '#2563EB',
    },
    innerActiveDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#FFFFFF',
    },
    timelineLine: {
        width: 2,
        flex: 1,
        backgroundColor: '#E2E8F0',
        marginVertical: 4,
    },
    timelineLineDone: {
        backgroundColor: '#10B981',
    },
    timelineRightCol: {
        flex: 1,
        paddingBottom: 16,
    },
    stepTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#94A3B8',
    },
    stepTitleActive: {
        color: '#0F172A',
        fontWeight: '700',
    },
    stepSub: {
        fontSize: 12,
        color: '#64748B',
        marginTop: 2,
    },

    // ── Summary Card ──
    summaryCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 18,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    infoFieldRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: 14,
        padding: 12,
        marginBottom: 10,
    },
    fieldIconCircle: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    fieldTextCol: {
        flex: 1,
    },
    fieldLabelUpper: {
        fontSize: 10,
        fontWeight: '700',
        color: '#94A3B8',
        marginBottom: 2,
        letterSpacing: 0.5,
    },
    fieldValueText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0F172A',
    },
    fieldValuePrice: {
        fontSize: 16,
        fontWeight: '800',
        color: '#2563EB',
    },

    // ── Transaction Action Buttons ──
    transactionActionsContainer: {
        gap: 12,
        marginBottom: 20,
    },
    payActionBtn: {
        backgroundColor: '#2563EB',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 16,
        gap: 8,
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    payActionBtnText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    reviewActionBtn: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1.5,
        borderColor: '#2563EB',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 16,
        gap: 8,
    },
    reviewActionBtnText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#2563EB',
    },
});