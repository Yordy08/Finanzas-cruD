<template>
  <div class="container">
    <TopBar />
    <div class="heading">
      <div>
        <p class="eyebrow">Centro de actividad</p>
        <h1>Notificaciones</h1>
        <p class="subtitle">Aquí puedes entender qué ocurrió en cada aviso de tu actividad financiera.</p>
      </div>
    </div>

    <section class="card">
      <div v-if="loading" class="state">Cargando notificaciones...</div>
      <div v-else-if="!notifications.length" class="state">No hay notificaciones nuevas.</div>
      <div v-else class="notificationList">
        <article v-for="notification in notifications" :key="notification.id" class="notificationItem">
          <div class="notificationIcon" :class="notification.type">{{ notification.type === 'income' ? '+' : '-' }}</div>
          <div class="notificationContent">
            <h2>{{ notification.type === 'income' ? 'Nuevo ingreso registrado' : 'Nuevo gasto registrado' }}</h2>
            <p>
              Se registró un {{ notification.type === 'income' ? 'ingreso' : 'gasto' }} de
              <strong>{{ formatMoney(notification.amount) }}</strong> en la categoría
              <strong>{{ notification.category }}</strong>.
            </p>
            <small>
              {{ formatDate(notification.date) }} · Usuario:
              {{ notification.recordedBy?.name || notification.recordedBy?.email || 'Sin asignar' }}
            </small>
            <small v-if="notification.description">Descripción: {{ notification.description }}</small>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import TopBar from '~/components/TopBar.vue'

type Notification = {
  id: string
  type: 'income' | 'expense'
  amount: number
  category: string
  description?: string | null
  date: string
  recordedBy?: { name?: string | null; email?: string | null } | null
}

const notifications = ref<Notification[]>([])
const loading = ref(true)

const formatMoney = (amount: number) => new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  maximumFractionDigits: 0,
}).format(amount)

const formatDate = (date: string) => new Date(date).toLocaleString('es-CO', {
  dateStyle: 'medium',
  timeStyle: 'short',
})

onMounted(async () => {
  try {
    notifications.value = await $fetch('/api/transactions', {
      params: { userId: 'authenticated', page: 1, pageSize: 20 },
    }) as Notification[]
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.container { max-width: 900px; margin: auto; color: #fff; }
.heading { margin: 12px 0 20px; }
.eyebrow { margin: 0; color: #67e8f9; font-size: 12px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
h1 { margin: 4px 0; }
.subtitle { margin: 0; color: #b7c4e3; }
.card { background: rgba(20, 30, 58, .88); border: 1px solid rgba(139, 92, 246, .22); border-radius: 18px; padding: 18px; }
.state { padding: 28px 8px; color: #b7c4e3; text-align: center; }
.notificationList { display: grid; gap: 12px; }
.notificationItem { display: grid; grid-template-columns: 42px 1fr; gap: 14px; padding: 15px; border: 1px solid rgba(255, 255, 255, .08); border-radius: 14px; background: rgba(255, 255, 255, .03); }
.notificationIcon { width: 42px; height: 42px; display: grid; place-items: center; border-radius: 13px; font-size: 24px; font-weight: 900; }
.notificationIcon.income { color: #4ade80; background: rgba(74, 222, 128, .12); }
.notificationIcon.expense { color: #fb7185; background: rgba(251, 113, 133, .12); }
.notificationContent h2 { margin: 0 0 6px; font-size: 16px; }
.notificationContent p { margin: 0 0 8px; color: #dbe5ff; line-height: 1.5; }
.notificationContent small { display: block; margin-top: 4px; color: #91a2c9; }
@media (max-width: 600px) { .container { padding: 0 12px; } }
</style>
