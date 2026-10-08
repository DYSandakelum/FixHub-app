import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function CustomerTabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#2563EB',
                tabBarInactiveTintColor: '#60646C',
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="bookings"
                options={{
                    title: 'Bookings',
                    tabBarIcon: ({ color, size }) => <Ionicons name="calendar-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="messages"
                options={{
                    title: 'Messages',
                    tabBarIcon: ({ color, size }) => <Ionicons name="chatbubble-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: 'Settings',
                    tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
                }}
            />
            <Tabs.Screen
                name="edit-profile"
                options={{ href: null }}
            />
        </Tabs>
    );
}