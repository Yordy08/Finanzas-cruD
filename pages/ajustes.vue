<template>
  <div class="container">
    <TopBar />
    <h1>Ajustes</h1>
    <section class="card">
      <h2>Notificaciones y sonido</h2>
      <p>Permiso de notificaciones: <strong>{{ permission }}</strong></p>
      <p>Service Worker: <strong>{{ serviceWorker }}</strong></p>
      <p class="muted">Las notificaciones push cuando la aplicación está cerrada requieren un backend con Web Push y claves VAPID.</p>
      <div class="actions">
        <button @click="requestPermission">Solicitar permiso</button>
        <button class="secondary" @click="testSound">Probar sonido</button>
      </div>
      <label class="settingToggle">
        <span><strong>Sonido en alertas abiertas</strong><small>Reproduce un aviso sonoro dentro de la aplicación.</small></span>
        <input v-model="soundEnabled" type="checkbox" />
        <span class="slider" aria-hidden="true" />
      </label>
      <p v-if="message" class="message">{{ message }}</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import TopBar from '~/components/TopBar.vue'

const permission = ref('desconocido')
const serviceWorker = ref('comprobando')
const soundEnabled = ref(true)
const message = ref('')

const requestPermission = async () => {
  if (!('Notification' in window)) { permission.value = 'no compatible'; return }
  permission.value = await Notification.requestPermission()
  if (permission.value === 'granted') new Notification('Finanzas', { body: 'Las notificaciones están activas.' })
}

const testSound = () => {
  if (!soundEnabled.value) { message.value = 'Activa el sonido primero.'; return }
  const context = new AudioContext()
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  oscillator.frequency.value = 660
  gain.gain.value = 0.05
  oscillator.connect(gain)
  gain.connect(context.destination)
  oscillator.start()
  oscillator.stop(context.currentTime + 0.25)
  message.value = 'Sonido reproducido.'
}

watch(soundEnabled, (enabled) => localStorage.setItem('payment-sound-enabled', String(enabled)))

onMounted(async () => {
  permission.value = 'Notification' in window ? Notification.permission : 'no compatible'
  soundEnabled.value = localStorage.getItem('payment-sound-enabled') !== 'false'
  serviceWorker.value = 'serviceWorker' in navigator
    ? (await navigator.serviceWorker.getRegistration() ? 'activo o registrado' : 'no registrado')
    : 'no compatible'
})
</script>

<style scoped>
.container { max-width: 800px; margin: auto; color: #fff; }
.card { background: rgba(20, 30, 58, .88); border: 1px solid rgba(139, 92, 246, .22); border-radius: 18px; padding: 18px; }
.muted, .settingToggle small { color: #b7c4e3; }
.actions { display: flex; gap: 10px; margin: 18px 0; }
.actions button { padding: 11px 14px; border: 0; border-radius: 10px; background: linear-gradient(135deg, #8b5cf6, #ec4899); color: #fff; font-weight: 800; cursor: pointer; }
.actions .secondary { background: #24345c; }
.settingToggle { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px; border: 1px solid rgba(255, 255, 255, .1); border-radius: 14px; cursor: pointer; }
.settingToggle span:first-child { display: grid; gap: 4px; }
.settingToggle input { position: absolute; opacity: 0; pointer-events: none; }
.slider { width: 46px; height: 26px; flex: 0 0 auto; border-radius: 999px; background: #475569; position: relative; transition: .2s; }
.slider::after { content: ''; position: absolute; width: 20px; height: 20px; top: 3px; left: 3px; border-radius: 50%; background: #fff; transition: .2s; }
.settingToggle input:checked + .slider { background: #8b5cf6; }
.settingToggle input:checked + .slider::after { transform: translateX(20px); }
.message { color: #67e8f9; }
@media (max-width: 600px) { .actions { flex-direction: column; } }
</style>
