import { Stack } from 'expo-router';
import { AuthProvider } from '@/context/auth-context';
import './(provider)/i18n'; // Initialize i18next

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
}
