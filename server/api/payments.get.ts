import { defineEventHandler } from 'h3'
import prisma from '../utils/prisma'
import { getAccessScope } from '../utils/access'
import { requireAuthenticatedUser } from '../utils/access'

export default defineEventHandler(async (event) => {
  const user = await requireAuthenticatedUser(event)
  const scope = await getAccessScope(user.id)
  const payments = await prisma.payment.findMany({ where: scope.coupleId ? { OR: [{ coupleId: scope.coupleId, scope: 'shared' }, { responsibleUserId: user.id, scope: 'individual' }] } : { responsibleUserId: user.id }, include: { responsibleUser: { select: { id: true, name: true } } }, orderBy: { dueAt: 'asc' } })
  const now = Date.now()
  return payments.map((payment) => {
    const diff = new Date(payment.dueAt).getTime() - now
    const state = payment.status === 'paid' || payment.status === 'cancelled' ? payment.status : diff < 0 ? 'overdue' : diff < 86400000 ? 'today' : diff <= 7 * 86400000 ? 'soon' : 'safe'
    return { ...payment, state, hoursRemaining: Math.round(diff / 3600000), daysLate: diff < 0 ? Math.ceil(Math.abs(diff) / 86400000) : 0 }
  })
})
