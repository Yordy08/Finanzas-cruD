export default defineNuxtRouteMiddleware(async (to) => {
  const publicRoutes = ['/acceso', '/recuperar-contrasena', '/restablecer-contrasena']
  const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined

  try {
    await $fetch('/api/auth/me', { headers })
    if (to.path === '/acceso') return navigateTo('/')
  } catch {
    if (!publicRoutes.includes(to.path)) return navigateTo('/acceso')
  }
})
