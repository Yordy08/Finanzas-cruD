<template>
  <div class="wrap">
    <div class="header">
      <h3 class="title">Ingresos vs Gastos</h3>
    </div>

    <div class="chartBox">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

type Transaction = {
  id: string
  type: 'income' | 'expense'
  amount: number
  date: string
}

const props = defineProps<{
  transactions: Transaction[]
}>()

const formatCOP = (n: number) => {
  try {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(n)
  } catch {
    return String(n)
  }
}

const series = computed(() => {
  const byMonth = new Map<string, { income: number; expense: number }>()

  for (const t of props.transactions) {
    const d = new Date(t.date)
    if (Number.isNaN(d.getTime())) continue

    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const cur = byMonth.get(key) ?? { income: 0, expense: 0 }

    if (t.type === 'income') cur.income += t.amount
    else cur.expense += t.amount

    byMonth.set(key, cur)
  }

  const keys = Array.from(byMonth.keys()).sort((a, b) => a.localeCompare(b))
  const lastKeys = keys.slice(Math.max(0, keys.length - 12))

  const labels: string[] = []
  const income: number[] = []
  const expense: number[] = []

  for (const key of lastKeys) {
    const [yStr, mStr] = key.split('-')
    const y = Number(yStr)
    const m = Number(mStr)

    const monthLabel = new Date(y, m - 1, 1).toLocaleDateString('es-CO', { month: 'short', year: '2-digit' })
    labels.push(monthLabel)

    income.push(byMonth.get(key)?.income ?? 0)
    expense.push(byMonth.get(key)?.expense ?? 0)
  }

  return { labels, income, expense }
})

const chartData = computed(() => {
  return {
    labels: series.value.labels,
    datasets: [
      {
        label: 'Ingresos',
        data: series.value.income,
        backgroundColor: 'rgba(52,211,153,.35)',
        borderColor: 'rgba(52,211,153,1)',
        borderWidth: 1,
        borderRadius: 8,
      },
      {
        label: 'Gastos',
        data: series.value.expense,
        backgroundColor: 'rgba(251,113,133,.35)',
        borderColor: 'rgba(251,113,133,1)',
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  }
})

const chartOptions = computed(() => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: 'rgba(255,255,255,.85)' } },
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            const v = Number(ctx.parsed.y ?? 0)
            return `${ctx.dataset.label}: ${formatCOP(v)}`
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,.08)' },
        ticks: { color: 'rgba(255,255,255,.75)' },
      },
      y: {
        grid: { color: 'rgba(255,255,255,.08)' },
        ticks: {
          color: 'rgba(255,255,255,.75)',
          callback: (v: any) => {
            const n = Number(v)
            if (!Number.isFinite(n)) return v
            return new Intl.NumberFormat('es-CO', { notation: 'compact', maximumFractionDigits: 2 }).format(n)
          },
        },
      },
    },
  } as const
})
</script>

<style scoped>
.wrap {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 10px;
}

.title {
  margin: 0;
  font-size: 14px;
  font-weight: 900;
  color: white;
}

.chartBox {
  position: relative;
  height: 260px;
}

@media (max-width: 720px) {
  .chartBox {
    height: 220px;
  }
}

@media (max-width: 480px) {
  .wrap {
    gap: 8px;
  }

  .chartBox {
    height: 180px;
  }

  .title {
    font-size: 13px;
  }

  .meta {
    font-size: 11px;
  }
}

@media (max-width: 390px) {
  .chartBox {
    height: 160px;
  }
}
</style>

