import React, { useState } from 'react';
import { OnboardingScreen } from './onboarding-screen';
import { LoginScreen } from './login-screen';
import { RegistrationScreen } from './registration-screen';
import { CustomerRegisterScreen } from './customer-register-screen';
import { ProviderRegisterScreen } from './provider-register-screen';
import { useAuth } from '@/context/auth-context';
import { UserRole } from '@/lib/supabase';

export type AuthScreenType =
  | 'onboarding'
  | 'login'
  | 'register'
  | 'customer-register'
  | 'provider-register';

interface AuthNavigatorProps {
  initialScreen?: AuthScreenType;
  onLoginSuccess?: (role: UserRole) => void;
}

export function AuthNavigator({
  initialScreen,
  onLoginSuccess,
}: AuthNavigatorProps) {
  const { isOnboarded } = useAuth();
  const [screenOverride, setScreenOverride] = useState<AuthScreenType | null>(initialScreen ?? null);

  const currentScreen: AuthScreenType = screenOverride ?? (isOnboarded ? 'login' : 'onboarding');

  switch (currentScreen) {
    case 'onboarding':
      return (
        <OnboardingScreen
          onNavigateToLogin={() => setScreenOverride('login')}
          onNavigateToRegister={() => setScreenOverride('register')}
        />
      );

    case 'login':
      return (
        <LoginScreen
          onNavigateToOnboarding={() => setScreenOverride('onboarding')}
          onNavigateToRegister={() => setScreenOverride('register')}
          onLoginSuccess={onLoginSuccess}
        />
      );

    case 'register':
      return (
        <RegistrationScreen
          onNavigateToLogin={() => setScreenOverride('login')}
          onNavigateToCustomer={() => setScreenOverride('customer-register')}
          onNavigateToProvider={() => setScreenOverride('provider-register')}
        />
      );

    case 'customer-register':
      return (
        <CustomerRegisterScreen
          onNavigateToLogin={() => setScreenOverride('login')}
          onNavigateToProviderRegister={() => setScreenOverride('provider-register')}
          onRegistrationSuccess={() => setScreenOverride('login')}
        />
      );

    case 'provider-register':
      return (
        <ProviderRegisterScreen
          onNavigateToLogin={() => setScreenOverride('login')}
          onNavigateToCustomerRegister={() => setScreenOverride('customer-register')}
          onRegistrationSuccess={() => setScreenOverride('login')}
        />
      );

    default:
      return (
        <LoginScreen
          onNavigateToOnboarding={() => setScreenOverride('onboarding')}
          onNavigateToRegister={() => setScreenOverride('register')}
          onLoginSuccess={onLoginSuccess}
        />
      );
  }
}
