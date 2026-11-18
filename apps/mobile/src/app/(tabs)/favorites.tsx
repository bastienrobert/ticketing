import { useIsFocused, type ErrorBoundaryProps } from 'expo-router'
import {
  Suspense,
  useEffect,
  useEffectEvent,
  useState,
  useTransition,
} from 'react'

import { Toast } from '~/components/ui/Toast'
import { Catalogue, CatalogueLoading } from '~/components/views/Catalogue'
import { Message } from '~/components/views/Message'

import { useFavoritesContext } from '~/contexts/FavoritesContext'
import { useRequest } from '~/hooks/useRequest'

import { getFavoritesPage } from '~/data/get-favorites-page'
import { i18n } from '~/lib/i18n'

export default function FavoritesPage() {
  const focused = useIsFocused()

  const { syncFavorites } = useFavoritesContext()
  const [, page, refresh] = useRequest(getFavoritesPage)

  const [refreshing, startRefresh] = useTransition()
  const [offline, setOffline] = useState(false)

  function sync() {
    return syncFavorites().then((online) => {
      setOffline(!online)
      refresh()
    })
  }

  const onFocus = useEffectEvent(sync)

  function onRefresh() {
    startRefresh(sync)
  }

  useEffect(() => {
    if (focused) onFocus()
  }, [focused])

  return (
    <>
      <Suspense fallback={<CatalogueLoading mode="favorites" />}>
        <Catalogue
          mode="favorites"
          page={page}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      </Suspense>

      <Toast
        message={offline ? i18n.t('favorites.offline') : null}
        onHide={() => setOffline(false)}
      />
    </>
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
