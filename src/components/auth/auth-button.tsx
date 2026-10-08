import React from 'react';
import {
  Pressable,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: string;
}

export function AuthButton({
  title,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}: AuthButtonProps) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  const getBackgroundColor = () => {
    if (disabled || isLoading) return isDark ? '#374151' : '#CBD5E1';
    switch (variant) {
      case 'primary':
        return '#2563EB';
      case 'secondary':
        return isDark ? '#374151' : '#E2E8F0';
      case 'outline':
        return 'transparent';
      case 'danger':
        return '#EF4444';
      default:
        return '#2563EB';
    }
  };

  const getTextColor = () => {
    if (disabled || isLoading) return isDark ? '#9CA3AF' : '#64748B';
    switch (variant) {
      case 'primary':
      case 'danger':
        return '#FFFFFF';
      case 'secondary':
        return colors.text;
      case 'outline':
        return '#2563EB';
      default:
        return '#FFFFFF';
    }
  };

  const getBorderColor = () => {
    if (variant === 'outline') {
      return disabled ? (isDark ? '#4B5563' : '#CBD5E1') : '#2563EB';
    }
    return 'transparent';
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isLoading}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1.5 : 0,
          opacity: pressed ? 0.85 : 1,
        },
        style,
      ]}>
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' || variant === 'danger' ? '#FFFFFF' : '#2563EB'}
        />
      ) : (
        <ThemedText
          type="default"
          style={[
            styles.text,
            {
              color: getTextColor(),
            },
            textStyle,
          ]}>
          {icon ? `${icon}  ` : ''}
          {title}
        </ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    minHeight: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.two,
    flexDirection: 'row',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
