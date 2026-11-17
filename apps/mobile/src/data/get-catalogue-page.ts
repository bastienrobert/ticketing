import { eventAdapter } from './adapters/events.adapters'
import { MOCK_EVENTS } from './mocks/events'

import type { CataloguePageData } from '~/app/(tabs)'

/** Assemble the local mock catalogue without any asynchronous loading. */
export function getCataloguePage(): CataloguePageData {
  const sorted = [...MOCK_EVENTS].sort((first, second) => {
    return Date.parse(first.startsAt) - Date.parse(second.startsAt)
  })
  const categories = Array.from(
    new Set(sorted.map((event) => event.category)),
  ).sort((first, second) => first.localeCompare(second, 'fr'))

  return { events: sorted.map(eventAdapter), categories }
}
