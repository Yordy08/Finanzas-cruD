```vue
<template>
  <div class="wrap">
    <div class="header">
      <div>
        <span class="eyebrow">RESUMEN FINANCIERO</span>
        <h3 class="title">Ingresos vs. gastos</h3>
        <p class="subtitle">Compara el dinero que recibes con el que gastas</p>
      </div>

      <div class="period">
        <span class="periodDot"></span>
        Últimos 12 meses
      </div>
    </div>

    <div v-if="hasData" class="chartBox">
      <Bar :data="chartData" :options="chartOptions" />
    </div>

    <div v-else class="emptyState">
      <span class="emptyIcon">↗</span>
      <strong>Sin movimientos registrados</strong>
      <span>Registra ingresos o gastos para comparar tu actividad financiera.</span>
    </div>

    <div v-if="hasData" class="summary">
      <div class="summaryItem">
        <span class="summaryDot incomeDot"></span>
        <div>
          <span class="summaryLabel">Ingresos del período</span>
          <strong class="incomeValue">{{ formatCOP(totalIncome) }}</strong>
        </div>
      </div>

      <div class="summaryItem">
        <span class="summaryDot expenseDot"></span>
        <div>
          <span class="summaryLabel">Gastos del período</span>
          <strong class="expenseValue">{{ formatCOP(totalExpense) }}</strong>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

ChartJS.register(
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
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

const formatCompact = (value: number) =>
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
    const date = new Date(transaction.date)
    const amount = Number(transaction.amount)

    if (
      Number.isNaN(date.getTime()) ||
      !Number.isFinite(amount) ||
      amount < 0
    ) {
      continue
    }

    if (
      transaction.type !== 'income' &&
      transaction.type !== 'expense'
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
    } else {
      current.expense += amount
    }

    byMonth.set(key, current)
  }

  const now = new Date()
  const labels: string[] = []
  const income: number[] = []
  const expense: number[] = []

  // Últimos 12 meses calendario, incluso si no hay movimientos.
  for (let offset = 11; offset >= 0; offset--) {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - offset,
      1,
    )

    const key = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
    ].join('-')

    labels.push(
      date.toLocaleDateString('es-CO', {
        month: 'short',
        year: '2-digit',
      }),
    )

    const current = byMonth.get(key)

    income.push(current?.income ?? 0)
    expense.push(current?.expense ?? 0)
  }

  return { labels, income, expense }
})

const totalIncome = computed(() =>
  series.value.income.reduce((sum, value) => sum + value, 0),
)

const totalExpense = computed(() =>
  series.value.expense.reduce((sum, value) => sum + value, 0),
)

const hasData = computed(() =>
  totalIncome.value > 0 || totalExpense.value > 0,
)

const chartData = computed(() => ({
  labels: series.value.labels,

  datasets: [
    {
      label: 'Ingresos',
      data: series.value.income,
      backgroundColor: 'rgba(52, 211, 153, 0.78)',
      hoverBackgroundColor: '#34d399',
      borderColor: '#34d399',
      borderWidth: 1,
      borderRadius: 5,
      borderSkipped: false,
      maxBarThickness: 24,
      categoryPercentage: 0.72,
      barPercentage: 0.82,
    },
    {
      label: 'Gastos',
      data: series.value.expense,
      backgroundColor: 'rgba(251, 113, 133, 0.78)',
      hoverBackgroundColor: '#fb7185',
      borderColor: '#fb7185',
      borderWidth: 1,
      borderRadius: 5,
      borderSkipped: false,
      maxBarThickness: 24,
      categoryPercentage: 0.72,
      barPercentage: 0.82,
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
    duration: 600,
  },

  layout: {
    padding: {
      top: 8,
      right: 5,
      bottom: 0,
      left: 0,
    },
  },

  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
      align: 'center' as const,

      labels: {
        color: '#cbd5e1',
        usePointStyle: true,
        pointStyle: 'circle' as const,
        boxWidth: 7,
        boxHeight: 7,
        padding: 18,

        font: {
          size: 10,
          weight: 600 as const,
        },
      },
    },

    tooltip: {
      backgroundColor: '#202c45',
      titleColor: '#a8b8d4',
      bodyColor: '#ffffff',
      borderColor: 'rgba(148, 163, 184, 0.22)',
      borderWidth: 1,
      padding: 12,
      cornerRadius: 10,
      displayColors: true,

      callbacks: {
        label: (context: {
          dataset: { label?: string }
          parsed: { y: number }
        }) =>
          `${context.dataset.label}: ${formatCOP(context.parsed.y)}`,

        footer: (
          items: Array<{ parsed: { y: number } }>,
        ) => {
          const total = items.reduce(
            (sum, item) => sum + (item.parsed.y || 0),
            0,
          )

          return `Total del mes: ${formatCOP(total)}`
        },
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
        padding: 10,

        font: {
          size: 10,
          weight: 500 as const,
        },
      },
    },

    y: {
      beginAtZero: true,

      border: {
        display: false,
      },

      grid: {
        color: 'rgba(148, 163, 184, 0.10)',
        drawTicks: false,
      },

      ticks: {
        color: '#94a3b8',
        padding: 10,
        maxTicksLimit: 6,

        font: {
          size: 10,
        },

        callback: (value: string | number) => {
          const number = Number(value)

          if (!Number.isFinite(number)) return value

          return formatCompact(number)
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
  gap: 20px;
  width: 100%;
  height: 100%;
  min-width: 0;
  padding: 22px;
  box-sizing: border-box;
  color: #f1f5f9;
  background: #111b33;
  border: 1px solid rgba(129, 140, 248, 0.20);
  border-radius: 16px;
  transition: border-color 180ms ease;
}

.wrap:hover {
  border-color: rgba(96, 165, 250, 0.35);
}

.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.eyebrow {
  display: block;
  margin-bottom: 7px;
  color: #7f9ac4;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.4px;
}

.title {
  margin: 0;
  color: #f8fafc;
  font-size: 16px;
  font-weight: 750;
  letter-spacing: -0.3px;
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

.periodDot {
  width: 6px;
  height: 6px;
  background: #34d399;
  border-radius: 50%;
}

.chartBox {
  position: relative;
  width: 100%;
  height: 250px;
  min-height: 0;
}

.summary {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid rgba(148, 163, 184, 0.12);
}

.summaryItem {
  display: flex;
  align-items: flex-start;
  gap: 9px;
  min-width: 0;
}

.summaryDot {
  width: 8px;
  height: 8px;
  flex-shrink: 0;
  margin-top: 4px;
  border-radius: 50%;
}

.incomeDot {
  background: #34d399;
}

.expenseDot {
  background: #fb7185;
}

.summaryItem > div {
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-width: 0;
}

.summaryLabel {
  color: #93a4c1;
  font-size: 10px;
  line-height: 1.4;
}

.incomeValue,
.expenseValue {
  overflow-wrap: anywhere;
  font-size: 13px;
  font-weight: 750;
  letter-spacing: -0.2px;
}

.incomeValue {
  color: #34d399;
}

.expenseValue {
  color: #fb7185;
}

.emptyState {
  display: flex;
  flex: 1;
  min-height: 180px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  text-align: center;
}

.emptyIcon {
  display: grid;
  width: 42px;
  height: 42px;
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
  max-width: 280px;
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
    height: 230px;
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
    font-size: 14px;
  }

  .subtitle {
    font-size: 10px;
  }

  .chartBox {
    height: 205px;
  }

  .summary {
    gap: 8px;
  }

  .summaryLabel {
    font-size: 9px;
  }

  .incomeValue,
  .expenseValue {
    font-size: 11px;
  }
}

@media (max-width: 360px) {
  .summary {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .wrap {
    transition: none;
  }
}
</style>
```