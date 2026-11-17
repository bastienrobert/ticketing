import { Platform, ScrollView, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { CatalogueHeader } from '../CatalogueHeader'
import { EventCardLoading } from '~/components/ui/EventCard'
import { Skeleton } from '~/components/ui/Skeleton'

import { i18n } from '~/lib/i18n'

import type { CatalogueMode } from '../Catalogue'

import { COLORS } from '~/styles/theme'

export interface CatalogueLoadingProps {
  mode: CatalogueMode
}

const CATEGORY_WIDTHS = [72, 88, 96, 64]

// mirrors CatalogueResults: the real header, then the filters, the section title and three cards
export function CatalogueLoading({ mode }: CatalogueLoadingProps) {
  return (
    <SafeAreaView
      edges={
        Platform.OS === 'ios' ? ['left', 'right'] : ['top', 'left', 'right']
      }
      style={STYLES.screen}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        scrollEnabled={false}
        contentContainerStyle={STYLES.content}>
        <CatalogueHeader mode={mode} />

        <View
          accessible
          accessibilityLabel={i18n.t('catalogue.loading')}
          accessibilityState={{ busy: true }}>
          <View style={STYLES.filters}>
            <Skeleton style={STYLES.search} />

            <View style={STYLES.categories}>
              {CATEGORY_WIDTHS.map((width) => {
                return (
                  <Skeleton key={width} style={[STYLES.category, { width }]} />
                )
              })}
            </View>
          </View>

          <Skeleton style={STYLES.sectionTitle} />

          <View style={STYLES.cards}>
            <EventCardLoading />
            <EventCardLoading />
            <EventCardLoading />
          </View>
        </View>
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
    paddingBottom: 24,
  },

  filters: { gap: 12 },

  search: { height: 48, borderRadius: 12 },

  categories: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 2,
  },

  category: { height: 44, borderRadius: 22 },

  sectionTitle: {
    width: 140,
    height: 24,
    marginTop: 30,
    marginBottom: 30,
  },

  cards: { gap: 12 },
})
