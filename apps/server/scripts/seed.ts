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
}))

const { env, dispose } = await getPlatformProxy<CloudflareBindings>()
const db = drizzle(env.DB)

await db.batch([
  db.delete(events),
  ...rows.map((row) => db.insert(events).values(row)),
])
await dispose()

console.log(`Seeded ${rows.length} events`)
