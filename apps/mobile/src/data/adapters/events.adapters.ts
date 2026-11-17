import { i18n } from '~/lib/i18n'

import type { EventPageData } from '~/app/events/[id]'
import type { EventCardParams } from '~/components/ui/EventCard'

interface EventRaw {
  id: number
  title: string
  category: string
  venue: string
  startsAt: string
  description: string
  address: string
  price: number
}

const DATE_FORMAT = new Intl.DateTimeFormat('fr-FR', {
  timeZone: 'Europe/Paris',
  dateStyle: 'full',
  timeStyle: 'short',
})
const DAY_FORMAT = new Intl.DateTimeFormat('fr-FR', {
  timeZone: 'Europe/Paris',
  day: '2-digit',
})
const MONTH_FORMAT = new Intl.DateTimeFormat('fr-FR', {
  timeZone: 'Europe/Paris',
  month: 'short',
})
const PRICE_FORMAT = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
})

/** Present an event for its card and its sheet, in the Paris time zone whatever the phone settings. */
export function eventAdapter(event: EventRaw): EventPageData & EventCardParams {
  const startsAt = new Date(event.startsAt)

  return {
    id: event.id,
    title: event.title,
    category: event.category,
    description: event.description,
    venue: event.venue,
    address: event.address,
    date: DATE_FORMAT.format(startsAt),
    day: DAY_FORMAT.format(startsAt),
    month: MONTH_FORMAT.format(startsAt),
    price:
      event.price === 0
        ? i18n.t('event.free')
        : PRICE_FORMAT.format(event.price),
  }
}
