<template>
  <div class="container"><TopBar /><div class="heading"><div><h1>Calendario de pagos</h1><p>Controla vencimientos sin confundir recordatorios con pagos realizados.</p></div><button class="secondary" @click="enableNotifications">{{ notificationLabel }}</button></div>
    <section class="card"><h2>Nuevo pago</h2><form class="form" @submit.prevent="createPayment"><input v-model="form.title" required placeholder="Ej: Arriendo" /><input v-model.number="form.amount" min="0" step="0.01" type="number" placeholder="Valor COP" /><input v-model="form.dueAt" required type="datetime-local" /><select v-model="form.recurrence"><option value="once">Único</option><option value="weekly">Semanal</option><option value="monthly">Mensual</option><option value="yearly">Anual</option></select><select v-model.number="form.reminderHours" aria-label="Cuándo recordar el pago"><option :value="24">Avisar 1 día antes</option><option :value="72">Avisar 3 días antes</option><option :value="168">Avisar 7 días antes</option><option :value="336">Avisar 14 días antes</option></select><button>Crear recordatorio</button></form><p class="hint">Te enviaremos un correo a las 9:00 a. m. (hora de Colombia) cuando llegue el momento elegido. Si sigue pendiente al vencerse, recibirás un aviso de pago vencido.</p><p v-if="error" class="error">{{ error }}</p></section>
    <section v-for="payment in payments" :key="payment.id" class="card payment" :class="payment.state"><div class="paymentTop"><div><h2>{{ payment.title }}</h2><p>{{ payment.responsibleUser?.name || 'Responsable pendiente' }}</p></div><strong>{{ payment.amount ? money(payment.amount) : 'Sin valor' }}</strong></div><div class="traffic"><span class="fill" :style="{ width: `${barWidth(payment)}%` }" /><span class="label">{{ stateLabel(payment) }}</span></div><div class="paymentMeta"><span>{{ new Date(payment.dueAt).toLocaleString('es-CO') }}</span><span v-if="payment.daysLate">{{ payment.daysLate }} día(s) de retraso</span><span v-else>{{ remaining(payment) }}</span><span>{{ payment.status }}</span></div><div class="actions"><button v-if="payment.status === 'pending'" class="pay" @click="markPaid(payment.id)">Marcar como pagado</button><button class="edit" @click="editPayment(payment)">Editar</button><button class="remove" @click="deletePayment(payment.id)">Eliminar</button></div></section><p v-if="!payments.length" class="empty">No hay pagos registrados.</p>
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted, reactive, ref } from 'vue'
import Swal from 'sweetalert2'
import TopBar from '~/components/TopBar.vue'
import { useMvpUserId } from '~/composables/useMvpUserId'
const userId = useMvpUserId(); const payments = ref<any[]>([]); const error = ref(''); const notificationLabel = ref('Activar notificaciones')
const form = reactive({ title: '', amount: undefined as number | undefined, dueAt: '', recurrence: 'once', reminderHours: 168 })
const money = (n: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(n)
const refresh = async () => { if (userId) { payments.value = await $fetch('/api/payments', { params: { userId } }) as any[]; notifyDuePayments() } }
const createPayment = async () => { try { await $fetch('/api/payments', { method: 'POST', body: { userId, ...form, dueAt: new Date(form.dueAt).toISOString(), scope: 'shared' } }); form.title = ''; form.amount = undefined; form.dueAt = ''; await refresh() } catch (e: any) { error.value = e?.data?.statusMessage || 'No se pudo crear el pago' } }
const markPaid = async (id: string) => {
  const result = await Swal.fire({ title: '¿Marcar como pagado?', text: 'El pago dejará de aparecer como pendiente.', icon: 'question', showCancelButton: true, confirmButtonText: 'Sí, marcarlo', cancelButtonText: 'Cancelar', reverseButtons: true })
  if (!result.isConfirmed) return
  try {
    await $fetch(`/api/payments/${id}`, { method: 'PUT', body: { userId, status: 'paid' } })
    await refresh()
    await Swal.fire({ title: 'Pago actualizado', text: 'El pago fue marcado como pagado.', icon: 'success', timer: 1800, showConfirmButton: false })
  } catch (e: any) {
    await Swal.fire({ title: 'No se pudo actualizar', text: e?.data?.statusMessage || 'Intenta nuevamente.', icon: 'error' })
  }
}
const editPayment = async (payment: any) => {
  const result = await Swal.fire({
    title: 'Editar pago',
    html: `<input id="payment-title" class="swal2-input" maxlength="120" placeholder="Nombre del pago"><input id="payment-amount" class="swal2-input" type="number" min="0" step="0.01" placeholder="Valor COP (opcional)"><input id="payment-due" class="swal2-input" type="datetime-local"><select id="payment-recurrence" class="swal2-select"><option value="once">Único</option><option value="weekly">Semanal</option><option value="monthly">Mensual</option><option value="yearly">Anual</option></select><select id="payment-reminder" class="swal2-select"><option value="24">Avisar 1 día antes</option><option value="72">Avisar 3 días antes</option><option value="168">Avisar 7 días antes</option><option value="336">Avisar 14 días antes</option></select>`,
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Guardar cambios',
    cancelButtonText: 'Cancelar',
    didOpen: () => {
      const title = document.querySelector<HTMLInputElement>('#payment-title')
      const amount = document.querySelector<HTMLInputElement>('#payment-amount')
      const due = document.querySelector<HTMLInputElement>('#payment-due')
      const recurrence = document.querySelector<HTMLSelectElement>('#payment-recurrence')
      const reminder = document.querySelector<HTMLSelectElement>('#payment-reminder')
      if (title) title.value = payment.title || ''
      if (amount) amount.value = payment.amount ?? ''
      if (due) {
        const date = new Date(payment.dueAt)
        due.value = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
      }
      if (recurrence) recurrence.value = payment.recurrence || 'once'
      if (reminder) reminder.value = String(payment.reminderHours ?? 168)
    },
    preConfirm: () => {
      const title = document.querySelector<HTMLInputElement>('#payment-title')?.value.trim() || ''
      const amountValue = document.querySelector<HTMLInputElement>('#payment-amount')?.value ?? ''
      const dueAt = document.querySelector<HTMLInputElement>('#payment-due')?.value || ''
      const recurrence = document.querySelector<HTMLSelectElement>('#payment-recurrence')?.value || 'once'
      const reminderHours = Number(document.querySelector<HTMLSelectElement>('#payment-reminder')?.value)
      const amount = amountValue === '' ? null : Number(amountValue)
      if (!title) { Swal.showValidationMessage('Escribe el nombre del pago'); return }
      if (amount !== null && (!Number.isFinite(amount) || amount < 0)) { Swal.showValidationMessage('Escribe un monto válido'); return }
      if (!dueAt || Number.isNaN(new Date(dueAt).getTime())) { Swal.showValidationMessage('Selecciona una fecha de vencimiento'); return }
      return { title, amount, dueAt: new Date(dueAt).toISOString(), recurrence, reminderHours }
    },
  })
  if (!result.isConfirmed) return
  try {
    await $fetch(`/api/payments/${payment.id}`, { method: 'PUT', body: { userId, ...result.value } })
    await refresh()
    await Swal.fire({ title: 'Pago actualizado', icon: 'success', timer: 1500, showConfirmButton: false })
  } catch (e: any) {
    await Swal.fire({ title: 'No se pudo editar', text: e?.data?.statusMessage || 'Intenta nuevamente.', icon: 'error' })
  }
}
const deletePayment = async (id: string) => {
  const result = await Swal.fire({ title: '¿Eliminar este pago?', text: 'Esta acción no se puede deshacer.', icon: 'warning', showCancelButton: true, confirmButtonText: 'Sí, eliminar', cancelButtonText: 'Cancelar', confirmButtonColor: '#be185d', reverseButtons: true })
  if (!result.isConfirmed) return
  try {
    await $fetch(`/api/payments/${id}`, { method: 'DELETE' })
    await refresh()
    await Swal.fire({ title: 'Pago eliminado', icon: 'success', timer: 1500, showConfirmButton: false })
  } catch (e: any) {
    await Swal.fire({ title: 'No se pudo eliminar', text: e?.data?.statusMessage || 'Intenta nuevamente.', icon: 'error' })
  }
}
const remaining = (p: any) => { const hours = Math.max(0, p.hoursRemaining); return hours < 24 ? `${hours} hora(s) restantes` : `${Math.ceil(hours / 24)} día(s) restantes` }
const stateLabel = (p: any) => p.state === 'overdue' ? 'VENCIDO' : p.state === 'today' ? 'VENCE HOY' : p.state === 'soon' ? 'PRÓXIMO' : p.state === 'paid' ? 'PAGADO' : p.state === 'cancelled' ? 'CANCELADO' : 'A TIEMPO'
const barWidth = (p: any) => p.state === 'overdue' || p.state === 'today' ? 100 : p.state === 'soon' ? 70 : 35
const enableNotifications = async () => { if (!('Notification' in window)) { notificationLabel.value = 'No compatible'; return }; const result = await Notification.requestPermission(); notificationLabel.value = result === 'granted' ? 'Notificaciones activas' : 'Permiso no concedido'; if (result === 'granted') { const context = new AudioContext(); await context.resume(); context.close(); notifyDuePayments() } }
const playAlertSound = () => { if (localStorage.getItem('payment-sound-enabled') === 'false') return; const context = new AudioContext(); const oscillator = context.createOscillator(); const gain = context.createGain(); oscillator.frequency.value = 660; gain.gain.value = 0.05; oscillator.connect(gain); gain.connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + .25); window.setTimeout(() => context.close(), 400) }
const notifyDuePayments = () => { const today = new Date().toISOString().slice(0, 10); payments.value.filter((payment) => payment.status === 'pending' && ['today', 'overdue'].includes(payment.state)).forEach((payment) => { const key = `payment-notified:${payment.id}:${today}`; if (localStorage.getItem(key)) return; if ('Notification' in window && Notification.permission === 'granted') new Notification(payment.state === 'overdue' ? 'Pago vencido' : 'Pago vence hoy', { body: `${payment.title}${payment.amount ? ` · ${money(payment.amount)}` : ''}` }); playAlertSound(); localStorage.setItem(key, '1') }) }
let reminderTimer: number | undefined
onMounted(async () => { await refresh(); reminderTimer = window.setInterval(refresh, 60000) })
onUnmounted(() => { if (reminderTimer) window.clearInterval(reminderTimer) })
</script>
<style scoped>
.container{max-width:1000px;margin:auto;color:#fff}.heading,.paymentTop,.paymentMeta{display:flex;justify-content:space-between;gap:14px;align-items:center}.heading p,.payment p{opacity:.75}.card{background:rgba(20,30,58,.88);border:1px solid rgba(139,92,246,.22);border-radius:18px;padding:16px;margin:14px 0}.form{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.form input,.form select{padding:11px;border-radius:10px;border:1px solid rgba(139,92,246,.3);background:#101a33;color:#fff}.form button,.secondary,.pay,.edit,.remove{padding:11px 14px;border:0;border-radius:10px;background:linear-gradient(135deg,#8b5cf6,#ec4899);color:#fff;font-weight:800}.secondary{background:#24345c}.hint{font-size:13px;opacity:.72}.traffic{position:relative;height:22px;background:#26375e;border-radius:99px;overflow:hidden;margin:16px 0 8px}.fill{display:block;height:100%;background:linear-gradient(90deg,#22d3ee,#8b5cf6)}.soon .fill{background:#eab308}.today .fill,.overdue .fill{background:#ef476f}.label{position:absolute;inset:0;text-align:center;font-size:12px;font-weight:900;line-height:22px;text-shadow:0 1px 3px #000}.paymentMeta{font-size:13px;opacity:.85;flex-wrap:wrap}.pay{margin-top:14px;background:#14b8a6}.edit{background:#24345c}.remove{background:#be185d}.actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px}.error{color:#fb7185}.empty{opacity:.75}@media(max-width:720px){.heading,.paymentTop{align-items:flex-start;flex-direction:column}.form{grid-template-columns:1fr}.paymentMeta{align-items:flex-start;flex-direction:column}}
</style>
