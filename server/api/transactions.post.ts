import prisma from '../utils/prisma'
import { z } from 'zod'
import { createError, defineEventHandler, readBody } from 'h3'


const BodySchema = z.object({
  userId: z.string().min(1),
  accountId: z.string().min(1),
  type: z.union([z.enum(['income', 'expense']), z.enum(['ingreso', 'gasto'])]),
  amount: z.number().positive(),
  category: z.string().min(1),
  description: z.string().optional(),
  date: z.string().optional(), // ISO
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = BodySchema.safeParse(body)

  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid body', data: parsed.error.flatten() })
  }

  const { userId, accountId, amount, category, description } = parsed.data
  const typeInput = parsed.data.type
  const type = typeInput === 'ingreso' ? 'income' : typeInput === 'gasto' ? 'expense' : typeInput
  const date = parsed.data.date ? new Date(parsed.data.date) : new Date()

    return await (prisma as any).$transaction(async (tx) => {
    const account = await tx.account.findFirst({ where: { id: accountId, userId } } as any)
    if (!account) {
      throw createError({ statusCode: 404, statusMessage: 'Account not found for user' })
    }

    const signedAmount = type === 'income' ? amount : -amount

    const transaction = await tx.transaction.create({
      data: {
        type,
        amount,
        category,
        description,
        date,
        userId,
        accountId,
      },
    })

    await tx.account.update({
      where: { id: accountId },
      data: { balance: account.balance + signedAmount },
    })

    return transaction
  })
})
