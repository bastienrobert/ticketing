import { fetchApi } from '~/lib/api'

export const eventsRepository = {
  getAll(signal: AbortSignal) {
    return fetchApi('/events', { signal })
  },
}
