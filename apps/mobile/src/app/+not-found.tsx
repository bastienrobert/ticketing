import { Pressable, StyleSheet, Text } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { i18n } from '~/lib/i18n'

import { COLORS } from '~/styles/theme'

export default function NotFoundPage() {
  const router = useRouter()

  // the catalogue is anchored under every deep link, so this returns to it
  function onBrowsePress() {
    router.dismissTo('/')
  }

  return (
    <SafeAreaView style={STYLES.screen}>
      <Text accessibilityRole="header" style={STYLES.title}>
        {i18n.t('navigation.not_found.title')}
      </Text>
      <Text style={STYLES.description}>
        {i18n.t('navigation.not_found.description')}
      </Text>

      <Pressable
        accessibilityRole="button"
        style={({ pressed }) => [STYLES.button, pressed && STYLES.pressed]}
        onPress={onBrowsePress}>
        <Text style={STYLES.buttonLabel}>
          {i18n.t('navigation.not_found.button')}
        </Text>
      </Pressable>
    </SafeAreaView>
  )
}

const STYLES = StyleSheet.create({
  pressed: { opacity: 0.75 },

  screen: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },

  title: {
    color: COLORS.text,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
    textAlign: 'center',
  },

  description: {
    marginTop: 8,
    color: COLORS.muted,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },

  button: {
    minHeight: 44,
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: COLORS.accent,
  },

  buttonLabel: {
    color: COLORS.surface,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '500',
  },
})
