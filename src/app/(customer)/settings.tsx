import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
    const [bookingUpdates, setBookingUpdates] = useState(true);
    const [promotions, setPromotions] = useState(false);

    function handleLogout() {
        Alert.alert('Log Out', 'Are you sure you want to log out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Log Out',
                style: 'destructive',
                onPress: () => {
                    // TODO: wire to real supabase.auth.signOut() once Auth module is built
                    Alert.alert('Logged out', 'This will be connected to real auth soon.');
                },
            },
        ]);
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Settings</Text>

            <View style={styles.profileCard}>
                <View style={styles.avatarPlaceholder} />
                <View>
                    <Text style={styles.name}>Test Customer</Text>
                    <Text style={styles.phone}>077 123 4567</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.row}>
                <Text style={styles.rowText}>Edit Profile</Text>
                <Ionicons name="chevron-forward" size={18} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.row}>
                <Text style={styles.rowText}>My Reviews</Text>
                <Ionicons name="chevron-forward" size={18} color="#999" />
            </TouchableOpacity>

            <View style={styles.row}>
                <Text style={styles.rowText}>Booking Updates</Text>
                <Switch value={bookingUpdates} onValueChange={setBookingUpdates} />
            </View>

            <View style={styles.row}>
                <Text style={styles.rowText}>Promotions</Text>
                <Switch value={promotions} onValueChange={setPromotions} />
            </View>

            <TouchableOpacity style={styles.row}>
                <Text style={styles.rowText}>Help & Support</Text>
                <Ionicons name="chevron-forward" size={18} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 60 },
    title: { fontSize: 20, fontWeight: '700', marginBottom: 20 },
    profileCard: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 24 },
    avatarPlaceholder: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#E0E1E6' },
    name: { fontSize: 16, fontWeight: '600' },
    phone: { color: '#60646C', fontSize: 13 },
    row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#eee' },
    rowText: { fontSize: 14, color: '#333' },
    logoutButton: { marginTop: 30, padding: 14, borderRadius: 8, borderWidth: 1, borderColor: '#DC2626', alignItems: 'center' },
    logoutText: { color: '#DC2626', fontWeight: '600' },
});