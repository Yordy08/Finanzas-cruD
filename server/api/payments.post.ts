import { createError, defineEventHandler, readBody } from 'h3'
import { z } from 'zod'
import prisma from '../utils/prisma'
import { getAccessScope, parseDate } from '../utils/access'

const Schema = z.object({ userId: z.string(), title: z.string().trim().min(1).max(120), description: z.string().max(500).optional(), amount: z.number().finite().nonnegative().optional(), dueAt: z.string(), category: z.string().trim().min(1).max(60), responsibleUserId: z.string().optional(), scope: z.enum(['individual', 'shared']).default('shared'), recurrence: z.enum(['once', 'weekly', 'monthly', 'yearly']).default('once'), reminderHours: z.number().int().min(0).max(8760).default(168) })

export default defineEventHandler(async (event) => {
  const parsed = Schema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Invalid payment data', data: parsed.error.flatten() })
  const scope = await getAccessScope(parsed.data.userId)
  const responsibleUserId = parsed.data.responsibleUserId || parsed.data.userId
  if (!scope.memberIds.includes(responsibleUserId)) throw createError({ statusCode: 403, statusMessage: 'Responsible user is outside the couple' })
  if (parsed.data.scope === 'shared' && !scope.coupleId) throw createError({ statusCode: 409, statusMessage: 'A shared payment requires a couple' })
  return prisma.payment.create({ data: { title: parsed.data.title, description: parsed.data.description, amount: parsed.data.amount, dueAt: parseDate(parsed.data.dueAt, 'dueAt'), category: parsed.data.category, responsibleUserId, scope: parsed.data.scope, recurrence: parsed.data.recurrence, reminderHours: parsed.data.reminderHours, coupleId: parsed.data.scope === 'shared' ? scope.coupleId : undefined } })
})
