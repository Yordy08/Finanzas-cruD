<template>
  <div class="page">
    <header class="header">
      <div>
        <h1 class="title">Dashboard</h1>
        <p class="subtitle">Panel financiero estilo SaaS</p>
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

      <div class="card">
        <h2 class="sectionTitle">Registrar movimiento</h2>
        <TransactionForm @created="refreshAll" :accounts="accounts" />
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
  padding: 16px;
  max-width: 1100px;
  margin: 0 auto;
  color: white;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 14px;
}

.title {
  font-size: 22px;
  margin: 0;
}

.subtitle {
  margin: 4px 0 0;
  opacity: 0.75;
}

.nav {
  display: flex;
  gap: 10px;
}

.navLink {
  padding: 8px 10px;
  border-radius: 10px;
  background: #0b1220;
  color: white;
  text-decoration: none;
  font-weight: 600;
}

.navLink:hover {
  filter: brightness(1.1);
}

.card {
  background: #111827;
  border: 1px solid #1f2937;
  border-radius: 18px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, .25);
  padding: 14px;
}

.cardHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.sectionTitle {
  margin: 0;
  font-size: 16px;
}

.cardLabel {
  opacity: 0.8;
  font-weight: 700;
  font-size: 13px;
  margin-bottom: 8px;
}

.cardValue {
  font-size: 28px;
  font-weight: 900;
}

.kpiGrid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 14px;
}

.kpiHint {
  grid-column: 1 / -1;
}

.hintLine {
  opacity: 0.9;
  font-weight: 700;
  font-size: 13px;
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

.rowCharts {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 12px;
  margin-bottom: 14px;
}

.chartCol {
  display: grid;
  grid-template-rows: 1fr 1fr;
  gap: 12px;
}

.chartCard {
  padding: 12px;
}

.rowBottom {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.table {
  display: grid;
  gap: 10px;
}

.thead {
  display: grid;
  grid-template-columns: 1fr 1fr 140px 160px;
  font-weight: 900;
  opacity: 0.85;
  padding: 4px 6px;
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr 140px 160px;
  align-items: center;
  padding: 10px;
  background: rgba(0, 0, 0, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 14px;
}

.cell {
  font-weight: 800;
  color: rgba(255, 255, 255, 0.92);
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
  opacity: 0.75;
}

@media (max-width: 980px) {
  .rowCharts {
    grid-template-columns: 1fr;
  }

  .chartCol {
    grid-template-rows: unset;
    grid-template-columns: 1fr 1fr;
  }

  .rowBottom {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .kpiGrid {
    grid-template-columns: 1fr;
  }

  .chartCol {
    grid-template-columns: 1fr;
  }

  .thead,
  .row {
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }

  .thead div:nth-child(3),
  .thead div:nth-child(4),
  .row div:nth-child(3),
  .row div:nth-child(4) {
    display: none;
  }
}

@media (max-width: 600px) {
  .page {
    padding: 12px;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .nav {
    width: 100%;
  }

  .navLink {
    flex: 1;
    text-align: center;
  }

  .kpiGrid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .rowCharts {
    gap: 10px;
  }

  .chartCol {
    gap: 10px;
  }

  .rowBottom {
    gap: 10px;
  }

  .title {
    font-size: 20px;
  }

  .subtitle {
    font-size: 13px;
  }

  .card {
    padding: 12px;
    border-radius: 12px;
  }
}

@media (max-width: 480px) {
  .page {
    padding: 10px;
    max-width: none;
  }

  .title {
    font-size: 18px;
  }

  .subtitle {
    font-size: 12px;
  }

  .cardValue {
    font-size: 24px;
  }

  .card {
    padding: 10px;
  }

  .thead,
  .row {
    gap: 6px;
  }

  .sectionTitle {
    font-size: 14px;
  }
}
</style>


