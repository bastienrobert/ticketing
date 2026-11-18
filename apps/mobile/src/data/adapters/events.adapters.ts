import { i18n } from '~/lib/i18n'

import type { CataloguePageData } from '~/app/(tabs)'
import type { EventPageData } from '~/app/events/[id]'
import type { EventCardParams } from '~/components/ui/EventCard'

interface EventRaw {
  id: number
  title: string
  description: string | null
  startsAt: string
  venue: string | null
  address: string | null
  category: string
  price: number | null
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

// the server keeps the lowest price of each event
function getPriceLabel(price: number | null) {
  if (price === null) return i18n.t('event.price_unknown')
  if (price === 0) return i18n.t('event.free')

  return i18n.t('event.price_from', { price: PRICE_FORMAT.format(price) })
}

/** Present an event for its card and its sheet, in the Paris time zone whatever the phone settings. */
export function eventAdapter(event: EventRaw): EventPageData & EventCardParams {
  const startsAt = new Date(event.startsAt)

  return {
    id: event.id,
    title: event.title,
    category: event.category,
    description: event.description ?? '',
    venue: event.venue ?? '',
    address: event.address ?? '',
    startsAt: event.startsAt,
    date: DATE_FORMAT.format(startsAt),
    day: DAY_FORMAT.format(startsAt),
    month: MONTH_FORMAT.format(startsAt),
    price: getPriceLabel(event.price),
    amount: event.price ? event.price.toFixed(2) : null,
  }
}

/** Present a list of events with the categories it contains, sorted for French. */
export function catalogueAdapter(events: EventRaw[]): CataloguePageData {
  return {
    events: events.map(eventAdapter),
    categories: [...new Set(events.map((event) => event.category))].sort(
      new Intl.Collator('fr').compare,
    ),
  }
}
