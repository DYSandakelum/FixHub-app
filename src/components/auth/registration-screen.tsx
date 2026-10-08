import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
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
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Pressable onPress={onNavigateToLogin} style={styles.backButton}>
            <ThemedText style={styles.backArrow}>←</ThemedText>
            <ThemedText type="small" themeColor="textSecondary">Back to Login</ThemedText>
          </Pressable>

          <View style={styles.header}>
            <FixHubLogo size="normal" showTagline={false} />
            <ThemedText type="subtitle" style={styles.title}>Create your FixHub account</ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.subtitle}>
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
                { backgroundColor: '#F8FAFC', borderColor: '#D9E4F0' },
                pressed && styles.pressed,
              ]}>
              <View style={[styles.iconWrap, { backgroundColor: 'rgba(32, 138, 239, 0.12)' }]}>
                <ThemedText style={styles.icon}>👤</ThemedText>
              </View>
              <View style={styles.optionCopy}>
                <ThemedText type="subtitle" style={styles.optionTitle}>Customer</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">Book home services</ThemedText>
              </View>
              <ThemedText style={styles.chevron}>›</ThemedText>
            </Pressable>

            <Pressable
              onPress={onNavigateToProvider}
              accessibilityRole="button"
              accessibilityLabel="Register as Provider"
              style={({ pressed }) => [
                styles.option,
                { backgroundColor: '#F8FAFC', borderColor: '#D9E4F0' },
                pressed && styles.pressed,
              ]}>
              <View style={[styles.iconWrap, { backgroundColor: 'rgba(245, 158, 11, 0.14)' }]}>
                <ThemedText style={styles.icon}>🛠️</ThemedText>
              </View>
              <View style={styles.optionCopy}>
                <ThemedText type="subtitle" style={styles.optionTitle}>Provider</ThemedText>
                <ThemedText type="small" themeColor="textSecondary">Offer your services</ThemedText>
              </View>
              <ThemedText style={styles.chevron}>›</ThemedText>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  header: { alignItems: 'center', marginTop: Spacing.five, marginBottom: Spacing.five, gap: Spacing.two },
  title: { fontSize: 26, fontWeight: '700', textAlign: 'center' },
  subtitle: { textAlign: 'center', maxWidth: 320 },
  options: { width: '100%', gap: Spacing.three },
  option: {
    minHeight: 104,
    borderWidth: 1,
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
  optionTitle: { fontSize: 18, fontWeight: '700', color: '#2563EB' },
  chevron: { fontSize: 30, color: '#2563EB', fontWeight: '300' },
});
