import prisma from '../utils/prisma'
import { z } from 'zod'
import { createError, defineEventHandler, readBody } from 'h3'
import { parseDate, getAccessScope } from '../utils/access'
import { requireAuthenticatedUser } from '../utils/access'


const BodySchema = z.object({
  userId: z.string().min(1),
  accountId: z.string().min(1),
  type: z.union([z.enum(['income', 'expense']), z.enum(['ingreso', 'gasto'])]),
  amount: z.number().finite().positive(),
  category: z.string().trim().min(1).max(80),
  description: z.string().max(500).optional(),
  date: z.string().optional(),
  scope: z.enum(['individual', 'shared']).default('individual'),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = BodySchema.safeParse(body)

  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid body', data: parsed.error.flatten() })
  }

  const { accountId, amount, category, description } = parsed.data
  const user = await requireAuthenticatedUser(event)
  const userId = user.id
  const typeInput = parsed.data.type
  const type = typeInput === 'ingreso' ? 'income' : typeInput === 'gasto' ? 'expense' : typeInput
  const date = parsed.data.date ? parseDate(parsed.data.date) : new Date()

    return await (prisma as any).$transaction(async (tx) => {
    const access = await getAccessScope(userId)
    const account = await tx.account.findFirst({ where: { id: accountId, OR: [{ userId }, ...(access.coupleId ? [{ userId: { in: access.memberIds } }, { coupleId: access.coupleId }] : [])] } } as any)
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
        recordedById: userId,
        accountId,
        scope: 'shared',
      },
    })

    await tx.account.update({
      where: { id: accountId },
      data: { balance: { increment: signedAmount } },
    })

    return transaction
  })
})
