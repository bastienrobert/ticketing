import { Catalogue } from '~/components/views/Catalogue'

import { getCataloguePage } from '~/data/get-catalogue-page'

import type { EventCardParams } from '~/components/ui/EventCard'

export interface CataloguePageData {
  events: EventCardParams[]
  categories: string[]
}

export default function CataloguePage() {
  const { events, categories } = getCataloguePage()

  return <Catalogue mode="all" events={events} categories={categories} />
}
