import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system/legacy';
import { supabase } from './supabase';

// ---- READ: Get a user's profile ----
export async function getUserProfile(userId: string) {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching user profile:', error.message);
        return null;
    }
    return data;
}

// ---- UPDATE: Change name ----
export async function updateUserName(userId: string, name: string) {
    const { data, error } = await supabase
        .from('users')
        .update({ name })
        .eq('id', userId)
        .select()
        .single();

    if (error) {
        console.error('Error updating name:', error.message);
        return null;
    }
    return data;
}

// ---- UPDATE: Upload and set a new profile picture ----
export async function uploadAvatar(userId: string, imageUri: string) {
    try {
        const base64 = await FileSystem.readAsStringAsync(imageUri, { encoding: 'base64' });
        const fileName = `${userId}-${Date.now()}.jpg`;

        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, decode(base64), { contentType: 'image/jpeg', upsert: true });

        if (uploadError) {
            console.error('Error uploading avatar:', uploadError.message);
            return null;
        }

        const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
        const avatarUrl = publicUrlData.publicUrl;

        const { data, error } = await supabase
            .from('users')
            .update({ avatar_url: avatarUrl })
            .eq('id', userId)
            .select()
            .single();

        if (error) {
            console.error('Error saving avatar URL:', error.message);
            return null;
        }
        return data;
    } catch (e) {
        console.error('Unexpected error uploading avatar:', e);
        return null;
    }
}