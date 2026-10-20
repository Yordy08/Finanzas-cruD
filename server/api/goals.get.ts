import { defineEventHandler } from 'h3'
import prisma from '../utils/prisma'
import { getAccessScope } from '../utils/access'
import { requireAuthenticatedUser } from '../utils/access'

export default defineEventHandler(async (event) => {
  const user = await requireAuthenticatedUser(event)
  const scope = await getAccessScope(user.id)
  const goals = await prisma.goal.findMany({
    where: scope.coupleId ? { OR: [{ coupleId: scope.coupleId, scope: 'shared' }, { ownerUserId: user.id, scope: 'individual' }] } : { ownerUserId: user.id },
    include: { movements: { orderBy: { date: 'desc' }, include: { user: { select: { id: true, name: true } } } } },
    orderBy: { createdAt: 'desc' },
  })
  return goals.map((goal) => {
    const contributions = goal.movements.filter((m) => m.type === 'contribution').reduce((sum, m) => sum + m.amount, 0)
    const withdrawals = goal.movements.filter((m) => m.type === 'withdrawal').reduce((sum, m) => sum + m.amount, 0)
    const balance = contributions - withdrawals
    return { ...goal, contributions, withdrawals, balance, progress: goal.target > 0 ? Math.min(100, Math.max(0, balance / goal.target * 100)) : 0 }
  })
})
