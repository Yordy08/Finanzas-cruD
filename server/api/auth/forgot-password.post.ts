import { createError, defineEventHandler, getRequestURL, readBody } from 'h3'
import { randomBytes } from 'node:crypto'
import { z } from 'zod'
import prisma from '../../utils/prisma'
import { escapeHtml, sendEmail } from '../../utils/email'
import { hashToken } from '../../utils/auth'

const Schema = z.object({ email: z.string().trim().email().max(200) })

export default defineEventHandler(async (event) => {
  const parsed = Schema.safeParse(await readBody(event))
  if (!parsed.success) throw createError({ statusCode: 400, statusMessage: 'Correo inválido' })

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } })
  if (user) {
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000)
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id, usedAt: null } })
    await prisma.passwordResetToken.create({ data: { tokenHash: hashToken(token), userId: user.id, expiresAt } })

    const resetUrl = `${getRequestURL(event).origin}/restablecer-contrasena?token=${encodeURIComponent(token)}`
    await sendEmail(user.email, {
      subject: 'Recupera tu contraseña de FinanzaN&Y',
      text: `Usa este enlace para crear una nueva contraseña. Es válido durante una hora: ${resetUrl}`,
      html: `<h2>Recupera tu contraseña</h2><p>Este enlace es válido durante una hora y solo puede utilizarse una vez.</p><p><a href="${escapeHtml(resetUrl)}">Crear nueva contraseña</a></p>`,
    })
  }

  return { message: 'Si el correo está registrado, recibirás un enlace para recuperar tu contraseña.' }
})
