import { useRouter } from 'expo-router';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';

type Payment = {
    id: string;
    customerName: string;
    date: string;
    amount: number;
};

const PAYMENT_HISTORY: Payment[] = [
    { id: '1', customerName: 'Customer Name', date: 'Sep 15, 2026', amount: 4200 },
    { id: '2', customerName: 'Customer Name', date: 'Sep 12, 2026', amount: 3500 },
    { id: '3', customerName: 'Customer Name', date: 'Sep 08, 2026', amount: 5000 },
    { id: '4', customerName: 'Customer Name', date: 'Sep 03, 2026', amount: 2800 },
    { id: '5', customerName: 'Customer Name', date: 'Aug 29, 2026', amount: 3750 },
];

export default function ProviderEarningsScreen() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.screen}>
            {/* ── Header ── */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backIcon}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Earnings</Text>
                <TouchableOpacity style={styles.moreButton}>
                    <Text style={styles.moreIcon}>•••</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* ── Summary Card ── */}
                <View style={styles.summaryCard}>
                    <View style={styles.summaryHeader}>
                        <Text style={styles.summaryLabel}>Total Earnings</Text>
                        <Text style={styles.summaryPeriod}>This Month</Text>
                    </View>
                    <Text style={styles.totalEarnings}>LKR 42,500</Text>

                    {/* ── Earnings Chart ── */}
                    <View style={{ alignItems: 'center', marginBottom: 16, marginTop: 8 }}>
                        <BarChart
                            data={{
                                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                                datasets: [{ data: [2.5, 4.2, 3.0, 8.0, 5.0, 12, 7.8] }]
                            }}
                            width={Dimensions.get("window").width - 85}
                            height={180}
                            yAxisLabel="Rs."
                            yAxisSuffix="k"
                            chartConfig={{
                                backgroundColor: "#ffffff",
                                backgroundGradientFrom: "#ffffff",
                                backgroundGradientTo: "#ffffff",
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                                style: { borderRadius: 16 },
                                barPercentage: 0.6,
                            }}
                            style={{ borderRadius: 16, paddingRight: 0 }}
                            fromZero={true}
                            withHorizontalLabels={true}
                            withInnerLines={false}
                            showValuesOnTopOfBars={false}
                        />
                    </View>

                    <View style={styles.statsRow}>
                        <Text style={styles.statText}>12 Jobs Completed</Text>
                        <Text style={styles.statText}>Avg: LKR 3,542</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.pendingRow}>
                        <Text style={styles.pendingLabel}>Pending Payout</Text>
                        <Text style={styles.pendingAmount}>LKR 7,200</Text>
                    </View>
                </View>

                {/* ── Payment History ── */}
                <View style={styles.historyHeader}>
                    <Text style={styles.historyTitle}>Payment History</Text>
                    <TouchableOpacity>
                        <Text style={styles.viewAllText}>View All</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.historyList}>
                    {PAYMENT_HISTORY.map((item, index) => (
                        <View key={item.id}>
                            <View style={styles.historyItem}>
                                <View>
                                    <Text style={styles.historyCustomer}>{item.customerName}</Text>
                                    <Text style={styles.historyDate}>{item.date}</Text>
                                </View>
                                <Text style={styles.historyAmount}>LKR {item.amount.toLocaleString()}</Text>
                            </View>
                            {index < PAYMENT_HISTORY.length - 1 && <View style={styles.listDivider} />}
                        </View>
                    ))}
                </View>
                <View style={{ height: 20 }} />
            </ScrollView>

            {/* ── Bottom Navigation Bar ── */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(provider)/provider-dashboard')}>
                    <Text style={styles.navIcon}>🏠</Text>
                    <Text style={styles.navLabel}>Home</Text>
                </TouchableOpacity>
                <View style={styles.navItem}>
                    <Text style={styles.navIcon}>📅</Text>
                    <Text style={styles.navLabel}>Schedule</Text>
                </View>
                <TouchableOpacity style={styles.navItemActive}>
                    <Text style={styles.navIconActive}>💰</Text>
                    <Text style={styles.navLabelActive}>Earnings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(provider)/provider-profile-setup')}>
                    <Text style={styles.navIcon}>👤</Text>
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
    },

    // Summary Card
    summaryCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    summaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    summaryLabel: { fontSize: 13, fontWeight: '700', color: '#6B7280' },
    summaryPeriod: { fontSize: 13, fontWeight: '600', color: '#2563EB' },
    totalEarnings: { fontSize: 32, fontWeight: '800', color: '#111827', marginBottom: 12 },
    statsRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
    statText: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
    divider: { height: 1, backgroundColor: '#F3F4F6', marginBottom: 16 },
    pendingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    pendingLabel: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
    pendingAmount: { fontSize: 15, fontWeight: '800', color: '#2563EB' },

    // History List
    historyHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    historyTitle: { fontSize: 16, fontWeight: '800', color: '#111827' },
    viewAllText: { fontSize: 14, fontWeight: '600', color: '#2563EB' },
    historyList: {
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    historyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
    },
    historyCustomer: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 4 },
    historyDate: { fontSize: 13, color: '#9CA3AF', fontWeight: '500' },
    historyAmount: { fontSize: 15, fontWeight: '800', color: '#111827' },
    listDivider: { height: 1, backgroundColor: '#F3F4F6' },

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