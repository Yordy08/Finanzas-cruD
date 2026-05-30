import { defineComponent, ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderClass } from 'vue/server-renderer';
import { T as TopBar } from './TopBar-BdA_AQJs.mjs';
import { T as TransactionForm } from './TransactionForm-CynYsPvV.mjs';
import { u as useMvpUserId } from './useMvpUserId-CtE5Cm3w.mjs';
import { _ as _export_sfc } from './server.mjs';
import './nuxt-link-Dm9bEy0m.mjs';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'pinia';
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "movimientos",
  __ssrInlineRender: true,
  setup(__props) {
    const userId = useMvpUserId();
    const userIdSafe = String(userId || "").trim();
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
    const refresh = async () => {
      if (!userIdSafe) {
        accounts.value = [];
        transactions.value = [];
        return;
      }
      loading.value = true;
      try {
        const [accRes, txRes] = await Promise.all([
          $fetch(`/api/accounts`, { params: { userId: userIdSafe } }),
          $fetch(`/api/transactions`, { params: { userId: userIdSafe } })
        ]);
        accounts.value = accRes;
        transactions.value = txRes;
      } finally {
        loading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container" }, _attrs))} data-v-112cf588>`);
      _push(ssrRenderComponent(TopBar, null, null, _parent));
      _push(`<h1 class="title" data-v-112cf588>Movimientos</h1><section class="card" data-v-112cf588><h2 class="sectionTitle" data-v-112cf588>Registrar</h2>`);
      _push(ssrRenderComponent(TransactionForm, {
        onCreated: refresh,
        accounts: accounts.value || []
      }, null, _parent));
      _push(`</section><section class="card" data-v-112cf588><h2 class="sectionTitle" data-v-112cf588>Historial</h2>`);
      if (loading.value) {
        _push(`<div class="muted" data-v-112cf588>Cargando...</div>`);
      } else {
        _push(`<div class="table" data-v-112cf588><div class="thead" data-v-112cf588><div data-v-112cf588>Fecha</div><div data-v-112cf588>Tipo</div><div data-v-112cf588>Categor\xEDa</div><div class="right" data-v-112cf588>Monto</div></div><!--[-->`);
        ssrRenderList(transactions.value, (t) => {
          _push(`<div class="row" data-v-112cf588><div class="cell" data-v-112cf588>${ssrInterpolate(formatDate(t.date))}</div><div class="cell" data-v-112cf588>${ssrInterpolate(t.type === "income" ? "Ingreso" : "Gasto")}</div><div class="cell" data-v-112cf588>${ssrInterpolate(t.category)}</div><div class="${ssrRenderClass([t.type === "income" ? "pos" : "neg", "cell right"])}" data-v-112cf588>${ssrInterpolate(formatMoney(t.amount))}</div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/movimientos.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const movimientos = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-112cf588"]]);

export { movimientos as default };
//# sourceMappingURL=movimientos-DMj-f1-n.mjs.map
