const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

const id = process.env.NUXT_PUBLIC_MVP_USER_ID
const prisma = new PrismaClient()

async function main() {
  if (!id) throw new Error('Missing NUXT_PUBLIC_MVP_USER_ID')

  const accounts = await prisma.account.findMany({ where: { userId: id } })
  if (accounts.length > 0) {
    console.log('accounts already exist:', accounts.length)
    console.log('first_account_id:', accounts[0].id)
    return
  }

  console.log('No accounts for user. Creating demo account...')
  const account = await prisma.account.create({
    data: {
      name: 'Demo Account',
      balance: 0,
      userId: id,
    },
  })
  console.log('DEMO_ACCOUNT_ID:', account.id)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

