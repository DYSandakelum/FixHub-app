import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system/legacy';
import { supabase } from './supabase';

// ---- READ: Get a user's profile ----
export async function getUserProfile(userId: string) {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

    if (error) {
        console.error('Error fetching user profile:', error.message);
        return null;
    }

    if (!data) {
        // Fallback: if user is not in 'users' table yet, construct from auth metadata and self-heal
        try {
            const { data: authData } = await supabase.auth.getUser();
            if (authData?.user && authData.user.id === userId) {
                const meta = authData.user.user_metadata || {};
                const fallbackProfile = {
                    id: userId,
                    name: meta.full_name || meta.name || authData.user.email?.split('@')[0] || 'User',
                    role: (meta.role as 'customer' | 'provider' | 'admin') || 'customer',
                    phone: meta.phone_number || meta.phone || null,
                    avatar_url: meta.avatar_url || null,
                };

                const { data: createdData } = await supabase
                    .from('users')
                    .upsert(fallbackProfile)
                    .select()
                    .maybeSingle();

                return createdData || fallbackProfile;
            }
        } catch (e) {
            console.warn('Could not auto-create user record:', e);
        }
        return null;
    }

    return data;
}

// ---- UPDATE: Update user profile fields (name, phone, avatar_url) ----
export async function updateUserProfile(
    userId: string,
    updates: { name?: string; phone?: string | null; avatar_url?: string }
) {
    const { data, error } = await supabase
        .from('users')
        .upsert({ id: userId, ...updates })
        .select()
        .maybeSingle();

    if (error) {
        console.error('Error updating user profile:', error.message);
        return null;
    }
    return data;
}

// ---- UPDATE: Change name ----
export async function updateUserName(userId: string, name: string) {
    return updateUserProfile(userId, { name });
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
            .upsert({ id: userId, avatar_url: avatarUrl })
            .select()
            .maybeSingle();

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