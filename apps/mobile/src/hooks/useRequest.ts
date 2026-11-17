import { useEffect, useState, useTransition } from 'react'

type Request<T> = (signal: AbortSignal) => Promise<T>

function startRequest<T>(request: Request<T>) {
  const controller = new AbortController()
  return { controller, promise: request(controller.signal) }
}

/**
 * Start a getter once when the screen mounts and return its promise for `use()` under Suspense.
 * The request is cancelled when the screen leaves; a route `ErrorBoundary` retry remounts it.
 */
export function useRequest<T>(request: Request<T>) {
  const [current, setCurrent] = useState(() => startRequest(request))
  const [isPending, startTransition] = useTransition()

  function refresh() {
    startTransition(() => {
      setCurrent(startRequest(request))
    })
  }

  useEffect(() => {
    return () => current.controller.abort()
  }, [current])

  return [isPending, current.promise, refresh] as const
}
