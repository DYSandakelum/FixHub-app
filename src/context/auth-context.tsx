import { settingsStore } from '@/app/(provider)/settingsStore';
import {
  isSupabaseConfigured,
  supabase,
  UserProfile,
  UserRole,
} from '@/lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Session, User } from '@supabase/supabase-js';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Platform } from 'react-native';

interface CustomerSignUpParams {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
}

interface ProviderSignUpParams {
  fullName: string;
  email: string;
  password: string;
  phoneNumber: string;
  serviceCategory: string;
  serviceDescription: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  role: UserRole | null;
  isLoading: boolean;
  isOnboarded: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; role?: UserRole }>;
  signUpCustomer: (params: CustomerSignUpParams) => Promise<{ error: Error | null; user?: User | null }>;
  signUpProvider: (params: ProviderSignUpParams) => Promise<{ error: Error | null; user?: User | null }>;
  signOut: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const ONBOARDING_KEY = '@fixhub_onboarding_completed';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);

  const isConfigured = useMemo(() => isSupabaseConfigured(), []);

  // Fetch or construct profile
  const fetchProfileForUser = useCallback(async (currentUser: User): Promise<UserProfile> => {
    try {
      // 1. Try 'users' table (used by booking, customer profile, admin)
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (userData && !userError) {
        let serviceCategory = userData.service_category || null;
        const resolvedName = userData.name || userData.full_name || '';
        const role = (userData.role as UserRole) || 'customer';

        if (role === 'provider') {
          const { data: providerData } = await supabase
            .from('providers')
            .select('service_type')
            .eq('id', currentUser.id)
            .maybeSingle();
          if (providerData?.service_type) {
            serviceCategory = providerData.service_type;
          }
          if (resolvedName) settingsStore.setProviderName(resolvedName);
          if (serviceCategory) settingsStore.setServiceCategory(serviceCategory);
        }

        return {
          id: currentUser.id,
          email: currentUser.email || userData.email || '',
          full_name: resolvedName,
          phone_number: userData.phone || userData.phone_number || '',
          role,
          service_category: serviceCategory,
        };
      }

      // 2. Try 'profiles' table (used by member1 auth schema)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (data && !error) {
        const profileData = data as UserProfile;
        if (profileData.role === 'provider') {
          const { data: providerData } = await supabase
            .from('providers')
            .select('service_type')
            .eq('id', currentUser.id)
            .maybeSingle();
          if (providerData?.service_type) {
            profileData.service_category = providerData.service_type;
          }
          if (profileData.full_name) settingsStore.setProviderName(profileData.full_name);
          if (profileData.service_category) settingsStore.setServiceCategory(profileData.service_category);
        }
        return profileData;
      }
    } catch {
      // Fallback to metadata if database table query fails
    }

    const meta = currentUser.user_metadata || {};
    const role = (meta.role as UserRole) || 'customer';
    let serviceCategory = meta.service_category || null;
    const resolvedName = meta.full_name || '';

    if (role === 'provider') {
      try {
        const { data: providerData } = await supabase
          .from('providers')
          .select('service_type')
          .eq('id', currentUser.id)
          .maybeSingle();
        if (providerData?.service_type) {
          serviceCategory = providerData.service_type;
        }
      } catch { }
      if (resolvedName) settingsStore.setProviderName(resolvedName);
      if (serviceCategory) settingsStore.setServiceCategory(serviceCategory);
    }

    return {
      id: currentUser.id,
      email: currentUser.email || '',
      full_name: resolvedName,
      phone_number: meta.phone_number || '',
      role,
      service_category: serviceCategory,
    };
  }, []);

  const isServer = typeof window === 'undefined' && Platform.OS === 'web';

  // Initialize auth session and onboarding status
  useEffect(() => {
    let isMounted = true;

    async function initialize() {
      try {
        let storedOnboarded: string | null = null;
        if (!isServer) {
          try {
            storedOnboarded = await AsyncStorage.getItem(ONBOARDING_KEY);
          } catch {
            storedOnboarded = null;
          }
        }
        if (isMounted) {
          setIsOnboarded(storedOnboarded === 'true');
        }

        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();

        if (isMounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          if (initialSession?.user) {
            const userProfile = await fetchProfileForUser(initialSession.user);
            if (isMounted) setProfile(userProfile);
          }
        }
      } catch (err) {
        console.warn('FixHub Auth init error:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!isMounted) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        const userProfile = await fetchProfileForUser(newSession.user);
        if (isMounted) setProfile(userProfile);
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfileForUser, isServer]);

  const refreshProfile = useCallback(async () => {
    if (user) {
      const updated = await fetchProfileForUser(user);
      setProfile(updated);
    }
  }, [user, fetchProfileForUser]);

  const completeOnboarding = useCallback(async () => {
    if (!isServer) {
      try {
        await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      } catch {
        // Ignore storage write error
      }
    }
    setIsOnboarded(true);
  }, [isServer]);

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim().toLowerCase(),
          password,
        });

        if (error) {
          return { error };
        }

        if (data.user) {
          const loadedProfile = await fetchProfileForUser(data.user);
          setProfile(loadedProfile);
          return { error: null, role: loadedProfile.role };
        }

        return { error: null };
      } catch (err) {
        return { error: err as Error };
      }
    },
    [fetchProfileForUser]
  );

  const signUpCustomer = useCallback(
    async ({ fullName, email, password, phoneNumber }: CustomerSignUpParams) => {
      try {
        const cleanEmail = email.trim().toLowerCase();
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              phone_number: phoneNumber.trim(),
              role: 'customer',
            },
          },
        });

        if (error) {
          return { error };
        }

        if (data.user) {
          // 1. Sync with 'users' table (required for booking and customer profiles)
          try {
            await supabase.from('users').upsert({
              id: data.user.id,
              name: fullName.trim(),
              phone: phoneNumber.trim(),
              role: 'customer',
            });
          } catch (usersErr) {
            console.warn('Users table upsert note:', usersErr);
          }

          // 2. Sync with 'profiles' table (member1 auth schema)
          try {
            await supabase.from('profiles').upsert({
              id: data.user.id,
              email: cleanEmail,
              full_name: fullName.trim(),
              phone_number: phoneNumber.trim(),
              role: 'customer',
              updated_at: new Date().toISOString(),
            });
          } catch (dbErr) {
            console.warn('Customer profile DB upsert note:', dbErr);
          }

          const customerProfile: UserProfile = {
            id: data.user.id,
            email: cleanEmail,
            full_name: fullName.trim(),
            phone_number: phoneNumber.trim(),
            role: 'customer',
          };
          setProfile(customerProfile);
        }

        return { error: null, user: data.user };
      } catch (err) {
        return { error: err as Error };
      }
    },
    []
  );

  const signUpProvider = useCallback(
    async ({
      fullName,
      email,
      password,
      phoneNumber,
      serviceCategory,
      serviceDescription,
    }: ProviderSignUpParams) => {
      try {
        const cleanEmail = email.trim().toLowerCase();
        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password,
          options: {
            data: {
              full_name: fullName.trim(),
              phone_number: phoneNumber.trim(),
              role: 'provider',
              service_category: serviceCategory,
              service_description: serviceDescription.trim(),
            },
          },
        });

        if (error) {
          return { error };
        }

        if (data.user) {
          // 1. Sync with 'users' table
          try {
            await supabase.from('users').upsert({
              id: data.user.id,
              name: fullName.trim(),
              phone: phoneNumber.trim(),
              role: 'provider',
            });
          } catch (usersErr) {
            console.warn('Users table upsert note:', usersErr);
          }

          // 2. Sync with 'profiles' table (if table exists)
          try {
            await supabase.from('profiles').upsert({
              id: data.user.id,
              email: cleanEmail,
              full_name: fullName.trim(),
              phone_number: phoneNumber.trim(),
              role: 'provider',
              service_category: serviceCategory,
              updated_at: new Date().toISOString(),
            });
          } catch (dbErr) {
            console.warn('Provider profile DB upsert note:', dbErr);
          }

          // 3. Register in 'providers' table (required for search & admin verification)
          try {
            await supabase.from('providers').upsert({
              id: data.user.id,
              service_type: serviceCategory,
              bio: serviceDescription.trim(),
              verified: false,
            });
          } catch (provErr) {
            console.warn('Provider table upsert note:', provErr);
          }

          const providerProfile: UserProfile = {
            id: data.user.id,
            email: cleanEmail,
            full_name: fullName.trim(),
            phone_number: phoneNumber.trim(),
            role: 'provider',
            service_category: serviceCategory,
          };
          setProfile(providerProfile);
        }

        return { error: null, user: data.user };
      } catch (err) {
        return { error: err as Error };
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      setSession(null);
      setUser(null);
      setProfile(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      session,
      user,
      profile,
      role: profile?.role ?? null,
      isLoading,
      isOnboarded,
      isConfigured,
      signIn,
      signUpCustomer,
      signUpProvider,
      signOut,
      completeOnboarding,
      refreshProfile,
    }),
    [
      session,
      user,
      profile,
      isLoading,
      isOnboarded,
      isConfigured,
      signIn,
      signUpCustomer,
      signUpProvider,
      signOut,
      completeOnboarding,
      refreshProfile,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
