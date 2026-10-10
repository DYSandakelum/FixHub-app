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

interface ProviderRegisterScreenProps {
  onNavigateToLogin: () => void;
  onNavigateToCustomerRegister: () => void;
  onRegistrationSuccess?: () => void;
}

const SERVICE_CATEGORIES = [
  { id: 'plumbing', name: 'Plumbing', icon: '🚰' },
  { id: 'electrical', name: 'Electrical', icon: '⚡' },
  { id: 'cleaning', name: 'Cleaning', icon: '🧹' },
];

export function ProviderRegisterScreen({
  onNavigateToLogin,
  onNavigateToCustomerRegister,
  onRegistrationSuccess,
}: ProviderRegisterScreenProps) {
  const { signUpProvider } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [serviceCategory, setServiceCategory] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
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

    const cleanPhoneDigits = phoneNumber.replace(/[^0-9]/g, '');
    if (!cleanPhoneDigits) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (cleanPhoneDigits.length !== 10) {
      newErrors.phoneNumber = 'Phone number must be exactly 10 digits';
    }

    if (!serviceCategory) {
      newErrors.serviceCategory = 'Please select your service specialization';
    }

    if (!serviceDescription.trim()) {
      newErrors.serviceDescription = 'Please describe the services you offer';
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
      const result = await signUpProvider({
        fullName,
        email,
        password,
        phoneNumber,
        serviceCategory,
        serviceDescription,
      });

      if (result.error) {
        const message = result.error.message || 'Failed to create provider account';
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
    <View style={styles.container}>
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
                <ThemedText type="small" style={styles.backButtonText}>
                  Back to Sign In
                </ThemedText>
              </Pressable>

              <View style={styles.roleBadge}>
                <ThemedText type="smallBold" style={styles.roleBadgeText}>
                  Provider Portal
                </ThemedText>
              </View>
            </View>

            {/* Header */}
            <View style={styles.header}>
              <FixHubLogo size="normal" showTagline={false} />
              <ThemedText type="subtitle" style={styles.title}>
                Become a FixHub Partner
              </ThemedText>
              <ThemedText
                type="small"
                style={styles.subtitle}>
                Register your business or technician profile to receive service bookings
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
                label="Full Name or Business Name"
                placeholder="e.g. Alex Rivera or Apex Electric"
                value={fullName}
                onChangeText={(text) => {
                  setFullName(text);
                  if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                }}
                autoCapitalize="words"
                error={errors.fullName}
                leftIcon="🛠️"
              />

              <AuthInput
                label="Email Address"
                placeholder="provider@example.com"
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
                placeholder="e.g. 0771234567 (10 digits)"
                value={phoneNumber}
                onChangeText={(text) => {
                  const digits = text.replace(/[^0-9]/g, '').slice(0, 10);
                  setPhoneNumber(digits);
                  if (errors.phoneNumber) setErrors((prev) => ({ ...prev, phoneNumber: '' }));
                }}
                keyboardType="phone-pad"
                error={errors.phoneNumber}
                leftIcon="📞"
              />

              {/* Service Category Selection */}
              <View style={styles.categorySection}>
                <ThemedText type="smallBold" style={styles.categoryLabel}>
                  Service Specialization / Category *
                </ThemedText>

                <View style={styles.categoryGrid}>
                  {SERVICE_CATEGORIES.map((cat) => {
                    const isSelected = serviceCategory === cat.name;
                    return (
                      <Pressable
                        key={cat.id}
                        onPress={() => {
                          setServiceCategory(cat.name);
                          if (errors.serviceCategory) {
                            setErrors((prev) => ({ ...prev, serviceCategory: '' }));
                          }
                        }}
                        style={[
                          styles.categoryChip,
                          isSelected ? styles.categoryChipSelected : styles.categoryChipUnselected,
                        ]}>
                        <ThemedText style={{ fontSize: 16 }}>{cat.icon}</ThemedText>
                        <ThemedText
                          type="small"
                          style={[
                            styles.chipText,
                            isSelected && styles.chipTextSelected,
                          ]}>
                          {cat.name}
                        </ThemedText>
                      </Pressable>
                    );
                  })}
                </View>

                {errors.serviceCategory ? (
                  <ThemedText type="small" style={styles.errorText}>
                    {errors.serviceCategory}
                  </ThemedText>
                ) : null}
              </View>

              <AuthInput
                label="Short Service Description"
                placeholder="Tell customers what you specialize in"
                value={serviceDescription}
                onChangeText={(text) => {
                  setServiceDescription(text);
                  if (errors.serviceDescription) {
                    setErrors((prev) => ({ ...prev, serviceDescription: '' }));
                  }
                }}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                style={styles.descriptionInput}
                error={errors.serviceDescription}
                leftIcon="📝"
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
                title="Register as Service Provider"
                onPress={handleRegister}
                variant="primary"
                isLoading={isLoading}
                style={styles.submitButton}
              />
            </View>

            {/* Footer Navigation */}
            <View style={styles.footerSection}>
              <View style={styles.switchRoleCard}>
                <ThemedText type="small" style={styles.switchRoleText}>
                  Looking to hire services instead?
                </ThemedText>
                <Pressable
                  onPress={onNavigateToCustomerRegister}
                  style={styles.customerLinkButton}>
                  <ThemedText type="smallBold" style={styles.blueLink}>
                    Register as Customer →
                  </ThemedText>
                </Pressable>
              </View>

              <Pressable onPress={onNavigateToLogin} style={styles.loginRow}>
                <ThemedText type="small" style={styles.promptText}>
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
  backButtonText: {
    color: '#64748B',
    fontSize: 14,
  },
  roleBadge: {
    backgroundColor: '#EFF6FF',
    borderColor: '#DBEAFE',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  roleBadgeText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '700',
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
    color: '#0F172A',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 2,
    maxWidth: 320,
    color: '#64748B',
    fontSize: 14,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
    borderWidth: 1,
    borderRadius: 12,
    padding: Spacing.three,
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  successBannerText: {
    color: '#047857',
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
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
  form: {
    width: '100%',
    marginTop: Spacing.two,
  },
  categorySection: {
    marginBottom: Spacing.four,
  },
  categoryLabel: {
    marginBottom: Spacing.two,
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
  },
  categoryChipUnselected: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  categoryChipSelected: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 6,
    marginLeft: 2,
  },
  submitButton: {
    marginTop: Spacing.two,
  },
  descriptionInput: {
    minHeight: 76,
    paddingTop: 12,
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
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderWidth: 1,
    gap: 4,
  },
  switchRoleText: {
    color: '#64748B',
    fontSize: 14,
  },
  customerLinkButton: {
    marginTop: 2,
    paddingVertical: 4,
  },
  blueLink: {
    color: '#2563EB',
    fontWeight: '700',
  },
  promptText: {
    color: '#64748B',
    fontSize: 14,
  },
  loginRow: {
    paddingVertical: Spacing.one,
  },
});
