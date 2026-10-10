import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { FixHubLogo } from './fixhub-logo';
import { AuthInput } from './auth-input';
import { AuthButton } from './auth-button';
import { Spacing, MaxContentWidth } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { UserRole } from '@/lib/supabase';

interface LoginScreenProps {
  onNavigateToOnboarding: () => void;
  onNavigateToRegister: () => void;
  onLoginSuccess?: (role: UserRole) => void;
}

export function LoginScreen({
  onNavigateToOnboarding,
  onNavigateToRegister,
  onLoginSuccess,
}: LoginScreenProps) {
  const { signIn, isConfigured } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');
    setServerError('');

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setEmailError('Email address is required');
      isValid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        setEmailError('Please enter a valid email address');
        isValid = false;
      }
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setIsLoading(true);
    setServerError('');

    try {
      const result = await signIn(email, password);

      if (result.error) {
        // Helpful Supabase error handling
        const message = result.error.message || 'Failed to sign in';
        if (message.toLowerCase().includes('invalid login credentials')) {
          setServerError('Invalid email or password. Please verify and try again.');
        } else if (message.toLowerCase().includes('email not confirmed')) {
          setServerError('Your email is not confirmed yet. Please check your inbox.');
        } else {
          setServerError(message);
        }
      } else {
        if (onLoginSuccess && result.role) {
          onLoginSuccess(result.role);
        }
      }
    } catch (err: any) {
      setServerError(err?.message || 'An unexpected error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}>
            {/* Top Navigation Bar */}
            <View style={styles.topBar}>
              <Pressable
                onPress={onNavigateToOnboarding}
                style={styles.backButton}
                hitSlop={8}>
                <ThemedText style={styles.backArrow}>←</ThemedText>
                <ThemedText type="small" style={styles.backButtonText}>
                  Back
                </ThemedText>
              </Pressable>
            </View>

            {/* Header */}
            <View style={styles.header}>
              <FixHubLogo size="normal" showTagline={false} />
              <ThemedText type="subtitle" style={styles.title}>
                Welcome Back
              </ThemedText>
              <ThemedText
                type="small"
                style={styles.subtitle}>
                Sign in to your FixHub customer or provider account
              </ThemedText>
            </View>

            {/* Server Error Banner */}
            {serverError ? (
              <View style={styles.errorBanner}>
                <ThemedText style={{ fontSize: 16 }}>⚠️</ThemedText>
                <ThemedText style={styles.errorBannerText}>{serverError}</ThemedText>
              </View>
            ) : null}

            {/* Supabase Notice if not configured */}
            {!isConfigured && (
              <View style={styles.infoBanner}>
                <ThemedText style={{ fontSize: 14 }}>ℹ️</ThemedText>
                <ThemedText type="small" style={styles.infoBannerText}>
                  Supabase URL and Anon Key are using local default settings. Configure{' '}
                  <ThemedText type="code" style={{ color: '#1E40AF' }}>.env</ThemedText> with your Supabase credentials to
                  connect to your live project.
                </ThemedText>
              </View>
            )}

            {/* Form Fields */}
            <View style={styles.form}>
              <AuthInput
                label="Email Address"
                placeholder="name@example.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) setEmailError('');
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                error={emailError}
                leftIcon="✉️"
              />

              <AuthInput
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) setPasswordError('');
                }}
                isPassword
                autoCapitalize="none"
                error={passwordError}
                leftIcon="🔒"
              />

              <AuthButton
                title="Sign In"
                onPress={handleLogin}
                variant="primary"
                isLoading={isLoading}
                style={styles.loginButton}
              />
            </View>

            {/* Registration Links */}
            <Pressable onPress={onNavigateToRegister} style={styles.registrationSection}>
              <ThemedText type="small" style={styles.promptText}>
                Don&apos;t have an account? <ThemedText type="smallBold" style={styles.signUpLink}>Sign Up</ThemedText>
              </ThemedText>
            </Pressable>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  topBar: {
    paddingVertical: Spacing.two,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
    paddingVertical: Spacing.one,
  },
  backArrow: {
    fontSize: 18,
    color: '#2563EB',
    fontWeight: '700',
  },
  backButtonText: {
    color: '#64748B',
    fontSize: 14,
  },
  header: {
    alignItems: 'center',
    marginTop: Spacing.two,
    marginBottom: Spacing.four,
    gap: Spacing.one,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginTop: Spacing.two,
    color: '#0F172A',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 2,
    maxWidth: 320,
    color: '#64748B',
    fontSize: 14,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
    borderWidth: 1,
    borderRadius: 12,
    padding: Spacing.three,
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  errorBannerText: {
    color: '#DC2626',
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderColor: '#93C5FD',
    borderRadius: 12,
    borderWidth: 1,
    padding: Spacing.three,
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    color: '#1E40AF',
  },
  form: {
    width: '100%',
    marginTop: Spacing.two,
  },
  loginButton: {
    marginTop: Spacing.two,
  },
  registrationSection: {
    width: '100%',
    marginTop: Spacing.five,
    alignItems: 'center',
    gap: Spacing.two,
  },
  promptText: {
    color: '#64748B',
    fontSize: 14,
  },
  signUpLink: {
    color: '#2563EB',
    fontWeight: '700',
  },
});
