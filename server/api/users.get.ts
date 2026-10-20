import prisma from '../utils/prisma'
import { defineEventHandler } from 'h3'
import { getAccessScope } from '../utils/access'
import { requireAuthenticatedUser } from '../utils/access'

export default defineEventHandler(async (event) => {
  const user = await requireAuthenticatedUser(event)
  const scope = await getAccessScope(user.id)
  return prisma.user.findMany({ where: { id: { in: scope.memberIds } }, select: { id: true, name: true, email: true } })
})
