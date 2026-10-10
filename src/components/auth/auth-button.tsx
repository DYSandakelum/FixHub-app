import React from 'react';
import {
  Pressable,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
  Text,
} from 'react-native';
import { Spacing } from '@/constants/theme';

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
  const getBackgroundColor = () => {
    if (disabled || isLoading) return '#E2E8F0';
    switch (variant) {
      case 'primary':
        return '#2563EB';
      case 'secondary':
        return '#F1F5F9';
      case 'outline':
        return 'transparent';
      case 'danger':
        return '#EF4444';
      default:
        return '#2563EB';
    }
  };

  const getTextColor = () => {
    if (disabled || isLoading) return '#94A3B8';
    switch (variant) {
      case 'primary':
      case 'danger':
        return '#FFFFFF';
      case 'secondary':
        return '#0F172A';
      case 'outline':
        return '#2563EB';
      default:
        return '#FFFFFF';
    }
  };

  const getBorderColor = () => {
    if (variant === 'outline') {
      return disabled ? '#E2E8F0' : '#2563EB';
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
        <Text
          style={[
            styles.text,
            {
              color: getTextColor(),
            },
            textStyle,
          ]}>
          {icon ? `${icon}  ` : ''}
          {title}
        </Text>
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
