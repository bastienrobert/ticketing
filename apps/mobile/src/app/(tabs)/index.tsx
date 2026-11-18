import type { ErrorBoundaryProps } from 'expo-router'
import { Suspense } from 'react'

import { Catalogue, CatalogueLoading } from '~/components/views/Catalogue'
import { Message } from '~/components/views/Message'

import { useRequest } from '~/hooks/useRequest'

import { getCataloguePage } from '~/data/get-catalogue-page'
import { ApiError } from '~/lib/api'
import { i18n } from '~/lib/i18n'

import type { EventCardParams } from '~/components/ui/EventCard'

export interface CataloguePageData {
  events: EventCardParams[]
  categories: string[]
}

export default function CataloguePage() {
  const [refreshing, page, refresh] = useRequest(getCataloguePage)

  return (
    <Suspense fallback={<CatalogueLoading mode="all" />}>
      <Catalogue
        mode="all"
        page={page}
        refreshing={refreshing}
        onRefresh={refresh}
      />
    </Suspense>
  )
}

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  const offline = error instanceof ApiError === false

  const labels = offline
    ? {
        title: i18n.t('catalogue.offline.title'),
        description: i18n.t('catalogue.offline.description'),
      }
    : {
        title: i18n.t('catalogue.error.title'),
        description: i18n.t('catalogue.error.description'),
      }

  return (
    <Message
      title={labels.title}
      description={labels.description}
      button={{ label: i18n.t('catalogue.error.button'), onPress: retry }}
    />
  )
}
