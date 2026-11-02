import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const events = sqliteTable('events', {
  id: integer().primaryKey({ autoIncrement: true }),
  title: text().notNull(),
  description: text(),
  startsAt: integer('starts_at', { mode: 'timestamp' }).notNull(),
  endsAt: integer('ends_at', { mode: 'timestamp' }),
  coverUrl: text('cover_url'),
  venue: text(),
  address: text(),
  latitude: real(),
  longitude: real()
})
