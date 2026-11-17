import { API_URL } from '~/const'

/** Request a JSON resource from the ticketing API; the signal cancels the request. */
export async function fetchApi(path: string, signal: AbortSignal) {
  const response = await fetch(`${API_URL}${path}`, { signal })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  const payload: unknown = await response.json()
  return payload
}
