import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackButton from '../../components/BackButton';
import { supabase } from '../../lib/supabase';

export default function RateReviewScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const bookingId = params.bookingId as string | undefined;

    const [booking, setBooking] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(5);
    const [selectedTags, setSelectedTags] = useState<string[]>(['Punctual', 'Quality Work']);
    const [reviewText, setReviewText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const availableTags = [
        'Punctual',
        'Quality Work',
        'Fair Price',
        'Polite & Friendly',
        'Left Space Clean',
        'Professional Tools',
    ];

    const ratingDescriptions = [
        'Terrible',
        'Poor',
        'Average',
        'Very Good',
        'Exceptional & Outstanding',
    ];

    useEffect(() => {
        if (bookingId) {
            loadBooking();
        } else {
            setLoading(false);
        }
    }, [bookingId]);

    async function loadBooking() {
        setLoading(true);
        const { data } = await supabase
            .from('bookings')
            .select(`
                id,
                service_date,
                providers (
                    service_type,
                    users ( name )
                )
            `)
            .eq('id', bookingId)
            .maybeSingle();

        if (data) {
            setBooking(data);
        }
        setLoading(false);
    }

    const bData: any = booking;
    const prov: any = Array.isArray(bData?.providers) ? bData?.providers[0] : bData?.providers;
    const usr: any = Array.isArray(prov?.users) ? prov?.users[0] : prov?.users;

    const providerName = usr?.name ?? 'Assigned Professional';
    const serviceType = prov?.service_type ?? 'Home Repair';

    const toggleTag = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter((t) => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);

        if (bookingId) {
            await supabase
                .from('bookings')
                .update({ status: 'Completed' })
                .eq('id', bookingId);
        }

        setTimeout(() => {
            setSubmitting(false);
            Alert.alert(
                'Review Submitted',
                `Thank you! Your feedback helps the FixHub community find top verified professionals.`,
                [
                    {
                        text: 'Done',
                        onPress: () => router.push('/(customer)/bookings'),
                    },
                ]
            );
        }, 600);
    };

    if (loading) {
        return (
            <View style={styles.centerScreen}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.loadingText}>Loading booking details...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.screen}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

            {/* ── Royal Blue Curved Hero ── */}
            <View style={styles.heroBackground}>
                <SafeAreaView edges={['top']} style={styles.safeArea}>
                    <View style={styles.headerTop}>
                        <BackButton color="#FFFFFF" />
                        <Text style={styles.headerTitle}>Rate & Review</Text>
                        <View style={{ width: 40 }} />
                    </View>
                </SafeAreaView>

                <View style={styles.heroInfoBox}>
                    <Text style={styles.heroGreeting}>How was your experience?</Text>
                    <Text style={styles.heroSubtitle}>Your honest review helps keep FixHub standards high</Text>
                </View>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Provider Card ── */}
                <View style={styles.card}>
                    <View style={styles.providerRow}>
                        <View style={styles.avatarCircle}>
                            <MaterialIcons name="person" size={26} color="#2563EB" />
                        </View>
                        <View style={styles.providerInfo}>
                            <Text style={styles.providerName}>{providerName}</Text>
                            <View style={styles.servicePill}>
                                <Text style={styles.servicePillText}>{serviceType}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* ── Star Rating Card ── */}
                <View style={styles.card}>
                    <Text style={styles.cardHeaderTitle}>Rate Service Quality</Text>

                    <View style={styles.starRow}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity
                                key={star}
                                onPress={() => setRating(star)}
                                activeOpacity={0.7}
                                style={styles.starTouch}
                            >
                                <MaterialIcons
                                    name={star <= rating ? 'star' : 'star-border'}
                                    size={38}
                                    color="#F59E0B"
                                />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.ratingDescription}>
                        {ratingDescriptions[rating - 1]}
                    </Text>
                </View>

                {/* ── Quick Compliments Card ── */}
                <View style={styles.card}>
                    <Text style={styles.cardHeaderTitle}>What stood out?</Text>

                    <View style={styles.tagsContainer}>
                        {availableTags.map((tag) => {
                            const isSelected = selectedTags.includes(tag);
                            return (
                                <TouchableOpacity
                                    key={tag}
                                    style={[styles.tagChip, isSelected && styles.tagChipActive]}
                                    onPress={() => toggleTag(tag)}
                                    activeOpacity={0.7}
                                >
                                    <MaterialIcons
                                        name={isSelected ? 'check' : 'add'}
                                        size={14}
                                        color={isSelected ? '#2563EB' : '#64748B'}
                                    />
                                    <Text style={[styles.tagText, isSelected && styles.tagTextActive]}>
                                        {tag}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>

                {/* ── Detailed Review Input Card ── */}
                <View style={styles.card}>
                    <Text style={styles.cardHeaderTitle}>Detailed Feedback</Text>
                    <TextInput
                        style={styles.reviewInput}
                        placeholder="Share details about the work done, punctuality, and overall experience..."
                        placeholderTextColor="#94A3B8"
                        multiline
                        numberOfLines={4}
                        value={reviewText}
                        onChangeText={setReviewText}
                    />
                </View>

                {/* ── Submit Button ── */}
                <TouchableOpacity
                    style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
                    onPress={handleSubmit}
                    disabled={submitting}
                    activeOpacity={0.85}
                >
                    {submitting ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <>
                            <MaterialIcons name="send" size={18} color="#FFFFFF" />
                            <Text style={styles.submitBtnText}>Submit Review</Text>
                        </>
                    )}
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#EEF2F6', // Crisp Slate-Grey canvas
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 40,
    },
    centerScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EEF2F6',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
    },

    // ── Royal Blue Hero ──
    heroBackground: {
        backgroundColor: '#2563EB',
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
    heroInfoBox: {
        alignItems: 'center',
        marginTop: 8,
    },
    heroGreeting: {
        fontSize: 22,
        fontWeight: '800',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    heroSubtitle: {
        fontSize: 13,
        color: '#BFDBFE',
        textAlign: 'center',
    },

    // ── Cards ──
    card: {
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
        marginBottom: 12,
    },
    providerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    avatarCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#EFF6FF',
        borderWidth: 1.5,
        borderColor: '#DBEAFE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    providerInfo: {
        flex: 1,
    },
    providerName: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 3,
    },
    servicePill: {
        alignSelf: 'flex-start',
        backgroundColor: '#F1F5F9',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    servicePillText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#475569',
    },

    // ── Star Rating ──
    starRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        marginVertical: 10,
    },
    starTouch: {
        padding: 4,
    },
    ratingDescription: {
        textAlign: 'center',
        fontSize: 14,
        fontWeight: '700',
        color: '#D97706',
        marginTop: 4,
    },

    // ── Tags ──
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tagChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        gap: 6,
    },
    tagChipActive: {
        backgroundColor: '#EFF6FF',
        borderColor: '#93C5FD',
    },
    tagText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#64748B',
    },
    tagTextActive: {
        color: '#2563EB',
        fontWeight: '700',
    },

    // ── Input ──
    reviewInput: {
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 14,
        padding: 14,
        fontSize: 14,
        color: '#0F172A',
        minHeight: 100,
        textAlignVertical: 'top',
    },

    // ── Submit Button ──
    submitBtn: {
        backgroundColor: '#2563EB',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 16,
        paddingVertical: 15,
        gap: 8,
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 20,
    },
    submitBtnDisabled: {
        opacity: 0.6,
    },
    submitBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});