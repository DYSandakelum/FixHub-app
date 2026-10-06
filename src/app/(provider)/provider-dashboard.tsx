import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Types ────────────────────────────────────────────────────────────────────
type JobRequest = {
    id: string;
    customerName: string;
    distance: string;
    serviceType: string;
    price: number;
};

// ─── Mock Data ────────────────────────────────────────────────────────────────
const JOB_REQUESTS: JobRequest[] = [
    {
        id: '1',
        customerName: 'Alice Cooper',
        distance: '1.2 mi away',
        serviceType: 'Leaking Kitchen Sink Pipe',
        price: 85,
    },
    {
        id: '2',
        customerName: 'Bob Dylan',
        distance: '3.5 mi away',
        serviceType: 'Water Heater Inspection',
        price: 150,
    },
    {
        id: '3',
        customerName: 'Carol White',
        distance: '0.8 mi away',
        serviceType: 'Electrical Outlet Repair',
        price: 95,
    },
];

// ─── Job Request Card ─────────────────────────────────────────────────────────
function JobRequestCard({ job }: { job: JobRequest }) {
    const router = useRouter();

    return (
        <View style={styles.jobCard}>
            <View style={styles.jobCardHeader}>
                <View>
                    <Text style={styles.customerName}>{job.customerName}</Text>
                    <Text style={styles.distanceText}>{job.distance}</Text>
                    <View style={styles.serviceRow}>
                        <View style={styles.blueDot} />
                        <Text style={styles.serviceType}>{job.serviceType}</Text>
                    </View>
                </View>
                <Text style={styles.priceText}>${job.price}</Text>
            </View>

            <View style={styles.jobCardActions}>
                <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => router.push({ pathname: '/(provider)/request-details', params: { id: job.id } })}
                >
                    <Text style={styles.detailsButtonText}>Details</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.acceptButton}>
                    <Text style={styles.acceptButtonText}>Accept</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// ─── Bottom Tab Bar ───────────────────────────────────────────────────────────
