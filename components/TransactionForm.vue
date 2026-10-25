<template>
  <form class="form" @submit.prevent="onSubmit">
    <div class="row">
      <label class="label">
        Tipo
        <select v-model="form.type" class="input">
          <option value="income">Ingreso</option>
          <option value="expense">Gasto</option>
        </select>
      </label>

      <label class="label">
        Cuenta
        <select v-model="form.accountId" class="input">
<option v-for="a in accountsSafe" :key="a.id" :value="a.id">
            {{ a.name }} ({{ formatMoney(a.balance) }})
          </option>
        </select>
      </label>
    </div>

    <div class="row">
      <label class="label">
        Categoría
        <select v-model="form.category" class="input categorySelect" required>
          <option disabled value="">Selecciona una categoría</option>
          <option v-for="category in categoriesSafe" :key="category" :value="category">
            {{ category }}
          </option>
          <option value="__new_category__">＋ Escribir una categoría nueva</option>
        </select>
        <input
          v-if="form.category === NEW_CATEGORY"
          v-model="newCategory"
          class="input"
          placeholder="Escribe la nueva categoría"
          maxlength="80"
          required
        />
      </label>

      <label class="label">
        Fecha
        <input v-model="form.date" class="input" type="date" required />
      </label>

      <label class="label">
        Monto
        <input v-model.number="form.amount" type="number" min="0" step="0.01" class="input" />
      </label>
    </div>

    <label class="label">
      Descripción (opcional)
      <input v-model="form.description" class="input" placeholder="Ej: Mercado, Taxi, etc." />
    </label>

    <p class="shared-note">Este movimiento será visible para los dos usuarios.</p>

    <div class="actions">
<button class="btn" type="submit" :disabled="loading || accountsSafe.length === 0">
        {{ loading ? 'Guardando...' : 'Guardar' }}
      </button>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
  </form>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useMvpUserId } from '~/composables/useMvpUserId'

const props = defineProps<{
  accounts?: Array<{ id: string; name: string; balance: number }>
  categories?: string[]
}>()

const accountsSafe = computed(() => props.accounts ?? [])
const categoriesSafe = computed(() => props.categories ?? [])
const NEW_CATEGORY = '__new_category__'
const newCategory = ref('')

const emit = defineEmits<{
  (e: 'created'): void
}>()

const form = reactive({
  type: 'expense' as 'income' | 'expense',
  accountId: '' as string,
  category: '',
  amount: 0,
  description: '' as string | undefined,
  date: new Date().toISOString().slice(0, 10),
})

const loading = ref(false)
const error = ref<string | null>(null)

const formatMoney = (n: number) => {
  try {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(n)
  } catch {
    return String(n)
  }
}

if (accountsSafe.value.length > 0 && !form.accountId) {
  form.accountId = accountsSafe.value[0].id
}

watch(accountsSafe, (accounts) => {
  if (accounts.length > 0 && !accounts.some((account) => account.id === form.accountId)) form.accountId = accounts[0].id
})


const onSubmit = async () => {
  error.value = null
  if (!form.accountId) {
    error.value = 'Selecciona una cuenta'
    return
  }

  loading.value = true
  try {
    const userId = useMvpUserId()
    const category = form.category === NEW_CATEGORY ? newCategory.value.trim() : form.category.trim()

    if (!userId) {
      error.value = 'Falta configurar MVP_USER_ID (ObjectId) en runtimeConfig.public.MVP_USER_ID'
      return
    }
    if (!category || category === NEW_CATEGORY) {
      error.value = 'Selecciona una categoría o escribe una nueva'
      return
    }

    await $fetch('/api/transactions', {
      method: 'POST',
      body: {
        userId,
        accountId: form.accountId,
        type: form.type,
        amount: form.amount,
        category,
        description: form.description || undefined,
        date: new Date(`${form.date}T12:00:00`).toISOString(),
      },
    })


    emit('created')

    form.category = ''
    newCategory.value = ''
    form.amount = 0
    form.description = undefined
    form.date = new Date().toISOString().slice(0, 10)
  } catch (e: any) {
    error.value = e?.data?.statusMessage || e?.message || 'Error al guardar'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
@media (max-width: 720px) {
  .row {
    grid-template-columns: 1fr;
  }
}
.label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-weight: 600;
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
.categorySelect {
  color-scheme: dark;
}
.categorySelect option {
  background: #101a33;
  color: #fff;
}
.input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}
.actions {
  display: flex;
  justify-content: flex-end;
}
.btn {
  background: linear-gradient(135deg, #8b5cf6, #ec4899);
  border: none;
  color: white;
  font-weight: 800;
  border-radius: 12px;
  padding: 10px 14px;
}
.btn:disabled {
  opacity: 0.5;
}
.error {
  margin: 0;
  color: #fb7185;
  font-weight: 700;
}
</style>

