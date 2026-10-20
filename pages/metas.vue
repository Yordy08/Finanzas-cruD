<template>
  <div class="container"><TopBar /><h1>Metas de ahorro</h1>
    <section class="card formCard"><h2>Nueva meta</h2><form class="form" @submit.prevent="createGoal">
      <input v-model="form.name" required placeholder="Nombre de la meta" />
      <input v-model.number="form.target" required min="1" step="0.01" type="number" placeholder="Objetivo COP" />
      <textarea v-model="form.description" placeholder="Descripción (opcional)" />
      <input v-model="form.dueDate" type="date" />
      <button :disabled="saving">{{ saving ? 'Guardando...' : 'Crear meta' }}</button>
    </form><p v-if="error" class="error">{{ error }}</p></section>
    <section v-for="goal in goals" :key="goal.id" class="card goal">
      <div class="goalHead"><div><h2>{{ goal.name }}</h2><p>{{ goal.description || 'Meta compartida' }}</p></div><strong>{{ money(goal.balance) }}</strong></div>
      <div class="bar"><span :style="{ width: `${goal.progress}%` }" /></div><div class="stats"><span>{{ goal.progress.toFixed(2) }}%</span><span>Aportado {{ money(goal.contributions) }}</span><span>Retirado {{ money(goal.withdrawals) }}</span><span>Objetivo {{ money(goal.target) }}</span></div>
      <form class="movement" @submit.prevent="addMovement(goal.id)"><select v-model="movement.type"><option value="contribution">Aporte</option><option value="withdrawal">Retiro</option></select><input v-model.number="movement.amount" min="0.01" step="0.01" type="number" placeholder="Valor COP" required /><input v-model="movement.description" placeholder="Descripción" /><button>Registrar</button></form>
      <details><summary>Historial ({{ goal.movements.length }})</summary><p v-for="item in goal.movements" :key="item.id" class="history"><span>{{ item.type === 'contribution' ? 'Aporte' : 'Retiro' }} · {{ item.user?.name || 'Integrante' }}</span><strong :class="item.type">{{ money(item.amount) }}</strong></p></details>
    </section><p v-if="!goals.length" class="empty">Todavía no hay metas.</p>
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import TopBar from '~/components/TopBar.vue'
import { useMvpUserId } from '~/composables/useMvpUserId'
const userId = useMvpUserId(); const goals = ref<any[]>([]); const saving = ref(false); const error = ref('')
const form = reactive({ name: '', target: 0, description: '', dueDate: '' }); const movement = reactive({ type: 'contribution', amount: 0, description: '' })
const money = (value: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value || 0)
const refresh = async () => { if (userId) goals.value = await $fetch('/api/goals', { params: { userId } }) as any[] }
const createGoal = async () => { error.value = ''; saving.value = true; try { await $fetch('/api/goals', { method: 'POST', body: { userId, ...form, scope: 'shared' } }); form.name = ''; form.target = 0; form.description = ''; form.dueDate = ''; await refresh() } catch (e: any) { error.value = e?.data?.statusMessage || 'No se pudo crear la meta' } finally { saving.value = false } }
const addMovement = async (goalId: string) => { try { await $fetch('/api/goal-movements', { method: 'POST', body: { userId, goalId, ...movement } }); movement.amount = 0; movement.description = ''; await refresh() } catch (e: any) { error.value = e?.data?.statusMessage || 'No se pudo registrar el movimiento' } }
onMounted(refresh)
</script>
<style scoped>
.container{max-width:1000px;margin:auto;color:#fff}.card{background:#111827;border:1px solid #263244;border-radius:18px;padding:16px;margin:14px 0}.form{display:grid;gap:10px}.form input,.form textarea,.movement input,.movement select{padding:11px;border-radius:10px;border:1px solid #334155;background:#0f172a;color:#fff}.form textarea{min-height:70px}.form button,.movement button{padding:11px 14px;border:0;border-radius:10px;background:#2563eb;color:#fff;font-weight:800}.goalHead{display:flex;justify-content:space-between;gap:12px}.goal h2{margin:0 0 4px}.goal p{opacity:.75;margin:0}.bar{height:12px;background:#263244;border-radius:99px;overflow:hidden;margin:18px 0 8px}.bar span{display:block;height:100%;background:linear-gradient(90deg,#22c55e,#38bdf8);border-radius:inherit}.stats{display:flex;gap:14px;flex-wrap:wrap;font-size:13px;opacity:.85}.movement{display:grid;grid-template-columns:150px 160px 1fr auto;gap:8px;margin-top:18px}.history{display:flex;justify-content:space-between;border-bottom:1px solid #263244;padding:8px 0}.contribution{color:#4ade80}.withdrawal{color:#fb7185}.error{color:#fb7185}.empty{opacity:.75}@media(max-width:680px){.movement{grid-template-columns:1fr 1fr}.movement input:nth-of-type(2){grid-column:1/-1}.movement button{grid-column:1/-1}.goalHead{flex-direction:column}}
</style>
