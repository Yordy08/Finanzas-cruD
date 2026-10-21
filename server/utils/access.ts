import { createError } from 'h3'
import prisma from './prisma'
import { requireAuth } from './auth'
import type { H3Event } from 'h3'

export const requireAuthenticatedUser = (event: H3Event) => requireAuth(event)

export const requireUser = async (userId: unknown) => {
  if (typeof userId !== 'string' || !/^[a-f\d]{24}$/i.test(userId)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid user id' })
  }

  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw createError({ statusCode: 404, statusMessage: 'User not found' })
  return user
}

export const getAccessScope = async (userId: string) => {
  await requireUser(userId)
  const membership = await prisma.coupleMember.findFirst({
    where: { userId },
    include: { couple: true },
  })

  // This app is limited to two registered users, so both users share the same
  // financial scope even if an old or incomplete couple membership exists.
  const memberIds = (await prisma.user.findMany({ select: { id: true }, orderBy: { createdAt: 'asc' } })).map((u) => u.id)

  return {
    userId,
    coupleId: membership?.coupleId ?? null,
    memberIds: memberIds.length ? memberIds : [userId],
  }
}

export const parseDate = (value: unknown, field = 'date') => {
  if (typeof value !== 'string' || Number.isNaN(new Date(value).getTime())) {
    throw createError({ statusCode: 400, statusMessage: `Invalid ${field}` })
  }
  return new Date(value)
}
