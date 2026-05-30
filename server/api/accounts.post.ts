import prisma from '../utils/prisma'
import { z } from 'zod'
import { createError, defineEventHandler, readBody } from 'h3'




const BodySchema = z.object({
  userId: z.string().min(1),
  name: z.string().min(1),
  balance: z.number().optional(),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = BodySchema.safeParse(body)

  if (!parsed.success) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid body', data: parsed.error.flatten() })
  }

  const { userId, name } = parsed.data
  const balance = parsed.data.balance ?? 0

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'User not found' })
  }

  return await prisma.account.create({
    data: {
      name,
      balance,
      userId,
    },
  })
})
