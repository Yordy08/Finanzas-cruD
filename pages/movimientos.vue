<template>
  <div class="container">
    <TopBar />

    <h1 class="title">Movimientos</h1>

    <section class="card">
      <h2 class="sectionTitle">Registrar</h2>
      <TransactionForm @created="refresh" :accounts="accounts || []" />
    </section>

    <section class="card">
      <h2 class="sectionTitle">Historial</h2>

      <div v-if="loading" class="muted">Cargando...</div>

      <div v-else class="table">
        <div class="thead">
          <div>Fecha</div>
          <div>Tipo</div>
          <div>Categoría</div>
          <div class="right">Monto</div>
        </div>

        <div v-for="t in transactions" :key="t.id" class="row">
          <div class="cell">{{ formatDate(t.date) }}</div>
          <div class="cell">{{ t.type === 'income' ? 'Ingreso' : 'Gasto' }}</div>
          <div class="cell">{{ t.category }}</div>
          <div class="cell right" :class="t.type === 'income' ? 'pos' : 'neg'">
            {{ formatMoney(t.amount) }}
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import TopBar from '~/components/TopBar.vue'
import TransactionForm from '~/components/TransactionForm.vue'
import { useMvpUserId } from '~/composables/useMvpUserId'

type Account = { id: string; name: string; balance: number }

type Transaction = {
  id: string
  type: 'income' | 'expense'
  amount: number
  date: string
  category: string
}

const userId = useMvpUserId()
const userIdSafe = String(userId || '').trim()

const accounts = ref<Account[] | undefined>([])
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

const refresh = async () => {
  if (!userIdSafe) {
    accounts.value = []
    transactions.value = []
    return
  }

  loading.value = true
  try {
    const [accRes, txRes] = await Promise.all([
      $fetch(`/api/accounts`, { params: { userId: userIdSafe } }),
      $fetch(`/api/transactions`, { params: { userId: userIdSafe } }),
    ])

    accounts.value = accRes as Account[]
    transactions.value = txRes as Transaction[]
  } finally {
    loading.value = false
  }
}


onMounted(refresh)
</script>

<style scoped>
.container {
  padding: 16px;
  max-width: 1000px;
  margin: 0 auto;
  color: white;
}
.title {
  margin: 12px 0;
  font-size: 22px;
}
.card {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 14px;
  margin-bottom: 14px;
}
.sectionTitle {
  margin: 0 0 12px;
  font-size: 16px;
}
.muted {
  opacity: 0.75;
}
.table {
  display: grid;
  gap: 10px;
}
.thead {
  display: grid;
  grid-template-columns: 1fr 120px 1fr 160px;
  font-weight: 900;
  opacity: 0.8;
}
.row {
  display: grid;
  grid-template-columns: 1fr 120px 1fr 160px;
  align-items: center;
  padding: 10px;
  background: rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 14px;
}
.cell {
  font-weight: 800;
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
</style>


