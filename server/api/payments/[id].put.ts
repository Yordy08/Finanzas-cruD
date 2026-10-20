import { createError, defineEventHandler, getRouterParam, readBody } from 'h3'
import { z } from 'zod'
import prisma from '../../utils/prisma'
import { getAccessScope, parseDate } from '../../utils/access'

const Schema = z.object({ userId: z.string(), status: z.enum(['pending', 'paid', 'cancelled']), paidAt: z.string().optional() })

export default defineEventHandler(async (event) => {
  const parsed = Schema.safeParse(await readBody(event))
  const id = getRouterParam(event, 'id')
  if (!parsed.success || !id) throw createError({ statusCode: 400, statusMessage: 'Invalid payment update' })
  const scope = await getAccessScope(parsed.data.userId)
  const payment = await prisma.payment.findFirst({ where: { id, OR: [{ responsibleUserId: parsed.data.userId }, ...(scope.coupleId ? [{ coupleId: scope.coupleId }] : [])] } })
  if (!payment) throw createError({ statusCode: 404, statusMessage: 'Payment not found' })
  const paidAt = parsed.data.status === 'paid' ? (parsed.data.paidAt ? parseDate(parsed.data.paidAt, 'paidAt') : new Date()) : null
  return prisma.$transaction(async (tx) => {
    const updated = await tx.payment.update({ where: { id }, data: { status: parsed.data.status, paidAt } })
    if (parsed.data.status === 'paid' && payment.status === 'pending' && payment.recurrence !== 'once') {
      const nextDue = new Date(payment.dueAt)
      if (payment.recurrence === 'weekly') nextDue.setDate(nextDue.getDate() + 7)
      if (payment.recurrence === 'monthly') nextDue.setMonth(nextDue.getMonth() + 1)
      if (payment.recurrence === 'yearly') nextDue.setFullYear(nextDue.getFullYear() + 1)
      await tx.payment.create({ data: { title: payment.title, description: payment.description, amount: payment.amount, dueAt: nextDue, category: payment.category, responsibleUserId: payment.responsibleUserId, scope: payment.scope, recurrence: payment.recurrence, reminderHours: payment.reminderHours, coupleId: payment.coupleId } })
    }
    return updated
  })
})
