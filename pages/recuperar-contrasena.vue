<template>
  <main class="access">
    <section class="card">
      <p class="eyebrow">FinanzaN&Y</p>
      <h1>Recuperar contraseña</h1>
      <p class="help">Escribe tu correo y te enviaremos un enlace temporal para crear una nueva contraseña.</p>
      <form @submit.prevent="submit">
        <label>Correo<input v-model="email" required type="email" autocomplete="email" /></label>
        <button :disabled="loading">{{ loading ? 'Enviando...' : 'Enviar enlace' }}</button>
      </form>
      <p v-if="message" class="message">{{ message }}</p>
      <p v-if="error" class="error">{{ error }}</p>
      <NuxtLink class="back" to="/acceso">Volver al acceso</NuxtLink>
    </section>
  </main>
</template>

<script setup lang="ts">
const email = ref('')
const loading = ref(false)
const message = ref('')
const error = ref('')

const submit = async () => {
  loading.value = true
  message.value = ''
  error.value = ''
  try {
    const response = await $fetch<{ message: string }>('/api/auth/forgot-password', { method: 'POST', body: { email: email.value } })
    message.value = response.message
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'No se pudo procesar la solicitud'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.access{min-height:100vh;display:grid;place-items:center;padding:24px;background:radial-gradient(circle at 20% 10%,rgba(34,211,238,.18),transparent 32%),radial-gradient(circle at 85% 90%,rgba(236,72,153,.16),transparent 35%),#0b1220;color:#fff}.card{width:min(100%,420px);padding:28px;border:1px solid rgba(139,92,246,.3);border-radius:22px;background:rgba(20,30,58,.9);box-shadow:0 24px 80px rgba(0,0,0,.25)}.eyebrow{color:#67e8f9;font-weight:800;text-transform:uppercase;letter-spacing:.08em;font-size:12px}.help{color:#b7c4e3;line-height:1.5}.card form{display:grid;gap:15px;margin-top:24px}.card label{display:grid;gap:6px;font-size:14px;font-weight:700}.card input{padding:12px;border:1px solid rgba(139,92,246,.3);border-radius:10px;background:#101a33;color:#fff}.card button{padding:12px;border:0;border-radius:10px;background:linear-gradient(135deg,#8b5cf6,#ec4899);color:#fff;font-weight:800;cursor:pointer}.message{color:#86efac;line-height:1.5}.error{color:#fb7185}.back{display:block;margin-top:16px;color:#67e8f9;text-align:center;text-decoration:none}
</style>
