import { Stack } from 'expo-router';
import './i18n';

export default function ProviderLayout() {
    return <Stack screenOptions={{ headerShown: false }} />;
}