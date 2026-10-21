import { createError, defineEventHandler, readBody } from 'h3'
import { z } from 'zod'
import { randomUUID } from 'node:crypto'
import prisma from '../utils/prisma'
import { getAccessScope } from '../utils/access'
import { requireAuthenticatedUser } from '../utils/access'

const Schema = z.object({ userId: z.string(), email: z.string().email().optional() })

export default defineEventHandler(async (event) => {
  const parsed = Schema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Invalid invitation' })
  const user = await requireAuthenticatedUser(event)
  const scope = await getAccessScope(user.id)
  if (!scope.coupleId) throw createError({ statusCode: 409, statusMessage: 'Create a couple first' })

  const memberCount = await prisma.coupleMember.count({ where: { coupleId: scope.coupleId } })
  if (memberCount >= 2) throw createError({ statusCode: 409, statusMessage: 'This couple already has two members' })

  return prisma.coupleInvite.create({
    data: { coupleId: scope.coupleId, invitedById: user.id, email: parsed.data.email, token: randomUUID(), expiresAt: new Date(Date.now() + 7 * 86400000) },
  })
})
