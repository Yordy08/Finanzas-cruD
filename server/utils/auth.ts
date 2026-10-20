import { createHash, randomBytes, scrypt as nodeScrypt, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import { createError, deleteCookie, getCookie, setCookie, type H3Event } from 'h3'
import prisma from './prisma'

const scrypt = promisify(nodeScrypt)
const COOKIE = 'finanzas_session'
const SESSION_DAYS = 30

const hashToken = (token: string) => createHash('sha256').update(token).digest('hex')

export const hashPassword = async (password: string) => {
  const salt = randomBytes(16).toString('hex')
  const derived = await scrypt(password, salt, 64) as Buffer
  return `scrypt:${salt}:${derived.toString('hex')}`
}

export const verifyPassword = async (password: string, encoded: string | null) => {
  if (!encoded?.startsWith('scrypt:')) return false
  const [, salt, expectedHex] = encoded.split(':')
  const actual = await scrypt(password, salt, 64) as Buffer
  const expected = Buffer.from(expectedHex, 'hex')
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}

export const createSession = async (event: H3Event, userId: string) => {
  const token = randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000)
  await prisma.session.create({ data: { tokenHash: hashToken(token), userId, expiresAt } })
  setCookie(event, COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: SESSION_DAYS * 24 * 60 * 60 })
}

export const requireAuth = async (event: H3Event) => {
  const token = getCookie(event, COOKIE)
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Authentication required' })
  const session = await prisma.session.findUnique({ where: { tokenHash: hashToken(token) }, include: { user: true } })
  if (!session || session.expiresAt <= new Date()) {
    if (session) await prisma.session.delete({ where: { id: session.id } })
    deleteCookie(event, COOKIE, { path: '/' })
    throw createError({ statusCode: 401, statusMessage: 'Session expired' })
  }
  return session.user
}

export const clearSession = async (event: H3Event) => {
  const token = getCookie(event, COOKIE)
  if (token) await prisma.session.deleteMany({ where: { tokenHash: hashToken(token) } })
  deleteCookie(event, COOKIE, { path: '/' })
}
