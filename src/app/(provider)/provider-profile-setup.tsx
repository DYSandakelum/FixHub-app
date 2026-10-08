import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
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
import { useCurrency } from './settingsStore';

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
                <TouchableOpacity onPress={pickImage} style={{ position: 'relative' }}>
                    <View style={styles.uploadCircle}>
                        {profileImage ? (
                            <Image source={{ uri: profileImage }} style={styles.profileImage} />
                        ) : (
                            <MaterialIcons name="person" size={50} color="#2563EB" />
                        )}
                    </View>
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
    const { currencySymbol } = useCurrency();
    const router = useRouter();
    const [serviceType, setServiceType] = useState('Plumbing');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [name, setName] = useState('Judith Glavour');

    const [countryCode, setCountryCode] = useState('+94');
    const [countryFlag, setCountryFlag] = useState('🇱🇰');

    const [profileCountryName, setProfileCountryName] = useState('Sri Lanka');
    const [profileCountryFlag, setProfileCountryFlag] = useState('🇱🇰');

    const [phone, setPhone] = useState('77 123 4567');
    const [pickerType, setPickerType] = useState<'phone' | 'country' | null>(null);
    const [countrySearch, setCountrySearch] = useState('');

    const [email, setEmail] = useState('Judithglavour@gmail.com');

    // Edit Modal State
    const [editField, setEditField] = useState<{ key: string, label: string, value: string } | null>(null);
    const [tempValue, setTempValue] = useState('');

    const handleEditProfilePic = () => {
        Alert.alert(
            'Profile Picture',
            'Choose an option',
            [
                {
                    text: 'Take a photo',
                    onPress: async () => {
                        const { status } = await ImagePicker.requestCameraPermissionsAsync();
                        if (status !== 'granted') {
                            Alert.alert('Permission Denied', 'Sorry, we need camera permissions to make this work!');
                            return;
                        }
                        let result = await ImagePicker.launchCameraAsync({
                            mediaTypes: ['images'],
                            allowsEditing: true,
                            aspect: [1, 1],
                            quality: 1,
                        });
                        if (!result.canceled) {
                            setProfileImage(result.assets[0].uri);
                        }
                    }
                },
                {
                    text: 'Choose photo',
                    onPress: async () => {
                        let result = await ImagePicker.launchImageLibraryAsync({
                            mediaTypes: ['images'],
                            allowsEditing: true,
                            aspect: [1, 1],
                            quality: 1,
                        });
                        if (!result.canceled) {
                            setProfileImage(result.assets[0].uri);
                        }
                    }
                },
                {
                    text: 'Delete photo',
                    style: 'destructive',
                    onPress: () => setProfileImage(null)
                },
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <View style={styles.screen}>
            <ProfileHeroSection
                profileImage={profileImage}
                pickImage={handleEditProfilePic}
                onBack={() => router.back()}
            />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    <Text style={[styles.sectionSimpleTitle, { marginTop: 16 }]}>Personal Info</Text>
                    {/* ── Personal Info Card ── */}
                    <View style={styles.proProfileCard}>

                        <TouchableOpacity
                            style={styles.personalInfoField}
                            onPress={() => { setEditField({ key: 'name', label: 'Your name', value: name }); setTempValue(name); }}
                        >
                            <View style={styles.fieldIconCircle}>
                                <MaterialIcons name="person-outline" size={20} color="#9CA3AF" />
                            </View>
                            <View style={styles.fieldTextCol}>
                                <Text style={styles.fieldLabelUpper}>YOUR NAME</Text>
                                <Text style={styles.fieldValueText}>{name}</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.personalInfoField}
                            onPress={() => { setEditField({ key: 'phone', label: 'Phone Number', value: phone }); setTempValue(phone); }}
                        >
                            <View style={styles.fieldIconCircle}>
                                <MaterialIcons name="phone" size={20} color="#9CA3AF" />
                            </View>
                            <View style={styles.fieldTextCol}>
                                <Text style={styles.fieldLabelUpper}>PHONE NUMBER</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={[styles.fieldValueText, { color: '#4B5563', marginRight: 6 }]}>{countryFlag} {countryCode}</Text>
                                    <Text style={styles.fieldValueText}>{phone}</Text>
                                </View>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.personalInfoField}
                            onPress={() => { setEditField({ key: 'email', label: 'Email Address', value: email }); setTempValue(email); }}
                        >
                            <View style={styles.fieldIconCircle}>
                                <MaterialIcons name="mail-outline" size={20} color="#9CA3AF" />
                            </View>
                            <View style={styles.fieldTextCol}>
                                <Text style={styles.fieldLabelUpper}>EMAIL ADDRESS</Text>
                                <Text style={styles.fieldValueText}>{email}</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.personalInfoField}
                            onPress={() => setPickerType('country')}
                        >
                            <View style={styles.fieldIconCircle}>
                                <Text style={{ fontSize: 16 }}>{profileCountryFlag}</Text>
                            </View>
                            <View style={styles.fieldTextCol}>
                                <Text style={styles.fieldLabelUpper}>COUNTRY</Text>
                                <Text style={styles.fieldValueText}>{profileCountryName}</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
                        </TouchableOpacity>
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
                                {['Plumbing', 'Electrical', 'Cleaning'].map((type) => {
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
                                        <Text style={styles.inputPrefix}>{currencySymbol.trim()}</Text>
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

            {/* ── Country Picker Modal ── */}
            {pickerType && (
                <View style={[styles.modalOverlay, { zIndex: 1100 }]}>
                    <View style={styles.pickerContainer}>
                        <Text style={styles.pickerTitle}>Select Country</Text>
                        <TextInput
                            style={styles.countrySearchInput}
                            placeholder="Search country..."
                            placeholderTextColor="#9CA3AF"
                            value={countrySearch}
                            onChangeText={setCountrySearch}
                        />
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {[
                                { name: 'Sri Lanka', code: '+94', flag: '🇱🇰' },
                                { name: 'Nigeria', code: '+234', flag: '🇳🇬' },
                                { name: 'United States', code: '+1', flag: '🇺🇸' },
                                { name: 'United Kingdom', code: '+44', flag: '🇬🇧' },
                                { name: 'India', code: '+91', flag: '🇮🇳' },
                                { name: 'Australia', code: '+61', flag: '🇦🇺' },
                            ].filter(c => c.name.toLowerCase().includes(countrySearch.toLowerCase())).map((item) => (
                                <TouchableOpacity
                                    key={item.code}
                                    style={styles.pickerItem}
                                    onPress={() => {
                                        if (pickerType === 'phone') {
                                            setCountryCode(item.code);
                                            setCountryFlag(item.flag);
                                        } else {
                                            setProfileCountryName(item.name);
                                            setProfileCountryFlag(item.flag);
                                        }
                                        setPickerType(null);
                                        setCountrySearch('');
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Text style={styles.pickerFlag}>{item.flag}</Text>
                                        <Text style={styles.pickerName}>{item.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <TouchableOpacity style={styles.pickerCloseBtn} onPress={() => { setPickerType(null); setCountrySearch(''); }}>
                            <Text style={styles.pickerCloseText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
            {/* ── Field Edit Modal ── */}
            {editField && (
                <View style={styles.modalOverlay}>
                    <View style={styles.editModalContainer}>
                        <View style={styles.editModalHeader}>
                            <Text style={styles.editModalTitle}>Edit {editField.label}</Text>
                            <MaterialIcons name="edit" size={18} color="#2563EB" />
                        </View>
                        <Text style={styles.editModalSubtitle}>{editField.value}</Text>

                        <View style={styles.editModalInputWrapper}>
                            <Text style={styles.editModalInputLabel}>{editField.label}</Text>
                            {editField.key === 'phone' ? (
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <TouchableOpacity
                                        onPress={() => setPickerType('phone')}
                                        style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10, paddingRight: 10, borderRightWidth: 1, borderRightColor: '#E5E7EB' }}
                                    >
                                        <Text style={[styles.editModalTextInput, { color: '#4B5563', marginRight: 4 }]}>{countryFlag} {countryCode}</Text>
                                        <MaterialIcons name="arrow-drop-down" size={20} color="#4B5563" />
                                    </TouchableOpacity>
                                    <TextInput
                                        style={[styles.editModalTextInput, { flex: 1 }]}
                                        value={tempValue}
                                        onChangeText={setTempValue}
                                        keyboardType="phone-pad"
                                        autoFocus
                                    />
                                </View>
                            ) : (
                                <TextInput
                                    style={styles.editModalTextInput}
                                    value={tempValue}
                                    onChangeText={setTempValue}
                                    keyboardType={editField.key === 'email' ? 'email-address' : 'default'}
                                    autoCapitalize={editField.key === 'email' ? 'none' : 'words'}
                                    autoFocus
                                />
                            )}
                        </View>

                        <View style={styles.editModalActionRow}>
                            <TouchableOpacity onPress={() => setEditField(null)}>
                                <Text style={styles.editModalCancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.editModalSaveBtn}
                                onPress={() => {
                                    if (editField.key === 'name') setName(tempValue);
                                    if (editField.key === 'phone') setPhone(tempValue);
                                    if (editField.key === 'email') setEmail(tempValue);
                                    setEditField(null);
                                }}
                            >
                                <Text style={styles.editModalSaveText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
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
        backgroundColor: '#2563EB',
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

    basicBadgeText: {
        color: '#9CA3AF',
        fontSize: 14,
        fontWeight: '600',
    },
    personalInfoField: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        borderRadius: 16,
        padding: 12,
        marginBottom: 12,
    },
    fieldIconCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    fieldTextCol: {
        flex: 1,
        justifyContent: 'center',
    },
    fieldLabelUpper: {
        fontSize: 11,
        fontWeight: '700',
        color: '#9CA3AF',
        marginBottom: 4,
        letterSpacing: 0.5,
    },
    fieldValueText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
        padding: 0,
        margin: 0,
    },
    modalOverlay: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    pickerContainer: {
        backgroundColor: '#fff',
        width: '80%',
        maxHeight: '60%',
        borderRadius: 16,
        padding: 20,
    },
    pickerTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 16,
        color: '#111827',
        textAlign: 'center',
    },
    pickerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    pickerFlag: {
        fontSize: 22,
        marginRight: 12,
    },
    pickerName: {
        flex: 1,
        fontSize: 15,
        color: '#374151',
    },
    pickerCode: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
    },
    pickerCloseBtn: {
        marginTop: 16,
        alignItems: 'center',
        paddingVertical: 14,
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
    },
    pickerCloseText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#4B5563',
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
    },

    // Edit Modal Styles
    editModalContainer: {
        backgroundColor: '#fff',
        width: '90%',
        borderRadius: 24,
        padding: 24,
    },
    editModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    editModalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
    },
    editModalSubtitle: {
        fontSize: 15,
        color: '#6B7280',
        marginBottom: 24,
    },
    editModalInputWrapper: {
        borderWidth: 1.5,
        borderColor: '#2563EB',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 14,
        position: 'relative',
        marginBottom: 28,
    },
    editModalInputLabel: {
        position: 'absolute',
        top: -10,
        left: 10,
        backgroundColor: '#fff',
        paddingHorizontal: 6,
        fontSize: 13,
        fontWeight: '500',
        color: '#2563EB',
    },
    editModalTextInput: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        padding: 0,
        margin: 0,
    },
    editModalActionRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 20,
    },
    editModalCancelText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#2563EB',
    },
    editModalSaveBtn: {
        backgroundColor: '#2563EB',
        paddingHorizontal: 28,
        paddingVertical: 12,
        borderRadius: 24,
    },
    editModalSaveText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#fff',
    },
    countrySearchInput: {
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
        color: '#111827',
        marginBottom: 12,
        marginHorizontal: 16,
    }
});