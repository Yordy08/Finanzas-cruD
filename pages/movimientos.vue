<template>
  <div class="container">
    <TopBar />

    <h1 class="title">Movimientos</h1>

    <section class="card">
      <h2 class="sectionTitle">Registrar</h2>
      <TransactionForm @created="refresh" :accounts="accounts || []" :categories="categories" />
    </section>

    <section class="card">
      <h2 class="sectionTitle">Historial</h2>

      <div v-if="loading" class="muted loadingState"><LottieAnimation path="/lottie/loading.json" :size="56" /> <span>Cargando...</span></div>

     <div class="tableWrapper">
  <div class="table">
    <div class="thead">
      <div>Fecha</div>
      <div>Tipo</div>
      <div>Categoría</div>
       <div>Descripción</div>
        <div>Usuario</div>
       <div class="right">Monto</div>
    </div>

    <div v-for="t in transactions" :key="t.id" class="row">
      <div class="cell">{{ formatDate(t.date) }}</div>
      <div class="cell">{{ t.type === 'income' ? 'Ingreso' : 'Gasto' }}</div>
      <div class="cell">{{ t.category }}</div>
       <div class="cell description">{{ t.description }}</div>
       <div class="cell">{{ t.recordedBy?.name || t.recordedBy?.email || 'Sin asignar' }}</div>
       <div class="cell right" :class="t.type === 'income' ? 'pos' : 'neg'">
         {{ formatMoney(t.amount) }}
       </div>
       <div class="cell actions"><button class="action" @click="editTransaction(t)">Editar</button><button class="action danger" @click="deleteTransaction(t.id)">Eliminar</button></div>
    </div>
  </div>
</div>
    </section>
  </div>
</template>

<script setup lang="ts">
import Swal from 'sweetalert2'
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
  description?: string | null
  recordedBy?: {
    name?: string | null
    email?: string | null
  } | null
}

const userId = useMvpUserId()
const userIdSafe = String(userId || '').trim()

const accounts = ref<Account[] | undefined>([])
const transactions = ref<Transaction[]>([])
const categories = ref<string[]>([])
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
    const [accRes, txRes, categoryRes] = await Promise.all([
      $fetch(`/api/accounts`, { params: { userId: userIdSafe } }),
      $fetch(`/api/transactions`, { params: { userId: userIdSafe } }),
      $fetch(`/api/transactions/categories`, { params: { userId: userIdSafe } }),
    ])

    accounts.value = accRes as Account[]
    transactions.value = txRes as Transaction[]
    categories.value = categoryRes as string[]
  } finally {
    loading.value = false
  }
}

const escapeAttribute = (value: string) => value
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')

const editTransaction = async (transaction: any) => {
  const categoryOptions = categories.value
    .map((category) => `<option value="${escapeAttribute(category)}"></option>`)
    .join('')
  const result = await Swal.fire({
    title: 'Editar movimiento',
    html: `<input id="swal-category" class="swal2-input" list="saved-categories" placeholder="Categoría"><datalist id="saved-categories">${categoryOptions}</datalist><input id="swal-amount" class="swal2-input" type="number" min="0.01" step="0.01" placeholder="Monto">`,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Guardar',
    cancelButtonText: 'Cancelar',
    didOpen: () => {
      const category = document.querySelector<HTMLInputElement>('#swal-category')
      const amount = document.querySelector<HTMLInputElement>('#swal-amount')
      if (category) category.value = transaction.category
      if (amount) amount.value = String(transaction.amount)
    },
    preConfirm: () => {
      const category = document.querySelector<HTMLInputElement>('#swal-category')?.value.trim()
      const amount = Number(document.querySelector<HTMLInputElement>('#swal-amount')?.value)
      if (!category) { Swal.showValidationMessage('Escribe una categoría'); return }
      if (!Number.isFinite(amount) || amount <= 0) { Swal.showValidationMessage('Escribe un monto válido'); return }
      return { category, amount }
    },
  })
  if (!result.isConfirmed) return
  try {
    await $fetch(`/api/transactions/${transaction.id}`, { method: 'PUT', body: { category: result.value.category, amount: result.value.amount, description: transaction.description || null } })
    await refresh()
    await Swal.fire({ title: 'Movimiento actualizado', icon: 'success', timer: 1500, showConfirmButton: false })
  } catch (e: any) {
    await Swal.fire({ title: 'No se pudo editar', text: e?.data?.statusMessage || 'Intenta nuevamente.', icon: 'error' })
  }
}

const deleteTransaction = async (id: string) => {
  const result = await Swal.fire({ title: '¿Eliminar este movimiento?', text: 'El saldo se corregirá automáticamente. Esta acción no se puede deshacer.', icon: 'warning', showCancelButton: true, confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar', confirmButtonColor: '#be185d', reverseButtons: true })
  if (!result.isConfirmed) return
  try {
    await $fetch(`/api/transactions/${id}`, { method: 'DELETE' })
    await refresh()
    await Swal.fire({ title: 'Movimiento eliminado', icon: 'success', timer: 1500, showConfirmButton: false })
  } catch (e: any) {
    await Swal.fire({ title: 'No se pudo eliminar', text: e?.data?.statusMessage || 'Intenta nuevamente.', icon: 'error' })
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
.tableWrapper {
  width: 100%;
  overflow-x: auto;
}

.table {
  min-width: 1100px;
}

.thead,
.row {
  display: grid;
  grid-template-columns:
    120px   /* Fecha */
    110px   /* Tipo */
    180px   /* Categoría */
    minmax(250px, 1fr) /* Descripción */
    150px   /* Usuario */
    150px   /* Monto */
    180px;  /* Acciones */

  gap: 16px;
  align-items: center;
}

.thead {
  padding: 12px;
  font-weight: 800;
  color: rgba(255,255,255,.7);
  border-bottom: 1px solid rgba(255,255,255,.08);
}

.row {
  padding: 14px 12px;
  border-radius: 12px;
  margin-top: 8px;
  background: rgba(255,255,255,.03);
  transition: .2s;
}

.row:hover {
  background: rgba(255,255,255,.06);
}

.cell {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.description {
  white-space: normal;
  word-break: break-word;
}

.right {
  text-align: right;
}

.pos {
  color: #34d399;
  font-weight: 700;
}

.neg {
  color: #fb7185;
  font-weight: 700;
}
.loadingState { display: flex; align-items: center; justify-content: center; gap: 8px; min-height: 80px; }
.actions { display:flex; gap:6px; white-space:normal; }
.action { border:0; border-radius:8px; padding:6px 8px; background:#24345c; color:#fff; font-weight:700; cursor:pointer; }
.danger { background:#7f1d1d; }
.thead {
  display: grid;
  grid-template-columns: 120px 110px 180px minmax(180px, 1fr) 150px 150px 180px;
  font-weight: 900;
  opacity: 0.8;
}
.row {
  display: grid;
  grid-template-columns: 120px 110px 180px minmax(180px, 1fr) 150px 150px 180px;
  align-items: center;
  padding: 14px 12px;
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


