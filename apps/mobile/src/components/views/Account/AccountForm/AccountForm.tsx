import { useRef, useState, type ComponentRef } from 'react'
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

import { i18n } from '~/lib/i18n'

import type { AccountCredentials, AccountMode } from '../Account'

import { COLORS } from '~/styles/theme'

export interface AccountFormProps {
  error: string | null
  submitting: boolean
  onSubmit: (mode: AccountMode, credentials: AccountCredentials) => void
}

export function AccountForm({ error, submitting, onSubmit }: AccountFormProps) {
  const passwordInput = useRef<ComponentRef<typeof TextInput>>(null)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function onEmailSubmit() {
    passwordInput.current?.focus()
  }

  function onSignInPress() {
    Keyboard.dismiss()
    onSubmit('sign-in', { email, password })
  }

  function onSignUpPress() {
    Keyboard.dismiss()
    onSubmit('sign-up', { email, password })
  }

  return (
    <View style={STYLES.form}>
      <TextInput
        accessibilityLabel={i18n.t('account.email')}
        placeholder={i18n.t('account.email')}
        placeholderTextColor={COLORS.muted}
        value={email}
        autoCapitalize="none"
        autoComplete="email"
        autoCorrect={false}
        keyboardType="email-address"
        textContentType="emailAddress"
        returnKeyType="next"
        submitBehavior="submit"
        style={STYLES.input}
        onChangeText={setEmail}
        onSubmitEditing={onEmailSubmit}
      />

      <TextInput
        ref={passwordInput}
        accessibilityLabel={i18n.t('account.password')}
        placeholder={i18n.t('account.password')}
        placeholderTextColor={COLORS.muted}
        value={password}
        secureTextEntry
        autoComplete="password"
        textContentType="password"
        returnKeyType="go"
        style={STYLES.input}
        onChangeText={setPassword}
        onSubmitEditing={onSignInPress}
      />

      {error && (
        <Text
          accessibilityRole="alert"
          accessibilityLiveRegion="polite"
          style={STYLES.error}>
          {error}
        </Text>
      )}

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: submitting, busy: submitting }}
        disabled={submitting}
        style={({ pressed }) => [
          STYLES.button,
          STYLES.primary,
          (pressed || submitting) && STYLES.pressed,
        ]}
        onPress={onSignInPress}>
        <Text style={STYLES.primaryLabel}>{i18n.t('account.sign_in')}</Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: submitting }}
        disabled={submitting}
        style={({ pressed }) => [
          STYLES.button,
          STYLES.secondary,
          (pressed || submitting) && STYLES.pressed,
        ]}
        onPress={onSignUpPress}>
        <Text style={STYLES.secondaryLabel}>{i18n.t('account.sign_up')}</Text>
      </Pressable>
    </View>
  )
}

const STYLES = StyleSheet.create({
  pressed: { opacity: 0.6 },

  form: { gap: 12 },

  input: {
    minHeight: 48,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: COLORS.control,
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 22,
  },

  error: {
    color: COLORS.error,
    fontSize: 14,
    lineHeight: 20,
  },

  button: {
    minHeight: 48,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
  },

  primary: { marginTop: 8, backgroundColor: COLORS.accent },

  primaryLabel: {
    color: COLORS.surface,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
  },

  secondary: { backgroundColor: COLORS.control },

  secondaryLabel: {
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
  },
})
