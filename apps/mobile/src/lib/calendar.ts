import {
  getCalendarPermissions,
  getDefaultCalendarSync,
  requestCalendarPermissions,
} from 'expo-calendar'

export type CalendarResult = 'added' | 'refused' | 'blocked'

interface CalendarEvent {
  title: string
  description: string
  startsAt: string
  venue: string
  address: string
}

// ponytail: the API has no end time, so every event lasts two hours
const EVENT_DURATION = 2 * 60 * 60 * 1000

// write-only: iOS 17+ lets the app add events without reading the person's calendars
const WRITE_ONLY = true

/**
 * Add an event to the default calendar, asking for access the first time.
 * `refused` when the person just declined, `blocked` when only the Settings can grant access.
 */
export async function addToCalendar(
  event: CalendarEvent,
): Promise<CalendarResult> {
  const permission = await getCalendarPermissions(WRITE_ONLY)

  if (!permission.granted) {
    if (!permission.canAskAgain) return 'blocked'

    const { granted } = await requestCalendarPermissions(WRITE_ONLY)
    if (!granted) return 'refused'
  }

  const startDate = new Date(event.startsAt)

  await getDefaultCalendarSync().createEvent({
    title: event.title,
    notes: event.description,
    location: [event.venue, event.address].filter(Boolean).join(', '),
    startDate,
    endDate: new Date(startDate.getTime() + EVENT_DURATION),
    timeZone: 'Europe/Paris',
  })

  return 'added'
}
