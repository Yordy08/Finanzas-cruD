import { defineEventHandler } from 'h3'
import { clearSession } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  await clearSession(event)
  return { ok: true }
})
