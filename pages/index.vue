<template>
  <div class="page">
    <header class="header">
     <div>
    <h1 class="title">Finanzas de {{ memberNames || 'los dos usuarios' }}</h1>
    <p class="subtitle">Resumen conjunto de ingresos, gastos, metas y pagos de los dos usuarios</p>
</div>

      <nav class="nav">
        <NuxtLink class="navLink" to="/movimientos">Movimientos</NuxtLink>
        <NuxtLink class="navLink" to="/cuentas">Cuentas</NuxtLink>
        <NuxtLink class="navLink" to="/metas">Metas</NuxtLink>
        <NuxtLink class="navLink" to="/pagos">Pagos</NuxtLink>
      </nav>
    </header>

    <!-- Fila 1: KPIs -->
    <section class="kpiGrid">
      <div class="kpi card">
        <div class="cardLabel">Saldo actual</div>
        <div class="cardValue kpiGreen">{{ formatMoney(moneyToday) }}</div>
      </div>

      <div class="kpi card">
        <div class="cardLabel">Ingresos del mes</div>
        <div class="cardValue kpiGreenLight">{{ formatMoney(monthIncome) }}</div>
      </div>

      <div class="kpi card">
        <div class="cardLabel">Gastos del mes</div>
        <div class="cardValue kpiRed">{{ formatMoney(monthExpense) }}</div>
      </div>

      <div class="kpi card">
        <div class="cardLabel">Ahorro del mes</div>
        <div class="cardValue kpiBlue">{{ formatMoney(monthSavings) }}</div>
      </div>

      <div v-if="monthIncome > 0" class="kpiHint card">
        <div class="hintLine">
          Gastos representan <b>{{ expensePercent }}%</b> de los ingresos del mes.
        </div>
      </div>
    </section>

    <!-- Fila 2 -->
    <section class="rowCharts">
      <div class="card chartCard">
        <BalanceLineChart :transactions="transactions" />
      </div>

      <div class="chartCol">
        <div class="card chartCard">
          <CategoryDonutChart :transactions="transactions" />
        </div>
        <div class="card chartCard">
          <IncomeExpenseChart :transactions="transactions" />
        </div>
      </div>
    </section>

    <!-- Fila 3 -->
    <section class="rowBottom">
      <div class="card">
        <div class="cardHeader">
          <h2 class="sectionTitle">Últimos movimientos</h2>
          <div class="muted">{{ lastMovements.length }}/5</div>
        </div>

        <div v-if="loading" class="muted">Cargando...</div>

        <div v-else class="table">
          <div class="thead">
            <div>Tipo</div>
            <div>Categoría</div>
            <div class="right">Monto</div>
            <div class="right">Fecha</div>
          </div>

          <div v-for="t in lastMovements" :key="t.id" class="row">
            <div class="cell">
              <span :class="t.type === 'income' ? 'pos' : 'neg'">
                {{ t.type === 'income' ? 'Ingreso' : 'Gasto' }}
              </span>
            </div>
            <div class="cell">{{ t.category }}</div>
            <div class="cell right" :class="t.type === 'income' ? 'pos' : 'neg'">
              {{ formatMoney(t.amount) }}
            </div>
            <div class="cell right">{{ formatDate(t.date) }}</div>
          </div>
        </div>
      </div>

      
    </section>

    <section class="paymentCalendar card">
      <div class="calendarHeader">
        <div>
          <h2 class="sectionTitle">Calendario de pagos</h2>
          <p class="calendarSubtitle">Consulta los vencimientos de las finanzas compartidas.</p>
        </div>
        <div class="calendarControls">
          <button type="button" aria-label="Mes anterior" @click="changeCalendarMonth(-1)">&lsaquo;</button>
          <strong>{{ calendarMonthLabel }}</strong>
          <button type="button" aria-label="Mes siguiente" @click="changeCalendarMonth(1)">&rsaquo;</button>
        </div>
      </div>

      <div class="calendarWeekdays" aria-hidden="true">
        <span v-for="weekday in weekdays" :key="weekday">{{ weekday }}</span>
      </div>
      <div class="calendarGrid">
        <span v-for="emptyDay in calendarLeadingDays" :key="`empty-${emptyDay}`" class="calendarDay emptyDay" />
        <div
          v-for="day in calendarDays"
          :key="day.key"
          class="calendarDay"
          :class="{ today: day.isToday, hasPayments: day.payments.length }"
        >
          <span class="dayNumber">{{ day.day }}</span>
          <span v-if="day.payments.length" class="paymentDot" :class="day.payments[0].state" />
          <small v-if="day.payments.length > 1">{{ day.payments.length }} pagos</small>
          <small v-else-if="day.payments.length">{{ day.payments[0].title }}</small>
        </div>
      </div>

      <div v-if="upcomingPayments.length" class="upcomingPayments">
        <div class="upcomingHeading">
          <strong>Próximos vencimientos</strong>
          <NuxtLink to="/pagos">Ver pagos</NuxtLink>
        </div>
        <div v-for="payment in upcomingPayments" :key="payment.id" class="upcomingPayment">
          <span class="upcomingStatus" :class="payment.state" />
          <span class="upcomingInfo">
            <strong>{{ payment.title }}</strong>
            <small>{{ formatDate(payment.dueAt) }} · {{ payment.category }}</small>
          </span>
          <strong v-if="payment.amount" class="upcomingAmount">{{ formatMoney(payment.amount) }}</strong>
        </div>
      </div>
      <p v-else class="calendarEmpty">No hay pagos registrados.</p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMvpUserId } from '~/composables/useMvpUserId'

