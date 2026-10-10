import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function JobCompletionScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.screen}>
            {/* ── Header ── */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <MaterialIcons name="chevron-left" size={28} color="#2563EB" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Job Completion</Text>
                <TouchableOpacity style={styles.moreButton}>
                    <MaterialIcons name="more-horiz" size={24} color="#9CA3AF" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* ── Profile Card ── */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarInitials}>CN</Text>
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>Customer Name</Text>
                        <Text style={styles.serviceText}>Service Type · Date</Text>
                        <Text style={styles.priceText}>LKR 3,500</Text>
                    </View>
                </View>

                {/* ── Middle Status Section ── */}
                <View style={styles.statusSection}>
                    <View style={styles.checkCircle}>
                        <Text style={styles.checkIcon}>✓</Text>
                    </View>
                    <View style={styles.statusRow}>
                        <Text style={styles.statusCheckSmall}>✓</Text>
                        <Text style={styles.statusText}>Job Complete</Text>
                    </View>
                </View>

                {/* ── Mark as Complete Button ── */}
                <TouchableOpacity style={styles.completeButton}>
                    <Text style={styles.completeButtonText}>Mark as Complete</Text>
                </TouchableOpacity>

                {/* ── Confirmation Message Box ── */}
                <View style={styles.infoBox}>
                    <Text style={styles.infoBoxTitle}>Confirmation Message</Text>
                    <Text style={styles.infoBoxText}>
                        A confirmation will be sent to the customer once you mark this job as complete.
                    </Text>
                </View>

                {/* ── Payment Info Note ── */}
                <View style={styles.noteRow}>
                    <Text style={styles.infoIcon}>ⓘ</Text>
                    <Text style={styles.noteText}>
                        Payment will be released after customer confirms completion.
                    </Text>
                </View>
            </ScrollView>

            {/* ── Bottom Navigation Bar ── */}
            <View style={styles.bottomNav}>
                <View style={styles.navItem}>
                    <MaterialIcons name="dashboard" size={24} color="#9CA3AF" style={{ marginBottom: 4 }} />
                    <Text style={styles.navLabel}>Home</Text>
                </View>
                <View style={styles.navItem}>
                    <MaterialIcons name="calendar-today" size={24} color="#9CA3AF" style={{ marginBottom: 4 }} />
                    <Text style={styles.navLabel}>Schedule</Text>
                </View>
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => router.push('/(provider)/provider-earnings')}
                >
                    <MaterialIcons name="account-balance-wallet" size={24} color="#9CA3AF" style={{ marginBottom: 4 }} />
                    <Text style={styles.navLabel}>Earnings</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.navItem}
                    onPress={() => router.push('/(provider)/providerSetup-profile')}
                >
                    <MaterialIcons name="person" size={24} color="#9CA3AF" style={{ marginBottom: 4 }} />
                    <Text style={styles.navLabel}>Profile</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 14,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: { fontSize: 24, color: '#2563EB', lineHeight: 28 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
    moreButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    moreIcon: { fontSize: 20, color: '#9CA3AF', fontWeight: '700' },

    scrollContent: {
        padding: 20,
        paddingBottom: 40,
        alignItems: 'center',
    },

    // Profile Card
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        width: '100%',
        marginBottom: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    avatarPlaceholder: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    avatarInitials: { color: '#2563EB', fontSize: 20, fontWeight: '700' },
    profileInfo: { flex: 1, gap: 4 },
    profileName: { fontSize: 18, fontWeight: '700', color: '#111827' },
    serviceText: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
    priceText: { fontSize: 18, color: '#2563EB', fontWeight: '700', marginTop: 2 },

    // Status Section
    statusSection: { alignItems: 'center', marginBottom: 40 },
    checkCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    checkIcon: { fontSize: 32, color: '#2563EB', fontWeight: '300' },
    statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    statusCheckSmall: { color: '#2563EB', fontSize: 16, fontWeight: '800' },
    statusText: { fontSize: 18, fontWeight: '700', color: '#2563EB' },

    // Primary Button
    completeButton: {
        backgroundColor: '#2563EB',
        borderRadius: 12,
        paddingVertical: 16,
        width: '100%',
        alignItems: 'center',
        marginBottom: 24,
    },
    completeButtonText: { fontSize: 16, fontWeight: '700', color: '#fff' },

    // Info Box
    infoBox: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        width: '100%',
        marginBottom: 24,
    },
    infoBoxTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 8 },
    infoBoxText: { fontSize: 14, color: '#6B7280', lineHeight: 22 },

    // Note Section
    noteRow: { flexDirection: 'row', alignItems: 'flex-start', width: '100%', paddingHorizontal: 10, gap: 10 },
    infoIcon: { color: '#3B82F6', fontSize: 16, marginTop: 2 },
    noteText: { flex: 1, fontSize: 13, color: '#6B7280', lineHeight: 18 },

    // Bottom Nav
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
    navItem: { alignItems: 'center' },
    navIcon: { fontSize: 24, opacity: 0.5, marginBottom: 4 },
    navLabel: { fontSize: 12, color: '#9CA3AF', fontWeight: '500' },
    navItemActive: { alignItems: 'center' },
    navIconActive: { fontSize: 24, opacity: 1, marginBottom: 4 },
    navLabelActive: { fontSize: 12, color: '#2563EB', fontWeight: '600' },
});