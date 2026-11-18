import { reduceFavorites } from '~/contexts/FavoritesContext'

// the context file also imports the session and the database, unused by its reducer
jest.mock('~/lib/auth', () => ({}))
jest.mock('~/repositories/favorites.repository', () => ({}))

function toggle(eventId: number) {
  return { type: 'toggle', payload: { eventId } } as const
}

describe('reduceFavorites', () => {
  it('adds a favorite without mutation', () => {
    const favorites = [12]
    const result = reduceFavorites(favorites, toggle(42))

    expect(result).toEqual([12, 42])
    expect(favorites).toEqual([12])
  })

  it('removes an already present favorite', () => {
    expect(reduceFavorites([12, 42], toggle(42))).toEqual([12])
  })
})
