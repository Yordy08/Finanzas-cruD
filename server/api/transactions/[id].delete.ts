import { createError, defineEventHandler, getRouterParam } from 'h3'
import prisma from '../../utils/prisma'
import { getAccessScope } from '../../utils/access'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Transaction id is required' })
  const user = await requireAuth(event)
  const scope = await getAccessScope(user.id)
  const transaction = await prisma.transaction.findFirst({ where: { id, userId: { in: scope.memberIds } } })
  if (!transaction) throw createError({ statusCode: 404, statusMessage: 'Transaction not found' })
  return prisma.$transaction(async (tx) => {
    await tx.transaction.delete({ where: { id } })
    const signed = transaction.type === 'income' ? transaction.amount : -transaction.amount
    await tx.account.update({ where: { id: transaction.accountId! }, data: { balance: { increment: -signed } } })
    return { ok: true }
  })
})
