import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../lib/supabase';
import { useCurrency, useSettings } from './settingsStore';

export default function RequestDetailsScreen() {
    const { formatCurrency } = useCurrency();
    const router = useRouter();
    const { activeJobDetails, baseFee } = useSettings();

    // Parse dynamic user selection from routing
    const customerName = activeJobDetails?.customerName || 'Alice Cooper';
    const initName = activeJobDetails?.initial || 'AC';
    const address = activeJobDetails?.address || '1248 Oakwood Dr, Apt 4B';
    const serviceType = activeJobDetails?.serviceType || 'Plumbing';

    const routeCoordinates = [
        { latitude: 47.5950, longitude: -122.3380 },
        { latitude: 47.5980, longitude: -122.3360 },
        { latitude: 47.6020, longitude: -122.3340 },
        { latitude: 47.6062, longitude: -122.3321 },
    ];

    const [providerLocation, setProviderLocation] = useState(routeCoordinates[0]);
    const [jobStatus, setJobStatus] = useState<'pending' | 'in-progress' | 'completed'>('pending');
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [materialCost, setMaterialCost] = useState('');

    useEffect(() => {
        let step = 0;
        let segment = 0;
        const totalSteps = 15; // Smoothness factor per segment

        const timer = setInterval(() => {
            if (segment >= routeCoordinates.length - 1) {
                clearInterval(timer);
                return;
            }

            const startPt = routeCoordinates[segment];
            const endPt = routeCoordinates[segment + 1];

            step++;
            const progress = step / totalSteps;

            setProviderLocation({
                latitude: startPt.latitude + (endPt.latitude - startPt.latitude) * progress,
                longitude: startPt.longitude + (endPt.longitude - startPt.longitude) * progress,
            });

            if (step >= totalSteps) {
                step = 0;
                segment++;
            }
        }, 300); // 300ms update rate

        return () => clearInterval(timer);
    }, []);

    return (
        <View style={styles.screen}>
            {/* ── Background Map ── */}
            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '55%' }}>
                <MapView
                    style={{ width: '100%', height: '100%' }}
                    initialRegion={{
                        latitude: 47.6010,
                        longitude: -122.3350,
                        latitudeDelta: 0.03,
                        longitudeDelta: 0.03,
                    }}
                >
                    <Polyline
                        coordinates={routeCoordinates}
                        strokeColor="#059669"
                        strokeWidth={4}
                    />
                    <Marker
                        coordinate={providerLocation}
                        pinColor="orange"
                    />
                    <Marker coordinate={{ latitude: 47.6062, longitude: -122.3321 }}>
                        <View style={{ backgroundColor: '#fff', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, borderWidth: 2, borderColor: '#059669', flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons name="person-pin-circle" size={18} color="#059669" />
                            <Text style={{ fontSize: 11, fontWeight: '700', color: '#059669', marginLeft: 4 }}>Customer</Text>
                        </View>
                    </Marker>
                </MapView>
            </View>

            <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
                {/* ── Header ── */}
                <View style={styles.header}>
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <MaterialIcons name="chevron-left" size={28} color="#111827" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.moreButton}>
                        <MaterialIcons name="my-location" size={24} color="#111827" />
                    </TouchableOpacity>
                </View>

                {/* ── Scrollable Sheet ── */}
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.sheetContainer}>

                        {/* ── Header Address (Like Ride Share) ── */}
                        <View style={{ marginBottom: 24 }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                                <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827', flex: 1 }}>{address}</Text>
                                <View style={{ backgroundColor: jobStatus === 'completed' ? '#10B981' : jobStatus === 'in-progress' ? '#F59E0B' : '#EFF6FF', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginLeft: 12 }}>
                                    <Text style={{ fontSize: 11, fontWeight: '800', color: jobStatus === 'completed' || jobStatus === 'in-progress' ? '#fff' : '#2563EB' }}>
                                        {jobStatus === 'completed' ? 'COMPLETED' : jobStatus === 'in-progress' ? 'IN PROGRESS' : 'PENDING'}
                                    </Text>
                                </View>
                            </View>
                            <Text style={{ fontSize: 13, color: '#6B7280', fontWeight: '500' }}>{serviceType} • 2.4 km away (Est. 8 min)</Text>
                        </View>

                        {/* ── Profile Card ── */}
                        <View style={styles.profileCard}>
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarInitials}>{initName}</Text>
                            </View>
                            <View style={styles.profileInfo}>
                                <Text style={{ fontSize: 13, color: '#6B7280', fontWeight: '500', marginBottom: 2 }}>Customer</Text>
                                <Text style={styles.profileName}>{customerName}</Text>
                            </View>
                        </View>

                        {/* ── Info Box ── */}
                        <View style={styles.infoBox}>
                            <View style={styles.infoRow}>
                                <View style={styles.iconBox}><MaterialIcons name="calendar-today" size={16} color="#6B7280" /></View>
                                <View style={styles.infoTextContainer}>
                                    <Text style={styles.infoLabel}>DATE & TIME</Text>
                                    <Text style={styles.infoValue}>Today • {activeJobDetails?.time || '2:00 PM'}</Text>
                                </View>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.infoRow}>
                                <View style={styles.iconBox}><Text style={styles.icon}>💳</Text></View>
                                <View style={styles.infoTextContainer}>
                                    <Text style={styles.infoLabel}>BASE FEE</Text>
                                    <Text style={styles.payoutValue}>{formatCurrency(baseFee)}</Text>
                                </View>
                            </View>
                        </View>

                        {/* ── Description of Work ── */}
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Description of Work</Text>
                        </View>
                        <Text style={styles.descriptionText}>
                            Water dripping beneath the master kitchen sink cupboard. Requires checking the seal and replacing standard trap or pipeline components if split.
                        </Text>
                    </View>
                </ScrollView>

                {/* ── Bottom Action Bar ── */}
                <View style={styles.bottomBar}>
                    {jobStatus === 'pending' ? (
                        <>
                            <TouchableOpacity style={[styles.chatButton, { backgroundColor: '#fff', borderWidth: 1, borderColor: '#D1D5DB' }]} onPress={() => router.push('/(provider)/chat')}>
                                <MaterialIcons name="chat-bubble-outline" size={20} color="#4B5563" style={{ marginRight: 8 }} />
                                <Text style={[styles.chatButtonText, { color: '#4B5563' }]}>Message Customer</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.chatButton, { backgroundColor: '#2563EB', marginTop: 8 }]} onPress={() => setJobStatus('in-progress')}>
                                <MaterialIcons name="play-arrow" size={20} color="#fff" style={{ marginRight: 8 }} />
                                <Text style={styles.chatButtonText}>Start Job</Text>
                            </TouchableOpacity>
                        </>
                    ) : jobStatus === 'in-progress' ? (
                        <>
                            <View style={{ padding: 12, backgroundColor: '#EFF6FF', borderRadius: 8, marginBottom: 8, alignItems: 'center' }}>
                                <Text style={{ color: '#2563EB', fontWeight: 'bold' }}>Job is currently in progress</Text>
                            </View>
                            <TouchableOpacity style={[styles.chatButton, { backgroundColor: '#2563EB' }]} onPress={() => setShowInvoiceModal(true)}>
                                <MaterialIcons name="check-circle" size={20} color="#fff" style={{ marginRight: 8 }} />
                                <Text style={styles.chatButtonText}>Complete Job</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <View style={{ padding: 16, backgroundColor: '#ECFDF5', borderRadius: 8, alignItems: 'center' }}>
                            <MaterialIcons name="check-circle" size={28} color="#059669" style={{ marginBottom: 4 }} />
                            <Text style={{ color: '#059669', fontWeight: 'bold' }}>Job Completed & Billed</Text>
                        </View>
                    )}
                </View>

                {/* ── Invoice Modal ── */}
                {showInvoiceModal && (
                    <View style={StyleSheet.absoluteFill}>
                        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 }}>
                            <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Finalize Job</Text>
                                    <TouchableOpacity onPress={() => setShowInvoiceModal(false)}>
                                        <MaterialIcons name="close" size={24} color="#6B7280" />
                                    </TouchableOpacity>
                                </View>

                                <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 }}>Material Costs (Rs)</Text>
                                <TextInput
                                    style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 20 }}
                                    placeholder="e.g. 1500 (Optional)"
                                    keyboardType="numeric"
                                    value={materialCost}
                                    onChangeText={setMaterialCost}
                                />

                                <View style={{ backgroundColor: '#F3F4F6', padding: 16, borderRadius: 8, marginBottom: 24 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                                        <Text style={{ color: '#4B5563' }}>Base Fee</Text>
                                        <Text style={{ fontWeight: '500' }}>{formatCurrency(baseFee)}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                                        <Text style={{ color: '#4B5563' }}>Extra Materials</Text>
                                        <Text style={{ fontWeight: '500' }}>Rs {Number(materialCost) ? Number(materialCost).toLocaleString('en-US', { minimumFractionDigits: 2 }) : '0.00'}</Text>
                                    </View>
                                    <View style={{ height: 1, backgroundColor: '#D1D5DB', marginBottom: 12 }} />
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#111827' }}>Total Invoice</Text>
                                        <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#2563EB' }}>{formatCurrency(baseFee + (Number(materialCost) || 0))}</Text>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={{ backgroundColor: '#2563EB', padding: 16, borderRadius: 8, alignItems: 'center' }}
                                    onPress={async () => {
                                        const total = baseFee + (Number(materialCost) || 0);
                                        await supabase.from('invoices').insert({
                                            customer_name: customerName,
                                            service_type: serviceType,
                                            base_fee: baseFee,
                                            material_cost: Number(materialCost) || 0,
                                            total_amount: total,
                                            status: 'pending'
                                        });
                                        setShowInvoiceModal(false);
                                        setJobStatus('completed');
                                    }}
                                >
                                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Send Bill to Customer</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#fff',
    },
    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 14,
        zIndex: 10,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    moreButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Scroll Content
    scrollContent: {
        paddingTop: '60%',
    },
    sheetContainer: {
        backgroundColor: '#FAFAFA',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        paddingTop: 32,
        paddingBottom: 40,
        minHeight: 700,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },

    // Profile Card
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    avatarPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#FDE68A',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    avatarInitials: {
        color: '#D97706',
        fontSize: 18,
        fontWeight: '700',
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 4,
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starIcon: {
        color: '#F59E0B',
        fontSize: 14,
        marginRight: 4,
    },
    ratingText: {
        color: '#6B7280',
        fontSize: 13,
        fontWeight: '500',
    },

    // Info Box
    infoBox: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 4,
        elevation: 1,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        marginTop: 2,
    },
    icon: {
        fontSize: 16,
    },
    infoTextContainer: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#9CA3AF',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    infoValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
        lineHeight: 22,
    },
    payoutValue: {
        fontSize: 24,
        fontWeight: '800',
        color: '#2563EB',
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 16,
        marginLeft: 48,
    },

    // Section Titles
    sectionHeader: {
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
    },

    // Map Configuration
    mapTouchableContainer: {
        height: 120,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20,
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapOverlay: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    mapOverlayText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#2563EB',
    },

    // Description
    descriptionText: {
        fontSize: 15,
        color: '#6B7280',
        lineHeight: 24,
    },

    // Bottom Action Bar
    bottomBar: {
        flexDirection: 'column',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        gap: 12,
    },
    chatButton: {
        backgroundColor: '#2563EB',
        borderRadius: 12,
        paddingVertical: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 4,
    },
    chatButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
});
