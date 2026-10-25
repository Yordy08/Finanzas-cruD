```vue
<template>
  <div class="wrap">
    <div class="header">
      <div>
        <span class="eyebrow">DISTRIBUCIÓN FINANCIERA</span>
        <h3 class="title">Gastos por categoría</h3>
        <p class="subtitle">Descubre dónde se concentra tu dinero</p>
      </div>

      <div class="categoryCount">
        {{ grouped.labels.length }}
        <span>categorías</span>
      </div>
    </div>

    <div v-if="grouped.values.length && totalExpenses > 0" class="content">
      <div class="chartBox">
        <Doughnut :data="chartData" :options="chartOptions" />

        <div class="chartCenter">
          <span class="centerLabel">Total de gastos</span>
          <strong class="centerValue">{{ formatCompact(totalExpenses) }}</strong>
          <span class="centerCurrency">COP</span>
        </div>
      </div>

      <div class="legend">
        <div
          v-for="item in legendItems"
          :key="item.label"
          class="legendItem"
        >
          <span
            class="dot"
            :style="{ backgroundColor: item.color }"
          ></span>

          <div class="legendInfo">
            <span class="label" :title="item.label">
              {{ item.label }}
            </span>
            <div class="percentageTrack">
              <span
                class="percentageFill"
                :style="{
                  width: `${item.percentage}%`,
                  backgroundColor: item.color,
                }"
              ></span>
            </div>
          </div>

          <div class="legendNumbers">
            <span class="value">{{ formatCOP(item.amount) }}</span>
            <span class="percentage">{{ item.percentage }}%</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="emptyState">
      <div class="emptyIcon">◌</div>
      <strong>Sin gastos registrados</strong>
      <span>Los gastos por categoría aparecerán aquí cuando registres movimientos.</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Tooltip,
  ArcElement,
} from 'chart.js'

ChartJS.register(Tooltip, ArcElement)

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

const palette = [
  '#60a5fa',
  '#34d399',
  '#fb7185',
  '#fbbf24',
  '#a78bfa',
  '#22d3ee',
  '#f97316',
  '#c084fc',
]

const topN = 5

const grouped = computed(() => {
  const byCategory = new Map<string, number>()

  for (const transaction of props.transactions) {
    if (transaction.type !== 'expense') continue

    const amount = Number(transaction.amount)

    if (!Number.isFinite(amount) || amount <= 0) continue

    const category =
      transaction.category?.trim() || 'Sin categoría'

    byCategory.set(
      category,
      (byCategory.get(category) ?? 0) + amount,
    )
  }

  const sorted = Array.from(byCategory.entries())
    .sort((a, b) => b[1] - a[1])

  const top = sorted.slice(0, topN)
  const rest = sorted.slice(topN)

  const labels = top.map(([label]) => label)
  const values = top.map(([, value]) => value)

  const otherTotal = rest.reduce(
    (sum, [, value]) => sum + value,
    0,
  )

  if (otherTotal > 0) {
    labels.push('Otros')
    values.push(otherTotal)
  }

  return { labels, values }
})

const totalExpenses = computed(() =>
  grouped.value.values.reduce((sum, value) => sum + value, 0),
)

const legendItems = computed(() => {
  const total = totalExpenses.value

  return grouped.value.labels.map((label, index) => {
    const amount = grouped.value.values[index] ?? 0

    return {
      label,
      amount,
      color: palette[index % palette.length],
      percentage: total > 0
        ? Math.round((amount / total) * 100)
        : 0,
    }
  })
})

const chartData = computed(() => ({
  labels: grouped.value.labels,
  datasets: [
    {
      data: grouped.value.values,
      backgroundColor: grouped.value.labels.map(
        (_, index) => palette[index % palette.length],
      ),
      borderColor: '#111b33',
      borderWidth: 4,
      hoverOffset: 5,
      spacing: 2,
      borderRadius: 3,
    },
  ],
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  cutout: '76%',

  animation: {
    animateRotate: true,
    duration: 600,
  },

  plugins: {
    legend: {
      display: false,
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
        label: (context: { parsed: number; label: string }) => {
          const total = totalExpenses.value
          const amount = Number(context.parsed) || 0
          const percentage = total > 0
            ? ((amount / total) * 100).toFixed(1)
            : '0'

          return `${formatCOP(amount)} · ${percentage}%`
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
  width: 100%;
  min-width: 0;
  height: 100%;
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
  gap: 12px;
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

.categoryCount {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  gap: 3px;
  padding: 8px 11px;
  color: #dbeafe;
  background: rgba(96, 165, 250, 0.08);
  border: 1px solid rgba(96, 165, 250, 0.16);
  border-radius: 9px;
  font-size: 14px;
  font-weight: 800;
}

.categoryCount span {
  color: #93a4c1;
  font-size: 9px;
  font-weight: 500;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
  min-width: 0;
}

.chartBox {
  position: relative;
  width: 100%;
  max-width: 250px;
  height: 210px;
  flex-shrink: 0;
}

.chartCenter {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  max-width: 65%;
  pointer-events: none;
  text-align: center;
  transform: translate(-50%, -50%);
}

.centerLabel {
  color: #93a4c1;
  font-size: 10px;
  font-weight: 500;
}

.centerValue {
  color: #f8fafc;
  font-size: clamp(17px, 2vw, 23px);
  font-weight: 800;
  letter-spacing: -0.7px;
  overflow-wrap: anywhere;
}

.centerCurrency {
  color: #7f9ac4;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.5px;
}

.legend {
  display: grid;
  width: 100%;
  gap: 15px;
}

.legendItem {
  display: grid;
  grid-template-columns: 9px minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.legendInfo {
  display: flex;
  flex-direction: column;
  min-width: 0;
  gap: 7px;
}

.label {
  overflow: hidden;
  color: #e2e8f0;
  font-size: 11px;
  font-weight: 650;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.percentageTrack {
  height: 3px;
  overflow: hidden;
  background: rgba(148, 163, 184, 0.12);
  border-radius: 10px;
}

.percentageFill {
  display: block;
  height: 100%;
  border-radius: inherit;
  transition: width 250ms ease;
}

.legendNumbers {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.value {
  color: #f1f5f9;
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
}

.percentage {
  color: #93a4c1;
  font-size: 10px;
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
  font-size: 28px;
}

.emptyState strong {
  color: #e2e8f0;
  font-size: 13px;
}

.emptyState > span:last-child {
  max-width: 270px;
  color: #94a3b8;
  font-size: 11px;
  line-height: 1.7;
}

@media (min-width: 900px) {
  .content {
    gap: 18px;
  }

  .chartBox {
    height: 190px;
  }
}

@media (max-width: 480px) {
  .wrap {
    gap: 18px;
    padding: 16px;
    border-radius: 12px;
  }

  .title {
    font-size: 14px;
  }

  .chartBox {
    height: 185px;
  }

  .legend {
    gap: 13px;
  }

  .label {
    font-size: 10px;
  }

  .value {
    font-size: 9px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .wrap,
  .percentageFill {
    transition: none;
  }
}
</style>
```