import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useOptimistic,
  useReducer,
  type ReactNode,
} from 'react'
import { Alert } from 'react-native'

import { authClient } from '~/lib/auth'
import { i18n } from '~/lib/i18n'
import { favoritesRepository } from '~/repositories/favorites.repository'

type FavoritesAction =
  | { type: 'toggle'; payload: { eventId: number } }
  | { type: 'replace'; payload: { eventIds: number[] } }
  | { type: 'clear' }

interface FavoritesContextValue {
  favoriteIds: number[]
  toggleFavorite: (eventId: number) => void
  syncFavorites: () => Promise<boolean>
  clearFavorites: () => void
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

export function reduceFavorites(
  state: number[],
  action: FavoritesAction,
): number[] {
  switch (action.type) {
    case 'toggle': {
      const { eventId } = action.payload

      if (state.includes(eventId)) {
        return state.filter((favoriteId) => favoriteId !== eventId)
      }

      return [...state, eventId]
    }
    case 'replace':
      return action.payload.eventIds
    case 'clear':
      return []
  }
}

export interface FavoritesProviderProps {
  children: ReactNode
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const { data: session } = authClient.useSession()
  const userId = session?.user.id

  const [favoriteIds, dispatch] = useReducer(reduceFavorites, null, () =>
    favoritesRepository.getIds(),
  )
  const [optimisticIds, dispatchOptimistic] = useOptimistic(
    favoriteIds,
    reduceFavorites,
  )

  function replaceIds() {
    dispatch({
      type: 'replace',
      payload: { eventIds: favoritesRepository.getIds() },
    })
  }

  async function syncFavorites() {
    if (!userId) return true

    const online = await favoritesRepository.sync()
    replaceIds()

    return online
  }

  function toggleFavorite(eventId: number) {
    if (!userId) {
      Alert.alert(
        i18n.t('favorites.sign_in.title'),
        i18n.t('favorites.sign_in.description'),
      )
      return
    }

    const favorite = !optimisticIds.includes(eventId)

    startTransition(async () => {
      // Optimistically update the local state before making the API call.
      dispatchOptimistic({ type: 'toggle', payload: { eventId } })

      try {
        if (favorite) await favoritesRepository.add(eventId)
        else await favoritesRepository.remove(eventId)
      } catch {
        // If the API call fails, revert the optimistic update.
        Alert.alert(
          i18n.t('favorites.error.title'),
          i18n.t('favorites.error.description'),
        )
      }

      // After attempting to update the server, ensure the local state matches the server's state.
      startTransition(replaceIds)
    })
  }

  function clearFavorites() {
    favoritesRepository.clear()
    dispatch({ type: 'clear' })
  }

  useEffect(() => {
    if (!userId) return

    favoritesRepository.sync().then(replaceIds)
  }, [userId])

  return (
    <FavoritesContext
      value={{
        favoriteIds: optimisticIds,
        toggleFavorite,
        syncFavorites,
        clearFavorites,
      }}>
      {children}
    </FavoritesContext>
  )
}

export function useFavoritesContext() {
  const context = useContext(FavoritesContext)

  if (!context) {
    throw new Error(
      'useFavoritesContext doit être utilisé dans FavoritesProvider.',
    )
  }

  return context
}
