import { defineEventHandler } from 'h3'
import prisma from '../../utils/prisma'
import { getAccessScope, requireAuthenticatedUser } from '../../utils/access'

export default defineEventHandler(async (event) => {
  const user = await requireAuthenticatedUser(event)
  const scope = await getAccessScope(user.id)
  const categories = await prisma.transaction.findMany({
    where: { userId: { in: scope.memberIds } },
    select: { category: true },
    distinct: ['category'],
    orderBy: { category: 'asc' },
  })

  return categories
    .map(({ category }) => category.trim())
    .filter(Boolean)
})
