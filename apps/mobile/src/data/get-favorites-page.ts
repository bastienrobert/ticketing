import { favoritesRepository } from '~/repositories/favorites.repository'

import { catalogueAdapter } from './adapters/events.adapters'

import type { CataloguePageData } from '~/app/(tabs)'

/** The favorites kept on the phone: no request, so the page shows at once, offline too. */
export async function getFavoritesPage(): Promise<CataloguePageData> {
  return catalogueAdapter(favoritesRepository.getAll())
}
