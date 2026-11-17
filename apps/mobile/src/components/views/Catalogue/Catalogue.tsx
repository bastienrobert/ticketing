import { use, useState } from 'react'
import { Keyboard } from 'react-native'
import { useRouter } from 'expo-router'

import { CatalogueFilters } from './CatalogueFilters'
import { CatalogueHeader } from './CatalogueHeader'
import { CatalogueResults } from './CatalogueResults'

import { useFavoritesContext } from '~/contexts/FavoritesContext'

import type { EventCardParams } from '~/components/ui/EventCard'

export type CatalogueMode = 'all' | 'favorites'

export interface CatalogueProps {
  mode: CatalogueMode
  page: Promise<{ events: EventCardParams[]; categories: string[] } | null>
  refreshing: boolean
  onRefresh: () => void
}

function normalizeSearch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim()
    .toLocaleLowerCase('fr')
}

export function Catalogue({
  mode,
  page,
  refreshing,
  onRefresh,
}: CatalogueProps) {
  const router = useRouter()
  const { favoriteIds, toggleFavorite } = useFavoritesContext()
  const { events, categories } = use(page) ?? { events: [], categories: [] }

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<string | null>(null)

  const search = normalizeSearch(query)
  const filtered = events.filter((event) => {
    return (
      normalizeSearch(event.title).includes(search) &&
      (category === null || event.category === category) &&
      (mode === 'all' || favoriteIds.includes(event.id))
    )
  })

  function onCategoryChange(nextCategory: string | null) {
    Keyboard.dismiss()
    setCategory(nextCategory)
  }

  function onEventPress(eventId: number) {
    Keyboard.dismiss()
    router.push({ pathname: '/events/[id]', params: { id: eventId } })
  }

  function onFiltersReset() {
    Keyboard.dismiss()
    setCategory(null)
    setQuery('')
  }

  function onBrowsePress() {
    Keyboard.dismiss()
    router.navigate('/')
  }

  return (
    <CatalogueResults
      mode={mode}
      events={filtered}
      totalCount={events.length}
      favoriteIds={favoriteIds}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onEventPress={onEventPress}
      onFavoriteToggle={toggleFavorite}
      onFiltersReset={onFiltersReset}
      onBrowsePress={onBrowsePress}>
      <CatalogueHeader mode={mode} />

      <CatalogueFilters
        query={query}
        category={category}
        categories={categories}
        onQueryChange={setQuery}
        onCategoryChange={onCategoryChange}
      />
    </CatalogueResults>
  )
}
