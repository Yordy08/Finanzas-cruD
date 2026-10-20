import { defineEventHandler } from 'h3'
import prisma from '../utils/prisma'
import { getAccessScope } from '../utils/access'
import { requireAuthenticatedUser } from '../utils/access'

export default defineEventHandler(async (event) => {
  const user = await requireAuthenticatedUser(event)
  const scope = await getAccessScope(user.id)
  if (!scope.coupleId) return { couple: null, members: [] }

  return prisma.couple.findUnique({
    where: { id: scope.coupleId },
    include: { members: { include: { user: { select: { id: true, name: true, email: true } } } } },
  })
})
