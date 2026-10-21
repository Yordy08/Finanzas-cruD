<template>
  <main class="access">
    <section class="card">
      <p class="eyebrow">Finanzas compartidas</p>
      <h1>{{ registerMode ? 'Crear cuenta' : 'Iniciar sesión' }}</h1>
      <form autocomplete="on" @submit.prevent="submit">
        <label v-if="registerMode">Nombre<input v-model="form.name" name="name" required autocomplete="name" /></label>
        <label>Correo<input v-model="form.email" name="username" required type="email" autocomplete="username" /></label>
        <label>Contraseña<input v-model="form.password" name="password" required type="password" minlength="8" :autocomplete="registerMode ? 'new-password' : 'current-password'" /></label>
        <button :disabled="loading">{{ loading ? 'Procesando...' : registerMode ? 'Crear cuenta' : 'Entrar' }}</button>
      </form>
      <p v-if="error" class="error">{{ error }}</p>
      <button class="link" type="button" @click="registerMode = !registerMode">{{ registerMode ? 'Ya tengo una cuenta' : 'Crear una cuenta' }}</button>
    </section>
  </main>
</template>

<script setup lang="ts">
const registerMode = ref(false)
const loading = ref(false)
const error = ref('')
const form = reactive({ name: '', email: '', password: '' })

const submit = async () => {
  loading.value = true
  error.value = ''
  try {
    await $fetch(registerMode.value ? '/api/auth/register' : '/api/auth/login', { method: 'POST', body: form })
    await navigateTo('/')
  } catch (e: any) {
    error.value = e?.data?.statusMessage || 'No se pudo completar el acceso'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.access{min-height:100vh;display:grid;place-items:center;padding:24px;background:radial-gradient(circle at 20% 10%,rgba(34,211,238,.18),transparent 32%),radial-gradient(circle at 85% 90%,rgba(236,72,153,.16),transparent 35%),#0b1220;color:#fff}.card{width:min(100%,420px);padding:28px;border:1px solid rgba(139,92,246,.3);border-radius:22px;background:rgba(20,30,58,.9);box-shadow:0 24px 80px rgba(0,0,0,.25)}.eyebrow{color:#67e8f9;font-weight:800;text-transform:uppercase;letter-spacing:.08em;font-size:12px}.card form{display:grid;gap:15px;margin-top:24px}.card label{display:grid;gap:6px;font-size:14px;font-weight:700}.card input{padding:12px;border:1px solid rgba(139,92,246,.3);border-radius:10px;background:#101a33;color:#fff}.card button{padding:12px;border:0;border-radius:10px;background:linear-gradient(135deg,#8b5cf6,#ec4899);color:#fff;font-weight:800;cursor:pointer}.card .link{margin-top:14px;background:transparent;color:#67e8f9;width:100%}.error{color:#fb7185;margin-top:14px}
</style>
