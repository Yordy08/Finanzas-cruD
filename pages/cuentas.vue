<template>
  <div class="container">
    <TopBar />

    <h1 class="title">Cuentas</h1>

    <section class="card">
      <h2 class="sectionTitle">Crear cuenta</h2>

      <form class="form" @submit.prevent="onCreate">
        <label class="label">
          Nombre
          <input v-model="name" class="input" placeholder="Ej: Nequi" />
        </label>

        <label class="label">
          Saldo inicial (opcional)
          <input v-model.number="initialBalance" class="input" type="number" min="0" step="0.01" />
        </label>

        <button class="btn" :disabled="loading || !name.trim()" type="submit">
          {{ loading ? 'Creando...' : 'Crear' }}
        </button>
      </form>

      <p v-if="error" class="error">{{ error }}</p>
    </section>

    <section class="card">
      <h2 class="sectionTitle">Tus cuentas</h2>

      <div class="table">
        <div class="thead">
          <div>Cuenta</div>
          <div>Saldo</div>
        </div>

        <div v-for="a in accounts" :key="a.id" class="row">
          <div class="cell">{{ a.name }}</div>
          <div class="cell right">{{ formatMoney(a.balance) }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import TopBar from '~/components/TopBar.vue'
import { useMvpUserId } from '~/composables/useMvpUserId'


type Account = {
  id: string
  name: string
  balance: number
}

const userId = useMvpUserId()
const userIdSafe = String(userId || '').trim()

const accounts = ref<Account[]>([])

const name = ref('')
const initialBalance = ref(0)

const loading = ref(false)
const error = ref<string | null>(null)

const formatMoney = (n: number) => {
  try {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(n)
  } catch {
    return String(n)
  }
}

const refresh = async () => {
  if (!userIdSafe) {
    accounts.value = []
    return
  }

  const res = await $fetch(`/api/accounts`, { params: { userId: userIdSafe } })
  accounts.value = res as Account[]
}


const onCreate = async () => {
  error.value = null
  if (!name.value.trim()) return
  if (!userIdSafe) return

  loading.value = true
  try {
    await fetch('/api/accounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: userIdSafe,
        name: name.value,
        balance: initialBalance.value,
      }),
    })

    name.value = ''
    initialBalance.value = 0
    await refresh()
  } catch (e: any) {
    error.value = e?.data?.statusMessage || e?.message || 'Error creando cuenta'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  refresh()
})
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

.form {
  display: grid;
  gap: 12px;
}

.label {
  display: grid;
  gap: 6px;
  font-weight: 700;
  font-size: 13px;
}

.input {
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 12px;
  padding: 10px;
  color: white;
  outline: none;
}

.btn {
  background: #2563eb;
  border: none;
  color: white;
  font-weight: 900;
  border-radius: 12px;
  padding: 10px 14px;
}

.btn:disabled {
  opacity: 0.5;
}

.error {
  color: #fb7185;
  font-weight: 800;
  margin: 10px 0 0;
}

.table {
  display: grid;
  gap: 10px;
}

.thead {
  display: grid;
  grid-template-columns: 1fr 160px;
  font-weight: 900;
  opacity: 0.8;
}

.row {
  display: grid;
  grid-template-columns: 1fr 160px;
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
</style>

