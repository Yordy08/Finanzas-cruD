<template>
  <v-navigation-drawer
    v-model="drawer"
    :rail="isRail"
    permanent
    location="start"
    class="appSidebarDrawer"
    :width="expandedWidth"
    :style="railStyle"
    :mobile-breakpoint="0"
  >
    <template #prepend>
      <div class="sidebarTop">
        <v-btn
          v-if="!isRail"
          class="sidebarToggle"
          variant="text"
          icon="mdi-chevron-left"
          aria-label="Colapsar sidebar"
          @click="toggleRail"
        />

        <v-btn
          v-else
          class="sidebarToggle"
          variant="text"
          icon="mdi-chevron-right"
          aria-label="Expandir sidebar"
          @click="toggleRail"
        />

        <div class="userBlock" aria-hidden="true">
          <div class="userAvatar" />
          <div class="userMeta" v-show="!isRail">
            <div class="userName">Usuario</div>
            <div class="userRole">Finanzas</div>
          </div>
        </div>
      </div>
    </template>

    <v-list density="compact" nav class="navList">
      <v-list-item
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        :active="isActive(item.to)"
        class="navItem"
        color="primary"
        rounded
      >
        <template #prepend>
          <component :is="item.icon" class="navIcon" />
        </template>

        <v-list-item-title v-show="!isRail">{{ item.label }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import IconDashboard from '~/components/icons/IconDashboard.vue'
import IconMovimientos from '~/components/icons/IconMovimientos.vue'
import IconCuentas from '~/components/icons/IconCuentas.vue'
import IconReportes from '~/components/icons/IconReportes.vue'
import IconConfiguracion from '~/components/icons/IconConfiguracion.vue'


const route = useRoute()

const expandedWidth = 260
const collapsedWidth = 88

const drawer = ref(true)
const isRail = ref(false)

const mql = ref<MediaQueryList | null>(null)
const syncMedia = () => {
  const isMobile = !!mql.value?.matches

  if (isMobile) {
    // En móvil, esta versión está pensada como permanente en desktop.
    // El drawer móvil se maneja desde layouts.
    isRail.value = false
    drawer.value = false
  } else {
    drawer.value = true
    // Reset a rail en escritorio solo para mantener UX coherente.
    isRail.value = false
  }
}

onMounted(() => {
  mql.value = window.matchMedia('(max-width: 768px)')
  syncMedia()
  mql.value?.addEventListener('change', syncMedia)

  window.addEventListener('finanzas:toggle-sidebar-rail', toggleRail)
})

onBeforeUnmount(() => {
  mql.value?.removeEventListener('change', syncMedia)
  window.removeEventListener('finanzas:toggle-sidebar-rail', toggleRail)
})

const toggleRail = () => {
  const isMobile = !!mql.value?.matches
  if (isMobile) return
  isRail.value = !isRail.value
}

const items = computed(() => [
  { to: '/', label: 'Dashboard', icon: IconDashboard },
  { to: '/movimientos', label: 'Movimientos', icon: IconMovimientos },
  { to: '/cuentas', label: 'Cuentas', icon: IconCuentas },
  { to: '/reportes', label: 'Reportes', icon: IconReportes },
  { to: '/configuracion', label: 'Configuración', icon: IconConfiguracion }
])

const isActive = (to: string) => {
  if (to === '/') return route.path === '/'
  return route.path === to
}

const railStyle = computed(() => {
  return isRail.value
    ? { width: `${collapsedWidth}px`, minWidth: `${collapsedWidth}px` }
    : { width: `${expandedWidth}px`, minWidth: `${expandedWidth}px` }
})
</script>

<style scoped>
.appSidebarDrawer {
  background: rgba(5, 10, 22, 0.72) !important;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: none;
}

.sidebarTop {
  padding: 14px 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebarToggle {
  align-self: center;
  width: 40px;
  height: 40px;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.9);
}

.userBlock {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(255, 255, 255, 0.03);
}

.userAvatar {
  width: 34px;
  height: 34px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.8), rgba(99, 102, 241, 0.8));
}

.userName {
  font-weight: 900;
  font-size: 13px;
}

.userRole {
  font-weight: 700;
  font-size: 12px;
  opacity: 0.75;
}

.navList {
  padding-top: 0;
}

.navItem {
  margin: 4px 8px;
}

.navIcon {
  width: 24px;
  height: 24px;
}
</style>

