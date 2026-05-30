import { defineComponent, computed, reactive, ref, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "TransactionForm",
  __ssrInlineRender: true,
  props: {
    accounts: {}
  },
  emits: ["created"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const accountsSafe = computed(() => {
      var _a;
      return (_a = props.accounts) != null ? _a : [];
    });
    const form = reactive({
      type: "expense",
      accountId: "",
      category: "",
      amount: 0,
      description: ""
    });
    const loading = ref(false);
    const error = ref(null);
    const formatMoney = (n) => {
      try {
        return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" }).format(n);
      } catch {
        return String(n);
      }
    };
    if (accountsSafe.value.length > 0 && !form.accountId) {
      form.accountId = accountsSafe.value[0].id;
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<form${ssrRenderAttrs(mergeProps({ class: "form" }, _attrs))} data-v-a3d3b7bc><div class="row" data-v-a3d3b7bc><label class="label" data-v-a3d3b7bc> Tipo <select class="input" data-v-a3d3b7bc><option value="income" data-v-a3d3b7bc${ssrIncludeBooleanAttr(Array.isArray(form.type) ? ssrLooseContain(form.type, "income") : ssrLooseEqual(form.type, "income")) ? " selected" : ""}>Ingreso</option><option value="expense" data-v-a3d3b7bc${ssrIncludeBooleanAttr(Array.isArray(form.type) ? ssrLooseContain(form.type, "expense") : ssrLooseEqual(form.type, "expense")) ? " selected" : ""}>Gasto</option></select></label><label class="label" data-v-a3d3b7bc> Cuenta <select class="input" data-v-a3d3b7bc><!--[-->`);
      ssrRenderList(accountsSafe.value, (a) => {
        _push(`<option${ssrRenderAttr("value", a.id)} data-v-a3d3b7bc${ssrIncludeBooleanAttr(Array.isArray(form.accountId) ? ssrLooseContain(form.accountId, a.id) : ssrLooseEqual(form.accountId, a.id)) ? " selected" : ""}>${ssrInterpolate(a.name)} (${ssrInterpolate(formatMoney(a.balance))}) </option>`);
      });
      _push(`<!--]--></select></label></div><div class="row" data-v-a3d3b7bc><label class="label" data-v-a3d3b7bc> Categor\xEDa <input${ssrRenderAttr("value", form.category)} class="input" placeholder="Ej: Comida" data-v-a3d3b7bc></label><label class="label" data-v-a3d3b7bc> Monto <input${ssrRenderAttr("value", form.amount)} type="number" min="0" step="0.01" class="input" data-v-a3d3b7bc></label></div><label class="label" data-v-a3d3b7bc> Descripci\xF3n (opcional) <input${ssrRenderAttr("value", form.description)} class="input" placeholder="Ej: Mercado, Taxi, etc." data-v-a3d3b7bc></label><div class="actions" data-v-a3d3b7bc><button class="btn" type="submit"${ssrIncludeBooleanAttr(loading.value || accountsSafe.value.length === 0) ? " disabled" : ""} data-v-a3d3b7bc>${ssrInterpolate(loading.value ? "Guardando..." : "Guardar")}</button></div>`);
      if (error.value) {
        _push(`<p class="error" data-v-a3d3b7bc>${ssrInterpolate(error.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</form>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TransactionForm.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const TransactionForm = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a3d3b7bc"]]);

export { TransactionForm as T };
//# sourceMappingURL=TransactionForm-CynYsPvV.mjs.map
