import * as Device from 'expo-device';
import { Platform, StyleSheet, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedIcon } from '@/components/animated-icon';
import { HintRow } from '@/components/hint-row';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { WebBadge } from '@/components/web-badge';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';

function getDevMenuHint() {
  if (Platform.OS === 'web') {
    return <ThemedText type="small">use browser devtools</ThemedText>;
  }
  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        shake device or press <ThemedText type="code">m</ThemedText> in terminal
      </ThemedText>
    );
  }
  const shortcut = Platform.OS === 'android' ? 'cmd+m (or ctrl+m)' : 'cmd+d';
  return (
    <ThemedText type="small">
      press <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}

export default function HomeScreen() {
  const { user, profile, role, signOut } = useAuth();

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'FixHub User';
  const roleDisplay = role === 'provider' ? 'Service Provider' : 'Customer';

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* FixHub Authenticated Member Banner */}
        <View style={styles.userCard}>
          <View style={styles.userCardInfo}>
            <ThemedText type="smallBold" style={styles.userName}>
              👤 {displayName}
            </ThemedText>
            <View style={styles.badgeRow}>
              <View
                style={[
                  styles.roleBadge,
                  {
                    backgroundColor:
                      role === 'provider'
                        ? 'rgba(245, 158, 11, 0.15)'
                        : 'rgba(32, 138, 239, 0.15)',
                  },
                ]}>
                <ThemedText
                  type="small"
                  style={[
                    styles.roleBadgeText,
                    { color: role === 'provider' ? '#D97706' : '#2563EB' },
                  ]}>
                  {roleDisplay}
                  {profile?.service_category ? ` • ${profile.service_category}` : ''}
                </ThemedText>
              </View>
              {user?.email ? (
                <ThemedText type="small" themeColor="textSecondary" style={styles.userEmail}>
                  {user.email}
                </ThemedText>
              ) : null}
            </View>
          </View>

          <Pressable onPress={signOut} style={styles.signOutButton}>
            <ThemedText type="small" style={styles.signOutText}>
              Sign Out
            </ThemedText>
          </Pressable>
        </View>

        <ThemedView style={styles.heroSection}>
          <AnimatedIcon />
          <ThemedText type="title" style={styles.title}>
            FixHub
          </ThemedText>
        </ThemedView>

        <ThemedText type="code" style={styles.code}>
          {role === 'provider' ? 'provider dashboard active' : 'customer portal active'}
        </ThemedText>

        <ThemedView type="backgroundElement" style={styles.stepContainer}>
          <HintRow
            title="Try editing"
            hint={<ThemedText type="code">src/app/index.tsx</ThemedText>}
          />
          <HintRow title="Dev tools" hint={getDevMenuHint()} />
          <HintRow
            title="Fresh start"
            hint={<ThemedText type="code">npm run reset-project</ThemedText>}
          />
        </ThemedView>

        {Platform.OS === 'web' && <WebBadge />}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
  },
  heroSection: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingHorizontal: Spacing.four,
    gap: Spacing.four,
  },
  title: {
    textAlign: 'center',
  },
  code: {
    textTransform: 'uppercase',
  },
  stepContainer: {
    gap: Spacing.three,
    alignSelf: 'stretch',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    borderRadius: Spacing.four,
  },
  userCard: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(32, 138, 239, 0.25)',
    backgroundColor: 'rgba(32, 138, 239, 0.06)',
    marginTop: Spacing.one,
  },
  userCardInfo: {
    flex: 1,
    gap: 2,
  },
  userName: {
    fontSize: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  userEmail: {
    fontSize: 11,
  },
  signOutButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  signOutText: {
    color: '#EF4444',
    fontSize: 12,
    fontWeight: '600',
  },
});
