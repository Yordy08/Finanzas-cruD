```vue
<template>
  <div class="wrap">
    <div class="header">
      <div class="heading">
        <span class="eyebrow">ANÁLISIS FINANCIERO</span>
        <h3 class="title">Evolución del saldo</h3>
        <p class="subtitle">Comportamiento de tus finanzas a lo largo del tiempo</p>
      </div>

      <div class="period">
        <span class="period-dot"></span>
        Últimos {{ series.labels.length }} meses
      </div>
    </div>

    <div v-if="series.data.length" class="chartBox">
      <Line :data="chartData" :options="chartOptions" />
    </div>

    <div v-else class="emptyState">
      <span class="emptyIcon">↗</span>
      <strong>Sin movimientos registrados</strong>
      <span>Cuando registres ingresos o gastos, aparecerá aquí tu evolución financiera.</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Tooltip,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
} from 'chart.js'

ChartJS.register(
  Tooltip,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler,
)

type Transaction = {
  id: string
  type: 'income' | 'expense'
  amount: number
  date: string
}

const props = defineProps<{
  transactions: Transaction[]
}>()

const formatCOP = (value: number) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(value)

const compactCOP = (value: number) =>
  new Intl.NumberFormat('es-CO', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)

const series = computed(() => {
  const byMonth = new Map<
    string,
    { income: number; expense: number }
  >()

  for (const transaction of props.transactions) {
    const amount = Number(transaction.amount)
    const date = new Date(transaction.date)

    if (
      !Number.isFinite(amount) ||
      amount < 0 ||
      Number.isNaN(date.getTime())
    ) {
      continue
    }

    const key = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
    ].join('-')

    const current = byMonth.get(key) ?? {
      income: 0,
      expense: 0,
    }

    if (transaction.type === 'income') {
      current.income += amount
    } else if (transaction.type === 'expense') {
      current.expense += amount
    } else {
      continue
    }

    byMonth.set(key, current)
  }

  // Mostrar los últimos 12 meses calendario,
  // incluyendo los meses sin movimientos.
  const now = new Date()
  const months: string[] = []

  for (let offset = 11; offset >= 0; offset--) {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - offset,
      1,
    )

    months.push(
      `${date.getFullYear()}-${String(
        date.getMonth() + 1,
      ).padStart(2, '0')}`,
    )
  }

  // Mantiene el cálculo acumulado de la versión original.
  // No representa el saldo bancario real si falta el saldo inicial.
  let accumulated = 0

  const labels: string[] = []
  const data: number[] = []

  for (const key of months) {
    const current = byMonth.get(key) ?? {
      income: 0,
      expense: 0,
    }

    accumulated += current.income - current.expense

    const [year, month] = key.split('-').map(Number)

    labels.push(
      new Date(year, month - 1, 1).toLocaleDateString(
        'es-CO',
        { month: 'short', year: '2-digit' },
      ),
    )

    data.push(accumulated)
  }

  return { labels, data }
})

const chartData = computed(() => ({
  labels: series.value.labels,

  datasets: [
    {
      label: 'Variación acumulada',
      data: series.value.data,

      borderColor: '#60a5fa',
      backgroundColor: 'rgba(96, 165, 250, 0.10)',

      borderWidth: 2.5,
      fill: true,
      tension: 0.35,

      pointRadius: 0,
      pointHoverRadius: 5,
      pointHitRadius: 12,

      pointBackgroundColor: '#60a5fa',
      pointBorderColor: '#111a30',
      pointBorderWidth: 2,

      borderCapStyle: 'round' as const,
      borderJoinStyle: 'round' as const,
    },
  ],
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,

  interaction: {
    mode: 'index' as const,
    intersect: false,
  },

  animation: {
    duration: 650,
  },

  layout: {
    padding: {
      top: 8,
      right: 8,
      bottom: 0,
      left: 2,
    },
  },

  plugins: {
    legend: {
      display: false,
    },

    tooltip: {
      enabled: true,
      backgroundColor: '#202c45',
      titleColor: '#a8b8d4',
      bodyColor: '#ffffff',
      borderColor: 'rgba(148, 163, 184, 0.22)',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 10,
      displayColors: false,

      callbacks: {
        title: (items: Array<{ label: string }>) =>
          items[0]?.label ?? '',

        label: (context: { parsed: { y: number | null } }) =>
          formatCOP(context.parsed.y ?? 0),
      },
    },
  },

  scales: {
    x: {
      border: {
        display: false,
      },

      grid: {
        display: false,
        drawTicks: false,
      },

      ticks: {
        color: '#94a3b8',
        maxRotation: 0,
        autoSkip: true,
        maxTicksLimit: 6,
        padding: 12,
        font: {
          size: 10,
          weight: 500,
        },
      },
    },

    y: {
      border: {
        display: false,
      },

      grid: {
        color: 'rgba(148, 163, 184, 0.10)',
        drawTicks: false,
      },

      ticks: {
        color: '#94a3b8',
        padding: 12,
        maxTicksLimit: 6,

        font: {
          size: 10,
        },

        callback: (value: string | number) => {
          const number = Number(value)

          if (!Number.isFinite(number)) return value

          return compactCOP(number)
        },
      },
    },
  },
}))

</script>

<style scoped>
.wrap {
  display: flex;
  flex-direction: column;
  gap: 22px;
  min-width: 0;
  width: 100%;
  height: 100%;
  padding: 22px;
  color: #f1f5f9;
  background: #111b33;
  border: 1px solid rgba(129, 140, 248, 0.20);
  border-radius: 16px;
  box-sizing: border-box;
  transition: border-color 180ms ease;
}

.wrap:hover {
  border-color: rgba(96, 165, 250, 0.35);
}

.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.heading {
  min-width: 0;
}

.eyebrow {
  display: block;
  margin-bottom: 7px;
  color: #7f9ac4;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.title {
  margin: 0;
  color: #f8fafc;
  font-size: 17px;
  font-weight: 750;
  letter-spacing: -0.4px;
  line-height: 1.4;
}

.subtitle {
  margin: 5px 0 0;
  color: #93a4c1;
  font-size: 11px;
  line-height: 1.6;
}

.period {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  flex-shrink: 0;
  padding: 7px 10px;
  color: #bdcbe0;
  background: rgba(148, 163, 184, 0.07);
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 8px;
  font-size: 10px;
  font-weight: 600;
  white-space: nowrap;
}

.period-dot {
  width: 6px;
  height: 6px;
  flex-shrink: 0;
  background: #60a5fa;
  border-radius: 50%;
}

.chartBox {
  position: relative;
  width: 100%;
  height: 300px;
  min-height: 0;
}

.emptyState {
  display: flex;
  flex: 1;
  min-height: 220px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  text-align: center;
  padding: 20px;
}

.emptyIcon {
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  color: #60a5fa;
  background: rgba(96, 165, 250, 0.10);
  border-radius: 12px;
  font-size: 24px;
}

.emptyState strong {
  color: #e2e8f0;
  font-size: 13px;
}

.emptyState > span:last-child {
  max-width: 300px;
  color: #94a3b8;
  font-size: 11px;
  line-height: 1.7;
}

@media (max-width: 720px) {
  .wrap {
    gap: 18px;
    padding: 18px;
  }

  .chartBox {
    height: 260px;
  }
}

@media (max-width: 480px) {
  .wrap {
    gap: 16px;
    padding: 15px;
    border-radius: 12px;
  }

  .header {
    flex-direction: column;
    gap: 12px;
  }

  .title {
    font-size: 15px;
  }

  .subtitle {
    font-size: 10px;
  }

  .chartBox {
    height: 220px;
  }

  .period {
    font-size: 10px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .wrap {
    transition: none;
  }
}
</style>
```