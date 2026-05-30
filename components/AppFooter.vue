<template>
  <footer class="footer">
    <div class="left">
      <span class="name">{{ appName }}</span>
    </div>

    <div class="center">
      <span class="meta">v{{ version }}</span>
      <span class="sep">•</span>
      <span class="meta">PWA: {{ pwaStatus }}</span>
    </div>

    <div class="right" />
  </footer>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const appName = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cfg = useNuxtApp().$config as any
  return cfg?.public?.appName || 'Finanzas CRUD'
})

const version = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cfg = useNuxtApp().$config as any
  const p = cfg?.public?.version
  return p ? String(p) : '0.0.0'
})


const pwaStatus = ref('Sin confirmar')

onMounted(() => {
  // ServiceWorker + offline/instalación (placeholder)
  const hasSW = 'serviceWorker' in navigator
  if (!hasSW) {
    pwaStatus.value = 'No soportado'
    return
  }

  navigator.serviceWorker
    .getRegistration()
    .then((reg) => {
      if (!reg) {
        pwaStatus.value = 'ServiceWorker no registrado'
        return
      }

      // register ok
      pwaStatus.value = reg.active ? 'Activo (offline básico)' : 'Registrado'
    })
    .catch(() => {
      pwaStatus.value = 'Error comprobando SW'
    })
})
</script>

<style scoped>
.footer {
  height: 56px;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 0 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(11, 18, 32, 0.72);
  color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

.name {
  font-weight: 950;
  opacity: 0.95;
}

.center {
  display: flex;
  align-items: center;
  gap: 10px;
}

.meta {
  font-weight: 800;
  opacity: 0.85;
  font-size: 13px;
}

.sep {
  opacity: 0.5;
}
</style>

