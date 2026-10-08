import { Stack } from 'expo-router';
import './(provider)/i18n'; // Initialize i18next

export default function RootLayout() {
    return <Stack screenOptions={{ headerShown: false }} />;
}