import { _ as __nuxt_component_0 } from "./nuxt-link-B9HvlfGR.js";
import { defineComponent, computed, mergeProps, unref, useSSRContext, ref, withCtx, createTextVNode } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderStyle, ssrRenderClass } from "vue/server-renderer";
import { u as useMvpUserId } from "./useMvpUserId-ynCeH7hQ.js";
import { Line, Bar, Doughnut } from "vue-chartjs";
import { Chart, Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, BarElement, ArcElement } from "chart.js";
import { _ as _export_sfc } from "../server.mjs";
import { T as TransactionForm } from "./TransactionForm-CynYsPvV.js";
import "C:/Users/Yordy/Finanzas-cruD/node_modules/ufo/dist/index.mjs";
import "C:/Users/Yordy/Finanzas-cruD/node_modules/defu/dist/defu.mjs";
import "C:/Users/Yordy/Finanzas-cruD/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "C:/Users/Yordy/Finanzas-cruD/node_modules/hookable/dist/index.mjs";
import "C:/Users/Yordy/Finanzas-cruD/node_modules/unctx/dist/index.mjs";
import "C:/Users/Yordy/Finanzas-cruD/node_modules/h3/dist/index.mjs";
import "pinia";
import "vue-router";
import "C:/Users/Yordy/Finanzas-cruD/node_modules/klona/dist/index.mjs";
import "vuetify";
import "vuetify/components";
import "vuetify/directives";
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "BalanceLineChart",
  __ssrInlineRender: true,
  props: {
    transactions: {}
  },
  setup(__props) {
    Chart.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale);
    const props = __props;
    const formatCOP = (n) => {
      try {
        return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(n);
      } catch {
        return String(n);
      }
    };
    const series = computed(() => {
      const byMonth = /* @__PURE__ */ new Map();
      for (const t of props.transactions) {
        const d = new Date(t.date);
        if (Number.isNaN(d.getTime())) continue;
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        const cur = byMonth.get(key) ?? { income: 0, expense: 0 };
        if (t.type === "income") cur.income += t.amount;
        else cur.expense += t.amount;
        byMonth.set(key, cur);
      }
      const keys = Array.from(byMonth.keys()).sort((a, b) => {
        return a.localeCompare(b);
      });
      const lastKeys = keys.slice(Math.max(0, keys.length - 12));
      let acc = 0;
      const labels = [];
      const data = [];
      for (const key of lastKeys) {
        const [yStr, mStr] = key.split("-");
        const y = Number(yStr);
        const m = Number(mStr);
        const neto = (byMonth.get(key)?.income ?? 0) - (byMonth.get(key)?.expense ?? 0);
        acc += neto;
        const monthLabel = new Date(y, m - 1, 1).toLocaleDateString("es-CO", { month: "short", year: "2-digit" });
        labels.push(monthLabel);
        data.push(acc);
      }
      return { labels, data };
    });
    const chartData = computed(() => {
      return {
        labels: series.value.labels,
        datasets: [
          {
            label: "Saldo acumulado",
            data: series.value.data,
            borderColor: "#60a5fa",
            backgroundColor: "rgba(96,165,250,.15)",
            fill: true,
            tension: 0.35,
            pointRadius: 3,
            pointHoverRadius: 5
          }
        ]
      };
    });
    const chartOptions = computed(() => {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => formatCOP(Number(ctx.parsed.y ?? 0))
            }
          }
        },
        scales: {
          x: {
            grid: { color: "rgba(255,255,255,.08)" },
            ticks: { color: "rgba(255,255,255,.75)" }
          },
          y: {
            grid: { color: "rgba(255,255,255,.08)" },
            ticks: {
              color: "rgba(255,255,255,.75)",
              callback: (v) => {
                const n = Number(v);
                if (!Number.isFinite(n)) return v;
                return new Intl.NumberFormat("es-CO", { notation: "compact", maximumFractionDigits: 2 }).format(n);
              }
            }
          }
        }
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "wrap" }, _attrs))} data-v-4277d579><div class="header" data-v-4277d579><h3 class="title" data-v-4277d579>Evolución del saldo</h3><div class="meta" data-v-4277d579>Últimos ${ssrInterpolate(series.value.labels.length)} meses</div></div><div class="chartBox" data-v-4277d579>`);
      _push(ssrRenderComponent(unref(Line), {
        data: chartData.value,
        options: chartOptions.value
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/charts/BalanceLineChart.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const BalanceLineChart = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-4277d579"]]);
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "IncomeExpenseChart",
  __ssrInlineRender: true,
  props: {
    transactions: {}
  },
  setup(__props) {
    Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
    const props = __props;
    const formatCOP = (n) => {
      try {
        return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(n);
      } catch {
        return String(n);
      }
    };
    const series = computed(() => {
      const byMonth = /* @__PURE__ */ new Map();
      for (const t of props.transactions) {
        const d = new Date(t.date);
        if (Number.isNaN(d.getTime())) continue;
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        const cur = byMonth.get(key) ?? { income: 0, expense: 0 };
        if (t.type === "income") cur.income += t.amount;
        else cur.expense += t.amount;
        byMonth.set(key, cur);
      }
      const keys = Array.from(byMonth.keys()).sort((a, b) => a.localeCompare(b));
      const lastKeys = keys.slice(Math.max(0, keys.length - 12));
      const labels = [];
      const income = [];
      const expense = [];
      for (const key of lastKeys) {
        const [yStr, mStr] = key.split("-");
        const y = Number(yStr);
        const m = Number(mStr);
        const monthLabel = new Date(y, m - 1, 1).toLocaleDateString("es-CO", { month: "short", year: "2-digit" });
        labels.push(monthLabel);
        income.push(byMonth.get(key)?.income ?? 0);
        expense.push(byMonth.get(key)?.expense ?? 0);
      }
      return { labels, income, expense };
    });
    const chartData = computed(() => {
      return {
        labels: series.value.labels,
        datasets: [
          {
            label: "Ingresos",
            data: series.value.income,
            backgroundColor: "rgba(52,211,153,.35)",
            borderColor: "rgba(52,211,153,1)",
            borderWidth: 1,
            borderRadius: 8
          },
          {
            label: "Gastos",
            data: series.value.expense,
            backgroundColor: "rgba(251,113,133,.35)",
            borderColor: "rgba(251,113,133,1)",
            borderWidth: 1,
            borderRadius: 8
          }
        ]
      };
    });
    const chartOptions = computed(() => {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: "rgba(255,255,255,.85)" } },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const v = Number(ctx.parsed.y ?? 0);
                return `${ctx.dataset.label}: ${formatCOP(v)}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: { color: "rgba(255,255,255,.08)" },
            ticks: { color: "rgba(255,255,255,.75)" }
          },
          y: {
            grid: { color: "rgba(255,255,255,.08)" },
            ticks: {
              color: "rgba(255,255,255,.75)",
              callback: (v) => {
                const n = Number(v);
                if (!Number.isFinite(n)) return v;
                return new Intl.NumberFormat("es-CO", { notation: "compact", maximumFractionDigits: 2 }).format(n);
              }
            }
          }
        }
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "wrap" }, _attrs))} data-v-e30bd19f><div class="header" data-v-e30bd19f><h3 class="title" data-v-e30bd19f>Ingresos vs Gastos</h3></div><div class="chartBox" data-v-e30bd19f>`);
      _push(ssrRenderComponent(unref(Bar), {
        data: chartData.value,
        options: chartOptions.value
      }, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/charts/IncomeExpenseChart.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const IncomeExpenseChart = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-e30bd19f"]]);
const topN = 6;
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "CategoryDonutChart",
  __ssrInlineRender: true,
  props: {
    transactions: {}
  },
  setup(__props) {
    Chart.register(Title, Tooltip, Legend, ArcElement);
    const props = __props;
    const formatCOP = (n) => {
      try {
        return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(n);
      } catch {
        return String(n);
      }
    };
    const palette = [
      "#60a5fa",
      // blue
      "#34d399",
      // green
      "#fb7185",
      // red
      "#fbbf24",
      // amber
      "#a78bfa",
      // violet
      "#22c55e",
      "#ef4444",
      "#3b82f6"
    ];
    const grouped = computed(() => {
      const expenses = props.transactions.filter((t) => t.type === "expense");
      const byCat = /* @__PURE__ */ new Map();
      for (const t of expenses) {
        const key = (t.category || "Sin categoría").trim();
        byCat.set(key, (byCat.get(key) ?? 0) + t.amount);
      }
      const sorted = Array.from(byCat.entries()).sort((a, b) => b[1] - a[1]);
      const top = sorted.slice(0, topN);
      const rest = sorted.slice(topN);
      const labels = [];
      const values = [];
      for (const [label, value] of top) {
        labels.push(label);
        values.push(value);
      }
      const restSum = rest.reduce((acc, [, v]) => acc + v, 0);
      if (restSum > 0) {
        labels.push("Otros");
        values.push(restSum);
      }
      return { labels, values };
    });
    const legendItems = computed(() => {
      const total = grouped.value.values.reduce((a, b) => a + b, 0);
      return grouped.value.labels.map((label, idx) => {
        const value = grouped.value.values[idx] ?? 0;
        const pct = total > 0 ? Math.round(value / total * 100) : 0;
        return {
          label,
          color: palette[idx % palette.length],
          value: `${formatCOP(value)} (${pct}%)`
        };
      });
    });
    const chartData = computed(() => {
      return {
        labels: grouped.value.labels,
        datasets: [
          {
            data: grouped.value.values,
            backgroundColor: grouped.value.labels.map((_, idx) => palette[idx % palette.length]),
            borderColor: "rgba(0,0,0,.25)",
            borderWidth: 1,
            hoverOffset: 8
          }
        ]
      };
    });
    const chartOptions = computed(() => {
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (ctx) => {
                const value = Number(ctx.parsed ?? 0);
                const label = ctx.label ?? "";
                return `${label}: ${formatCOP(value)}`;
              }
            }
          }
        },
        cutout: "62%"
      };
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "wrap" }, _attrs))} data-v-0cdf8b55><div class="header" data-v-0cdf8b55><h3 class="title" data-v-0cdf8b55>Gastos por categoría</h3></div><div class="chartBox" data-v-0cdf8b55>`);
      _push(ssrRenderComponent(unref(Doughnut), {
        data: chartData.value,
        options: chartOptions.value
      }, null, _parent));
      _push(`</div>`);
      if (legendItems.value.length) {
        _push(`<div class="legend" data-v-0cdf8b55><!--[-->`);
        ssrRenderList(legendItems.value, (it) => {
          _push(`<div class="legendItem" data-v-0cdf8b55><span class="dot" style="${ssrRenderStyle({ background: it.color })}" data-v-0cdf8b55></span><span class="label" data-v-0cdf8b55>${ssrInterpolate(it.label)}</span><span class="value" data-v-0cdf8b55>${ssrInterpolate(it.value)}</span></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/charts/CategoryDonutChart.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const CategoryDonutChart = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-0cdf8b55"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    const userId = useMvpUserId();
    const userIdSafe = computed(() => String(userId || "").trim());
    const userIdResolved = computed(() => userIdSafe.value);
    const accounts = ref([]);
    const transactions = ref([]);
    const loading = ref(false);
    const formatMoney = (n) => {
      try {
        return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(n);
      } catch {
        return String(n);
      }
    };
    const formatDate = (d) => {
      try {
        return new Date(d).toLocaleDateString("es-CO");
      } catch {
        return d;
      }
    };
    const moneyToday = computed(() => {
      return accounts.value.reduce((acc, a) => acc + (a.balance ?? 0), 0);
    });
    const monthIncome = computed(() => {
      const now = /* @__PURE__ */ new Date();
      const y = now.getFullYear();
      const m = now.getMonth();
      return transactions.value.filter((t) => {
        const d = new Date(t.date);
        return d.getFullYear() === y && d.getMonth() === m && t.type === "income";
      }).reduce((acc, t) => acc + t.amount, 0);
    });
    const monthExpense = computed(() => {
      const now = /* @__PURE__ */ new Date();
      const y = now.getFullYear();
      const m = now.getMonth();
      return transactions.value.filter((t) => {
        const d = new Date(t.date);
        return d.getFullYear() === y && d.getMonth() === m && t.type === "expense";
      }).reduce((acc, t) => acc + t.amount, 0);
    });
    const monthSavings = computed(() => {
      return monthIncome.value - monthExpense.value;
    });
    const expensePercent = computed(() => {
      if (!monthIncome.value) return 0;
      return Math.round(monthExpense.value / monthIncome.value * 100);
    });
    const lastMovements = computed(() => {
      const sorted = [...transactions.value].sort((a, b) => {
        const da = new Date(a.date).getTime();
        const db = new Date(b.date).getTime();
        return db - da;
      });
      return sorted.slice(0, 5);
    });
    const refreshAll = async () => {
      if (!userIdResolved.value) {
        throw new Error("Falta configurar MVP_USER_ID (ObjectId) en runtimeConfig.public.MVP_USER_ID");
      }
      loading.value = true;
      try {
        const [accRes, txRes] = await Promise.all([
          $fetch(`/api/accounts`, { params: { userId: userIdResolved.value } }),
          $fetch(`/api/transactions`, { params: { userId: userIdResolved.value } })
        ]);
        accounts.value = accRes;
        transactions.value = txRes;
      } finally {
        loading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "page" }, _attrs))} data-v-bf91f0eb><header class="header" data-v-bf91f0eb><div data-v-bf91f0eb><h1 class="title" data-v-bf91f0eb>Dashboard</h1><p class="subtitle" data-v-bf91f0eb>Panel financiero estilo SaaS</p></div><nav class="nav" data-v-bf91f0eb>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "navLink",
        to: "/movimientos"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Movimientos`);
          } else {
            return [
              createTextVNode("Movimientos")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "navLink",
        to: "/cuentas"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Cuentas`);
          } else {
            return [
              createTextVNode("Cuentas")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</nav></header><section class="kpiGrid" data-v-bf91f0eb><div class="kpi card" data-v-bf91f0eb><div class="cardLabel" data-v-bf91f0eb>Saldo actual</div><div class="cardValue kpiGreen" data-v-bf91f0eb>${ssrInterpolate(formatMoney(moneyToday.value))}</div></div><div class="kpi card" data-v-bf91f0eb><div class="cardLabel" data-v-bf91f0eb>Ingresos del mes</div><div class="cardValue kpiGreenLight" data-v-bf91f0eb>${ssrInterpolate(formatMoney(monthIncome.value))}</div></div><div class="kpi card" data-v-bf91f0eb><div class="cardLabel" data-v-bf91f0eb>Gastos del mes</div><div class="cardValue kpiRed" data-v-bf91f0eb>${ssrInterpolate(formatMoney(monthExpense.value))}</div></div><div class="kpi card" data-v-bf91f0eb><div class="cardLabel" data-v-bf91f0eb>Ahorro del mes</div><div class="cardValue kpiBlue" data-v-bf91f0eb>${ssrInterpolate(formatMoney(monthSavings.value))}</div></div>`);
      if (monthIncome.value > 0) {
        _push(`<div class="kpiHint card" data-v-bf91f0eb><div class="hintLine" data-v-bf91f0eb> Gastos representan <b data-v-bf91f0eb>${ssrInterpolate(expensePercent.value)}%</b> de los ingresos del mes. </div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section><section class="rowCharts" data-v-bf91f0eb><div class="card chartCard" data-v-bf91f0eb>`);
      _push(ssrRenderComponent(BalanceLineChart, { transactions: transactions.value }, null, _parent));
      _push(`</div><div class="chartCol" data-v-bf91f0eb><div class="card chartCard" data-v-bf91f0eb>`);
      _push(ssrRenderComponent(CategoryDonutChart, { transactions: transactions.value }, null, _parent));
      _push(`</div><div class="card chartCard" data-v-bf91f0eb>`);
      _push(ssrRenderComponent(IncomeExpenseChart, { transactions: transactions.value }, null, _parent));
      _push(`</div></div></section><section class="rowBottom" data-v-bf91f0eb><div class="card" data-v-bf91f0eb><div class="cardHeader" data-v-bf91f0eb><h2 class="sectionTitle" data-v-bf91f0eb>Últimos movimientos</h2><div class="muted" data-v-bf91f0eb>${ssrInterpolate(lastMovements.value.length)}/5</div></div>`);
      if (loading.value) {
        _push(`<div class="muted" data-v-bf91f0eb>Cargando...</div>`);
      } else {
        _push(`<div class="table" data-v-bf91f0eb><div class="thead" data-v-bf91f0eb><div data-v-bf91f0eb>Tipo</div><div data-v-bf91f0eb>Categoría</div><div class="right" data-v-bf91f0eb>Monto</div><div class="right" data-v-bf91f0eb>Fecha</div></div><!--[-->`);
        ssrRenderList(lastMovements.value, (t) => {
          _push(`<div class="row" data-v-bf91f0eb><div class="cell" data-v-bf91f0eb><span class="${ssrRenderClass(t.type === "income" ? "pos" : "neg")}" data-v-bf91f0eb>${ssrInterpolate(t.type === "income" ? "Ingreso" : "Gasto")}</span></div><div class="cell" data-v-bf91f0eb>${ssrInterpolate(t.category)}</div><div class="${ssrRenderClass([t.type === "income" ? "pos" : "neg", "cell right"])}" data-v-bf91f0eb>${ssrInterpolate(formatMoney(t.amount))}</div><div class="cell right" data-v-bf91f0eb>${ssrInterpolate(formatDate(t.date))}</div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div><div class="card" data-v-bf91f0eb><h2 class="sectionTitle" data-v-bf91f0eb>Registrar movimiento</h2>`);
      _push(ssrRenderComponent(TransactionForm, {
        onCreated: refreshAll,
        accounts: accounts.value
      }, null, _parent));
      _push(`</div></section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-bf91f0eb"]]);
export {
  index as default
};
//# sourceMappingURL=index-Dy0-sLxo.js.map
