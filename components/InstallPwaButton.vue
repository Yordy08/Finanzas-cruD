<template>
  <button v-if="canInstall" class="installButton" type="button" @click="install">
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3v12m0 0 5-5m-5 5-5-5M5 21h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
    Instalar app
  </button>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

const canInstall = ref(false)
let deferredPrompt: any = null

const handleInstallPrompt = (event: Event) => {
  event.preventDefault()
  deferredPrompt = event
  canInstall.value = true
}

const handleInstalled = () => {
  deferredPrompt = null
  canInstall.value = false
}

const install = async () => {
  if (!deferredPrompt) return
  deferredPrompt.prompt()
  const result = await deferredPrompt.userChoice
  if (result?.outcome === 'accepted') handleInstalled()
  deferredPrompt = null
  canInstall.value = false
}

onMounted(() => {
  window.addEventListener('beforeinstallprompt', handleInstallPrompt)
  window.addEventListener('appinstalled', handleInstalled)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeinstallprompt', handleInstallPrompt)
  window.removeEventListener('appinstalled', handleInstalled)
})
</script>

<style scoped>
.installButton { display: inline-flex; align-items: center; gap: 7px; min-height: 38px; padding: 0 12px; border: 1px solid rgba(34, 211, 238, 0.3); border-radius: 12px; background: rgba(34, 211, 238, 0.12); color: #cffafe; font-weight: 800; cursor: pointer; }
.installButton:hover { background: rgba(34, 211, 238, 0.2); }
</style>
