import { Href, Redirect } from 'expo-router';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useAuth } from '@/context/auth-context';

export default function Index() {
  const { session, role, isLoading, isOnboarded } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!session) {
    if (!isOnboarded) {
      return <Redirect href={'/(auth)/onboarding' as Href} />;
    }
    return <Redirect href={'/(auth)/login' as Href} />;
  }

  if (role === 'provider') {
    return <Redirect href={'/(provider)/provider-dashboard' as Href} />;
  }

  if (role === 'admin') {
    return <Redirect href={'/(admin)/admin-dashboard' as Href} />;
  }

  return <Redirect href={'/(customer)/home' as Href} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
});
