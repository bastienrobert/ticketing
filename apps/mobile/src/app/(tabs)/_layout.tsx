import { NativeTabs } from 'expo-router/native-tabs'

import { useFavoritesContext } from '~/contexts/FavoritesContext'

import { i18n } from '~/lib/i18n'

import { COLORS } from '~/styles/theme'

export default function TabsLayout() {
  const { favoriteIds } = useFavoritesContext()

  return (
    <NativeTabs
      backBehavior="initialRoute"
      tintColor={COLORS.accent}
      disableTransparentOnScrollEdge>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'ticket', selected: 'ticket.fill' }}
          md="confirmation_number"
        />
        <NativeTabs.Trigger.Label>
          {i18n.t('catalogue.title')}
        </NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger
        name="favorites"
        accessibilityLabel={i18n.t('favorites.count_label', {
          count: favoriteIds.length,
        })}>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'heart', selected: 'heart.fill' }}
          md={{ default: 'favorite_border', selected: 'favorite' }}
        />
        <NativeTabs.Trigger.Label>
          {i18n.t('favorites.title')}
        </NativeTabs.Trigger.Label>
        {favoriteIds.length > 0 && (
          <NativeTabs.Trigger.Badge>
            {String(favoriteIds.length)}
          </NativeTabs.Trigger.Badge>
        )}
      </NativeTabs.Trigger>
    </NativeTabs>
  )
}
