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
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const borderColor = error
    ? '#EF4444'
    : isFocused
    ? '#2563EB'
    : '#E2E8F0';

  const backgroundColor = '#F8FAFC';

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
          placeholderTextColor="#94A3B8"
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            styles.textInput,
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
    color: '#0F172A',
    fontWeight: '600',
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
    color: '#64748B',
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 10,
    color: '#0F172A',
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
