import { createError, defineEventHandler, readBody } from 'h3'
import { z } from 'zod'
import prisma from '../utils/prisma'
import { requireAuthenticatedUser } from '../utils/access'

const Schema = z.object({ userId: z.string(), token: z.string().min(20), displayName: z.string().trim().min(1).max(80).optional() })

export default defineEventHandler(async (event) => {
  const parsed = Schema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Invalid invitation data' })
  const user = await requireAuthenticatedUser(event)
  const invite = await prisma.coupleInvite.findUnique({ where: { token: parsed.data.token } })
  if (!invite || invite.status !== 'pending' || invite.expiresAt < new Date()) throw createError({ statusCode: 404, statusMessage: 'Invitation expired or not found' })
  if (await prisma.coupleMember.findFirst({ where: { userId: user.id } })) throw createError({ statusCode: 409, statusMessage: 'User already belongs to a couple' })
  if (await prisma.coupleMember.count({ where: { coupleId: invite.coupleId } }) >= 2) throw createError({ statusCode: 409, statusMessage: 'This couple already has two members' })

  return prisma.$transaction(async (tx) => {
    const memberCount = await tx.coupleMember.count({ where: { coupleId: invite.coupleId } })
    if (memberCount >= 2) throw createError({ statusCode: 409, statusMessage: 'This couple already has two members' })
    await tx.coupleMember.create({ data: { coupleId: invite.coupleId, userId: user.id, role: 'member', displayName: parsed.data.displayName || user.name || user.email } })
    await tx.coupleInvite.update({ where: { id: invite.id }, data: { status: 'accepted' } })
    return tx.couple.findUnique({ where: { id: invite.coupleId }, include: { members: true } })
  })
})
