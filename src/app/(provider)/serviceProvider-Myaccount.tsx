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
import { getRoleNameString, settingsStore, useCurrency, useSettings } from './settingsStore';

// ─── Hero Section Component ───
function ProfileHeroSection({ profileImage, pickImage, onBack, name, roleString }: { profileImage: string | null, pickImage: () => void, onBack: () => void, name: string, roleString: string }) {
    return (
        <View style={styles.heroWrapper}>
            <View style={styles.blueHeaderSection}>
                <SafeAreaView edges={['top']} style={{ flex: 0 }} />
                <View style={styles.headerTop}>
                    <TouchableOpacity style={styles.backBtn} onPress={onBack}>
                        <MaterialIcons name="chevron-left" size={28} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitleBlue}>My Account</Text>
                    <View style={{ width: 44 }} />
                </View>
            </View>

            <View style={styles.avatarSection}>
                <TouchableOpacity onPress={pickImage} style={styles.uploadContainer}>
                    <View style={styles.uploadCircle}>
                        {profileImage ? (
                            <Image source={{ uri: profileImage }} style={styles.profileImage} />
                        ) : (
                            <MaterialIcons name="person-outline" size={48} color="#3B82F6" />
                        )}
                    </View>
                    <View style={styles.editIconBadge}>
                        <MaterialIcons name="edit" size={14} color="#fff" />
                    </View>
                </TouchableOpacity>

                <Text style={styles.heroName}>{name}</Text>
                <View style={styles.heroPill}>
                    <Text style={styles.heroPillText}>{roleString} · 5 years experience</Text>
                </View>
            </View>
        </View>
    );
}

