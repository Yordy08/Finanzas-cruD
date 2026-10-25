import { createError, defineEventHandler, readBody } from 'h3'
import { z } from 'zod'
import prisma from '../../utils/prisma'
import { hashPassword, hashToken } from '../../utils/auth'

const Schema = z.object({ token: z.string().min(1), password: z.string().min(8).max(200) })

export default defineEventHandler(async (event) => {
  const parsed = Schema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Datos inválidos' })

  const resetToken = await prisma.passwordResetToken.findUnique({ where: { tokenHash: hashToken(parsed.data.token) } })
  if (!resetToken || resetToken.usedAt || resetToken.expiresAt <= new Date()) {
    throw createError({ statusCode: 400, statusMessage: 'El enlace no es válido o ya expiró' })
  }

  await prisma.$transaction([
    prisma.user.update({ where: { id: resetToken.userId }, data: { passwordHash: await hashPassword(parsed.data.password) } }),
    prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { usedAt: new Date() } }),
    prisma.session.deleteMany({ where: { userId: resetToken.userId } }),
  ])

  return { message: 'Contraseña actualizada correctamente' }
})
