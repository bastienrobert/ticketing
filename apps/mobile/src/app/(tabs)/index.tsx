import { Suspense } from 'react'
import type { ErrorBoundaryProps } from 'expo-router'

import { Catalogue, CatalogueLoading } from '~/components/views/Catalogue'
import { Message } from '~/components/views/Message'

import { useRequest } from '~/hooks/useRequest'

import { getCataloguePage } from '~/data/get-catalogue-page'
import { i18n } from '~/lib/i18n'

import type { EventCardParams } from '~/components/ui/EventCard'

export interface CataloguePageData {
  events: EventCardParams[]
  categories: string[]
}

export default function CataloguePage() {
  const page = useRequest(getCataloguePage)

  return (
    <Suspense fallback={<CatalogueLoading mode="all" />}>
      <Catalogue mode="all" page={page} />
    </Suspense>
  )
}

export function ErrorBoundary({ retry }: ErrorBoundaryProps) {
  return (
    <Message
      title={i18n.t('catalogue.error.title')}
      description={i18n.t('catalogue.error.description')}
      button={{ label: i18n.t('catalogue.error.button'), onPress: retry }}
    />
  )
}
