import { Catalogue } from '~/components/views/Catalogue'

import { getCataloguePage } from '~/data/get-catalogue-page'

export default function FavoritesPage() {
  const { events, categories } = getCataloguePage()

  return <Catalogue mode="favorites" events={events} categories={categories} />
}
