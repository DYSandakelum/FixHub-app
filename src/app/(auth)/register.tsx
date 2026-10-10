import { Href, useRouter } from 'expo-router';
import { RegistrationScreen } from '@/components/auth/registration-screen';

export default function RegisterRoute() {
  const router = useRouter();

  return (
    <RegistrationScreen
      onNavigateToLogin={() => router.push('/(auth)/login' as Href)}
      onNavigateToCustomer={() => router.push('/(auth)/register-customer' as Href)}
      onNavigateToProvider={() => router.push('/(auth)/register-provider' as Href)}
    />
  );
}
