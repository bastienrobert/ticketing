import { Platform, ScrollView, StyleSheet, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { AccountForm } from './AccountForm'
import { AccountProfile } from './AccountProfile'

import { i18n } from '~/lib/i18n'

import { COLORS } from '~/styles/theme'

export type AccountMode = 'sign-in' | 'sign-up'

export interface AccountCredentials {
  email: string
  password: string
}

export interface AccountProps {
  email: string | null
  error: string | null
  submitting: boolean
  onSubmit: (mode: AccountMode, credentials: AccountCredentials) => void
  onSignOut: () => void
}

export function Account({
  email,
  error,
  submitting,
  onSubmit,
  onSignOut,
}: AccountProps) {
  return (
    <SafeAreaView
      edges={
        Platform.OS === 'ios' ? ['left', 'right'] : ['top', 'left', 'right']
      }
      style={STYLES.screen}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        contentContainerStyle={STYLES.content}>
        <Text accessibilityRole="header" style={STYLES.title}>
          {i18n.t('account.title')}
        </Text>
        <Text style={STYLES.subtitle}>
          {i18n.t(email ? 'account.signed_in' : 'account.subtitle')}
        </Text>

        {email ? (
          <AccountProfile email={email} onSignOut={onSignOut} />
        ) : (
          <AccountForm
            error={error}
            submitting={submitting}
            onSubmit={onSubmit}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const STYLES = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 24,
  },

  title: {
    color: COLORS.text,
    fontSize: 34,
    lineHeight: 41,
    fontWeight: '700',
    letterSpacing: -1,
  },

  subtitle: {
    marginTop: 6,
    marginBottom: 28,
    color: COLORS.muted,
    fontSize: 17,
    lineHeight: 25,
  },
})
