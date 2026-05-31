<template>
  <div class="page">
    <header class="header">
     <div>
  <h1 class="title">Welcome, Yordy Olivares 👋</h1>
  <p class="subtitle">Bienvenido de nuevo a tu panel financiero</p>
</div>

      <nav class="nav">
        <NuxtLink class="navLink" to="/movimientos">Movimientos</NuxtLink>
        <NuxtLink class="navLink" to="/cuentas">Cuentas</NuxtLink>
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
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMvpUserId } from '~/composables/useMvpUserId'

import BalanceLineChart from '~/components/charts/BalanceLineChart.vue'
import IncomeExpenseChart from '~/components/charts/IncomeExpenseChart.vue'
import CategoryDonutChart from '~/components/charts/CategoryDonutChart.vue'

import TransactionForm from '~/components/TransactionForm.vue'

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

const userId = useMvpUserId()
const userIdSafe = computed(() => String(userId || '').trim())
const userIdResolved = computed(() => userIdSafe.value)

const accounts = ref<Account[]>([])
const transactions = ref<Transaction[]>([])
const loading = ref(false)

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
    const [accRes, txRes] = await Promise.all([
      $fetch(`/api/accounts`, { params: { userId: userIdResolved.value } }),
      $fetch(`/api/transactions`, { params: { userId: userIdResolved.value } }),
    ])

    accounts.value = accRes as Account[]
    transactions.value = txRes as any as Transaction[]
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
  background: linear-gradient(90deg, #22d3ee, #6366f1);
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
  background: #0f172a;
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
  background: #111827;
  border: 1px solid #1f2937;
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
  color: #60a5fa;
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