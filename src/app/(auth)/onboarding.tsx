import { Href, useRouter } from 'expo-router';
import { OnboardingScreen } from '@/components/auth/onboarding-screen';

export default function OnboardingRoute() {
  const router = useRouter();

  return (
    <OnboardingScreen
      onNavigateToLogin={() => router.push('/(auth)/login' as Href)}
      onNavigateToRegister={() => router.push('/(auth)/register' as Href)}
    />
  );
}