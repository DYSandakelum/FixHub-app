import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { FixHubLogo } from './fixhub-logo';
import { Spacing, MaxContentWidth } from '@/constants/theme';

interface RegistrationScreenProps {
  onNavigateToLogin: () => void;
  onNavigateToCustomer: () => void;
  onNavigateToProvider: () => void;
}

export function RegistrationScreen({
  onNavigateToLogin,
  onNavigateToCustomer,
  onNavigateToProvider,
}: RegistrationScreenProps) {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Pressable onPress={onNavigateToLogin} style={styles.backButton}>
            <ThemedText style={styles.backArrow}>←</ThemedText>
            <ThemedText type="small" style={styles.backButtonText}>Back to Login</ThemedText>
          </Pressable>

          <View style={styles.header}>
            <FixHubLogo size="normal" showTagline={false} />
            <ThemedText type="subtitle" style={styles.title}>Create your FixHub account</ThemedText>
            <ThemedText type="small" style={styles.subtitle}>
              Choose the account type that fits how you use FixHub.
            </ThemedText>
          </View>

          <View style={styles.options}>
            <Pressable
              onPress={onNavigateToCustomer}
              accessibilityRole="button"
              accessibilityLabel="Register as Customer"
              style={({ pressed }) => [
                styles.option,
                { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' },
                pressed && styles.pressed,
              ]}>
              <View style={[styles.iconWrap, { backgroundColor: 'rgba(37, 99, 235, 0.12)' }]}>
                <ThemedText style={styles.icon}>👤</ThemedText>
              </View>
              <View style={styles.optionCopy}>
                <ThemedText type="subtitle" style={styles.optionTitle}>Customer</ThemedText>
                <ThemedText type="small" style={styles.optionDesc}>Book home services</ThemedText>
              </View>
              <ThemedText style={styles.chevron}>›</ThemedText>
            </Pressable>

            <Pressable
              onPress={onNavigateToProvider}
              accessibilityRole="button"
              accessibilityLabel="Register as Provider"
              style={({ pressed }) => [
                styles.option,
                { backgroundColor: '#F8FAFC', borderColor: '#E2E8F0' },
                pressed && styles.pressed,
              ]}>
              <View style={[styles.iconWrap, { backgroundColor: 'rgba(245, 158, 11, 0.14)' }]}>
                <ThemedText style={styles.icon}>🛠️</ThemedText>
              </View>
              <View style={styles.optionCopy}>
                <ThemedText type="subtitle" style={styles.optionTitle}>Provider</ThemedText>
                <ThemedText type="small" style={styles.optionDesc}>Offer your services</ThemedText>
              </View>
              <ThemedText style={styles.chevron}>›</ThemedText>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  safeArea: { flex: 1 },
  scrollContent: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.six,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  backButton: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, paddingVertical: Spacing.two },
  backArrow: { fontSize: 18, color: '#2563EB', fontWeight: '700' },
  backButtonText: { color: '#64748B', fontSize: 14 },
  header: { alignItems: 'center', marginTop: Spacing.five, marginBottom: Spacing.five, gap: Spacing.two },
  title: { fontSize: 26, fontWeight: '700', textAlign: 'center', color: '#0F172A' },
  subtitle: { textAlign: 'center', maxWidth: 320, color: '#64748B', fontSize: 14 },
  options: { width: '100%', gap: Spacing.three },
  option: {
    minHeight: 104,
    borderWidth: 1.5,
    borderRadius: 14,
    padding: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  pressed: { opacity: 0.82 },
  iconWrap: { width: 52, height: 52, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 26 },
  optionCopy: { flex: 1, gap: 4 },
  optionTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
  optionDesc: { fontSize: 13, color: '#64748B' },
  chevron: { fontSize: 30, color: '#2563EB', fontWeight: '300' },
});
