<template>
  <div class="wrap">
    <div class="header">
      <h3 class="title">Evolución del saldo</h3>
      <div class="meta">Últimos {{ series.labels.length }} meses</div>
    </div>

    <div class="chartBox">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

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

const series = computed<{ labels: string[]; data: number[] }>(() => {
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

  const keys = Array.from(byMonth.keys()).sort((a, b) => {
    // a,b => yyyy-mm, safe lexicographic
    return a.localeCompare(b)
  })

  // últimos 12 meses (o menos)
  const lastKeys = keys.slice(Math.max(0, keys.length - 12))

  let acc = 0
  const labels: string[] = []
  const data: number[] = []

  for (const key of lastKeys) {
    const [yStr, mStr] = key.split('-')
    const y = Number(yStr)
    const m = Number(mStr) // 1..12

    const neto = (byMonth.get(key)?.income ?? 0) - (byMonth.get(key)?.expense ?? 0)
    acc += neto

    const monthLabel = new Date(y, m - 1, 1).toLocaleDateString('es-CO', { month: 'short', year: '2-digit' })
    labels.push(monthLabel)
    data.push(acc)
  }

  return { labels, data }
})

const chartData = computed(() => {
  return {
    labels: series.value.labels,
    datasets: [
      {
        label: 'Saldo acumulado',
        data: series.value.data,
        borderColor: '#60a5fa',
        backgroundColor: 'rgba(96,165,250,.15)',
        fill: true,
        tension: 0.35,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  }
})

const chartOptions = computed(() => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => formatCOP(Number(ctx.parsed.y ?? 0)),
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
            // simplifica: redondea para ticks
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

.meta {
  opacity: 0.7;
  font-size: 12px;
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