// ─── Main Screen ───
export default function ProviderProfileSetupScreen() {
    const { currencySymbol } = useCurrency();
    const { serviceCategory } = useSettings();
    const router = useRouter();
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
                name={name}
                roleString={getRoleNameString(serviceCategory)}
            />

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    <Text style={styles.sectionSimpleTitle}>Personal info</Text>
                    {/* ── Personal Info Card ── */}
                    <View style={styles.proProfileCard}>
                        <TouchableOpacity
                            style={styles.personalInfoField}
                            onPress={() => { setEditField({ key: 'name', label: 'Your name', value: name }); setTempValue(name); }}
                        >
                            <View style={styles.fieldIconCircle}>
                                <MaterialIcons name="person-outline" size={20} color="#3B82F6" />
                            </View>
                            <View style={styles.fieldTextCol}>
                                <Text style={styles.fieldLabelUpper}>YOUR NAME</Text>
                                <Text style={styles.fieldValueText}>{name}</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={22} color="#9CA3AF" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.personalInfoField}
                            onPress={() => { setEditField({ key: 'phone', label: 'Phone Number', value: phone }); setTempValue(phone); }}
                        >
                            <View style={styles.fieldIconCircle}>
                                <MaterialIcons name="phone" size={20} color="#3B82F6" />
                            </View>
                            <View style={styles.fieldTextCol}>
                                <Text style={styles.fieldLabelUpper}>PHONE NUMBER</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={[styles.fieldValueText, { color: '#111827', marginRight: 4 }]}>{countryFlag} {countryCode}</Text>
                                    <Text style={styles.fieldValueText}>{phone}</Text>
                                </View>
                            </View>
                            <MaterialIcons name="chevron-right" size={22} color="#9CA3AF" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.personalInfoField}
                            onPress={() => { setEditField({ key: 'email', label: 'Email Address', value: email }); setTempValue(email); }}
                        >
                            <View style={styles.fieldIconCircle}>
                                <MaterialIcons name="mail-outline" size={20} color="#3B82F6" />
                            </View>
                            <View style={styles.fieldTextCol}>
                                <Text style={styles.fieldLabelUpper}>EMAIL ADDRESS</Text>
                                <Text style={styles.fieldValueText}>{email}</Text>
                            </View>
                            <MaterialIcons name="chevron-right" size={22} color="#9CA3AF" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.personalInfoField, { borderBottomWidth: 0, paddingBottom: 0 }]}
                            onPress={() => setPickerType('country')}
                        >
                            <View style={styles.fieldIconCircle}>
                                <MaterialIcons name="language" size={20} color="#3B82F6" />
                            </View>
                            <View style={styles.fieldTextCol}>
                                <Text style={styles.fieldLabelUpper}>COUNTRY</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={[styles.fieldValueText, { marginRight: 6 }]}>{profileCountryFlag}</Text>
                                    <Text style={styles.fieldValueText}>{profileCountryName}</Text>
                                </View>
                            </View>
                            <MaterialIcons name="chevron-right" size={22} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>

                    {/* ── Professional Info Label ── */}
                    <Text style={[styles.sectionSimpleTitle, { marginTop: 24 }]}>Professional info</Text>

                    {/* ── Professional Profile Card ── */}
                    <View style={styles.proProfileCard}>
                        {/* Service Category */}
                        <View style={styles.fieldSection}>
                            <View style={styles.serviceHeaderRow}>
                                <Text style={styles.fieldLabel}>Service categories</Text>
                                <Text style={styles.serviceSubLabel}>Select all that apply</Text>
                            </View>
                            <View style={styles.pillRow}>
                                {['Plumbing', 'Electrical', 'Cleaning'].map((type) => {
                                    const isActive = serviceCategory === type;
                                    return (
                                        <TouchableOpacity
                                            key={type}
                                            style={[styles.pill, isActive && styles.pillActive]}
                                            onPress={() => settingsStore.setServiceCategory(type)}
                                        >
                                            {isActive && <MaterialIcons name="check" size={16} color="#fff" style={{ marginRight: 4 }} />}
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
                            <View style={[styles.inputBox, { flex: 1, marginRight: 12 }]}>
                                <View style={styles.inputBoxHeader}>
                                    <MaterialIcons name="workspace-premium" size={16} color="#F59E0B" />
                                    <Text style={styles.inputBoxTitle}>EXPERIENCE</Text>
                                </View>
                                <View style={styles.inputRowAlt}>
                                    <TextInput style={styles.inputMainTextBig} keyboardType="numeric" placeholder="5" placeholderTextColor="#111827" />
                                    <Text style={styles.inputSuffix}>years</Text>
                                </View>
                            </View>

                            <View style={[styles.inputBox, { flex: 1 }]}>
                                <View style={styles.inputBoxHeader}>
                                    <MaterialIcons name="local-offer" size={16} color="#10B981" />
                                    <Text style={styles.inputBoxTitle}>HOURLY RATE</Text>
                                </View>
                                <View style={styles.inputRowAlt}>
                                    <Text style={styles.inputPrefix}>Rs</Text>
                                    <TextInput style={styles.inputMainTextBig} keyboardType="numeric" placeholder="1,500" placeholderTextColor="#111827" />
                                </View>
                            </View>
                        </View>

                        {/* Service Area */}

                        <View style={[styles.inputBox, { marginTop: 12 }]}>
                            <View style={styles.inputBoxHeaderRow}>
                                <MaterialIcons name="location-on" size={14} color="#EF4444" />
                                <Text style={styles.inputBoxTitle}>SERVICE AREA</Text>
                                <View style={{ flex: 1 }} />
                                <MaterialIcons name="chevron-right" size={20} color="#9CA3AF" />
                            </View>
                            <TextInput style={[styles.inputMainText, { marginTop: 4 }]} placeholder="Colombo & Western Province" placeholderTextColor="#111827" />
                        </View>


                        {/* About & Bio */}
                        <View style={[styles.inputBox, { marginTop: 12, marginBottom: 0 }]}>
                            <View style={[styles.inputBoxHeaderRow, { justifyContent: 'space-between' }]}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <MaterialIcons name="sort" size={16} color="#4B5563" />
                                    <Text style={styles.inputBoxTitle}>ABOUT & BIO</Text>
                                </View>
                                <Text style={styles.charCount}>74/200</Text>
                            </View>
                            <TextInput
                                style={[styles.inputMainText, { minHeight: 60, textAlignVertical: 'top', marginTop: 4, color: '#374151', lineHeight: 22, fontWeight: '500' }]}
                                multiline
                                placeholder="Experienced plumber for home repairs and leak fixes, 5 years in the field."
                                placeholderTextColor="#374151"
                            />
                        </View>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>

            {/* ── Fixed Bottom Save Button ── */}
            <View style={styles.fixedBottomContainer}>
                <TouchableOpacity style={styles.saveBtn}>
                    <Text style={styles.saveBtnText}>Save changes</Text>
                </TouchableOpacity>
            </View>

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
                                style={[styles.editModalSaveBtn, editField.key === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tempValue) && { backgroundColor: '#93C5FD' }]}
                                disabled={editField.key === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tempValue)}
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
        backgroundColor: '#F3F4F6', // Lighter grey background to match Figma
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 20,
    },

    // Hero Section Styles
    heroWrapper: {
        backgroundColor: '#F3F4F6',
        paddingBottom: 24,
    },
    blueHeaderSection: {
        backgroundColor: '#0F172A', // Dark Navy
        borderBottomLeftRadius: 36,
        borderBottomRightRadius: 36,
        paddingBottom: 65,
        zIndex: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.14)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingVertical: 14,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#1E293B',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitleBlue: {
        fontSize: 18,
        fontWeight: '800',
        color: '#fff',
    },
    avatarSection: {
        alignItems: 'center',
        marginTop: -55,
        zIndex: 20,
    },
    uploadContainer: {
        position: 'relative',
        marginBottom: 12,
    },
    uploadCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#EEF2FF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#F3F4F6',
        overflow: 'hidden',
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.14,
        shadowRadius: 8,
        elevation: 6,
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    editIconBadge: {
        position: 'absolute',
        bottom: 2,
        right: 2,
        backgroundColor: '#3B82F6',
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 2,
        borderColor: '#F3F4F6',
    },
    heroName: {
        fontSize: 22,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 6,
    },
    heroPill: {
        backgroundColor: '#EEF2FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    heroPillText: {
        color: '#2563EB',
        fontSize: 13,
        fontWeight: '800',
    },

    // Info Labels (Text dividers)
    sectionSimpleTitle: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0F172A',
        marginBottom: 12,
    },

    personalInfoField: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    fieldIconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EEF2FF',
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
        fontWeight: '800',
        color: '#64748B',
        marginBottom: 2,
        letterSpacing: 0.5,
    },
    fieldValueText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#0F172A',
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
    countrySearchInput: {
        backgroundColor: '#F3F4F6',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 15,
        marginBottom: 12,
        color: '#111827',
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
        borderRadius: 20,
        padding: 20,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.03,
        shadowRadius: 10,
        elevation: 1,
    },
    fieldSection: {
        marginBottom: 16,
    },
    serviceHeaderRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    fieldLabel: {
        fontSize: 15,
        fontWeight: '800',
        color: '#0F172A',
    },
    serviceSubLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748B',
    },
    pillRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    pill: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    pillActive: {
        backgroundColor: '#2563EB',
    },
    pillText: {
        color: '#1E293B',
        fontSize: 14,
        fontWeight: '700',
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
        borderColor: '#E2E8F0',
        borderRadius: 16,
        padding: 16,
        backgroundColor: '#fff',
    },
    inputBoxHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    inputBoxHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    inputBoxTitle: {
        fontSize: 11,
        fontWeight: '800',
        color: '#64748B',
        marginLeft: 6,
        letterSpacing: 0.5,
    },
    charCount: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748B',
    },
    inputRowAlt: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginTop: 4,
    },
    inputMainTextBig: {
        fontSize: 24,
        fontWeight: '900',
        color: '#0F172A',
        padding: 0,
        letterSpacing: -0.5,
    },
    inputMainText: {
        fontSize: 15,
        fontWeight: '800',
        color: '#0F172A',
        flex: 1,
        padding: 0,
    },
    inputSuffix: {
        fontSize: 15,
        color: '#64748B',
        fontWeight: '600',
        marginLeft: 6,
    },
    inputPrefix: {
        fontSize: 15,
        color: '#64748B',
        fontWeight: '600',
        marginRight: 6,
    },

    // Fixed Bottom
    fixedBottomContainer: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 16,
        paddingBottom: Platform.OS === 'ios' ? 32 : 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    saveBtn: {
        backgroundColor: '#2563EB',
        borderRadius: 16,
        paddingVertical: 18,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    saveBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
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
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    editModalSaveText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
});