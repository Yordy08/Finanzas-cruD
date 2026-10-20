import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import { z } from 'zod'
import prisma from '../../utils/prisma'
import { getAccessScope, parseDate } from '../../utils/access'
import { requireAuth } from '../../utils/auth'

const Schema = z.object({
  type: z.enum(['income', 'expense']).optional(),
  amount: z.number().finite().positive().optional(),
  category: z.string().trim().min(1).max(80).optional(),
  description: z.string().max(500).nullable().optional(),
  date: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const parsed = Schema.safeParse(await readBody(event))
  if (!id || !parsed.success) throw createError({ statusCode: 400, statusMessage: 'Invalid transaction update' })
  const user = await requireAuth(event)
  const scope = await getAccessScope(user.id)
  const transaction = await prisma.transaction.findFirst({ where: { id, userId: { in: scope.memberIds } } })
  if (!transaction) throw createError({ statusCode: 404, statusMessage: 'Transaction not found' })

  const type = parsed.data.type || transaction.type
  const amount = parsed.data.amount ?? transaction.amount
  const oldSigned = transaction.type === 'income' ? transaction.amount : -transaction.amount
  const newSigned = type === 'income' ? amount : -amount

  return prisma.$transaction(async (tx) => {
    const updated = await tx.transaction.update({ where: { id }, data: { type, amount, category: parsed.data.category, description: parsed.data.description, date: parsed.data.date ? parseDate(parsed.data.date) : undefined } })
    await tx.account.update({ where: { id: transaction.accountId! }, data: { balance: { increment: newSigned - oldSigned } } })
    return updated
  })
})
