import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import { z } from 'zod'
import prisma from '../../utils/prisma'
import { getAccessScope, parseDate } from '../../utils/access'
import { requireAuthenticatedUser } from '../../utils/access'

const Schema = z.object({ userId: z.string().optional(), title: z.string().trim().min(1).max(120).optional(), description: z.string().max(500).nullable().optional(), amount: z.number().finite().nonnegative().nullable().optional(), dueAt: z.string().optional(), category: z.string().trim().min(1).max(60).nullable().optional(), recurrence: z.enum(['once', 'weekly', 'monthly', 'yearly']).optional(), reminderHours: z.number().int().min(0).max(8760).optional(), responsibleUserId: z.string().optional(), status: z.enum(['pending', 'paid', 'cancelled']).optional(), paidAt: z.string().optional() })

const nextOccurrence = (date: Date, recurrence: 'weekly' | 'monthly' | 'yearly') => {
  const next = new Date(date)
  if (recurrence === 'weekly') {
    next.setDate(next.getDate() + 7)
    return next
  }

  const dayOfMonth = next.getDate()
  if (recurrence === 'monthly') {
    next.setDate(1)
    next.setMonth(next.getMonth() + 1)
  } else {
    next.setDate(1)
    next.setFullYear(next.getFullYear() + 1)
  }

  const lastDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate()
  next.setDate(Math.min(dayOfMonth, lastDay))
  return next
}

export default defineEventHandler(async (event) => {
  const parsed = Schema.safeParse(await readBody(event))
  const id = getRouterParam(event, 'id')
  if (!parsed.success || !id) throw createError({ statusCode: 400, statusMessage: 'Invalid payment update' })
   const user = await requireAuthenticatedUser(event)
   const scope = await getAccessScope(user.id)
   const payment = await prisma.payment.findFirst({ where: { id, OR: [{ responsibleUserId: { in: scope.memberIds } }, ...(scope.coupleId ? [{ coupleId: scope.coupleId }] : [])] } })
  if (!payment) throw createError({ statusCode: 404, statusMessage: 'Payment not found' })
   const status = parsed.data.status || payment.status
   const paidAt = status === 'paid' ? (parsed.data.paidAt ? parseDate(parsed.data.paidAt, 'paidAt') : payment.paidAt || new Date()) : null
  return prisma.$transaction(async (tx) => {
      const updated = await tx.payment.update({ where: { id }, data: { title: parsed.data.title, description: parsed.data.description, amount: parsed.data.amount, dueAt: parsed.data.dueAt ? parseDate(parsed.data.dueAt, 'dueAt') : undefined, category: parsed.data.category, recurrence: parsed.data.recurrence, reminderHours: parsed.data.reminderHours, responsibleUserId: parsed.data.responsibleUserId, status, paidAt } })
      if (status === 'paid' && payment.status === 'pending' && payment.recurrence !== 'once') {
       let nextDue = nextOccurrence(payment.dueAt, payment.recurrence as 'weekly' | 'monthly' | 'yearly')
       const now = new Date()
       while (nextDue <= now) nextDue = nextOccurrence(nextDue, payment.recurrence as 'weekly' | 'monthly' | 'yearly')
       await tx.payment.create({ data: { title: payment.title, description: payment.description, amount: payment.amount, dueAt: nextDue, category: payment.category, responsibleUserId: payment.responsibleUserId, scope: payment.scope, recurrence: payment.recurrence, reminderHours: payment.reminderHours, coupleId: payment.coupleId } })
    }
    return updated
  })
})
