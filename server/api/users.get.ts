import prisma from '../utils/prisma'
import { createError, getQuery } from 'h3'
import { getAccessScope } from '../utils/access'

export default defineEventHandler(async (event) => {
  const userId = String(getQuery(event).userId || '')
  if (!userId) throw createError({ statusCode: 400, statusMessage: 'userId is required' })
  const scope = await getAccessScope(userId)
  return prisma.user.findMany({ where: { id: { in: scope.memberIds } }, select: { id: true, name: true, email: true } })
})
