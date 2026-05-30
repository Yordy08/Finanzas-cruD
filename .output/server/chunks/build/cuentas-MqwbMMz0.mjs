import { defineComponent, ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { T as TopBar } from './TopBar-DKnQIHpI.mjs';
import { u as useMvpUserId } from './useMvpUserId-ynCeH7hQ.mjs';
import { _ as _export_sfc } from './server.mjs';
import './nuxt-link-B9HvlfGR.mjs';
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
import 'vuetify';
import 'vuetify/components';
import 'vuetify/directives';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "cuentas",
  __ssrInlineRender: true,
  setup(__props) {
    const userId = useMvpUserId();
    String(userId || "").trim();
    const accounts = ref([]);
    const name = ref("");
    const initialBalance = ref(0);
    const loading = ref(false);
    const error = ref(null);
    const formatMoney = (n) => {
      try {
        return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(n);
      } catch {
        return String(n);
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container" }, _attrs))} data-v-0cfac5b0>`);
      _push(ssrRenderComponent(TopBar, null, null, _parent));
      _push(`<h1 class="title" data-v-0cfac5b0>Cuentas</h1><section class="card" data-v-0cfac5b0><h2 class="sectionTitle" data-v-0cfac5b0>Crear cuenta</h2><form class="form" data-v-0cfac5b0><label class="label" data-v-0cfac5b0> Nombre <input${ssrRenderAttr("value", name.value)} class="input" placeholder="Ej: Nequi" data-v-0cfac5b0></label><label class="label" data-v-0cfac5b0> Saldo inicial (opcional) <input${ssrRenderAttr("value", initialBalance.value)} class="input" type="number" min="0" step="0.01" data-v-0cfac5b0></label><button class="btn"${ssrIncludeBooleanAttr(loading.value || !name.value.trim()) ? " disabled" : ""} type="submit" data-v-0cfac5b0>${ssrInterpolate(loading.value ? "Creando..." : "Crear")}</button></form>`);
      if (error.value) {
        _push(`<p class="error" data-v-0cfac5b0>${ssrInterpolate(error.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</section><section class="card" data-v-0cfac5b0><h2 class="sectionTitle" data-v-0cfac5b0>Tus cuentas</h2><div class="table" data-v-0cfac5b0><div class="thead" data-v-0cfac5b0><div data-v-0cfac5b0>Cuenta</div><div data-v-0cfac5b0>Saldo</div></div><!--[-->`);
      ssrRenderList(accounts.value, (a) => {
        _push(`<div class="row" data-v-0cfac5b0><div class="cell" data-v-0cfac5b0>${ssrInterpolate(a.name)}</div><div class="cell right" data-v-0cfac5b0>${ssrInterpolate(formatMoney(a.balance))}</div></div>`);
      });
      _push(`<!--]--></div></section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/cuentas.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const cuentas = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-0cfac5b0"]]);

export { cuentas as default };
//# sourceMappingURL=cuentas-MqwbMMz0.mjs.map
