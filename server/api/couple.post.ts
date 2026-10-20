import { createError, defineEventHandler, readBody } from 'h3'
import { z } from 'zod'
import prisma from '../utils/prisma'
import { requireAuthenticatedUser } from '../utils/access'

const Schema = z.object({ userId: z.string(), name: z.string().trim().min(1).max(80), displayName: z.string().trim().min(1).max(80).optional() })

export default defineEventHandler(async (event) => {
  const parsed = Schema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Invalid couple data' })
  const user = await requireAuthenticatedUser(event)
  const existing = await prisma.coupleMember.findFirst({ where: { userId: user.id } })
  if (existing) throw createError({ statusCode: 409, statusMessage: 'User already belongs to a couple' })

  return prisma.couple.create({
    data: {
      name: parsed.data.name,
      members: { create: { userId: user.id, role: 'owner', displayName: parsed.data.displayName || user.name || user.email } },
    },
    include: { members: true },
  })
})
