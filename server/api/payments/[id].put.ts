import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import { z } from 'zod'
import prisma from '../../utils/prisma'
import { getAccessScope, parseDate } from '../../utils/access'
import { requireAuthenticatedUser } from '../../utils/access'

const Schema = z.object({ userId: z.string().optional(), title: z.string().trim().min(1).max(120).optional(), description: z.string().max(500).nullable().optional(), amount: z.number().finite().nonnegative().nullable().optional(), dueAt: z.string().optional(), category: z.string().trim().min(1).max(60).optional(), recurrence: z.enum(['once', 'weekly', 'monthly', 'yearly']).optional(), status: z.enum(['pending', 'paid', 'cancelled']).optional(), paidAt: z.string().optional() })

export default defineEventHandler(async (event) => {
  const parsed = Schema.safeParse(await readBody(event))
  const id = getRouterParam(event, 'id')
  if (!parsed.success || !id) throw createError({ statusCode: 400, statusMessage: 'Invalid payment update' })
   const user = await requireAuthenticatedUser(event)
   const scope = await getAccessScope(user.id)
   const payment = await prisma.payment.findFirst({ where: { id, OR: [{ responsibleUserId: user.id }, ...(scope.coupleId ? [{ coupleId: scope.coupleId }] : [])] } })
  if (!payment) throw createError({ statusCode: 404, statusMessage: 'Payment not found' })
   const status = parsed.data.status || payment.status
   const paidAt = status === 'paid' ? (parsed.data.paidAt ? parseDate(parsed.data.paidAt, 'paidAt') : payment.paidAt || new Date()) : null
  return prisma.$transaction(async (tx) => {
     const updated = await tx.payment.update({ where: { id }, data: { title: parsed.data.title, description: parsed.data.description, amount: parsed.data.amount, dueAt: parsed.data.dueAt ? parseDate(parsed.data.dueAt, 'dueAt') : undefined, category: parsed.data.category, recurrence: parsed.data.recurrence, status, paidAt } })
     if (status === 'paid' && payment.status === 'pending' && payment.recurrence !== 'once') {
      const nextDue = new Date(payment.dueAt)
      if (payment.recurrence === 'weekly') nextDue.setDate(nextDue.getDate() + 7)
      if (payment.recurrence === 'monthly') nextDue.setMonth(nextDue.getMonth() + 1)
      if (payment.recurrence === 'yearly') nextDue.setFullYear(nextDue.getFullYear() + 1)
      await tx.payment.create({ data: { title: payment.title, description: payment.description, amount: payment.amount, dueAt: nextDue, category: payment.category, responsibleUserId: payment.responsibleUserId, scope: payment.scope, recurrence: payment.recurrence, reminderHours: payment.reminderHours, coupleId: payment.coupleId } })
    }
    return updated
  })
})
