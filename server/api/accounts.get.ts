import prisma from '../utils/prisma'
import { z } from 'zod'
import { createError, defineEventHandler, getQuery } from 'h3'
import { getAccessScope } from '../utils/access'
import { requireAuthenticatedUser } from '../utils/access'




const QuerySchema = z.object({
  userId: z.string().min(1),
})

export default defineEventHandler(async (event) => {
  const query = await getQuery(event)
  const parsed = QuerySchema.safeParse(query)

  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid query', data: parsed.error.flatten() })
  }

  const user = await requireAuthenticatedUser(event)
  const scope = await getAccessScope(user.id)

  return await prisma.account.findMany({
    where: scope.coupleId ? { OR: [{ userId: { in: scope.memberIds } }, { coupleId: scope.coupleId }] } : { userId: user.id },
    orderBy: { createdAt: 'desc' },
  })
})
