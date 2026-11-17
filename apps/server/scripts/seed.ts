import { drizzle } from 'drizzle-orm/d1'
import { getPlatformProxy } from 'wrangler'

import { events } from '../src/db/schema.ts'

type OpenAgendaEvent = {
  title_fr: string
  description_fr: string | null
  firstdate_begin: string
  firstdate_end: string | null
  image: string | null
  location_name: string | null
  location_address: string | null
  location_coordinates: { lat: number; lon: number } | null
  keywords_fr: string[] | null
  conditions_fr: string | null
}

// OpenAgenda leaves `category` empty for Shotgun: group its music keywords into a few families
const CATEGORIES: Record<string, string[]> = {
  Rap: ['rap', 'hip hop', 'r&b'],
  Pop: ['pop', 'hyperpop', 'pop rock', 'chanson', 'variété française'],
  Électro: ['electro', 'techno', 'acid techno', 'hard techno', 'house'],
  Rock: ['rock', 'indie rock', 'indie', 'alternative', 'metal', 'dark wave'],
  Jazz: ['jazz', 'soul'],
}

function getCategory(keywords: string[] | null) {
  for (const keyword of keywords ?? []) {
    for (const [category, genres] of Object.entries(CATEGORIES)) {
      if (genres.includes(keyword.toLowerCase())) return category
    }
  }
  return 'Concert'
}

// "Gratuit", "À partir de 31.99 €" or "De 38.99 € à 72.99 €": keep the lowest price, in euros
function getPrice(conditions: string | null) {
  if (!conditions) return null
  if (/gratuit/i.test(conditions)) return 0
  const amount = conditions.match(/\d+(?:[.,]\d+)?/)?.[0]
  return amount ? Number(amount.replace(',', '.')) : null
}

// prettier-ignore
const url = new URL('https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/evenements-publics-openagenda/records')
url.searchParams.set(
  'where',
  'originagenda_title = "Shotgun" and firstdate_begin >= now()',
)
url.searchParams.set('order_by', 'random(1)')
url.searchParams.set('limit', '100')

const res = await fetch(url)
if (!res.ok) throw new Error(`OpenAgenda ${res.status}: ${await res.text()}`)
const { results } = (await res.json()) as { results: OpenAgendaEvent[] }

const rows = results.map((e) => ({
  title: e.title_fr,
  description: e.description_fr,
  startsAt: new Date(e.firstdate_begin),
  endsAt: e.firstdate_end ? new Date(e.firstdate_end) : null,
  coverUrl: e.image,
  venue: e.location_name,
  address: e.location_address,
  latitude: e.location_coordinates?.lat ?? null,
  longitude: e.location_coordinates?.lon ?? null,
  category: getCategory(e.keywords_fr),
  price: getPrice(e.conditions_fr),
}))

const { env, dispose } = await getPlatformProxy<CloudflareBindings>()
const db = drizzle(env.DB)

await db.batch([
  db.delete(events),
  ...rows.map((row) => db.insert(events).values(row)),
])
await dispose()

console.log(`Seeded ${rows.length} events`)
