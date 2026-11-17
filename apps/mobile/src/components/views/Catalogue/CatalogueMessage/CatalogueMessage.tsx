import { Pressable, StyleSheet, Text, View } from 'react-native'

import { COLORS } from '~/styles/theme'

export interface CatalogueMessageProps {
  title: string
  description: string
  button?: {
    label: string
    onPress: () => void
  }
}

export function CatalogueMessage({
  title,
  description,
  button,
}: CatalogueMessageProps) {
  return (
    <View style={STYLES.container}>
      <Text style={STYLES.title}>{title}</Text>

      <Text style={STYLES.description}>{description}</Text>

      {button && (
        <Pressable
          accessibilityRole="button"
          style={({ pressed }) => [STYLES.button, pressed && STYLES.pressed]}
          onPress={button.onPress}>
          <Text style={STYLES.buttonLabel}>{button.label}</Text>
        </Pressable>
      )}
    </View>
  )
}

const STYLES = StyleSheet.create({
  pressed: { opacity: 0.75 },

  container: {
    minHeight: 220,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: COLORS.surface,
  },

  title: {
    color: COLORS.text,
    fontSize: 18,
    lineHeight: 25,
    fontWeight: '600',
    textAlign: 'center',
  },

  description: {
    marginTop: 8,
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
  },

  button: {
    minHeight: 44,
    marginTop: 20,
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
