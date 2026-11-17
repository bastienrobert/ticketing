import { Pressable, StyleSheet } from 'react-native'

import { Icon } from '~/components/ui/Icon'

import { i18n } from '~/lib/i18n'

import { COLORS } from '~/styles/theme'

export interface FavoriteButtonProps {
  title: string
  selected: boolean
  onToggle: () => void
}

export function FavoriteButton({
  title,
  selected,
  onToggle,
}: FavoriteButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={i18n.t(
        selected ? 'favorites.remove_label' : 'favorites.add_label',
        { title },
      )}
      accessibilityState={{ selected }}
      style={({ pressed }) => [STYLES.button, pressed && STYLES.pressed]}
      onPress={onToggle}>
      <Icon
        name={selected ? 'heart-filled' : 'heart'}
        color={selected ? COLORS.accent : COLORS.muted}
      />
    </Pressable>
  )
}

const STYLES = StyleSheet.create({
  pressed: { opacity: 0.75 },
  button: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
  },
})
