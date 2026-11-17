import { Pressable, StyleSheet, Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { COLORS } from '~/styles/theme'

export interface MessageProps {
  title: string
  description: string
  button: {
    label: string
    onPress: () => void
  }
}

export function Message({ title, description, button }: MessageProps) {
  return (
    <SafeAreaView style={STYLES.screen}>
      <Text accessibilityRole="header" style={STYLES.title}>
        {title}
      </Text>
      <Text style={STYLES.description}>{description}</Text>

      <Pressable
        accessibilityRole="button"
        style={({ pressed }) => [STYLES.button, pressed && STYLES.pressed]}
        onPress={button.onPress}>
        <Text style={STYLES.buttonLabel}>{button.label}</Text>
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
