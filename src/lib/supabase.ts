import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
export const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = () => {
  return (
    Boolean(supabaseUrl) &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('your-project-id') &&
    Boolean(supabaseAnonKey) &&
    !supabaseAnonKey.includes('placeholder') &&
    !supabaseAnonKey.includes('your-supabase-anon-key')
  );
};

const isServer = typeof window === 'undefined' && Platform.OS === 'web';

const safeStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (isServer) return null;
    try {
      return await AsyncStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (isServer) return;
    try {
      await AsyncStorage.setItem(key, value);
    } catch {
      // Ignore storage write errors on server
    }
  },
  removeItem: async (key: string): Promise<void> => {
    if (isServer) return;
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      // Ignore storage remove errors on server
    }
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: safeStorage,
    autoRefreshToken: !isServer,
    persistSession: !isServer,
    detectSessionInUrl: Platform.OS === 'web' && !isServer,
  },
});

export type UserRole = 'customer' | 'provider' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone_number: string;
  role: UserRole;
  service_category?: string | null;
  created_at?: string;
  updated_at?: string;
}
