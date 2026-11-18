import { API_URL } from '~/const'
import { authClient } from '~/lib/auth'

export class ApiError extends Error {
  readonly status: number

  constructor(status: number) {
    super(`HTTP ${status}`)
    this.name = new.target.name
    this.status = status
  }
}

/** Request the ticketing API as the signed-in account; `null` when the response has no body. */
export async function fetchApi(path: string, init?: RequestInit) {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { cookie: await authClient.getCookie() },
  })

  if (!response.ok) {
    throw new ApiError(response.status)
  }

  if (response.status === 204) return null

  const payload: unknown = await response.json()
  return payload
}