import BalanceLineChart from '~/components/charts/BalanceLineChart.vue'
import IncomeExpenseChart from '~/components/charts/IncomeExpenseChart.vue'
import CategoryDonutChart from '~/components/charts/CategoryDonutChart.vue'


type Account = {
  id: string
  name: string
  balance: number
}

type Transaction = {
  id: string
  type: 'income' | 'expense'
  amount: number
  date: string
  category: string
}

type Payment = {
  id: string
  title: string
  category: string
  amount?: number | null
  dueAt: string
  state: string
  status: string
}

const userId = useMvpUserId()
const userIdSafe = computed(() => String(userId || '').trim())
const userIdResolved = computed(() => userIdSafe.value)

const accounts = ref<Account[]>([])
const transactions = ref<Transaction[]>([])
const payments = ref<Payment[]>([])
const loading = ref(false)
const memberNames = ref('')
const calendarCursor = ref(new Date(new Date().getFullYear(), new Date().getMonth(), 1))
const weekdays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

const formatMoney = (n: number) => {
  try {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(n)
  } catch {
    return String(n)
  }
}

const formatDate = (d: string) => {
  try {
    return new Date(d).toLocaleDateString('es-CO')
  } catch {
    return d
  }
}

const dateKey = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`

const calendarMonthLabel = computed(() => calendarCursor.value.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' }))
const calendarLeadingDays = computed(() => (calendarCursor.value.getDay() + 6) % 7)
const calendarDays = computed(() => {
  const year = calendarCursor.value.getFullYear()
  const month = calendarCursor.value.getMonth()
  const totalDays = new Date(year, month + 1, 0).getDate()
  const todayKey = dateKey(new Date())

  return Array.from({ length: totalDays }, (_, index) => {
    const date = new Date(year, month, index + 1)
    const key = dateKey(date)
    return {
      day: index + 1,
      key,
      isToday: key === todayKey,
      payments: payments.value.filter((payment) => dateKey(new Date(payment.dueAt)) === key),
    }
  })
})

const upcomingPayments = computed(() => payments.value
  .filter((payment) => payment.status === 'pending')
  .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())
  .slice(0, 5))

const changeCalendarMonth = (offset: number) => {
  calendarCursor.value = new Date(calendarCursor.value.getFullYear(), calendarCursor.value.getMonth() + offset, 1)
}

const moneyToday = computed(() => {
  return accounts.value.reduce((acc, a) => acc + (a.balance ?? 0), 0)
})

const monthIncome = computed(() => {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()

  return transactions.value
    .filter((t) => {
      const d = new Date(t.date)
      return d.getFullYear() === y && d.getMonth() === m && t.type === 'income'
    })
    .reduce((acc, t) => acc + t.amount, 0)
})

const monthExpense = computed(() => {
  const now = new Date()
  const y = now.getFullYear()
  const m = now.getMonth()

  return transactions.value
    .filter((t) => {
      const d = new Date(t.date)
      return d.getFullYear() === y && d.getMonth() === m && t.type === 'expense'
    })
    .reduce((acc, t) => acc + t.amount, 0)
})

const monthSavings = computed(() => {
  return monthIncome.value - monthExpense.value
})

const expensePercent = computed(() => {
  if (!monthIncome.value) return 0
  return Math.round((monthExpense.value / monthIncome.value) * 100)
})

const lastMovements = computed(() => {
  // más reciente primero (por date)
  const sorted = [...transactions.value].sort((a, b) => {
    const da = new Date(a.date).getTime()
    const db = new Date(b.date).getTime()
    return db - da
  })

  return sorted.slice(0, 5)
})

const refreshAll = async () => {
  if (!userIdResolved.value) {
    throw new Error('Falta configurar MVP_USER_ID (ObjectId) en runtimeConfig.public.MVP_USER_ID')
  }

  loading.value = true
  try {
    const [accRes, txRes, usersRes, paymentsRes] = await Promise.all([
      $fetch(`/api/accounts`, { params: { userId: userIdResolved.value } }),
      $fetch(`/api/transactions`, { params: { userId: userIdResolved.value } }),
      $fetch(`/api/users`, { params: { userId: userIdResolved.value } }),
      $fetch(`/api/payments`, { params: { userId: userIdResolved.value } }),
    ])

    const users = usersRes as Array<{ name?: string | null; email: string }>
    memberNames.value = users.map((member) => member.name || member.email).join(' y ')
    accounts.value = accRes as Account[]
    transactions.value = txRes as any as Transaction[]
    payments.value = paymentsRes as Payment[]
  } finally {
    loading.value = false
  }
}

// Evita ejecutar requests en SSR si falta el usuario del MVP.
if (process.client) {
  await refreshAll()
}
</script>

<style scoped>
.page {
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px;
  color: #fff;
}
.title {
  margin: 0;
  font-size: 36px;
  font-weight: 900;
    background: linear-gradient(90deg, #22d3ee, #8b5cf6 55%, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* HEADER */

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;
}

.title {
  margin: 0;
  font-size: 32px;
  font-weight: 800;
}

.subtitle {
  margin-top: 4px;
  opacity: 0.75;
  font-size: 14px;
}

.nav {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.navLink {
  padding: 10px 14px;
  border-radius: 12px;
  background: rgba(16, 26, 51, 0.9);
  color: white;
  text-decoration: none;
  font-weight: 600;
  transition: all .25s ease;
}

.navLink:hover {
  background: #1e293b;
  transform: translateY(-2px);
}

/* CARDS */

.card {
  background: rgba(20, 30, 58, 0.88);
  border: 1px solid rgba(139, 92, 246, 0.22);
  border-radius: 18px;
  padding: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,.25);
  height: 100%;
}

.cardHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.sectionTitle {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
}

.cardLabel {
  font-size: 14px;
  opacity: .75;
  font-weight: 600;
  margin-bottom: 6px;
}

.cardValue {
  font-size: 32px;
  font-weight: 900;
  line-height: 1.1;
}

/* KPI */

.kpiGrid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.kpiHint {
  grid-column: 1 / -1;
}

.hintLine {
  font-size: 14px;
  font-weight: 600;
}

.kpiGreen {
  color: #34d399;
}

.kpiGreenLight {
  color: #86efac;
}

.kpiRed {
  color: #fb7185;
}

.kpiBlue {
  color: #67e8f9;
}

/* CHARTS */

.rowCharts {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
  margin-bottom: 20px;
}

.chartCol {
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 16px;
}

.chartCard {
  min-height: 350px;
}

/* BOTTOM SECTION */

.rowBottom {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* TABLE */

.table {
  display: grid;
  gap: 10px;
}

.thead {
  display: grid;
  grid-template-columns: 1fr 1fr 140px 160px;
  gap: 12px;
  padding: 6px;
  font-weight: 800;
  opacity: .8;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr 140px 160px;
  gap: 12px;
  align-items: center;
  padding: 12px;
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.05);
  border-radius: 14px;
}

.cell {
  font-weight: 600;
  color: rgba(255,255,255,.92);
}

.right {
  text-align: right;
}

.pos {
  color: #34d399;
}

.neg {
  color: #fb7185;
}

.muted {
  opacity: .7;
}

/* SCROLL HORIZONTAL SI LA TABLA ES GRANDE */

.tableWrapper {
  overflow-x: auto;
}

/* PAYMENT CALENDAR */

.paymentCalendar {
  margin-top: 20px;
}

.calendarHeader,
.upcomingHeading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.calendarSubtitle {
  margin: 5px 0 0;
  color: var(--text-soft);
  font-size: 13px;
}

.calendarControls {
  display: flex;
  align-items: center;
  gap: 12px;
  color: #cffafe;
  text-transform: capitalize;
}

.calendarControls button {
  width: 32px;
  height: 32px;
  border: 1px solid rgba(103, 232, 249, 0.2);
  border-radius: 10px;
  background: #17264a;
  color: #cffafe;
  cursor: pointer;
  font-size: 24px;
  line-height: 1;
}

.calendarControls button:hover {
  background: #203663;
}

.calendarWeekdays,
.calendarGrid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 8px;
}

.calendarWeekdays {
  margin-top: 20px;
  color: var(--text-soft);
  font-size: 11px;
  font-weight: 800;
  text-align: center;
  text-transform: uppercase;
}

.calendarGrid {
  margin-top: 8px;
}

.calendarDay {
  position: relative;
  display: flex;
  min-height: 66px;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  overflow: hidden;
  padding: 9px;
  border: 1px solid rgba(139, 92, 246, 0.18);
  border-radius: 12px;
  background: rgba(16, 26, 51, 0.72);
}

.calendarDay.today {
  border-color: #22d3ee;
  box-shadow: 0 0 0 1px rgba(34, 211, 238, 0.2);
}

.calendarDay.hasPayments {
  background: rgba(34, 211, 238, 0.09);
}

.emptyDay {
  border-color: transparent;
  background: transparent;
}

.dayNumber {
  color: #f8fbff;
  font-size: 13px;
  font-weight: 900;
}

.calendarDay small {
  width: 100%;
  overflow: hidden;
  color: var(--text-soft);
  font-size: 10px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.paymentDot,
.upcomingStatus {
  display: inline-block;
  flex: 0 0 auto;
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: #22d3ee;
}

.paymentDot.today,
.paymentDot.overdue,
.upcomingStatus.today,
.upcomingStatus.overdue { background: #fb7185; }
.paymentDot.paid,
.upcomingStatus.paid { background: #4ade80; }
.paymentDot.soon,
.upcomingStatus.soon { background: #facc15; }

.upcomingPayments {
  display: grid;
  gap: 8px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.upcomingHeading a {
  color: #67e8f9;
  font-size: 12px;
  font-weight: 800;
  text-decoration: none;
}

.upcomingPayment {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.04);
}

.upcomingInfo {
  display: grid;
  min-width: 0;
  flex: 1;
  gap: 2px;
}

.upcomingInfo strong,
.upcomingInfo small {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.upcomingInfo small {
  color: var(--text-soft);
  font-size: 11px;
}

.upcomingAmount {
  color: #cffafe;
  font-size: 12px;
  white-space: nowrap;
}

.calendarEmpty {
  margin: 20px 0 0;
  color: var(--text-soft);
  font-size: 13px;
}

/* TABLET */

@media (max-width: 1200px) {

  .kpiGrid {
    grid-template-columns: repeat(2, 1fr);
  }

  .rowCharts {
    grid-template-columns: 1fr;
  }

  .chartCol {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
  }

  .rowBottom {
    grid-template-columns: 1fr;
  }
}

/* MOBILE */

@media (max-width: 768px) {

  .page {
    padding: 14px;
  }

  .header {
    flex-direction: column;
  }

  .nav {
    display: none;
  }

  .nav {
    width: 100%;
  }

  .navLink {
    flex: 1;
    text-align: center;
  }

  .title {
    font-size: 24px;
  }

  .kpiGrid {
    grid-template-columns: 1fr;
  }

  .chartCol {
    grid-template-columns: 1fr;
  }

  .thead {
    display: none;
  }

  .row {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .right {
    text-align: left;
  }

  .cardValue {
    font-size: 28px;
  }

  .calendarHeader {
    align-items: flex-start;
    flex-direction: column;
  }

  .calendarDay {
    min-height: 54px;
    padding: 7px;
  }

  .calendarDay small {
    display: none;
  }
}

/* CELULARES PEQUEÑOS */

@media (max-width: 480px) {

  .page {
    padding: 10px;
  }

  .card {
    padding: 12px;
    border-radius: 14px;
  }

  .title {
    font-size: 20px;
  }

  .subtitle {
    font-size: 12px;
  }

  .cardValue {
    font-size: 24px;
  }

  .nav {
    flex-direction: column;
  }

  .navLink {
    width: 100%;
  }
}
</style>
