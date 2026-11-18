import type { ReactNode } from 'react'
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View,
  type ListRenderItemInfo,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { CatalogueMessage } from '../CatalogueMessage'
import { EventCard, type EventCardParams } from '~/components/ui/EventCard'

import { i18n } from '~/lib/i18n'

import type { CatalogueMode } from '../Catalogue'

import { COLORS } from '~/styles/theme'

export interface CatalogueResultsProps {
  mode: CatalogueMode
  events: EventCardParams[]
  totalCount: number
  favoriteIds: number[]
  refreshing: boolean
  children: ReactNode
  onRefresh: () => void
  onEventPress: (eventId: number) => void
  onFavoriteToggle: (eventId: number) => void
  onFiltersReset: () => void
  onBrowsePress: () => void
}

export function CatalogueResults({
  mode,
  events,
  totalCount,
  favoriteIds,
  refreshing,
  children,
  onRefresh,
  onEventPress,
  onFavoriteToggle,
  onFiltersReset,
  onBrowsePress,
}: CatalogueResultsProps) {
  const title = i18n.t(
    mode === 'favorites'
      ? 'favorites.section_title'
      : 'catalogue.section_title',
  )

  function renderEvent({ item }: ListRenderItemInfo<EventCardParams>) {
    return (
      <EventCard
        {...item}
        favorite={favoriteIds.includes(item.id)}
        onPress={() => onEventPress(item.id)}
        onFavoriteToggle={() => onFavoriteToggle(item.id)}
      />
    )
  }

  function renderEmptyState() {
    if (mode === 'favorites' && favoriteIds.length === 0) {
      return (
        <CatalogueMessage
          title={i18n.t('favorites.empty.title')}
          description={i18n.t('favorites.empty.description')}
          button={{
            label: i18n.t('favorites.empty.button'),
            onPress: onBrowsePress,
          }}
        />
      )
    }

    if (totalCount === 0) {
      return (
        <CatalogueMessage
          title={i18n.t('catalogue.empty.title')}
          description={i18n.t('catalogue.empty.description')}
        />
      )
    }

    return (
      <CatalogueMessage
        title={i18n.t('catalogue.no_results.title')}
        description={i18n.t('catalogue.no_results.description')}
        button={{
          label: i18n.t('catalogue.no_results.button'),
          onPress: onFiltersReset,
        }}
      />
    )
  }

  const header = (
    <View>
      {children}

      <View style={STYLES.heading}>
        <Text accessibilityRole="header" style={STYLES.sectionTitle}>
          {title}
        </Text>

        <Text accessibilityLiveRegion="polite" style={STYLES.count}>
          {i18n.t('catalogue.event_count', { count: events.length })}
        </Text>
      </View>
    </View>
  )

  return (
    <SafeAreaView
      edges={
        Platform.OS === 'ios' ? ['left', 'right'] : ['top', 'left', 'right']
      }
      style={STYLES.screen}>
      <FlatList
        data={events}
        extraData={favoriteIds}
        ListHeaderComponent={header}
        ListEmptyComponent={renderEmptyState()}
        contentInsetAdjustmentBehavior="automatic"
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        contentContainerStyle={STYLES.content}
        keyExtractor={(event) => String(event.id)}
        renderItem={renderEvent}
        onRefresh={onRefresh}
      />
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
    gap: 12,
  },

  heading: {
    paddingTop: 28,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 12,
  },

  sectionTitle: {
    color: COLORS.text,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600',
    letterSpacing: -0.4,
  },

  count: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 18,
  },
})
