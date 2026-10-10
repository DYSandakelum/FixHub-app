import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { FixHubLogo } from './fixhub-logo';
import { AuthButton } from './auth-button';
import { Spacing, MaxContentWidth } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';

interface OnboardingScreenProps {
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
}

export function OnboardingScreen({
  onNavigateToLogin,
  onNavigateToRegister,
}: OnboardingScreenProps) {
  const { completeOnboarding, isConfigured } = useAuth();

  const handleGetStarted = async () => {
    await completeOnboarding();
    onNavigateToLogin();
  };

  const features = [
    {
      icon: '🛡️',
      title: 'Verified Professionals',
      description: 'Skilled plumbers, electricians, carpenters, and technicians ready to help.',
    },
    {
      icon: '⚡',
      title: 'Fast & Transparent',
      description: 'Book on-demand services with clear upfront details and zero hassle.',
    },
    {
      icon: '🤝',
      title: 'Customers & Providers',
      description: 'Dedicated portals tailored for homeowners and professional service pros.',
    },
  ];

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}>
          {/* Top Logo & Hero */}
          <View style={styles.heroSection}>
            <FixHubLogo size="large" showTagline={false} />
            <ThemedText type="subtitle" style={styles.heroHeadline}>
              Home Services Made Simple
            </ThemedText>
            <ThemedText style={styles.heroDescription}>
              FixHub connects homeowners with certified local service specialists for repairs,
              maintenance, and improvement projects.
            </ThemedText>
          </View>

          {/* Configuration Hint Banner if needed */}
          {!isConfigured && (
            <View style={styles.configBanner}>
              <ThemedText style={{ fontSize: 16 }}>ℹ️</ThemedText>
              <ThemedText type="small" style={styles.configBannerText}>
                Supabase credentials can be set in <ThemedText type="code" style={{ color: '#1E40AF' }}>.env</ThemedText> for live database authentication.
              </ThemedText>
            </View>
          )}

          {/* Feature Highlights */}
          <View style={styles.featuresContainer}>
            {features.map((item, idx) => (
              <View
                key={idx}
                style={styles.featureCard}>
                <View style={styles.featureIconContainer}>
                  <ThemedText style={{ fontSize: 24 }}>{item.icon}</ThemedText>
                </View>
                <View style={styles.featureTextWrapper}>
                  <ThemedText type="smallBold" style={styles.featureTitle}>
                    {item.title}
                  </ThemedText>
                  <ThemedText
                    type="small"
                    style={styles.featureDescription}>
                    {item.description}
                  </ThemedText>
                </View>
              </View>
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionSection}>
            <AuthButton
              title="Get Started"
              onPress={handleGetStarted}
              variant="primary"
              icon="🚀"
            />

            <View style={styles.secondaryActions}>
              <Pressable
                onPress={async () => {
                  await completeOnboarding();
                  onNavigateToRegister();
                }}
                style={styles.roleLink}>
                <ThemedText type="small" style={styles.promptText}>
                  New to FixHub? <ThemedText type="smallBold" style={styles.blueLink}>Sign Up</ThemedText>
                </ThemedText>
              </Pressable>
            </View>

            <Pressable
              onPress={async () => {
                await completeOnboarding();
                onNavigateToLogin();
              }}
              style={styles.loginRow}>
              <ThemedText type="small" style={styles.promptText}>
                Already have an account?{' '}
                <ThemedText type="smallBold" style={styles.blueLink}>
                  Sign In
                </ThemedText>
              </ThemedText>
            </Pressable>
          </View>
        </ScrollView>
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
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    alignItems: 'center',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  heroSection: {
    alignItems: 'center',
    marginTop: Spacing.three,
    marginBottom: Spacing.four,
    gap: Spacing.two,
  },
  heroHeadline: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '700',
    marginTop: Spacing.two,
    color: '#0F172A',
  },
  heroDescription: {
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 380,
    marginTop: 2,
    color: '#64748B',
  },
  configBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: '#EFF6FF',
    borderColor: '#93C5FD',
    gap: Spacing.two,
    marginBottom: Spacing.three,
    width: '100%',
  },
  configBannerText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: '#1E40AF',
  },
  featuresContainer: {
    width: '100%',
    gap: Spacing.two,
    marginVertical: Spacing.two,
  },
  featureCard: {
    flexDirection: 'row',
    padding: Spacing.three,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    gap: Spacing.three,
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
  },
  featureIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
  },
  featureTextWrapper: {
    flex: 1,
    gap: 2,
  },
  featureTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  featureDescription: {
    fontSize: 13,
    lineHeight: 18,
    color: '#64748B',
  },
  actionSection: {
    width: '100%',
    marginTop: Spacing.four,
    gap: Spacing.three,
    alignItems: 'center',
  },
  secondaryActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  roleLink: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  promptText: {
    color: '#64748B',
  },
  blueLink: {
    color: '#2563EB',
    fontWeight: '700',
  },
  loginRow: {
    paddingVertical: Spacing.one,
  },
});
