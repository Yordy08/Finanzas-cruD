import prisma from '../utils/prisma'
import { z } from 'zod'
import { createError, defineEventHandler, getQuery } from 'h3'




const QuerySchema = z.object({
  userId: z.string().min(1),
  accountId: z.string().min(1).optional(),
  type: z.enum(['income', 'expense']).optional(),
})

export default defineEventHandler(async (event) => {
  const query = await getQuery(event)
  const parsed = QuerySchema.safeParse(query)

  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid query', data: parsed.error.flatten() })
  }

  const { userId, accountId, type } = parsed.data

  return await prisma.transaction.findMany({
    where: {
      userId,
      ...(accountId ? { accountId } : {}),
      ...(type ? { type } : {}),
    },
    include: {
      account: true,
    },
    orderBy: { createdAt: 'desc' },
  })
})
