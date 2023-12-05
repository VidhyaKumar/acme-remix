import { createId } from "@paralleldrive/cuid2"
import { sql } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const users = sqliteTable("users", {
  id: text("id")
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  color: text("color", { length: 32 }),
  created_at: integer("created_at").default(sql`(cast(unixepoch() as int))`),
  updated_at: integer("updated_at").default(sql`(cast(unixepoch() as int))`),
})
export type SelectUser = typeof users.$inferSelect
export type InsertUser = typeof users.$inferInsert
