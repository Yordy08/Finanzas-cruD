import { createError, defineEventHandler, getHeader } from 'h3'
import prisma from '../../utils/prisma'
import { escapeHtml, sendEmail } from '../../utils/email'

const MAX_REMINDER_HOURS = 24 * 365
const HOUR_MS = 60 * 60 * 1000

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const secret = config.cronSecret || process.env.CRON_SECRET
  if (!secret) throw createError({ statusCode: 503, statusMessage: 'Cron secret is not configured' })
  if (getHeader(event, 'authorization') !== `Bearer ${secret}`) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const now = new Date()
  const maxDueAt = new Date(now.getTime() + MAX_REMINDER_HOURS * HOUR_MS)
  const candidates = await prisma.payment.findMany({
    where: {
      status: 'pending',
      dueAt: { lte: maxDueAt },
      OR: [
        { reminderSentAt: null },
        { reminderSentAt: { isSet: false } },
        { overdueReminderSentAt: null },
        { overdueReminderSentAt: { isSet: false } },
      ],
    },
    include: {
      responsibleUser: { select: { id: true, email: true, name: true } },
      couple: { include: { members: { include: { user: { select: { email: true } } } } } },
    },
  })

  let sent = 0
  let failed = 0

  for (const payment of candidates) {
    const overdue = payment.dueAt.getTime() <= now.getTime()
    if (!overdue && (payment.reminderSentAt || payment.dueAt.getTime() > now.getTime() + payment.reminderHours * HOUR_MS)) continue
    if (overdue && payment.overdueReminderSentAt) continue

    const recipients = payment.couple
      ? payment.couple.members.map((member) => member.user.email)
      : payment.responsibleUser?.email ? [payment.responsibleUser.email] : []
    if (!recipients.length) continue

    const claimAt = new Date()
    const claim = overdue
      ? await prisma.payment.updateMany({
          where: { id: payment.id, status: 'pending', OR: [{ overdueReminderSentAt: null }, { overdueReminderSentAt: { isSet: false } }] },
          data: { overdueReminderSentAt: claimAt },
        })
      : await prisma.payment.updateMany({
          where: { id: payment.id, status: 'pending', OR: [{ reminderSentAt: null }, { reminderSentAt: { isSet: false } }] },
          data: { reminderSentAt: claimAt },
        })
    if (claim.count === 0) continue

    const dueLabel = payment.dueAt.toLocaleString('es-CO', { timeZone: 'America/Bogota' })
    const amount = payment.amount === null
      ? 'Sin valor registrado'
      : new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(payment.amount)
    const title = overdue ? 'Pago pendiente vencido' : 'Próximo vencimiento de pago'
    const emailSent = await sendEmail([...new Set(recipients)], {
      subject: `${title}: ${payment.title}`,
      text: `${payment.title} · ${amount} · Vencimiento: ${dueLabel}. ${overdue ? 'Este pago está vencido y continúa pendiente.' : 'Recuerda realizar este pago antes de su vencimiento.'}`,
      html: `<h2>${title}</h2><p><strong>Pago:</strong> ${escapeHtml(payment.title)}</p><p><strong>Valor:</strong> ${amount}</p><p><strong>Vencimiento:</strong> ${escapeHtml(dueLabel)}</p><p>${overdue ? 'Este pago está vencido y continúa pendiente.' : 'Recuerda realizar este pago antes de su vencimiento.'}</p>`,
    })

    if (emailSent) {
      sent += 1
    } else {
      failed += 1
      if (overdue) {
        await prisma.payment.updateMany({
          where: { id: payment.id, status: 'pending', overdueReminderSentAt: claimAt },
          data: { overdueReminderSentAt: null },
        })
      } else {
        await prisma.payment.updateMany({
          where: { id: payment.id, status: 'pending', reminderSentAt: claimAt },
          data: { reminderSentAt: null },
        })
      }
    }
  }

  return { checked: candidates.length, sent, failed }
})
