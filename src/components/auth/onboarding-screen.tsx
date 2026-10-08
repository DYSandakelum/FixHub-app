import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FixHubLogo } from './fixhub-logo';
import { AuthButton } from './auth-button';
import { Spacing, MaxContentWidth } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface OnboardingScreenProps {
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
}

export function OnboardingScreen({
  onNavigateToLogin,
  onNavigateToRegister,
}: OnboardingScreenProps) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
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
    <ThemedView style={styles.container}>
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
            <ThemedText
              type="default"
              themeColor="textSecondary"
              style={styles.heroDescription}>
              FixHub connects homeowners with certified local service specialists for repairs,
              maintenance, and improvement projects.
            </ThemedText>
          </View>

          {/* Configuration Hint Banner if needed */}
          {!isConfigured && (
            <View
              style={[
                styles.configBanner,
                { backgroundColor: isDark ? '#1E293B' : '#EFF6FF', borderColor: '#3B82F6' },
              ]}>
              <ThemedText style={{ fontSize: 16 }}>ℹ️</ThemedText>
              <ThemedText type="small" style={styles.configBannerText}>
                Supabase credentials can be set in <ThemedText type="code">.env</ThemedText> for live database authentication.
              </ThemedText>
            </View>
          )}

          {/* Feature Highlights */}
          <View style={styles.featuresContainer}>
            {features.map((item, idx) => (
              <View
                key={idx}
                style={[
                  styles.featureCard,
                  {
                    backgroundColor: '#F8FAFC',
                    borderColor: isDark ? '#374151' : '#E2E8F0',
                  },
                ]}>
                <View style={styles.featureIconContainer}>
                  <ThemedText style={{ fontSize: 24 }}>{item.icon}</ThemedText>
                </View>
                <View style={styles.featureTextWrapper}>
                  <ThemedText type="smallBold" style={styles.featureTitle}>
                    {item.title}
                  </ThemedText>
                  <ThemedText
                    type="small"
                    themeColor="textSecondary"
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
                <ThemedText type="small" themeColor="textSecondary">
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
              <ThemedText type="small" themeColor="textSecondary">
                Already have an account?{' '}
                <ThemedText type="smallBold" style={styles.blueLink}>
                  Sign In
                </ThemedText>
              </ThemedText>
            </Pressable>
          </View>
        </ScrollView>
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
  },
  heroDescription: {
    textAlign: 'center',
    fontSize: 15,
    lineHeight: 22,
    maxWidth: 380,
    marginTop: 2,
  },
  configBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.three,
    borderRadius: 12,
    borderWidth: 1,
    gap: Spacing.two,
    marginBottom: Spacing.three,
    width: '100%',
  },
  configBannerText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
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
  },
  featureIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(32, 138, 239, 0.1)',
  },
  featureTextWrapper: {
    flex: 1,
    gap: 2,
  },
  featureTitle: {
    fontSize: 15,
  },
  featureDescription: {
    fontSize: 13,
    lineHeight: 18,
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
  blueLink: {
    color: '#2563EB',
  },
  loginRow: {
    paddingVertical: Spacing.one,
  },
});
