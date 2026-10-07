import { Redirect } from 'expo-router';

export default function Index() {

    return <Redirect href="/(customer)/home" />;

    // return <Redirect href="/(booking)/home" />;

    // return <Redirect href="/(admin)/admin-dashboard" />;
}

// TEMP: testing Home screen directly - change back to /(auth)/onboarding later