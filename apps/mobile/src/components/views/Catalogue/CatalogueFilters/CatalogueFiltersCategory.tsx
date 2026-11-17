import { Pressable, StyleSheet, Text } from 'react-native'

import { i18n } from '~/lib/i18n'

import { COLORS } from '~/styles/theme'

interface CatalogueFiltersCategoryProps {
  label: string
  selected: boolean
  onPress: () => void
}

export function CatalogueFiltersCategory({
  label,
  selected,
  onPress,
}: CatalogueFiltersCategoryProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={i18n.t('catalogue.category_label', {
        category: label,
      })}
      accessibilityState={{ selected }}
      style={({ pressed }) => {
        return [
          STYLES.button,
          selected && STYLES.selected,
          pressed && STYLES.pressed,
        ]
      }}
      onPress={onPress}>
      <Text style={[STYLES.label, selected && STYLES.selectedLabel]}>
        {label}
      </Text>
    </Pressable>
  )
}

const STYLES = StyleSheet.create({
  pressed: { opacity: 0.75 },

  button: {
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 11,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 22,
    backgroundColor: COLORS.control,
  },

  selected: { backgroundColor: COLORS.text },

  label: {
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
  },

  selectedLabel: { color: COLORS.surface },
})
