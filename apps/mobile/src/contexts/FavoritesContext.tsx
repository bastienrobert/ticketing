import { createContext, useContext, useReducer, type ReactNode } from 'react'

type FavoritesAction = { type: 'toggle'; payload: { eventId: number } }

interface FavoritesContextValue {
  favoriteIds: number[]
  toggleFavorite: (eventId: number) => void
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

function reduceFavorites(state: number[], action: FavoritesAction): number[] {
  switch (action.type) {
    case 'toggle': {
      const { eventId } = action.payload

      if (state.includes(eventId)) {
        return state.filter((favoriteId) => favoriteId !== eventId)
      }

      return [...state, eventId]
    }
  }
}

export interface FavoritesProviderProps {
  children: ReactNode
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favoriteIds, dispatch] = useReducer(reduceFavorites, [])

  function toggleFavorite(eventId: number) {
    dispatch({ type: 'toggle', payload: { eventId } })
  }

  return (
    <FavoritesContext value={{ favoriteIds, toggleFavorite }}>
      {children}
    </FavoritesContext>
  )
}

/** Read the shared selection and its action inside FavoritesProvider. */
export function useFavoritesContext() {
  const context = useContext(FavoritesContext)

  if (!context) {
    throw new Error(
      'useFavoritesContext doit être utilisé dans FavoritesProvider.',
    )
  }

  return context
}
