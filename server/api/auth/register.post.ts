import { createError, defineEventHandler, readBody } from 'h3'
import { z } from 'zod'
import prisma from '../../utils/prisma'
import { createSession, hashPassword } from '../../utils/auth'

const Schema = z.object({
  email: z.string().trim().email().max(200),
  name: z.string().trim().min(1).max(80),
  password: z.string().min(8).max(200),
})

export default defineEventHandler(async (event) => {
  const parsed = Schema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Invalid registration data' })
  const email = parsed.data.email.toLowerCase()
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw createError({ statusCode: 409, statusMessage: 'Email already registered' })
  const user = await prisma.user.create({ data: { email, name: parsed.data.name, passwordHash: await hashPassword(parsed.data.password) } })
  await createSession(event, user.id)
  return { id: user.id, email: user.email, name: user.name }
})
