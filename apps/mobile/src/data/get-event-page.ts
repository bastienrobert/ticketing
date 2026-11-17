import { eventAdapter } from './adapters/events.adapters'
import { MOCK_EVENTS } from './mocks/events'

import type { EventPageData } from '~/app/events/[id]'

/** Find one mock event for its sheet; `null` when the id is unknown. */
export function getEventPage(eventId: number): EventPageData | null {
  const event = MOCK_EVENTS.find((candidate) => candidate.id === eventId)

  if (!event) return null

  return eventAdapter(event)
}
