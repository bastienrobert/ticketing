import { eventAdapter } from './adapters/events.adapters'
import { fetchApi } from '~/lib/api'

import type { CataloguePageData } from '~/app/(tabs)'

/** Load the catalogue, already sorted by start date by the server; `null` when the payload is unusable. */
export async function getCataloguePage(
  signal: AbortSignal,
): Promise<CataloguePageData | null> {
  const events = await fetchApi('/events', signal)

  if (!Array.isArray(events)) return null

  return {
    events: events.map(eventAdapter),
    categories: [
      ...new Set<string>(events.map((event) => event.category)),
    ].sort(new Intl.Collator('fr').compare),
  }
}
