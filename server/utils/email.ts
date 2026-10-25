import nodemailer from 'nodemailer'
import prisma from './prisma'
import { getAccessScope } from './access'

type SharedEmail = {
  subject: string
  text: string
  html: string
}

export const sendSharedEmail = async (userId: string, email: SharedEmail) => {
  const config = useRuntimeConfig()
  const host = config.smtpHost || process.env.SMTP_HOST
  const port = Number(config.smtpPort || process.env.SMTP_PORT || 465)
  const user = config.smtpUser || process.env.SMTP_USER
  const pass = config.smtpPass || process.env.SMTP_PASS
  const from = config.emailFrom || process.env.EMAIL_FROM
  const fromName = config.emailFromName || process.env.EMAIL_FROM_NAME || 'FinanzaN&Y'

  if (!host || !user || !pass || !from) {
    console.error('[email] Shared notification not sent: missing SMTP configuration', {
      missing: [!host && 'SMTP_HOST', !user && 'SMTP_USER', !pass && 'SMTP_PASS', !from && 'EMAIL_FROM'].filter(Boolean),
    })
    return false
  }

  try {
    const scope = await getAccessScope(userId)
    const recipients = await prisma.user.findMany({
      where: { id: { in: scope.memberIds } },
      select: { email: true },
    })
    const to = [...new Set(recipients.map((recipient) => recipient.email))]
    if (!to.length) return false

    return await sendEmail(to, email)
  } catch (error) {
    console.error('[email] Could not send shared notification', error)
    return false
  }
}

export const sendEmail = async (to: string | string[], email: SharedEmail) => {
  const config = useRuntimeConfig()
  const host = config.smtpHost || process.env.SMTP_HOST
  const port = Number(config.smtpPort || process.env.SMTP_PORT || 465)
  const user = config.smtpUser || process.env.SMTP_USER
  const pass = config.smtpPass || process.env.SMTP_PASS
  const from = config.emailFrom || process.env.EMAIL_FROM
  const fromName = config.emailFromName || process.env.EMAIL_FROM_NAME || 'FinanzaN&Y'

  if (!host || !user || !pass || !from) {
    console.error('[email] Email not sent: missing SMTP configuration', {
      missing: [!host && 'SMTP_HOST', !user && 'SMTP_USER', !pass && 'SMTP_PASS', !from && 'EMAIL_FROM'].filter(Boolean),
    })
    return false
  }

  try {
    const transporter = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } })
    await transporter.sendMail({ from: { name: fromName, address: from }, to, subject: email.subject, text: email.text, html: email.html })
    return true
  } catch (error) {
    console.error('[email] Could not send email', error)
    return false
  }
}

export const escapeHtml = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;')
