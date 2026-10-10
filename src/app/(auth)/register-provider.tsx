import { Href, useRouter } from 'expo-router';
import { ProviderRegisterScreen } from '@/components/auth/provider-register-screen';

export default function RegisterProviderRoute() {
  const router = useRouter();

  return (
    <ProviderRegisterScreen
      onNavigateToLogin={() => router.push('/(auth)/login' as Href)}
      onNavigateToCustomerRegister={() => router.push('/(auth)/register-customer' as Href)}
      onRegistrationSuccess={() => router.replace('/(provider)/provider-dashboard' as Href)}
    />
  );
}