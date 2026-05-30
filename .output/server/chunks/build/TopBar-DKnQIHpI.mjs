import { _ as __nuxt_component_0 } from './nuxt-link-B9HvlfGR.mjs';
import { mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc } from './server.mjs';

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLink = __nuxt_component_0;
  _push(`<header${ssrRenderAttrs(mergeProps({ class: "top" }, _attrs))} data-v-eadb36db>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    class: "brand",
    to: "/"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Finanzas`);
      } else {
        return [
          createTextVNode("Finanzas")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<div class="links" data-v-eadb36db>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    class: "link",
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
    class: "link",
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
  _push(`</div></header>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TopBar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const TopBar = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-eadb36db"]]);

export { TopBar as T };
//# sourceMappingURL=TopBar-DKnQIHpI.mjs.map
