import { useEffect, useEffectEvent } from 'react'
import { AccessibilityInfo, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { COLORS } from '~/styles/theme'

export interface ToastProps {
  message: string | null
  onHide: () => void
}

const DURATION = 4000
const TAB_BAR_MARGIN = 12

export function Toast({ message, onHide }: ToastProps) {
  const insets = useSafeAreaInsets()
  const hide = useEffectEvent(onHide)

  useEffect(() => {
    if (!message) return

    AccessibilityInfo.announceForAccessibility(message)
    const timeout = setTimeout(hide, DURATION)

    return () => clearTimeout(timeout)
  }, [message])

  if (!message) return null

  return (
    <View
      accessibilityRole="alert"
      style={[STYLES.toast, { bottom: insets.bottom + TAB_BAR_MARGIN }]}>
      <Text style={STYLES.message}>{message}</Text>
    </View>
  )
}

const STYLES = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: 20,
    right: 20,
    maxWidth: 560,
    alignSelf: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: COLORS.text,
    pointerEvents: 'none',
  },

  message: {
    color: COLORS.surface,
    fontSize: 14,
    lineHeight: 20,
  },
})
