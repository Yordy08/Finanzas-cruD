import { createError, defineEventHandler, getRouterParam } from 'h3'
import prisma from '../../utils/prisma'
import { getAccessScope } from '../../utils/access'
import { requireAuthenticatedUser } from '../../utils/access'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'Payment id is required' })
  const user = await requireAuthenticatedUser(event)
  const scope = await getAccessScope(user.id)
  const payment = await prisma.payment.findFirst({ where: { id, OR: [{ responsibleUserId: { in: scope.memberIds } }, ...(scope.coupleId ? [{ coupleId: scope.coupleId }] : [])] } })
  if (!payment) throw createError({ statusCode: 404, statusMessage: 'Payment not found' })
  await prisma.payment.delete({ where: { id } })
  return { ok: true }
})
