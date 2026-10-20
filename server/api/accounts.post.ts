import prisma from '../utils/prisma'
import { z } from 'zod'
import { createError, defineEventHandler, readBody } from 'h3'
import { getAccessScope } from '../utils/access'
import { requireAuthenticatedUser } from '../utils/access'




const BodySchema = z.object({
  userId: z.string().min(1),
  name: z.string().trim().min(1).max(100),
  balance: z.number().finite().nonnegative().optional(),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = BodySchema.safeParse(body)

  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid body', data: parsed.error.flatten() })
  }

  const { name } = parsed.data
  const user = await requireAuthenticatedUser(event)
  const userId = user.id
  const balance = parsed.data.balance ?? 0

  const scope = await getAccessScope(userId)

  return await prisma.account.create({
    data: {
      name,
      balance,
      userId,
      coupleId: scope.coupleId,
    },
  })
})
