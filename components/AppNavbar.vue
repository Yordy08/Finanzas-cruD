<template>
  <header class="navbar">
    <div class="left">
      <button class="menuBtn" type="button" aria-label="Abrir menu" :aria-expanded="menuOpen" @click="menuOpen = true">
        <span />
        <span />
        <span />
      </button>
      <NuxtLink class="brand" to="/">
        <img class="brandIcon" src="/logo-mark.svg" alt="" />
        <span class="brandText">{{ appName }}</span>
      </NuxtLink>
    </div>

    <div class="right">
      <InstallPwaButton />
      <button class="iconBtn" type="button" aria-label="Notificaciones" :aria-expanded="notificationsOpen" @click="toggleNotifications">
        <span v-if="recentMovements.length" class="dot" />
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Zm7-6V11a7 7 0 1 0-14 0v5l-2 2v1h18v-1l-2-2Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <div class="profile">
        <div class="avatar" aria-hidden="true" />
        <span class="profileText">Perfil</span>
      </div>
    </div>

    <div v-if="notificationsOpen" class="notificationPanel">
      <div class="panelHeader">
        <strong>Movimientos recientes</strong>
        <NuxtLink to="/movimientos" @click="notificationsOpen = false">Ver todos</NuxtLink>
      </div>
      <p v-if="notificationsLoading" class="panelEmpty">Cargando movimientos...</p>
      <p v-else-if="!recentMovements.length" class="panelEmpty">No hay movimientos recientes.</p>
      <NuxtLink v-for="movement in recentMovements" v-else :key="movement.id" class="movementNotice" to="/movimientos" @click="notificationsOpen = false">
        <span class="noticeIcon" :class="movement.type">{{ movement.type === 'income' ? '+' : '-' }}</span>
        <span class="noticeBody">
          <strong>{{ movement.category }}</strong>
          <small>{{ movement.description || 'Sin descripcion' }} · {{ formatDate(movement.date) }}</small>
        </span>
        <strong class="noticeAmount" :class="movement.type">{{ formatMoney(movement.amount) }}</strong>
      </NuxtLink>
    </div>

    <button v-if="menuOpen" class="drawerBackdrop" type="button" aria-label="Cerrar menu" @click="menuOpen = false" />
    <aside class="drawer" :class="{ open: menuOpen }" aria-label="Navegacion principal">
      <div class="drawerHeader">
        <strong>Menu</strong>
        <button type="button" aria-label="Cerrar menu" @click="menuOpen = false">X</button>
      </div>
      <nav class="drawerLinks">
        <NuxtLink v-for="item in navigation" :key="item.to" :to="item.to" class="drawerLink" @click="menuOpen = false">
          <span class="drawerIcon">{{ item.icon }}</span>{{ item.label }}
        </NuxtLink>
      </nav>
    </aside>
  </header>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'

const appName = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (useRuntimeConfig() as any).public?.appName || 'Finanzas'
})

type Movement = {
  id: string
  type: 'income' | 'expense'
  amount: number
  category: string
  description?: string | null
  date: string
}

const route = useRoute()
const menuOpen = ref(false)
const notificationsOpen = ref(false)
const notificationsLoading = ref(false)
const recentMovements = ref<Movement[]>([])
const navigation = [
  { to: '/', label: 'Resumen', icon: 'R' },
  { to: '/movimientos', label: 'Movimientos', icon: 'M' },
  { to: '/buscar', label: 'Buscar', icon: 'B' },
  { to: '/cuentas', label: 'Cuentas', icon: 'C' },
  { to: '/metas', label: 'Metas', icon: 'T' },
  { to: '/pagos', label: 'Pagos', icon: 'P' },
  { to: '/notificaciones', label: 'Avisos', icon: 'A' },
]

const formatMoney = (amount: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount)
const formatDate = (date: string) => new Date(date).toLocaleDateString('es-CO')

const loadNotifications = async () => {
  if (route.path === '/acceso') return
  notificationsLoading.value = true
  try {
    recentMovements.value = await $fetch('/api/transactions', { params: { userId: 'authenticated', page: 1, pageSize: 5 } }) as Movement[]
  } catch {
    recentMovements.value = []
  } finally {
    notificationsLoading.value = false
  }
}

const toggleNotifications = async () => {
  notificationsOpen.value = !notificationsOpen.value
  if (notificationsOpen.value) await loadNotifications()
}

watch(() => route.fullPath, () => {
  menuOpen.value = false
  notificationsOpen.value = false
})

watch(menuOpen, (open) => {
  if (import.meta.client) document.body.classList.toggle('drawer-open', open)
})

onMounted(loadNotifications)
onUnmounted(() => {
  if (import.meta.client) document.body.classList.remove('drawer-open')
})
</script>

