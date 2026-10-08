import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

interface FixHubLogoProps {
  size?: 'normal' | 'compact' | 'large';
  showTagline?: boolean;
}

export function FixHubLogo({ size = 'normal', showTagline = true }: FixHubLogoProps) {
  const badgeSize = size === 'large' ? 64 : size === 'normal' ? 52 : 40;
  const iconFontSize = size === 'large' ? 32 : size === 'normal' ? 26 : 20;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.badge,
          {
            width: badgeSize,
            height: badgeSize,
            borderRadius: badgeSize / 3,
            backgroundColor: '#2563EB',
          },
        ]}>
        <ThemedText style={{ fontSize: iconFontSize }}>🔧</ThemedText>
      </View>

      <View style={styles.titleRow}>
        <ThemedText
          type={size === 'large' ? 'title' : size === 'normal' ? 'subtitle' : 'default'}
          style={[styles.brandTitle, size === 'large' && styles.largeBrandTitle]}>
          Fix<ThemedText style={styles.brandAccent}>Hub</ThemedText>
        </ThemedText>
      </View>

      {showTagline && (
        <ThemedText type="small" themeColor="textSecondary" style={styles.tagline}>
          Fast & Reliable Home Services
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.one,
  },
  badge: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: Spacing.one,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandTitle: {
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  largeBrandTitle: {
    fontSize: 38,
    lineHeight: 44,
  },
  brandAccent: {
    color: '#2563EB',
    fontWeight: '800',
  },
  tagline: {
    marginTop: 2,
    textAlign: 'center',
    fontWeight: '500',
  },
});
