import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { createBooking, getProviderById } from '../../lib/bookings';

export default function BookingScreen() {
    const router = useRouter();
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
        setSubmitting(true);

        // TODO: replace with real logged-in customer ID once Auth is built
        const TEMP_CUSTOMER_ID = '18b0a243-3adc-42fc-aadf-faa7cc698a6d';

        const booking = await createBooking({
            customerId: TEMP_CUSTOMER_ID,
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
            <View style={styles.providerCard}>
                <Text style={styles.providerName}>{provider.users?.name ?? 'Unnamed Provider'}</Text>
                <Text style={styles.providerType}>{provider.service_type}</Text>
            </View>

            <Text style={styles.sectionTitle}>Select Date</Text>
            <TouchableOpacity style={styles.pickerField} onPress={() => setShowDatePicker(true)}>
                <Text style={styles.pickerText}>{formatDateDisplay(date)}</Text>
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

            <Text style={styles.sectionTitle}>Select Time</Text>
            <TouchableOpacity style={styles.pickerField} onPress={() => setShowTimePicker(true)}>
                <Text style={styles.pickerText}>{formatTime(time)}</Text>
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

            <View style={styles.priceCard}>
                <Text style={styles.priceLabel}>Estimated Price</Text>
                <Text style={styles.priceValue}>Rs. {provider.rate}</Text>
            </View>

            <TouchableOpacity
                style={[styles.confirmButton, submitting && styles.confirmButtonDisabled]}
                onPress={handleConfirm}
                disabled={submitting}
            >
                <Text style={styles.confirmButtonText}>{submitting ? 'Booking...' : 'Confirm Booking'}</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 60 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    providerCard: { padding: 12, backgroundColor: '#F0F0F3', borderRadius: 8, marginBottom: 20 },
    providerName: { fontSize: 16, fontWeight: '600' },
    providerType: { color: '#60646C' },
    sectionTitle: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 8 },
    pickerField: { padding: 14, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 20 },
    pickerText: { fontSize: 15, color: '#333' },
    priceCard: { backgroundColor: '#FDF1E0', padding: 16, borderRadius: 8, marginTop: 10, marginBottom: 24 },
    priceLabel: { color: '#60646C', fontSize: 12 },
    priceValue: { fontSize: 22, fontWeight: '700', color: '#EF9F27' },
    confirmButton: { backgroundColor: '#2563EB', padding: 16, borderRadius: 8, alignItems: 'center', marginBottom: 40 },
    confirmButtonDisabled: { opacity: 0.6 },
    confirmButtonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});