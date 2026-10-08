import { Feather, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Linking, Modal, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProviderHelpScreen() {
    const router = useRouter();

    const [expandedIndex, setExpandedIndex] = useState<number | null>(0); // 0 is initially open
    const [isReportModalVisible, setReportModalVisible] = useState(false);
    const [isSuccessModalVisible, setSuccessModalVisible] = useState(false);
    const [selectedProblem, setSelectedProblem] = useState('Payment issue');
    const [problemDetails, setProblemDetails] = useState('');
    const [screenshotUri, setScreenshotUri] = useState<string | null>(null);

    const handleAttachScreenshot = () => {
        Alert.alert(
            "Attach Screenshot",
            "Would you like to take a photo or select from your gallery?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Gallery", onPress: openGallery },
                { text: "Camera", onPress: openCamera }
            ]
        );
    };

    const openCamera = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert("Permission required", "Camera permission is required to take a screenshot.");
            return;
        }
        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.7,
        });
        if (!result.canceled) setScreenshotUri(result.assets[0].uri);
    };

    const openGallery = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert("Permission required", "Gallery permission is required to select a screenshot.");
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 0.7,
        });
        if (!result.canceled) setScreenshotUri(result.assets[0].uri);
    };

    const faqs = [
        {
            q: "How do I get paid?",
            a: "Your earnings go to your payout method on the schedule you chose. You can change both in Settings under Payments."
        },
        {
            q: "How do I change my working hours?",
            a: "Go to Settings > Work Preferences to update your availability schedule."
        },
        {
            q: "What if a customer cancels?",
            a: "You will be notified immediately. Depending on timing, cancellation fees may apply automatically."
        },
        {
            q: "How are job requests sent to me?",
            a: "Requests appear instantly in your new requests panel with sound notifications based on your settings."
        },
        {
            q: "How do I update my service area?",
            a: "You can modify your service coverage boundary directly from the exact location map in Settings."
        }
    ];

    return (
        <View style={styles.screen}>
            <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

            <View style={styles.heroBackground}>
                <SafeAreaView edges={['top']} style={{ flex: 1 }}>
                    <View style={styles.headerTop}>
                        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                            <MaterialIcons name="chevron-left" size={28} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitleBase}>Help &{'\n'}support</Text>
                        <View style={{ width: 44 }} />
                    </View>
                </SafeAreaView>
            </View>

            {/* ── Contact Card Overlap (Extracted from scroll to avoid clipping) ── */}
            <View style={styles.contactCardWrapper}>
                <View style={styles.contactCard}>
                    <Text style={styles.cardHeaderTitle}>How can we help?</Text>
                    <Text style={styles.cardHeaderSubtitle}>Talk to our team, we reply fast.</Text>

                    <View style={styles.actionRow}>
                        <TouchableOpacity style={styles.actionItem} onPress={() => Linking.openURL('tel:+94771234567')}>
                            <View style={styles.callIconBox}>
                                <MaterialIcons name="phone" size={20} color="#2563EB" />
                            </View>
                            <Text style={styles.actionLabel}>Call us</Text>
                            <Text style={styles.actionValue}>+94 77 123 4567</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionItem} onPress={() => Linking.openURL('mailto:support@fixhub.com')}>
                            <View style={styles.emailIconBox}>
                                <MaterialIcons name="mail" size={20} color="#D97706" />
                            </View>
                            <Text style={styles.actionLabel}>Email</Text>
                            <Text style={styles.actionValue}>support@fixhub.com</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                <Text style={styles.sectionLabel}>Common questions</Text>

                <View style={styles.faqCard}>
                    {faqs.map((faq, index) => {
                        const isOpen = expandedIndex === index;
                        return (
                            <View key={index} style={[styles.faqItem, index === faqs.length - 1 && { borderBottomWidth: 0 }]}>
                                <TouchableOpacity
                                    style={styles.faqQuestionRow}
                                    onPress={() => setExpandedIndex(isOpen ? null : index)}
                                    activeOpacity={0.7}
                                >
                                    <Text style={styles.faqQuestion}>{faq.q}</Text>
                                    <MaterialIcons
                                        name={isOpen ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                                        size={24}
                                        color="#64748B"
                                    />
                                </TouchableOpacity>
                                {isOpen && (
                                    <Text style={styles.faqAnswer}>{faq.a}</Text>
                                )}
                            </View>
                        );
                    })}
                </View>

                {/* ── Report Problem ── */}
                <TouchableOpacity style={styles.reportBtn} onPress={() => setReportModalVisible(true)}>
                    <MaterialIcons name="report-problem" size={20} color="#DC2626" />
                    <Text style={styles.reportBtnText}>Report a problem</Text>
                </TouchableOpacity>

                <Text style={styles.supportHoursText}>Support hours: 8 AM - 8 PM, every day</Text>
                <View style={{ height: 40 }} />
            </ScrollView>

            {/* ── Report Modal Bottom Sheet ── */}
            <Modal visible={isReportModalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <TouchableOpacity style={{ flex: 1 }} onPress={() => setReportModalVisible(false)} />

                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                        <View style={styles.bottomSheet}>
                            <View style={styles.dragHandle} />

                            <View style={styles.sheetHeader}>
                                <Text style={styles.sheetTitle}>Report a problem</Text>
                                <TouchableOpacity style={styles.closeCircle} onPress={() => setReportModalVisible(false)}>
                                    <Feather name="x" size={20} color="#0F172A" />
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.formLabel}>What's the problem?</Text>
                            <View style={styles.pillContainer}>
                                {['Payment issue', 'Job or customer', 'App not working', 'Other'].map(issue => {
                                    const active = selectedProblem === issue;
                                    return (
                                        <TouchableOpacity
                                            key={issue}
                                            style={[styles.issuePill, active && styles.issuePillActive]}
                                            onPress={() => setSelectedProblem(issue)}
                                        >
                                            {active && <Feather name="check" size={14} color="#fff" style={{ marginRight: 6 }} />}
                                            <Text style={[styles.issuePillText, active && styles.issuePillTextActive]}>{issue}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                            <Text style={styles.formLabel}>Tell us more</Text>
                            <View style={styles.textAreaContainer}>
                                <TextInput
                                    style={styles.textArea}
                                    placeholder="Describe what happened..."
                                    placeholderTextColor="#9CA3AF"
                                    multiline
                                    maxLength={300}
                                    value={problemDetails}
                                    onChangeText={setProblemDetails}
                                    textAlignVertical="top"
                                />
                                <Text style={styles.charCount}>{problemDetails.length}/300</Text>
                            </View>

                            {screenshotUri ? (
                                <View style={styles.imagePreviewContainer}>
                                    <Image source={{ uri: screenshotUri }} style={styles.imagePreview} />
                                    <TouchableOpacity style={styles.removeImageBtn} onPress={() => setScreenshotUri(null)}>
                                        <Feather name="x" size={16} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TouchableOpacity style={styles.attachBtn} onPress={handleAttachScreenshot}>
                                    <Feather name="image" size={16} color="#0F172A" />
                                    <Text style={styles.attachBtnText}>Attach screenshot <Text style={{ color: '#9CA3AF', fontWeight: '500' }}>(optional)</Text></Text>
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity
                                style={[styles.submitBtn, !problemDetails.trim() && styles.submitBtnDisabled]}
                                disabled={!problemDetails.trim()}
                                onPress={() => {
                                    setReportModalVisible(false);
                                    setSuccessModalVisible(true);
                                    setScreenshotUri(null);
                                    setProblemDetails('');
                                }}
                            >
                                <Text style={styles.submitBtnText}>Submit</Text>
                            </TouchableOpacity>

                            <SafeAreaView edges={['bottom']} />
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </Modal>

            {/* ── Success Modal ── */}
            <Modal visible={isSuccessModalVisible} animationType="fade" transparent>
                <View style={styles.modalOverlayCentered}>
                    <View style={styles.successCard}>
                        <View style={styles.successIconOuter}>
                            <View style={styles.successIconInner}>
                                <Feather name="check" size={32} color="#fff" />
                            </View>
                        </View>
                        <Text style={styles.successTitle}>Report sent</Text>
                        <Text style={styles.successSubtitle}>
                            Thanks for letting us know. Our team will get back to you within 24 hours.
                        </Text>
                        <View style={styles.referencePill}>
                            <Text style={styles.referenceText}>Reference: <Text style={{ fontWeight: '800' }}>#HS-20481</Text></Text>
                        </View>
                        <TouchableOpacity style={styles.doneBtn} onPress={() => setSuccessModalVisible(false)}>
                            <Text style={styles.doneBtnText}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },

    // Header
    heroBackground: {
        backgroundColor: '#0F172A',
        height: 180, // Taller to accommodate multiline title and overlap
        borderBottomLeftRadius: 36,
        borderBottomRightRadius: 36,
        paddingHorizontal: 20,
    },
    headerTop: {
        flexDirection: 'row',
        paddingTop: Platform.OS === 'ios' ? 0 : 20,
        paddingBottom: 20,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#1E293B',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 4,
    },
    headerTitleBase: {
        flex: 1,
        fontSize: 24, // Larger title per design
        fontWeight: '800',
        color: '#fff',
        marginLeft: 16,
        lineHeight: 30,
    },

    // Contact Card
    contactCardWrapper: {
        marginTop: -65,
        marginBottom: 24,
        zIndex: 10,
        elevation: 10,
        paddingHorizontal: 20,
    },
    contactCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
        elevation: 2,
    },
    cardHeaderTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 4,
    },
    cardHeaderSubtitle: {
        fontSize: 14,
        fontWeight: '500',
        color: '#64748B',
        marginBottom: 24,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    actionItem: {
        alignItems: 'center',
    },
    callIconBox: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    emailIconBox: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FEF3C7',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    actionLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0F172A',
        textAlign: 'center',
    },
    actionValue: {
        fontSize: 12,
        fontWeight: '500',
        color: '#64748B',
        marginTop: 2,
    },

    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },

    sectionLabel: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 16,
    },

    // FAQ Block
    faqCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    faqItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        paddingVertical: 18,
    },
    faqQuestionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    faqQuestion: {
        flex: 1,
        fontSize: 15,
        fontWeight: '800',
        color: '#0F172A',
        paddingRight: 16,
    },
    faqAnswer: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: '500',
        color: '#475569',
        lineHeight: 22,
    },

    // Report
    reportBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FEF2F2',
        borderWidth: 1,
        borderColor: '#FECACA',
        borderRadius: 16,
        paddingVertical: 18,
        marginBottom: 16,
    },
    reportBtnText: {
        marginLeft: 8,
        fontSize: 16,
        fontWeight: '800',
        color: '#DC2626',
    },
    supportHoursText: {
        textAlign: 'center',
        fontSize: 13,
        fontWeight: '500',
        color: '#9CA3AF',
    },

    // Bottom Sheet
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    bottomSheet: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: 24,
    },
    dragHandle: {
        width: 40,
        height: 5,
        backgroundColor: '#E2E8F0',
        borderRadius: 3,
        alignSelf: 'center',
        marginBottom: 20,
    },
    sheetHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    sheetTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#0F172A',
    },
    closeCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    formLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#475569',
        marginBottom: 12,
    },
    pillContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 24,
    },
    issuePill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    issuePillActive: {
        backgroundColor: '#2563EB',
    },
    issuePillText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0F172A',
    },
    issuePillTextActive: {
        color: '#fff',
    },
    textAreaContainer: {
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 16,
        padding: 16,
        height: 120,
        marginBottom: 20,
    },
    textArea: {
        flex: 1,
        fontSize: 15,
        color: '#0F172A',
    },
    charCount: {
        fontSize: 12,
        color: '#9CA3AF',
        alignSelf: 'flex-end',
        marginTop: 8,
    },
    attachBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: '#CBD5E1',
        borderStyle: 'dashed',
        borderRadius: 16,
        paddingVertical: 18,
        marginBottom: 24,
    },
    attachBtnText: {
        marginLeft: 8,
        fontSize: 15,
        fontWeight: '700',
        color: '#0F172A',
    },
    imagePreviewContainer: {
        height: 120,
        marginBottom: 24,
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#CBD5E1',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
    },
    removeImageBtn: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: 'rgba(15, 23, 42, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    submitBtn: {
        backgroundColor: '#2563EB',
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
    },
    submitBtnDisabled: {
        backgroundColor: '#93C5FD',
    },
    submitBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
    },

    // Success Modal
    modalOverlayCentered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 24,
    },
    successCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        width: '100%',
    },
    successIconOuter: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#D1FAE5', // Light green shadow/glow
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    successIconInner: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#10B981', // Emerald green
        justifyContent: 'center',
        alignItems: 'center',
    },
    successTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 12,
        textAlign: 'center',
    },
    successSubtitle: {
        fontSize: 15,
        fontWeight: '500',
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    referencePill: {
        backgroundColor: '#F1F5F9', // light grey pill
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        marginBottom: 32,
    },
    referenceText: {
        fontSize: 14,
        color: '#0F172A',
        fontWeight: '600',
    },
    doneBtn: {
        backgroundColor: '#2563EB',
        borderRadius: 16,
        paddingVertical: 16,
        alignItems: 'center',
        width: '100%',
    },
    doneBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
    }
});
