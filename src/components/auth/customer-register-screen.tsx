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
import { ThemedView } from '@/components/themed-view';
import { FixHubLogo } from './fixhub-logo';
import { AuthInput } from './auth-input';
import { AuthButton } from './auth-button';
import { Spacing, MaxContentWidth } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';

interface CustomerRegisterScreenProps {
  onNavigateToLogin: () => void;
  onNavigateToProviderRegister: () => void;
  onRegistrationSuccess?: () => void;
}

export function CustomerRegisterScreen({
  onNavigateToLogin,
  onNavigateToProviderRegister,
  onRegistrationSuccess,
}: CustomerRegisterScreenProps) {
  const { signUpCustomer } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    setServerError('');
    setSuccessMessage('');

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter your full name (at least 2 characters)';
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      newErrors.email = 'Email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    const trimmedPhone = phoneNumber.trim();
    if (!trimmedPhone) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (trimmedPhone.replace(/[^0-9]/g, '').length < 7) {
      newErrors.phoneNumber = 'Please enter a valid phone number (at least 7 digits)';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setIsLoading(true);
    setServerError('');
    setSuccessMessage('');

    try {
      const result = await signUpCustomer({
        fullName,
        email,
        password,
        phoneNumber,
      });

      if (result.error) {
        const message = result.error.message || 'Failed to create customer account';
        setServerError(
          message.toLowerCase().includes('rate limit')
            ? 'Supabase email signup is temporarily rate-limited. Please wait and try again later.'
            : message
        );
      } else {
        setSuccessMessage('Registration successful. Please check your email to confirm your account.');
        if (onRegistrationSuccess) {
          setTimeout(onRegistrationSuccess, 1800);
        }
      }
    } catch (err: any) {
      setServerError(err?.message || 'An unexpected error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}>
            {/* Top Navigation */}
            <View style={styles.topBar}>
              <Pressable
                onPress={onNavigateToLogin}
                style={styles.backButton}
                hitSlop={8}>
                <ThemedText style={styles.backArrow}>←</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">
                  Back to Sign In
                </ThemedText>
              </Pressable>

              <View style={styles.roleBadge}>
                <ThemedText type="smallBold" style={styles.roleBadgeText}>
                  Customer Portal
                </ThemedText>
              </View>
            </View>

            {/* Header */}
            <View style={styles.header}>
              <FixHubLogo size="normal" showTagline={false} />
              <ThemedText type="subtitle" style={styles.title}>
                Create Customer Account
              </ThemedText>
              <ThemedText
                type="small"
                themeColor="textSecondary"
                style={styles.subtitle}>
                Sign up to book home repairs, maintenance, and expert services
              </ThemedText>
            </View>

            {/* Success Message Banner */}
            {successMessage ? (
              <View style={styles.successBanner}>
                <ThemedText style={{ fontSize: 16 }}>✅</ThemedText>
                <ThemedText style={styles.successBannerText}>{successMessage}</ThemedText>
              </View>
            ) : null}

            {/* Server Error Banner */}
            {serverError ? (
              <View style={styles.errorBanner}>
                <ThemedText style={{ fontSize: 16 }}>⚠️</ThemedText>
                <ThemedText style={styles.errorBannerText}>{serverError}</ThemedText>
              </View>
            ) : null}

            {/* Form Fields */}
            <View style={styles.form}>
              <AuthInput
                label="Full Name"
                placeholder="e.g. John Doe"
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                }}
                autoCapitalize="words"
                error={errors.fullName}
                leftIcon="👤"
              />

              <AuthInput
                label="Email Address"
                placeholder="john.doe@example.com"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                error={errors.email}
                leftIcon="✉️"
              />

              <AuthInput
                label="Phone Number"
                placeholder="e.g. +1 555-019-2834"
                value={phoneNumber}
                onChangeText={(text) => {
                  setPhoneNumber(text);
                  if (errors.phoneNumber) setErrors((prev) => ({ ...prev, phoneNumber: '' }));
                }}
                keyboardType="phone-pad"
                error={errors.phoneNumber}
                leftIcon="📞"
              />

              <AuthInput
                label="Password"
                placeholder="Minimum 6 characters"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                }}
                isPassword
                autoCapitalize="none"
                error={errors.password}
                leftIcon="🔒"
              />

              <AuthInput
                label="Confirm Password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                }}
                isPassword
                autoCapitalize="none"
                error={errors.confirmPassword}
                leftIcon="🔒"
              />

              <AuthButton
                title="Create Customer Account"
                onPress={handleRegister}
                variant="primary"
                isLoading={isLoading}
                style={styles.submitButton}
              />
            </View>

            {/* Footer Navigation */}
            <View style={styles.footerSection}>
              <View style={styles.switchRoleCard}>
                <ThemedText type="small" themeColor="textSecondary">
                  Are you a service technician or contractor?
                </ThemedText>
                <Pressable
                  onPress={onNavigateToProviderRegister}
                  style={styles.providerLinkButton}>
                  <ThemedText type="smallBold" style={styles.blueLink}>
                    Register as Service Provider →
                  </ThemedText>
                </Pressable>
              </View>

              <Pressable onPress={onNavigateToLogin} style={styles.loginRow}>
                <ThemedText type="small" themeColor="textSecondary">
                  Already have an account?{' '}
                  <ThemedText type="smallBold" style={styles.blueLink}>
                    Sign In
                  </ThemedText>
                </ThemedText>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  roleBadge: {
    backgroundColor: 'rgba(32, 138, 239, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  roleBadgeText: {
    color: '#2563EB',
    fontSize: 12,
  },
  header: {
    alignItems: 'center',
    marginTop: Spacing.one,
    marginBottom: Spacing.four,
    gap: Spacing.one,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: Spacing.two,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 2,
    maxWidth: 320,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: '#10B981',
    borderWidth: 1,
    borderRadius: 12,
    padding: Spacing.three,
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  successBannerText: {
    color: '#059669',
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: '#EF4444',
    borderWidth: 1,
    borderRadius: 12,
    padding: Spacing.three,
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  errorBannerText: {
    color: '#EF4444',
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  form: {
    width: '100%',
    marginTop: Spacing.two,
  },
  submitButton: {
    marginTop: Spacing.two,
  },
  footerSection: {
    width: '100%',
    marginTop: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
  },
  switchRoleCard: {
    width: '100%',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: 12,
    backgroundColor: 'rgba(32, 138, 239, 0.05)',
    gap: 4,
  },
  providerLinkButton: {
    marginTop: 2,
    paddingVertical: 4,
  },
  blueLink: {
    color: '#2563EB',
  },
  loginRow: {
    paddingVertical: Spacing.one,
  },
});
