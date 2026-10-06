import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProviderProfileSetupScreen() {
    const router = useRouter();
    const [serviceType, setServiceType] = useState('Plumbing');

    return (
        <SafeAreaView style={styles.screen}>
            {/* ── Header ── */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backIcon}>‹</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile Setup</Text>
                <TouchableOpacity style={styles.moreButton}>
                    <Text style={styles.moreIcon}>•••</Text>
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* ── Upload Photo ── */}
                    <View style={styles.uploadSection}>
                        <TouchableOpacity style={styles.uploadCircle}>
                            <Text style={styles.uploadIcon}>👤</Text>
                        </TouchableOpacity>
                        <Text style={styles.uploadText}>Upload Photo</Text>
                    </View>

                    {/* ── Form Inputs ── */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Name</Text>
                        <TextInput style={styles.inputField} placeholder="Name" placeholderTextColor="#9CA3AF" />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Service Type</Text>
                        <View style={styles.toggleRow}>
                            {['Plumbing', 'Electrical', 'Cleaning'].map((type) => (
                                <TouchableOpacity
                                    key={type}
                                    style={[styles.toggleButton, serviceType === type && styles.toggleButtonActive]}
                                    onPress={() => setServiceType(type)}
                                >
                                    <Text style={[styles.toggleButtonText, serviceType === type && styles.toggleButtonTextActive]}>
                                        {type}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Years of Experience</Text>
                        <TextInput style={styles.inputField} placeholder="Years of Experience" placeholderTextColor="#9CA3AF" keyboardType="numeric" />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Service Area / Location</Text>
                        <TextInput style={styles.inputField} placeholder="Service Area / Location" placeholderTextColor="#9CA3AF" />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Price Rate (LKR/hr)</Text>
                        <TextInput style={styles.inputField} placeholder="Price Rate (LKR/hr)" placeholderTextColor="#9CA3AF" keyboardType="numeric" />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>About / Bio</Text>
                        <TextInput
                            style={[styles.inputField, styles.textArea]}
                            placeholder="Write a short bio..."
                            placeholderTextColor="#9CA3AF"
                            multiline={true}
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    </View>

                    {/* ── Save Button ── */}
                    <TouchableOpacity style={styles.saveButton}>
                        <Text style={styles.saveButtonText}>Save Profile</Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
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
        paddingBottom: 40,
    },

    // Upload Photo
    uploadSection: {
        alignItems: 'center',
        marginBottom: 30,
        marginTop: 10,
    },
    uploadCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#EFF6FF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#BFDBFE',
        marginBottom: 12,
    },
    uploadIcon: { fontSize: 32, color: '#2563EB' },
    uploadText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },

    // Form Inputs
    inputGroup: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    inputField: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        fontSize: 15,
        color: '#111827',
    },
    textArea: {
        height: 100,
        paddingTop: 14,
    },

    // Service Type Toggle
    toggleRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
    },
    toggleButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#fff',
    },
    toggleButtonActive: {
        backgroundColor: '#2563EB',
        borderColor: '#2563EB',
    },
    toggleButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
    },
    toggleButtonTextActive: {
        color: '#fff',
    },

    // Save Button
    saveButton: {
        backgroundColor: '#2563EB',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 10,
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
});