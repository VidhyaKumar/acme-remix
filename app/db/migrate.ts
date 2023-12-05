import "dotenv/config"

import { migrate } from "drizzle-orm/libsql/migrator"

import { db } from "./client.server"

async function main() {
  try {
    await migrate(db, { migrationsFolder: "./app/db/migrations" })
    console.log("🚀 Migration successful!")
    process.exit(0)
  } catch (error) {
    console.error("❌ Migration error:", error)
    process.exit(1)
  }
}

main()
