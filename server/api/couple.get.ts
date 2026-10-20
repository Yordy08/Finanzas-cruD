import { defineEventHandler, getQuery } from 'h3'
import prisma from '../utils/prisma'
import { getAccessScope } from '../utils/access'

export default defineEventHandler(async (event) => {
  const userId = String(getQuery(event).userId || '')
  const scope = await getAccessScope(userId)
  if (!scope.coupleId) return { couple: null, members: [] }

  return prisma.couple.findUnique({
    where: { id: scope.coupleId },
    include: { members: { include: { user: { select: { id: true, name: true, email: true } } } } },
  })
})
