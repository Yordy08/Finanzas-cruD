<template>
  <div class="wrap">
    <div class="header">
      <h3 class="title">Gastos por categoría</h3>
    </div>

    <div class="chartBox">
      <Doughnut :data="chartData" :options="chartOptions" />
    </div>

    <div v-if="legendItems.length" class="legend">
      <div v-for="it in legendItems" :key="it.label" class="legendItem">
        <span class="dot" :style="{ background: it.color }" />
        <span class="label">{{ it.label }}</span>
        <span class="value">{{ it.value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  ArcElement,
  Title,
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

type Transaction = {
  id: string
  type: 'income' | 'expense'
  amount: number
  date: string
  category: string
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

const palette = [
  '#60a5fa', // blue
  '#34d399', // green
  '#fb7185', // red
  '#fbbf24', // amber
  '#a78bfa', // violet
  '#22c55e',
  '#ef4444',
  '#3b82f6',
]

const topN = 6

const grouped = computed(() => {
  const expenses = props.transactions.filter((t) => t.type === 'expense')
  const byCat = new Map<string, number>()

  for (const t of expenses) {
    const key = (t.category || 'Sin categoría').trim()
    byCat.set(key, (byCat.get(key) ?? 0) + t.amount)
  }

  const sorted = Array.from(byCat.entries()).sort((a, b) => b[1] - a[1])

  const top = sorted.slice(0, topN)
  const rest = sorted.slice(topN)

  const labels: string[] = []
  const values: number[] = []

  for (const [label, value] of top) {
    labels.push(label)
    values.push(value)
  }

  const restSum = rest.reduce((acc, [, v]) => acc + v, 0)
  if (restSum > 0) {
    labels.push('Otros')
    values.push(restSum)
  }

  return { labels, values }
})

const legendItems = computed(() => {
  const total = grouped.value.values.reduce((a, b) => a + b, 0)
  return grouped.value.labels.map((label, idx) => {
    const value = grouped.value.values[idx] ?? 0
    const pct = total > 0 ? Math.round((value / total) * 100) : 0
    return {
      label,
      color: palette[idx % palette.length],
      value: `${formatCOP(value)} (${pct}%)`,
    }
  })
})

const chartData = computed(() => {
  return {
    labels: grouped.value.labels,
    datasets: [
      {
        data: grouped.value.values,
        backgroundColor: grouped.value.labels.map((_, idx) => palette[idx % palette.length]),
        borderColor: 'rgba(0,0,0,.25)',
        borderWidth: 1,
        hoverOffset: 8,
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
          label: (ctx: any) => {
            const value = Number(ctx.parsed ?? 0)
            const label = ctx.label ?? ''
            return `${label}: ${formatCOP(value)}`
          },
        },
      },
    },
    cutout: '62%',
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

.legend {
  display: grid;
  gap: 8px;
}

.legendItem {
  display: grid;
  grid-template-columns: 12px 1fr auto;
  gap: 10px;
  align-items: center;
  font-size: 12px;
  color: rgba(255, 255, 255, .9);
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
}

.label {
  font-weight: 800;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.value {
  opacity: 0.85;
  font-weight: 800;
}

@media (max-width: 720px) {
  .chartBox {
    height: 220px;
  }

  .legend {
    gap: 6px;
  }

  .legendItem {
    font-size: 11px;
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

  .legend {
    gap: 5px;
  }

  .legendItem {
    font-size: 10px;
    gap: 8px;
  }

  .dot {
    width: 8px;
    height: 8px;
  }
}

@media (max-width: 390px) {
  .chartBox {
    height: 160px;
  }

  .legendItem {
    font-size: 9px;
  }
}
</style>