<style scoped>
.navbar {
  position: relative;
  z-index: 20;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(16, 26, 51, 0.82);
  backdrop-filter: blur(10px);
}

.left,
.right {
  display: flex;
  align-items: center;
}

.left { gap: 10px; }
.right { gap: 14px; }

.menuBtn {
  display: none;
  width: 42px;
  height: 42px;
  padding: 9px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.04);
}

.menuBtn span {
  display: block;
  height: 2px;
  margin: 4px 0;
  border-radius: 2px;
  background: white;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.brandIcon { width: 28px; height: 28px; }
.brandText { font-weight: 950; letter-spacing: 0.2px; }

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
  cursor: pointer;
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

.profileText { font-weight: 800; font-size: 13px; opacity: 0.9; }

.notificationPanel {
  position: absolute;
  top: 58px;
  right: 16px;
  z-index: 30;
  width: min(390px, calc(100vw - 24px));
  padding: 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  background: var(--surface-solid);
  box-shadow: 0 18px 45px rgba(0, 0, 0, 0.4);
}

.panelHeader { display: flex; justify-content: space-between; gap: 12px; padding-bottom: 10px; border-bottom: 1px solid rgba(255, 255, 255, 0.08); }
.panelHeader a, .movementNotice { color: white; text-decoration: none; }
.panelHeader a { color: #93c5fd; font-size: 12px; font-weight: 800; }
.panelEmpty { margin: 14px 0 2px; opacity: 0.7; font-size: 13px; }
.movementNotice { display: grid; grid-template-columns: 30px 1fr auto; gap: 9px; align-items: center; padding: 11px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.06); }
.noticeIcon { display: grid; width: 28px; height: 28px; place-items: center; border-radius: 9px; font-weight: 900; }
.noticeIcon.income, .noticeAmount.income { color: #4ade80; }
.noticeIcon.expense, .noticeAmount.expense { color: #fb7185; }
.noticeIcon.income { background: rgba(74, 222, 128, 0.12); }
.noticeIcon.expense { background: rgba(251, 113, 133, 0.12); }
.noticeBody { min-width: 0; }
.noticeBody strong, .noticeBody small { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.noticeBody small { margin-top: 3px; opacity: 0.65; font-size: 11px; }
.noticeAmount { font-size: 12px; white-space: nowrap; }
.drawer, .drawerBackdrop { display: none; }

@media (max-width: 720px) {
  .menuBtn { display: block; }
  .profileText { display: none; }

  .drawerBackdrop {
    position: fixed;
    inset: 0;
    z-index: 40;
    display: block;
    border: 0;
    background: rgba(2, 6, 23, 0.7);
    backdrop-filter: blur(22px) saturate(80%);
    -webkit-backdrop-filter: blur(22px) saturate(80%);
  }

  .drawer {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 50;
    display: block;
    width: min(290px, 84vw);
    padding: 20px 14px;
    transform: translateX(-100%);
    transition: transform 0.22s ease;
    background: rgba(15, 26, 50, 0.98);
    color: #f8fbff;
    opacity: 1;
    isolation: isolate;
    box-shadow: 14px 0 35px rgba(0, 0, 0, 0.35);
  }

  .drawer.open { transform: translateX(0); }
  .drawerHeader { display: flex; justify-content: space-between; align-items: center; padding: 4px 8px 18px; font-size: 18px; }
  .drawerHeader button { border: 0; background: transparent; color: white; font-size: 22px; cursor: pointer; }
  .drawerLinks { display: grid; gap: 10px; padding: 4px; }
  .drawerLink { display: flex; align-items: center; gap: 12px; min-height: 48px; box-sizing: border-box; padding: 12px 14px; border: 1px solid rgba(103, 232, 249, 0.16); border-radius: 14px; background: #17264a; color: #f8fbff; text-decoration: none; font-weight: 800; opacity: 1; box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05); transition: background 0.18s ease, border-color 0.18s ease, transform 0.18s ease; }
  .drawerLink:hover, .drawerLink.router-link-active { border-color: rgba(103, 232, 249, 0.42); background: linear-gradient(135deg, #203663, #263d70); color: #cffafe; transform: translateX(2px); }
  .drawerIcon { display: grid; width: 28px; height: 28px; place-items: center; border-radius: 9px; background: rgba(34, 211, 238, 0.14); color: #67e8f9; }
}

:global(body.drawer-open .appRoot > .appBody),
:global(body.drawer-open .appRoot > footer) {
  filter: blur(12px);
  transition: filter 0.18s ease;
}

@media (max-width: 720px) {
  .notificationPanel { right: 10px; }
}
</style>
