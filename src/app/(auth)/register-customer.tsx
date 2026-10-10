import { Href, useRouter } from 'expo-router';
import { CustomerRegisterScreen } from '@/components/auth/customer-register-screen';

export default function RegisterCustomerRoute() {
  const router = useRouter();

  return (
    <CustomerRegisterScreen
      onNavigateToLogin={() => router.push('/(auth)/login' as Href)}
      onNavigateToProviderRegister={() => router.push('/(auth)/register-provider' as Href)}
      onRegistrationSuccess={() => router.replace('/(customer)/home' as Href)}
    />
  );
}