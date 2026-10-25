<template>
  <div class="container">
    <TopBar />

    <header class="heading">
      <div>
        <p class="eyebrow">Control de vencimientos</p>
        <h1>Pagos Pendientes</h1>
      </div>
      <NuxtLink class="secondary" to="/pagos">Administrar pagos</NuxtLink>
    </header>

    <section class="card calendarCard">
      <div class="sectionHeader">
        <div>
          <h2>Calendario de pagos</h2>
          <p>Los puntos muestran los pagos pendientes de cada día.</p>
        </div>
        <div class="calendarControls">
          <button type="button" aria-label="Mes anterior" @click="changeMonth(-1)">&lsaquo;</button>
          <strong>{{ monthLabel }}</strong>
          <button type="button" aria-label="Mes siguiente" @click="changeMonth(1)">&rsaquo;</button>
        </div>
      </div>
      <div class="weekdays" aria-hidden="true"><span v-for="day in weekdays" :key="day">{{ day }}</span></div>
      <div class="calendarGrid">
        <span v-for="emptyDay in leadingDays" :key="`empty-${emptyDay}`" class="day emptyDay" />
        <div v-for="day in calendarDays" :key="day.key" class="day" :class="{ today: day.isToday }">
          <span class="dayNumber">{{ day.number }}</span>
          <span v-if="day.payments.length" class="dots">
            <i v-for="payment in day.payments.slice(0, 3)" :key="payment.id" class="dot" :class="payment.light" />
          </span>
          <small v-if="day.payments.length === 1">{{ day.payments[0].title }}</small>
          <small v-else-if="day.payments.length > 1">{{ day.payments.length }} pagos</small>
        </div>
      </div>
    </section>

    <section class="paymentsSection">
      <div class="sectionHeader listHeader">
        <div><h2>Pagos por prioridad</h2><p>{{ pendingPayments.length }} pago(s) pendiente(s)</p></div>
      </div>
      <div v-if="loading" class="card empty loadingState"><LottieAnimation path="/lottie/loading.json" :size="64" /><span>Cargando pagos...</span></div>
      <div v-else-if="!pendingPayments.length" class="card empty">No hay pagos pendientes.</div>
      <template v-else>
        <section v-for="group in paymentGroups" :key="group.key" class="priorityGroup">
          <div class="groupTitle"><span class="light" :class="group.key" /><h3>{{ group.label }}</h3><span>{{ group.items.length }}</span></div>
          <div class="paymentGrid">
            <article v-for="payment in group.items" :key="payment.id" class="card payment" :class="payment.light">
              <div class="paymentTop">
                <div><h3>{{ payment.title }}</h3><p>{{ payment.category }} · {{ payment.responsibleUser?.name || 'Responsable pendiente' }}</p></div>
                <strong>{{ payment.amount ? money(payment.amount) : 'Sin valor' }}</strong>
              </div>
              <div class="statusLine"><span class="light" :class="payment.light" /><strong>{{ payment.statusLabel }}</strong></div>
              <div class="paymentMeta"><span>Vence: {{ formatDate(payment.dueAt) }}</span><span>{{ payment.remainingLabel }}</span></div>
              <button class="pay" type="button" @click="markPaid(payment.id)">Marcar como pagado</button>
            </article>
          </div>
        </section>
      </template>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Swal from 'sweetalert2'
import TopBar from '~/components/TopBar.vue'
import { useMvpUserId } from '~/composables/useMvpUserId'

type RawPayment = {
  id: string
  title: string
  category: string
  amount?: number | null
  dueAt: string
  status: string
  responsibleUser?: { name?: string | null } | null
}

type PendingPayment = RawPayment & {
  light: 'green' | 'yellow' | 'red'
  statusLabel: string
  remainingLabel: string
}

const userId = useMvpUserId()
const payments = ref<RawPayment[]>([])
const loading = ref(true)
const calendarCursor = ref(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
const weekdays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const money = (amount: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amount)
const formatDate = (date: string) => new Date(date).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })
const dateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
const startOfToday = () => { const date = new Date(); date.setHours(0, 0, 0, 0); return date }

const classify = (payment: RawPayment): PendingPayment => {
  const due = new Date(payment.dueAt)
  const days = (due.getTime() - Date.now()) / 86400000
  const light = days < 0 ? 'red' : days <= 2 ? 'yellow' : 'green'
  const statusLabel = light === 'red' ? 'VENCIDO' : light === 'yellow' ? 'VENCE PRONTO' : 'A TIEMPO'
  const remainingLabel = light === 'red' ? `Vencido hace ${Math.max(1, Math.ceil(Math.abs(days)))} día(s)` : days < 1 ? 'Vence hoy' : `Faltan ${Math.ceil(days)} día(s)`
  return { ...payment, light, statusLabel, remainingLabel }
}

const pendingPayments = computed(() => payments.value.filter((payment) => payment.status === 'pending').map(classify).sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime()))
const paymentGroups = computed(() => [
  { key: 'green' as const, label: 'Verdes: a tiempo', items: pendingPayments.value.filter((payment) => payment.light === 'green') },
  { key: 'yellow' as const, label: 'Amarillos: atención', items: pendingPayments.value.filter((payment) => payment.light === 'yellow') },
  { key: 'red' as const, label: 'Rojos: vencidos', items: pendingPayments.value.filter((payment) => payment.light === 'red') },
].filter((group) => group.items.length))

