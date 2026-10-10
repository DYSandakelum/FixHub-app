import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
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
import { createBooking, getProviderById } from '../../lib/bookings';
import { useAuth } from '@/context/auth-context';

export default function BookingScreen() {
    const router = useRouter();
    const { user } = useAuth();
    const { providerId } = useLocalSearchParams();
    const [provider, setProvider] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    useEffect(() => {
        if (providerId) loadProvider();
    }, [providerId]);

    async function loadProvider() {
        setLoading(true);
        const data = await getProviderById(providerId as string);
        setProvider(data);
        setLoading(false);
    }

    function formatDate(d: Date) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function formatTime(d: Date) {
        let hours = d.getHours();
        const minutes = String(d.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${ampm}`;
    }

    function formatDateDisplay(d: Date) {
        return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    async function handleConfirm() {
        if (!user?.id) {
            Alert.alert('Sign In Required', 'Please sign in to confirm your booking.', [
                { text: 'Sign In', onPress: () => router.push('/(auth)/login') },
                { text: 'Cancel', style: 'cancel' }
            ]);
            return;
        }

        setSubmitting(true);

        const booking = await createBooking({
            customerId: user.id,
            providerId: provider.id,
            serviceDate: formatDate(date),
            serviceTime: formatTime(time),
            price: provider.rate,
        });

        setSubmitting(false);

        if (booking) {
            Alert.alert('Booking Confirmed', `Your booking with ${provider.users?.name} is confirmed.`, [
                { text: 'OK', onPress: () => router.push(`/(transaction)/payment?bookingId=${booking.id}`) },
            ]);
        } else {
            Alert.alert('Error', 'Something went wrong creating your booking. Please try again.');
        }
    }

    if (loading) {
        return (
            <View style={styles.center}>
                <StatusBar barStyle="dark-content" />
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.loadingText}>Loading booking form...</Text>
            </View>
        );
    }

    if (!provider) {
        return (
            <View style={styles.center}>
                <StatusBar barStyle="dark-content" />
                <MaterialIcons name="error-outline" size={48} color="#94A3B8" />
                <Text style={styles.loadingText}>Provider not found.</Text>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <Text style={styles.backBtnText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.screen}>
            <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

            {/* ── Curved Royal Blue Hero Header ── */}
            <View style={styles.blueHeaderSection}>
                <SafeAreaView edges={['top']} style={{ flex: 0 }} />
                <View style={styles.headerTop}>
                    <TouchableOpacity style={styles.headerBackBtn} onPress={() => router.back()} activeOpacity={0.7}>
                        <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <View style={styles.headerTitleBox}>
                        <Text style={styles.headerTitleBlue}>Schedule Service</Text>
                        <Text style={styles.headerSubtitleBlue}>
                            Booking with {provider.users?.name ?? 'Provider'}
                        </Text>
                    </View>
                    <View style={{ width: 40 }} />
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* ── Floating Overlapping Provider Card ── */}
                <View style={styles.floatingProviderCard}>
                    <View style={styles.avatarPlaceholder}>
                        <MaterialIcons name="person" size={28} color="#2563EB" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.providerName}>{provider.users?.name ?? 'Service Provider'}</Text>
                        <View style={styles.servicePill}>
                            <Text style={styles.providerType}>{provider.service_type}</Text>
                        </View>
                    </View>
                    <View style={styles.rateBox}>
                        <Text style={styles.rateValue}>Rs. {provider.rate}</Text>
                        <Text style={styles.rateUnit}>/hr</Text>
                    </View>
                </View>

                {/* ── Select Date ── */}
                <Text style={styles.sectionSimpleTitle}>Appointment Date</Text>
                <TouchableOpacity
                    style={styles.pickerField}
                    onPress={() => setShowDatePicker(true)}
                    activeOpacity={0.8}
                >
                    <View style={styles.pickerLeft}>
                        <View style={styles.pickerIconCircle}>
                            <MaterialIcons name="calendar-today" size={20} color="#2563EB" />
                        </View>
                        <View>
                            <Text style={styles.pickerLabelUpper}>SERVICE DATE</Text>
                            <Text style={styles.pickerText}>{formatDateDisplay(date)}</Text>
                        </View>
                    </View>
                    <MaterialIcons name="chevron-right" size={22} color="#CBD5E1" />
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={date}
                        mode="date"
                        minimumDate={new Date()}
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={(event, selectedDate) => {
                            setShowDatePicker(false);
                            if (selectedDate) setDate(selectedDate);
                        }}
                    />
                )}

                {/* ── Select Time ── */}
                <Text style={styles.sectionSimpleTitle}>Appointment Time</Text>
                <TouchableOpacity
                    style={styles.pickerField}
                    onPress={() => setShowTimePicker(true)}
                    activeOpacity={0.8}
                >
                    <View style={styles.pickerLeft}>
                        <View style={styles.pickerIconCircle}>
                            <MaterialIcons name="schedule" size={20} color="#2563EB" />
                        </View>
                        <View>
                            <Text style={styles.pickerLabelUpper}>SERVICE TIME</Text>
                            <Text style={styles.pickerText}>{formatTime(time)}</Text>
                        </View>
                    </View>
                    <MaterialIcons name="chevron-right" size={22} color="#CBD5E1" />
                </TouchableOpacity>

                {showTimePicker && (
                    <DateTimePicker
                        value={time}
                        mode="time"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={(event, selectedTime) => {
                            setShowTimePicker(false);
                            if (selectedTime) setTime(selectedTime);
                        }}
                    />
                )}

                {/* ── Price Summary Card ── */}
                <Text style={styles.sectionSimpleTitle}>Pricing Estimate</Text>
                <View style={styles.priceCard}>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceRowLabel}>Base Hourly Rate</Text>
                        <Text style={styles.priceRowValue}>Rs. {provider.rate}.00</Text>
                    </View>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceRowLabel}>Platform Service Fee</Text>
                        <Text style={styles.priceRowValueFree}>FREE</Text>
                    </View>
                    <View style={styles.priceDivider} />
                    <View style={styles.totalRow}>
                        <View>
                            <Text style={styles.totalLabel}>Estimated Total</Text>
                            <Text style={styles.totalSublabel}>Pay after service completion</Text>
                        </View>
                        <Text style={styles.totalValue}>Rs. {provider.rate}</Text>
                    </View>
                </View>

                {/* ── Confirm Button ── */}
                <TouchableOpacity
                    style={[styles.confirmButton, submitting && styles.confirmButtonDisabled]}
                    onPress={handleConfirm}
                    disabled={submitting}
                    activeOpacity={0.85}
                >
                    {submitting ? (
                        <ActivityIndicator size="small" color="#FFFFFF" style={{ marginRight: 8 }} />
                    ) : (
                        <MaterialIcons name="check-circle" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                    )}
                    <Text style={styles.confirmButtonText}>
                        {submitting ? 'Confirming Appointment...' : 'Confirm Booking'}
                    </Text>
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
    backBtn: {
        marginTop: 16,
        backgroundColor: '#2563EB',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
    },
    backBtnText: {
        color: '#fff',
        fontWeight: '700',
    },

    // ── Curved Blue Hero ──
    blueHeaderSection: {
        backgroundColor: '#2563EB',
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        paddingBottom: 36,
        zIndex: 10,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerBackBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitleBox: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitleBlue: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FFFFFF',
    },
    headerSubtitleBlue: {
        fontSize: 12,
        fontWeight: '500',
        color: '#BFDBFE',
        marginTop: 2,
    },

    // ── Content ──
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 36,
    },

    // ── Overlapping Provider Card ──
    floatingProviderCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 16,
        marginTop: -20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 4,
        marginBottom: 16,
        zIndex: 20,
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
    providerName: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 3,
    },
    servicePill: {
        alignSelf: 'flex-start',
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
    rateBox: {
        alignItems: 'flex-end',
    },
    rateValue: {
        fontSize: 17,
        fontWeight: '800',
        color: '#2563EB',
    },
    rateUnit: {
        fontSize: 11,
        fontWeight: '600',
        color: '#64748B',
    },

    // ── Section Titles ──
    sectionSimpleTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 8,
        marginTop: 10,
        marginLeft: 2,
    },

    // ── Pickers ──
    pickerField: {
        backgroundColor: '#FFFFFF',
        padding: 14,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 6,
        elevation: 1,
    },
    pickerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    pickerIconCircle: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: '#EFF6FF',
        borderWidth: 1,
        borderColor: '#DBEAFE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pickerLabelUpper: {
        fontSize: 10,
        fontWeight: '800',
        color: '#94A3B8',
        letterSpacing: 0.5,
        marginBottom: 2,
    },
    pickerText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0F172A',
    },

    // ── Pricing Card ──
    priceCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 18,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginTop: 4,
        marginBottom: 24,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 2,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    priceRowLabel: {
        fontSize: 14,
        color: '#64748B',
        fontWeight: '500',
    },
    priceRowValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0F172A',
    },
    priceRowValueFree: {
        fontSize: 12,
        fontWeight: '800',
        color: '#059669',
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    priceDivider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginVertical: 10,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 4,
    },
    totalLabel: {
        fontSize: 15,
        fontWeight: '800',
        color: '#0F172A',
    },
    totalSublabel: {
        fontSize: 12,
        color: '#94A3B8',
        fontWeight: '500',
    },
    totalValue: {
        fontSize: 22,
        fontWeight: '800',
        color: '#2563EB',
    },

    // ── Confirm Button ──
    confirmButton: {
        backgroundColor: '#2563EB',
        paddingVertical: 16,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    confirmButtonDisabled: {
        opacity: 0.6,
    },
    confirmButtonText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 16,
    },
});