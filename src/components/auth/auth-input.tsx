import React, { useState } from 'react';
import {
  View,
  TextInput,
  TextInputProps,
  Pressable,
  StyleSheet,
} from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

interface AuthInputProps extends TextInputProps {
  label: string;
  error?: string;
  isPassword?: boolean;
  leftIcon?: string;
}

export function AuthInput({
  label,
  error,
  isPassword = false,
  leftIcon,
  style,
  ...props
}: AuthInputProps) {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const borderColor = error
    ? '#EF4444'
    : isFocused
    ? '#2563EB'
    : isDark
    ? '#374151'
    : '#E5E7EB';

  const backgroundColor = '#F9FAFB';

  return (
    <View style={styles.container}>
      <ThemedText type="smallBold" style={styles.label}>
        {label}
      </ThemedText>

      <View
        style={[
          styles.inputWrapper,
          {
            borderColor,
            backgroundColor,
          },
        ]}>
        {leftIcon && <ThemedText style={styles.icon}>{leftIcon}</ThemedText>}

        <TextInput
          placeholderTextColor={isDark ? '#6B7280' : '#9CA3AF'}
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            styles.textInput,
            {
              color: colors.text,
            },
            style,
          ]}
          {...props}
        />

        {isPassword && (
          <Pressable
            hitSlop={8}
            onPress={() => setShowPassword((prev) => !prev)}
            style={styles.eyeButton}
            accessibilityRole="button"
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}>
            <ThemedText type="small" style={styles.eyeText}>
              {showPassword ? '🙈 Hide' : '👁️ Show'}
            </ThemedText>
          </Pressable>
        )}
      </View>

      {error ? (
        <ThemedText type="small" style={styles.errorText}>
          {error}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: Spacing.three,
  },
  label: {
    marginBottom: 6,
    fontSize: 13,
    letterSpacing: 0.2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    minHeight: 48,
  },
  icon: {
    marginRight: Spacing.two,
    fontSize: 16,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 10,
  },
  eyeButton: {
    paddingHorizontal: Spacing.one,
    paddingVertical: 4,
    borderRadius: 6,
  },
  eyeText: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 2,
    fontWeight: '500',
  },
});