function BottomTabBar({ activeTab }: { activeTab: string }) {
    const router = useRouter();
    const tabs = [
        { name: 'Dashboard', icon: '⊞', route: '/(provider)/provider-dashboard' },
        { name: 'Schedule', icon: '📅', route: '' },
        { name: 'Earnings', icon: '💳', route: '' },
        { name: 'Profile', icon: '👤', route: '/(provider)/provider-profile-setup' },
    ];

    return (
        <View style={styles.tabBar}>
            {tabs.map((tab) => (
                <TouchableOpacity
                    key={tab.name}
                    style={styles.tabItem}
                    onPress={() => {
                        if (tab.route) router.push(tab.route as any);
                    }}
                >
                    <Text style={[styles.tabIcon, activeTab === tab.name && styles.tabActiveIcon]}>
                        {tab.icon}
                    </Text>
                    <Text style={[styles.tabLabel, activeTab === tab.name && styles.tabActiveLabel]}>
                        {tab.name}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ProviderDashboardScreen() {
    const [isOnline, setIsOnline] = useState(true);

    return (
        <SafeAreaView style={styles.screen}>
            {/* ── Header ── */}
            <View style={styles.header}>
                <View style={styles.profileRow}>
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarInitials}>MV</Text>
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>Marcus Vance</Text>
                        <Text style={styles.profileStatus}>
                            {isOnline ? 'Online & Accepting Jobs' : 'Offline'}
                        </Text>
                    </View>
                </View>
                <View style={styles.onlineToggle}>
                    <Text style={[styles.onlineLabel, isOnline && styles.onlineLabelActive]}>
                        {isOnline ? 'ONLINE' : 'OFFLINE'}
                    </Text>
                    <Switch
                        value={isOnline}
                        onValueChange={setIsOnline}
                        trackColor={{ false: '#ccc', true: '#2563EB' }}
                        thumbColor="#fff"
                    />
                </View>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Earnings Card ── */}
                <View style={styles.earningsCard}>
                    <View style={styles.earningsCardHeader}>
                        <Text style={styles.earningsLabel}>WEEKLY EARNINGS</Text>
                        <Text style={styles.earningsDateRange}>Oct 12 – Oct 19</Text>
                    </View>
                    <Text style={styles.earningsAmount}>$1,240.50</Text>
                    <Text style={styles.jobsCompleted}>14 Jobs completed</Text>
                    <View style={styles.divider} />
                    <View style={styles.payoutRow}>
                        <Text style={styles.payoutText}>Next payout: Oct 21</Text>
                        <TouchableOpacity>
                            <Text style={styles.viewBreakdownLink}>View Breakdown</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ── Available Requests ── */}
                <View style={styles.requestsHeader}>
                    <Text style={styles.requestsTitle}>
                        Available Requests ({JOB_REQUESTS.length})
                    </Text>
                    <TouchableOpacity>
                        <Text style={styles.sortFilterLink}>Sort/Filter</Text>
                    </TouchableOpacity>
                </View>

                {JOB_REQUESTS.map((job) => (
                    <JobRequestCard key={job.id} job={job} />
                ))}

                <View style={{ height: 20 }} />
            </ScrollView>

            {/* ── Bottom Tab Bar ── */}
            <BottomTabBar activeTab="Dashboard" />
        </SafeAreaView>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F2F4F7',
    },

    // Header
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    profileRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatarPlaceholder: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: '#2563EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInitials: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
    profileInfo: {
        gap: 2,
    },
    profileName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
    },
    profileStatus: {
        fontSize: 12,
        color: '#6B7280',
    },
    onlineToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    onlineLabel: {
        fontSize: 13,
        fontWeight: '700',
        color: '#9CA3AF',
    },
    onlineLabelActive: {
        color: '#2563EB',
    },

    // Scroll
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        gap: 16,
    },

    // Earnings Card
    earningsCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 18,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
        marginBottom: 8,
    },
    earningsCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    earningsLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#6B7280',
        letterSpacing: 0.8,
    },
    earningsDateRange: {
        fontSize: 11,
        color: '#9CA3AF',
    },
    earningsAmount: {
        fontSize: 34,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 4,
    },
    jobsCompleted: {
        fontSize: 13,
        color: '#6B7280',
        marginBottom: 14,
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginBottom: 12,
    },
    payoutRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    payoutText: {
        fontSize: 13,
        color: '#374151',
    },
    viewBreakdownLink: {
        fontSize: 13,
        fontWeight: '600',
        color: '#2563EB',
    },

    // Requests Section
    requestsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    requestsTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#111827',
    },
    sortFilterLink: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2563EB',
    },

    // Job Card
    jobCard: {
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
        marginBottom: 8,
    },
    jobCardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 14,
    },
    customerName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 2,
    },
    distanceText: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 6,
    },
    serviceRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    blueDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#2563EB',
    },
    serviceType: {
        fontSize: 13,
        color: '#374151',
    },
    priceText: {
        fontSize: 20,
        fontWeight: '800',
        color: '#111827',
    },
    jobCardActions: {
        flexDirection: 'row',
        gap: 10,
    },
    detailsButton: {
        flex: 1,
        borderWidth: 1.5,
        borderColor: '#D1D5DB',
        borderRadius: 10,
        paddingVertical: 11,
        alignItems: 'center',
    },
    detailsButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    acceptButton: {
        flex: 1,
        backgroundColor: '#2563EB',
        borderRadius: 10,
        paddingVertical: 11,
        alignItems: 'center',
    },
    acceptButtonText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff',
    },

    // Bottom Tab Bar
    tabBar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        paddingBottom: 8,
        paddingTop: 8,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        gap: 2,
        paddingVertical: 4,
    },
    tabIcon: {
        fontSize: 20,
        color: '#9CA3AF',
    },
    tabActiveIcon: {
        color: '#2563EB',
    },
    tabLabel: {
        fontSize: 11,
        color: '#9CA3AF',
    },
    tabActiveLabel: {
        color: '#2563EB',
        fontWeight: '600',
    },
});