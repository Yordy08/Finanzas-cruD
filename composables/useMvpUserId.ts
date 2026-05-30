export const useMvpUserId = () => {
  const config = useRuntimeConfig() as any
  const mvpUserId = config?.public?.MVP_USER_ID

  // Validación explícita: evita enviar el placeholder a Mongo.
  if (!mvpUserId || typeof mvpUserId !== 'string' || !mvpUserId.trim()) {
    return ''
  }

  // Nunca permitir placeholders al llegar a las APIs.
  if (mvpUserId.trim() === 'MVP_USER_ID_REPLACE_ME') {
    return ''
  }

  return mvpUserId.trim()
}


