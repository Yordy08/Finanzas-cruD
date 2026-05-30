const { PrismaClient } = require('@prisma/client')
require('dotenv').config()
const id = process.env.NUXT_PUBLIC_MVP_USER_ID
const prisma = new PrismaClient()

async function main() {
  if (!id) throw new Error('Missing NUXT_PUBLIC_MVP_USER_ID')

  const user = await prisma.user.findUnique({ where: { id } })
  const accounts = await prisma.account.findMany({ where: { userId: id } })
  const transactions = await prisma.transaction.findMany({ where: { userId: id } })

  console.log('MVP_USER_ID:', id)
  console.log('user_found:', !!user)
  console.log('accounts_count:', accounts.length)
  console.log('transactions_count:', transactions.length)

  await prisma.$disconnect()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})

