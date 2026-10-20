import { createError } from 'h3'
import prisma from './prisma'

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

  return {
    userId,
    coupleId: membership?.coupleId ?? null,
    memberIds: membership
      ? (await prisma.coupleMember.findMany({ where: { coupleId: membership.coupleId }, select: { userId: true } })).map((m) => m.userId)
      : [userId],
  }
}

export const parseDate = (value: unknown, field = 'date') => {
  if (typeof value !== 'string' || Number.isNaN(new Date(value).getTime())) {
    throw createError({ statusCode: 400, statusMessage: `Invalid ${field}` })
  }
  return new Date(value)
}
