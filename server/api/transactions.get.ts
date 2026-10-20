import prisma from '../utils/prisma'
import { z } from 'zod'
import { createError, defineEventHandler, getQuery } from 'h3'
import { getAccessScope } from '../utils/access'
import { requireAuthenticatedUser } from '../utils/access'




const QuerySchema = z.object({
  userId: z.string().min(1),
  accountId: z.string().min(1).optional(),
  type: z.enum(['income', 'expense']).optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  category: z.string().optional(),
  search: z.string().optional(),
  recordedById: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(50),
})

export default defineEventHandler(async (event) => {
  const query = await getQuery(event)
  const parsed = QuerySchema.safeParse(query)

  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid query', data: parsed.error.flatten() })
  }

  const { accountId, type, from, to, category, search, recordedById, page, pageSize } = parsed.data
  const user = await requireAuthenticatedUser(event)
  const scope = await getAccessScope(user.id)

  return await prisma.transaction.findMany({
    where: {
      userId: { in: scope.memberIds },
      ...(accountId ? { accountId } : {}),
      ...(type ? { type } : {}),
      ...(category ? { category } : {}),
      ...(recordedById ? { recordedById } : {}),
      ...(search ? { description: { contains: search, mode: 'insensitive' } } : {}),
      ...(from || to ? { date: { ...(from ? { gte: new Date(`${from}T00:00:00`) } : {}), ...(to ? { lte: new Date(`${to}T23:59:59.999`) } : {}) } } : {}),
    },
    include: {
      account: true,
      recordedBy: { select: { id: true, name: true, email: true } },
    },
    orderBy: { date: 'desc' },
    skip: (page - 1) * pageSize,
    take: pageSize,
  })
})
