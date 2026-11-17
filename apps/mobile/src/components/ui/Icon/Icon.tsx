import { SymbolView, type SymbolViewProps } from 'expo-symbols'

import { COLORS } from '~/styles/theme'

const SYMBOLS = Object.freeze({
  close: { ios: 'xmark', android: 'close', web: 'close' },
  heart: { ios: 'heart', android: 'favorite_border', web: 'favorite_border' },
  'heart-filled': { ios: 'heart.fill', android: 'favorite', web: 'favorite' },
  search: { ios: 'magnifyingglass', android: 'search', web: 'search' },
  ticket: {
    ios: 'ticket',
    android: 'confirmation_number',
    web: 'confirmation_number',
  },
} satisfies Record<string, SymbolViewProps['name']>)

export interface IconProps {
  name: keyof typeof SYMBOLS
  color?: string
  size?: number
}

export function Icon({ name, color = COLORS.muted, size = 20 }: IconProps) {
  return (
    <SymbolView
      name={SYMBOLS[name]}
      tintColor={color}
      size={size}
      accessible={false}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    />
  )
}
