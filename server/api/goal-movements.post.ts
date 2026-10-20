import { createError, defineEventHandler, readBody } from 'h3'
import { z } from 'zod'
import prisma from '../utils/prisma'
import { getAccessScope, parseDate } from '../utils/access'

const Schema = z.object({ userId: z.string(), goalId: z.string(), type: z.enum(['contribution', 'withdrawal']), amount: z.number().finite().positive(), date: z.string().optional(), description: z.string().max(500).optional() })

export default defineEventHandler(async (event) => {
  const parsed = Schema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Invalid goal movement' })
  const scope = await getAccessScope(parsed.data.userId)
  const goal = await prisma.goal.findFirst({ where: { id: parsed.data.goalId, OR: [{ ownerUserId: parsed.data.userId }, ...(scope.coupleId ? [{ coupleId: scope.coupleId }] : [])] } })
  if (!goal) throw createError({ statusCode: 404, statusMessage: 'Goal not found' })
  if (goal.status !== 'active') throw createError({ statusCode: 409, statusMessage: 'Goal is not active' })

  return prisma.goalMovement.create({ data: { goalId: goal.id, type: parsed.data.type, amount: parsed.data.amount, date: parsed.data.date ? parseDate(parsed.data.date) : new Date(), description: parsed.data.description, userId: parsed.data.userId }, include: { user: { select: { id: true, name: true } } } })
})
