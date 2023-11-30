import { Suspense } from "react"
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node"
import { defer, json } from "@remix-run/node"
import { Await, useFetcher, useLoaderData } from "@remix-run/react"
import { faker } from "@faker-js/faker"

import { db } from "~/db/client.server"
import { users } from "~/db/schema.server"
import { Logo } from "~/components/logo"

export const meta: MetaFunction = () => {
  return [
    { title: "Acme" },
    { name: "description", content: "Welcome to Acme!" },
  ]
}

export const loader = async (args: LoaderFunctionArgs) => {
  const usersData = db.query.users
    .findMany({
      orderBy: (user, { desc }) => desc(user.created_at),
      limit: 120,
    })
    .then((users) => users)

  return defer({ users: usersData })
}

export default function Index() {
  const { users } = useLoaderData<typeof loader>()
  const fetcher = useFetcher({ key: "users" })
  const isAddingUsers =
    fetcher.formData?.get("intent") === "add-users" && fetcher.state !== "idle"
  const isDeletingUsers =
    fetcher.formData?.get("intent") === "delete-users" &&
    fetcher.state !== "idle"

  return (
    <main className="min-h-screen w-full flex flex-col">
      <header className="bg-zinc-100 p-4 flex flex-row justify-between items-center">
        <div className="text-red-700 text-xl">
          <Logo />
        </div>
        <div className="flex flex-row items-center gap-x-2">
          <fetcher.Form method="post">
            <button
              name="intent"
              type="submit"
              className="bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50 disabled:pointer-events-none"
              disabled={isAddingUsers}
              value="add-users"
            >
              {isAddingUsers ? "Adding users..." : "Add users"}
            </button>
          </fetcher.Form>
          <fetcher.Form method="post">
            <button
              name="intent"
              type="submit"
              className="bg-zinc-300 text-black px-4 py-2 rounded disabled:opacity-50 disabled:pointer-events-none"
              disabled={true}
              value="delete-users"
            >
              {isDeletingUsers ? "Deleting users..." : "Delete users"}
            </button>
          </fetcher.Form>
        </div>
      </header>
      <div className="p-4 flex-1">
        <Suspense
          fallback={
            <p className="text-gray-500 py-1 px-2">Fetching users...</p>
          }
        >
          <Await
            resolve={users}
            errorElement={
              <p className="text-red-700 py-1 px-2">Error fetching users!</p>
            }
          >
            {(users) => (
              <ul className="grid grid-cols-12 max-w-full auto-rows-[1fr]">
                {users.length === 0 && (
                  <li className="py-1 px-2 flex items-center justify-center">
                    No users found.
                  </li>
                )}
                {users.map((user) => (
                  <li
                    className="py-1 px-2 flex items-center justify-center text-center"
                    key={user.id}
                    style={{
                      backgroundColor: user.color || "#000000",
                    }}
                  >
                    {user.name}
                  </li>
                ))}
              </ul>
            )}
          </Await>
        </Suspense>
      </div>
    </main>
  )
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData()
  const intent = formData.get("intent")

  switch (intent) {
    case "add-users":
      const usersData = Array.from({ length: 5000 }, (_, i) => ({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        color: faker.color.rgb({ format: "hex" }),
      }))
      await db.insert(users).values(usersData).onConflictDoNothing()
      return json({ message: "Users added!" })
    case "delete-users":
      await db.delete(users)
      return json({ message: "Users deleted!" })
    default:
      return json({ message: "Invalid request" }, { status: 400 })
  }
}
