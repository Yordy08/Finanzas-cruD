<template>
  <main class="access">
    <section class="card">
      <p class="eyebrow">FinanzaN&Y</p>
      <h1>Nueva contraseña</h1>
      <form @submit.prevent="submit">
        <label>Contraseña<input v-model="password" required type="password" minlength="8" autocomplete="new-password" /></label>
        <label>Confirmar contraseña<input v-model="confirmation" required type="password" minlength="8" autocomplete="new-password" /></label>
        <button :disabled="loading || !token">{{ loading ? 'Guardando...' : 'Cambiar contraseña' }}</button>
      </form>
      <p v-if="message" class="message">{{ message }}</p>
      <p v-if="error" class="error">{{ error }}</p>
      <NuxtLink v-if="message" class="back" to="/acceso">Ir al acceso</NuxtLink>
    </section>
  </main>
</template>

<script setup lang="ts">
const route = useRoute()
const token = computed(() => String(route.query.token || ''))
const password = ref('')
const confirmation = ref('')
const loading = ref(false)
const message = ref('')
const error = ref(token.value ? '' : 'El enlace de recuperación no es válido.')

const submit = async () => {
  if (password.value !== confirmation.value) {
    error.value = 'Las contraseñas no coinciden.'
    return
  }
  loading.value = true
  error.value = ''
  try {
    const response = await $fetch<{ message: string }>('/api/auth/reset-password', { method: 'POST', body: { token: token.value, password: password.value } })
    message.value = response.message
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'No se pudo cambiar la contraseña'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.access{min-height:100vh;display:grid;place-items:center;padding:24px;background:radial-gradient(circle at 20% 10%,rgba(34,211,238,.18),transparent 32%),radial-gradient(circle at 85% 90%,rgba(236,72,153,.16),transparent 35%),#0b1220;color:#fff}.card{width:min(100%,420px);padding:28px;border:1px solid rgba(139,92,246,.3);border-radius:22px;background:rgba(20,30,58,.9);box-shadow:0 24px 80px rgba(0,0,0,.25)}.eyebrow{color:#67e8f9;font-weight:800;text-transform:uppercase;letter-spacing:.08em;font-size:12px}.card form{display:grid;gap:15px;margin-top:24px}.card label{display:grid;gap:6px;font-size:14px;font-weight:700}.card input{padding:12px;border:1px solid rgba(139,92,246,.3);border-radius:10px;background:#101a33;color:#fff}.card button{padding:12px;border:0;border-radius:10px;background:linear-gradient(135deg,#8b5cf6,#ec4899);color:#fff;font-weight:800;cursor:pointer}.message{color:#86efac}.error{color:#fb7185}.back{display:block;margin-top:16px;color:#67e8f9;text-align:center;text-decoration:none}
</style>
