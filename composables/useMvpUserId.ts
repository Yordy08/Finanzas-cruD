export const useMvpUserId = () => {
  const config = useRuntimeConfig() as any
  const mvpUserId = config?.public?.MVP_USER_ID

  // Kept as a compatibility value for existing forms. Protected APIs derive
  // the real owner from the HttpOnly session and ignore this value.
  if (!mvpUserId || typeof mvpUserId !== 'string' || !mvpUserId.trim() || mvpUserId.trim() === 'MVP_USER_ID_REPLACE_ME') return 'authenticated'
  return mvpUserId.trim()
}