const monthLabel = computed(() => calendarCursor.value.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' }))
const leadingDays = computed(() => (calendarCursor.value.getDay() + 6) % 7)
const calendarDays = computed(() => {
  const year = calendarCursor.value.getFullYear()
  const month = calendarCursor.value.getMonth()
  const totalDays = new Date(year, month + 1, 0).getDate()
  const today = dateKey(new Date())
  return Array.from({ length: totalDays }, (_, index) => {
    const date = new Date(year, month, index + 1)
    const key = dateKey(date)
    return { key, number: index + 1, isToday: key === today, payments: pendingPayments.value.filter((payment) => dateKey(new Date(payment.dueAt)) === key) }
  })
})

const changeMonth = (amount: number) => { calendarCursor.value = new Date(calendarCursor.value.getFullYear(), calendarCursor.value.getMonth() + amount, 1) }
const refresh = async () => { loading.value = true; try { payments.value = await $fetch<RawPayment[]>('/api/payments', { params: { userId } }) } finally { loading.value = false } }
const markPaid = async (id: string) => {
  const result = await Swal.fire({ title: '¿Marcar como pagado?', text: 'El pago dejará de aparecer como pendiente.', icon: 'question', showCancelButton: true, confirmButtonText: 'Sí, marcarlo', cancelButtonText: 'Cancelar', reverseButtons: true })
  if (!result.isConfirmed) return
  try {
    await $fetch(`/api/payments/${id}`, { method: 'PUT', body: { userId, status: 'paid' } })
    await refresh()
    await Swal.fire({ title: 'Pago actualizado', icon: 'success', timer: 1500, showConfirmButton: false })
  } catch (e: any) {
    await Swal.fire({ title: 'No se pudo actualizar', text: e?.data?.statusMessage || 'Intenta nuevamente.', icon: 'error' })
  }
}

onMounted(refresh)
</script>

<style scoped>
.container{max-width:1100px;margin:auto;color:#fff}.heading,.sectionHeader,.paymentTop,.paymentMeta{display:flex;justify-content:space-between;gap:18px;align-items:center}.heading{margin:10px 0 18px}.heading h1{margin:4px 0;font-size:clamp(28px,5vw,42px)}.heading p,.sectionHeader p,.payment p{margin:4px 0;color:#b7c4e3}.eyebrow{margin:0;color:#67e8f9;font-weight:800;text-transform:uppercase;letter-spacing:.08em;font-size:12px}.card{background:rgba(20,30,58,.88);border:1px solid rgba(139,92,246,.22);border-radius:18px;padding:18px}.secondary{padding:11px 14px;border-radius:10px;background:#24345c;color:#fff;text-decoration:none;font-weight:800;white-space:nowrap}.light{display:inline-block;width:12px;height:12px;border-radius:50%;flex:0 0 auto}.green{background:#22c55e;box-shadow:0 0 12px rgba(34,197,94,.5)}.yellow{background:#eab308;box-shadow:0 0 12px rgba(234,179,8,.5)}.red{background:#ef476f;box-shadow:0 0 12px rgba(239,71,111,.5)}.calendarCard{margin-bottom:24px}.calendarControls{display:flex;align-items:center;gap:12px;text-transform:capitalize}.calendarControls button{width:34px;height:34px;border:1px solid rgba(255,255,255,.12);border-radius:9px;background:#24345c;color:#fff;font-size:22px;cursor:pointer}.weekdays,.calendarGrid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:7px}.weekdays{margin:20px 0 7px;color:#91a2c9;font-size:12px;text-align:center}.day{min-height:72px;padding:8px;border:1px solid rgba(255,255,255,.07);border-radius:10px;background:rgba(16,26,51,.55);display:flex;flex-direction:column;gap:5px;overflow:hidden}.day.today{border-color:#67e8f9}.emptyDay{opacity:0;background:transparent}.dayNumber{font-weight:800}.day small{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#b7c4e3;font-size:11px}.dots{display:flex;gap:4px}.dot{width:8px;height:8px}.paymentsSection{margin-bottom:30px}.listHeader{margin-bottom:10px}.listHeader h2{margin:0}.priorityGroup{margin:18px 0}.groupTitle{display:flex;align-items:center;gap:9px;margin-bottom:9px}.groupTitle h3{margin:0;font-size:16px}.groupTitle>span:last-child{margin-left:auto;color:#b7c4e3}.paymentGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.payment{border-left:4px solid}.payment.green{border-left-color:#22c55e}.payment.yellow{border-left-color:#eab308}.payment.red{border-left-color:#ef476f}.paymentTop{align-items:flex-start}.paymentTop h3{margin:0}.paymentTop strong{white-space:nowrap}.statusLine{display:flex;align-items:center;gap:8px;margin:18px 0 10px;font-size:12px}.paymentMeta{justify-content:flex-start;flex-wrap:wrap;color:#b7c4e3;font-size:13px}.pay{margin-top:15px;padding:10px 13px;border:0;border-radius:9px;background:#14b8a6;color:#fff;font-weight:800;cursor:pointer}.empty{color:#b7c4e3}.loadingState{display:flex;align-items:center;justify-content:center;gap:8px;min-height:100px}.paymentTop p{font-size:13px}@media(max-width:700px){.heading,.sectionHeader{align-items:flex-start;flex-direction:column}.paymentGrid{grid-template-columns:1fr}.calendarControls{align-self:stretch;justify-content:space-between}.day{min-height:60px;padding:6px}.day small{display:none}}
</style>
