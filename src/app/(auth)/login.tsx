import { Href, useRouter } from 'expo-router';
import { LoginScreen } from '@/components/auth/login-screen';

export default function LoginRoute() {
  const router = useRouter();

  return (
    <LoginScreen
      onNavigateToOnboarding={() => router.push('/(auth)/onboarding' as Href)}
      onNavigateToRegister={() => router.push('/(auth)/register' as Href)}
      onLoginSuccess={(role) => {
        if (role === 'provider') {
          router.replace('/(provider)/provider-dashboard' as Href);
        } else if (role === 'admin') {
          router.replace('/(admin)/admin-dashboard' as Href);
        } else {
          router.replace('/(customer)/home' as Href);
        }
      }}
    />
  );
}