import { Pressable, StyleSheet, Text, View } from 'react-native'

import { i18n } from '~/lib/i18n'

import { COLORS } from '~/styles/theme'

export interface AccountProfileProps {
  email: string
  onSignOut: () => void
}

export function AccountProfile({ email, onSignOut }: AccountProfileProps) {
  return (
    <View style={STYLES.card}>
      <View style={STYLES.detail}>
        <Text style={STYLES.label}>{i18n.t('account.email')}</Text>
        <Text style={STYLES.value}>{email}</Text>
      </View>

      <Pressable
        accessibilityRole="button"
        style={({ pressed }) => [STYLES.button, pressed && STYLES.pressed]}
        onPress={onSignOut}>
        <Text style={STYLES.buttonLabel}>{i18n.t('account.sign_out')}</Text>
      </Pressable>
    </View>
  )
}

const STYLES = StyleSheet.create({
  pressed: { opacity: 0.6 },

  card: {
    padding: 20,
    gap: 20,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
  },

  detail: { gap: 6 },

  label: {
    color: COLORS.muted,
    fontSize: 13,
    lineHeight: 18,
  },

  value: {
    color: COLORS.text,
    fontSize: 16,
    lineHeight: 24,
  },

  button: {
    minHeight: 48,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: COLORS.control,
  },

  buttonLabel: {
    color: COLORS.error,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
  },
})
