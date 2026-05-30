const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({ take: 5, orderBy: { createdAt: 'desc' } })
  console.log('users_count:', users.length)

  if (users.length === 0) {
    console.log('No users found. Creating demo user...')
    const demo = await prisma.user.create({
      data: {
        email: 'demo@example.com',
        name: 'Demo',
      },
    })
    console.log('DEMO_USER_ID:', demo.id)
    console.log(demo.id)
  } else {
    console.log('EXISTING_USER_ID:', users[0].id)
    console.log(users[0].id)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

