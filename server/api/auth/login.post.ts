import { createError, defineEventHandler, readBody } from 'h3'
import { z } from 'zod'
import prisma from '../../utils/prisma'
import { createSession, verifyPassword } from '../../utils/auth'

const Schema = z.object({ email: z.string().trim().email(), password: z.string().min(1) })

export default defineEventHandler(async (event) => {
  const parsed = Schema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Invalid login data' })
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } })
  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' })
  await createSession(event, user.id)
  return { id: user.id, email: user.email, name: user.name }
})
