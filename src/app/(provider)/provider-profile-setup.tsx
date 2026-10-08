import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Hero Section Component ───
function ProfileHeroSection({ profileImage, pickImage, onBack }: { profileImage: string | null, pickImage: () => void, onBack: () => void }) {
    return (
        <View style={styles.blueHeaderSection}>
            <SafeAreaView edges={['top']} style={{ flex: 0 }} />
            <View style={styles.headerTop}>
                <TouchableOpacity style={{ padding: 8 }} onPress={onBack}>
                    <MaterialIcons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitleBlue}>My Account</Text>
                <View style={{ width: 40 }} />
            </View>

            <View style={styles.uploadContainer}>
                <TouchableOpacity style={styles.uploadCircle} onPress={pickImage}>
                    {profileImage ? (
                        <Image source={{ uri: profileImage }} style={styles.profileImage} />
                    ) : (
                        <MaterialIcons name="person" size={50} color="#2563EB" />
                    )}
                    <View style={styles.editIconBadge}>
                        <MaterialIcons name="edit" size={14} color="#111827" />
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// ─── Main Screen ───
export default function ProviderProfileSetupScreen() {
    const router = useRouter();
    const [serviceType, setServiceType] = useState('Plumbing');
    const [profileImage, setProfileImage] = useState<string | null>(null);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    return (
        <View style={styles.screen}>
            <ProfileHeroSection
                profileImage={profileImage}
                pickImage={pickImage}
                onBack={() => router.back()}
            />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* ── Personal Info Label ── */}
                    <Text style={styles.sectionSimpleTitle}>Personal Info</Text>

                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <View style={styles.infoIconBox}>
                                <MaterialIcons name="person-outline" size={22} color="#4B5563" />
                            </View>
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabelText}>Your name</Text>
                                <Text style={styles.infoValueText}>Judith Glavour</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
                        </View>

                        <View style={styles.infoRow}>
                            <View style={styles.infoIconBox}>
                                <MaterialIcons name="phone" size={22} color="#4B5563" />
                            </View>
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabelText}>Phone Number</Text>
                                <Text style={styles.infoValueText}>+234 458 2548</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
                        </View>

                        <View style={styles.infoRow}>
                            <View style={styles.infoIconBox}>
                                <MaterialIcons name="mail-outline" size={22} color="#4B5563" />
                            </View>
                            <View style={styles.infoTextContainer}>
                                <Text style={styles.infoLabelText}>Email Address</Text>
                                <Text style={styles.infoValueText}>Judithglavour@gmail.com</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
                        </View>
                    </View>

                    {/* ── Form Inputs (Professional Details) ── */}
                    {/* ── Professional Info Label ── */}
                    <Text style={[styles.sectionSimpleTitle, { marginTop: 16 }]}>Professional Info</Text>

                    {/* ── Professional Profile Card ── */}
                    <View style={styles.proProfileCard}>
                        {/* Service Category */}
                        <View style={styles.fieldSection}>
                            <Text style={styles.fieldLabel}>Service Category / Types</Text>
                            <View style={styles.pillRow}>
                                {['Plumbing', 'Electrical', 'Cleaning', 'Carpentry'].map((type) => {
                                    const isActive = serviceType === type;
                                    return (
                                        <TouchableOpacity
                                            key={type}
                                            style={[styles.pill, isActive && styles.pillActive]}
                                            onPress={() => setServiceType(type)}
                                        >
                                            <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                                                {type}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>

                        {/* Experience & Hourly Rate Row */}
                        <View style={styles.twoColRow}>
                            <View style={[styles.fieldSection, { flex: 1, marginRight: 10 }]}>
                                <View style={styles.inputBox}>
                                    <View style={styles.inputBoxHeader}>
                                        <MaterialIcons name="military-tech" size={16} color="#F59E0B" />
                                        <Text style={styles.inputBoxTitle}>EXPERIENCE</Text>
                                    </View>
                                    <View style={styles.inputRow}>
                                        <TextInput style={styles.inputMainText} keyboardType="numeric" placeholder="5" placeholderTextColor="#111827" />
                                        <Text style={styles.inputSuffix}>Yrs</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={[styles.fieldSection, { flex: 1 }]}>
                                <View style={styles.inputBox}>
                                    <View style={styles.inputBoxHeader}>
                                        <MaterialIcons name="local-offer" size={16} color="#10B981" />
                                        <Text style={styles.inputBoxTitle}>HOURLY RATE</Text>
                                    </View>
                                    <View style={styles.inputRow}>
                                        <Text style={styles.inputPrefix}>LKR</Text>
                                        <TextInput style={styles.inputMainText} keyboardType="numeric" placeholder="1,500" placeholderTextColor="#111827" />
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Service Area */}
                        <View style={styles.fieldSection}>
                            <View style={styles.inputBox}>
                                <View style={styles.inputBoxHeader}>
                                    <MaterialIcons name="location-pin" size={16} color="#EF4444" />
                                    <Text style={styles.inputBoxTitle}>SERVICE AREA / COVERAGE</Text>
                                </View>
                                <TextInput style={styles.inputMainText} placeholder="Colombo & Western Province" placeholderTextColor="#111827" />
                            </View>
                        </View>

                        {/* About & Bio */}
                        <View style={styles.fieldSection}>
                            <View style={styles.inputBox}>
                                <View style={[styles.inputBoxHeader, { justifyContent: 'space-between' }]}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <MaterialIcons name="notes" size={16} color="#3B82F6" />
                                        <Text style={styles.inputBoxTitle}>ABOUT & BIO</Text>
                                    </View>
                                    <Text style={styles.charCount}>68/200</Text>
                                </View>
                                <TextInput
                                    style={[styles.inputMainText, { minHeight: 60, textAlignVertical: 'top' }]}
                                    multiline
                                    placeholder="Experienced maintenance technician with 5+ years of quality plumbing service."
                                    placeholderTextColor="#111827"
                                />
                            </View>
                        </View>
                    </View>

                    {/* ── Save Button ── */}
                    <TouchableOpacity style={styles.saveBtn}>
                        <MaterialIcons name="save" size={20} color="#fff" />
                        <Text style={styles.saveBtnText}>Save Changes</Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

// ─── Styles ───
const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F5F7FA', // Soft background to match typical lists
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
        paddingTop: 55, // Extra space for overlapping hero
    },

    // Hero Section Styles
    blueHeaderSection: {
        backgroundColor: '#065FCE',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        paddingBottom: 45,
        zIndex: 10,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 14,
    },
    headerTitleBlue: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    uploadContainer: {
        position: 'absolute',
        bottom: -40,
        alignSelf: 'center',
        zIndex: 20,
    },
    uploadCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
        overflow: 'hidden',
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    editIconBadge: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        backgroundColor: '#fff',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },

    // Info Labels (Text dividers)
    sectionSimpleTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#4B5563',
        marginBottom: 8,
        marginLeft: 4,
    },

    // Person Info Card
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingVertical: 4,
        paddingHorizontal: 12,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
        elevation: 1,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    infoIconBox: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginRight: 16,
        backgroundColor: '#FAFAFA'
    },
    infoTextContainer: {
        flex: 1,
    },
    infoLabelText: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 2,
    },
    infoValueText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#111827',
    },

    // Professional Card
    proProfileCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.04,
        shadowRadius: 3,
        elevation: 1,
    },
    proHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    proIconBox: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    proTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#111827',
        flex: 1,
    },
    activeBadge: {
        backgroundColor: '#ECFDF5',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    activeBadgeText: {
        color: '#10B981',
        fontSize: 12,
        fontWeight: '700',
    },
    fieldSection: {
        marginBottom: 16,
    },
    fieldLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#374151',
        marginBottom: 8,
    },
    pillRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    pill: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
    },
    pillActive: {
        backgroundColor: '#2563EB',
    },
    pillText: {
        color: '#4B5563',
        fontSize: 14,
        fontWeight: '600',
    },
    pillTextActive: {
        color: '#fff',
    },
    twoColRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputBox: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 12,
        backgroundColor: '#fff',
    },
    inputBoxHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    inputBoxTitle: {
        fontSize: 11,
        fontWeight: '700',
        color: '#6B7280',
        marginLeft: 6,
        letterSpacing: 0.5,
    },
    charCount: {
        fontSize: 11,
        color: '#9CA3AF',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputMainText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
        flex: 1,
        padding: 0,
    },
    inputSuffix: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
        marginLeft: 4,
    },
    inputPrefix: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '600',
        marginRight: 6,
    },
    saveBtn: {
        backgroundColor: '#2563EB',
        borderRadius: 16,
        paddingVertical: 18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
        marginBottom: 10,
    },
    saveBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
        marginLeft: 8,
    }
});