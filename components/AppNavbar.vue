<template>
  <header class="navbar">
    <div class="left">
      <NuxtLink class="brand" to="/">
        <img class="brandIcon" src="/public/logo.png" alt="Logo" />
        <span class="brandText">{{ appName }}</span>
      </NuxtLink>
    </div>

    <div class="right">
      <button class="iconBtn" type="button" aria-label="Notificaciones (placeholder)">
        <span class="dot" />
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Zm7-6V11a7 7 0 1 0-14 0v5l-2 2v1h18v-1l-2-2Z"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>

      <div class="profile">
        <div class="avatar" aria-hidden="true" />
        <span class="profileText">Perfil</span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const appName = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (useRuntimeConfig() as any).public?.appName || 'Finanzas'
})
</script>

<style scoped>
.navbar {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(11, 18, 32, 0.72);
  backdrop-filter: blur(10px);
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.brandIcon {
  width: 28px;
  height: 28px;
}

.brandText {
  font-weight: 950;
  letter-spacing: 0.2px;
}

.right {
  display: flex;
  align-items: center;
  gap: 14px;
}

.iconBtn {
  position: relative;
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.92);
}

.dot {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #22c55e;
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.18);
}

.profile {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.03);
}

.avatar {
  width: 28px;
  height: 28px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.8), rgba(99, 102, 241, 0.8));
}

.profileText {
  font-weight: 800;
  font-size: 13px;
  opacity: 0.9;
}

@media (max-width: 720px) {
  .profileText {
    display: none;
  }
}
</style>

