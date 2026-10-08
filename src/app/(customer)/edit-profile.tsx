import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import BackButton from '../../components/BackButton';
import { getUserProfile, updateUserName, uploadAvatar } from '../../lib/users';

const TEMP_CUSTOMER_ID = '18b0a243-3adc-42fc-aadf-faa7cc698a6d'; // TODO: replace with real logged-in user once Auth is built

export default function EditProfileScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    async function loadProfile() {
        setLoading(true);
        const data = await getUserProfile(TEMP_CUSTOMER_ID);
        if (data) {
            setName(data.name ?? '');
            setAvatarUrl(data.avatar_url ?? null);
        }
        setLoading(false);
    }

    async function handlePickImage() {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Permission needed', 'Please allow access to your photos to set a profile picture.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.6,
        });

        if (!result.canceled && result.assets[0]) {
            setSaving(true);
            const updated = await uploadAvatar(TEMP_CUSTOMER_ID, result.assets[0].uri);
            setSaving(false);
            if (updated) {
                setAvatarUrl(updated.avatar_url);
            } else {
                Alert.alert('Error', 'Could not upload your photo. Please try again.');
            }
        }
    }

    async function handleSaveName() {
        if (!name.trim()) {
            Alert.alert('Name required', 'Please enter a name.');
            return;
        }
        setSaving(true);
        const updated = await updateUserName(TEMP_CUSTOMER_ID, name.trim());
        setSaving(false);
        if (updated) {
            Alert.alert('Saved', 'Your profile has been updated.', [
                { text: 'OK', onPress: () => router.back() },
            ]);
        } else {
            Alert.alert('Error', 'Could not save your changes. Please try again.');
        }
    }

    if (loading) {
        return (
            <View style={styles.center}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <BackButton />
            <Text style={styles.title}>Edit Profile</Text>

            <TouchableOpacity style={styles.avatarWrapper} onPress={handlePickImage} disabled={saving}>
                {avatarUrl ? (
                    <Image source={{ uri: avatarUrl }} style={styles.avatarImage} />
                ) : (
                    <View style={styles.avatarPlaceholder}>
                        <Ionicons name="person" size={36} color="#fff" />
                    </View>
                )}
                <View style={styles.cameraBadge}>
                    <Ionicons name="camera" size={16} color="#fff" />
                </View>
            </TouchableOpacity>
            <Text style={styles.changePhotoText}>{saving ? 'Uploading...' : 'Tap to change photo'}</Text>

            <Text style={styles.label}>Name</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Your name"
            />

            <TouchableOpacity
                style={[styles.saveButton, saving && styles.saveButtonDisabled]}
                onPress={handleSaveName}
                disabled={saving}
            >
                <Text style={styles.saveButtonText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, paddingTop: 60, backgroundColor: '#fff' },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    title: { fontSize: 20, fontWeight: '700', marginBottom: 30, textAlign: 'center' },
    avatarWrapper: { alignSelf: 'center', position: 'relative' },
    avatarImage: { width: 100, height: 100, borderRadius: 50 },
    avatarPlaceholder: {
        width: 100, height: 100, borderRadius: 50,
        backgroundColor: '#2563EB', justifyContent: 'center', alignItems: 'center',
    },
    cameraBadge: {
        position: 'absolute', bottom: 0, right: 0,
        backgroundColor: '#2563EB', width: 30, height: 30, borderRadius: 15,
        justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#fff',
    },
    changePhotoText: { textAlign: 'center', color: '#60646C', fontSize: 12, marginTop: 10, marginBottom: 30 },
    label: { fontSize: 13, fontWeight: '600', color: '#60646C', marginBottom: 6 },
    input: {
        borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 14, fontSize: 15, marginBottom: 30,
    },
    saveButton: { backgroundColor: '#2563EB', padding: 16, borderRadius: 10, alignItems: 'center' },
    saveButtonDisabled: { opacity: 0.6 },
    saveButtonText: { color: '#fff', fontWeight: '600', fontSize: 15 },
});