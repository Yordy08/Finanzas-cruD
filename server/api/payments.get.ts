import { defineEventHandler, getQuery } from 'h3'
import prisma from '../utils/prisma'
import { getAccessScope } from '../utils/access'

export default defineEventHandler(async (event) => {
  const userId = String(getQuery(event).userId || '')
  const scope = await getAccessScope(userId)
  const payments = await prisma.payment.findMany({ where: scope.coupleId ? { coupleId: scope.coupleId } : { responsibleUserId: userId }, include: { responsibleUser: { select: { id: true, name: true } } }, orderBy: { dueAt: 'asc' } })
  const now = Date.now()
  return payments.map((payment) => {
    const diff = new Date(payment.dueAt).getTime() - now
    const state = payment.status === 'paid' || payment.status === 'cancelled' ? payment.status : diff < 0 ? 'overdue' : diff < 86400000 ? 'today' : diff <= 7 * 86400000 ? 'soon' : 'safe'
    return { ...payment, state, hoursRemaining: Math.round(diff / 3600000), daysLate: diff < 0 ? Math.ceil(Math.abs(diff) / 86400000) : 0 }
  })
})
