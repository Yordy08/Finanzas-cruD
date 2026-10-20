export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/acceso') return
  try {
    await $fetch('/api/auth/me')
  } catch {
    return navigateTo('/acceso')
  }
})
