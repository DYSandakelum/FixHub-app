import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

interface BackButtonProps {
    color?: string;
    style?: ViewStyle;
    onPress?: () => void;
    iconName?: 'chevron-left' | 'arrow-back';
    size?: number;
}

export default function BackButton({
    color = '#FFFFFF',
    style,
    onPress,
    iconName = 'chevron-left',
    size = 26,
}: BackButtonProps) {
    const router = useRouter();

    const isLightOrWhite =
        color === '#FFFFFF' ||
        color === '#fff' ||
        color.toLowerCase() === '#ffffff' ||
        color.toLowerCase() === 'white';

    const handlePress = () => {
        if (onPress) {
            onPress();
        } else if (router.canGoBack()) {
            router.back();
        } else {
            router.push('/(customer)/home');
        }
    };

    return (
        <TouchableOpacity
            style={[
                styles.button,
                isLightOrWhite ? styles.darkHeaderBtn : styles.lightHeaderBtn,
                style,
            ]}
            onPress={handlePress}
            activeOpacity={0.7}
        >
            <MaterialIcons name={iconName} size={size} color={color} />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    darkHeaderBtn: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
    },
    lightHeaderBtn: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 1 },
        elevation: 2,
    },
});