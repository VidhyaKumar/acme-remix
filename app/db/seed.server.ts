import "dotenv/config"

import { faker } from "@faker-js/faker"

import { db } from "./client.server"
import { users } from "./schema.server"

async function main() {
  try {
    const usersData = Array.from({ length: 5000 }, (_, i) => ({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      color: faker.color.rgb({ format: "hex" }),
    }))

    await db.insert(users).values(usersData).onConflictDoNothing()

    console.log("🌱 Seeding successful!")
    process.exit(0)
  } catch (error) {
    console.error("❌ Seeding error:", error)
    process.exit(1)
  }
}

main()
