import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { BarChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCurrency } from './settingsStore';

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
    const { formatCurrency } = useCurrency();
    const router = useRouter();
    const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)));
    const [endDate, setEndDate] = useState(new Date());
    const [showCalendar, setShowCalendar] = useState(false);

    // Range picker states
    const [tempStartDate, setTempStartDate] = useState<string | null>(null);
    const [tempEndDate, setTempEndDate] = useState<string | null>(null);
    const [markedDates, setMarkedDates] = useState<any>({});

    const openCalendar = () => {
        setTempStartDate(null);
        setTempEndDate(null);
        setMarkedDates({});
        setShowCalendar(true);
    };

    const handleDayPress = (day: any) => {
        if (!tempStartDate || (tempStartDate && tempEndDate)) {
            setTempStartDate(day.dateString);
            setTempEndDate(null);
            setMarkedDates({
                [day.dateString]: { startingDay: true, color: '#2563EB', textColor: 'white' }
            });
        } else if (tempStartDate && !tempEndDate) {
            const start = new Date(tempStartDate);
            const end = new Date(day.dateString);
            if (end < start) {
                setTempStartDate(day.dateString);
                setMarkedDates({ [day.dateString]: { startingDay: true, color: '#2563EB', textColor: 'white' } });
                return;
            }

            let marks: any = {
                [tempStartDate]: { startingDay: true, color: '#2563EB', textColor: 'white' },
            };

            let curr = new Date(start);
            curr.setDate(curr.getDate() + 1);
            while (curr < end) {
                marks[curr.toISOString().split('T')[0]] = { color: '#EFF6FF', textColor: '#111827' };
                curr.setDate(curr.getDate() + 1);
            }
            marks[day.dateString] = { endingDay: true, color: '#2563EB', textColor: 'white' };

            setTempEndDate(day.dateString);
            setMarkedDates(marks);
        }
    };

    const applyDateRange = () => {
        if (tempStartDate && tempEndDate) {
            setStartDate(new Date(tempStartDate));
            setEndDate(new Date(tempEndDate));
        } else if (tempStartDate) {
            setStartDate(new Date(tempStartDate));
            setEndDate(new Date(tempStartDate));
        }
        setShowCalendar(false);
    };

    const formatDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    const formatModalDate = (dString: string | null) => {
        if (!dString) return 'Select';
        const d = new Date(dString);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const getStage = () => {
        if (!tempStartDate) return { step: 1, title: '1. Pick start' };
        if (tempStartDate && !tempEndDate) return { step: 2, title: '2. Pick end' };
        return { step: 3, title: '3. Done' };
    };

    const getDaysSelected = () => {
        if (tempStartDate && tempEndDate) {
            const start = new Date(tempStartDate);
            const end = new Date(tempEndDate);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            return diffDays;
        }
        return 0;
    };

    // Dynamic Mock Data Calculation based on selected dates
    const filteredHistory = PAYMENT_HISTORY.filter(item => {
        const itemDate = new Date(item.date);
        // set hours to 0 for accurate date comparison
        const start = new Date(startDate); start.setHours(0, 0, 0, 0);
        const end = new Date(endDate); end.setHours(23, 59, 59, 999);
        return itemDate >= start && itemDate <= end;
    });

    const dynamicChartData = [2.5, 4.2, 3.0, 8.0, 5.0, 12, 7.8].map(v => {
        // Just mocking chart changes dynamically based on selected date ranges
        const scale = ((startDate.getDate() + endDate.getDate()) % 5 + 5) / 5;
        return v * scale;
    });

    const totalEarningsVal = filteredHistory.reduce((acc, curr) => acc + curr.amount, 0);
    const totalEarningsStr = totalEarningsVal > 0 ? formatCurrency(totalEarningsVal.toLocaleString()) : formatCurrency('42,500');

    return (
        <SafeAreaView style={styles.screen}>
            {/* ── Header ── */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <MaterialIcons name="chevron-left" size={28} color="#2563EB" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Earnings</Text>
                <TouchableOpacity style={styles.moreButton}>
                    <MaterialIcons name="more-horiz" size={24} color="#9CA3AF" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* ── Summary Card ── */}
                <View style={styles.summaryCard}>
                    <View style={styles.summaryHeader}>
                        <Text style={styles.summaryLabel}>Total Earnings</Text>
                        <TouchableOpacity style={styles.filterButton} onPress={openCalendar}>
                            <MaterialIcons name="calendar-today" size={14} color="#2563EB" />
                            <Text style={styles.summaryPeriod}>{formatDate(startDate)} - {formatDate(endDate)}</Text>
                        </TouchableOpacity>
                    </View>

                    <Modal visible={showCalendar} animationType="fade" transparent={true}>
                        <View style={styles.modalOverlayDark}>
                            <View style={styles.calendarContainerDark}>
                                <Text style={styles.calendarTitleDark}>{getStage().title}</Text>

                                <View style={styles.dateFieldsContainer}>
                                    <View style={[styles.dateField, getStage().step === 1 && styles.dateFieldActive]}>
                                        <Text style={styles.dateFieldLabel}>Start</Text>
                                        <Text style={styles.dateFieldValue}>{formatModalDate(tempStartDate)}</Text>
                                    </View>
                                    <View style={[styles.dateField, getStage().step === 2 && styles.dateFieldActive]}>
                                        <Text style={styles.dateFieldLabel}>End</Text>
                                        <Text style={styles.dateFieldValue}>{formatModalDate(tempEndDate)}</Text>
                                    </View>
                                </View>

                                {getStage().step === 1 && (
                                    <View style={styles.hintBoxBlue}>
                                        <Text style={styles.hintTextBlue}>Tap a start date</Text>
                                    </View>
                                )}
                                {getStage().step === 2 && (
                                    <View style={styles.hintBoxBlue}>
                                        <Text style={styles.hintTextBlue}>Now tap an end date</Text>
                                    </View>
                                )}
                                {getStage().step === 3 && (
                                    <View style={styles.hintBoxGreen}>
                                        <Text style={styles.hintTextGreen}>{getDaysSelected()} days selected</Text>
                                    </View>
                                )}

                                <Calendar
                                    markingType={'period'}
                                    markedDates={markedDates}
                                    onDayPress={handleDayPress}
                                    theme={{ arrowColor: '#2563EB', todayTextColor: '#2563EB' }}
                                    style={{ marginVertical: 8 }}
                                />

                                <TouchableOpacity
                                    style={[styles.modalBtnApplyDark, getStage().step !== 3 && styles.modalBtnDisabled]}
                                    onPress={getStage().step === 3 ? applyDateRange : undefined}
                                    disabled={getStage().step !== 3}
                                >
                                    <Text style={[styles.modalBtnTextApplyDark, getStage().step !== 3 && styles.modalBtnTextDisabled]}>Apply filter</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    <Text style={styles.totalEarnings}>{totalEarningsStr}</Text>

                    {/* ── Earnings Chart ── */}
                    <View style={{ alignItems: 'center', marginBottom: 16, marginTop: 8 }}>
                        <BarChart
                            data={{
                                labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
                                datasets: [{ data: dynamicChartData }]
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
                        <Text style={styles.statText}>Avg: {formatCurrency('3,542')}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.pendingRow}>
                        <Text style={styles.pendingLabel}>Pending Payout</Text>
                        <Text style={styles.pendingAmount}>{formatCurrency('7,200')}</Text>
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
                    {filteredHistory.length === 0 && (
                        <View style={{ paddingVertical: 16, alignItems: 'center' }}>
                            <Text style={{ color: '#9CA3AF' }}>No payments found.</Text>
                        </View>
                    )}
                    {filteredHistory.map((item, index) => (
                        <View key={item.id}>
                            <View style={styles.historyItem}>
                                <View>
                                    <Text style={styles.historyCustomer}>{item.customerName}</Text>
                                    <Text style={styles.historyDate}>{item.date}</Text>
                                </View>
                                <Text style={styles.historyAmount}>{formatCurrency(item.amount.toLocaleString())}</Text>
                            </View>
                            {index < filteredHistory.length - 1 && <View style={styles.listDivider} />}
                        </View>
                    ))}
                </View>
                <View style={{ height: 20 }} />
            </ScrollView>

            {/* ── Bottom Navigation Bar ── */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(provider)/provider-dashboard')}>
                    <MaterialIcons name="dashboard" size={24} color="#9CA3AF" style={{ marginBottom: 4 }} />
                    <Text style={styles.navLabel}>Dashboard</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(provider)/provider-schedule')}>
                    <MaterialIcons name="calendar-today" size={24} color="#9CA3AF" style={{ marginBottom: 4 }} />
                    <Text style={styles.navLabel}>Schedule</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItemActive}>
                    <MaterialIcons name="account-balance-wallet" size={24} color="#2563EB" style={{ marginBottom: 4 }} />
                    <Text style={styles.navLabelActive}>Earnings</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => router.push('/(provider)/provider-profile-setup')}>
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
    filterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 6,
    },
    filterIcon: { fontSize: 12 },
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

    // Modal & Calendar
    // Modal & Calendar
    modalOverlayDark: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 20 },
    calendarContainerDark: { backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#F3F4F6' },
    calendarTitleDark: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 16, textAlign: 'center' },
    dateFieldsContainer: { flexDirection: 'row', gap: 12, marginBottom: 16 },
    dateField: { flex: 1, backgroundColor: '#F9FAFB', borderRadius: 8, padding: 10, borderWidth: 1, borderColor: '#E5E7EB' },
    dateFieldActive: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
    dateFieldLabel: { fontSize: 12, color: '#6B7280', marginBottom: 2 },
    dateFieldValue: { fontSize: 15, color: '#111827', fontWeight: '700' },

    hintBoxBlue: { backgroundColor: '#EFF6FF', paddingVertical: 8, borderRadius: 6, alignItems: 'center' },
    hintTextBlue: { color: '#2563EB', fontSize: 13, fontWeight: '600' },
    hintBoxGreen: { backgroundColor: '#ECFDF5', paddingVertical: 8, borderRadius: 6, alignItems: 'center' },
    hintTextGreen: { color: '#059669', fontSize: 13, fontWeight: '600' },

    modalBtnApplyDark: { backgroundColor: '#2563EB', paddingVertical: 12, borderRadius: 24, alignItems: 'center', marginTop: 12 },
    modalBtnTextApplyDark: { color: '#fff', fontSize: 15, fontWeight: '600' },
    modalBtnDisabled: { backgroundColor: '#F3F4F6' },
    modalBtnTextDisabled: { color: '#9CA3AF' },

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