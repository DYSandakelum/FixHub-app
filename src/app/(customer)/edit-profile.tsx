import { Feather, MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Modal,
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
import { getUserProfile, updateUserProfile, uploadAvatar } from '../../lib/users';
import { useAuth } from '@/context/auth-context';

export default function EditProfileScreen() {
    const router = useRouter();
    const { user, profile: authProfile, refreshProfile } = useAuth();

    // Personal Info States (Customer)
    const [name, setName] = useState('Judith Glavour');
    const [phone, setPhone] = useState('+94 77 123 4567');
    const [email, setEmail] = useState('Judithglavour@gmail.com');
    const [country, setCountry] = useState('Sri Lanka');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    // Customer Service Preferences (matching exact card styling)
    const [preferredServices, setPreferredServices] = useState<string[]>(['Plumbing']);
    const [propertyType, setPropertyType] = useState('House');
    const [preferredPayment, setPreferredPayment] = useState('Card');
    const [serviceAddress, setServiceAddress] = useState('Colombo & Western Province');
    const [serviceNotes, setServiceNotes] = useState('Gate code is 1234. Please ring the doorbell upon arrival. Watch out for pet dog.');

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Modal state for editing customer fields
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingField, setEditingField] = useState<{
        key: 'name' | 'phone' | 'country' | 'serviceAddress' | 'propertyType' | 'preferredPayment';
        label: string;
        value: string;
    } | null>(null);
    const [modalInputValue, setModalInputValue] = useState('');

    useEffect(() => {
        let isMounted = true;
        const currentUserId = user?.id;
        if (!currentUserId) {
            setLoading(false);
            return;
        }
        if (user.email) setEmail(user.email);
        getUserProfile(currentUserId).then((data) => {
            if (!isMounted) return;
            if (data) {
                if (data.name) setName(data.name);
                if (data.avatar_url) setAvatarUrl(data.avatar_url);
                if (data.phone) setPhone(data.phone);
            } else if (authProfile) {
                if (authProfile.full_name) setName(authProfile.full_name);
                if (authProfile.phone_number) setPhone(authProfile.phone_number);
            }
            setLoading(false);
        });
        return () => {
            isMounted = false;
        };
    }, [user?.id, authProfile]);

    async function handlePickImage() {
        Alert.alert('Profile Photo', 'Choose an option', [
            {
                text: 'Take Photo',
                onPress: async () => {
                    const permission = await ImagePicker.requestCameraPermissionsAsync();
                    if (!permission.granted) {
                        Alert.alert('Permission needed', 'Camera permission is required to take a picture.');
                        return;
                    }
                    const result = await ImagePicker.launchCameraAsync({
                        allowsEditing: true,
                        aspect: [1, 1],
                        quality: 0.7,
                    });
                    if (!result.canceled && result.assets[0]) {
                        uploadPhoto(result.assets[0].uri);
                    }
                },
            },
            {
                text: 'Choose from Gallery',
                onPress: async () => {
                    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
                    if (!permission.granted) {
                        Alert.alert('Permission needed', 'Photo gallery permission is required.');
                        return;
                    }
                    const result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ['images'],
                        allowsEditing: true,
                        aspect: [1, 1],
                        quality: 0.7,
                    });
                    if (!result.canceled && result.assets[0]) {
                        uploadPhoto(result.assets[0].uri);
                    }
                },
            },
            {
                text: 'Remove Photo',
                style: 'destructive',
                onPress: () => setAvatarUrl(null),
            },
            { text: 'Cancel', style: 'cancel' },
        ]);
    }

    async function uploadPhoto(uri: string) {
        if (!user?.id) return;
        setSaving(true);
        const updated = await uploadAvatar(user.id, uri);
        setSaving(false);
        if (updated) {
            setAvatarUrl(updated.avatar_url);
        } else {
            setAvatarUrl(uri);
        }
    }

    function toggleService(service: string) {
        if (preferredServices.includes(service)) {
            if (preferredServices.length === 1) {
                Alert.alert('Selection required', 'At least one preferred service category must be selected.');
                return;
            }
            setPreferredServices(preferredServices.filter((s) => s !== service));
        } else {
            setPreferredServices([...preferredServices, service]);
        }
    }

    function openEditField(
        key: 'name' | 'phone' | 'country' | 'serviceAddress' | 'propertyType' | 'preferredPayment',
        label: string,
        value: string
    ) {
        setEditingField({ key, label, value });
        if (key === 'phone') {
            setModalInputValue(value.replace(/[^0-9]/g, '').slice(0, 10));
        } else {
            setModalInputValue(value);
        }
        setEditModalVisible(true);
    }

    function handleSaveModalField() {
        if (!modalInputValue.trim()) {
            Alert.alert('Required', 'Please enter a valid value.');
            return;
        }

        const trimmed = modalInputValue.trim();
        if (editingField?.key === 'name') {
            setName(trimmed);
        } else if (editingField?.key === 'phone') {
            const digits = trimmed.replace(/[^0-9]/g, '');
            if (digits.length !== 10) {
                Alert.alert('Invalid Phone Number', 'Phone number must be exactly 10 digits.');
                return;
            }
            setPhone(digits);
        } else if (editingField?.key === 'country') {
            setCountry(trimmed);
        } else if (editingField?.key === 'serviceAddress') {
            setServiceAddress(trimmed);
        } else if (editingField?.key === 'propertyType') {
            setPropertyType(trimmed);
        } else if (editingField?.key === 'preferredPayment') {
            setPreferredPayment(trimmed);
        }

        setEditModalVisible(false);
        setEditingField(null);
    }

    async function handleSaveChanges() {
        if (!name.trim()) {
            Alert.alert('Name required', 'Please enter a valid name.');
            return;
        }

        const cleanPhone = phone.trim().replace(/[^0-9]/g, '');
        if (cleanPhone && cleanPhone.length !== 10) {
            Alert.alert('Invalid Phone Number', 'Phone number must be exactly 10 digits.');
            return;
        }

        if (!user?.id) {
            Alert.alert('Error', 'No authenticated user found.');
            return;
        }

        setSaving(true);
        const updated = await updateUserProfile(user.id, {
            name: name.trim(),
            phone: cleanPhone || null,
        });
        setSaving(false);

        if (!updated) {
            Alert.alert('Error', 'Failed to save changes. Please try again.');
            return;
        }

        if (refreshProfile) {
            await refreshProfile();
        }

        Alert.alert('Success', 'Profile changes saved successfully.', [
            { text: 'OK', onPress: () => router.back() },
        ]);
    }

    if (loading) {
        return (
            <View style={styles.centerScreen}>
                <ActivityIndicator size="large" color="#2563EB" />
                <Text style={styles.centerLoadingText}>Loading account details...</Text>
            </View>
        );
    }

    const availableServices = ['Plumbing', 'Electrical', 'Cleaning'];

    return (
        <KeyboardAvoidingView
            style={styles.screen}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <StatusBar barStyle="light-content" backgroundColor="#0F172A" />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Dark Navy Curved Hero Header (Exact Style) ── */}
                <View style={styles.heroSection}>
                    <SafeAreaView edges={['top']} style={styles.safeArea}>
                        <View style={styles.headerTop}>
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => router.back()}
                                activeOpacity={0.7}
                            >
                                <MaterialIcons name="chevron-left" size={26} color="#FFFFFF" />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>My Account</Text>
                            <View style={{ width: 40 }} />
                        </View>
                    </SafeAreaView>

                    {/* Floating Avatar Circle */}
                    <View style={styles.avatarContainer}>
                        <TouchableOpacity
                            onPress={handlePickImage}
                            disabled={saving}
                            activeOpacity={0.85}
                            style={styles.avatarTouchTarget}
                        >
                            <View style={styles.avatarCircle}>
                                {avatarUrl ? (
                                    <Image source={{ uri: avatarUrl }} style={styles.avatarImg} />
                                ) : (
                                    <MaterialIcons name="person" size={54} color="#2563EB" />
                                )}
                            </View>
                            <View style={styles.editPencilBadge}>
                                <MaterialIcons name="edit" size={13} color="#FFFFFF" />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ── Profile Name & Customer Badge ── */}
                <View style={styles.profileOverview}>
                    <Text style={styles.profileDisplayName}>{name}</Text>
                    <View style={styles.pillBadge}>
                        <Text style={styles.pillBadgeText}>FixHub Customer · Verified Member</Text>
                    </View>
                </View>

                {/* ── Section: Personal info ── */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Personal info</Text>
                    <View style={styles.groupedCard}>
                        {/* Name Row */}
                        <TouchableOpacity
                            style={styles.fieldRow}
                            onPress={() => openEditField('name', 'YOUR NAME', name)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.iconBox}>
                                <Feather name="user" size={18} color="#2563EB" />
                            </View>
                            <View style={styles.fieldTextCol}>
                                <Text style={styles.fieldLabelUpper}>YOUR NAME</Text>
                                <Text style={styles.fieldValueText}>{name}</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={20} color="#94A3B8" />
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        {/* Phone Row */}
                        <TouchableOpacity
                            style={styles.fieldRow}
                            onPress={() => openEditField('phone', 'PHONE NUMBER', phone)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.iconBox}>
                                <Feather name="phone" size={18} color="#2563EB" />
                            </View>
                            <View style={styles.fieldTextCol}>
                                <Text style={styles.fieldLabelUpper}>PHONE NUMBER</Text>
                                <Text style={styles.fieldValueText}>{phone}</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={20} color="#94A3B8" />
                        </TouchableOpacity>

                        <View style={styles.divider} />

                        {/* Email Row (Read-Only) */}
                        <View style={styles.fieldRow}>
                            <View style={styles.iconBox}>
                                <Feather name="mail" size={18} color="#2563EB" />
                            </View>
                            <View style={styles.fieldTextCol}>
                                <Text style={styles.fieldLabelUpper}>EMAIL ADDRESS</Text>
                                <Text style={styles.fieldValueText}>{email}</Text>
                            </View>
                            <Feather name="lock" size={16} color="#94A3B8" />
                        </View>

                        <View style={styles.divider} />

                        {/* Country Row */}
                        <TouchableOpacity
                            style={styles.fieldRow}
                            onPress={() => openEditField('country', 'COUNTRY', country)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.iconBox}>
                                <Feather name="globe" size={18} color="#2563EB" />
                            </View>
                            <View style={styles.fieldTextCol}>
                                <Text style={styles.fieldLabelUpper}>COUNTRY</Text>
                                <Text style={styles.fieldValueText}>{country}</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={20} color="#94A3B8" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* ── Section: Service preferences (Customer Details) ── */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Service preferences</Text>
                    <View style={styles.proCard}>
                        {/* Service categories Header */}
                        <View style={styles.categoryHeaderRow}>
                            <Text style={styles.subCategoryTitle}>Frequent service needs</Text>
                            <Text style={styles.categoryHint}>Select all that apply</Text>
                        </View>

                        {/* Chips */}
                        <View style={styles.categoryPillsRow}>
                            {availableServices.map((cat) => {
                                const isSelected = preferredServices.includes(cat);
                                return (
                                    <TouchableOpacity
                                        key={cat}
                                        style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
                                        onPress={() => toggleService(cat)}
                                        activeOpacity={0.8}
                                    >
                                        {isSelected && (
                                            <MaterialIcons name="check" size={15} color="#FFFFFF" style={{ marginRight: 4 }} />
                                        )}
                                        <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextActive]}>
                                            {cat}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>

                        {/* Two-Column: Property Type & Preferred Payment */}
                        <View style={styles.twoColRow}>
                            {/* Property Type */}
                            <TouchableOpacity
                                style={styles.twoColCard}
                                onPress={() => openEditField('propertyType', 'PROPERTY TYPE', propertyType)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.twoColCardHeader}>
                                    <MaterialIcons name="home" size={16} color="#F59E0B" />
                                    <Text style={styles.twoColLabel}>PROPERTY TYPE</Text>
                                </View>
                                <View style={styles.valUnitRow}>
                                    <Text style={styles.twoColValueBold}>{propertyType}</Text>
                                </View>
                            </TouchableOpacity>

                            {/* Preferred Payment */}
                            <TouchableOpacity
                                style={styles.twoColCard}
                                onPress={() => openEditField('preferredPayment', 'PREFERRED PAYMENT', preferredPayment)}
                                activeOpacity={0.7}
                            >
                                <View style={styles.twoColCardHeader}>
                                    <MaterialIcons name="payments" size={15} color="#10B981" />
                                    <Text style={styles.twoColLabel}>PAYMENT METHOD</Text>
                                </View>
                                <View style={styles.valUnitRow}>
                                    <Text style={styles.twoColValueBold}>{preferredPayment}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                        {/* Default Service Address */}
                        <TouchableOpacity
                            style={styles.serviceAreaCard}
                            onPress={() => openEditField('serviceAddress', 'SERVICE ADDRESS', serviceAddress)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.twoColCardHeader}>
                                <MaterialIcons name="location-pin" size={16} color="#EF4444" />
                                <Text style={styles.twoColLabel}>DEFAULT SERVICE ADDRESS</Text>
                            </View>
                            <View style={styles.serviceAreaValueRow}>
                                <Text style={styles.serviceAreaText}>{serviceAddress}</Text>
                                <MaterialIcons name="chevron-right" size={20} color="#94A3B8" />
                            </View>
                        </TouchableOpacity>

                        {/* Service Notes / Instructions */}
                        <View style={styles.bioCard}>
                            <View style={styles.bioHeaderRow}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                                    <MaterialIcons name="notes" size={16} color="#64748B" />
                                    <Text style={styles.twoColLabel}>SERVICE NOTES / INSTRUCTIONS</Text>
                                </View>
                                <Text style={styles.bioCounter}>{serviceNotes.length}/200</Text>
                            </View>
                            <TextInput
                                style={styles.bioInput}
                                value={serviceNotes}
                                onChangeText={(text) => {
                                    if (text.length <= 200) setServiceNotes(text);
                                }}
                                multiline
                                numberOfLines={3}
                                placeholder="Special instructions for visiting service technicians..."
                                placeholderTextColor="#94A3B8"
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* ── Bottom Sticky Save Button Bar ── */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
                    onPress={handleSaveChanges}
                    disabled={saving}
                    activeOpacity={0.85}
                >
                    {saving ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                        <Text style={styles.saveBtnText}>Save changes</Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* ── Modal for Field Editing ── */}
            <Modal
                visible={editModalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setEditModalVisible(false)}
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalCard}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Edit {editingField?.label}</Text>
                            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
                                <MaterialIcons name="close" size={22} color="#64748B" />
                            </TouchableOpacity>
                        </View>

                        <TextInput
                            style={styles.modalInput}
                            value={modalInputValue}
                            onChangeText={(text) => {
                                if (editingField?.key === 'phone') {
                                    const digits = text.replace(/[^0-9]/g, '').slice(0, 10);
                                    setModalInputValue(digits);
                                } else {
                                    setModalInputValue(text);
                                }
                            }}
                            autoFocus
                            placeholder={
                                editingField?.key === 'phone'
                                    ? '10-digit number (e.g. 0771234567)'
                                    : `Enter ${editingField?.label?.toLowerCase()}`
                            }
                            placeholderTextColor="#94A3B8"
                            keyboardType={editingField?.key === 'phone' ? 'phone-pad' : 'default'}
                            maxLength={editingField?.key === 'phone' ? 10 : undefined}
                        />
                        {editingField?.key === 'phone' && (
                            <Text style={{ fontSize: 12, color: '#64748B', marginTop: 4, marginLeft: 4 }}>
                                {modalInputValue.length}/10 digits
                            </Text>
                        )}

                        <View style={styles.modalBtnRow}>
                            <TouchableOpacity
                                style={styles.modalCancelBtn}
                                onPress={() => setEditModalVisible(false)}
                            >
                                <Text style={styles.modalCancelText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.modalConfirmBtn}
                                onPress={handleSaveModalField}
                            >
                                <Text style={styles.modalConfirmText}>Done</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F1F5F9', // Soft crisp slate background
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 24,
    },
    centerScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F1F5F9',
    },
    centerLoadingText: {
        marginTop: 12,
        fontSize: 14,
        fontWeight: '600',
        color: '#64748B',
    },

    // ── Curved Dark Navy Hero Section ──
    heroSection: {
        backgroundColor: '#0F172A',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        paddingBottom: 55,
        position: 'relative',
        zIndex: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 10,
        elevation: 6,
    },
    safeArea: {
        paddingTop: Platform.OS === 'android' ? 12 : 0,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 8,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.14)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 0.2,
    },

    // ── Floating Avatar Circle Overlapping Hero ──
    avatarContainer: {
        position: 'absolute',
        bottom: -46,
        alignSelf: 'center',
        zIndex: 20,
    },
    avatarTouchTarget: {
        position: 'relative',
    },
    avatarCircle: {
        width: 94,
        height: 94,
        borderRadius: 47,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#FFFFFF',
        overflow: 'hidden',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.14,
        shadowRadius: 8,
        elevation: 6,
    },
    avatarImg: {
        width: '100%',
        height: '100%',
    },
    editPencilBadge: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        backgroundColor: '#2563EB',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
        elevation: 3,
    },

    // ── User Overview & Subtitle Pill ──
    profileOverview: {
        alignItems: 'center',
        marginTop: 52,
        marginBottom: 10,
    },
    profileDisplayName: {
        fontSize: 22,
        fontWeight: '800',
        color: '#0F172A',
        letterSpacing: 0.2,
    },
    pillBadge: {
        backgroundColor: '#EFF6FF',
        paddingHorizontal: 14,
        paddingVertical: 5,
        borderRadius: 20,
        marginTop: 6,
    },
    pillBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#2563EB',
    },

    // ── Sections ──
    sectionContainer: {
        paddingHorizontal: 16,
        marginTop: 14,
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 10,
        marginLeft: 2,
    },

    // ── Grouped Personal Info Card ──
    groupedCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        overflow: 'hidden',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
    fieldRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    iconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    fieldTextCol: {
        flex: 1,
    },
    fieldLabelUpper: {
        fontSize: 10,
        fontWeight: '800',
        color: '#64748B',
        letterSpacing: 0.5,
    },
    fieldValueText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#0F172A',
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginLeft: 68,
    },

    // ── Customer Service Preferences Card ──
    proCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        padding: 16,
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 2,
    },
    categoryHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    subCategoryTitle: {
        fontSize: 15,
        fontWeight: '800',
        color: '#0F172A',
    },
    categoryHint: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748B',
    },
    categoryPillsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
    },
    categoryChipActive: {
        backgroundColor: '#2563EB',
    },
    categoryChipText: {
        fontSize: 13,
        fontWeight: '700',
        color: '#334155',
    },
    categoryChipTextActive: {
        color: '#FFFFFF',
    },

    // ── Two Column Row: Property Type & Preferred Payment ──
    twoColRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 12,
    },
    twoColCard: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        padding: 12,
    },
    twoColCardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 6,
    },
    twoColLabel: {
        fontSize: 10,
        fontWeight: '800',
        color: '#64748B',
        letterSpacing: 0.5,
    },
    valUnitRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    twoColValueBold: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0F172A',
        padding: 0,
        margin: 0,
    },

    // ── Service Address Card ──
    serviceAreaCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        padding: 12,
        marginBottom: 12,
    },
    serviceAreaValueRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 2,
    },
    serviceAreaText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#0F172A',
    },

    // ── Service Notes & Instructions Card ──
    bioCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        padding: 12,
    },
    bioHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    bioCounter: {
        fontSize: 11,
        fontWeight: '700',
        color: '#64748B',
    },
    bioInput: {
        fontSize: 13,
        color: '#1E293B',
        lineHeight: 19,
        padding: 0,
        margin: 0,
        textAlignVertical: 'top',
    },

    // ── Sticky Bottom Button Bar ──
    bottomBar: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#E2E8F0',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 6,
    },
    saveBtn: {
        backgroundColor: '#2563EB',
        borderRadius: 16,
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 4,
    },
    saveBtnDisabled: {
        opacity: 0.6,
    },
    saveBtnText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#FFFFFF',
    },

    // ── Modal Styles ──
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    modalCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 10,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0F172A',
    },
    modalInput: {
        backgroundColor: '#F8FAFC',
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 12,
        paddingHorizontal: 14,
        paddingVertical: 12,
        fontSize: 15,
        fontWeight: '600',
        color: '#0F172A',
        marginBottom: 18,
    },
    modalBtnRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    modalCancelBtn: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 10,
    },
    modalCancelText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#64748B',
    },
    modalConfirmBtn: {
        backgroundColor: '#2563EB',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
    },
    modalConfirmText: {
        fontSize: 14,
        fontWeight: '800',
        color: '#FFFFFF',
    },
});