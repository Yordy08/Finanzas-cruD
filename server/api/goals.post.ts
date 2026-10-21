import { createError, defineEventHandler, readBody } from 'h3'
import { z } from 'zod'
import prisma from '../utils/prisma'
import { getAccessScope, parseDate } from '../utils/access'
import { requireAuthenticatedUser } from '../utils/access'

const Schema = z.object({ userId: z.string(), name: z.string().trim().min(1).max(100), description: z.string().max(500).optional(), target: z.number().finite().positive(), startDate: z.string().optional(), dueDate: z.string().optional(), scope: z.enum(['individual', 'shared']).default('shared') })

export default defineEventHandler(async (event) => {
  const parsed = Schema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Invalid goal data', data: parsed.error.flatten() })
   const user = await requireAuthenticatedUser(event)
   const scope = await getAccessScope(user.id)
   return prisma.goal.create({
    data: {
      name: parsed.data.name,
      description: parsed.data.description,
      target: parsed.data.target,
      startDate: parsed.data.startDate ? parseDate(parsed.data.startDate, 'startDate') : new Date(),
      dueDate: parsed.data.dueDate ? parseDate(parsed.data.dueDate, 'dueDate') : undefined,
        scope: 'shared',
       ownerUserId: user.id,
       coupleId: scope.coupleId ?? undefined,
    },
  })
})
