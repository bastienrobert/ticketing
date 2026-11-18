import { eventsRepository } from '~/repositories/events.repository'

import { catalogueAdapter } from './adapters/events.adapters'

import type { CataloguePageData } from '~/app/(tabs)'

/** Load the catalogue, already sorted by start date by the server; `null` when the payload is unusable. */
export async function getCataloguePage(
  signal: AbortSignal,
): Promise<CataloguePageData | null> {
  const events = await eventsRepository.getAll(signal)

  if (!Array.isArray(events)) return null

  return catalogueAdapter(events)
}
