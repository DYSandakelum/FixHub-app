import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { getUserProfile } from '../../lib/users';

const TEMP_CUSTOMER_ID = '18b0a243-3adc-42fc-aadf-faa7cc698a6d'; // TODO: replace with real logged-in user once Auth is built

export default function SettingsScreen() {
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [bookingUpdates, setBookingUpdates] = useState(true);
    const [promotions, setPromotions] = useState(false);

    useFocusEffect(
        useCallback(() => {
            loadProfile();
        }, [])
    );

    async function loadProfile() {
        setLoading(true);
        const data = await getUserProfile(TEMP_CUSTOMER_ID);
        setProfile(data);
        setLoading(false);
    }

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
        <ScrollView style={styles.container}>
            <Text style={styles.screenTitle}>Settings</Text>

            <TouchableOpacity
                style={styles.profileCard}
                onPress={() => router.push('/(customer)/edit-profile')}
            >
                {profile?.avatar_url ? (
                    <Image source={{ uri: profile.avatar_url }} style={styles.avatarImage} />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Ionicons name="person" size={28} color="#fff" />
                    </View>
                )}
                <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{loading ? 'Loading...' : profile?.name ?? 'Unnamed'}</Text>
                    <Text style={styles.phone}>{profile?.phone ?? ''}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#999" />
            </TouchableOpacity>

            <View style={styles.section}>
                <Text style={styles.sectionLabel}>Account</Text>
                <TouchableOpacity style={styles.row} onPress={() => router.push('/(customer)/edit-profile')}>
                    <View style={styles.rowLeft}>
                        <Ionicons name="person-outline" size={20} color="#2563EB" />
                        <Text style={styles.rowText}>Edit Profile</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#999" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.row}
                    onPress={() => Alert.alert('My Reviews', 'This section is coming soon.')}
                >
                    <View style={styles.rowLeft}>
                        <Ionicons name="star-outline" size={20} color="#2563EB" />
                        <Text style={styles.rowText}>My Reviews</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#999" />
                </TouchableOpacity>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionLabel}>Notifications</Text>
                <View style={styles.row}>
                    <View style={styles.rowLeft}>
                        <Ionicons name="notifications-outline" size={20} color="#2563EB" />
                        <Text style={styles.rowText}>Booking Updates</Text>
                    </View>
                    <Switch value={bookingUpdates} onValueChange={setBookingUpdates} trackColor={{ true: '#2563EB' }} />
                </View>
                <View style={styles.row}>
                    <View style={styles.rowLeft}>
                        <Ionicons name="megaphone-outline" size={20} color="#2563EB" />
                        <Text style={styles.rowText}>Promotions</Text>
                    </View>
                    <Switch value={promotions} onValueChange={setPromotions} trackColor={{ true: '#2563EB' }} />
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionLabel}>Support</Text>
                <TouchableOpacity
                    style={styles.row}
                    onPress={() => Alert.alert('Help & Support', 'Contact us at support@fixhub.lk')}
                >
                    <View style={styles.rowLeft}>
                        <Ionicons name="help-circle-outline" size={20} color="#2563EB" />
                        <Text style={styles.rowText}>Help & Support</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#999" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out-outline" size={18} color="#DC2626" />
                <Text style={styles.logoutText}> Log Out</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 60, backgroundColor: '#fff' },
    screenTitle: { fontSize: 24, fontWeight: '700', marginBottom: 20, color: '#2563EB' },
    profileCard: {
        flexDirection: 'row', alignItems: 'center', gap: 14,
        backgroundColor: '#F0F0F3', borderRadius: 14, padding: 16, marginBottom: 24,
    },
    avatarImage: { width: 56, height: 56, borderRadius: 28 },
    avatarPlaceholder: {
        width: 56, height: 56, borderRadius: 28,
        backgroundColor: '#2563EB', justifyContent: 'center', alignItems: 'center',
    },
    name: { fontSize: 16, fontWeight: '600' },
    phone: { color: '#60646C', fontSize: 13, marginTop: 2 },
    section: { marginBottom: 20 },
    sectionLabel: { fontSize: 12, fontWeight: '600', color: '#999', marginBottom: 8, textTransform: 'uppercase' },
    row: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        backgroundColor: '#fff', paddingVertical: 14, paddingHorizontal: 14, borderRadius: 10, marginBottom: 6,
        shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 1 }, elevation: 1,
    },
    rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    rowText: { fontSize: 14, color: '#333' },
    logoutButton: {
        flexDirection: 'row', justifyContent: 'center', marginTop: 10, padding: 14,
        borderRadius: 10, borderWidth: 1, borderColor: '#DC2626', alignItems: 'center', marginBottom: 40,
    },
    logoutText: { color: '#DC2626', fontWeight: '600' },
});