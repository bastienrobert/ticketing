import { useEffect, useState } from 'react'

/**
 * Start a getter once when the screen mounts and return its promise for `use()` under Suspense.
 * The request is cancelled when the screen leaves; a route `ErrorBoundary` retry remounts it.
 */
export function useRequest<T>(request: (signal: AbortSignal) => Promise<T>) {
  const [{ controller, promise }] = useState(() => {
    const controller = new AbortController()
    return { controller, promise: request(controller.signal) }
  })

  useEffect(() => {
    return () => controller.abort()
  }, [controller])

  return promise
}
