import { prisma } from "@/lib/prisma"


async function main() {
  try {
    // Database theke simple query chaliye dekha
    const count = await prisma.todo.count()
    console.log("Database connected successfully! Total todos:", count)
  } catch (error) {
    console.error("Database connection ERROR:", error)
  } finally {
    await prisma.$disconnect()
  }
}

main()