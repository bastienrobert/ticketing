import { StyleSheet, Text, View } from 'react-native'

import { Icon } from '~/components/ui/Icon'

import { i18n } from '~/lib/i18n'

import type { CatalogueMode } from '../Catalogue'

import { COLORS } from '~/styles/theme'

export interface CatalogueHeaderProps {
  mode: CatalogueMode
}

export function CatalogueHeader({ mode }: CatalogueHeaderProps) {
  const isFavoritesMode = mode === 'favorites'

  return (
    <View>
      <View style={STYLES.bar}>
        <Icon name="ticket" color={COLORS.text} />
        <Text style={STYLES.brandName}>{i18n.t('navigation.brand')}</Text>
      </View>

      <View style={STYLES.hero}>
        <Text accessibilityRole="header" style={STYLES.title}>
          {i18n.t(isFavoritesMode ? 'favorites.title' : 'catalogue.title')}
        </Text>

        <Text style={STYLES.subtitle}>{i18n.t('catalogue.subtitle')}</Text>
      </View>
    </View>
  )
}

const STYLES = StyleSheet.create({
  bar: {
    minHeight: 64,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },

  brandName: {
    color: COLORS.text,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    letterSpacing: -0.4,
  },

  hero: {
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
    color: COLORS.muted,
    fontSize: 17,
    lineHeight: 25,
  },
})
