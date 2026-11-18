import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'

// the account's favorite events as the API sent them: the favorites tab and their sheets read them offline
export const favorites = sqliteTable('favorites', {
  id: integer().primaryKey(),
  title: text().notNull(),
  description: text(),
  startsAt: text('starts_at').notNull(),
  venue: text(),
  address: text(),
  category: text().notNull(),
  price: real(),
})
