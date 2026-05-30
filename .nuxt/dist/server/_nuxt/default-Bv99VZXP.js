import { h, capitalize, camelize, defineComponent, provide, shallowReactive, ref, inject, Suspense, Fragment, computed, mergeProps, withCtx, createVNode, toDisplayString, useSSRContext, toRef, isRef, toValue, createElementVNode, normalizeClass, normalizeStyle, useId, watch, reactive, unref, toRefs, shallowRef, Text, watchEffect, resolveDynamicComponent, nextTick, withDirectives, TransitionGroup, Transition, toRaw, readonly, vShow, onScopeDispose, createTextVNode, openBlock, createBlock, renderList } from "vue";
import { RouterView, useRoute as useRoute$1 } from "vue-router";
import { u as includes, o as genericComponent, z as makeComponentProps, y as isPrimitive, a as PageRouteSymbol, W as useNuxtApp, L as LayoutMetaSymbol, a1 as useRuntimeConfig, _ as _export_sfc, q as getCurrentInstanceName, M as propsFactory, i as destructComputed, v as isCssColor, x as isParsableColor, J as parseColor, t as hasLightForeground, C as makeThemeProps, O as provideTheme, N as provideDefaults, Y as useRender, p as getCurrentInstance, X as useProxiedModel, a4 as wrapInArray, l as findChildrenWithProvide, d as consoleWarn, e as convertToUnit, a2 as useTheme, T as useIcon, m as flattenFragments, I as IconValue, Z as useResizeObserver, c as clamp, P as PREFERS_REDUCED_MOTION, a0 as useRtl, s as hasEvent, w as isObject, b as consoleError, H as onlyDefinedProps, g as defineComponent$1, V as useLocale, K as pickWithRest, k as filterInputAttrs, E as EventProp, h as deprecate, n as focusChild, r as getPropertyFromItem, G as omit, a3 as useToggleScope, f as defer, S as useDisplay, U as useLayoutItem, B as makeLayoutItemProps, A as makeDisplayProps } from "../server.mjs";
import "C:/Users/Yordy/Finanzas-cruD/node_modules/defu/dist/defu.mjs";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderVNode, ssrRenderStyle } from "vue/server-renderer";
import { _ as __nuxt_component_0$1 } from "./nuxt-link-Dm9bEy0m.js";
import { publicAssetsURL } from "#internal/nuxt/paths";
import "C:/Users/Yordy/Finanzas-cruD/node_modules/ofetch/dist/node.mjs";
import "C:/Users/Yordy/Finanzas-cruD/node_modules/hookable/dist/index.mjs";
import "C:/Users/Yordy/Finanzas-cruD/node_modules/unctx/dist/index.mjs";
import "C:/Users/Yordy/Finanzas-cruD/node_modules/h3/dist/index.mjs";
import "pinia";
import "C:/Users/Yordy/Finanzas-cruD/node_modules/ufo/dist/index.mjs";
import "C:/Users/Yordy/Finanzas-cruD/node_modules/klona/dist/index.mjs";
const block = ["top", "bottom"];
const inline = ["start", "end", "left", "right"];
function parseAnchor(anchor, isRtl) {
  let [side, align] = anchor.split(" ");
  if (!align) {
    align = includes(block, side) ? "start" : includes(inline, side) ? "top" : "center";
  }
  return {
    side: toPhysical(side, isRtl),
    align: toPhysical(align, isRtl)
  };
}
function toPhysical(str, isRtl) {
  if (str === "start") return isRtl ? "right" : "left";
  if (str === "end") return isRtl ? "left" : "right";
  return str;
}
class Box {
  constructor(args) {
    const pageScale = (void 0).body.currentCSSZoom ?? 1;
    const isElement = args instanceof Element;
    const factor = isElement ? 1 + (1 - pageScale) / pageScale : 1;
    const {
      x,
      y,
      width,
      height
    } = isElement ? args.getBoundingClientRect() : args;
    this.x = x * factor;
    this.y = y * factor;
    this.width = width * factor;
    this.height = height * factor;
  }
  get top() {
    return this.y;
  }
  get bottom() {
    return this.y + this.height;
  }
  get left() {
    return this.x;
  }
  get right() {
    return this.x + this.width;
  }
}
function getTargetBox(target) {
  if (Array.isArray(target)) {
    const pageScale = (void 0).body.currentCSSZoom ?? 1;
    const factor = 1 + (1 - pageScale) / pageScale;
    return new Box({
      x: target[0] * factor,
      y: target[1] * factor,
      width: 0 * factor,
      height: 0 * factor
    });
  } else {
    return new Box(target);
  }
}
function createSimpleFunctional(klass, tag = "div", name) {
  return genericComponent()({
    name: capitalize(camelize(klass.replace(/__/g, "-"))),
    props: {
      tag: {
        type: String,
        default: tag
      },
      ...makeComponentProps()
    },
    setup(props, {
      slots
    }) {
      return () => {
        return h(props.tag, {
          class: [klass, props.class],
          style: props.style
        }, slots.default?.());
      };
    }
  });
}
function updateRecursionCache(a, b, cache, result) {
  if (!cache || isPrimitive(a) || isPrimitive(b)) return;
  const visitedObject = cache.get(a);
  if (visitedObject) {
    visitedObject.set(b, result);
  } else {
    const newCacheItem = /* @__PURE__ */ new WeakMap();
    newCacheItem.set(b, result);
    cache.set(a, newCacheItem);
  }
}
function findCachedComparison(a, b, cache) {
  if (!cache || isPrimitive(a) || isPrimitive(b)) return null;
  const r1 = cache.get(a)?.get(b);
  if (typeof r1 === "boolean") return r1;
  const r2 = cache.get(b)?.get(a);
  if (typeof r2 === "boolean") return r2;
  return null;
}
function deepEqual(a, b, recursionCache = /* @__PURE__ */ new WeakMap()) {
  if (a === b) return true;
  if (a instanceof Date && b instanceof Date && a.getTime() !== b.getTime()) {
    return false;
  }
  if (a !== Object(a) || b !== Object(b)) {
    return false;
  }
  const props = Object.keys(a);
  if (props.length !== Object.keys(b).length) {
    return false;
  }
  const cachedComparisonResult = findCachedComparison(a, b, recursionCache);
  if (cachedComparisonResult) {
    return cachedComparisonResult;
  }
  updateRecursionCache(a, b, recursionCache, true);
  return props.every((p) => deepEqual(a[p], b[p], recursionCache));
}
function throttle(fn, delay, options = {
  leading: true,
  trailing: true
}) {
  let timeoutId = 0;
  let lastExec = 0;
  let throttling = false;
  let start = 0;
  function clear() {
    clearTimeout(timeoutId);
    throttling = false;
    start = 0;
  }
  const wrap = (...args) => {
    clearTimeout(timeoutId);
    const now = Date.now();
    if (!start) start = now;
    const elapsed = now - Math.max(start, lastExec);
    function invoke() {
      lastExec = Date.now();
      timeoutId = setTimeout(clear, delay);
      fn(...args);
    }
    if (!throttling) {
      throttling = true;
      if (options.leading) {
        invoke();
      }
    } else if (elapsed >= delay) {
      invoke();
    } else if (options.trailing) {
      timeoutId = setTimeout(invoke, delay - elapsed);
    }
  };
  wrap.clear = clear;
  wrap.immediate = fn;
  return wrap;
}
const defineRouteProvider = (name = "RouteProvider") => defineComponent({
  name,
  props: {
    route: {
      type: Object,
      required: true
    },
    vnode: Object,
    vnodeRef: Object,
    renderKey: String,
    trackRootNodes: Boolean
  },
  setup(props) {
    const previousKey = props.renderKey;
    const previousRoute = props.route;
    const route = {};
    for (const key in props.route) {
      Object.defineProperty(route, key, {
        get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key],
        enumerable: true
      });
    }
    provide(PageRouteSymbol, shallowReactive(route));
    return () => {
      if (!props.vnode) {
        return props.vnode;
      }
      return h(props.vnode, { ref: props.vnodeRef });
    };
  }
});
const RouteProvider = defineRouteProvider();
const __nuxt_component_0 = defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs, slots, expose }) {
    const nuxtApp = useNuxtApp();
    const pageRef = ref();
    inject(PageRouteSymbol, null);
    expose({ pageRef });
    inject(LayoutMetaSymbol, null);
    nuxtApp.deferHydration();
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          return h(Suspense, { suspensible: true }, {
            default() {
              return h(RouteProvider, {
                vnode: slots.default ? normalizeSlot(slots.default, routeProps) : routeProps.Component,
                route: routeProps.route,
                vnodeRef: pageRef
              });
            }
          });
        }
      });
    };
  }
});
function normalizeSlot(slot, data) {
  const slotContent = slot(data);
  return slotContent.length === 1 ? h(slotContent[0]) : h(Fragment, void 0, slotContent);
}
const _imports_0 = publicAssetsURL("/logo.svg");
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "AppNavbar",
  __ssrInlineRender: true,
  setup(__props) {
    const appName = computed(() => {
      return useRuntimeConfig().public?.appName || "Finanzas CRUD";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "navbar" }, _attrs))} data-v-e5a0364d><div class="left" data-v-e5a0364d>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "brand",
        to: "/"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img class="brandIcon"${ssrRenderAttr("src", _imports_0)} alt="Logo" data-v-e5a0364d${_scopeId}><span class="brandText" data-v-e5a0364d${_scopeId}>${ssrInterpolate(appName.value)}</span>`);
          } else {
            return [
              createVNode("img", {
                class: "brandIcon",
                src: _imports_0,
                alt: "Logo"
              }),
              createVNode("span", { class: "brandText" }, toDisplayString(appName.value), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="right" data-v-e5a0364d><button class="iconBtn" type="button" aria-label="Notificaciones (placeholder)" data-v-e5a0364d><span class="dot" data-v-e5a0364d></span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" data-v-e5a0364d><path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Zm7-6V11a7 7 0 1 0-14 0v5l-2 2v1h18v-1l-2-2Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" data-v-e5a0364d></path></svg></button><div class="profile" data-v-e5a0364d><div class="avatar" aria-hidden="true" data-v-e5a0364d></div><span class="profileText" data-v-e5a0364d>Perfil</span></div></div></header>`);
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppNavbar.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const AppNavbar = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-e5a0364d"]]);
const _sfc_main$7 = {};
function _sfc_ssrRender$4(_ctx, _push, _parent, _attrs) {
  _push(`<svg${ssrRenderAttrs(mergeProps({
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": "true"
  }, _attrs))}><path d="M4 13h6V4H4v9Zm10 7h6V11h-6v9ZM4 20h6v-5H4v5Zm10-9h6V4h-6v7Z" fill="currentColor"></path></svg>`);
}
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/icons/IconDashboard.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const IconDashboard = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["ssrRender", _sfc_ssrRender$4]]);
const _sfc_main$6 = {};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs) {
  _push(`<svg${ssrRenderAttrs(mergeProps({
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": "true"
  }, _attrs))}><path d="M7 7h10M7 12h10M7 17h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path><path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z" stroke="currentColor" stroke-width="1.6" opacity="0.6"></path></svg>`);
}
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/icons/IconMovimientos.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const IconMovimientos = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["ssrRender", _sfc_ssrRender$3]]);
const _sfc_main$5 = {};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs) {
  _push(`<svg${ssrRenderAttrs(mergeProps({
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": "true"
  }, _attrs))}><path d="M4 7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V7Z" stroke="currentColor" stroke-width="1.8"></path><path d="M8 11h8M8 15h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg>`);
}
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/icons/IconCuentas.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const IconCuentas = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["ssrRender", _sfc_ssrRender$2]]);
const _sfc_main$4 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  _push(`<svg${ssrRenderAttrs(mergeProps({
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": "true"
  }, _attrs))}><path d="M5 4h14a2 2 0 0 1 2 2v15a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4Z" stroke="currentColor" stroke-width="1.8"></path><path d="M8 9h8M8 13h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path></svg>`);
}
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/icons/IconReportes.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const IconReportes = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["ssrRender", _sfc_ssrRender$1]]);
const _sfc_main$3 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<svg${ssrRenderAttrs(mergeProps({
    width: "20",
    height: "20",
    viewBox: "0 0 24 24",
    fill: "none",
    "aria-hidden": "true"
  }, _attrs))}><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="currentColor" stroke-width="2"></path><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.03.03a2 2 0 0 1-1.41 3.41 2 2 0 0 1-1.41-.58l-.03-.03a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.04 1.53V21a2 2 0 0 1-4 0v-.07a1.7 1.7 0 0 0-1.04-1.53 1.7 1.7 0 0 0-1.87.34l-.03.03a2 2 0 1 1-2.82-2.82l.03-.03A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.53-1.04H3a2 2 0 0 1 0-4h.07A1.7 1.7 0 0 0 4.6 8.92a1.7 1.7 0 0 0-.34-1.87l-.03-.03A2 2 0 1 1 7.05 4.2l.03.03a1.7 1.7 0 0 0 1.87.34 1.7 1.7 0 0 0 1.04-1.53V3a2 2 0 0 1 4 0v.07a1.7 1.7 0 0 0 1.04 1.53 1.7 1.7 0 0 0 1.87-.34l.03-.03A2 2 0 1 1 21 5.15l-.03.03a1.7 1.7 0 0 0-.34 1.87 1.7 1.7 0 0 0 1.53 1.04H21a2 2 0 0 1 0 4h-.07a1.7 1.7 0 0 0-1.53 1.04Z" stroke="currentColor" stroke-width="1.2" opacity="0.5"></path></svg>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/icons/IconConfiguracion.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const IconConfiguracion = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender]]);
const makeBorderProps = propsFactory({
  border: [Boolean, Number, String]
}, "border");
function useBorder(props, name = getCurrentInstanceName()) {
  const borderClasses = computed(() => {
    const border = props.border;
    if (border === true || border === "") {
      return `${name}--border`;
    } else if (typeof border === "string" || border === 0) {
      return String(border).split(" ").map((v) => `border-${v}`);
    }
    return [];
  });
  return {
    borderClasses
  };
}
const allowedDensities = [null, "default", "comfortable", "compact"];
const makeDensityProps = propsFactory({
  density: {
    type: String,
    default: "default",
    validator: (v) => allowedDensities.includes(v)
  }
}, "density");
function useDensity(props, name = getCurrentInstanceName()) {
  const densityClasses = toRef(() => {
    return `${name}--density-${props.density}`;
  });
  return {
    densityClasses
  };
}
const makeElevationProps = propsFactory({
  elevation: {
    type: [Number, String],
    // no limit to allow both 0-6 (MD3) and legacy 0-24 (MD2)
    validator: (value) => parseInt(value) >= 0
  }
}, "elevation");
function useElevation(props) {
  const elevationClasses = toRef(() => {
    const elevation = isRef(props) ? props.value : props.elevation;
    if (elevation == null) return [];
    return [`elevation-${parseInt(elevation)}`];
  });
  return {
    elevationClasses
  };
}
const makeRoundedProps = propsFactory({
  rounded: {
    type: [Boolean, Number, String],
    default: void 0
  },
  tile: Boolean
}, "rounded");
function useRounded(props, name = getCurrentInstanceName()) {
  const roundedClasses = computed(() => {
    const rounded = isRef(props) ? props.value : props.rounded;
    const tile = isRef(props) ? false : props.tile;
    const classes = [];
    if (tile || rounded === false) {
      classes.push("rounded-0");
    } else if (rounded === true || rounded === "") {
      classes.push(`${name}--rounded`);
    } else if (typeof rounded === "string" || rounded === 0) {
      for (const value of String(rounded).split(" ")) {
        classes.push(`rounded-${value}`);
      }
    }
    return classes;
  });
  return {
    roundedClasses
  };
}
const makeTagProps = propsFactory({
  tag: {
    type: [String, Object, Function],
    default: "div"
  }
}, "tag");
function useColor(colors) {
  return destructComputed(() => {
    const {
      class: colorClasses,
      style: colorStyles
    } = computeColor(colors);
    return {
      colorClasses,
      colorStyles
    };
  });
}
function useTextColor(color) {
  const {
    colorClasses: textColorClasses,
    colorStyles: textColorStyles
  } = useColor(() => ({
    text: toValue(color)
  }));
  return {
    textColorClasses,
    textColorStyles
  };
}
function useBackgroundColor(color) {
  const {
    colorClasses: backgroundColorClasses,
    colorStyles: backgroundColorStyles
  } = useColor(() => ({
    background: toValue(color)
  }));
  return {
    backgroundColorClasses,
    backgroundColorStyles
  };
}
function normalizeColors(colors) {
  return {
    text: typeof colors.text === "string" ? colors.text.replace(/^text-/, "") : colors.text,
    background: typeof colors.background === "string" ? colors.background.replace(/^bg-/, "") : colors.background
  };
}
function computeColor(colors) {
  const _colors = normalizeColors(toValue(colors));
  const classes = [];
  const styles = {};
  if (_colors.background) {
    if (isCssColor(_colors.background)) {
      styles.backgroundColor = _colors.background;
      if (!_colors.text && isParsableColor(_colors.background)) {
        const backgroundColor = parseColor(_colors.background);
        if (backgroundColor.a == null || backgroundColor.a === 1) {
          classes.push(hasLightForeground(backgroundColor) ? "v-theme-on-dark" : "v-theme-on-light");
        }
      }
    } else {
      classes.push(`bg-${_colors.background}`);
    }
  }
  if (_colors.text) {
    if (isCssColor(_colors.text)) {
      styles.color = _colors.text;
      styles.caretColor = _colors.text;
    } else {
      classes.push(`text-${_colors.text}`);
    }
  }
  return {
    class: classes,
    style: styles
  };
}
const allowedVariants$1 = ["elevated", "flat", "tonal", "outlined", "text", "plain"];
function genOverlays(isClickable, name) {
  return createElementVNode(Fragment, null, [isClickable && createElementVNode("span", {
    "key": "overlay",
    "class": normalizeClass(`${name}__overlay`)
  }, null), createElementVNode("span", {
    "key": "underlay",
    "class": normalizeClass(`${name}__underlay`)
  }, null)]);
}
const makeVariantProps = propsFactory({
  color: String,
  variant: {
    type: String,
    default: "elevated",
    validator: (v) => allowedVariants$1.includes(v)
  }
}, "variant");
function useVariant(props, name = getCurrentInstanceName()) {
  const variantClasses = toRef(() => {
    const {
      variant
    } = toValue(props);
    return `${name}--variant-${variant}`;
  });
  const {
    colorClasses,
    colorStyles
  } = useColor(() => {
    const {
      variant,
      color
    } = toValue(props);
    return {
      [["elevated", "flat"].includes(variant) ? "background" : "text"]: color
    };
  });
  return {
    colorClasses,
    colorStyles,
    variantClasses
  };
}
const makeVBtnGroupProps = propsFactory({
  baseColor: String,
  divided: Boolean,
  direction: {
    type: String,
    default: "horizontal"
  },
  ...makeBorderProps(),
  ...makeComponentProps(),
  ...makeDensityProps(),
  ...makeElevationProps(),
  ...makeRoundedProps(),
  ...makeTagProps(),
  ...makeThemeProps(),
  ...makeVariantProps()
}, "VBtnGroup");
const VBtnGroup = genericComponent()({
  name: "VBtnGroup",
  props: makeVBtnGroupProps(),
  setup(props, {
    slots
  }) {
    const {
      themeClasses
    } = provideTheme(props);
    const {
      densityClasses
    } = useDensity(props);
    const {
      borderClasses
    } = useBorder(props);
    const {
      elevationClasses
    } = useElevation(props);
    const {
      roundedClasses
    } = useRounded(props);
    provideDefaults({
      VBtn: {
        height: toRef(() => props.direction === "horizontal" ? "auto" : null),
        baseColor: toRef(() => props.baseColor),
        color: toRef(() => props.color),
        density: toRef(() => props.density),
        flat: true,
        variant: toRef(() => props.variant)
      }
    });
    useRender(() => {
      return createVNode(props.tag, {
        "class": normalizeClass(["v-btn-group", `v-btn-group--${props.direction}`, {
          "v-btn-group--divided": props.divided
        }, themeClasses.value, borderClasses.value, densityClasses.value, elevationClasses.value, roundedClasses.value, props.class]),
        "style": normalizeStyle(props.style)
      }, slots);
    });
  }
});
const makeGroupProps = propsFactory({
  modelValue: {
    type: null,
    default: void 0
  },
  multiple: Boolean,
  mandatory: [Boolean, String],
  max: Number,
  selectedClass: String,
  disabled: Boolean
}, "group");
const makeGroupItemProps = propsFactory({
  value: null,
  disabled: Boolean,
  selectedClass: String
}, "group-item");
function useGroupItem(props, injectKey, required = true) {
  const vm = getCurrentInstance("useGroupItem");
  if (!vm) {
    throw new Error("[Vuetify] useGroupItem composable must be used inside a component setup function");
  }
  const id = useId();
  provide(/* @__PURE__ */ Symbol.for(`${injectKey.description}:id`), id);
  const group = inject(injectKey, null);
  if (!group) {
    if (!required) return group;
    throw new Error(`[Vuetify] Could not find useGroup injection with symbol ${injectKey.description}`);
  }
  const value = toRef(() => props.value);
  const disabled = computed(() => !!(group.disabled.value || props.disabled));
  function register() {
    group?.register({
      id,
      value,
      disabled
    }, vm);
  }
  function unregister() {
    group?.unregister(id);
  }
  register();
  const isSelected = computed(() => {
    return group.isSelected(id);
  });
  const isFirst = computed(() => {
    return group.items.value[0].id === id;
  });
  const isLast = computed(() => {
    return group.items.value[group.items.value.length - 1].id === id;
  });
  const selectedClass = computed(() => isSelected.value && [group.selectedClass.value, props.selectedClass]);
  watch(isSelected, (value2) => {
    vm.emit("group:selected", {
      value: value2
    });
  }, {
    flush: "sync"
  });
  return {
    id,
    isSelected,
    isFirst,
    isLast,
    toggle: () => group.select(id, !isSelected.value),
    select: (value2) => group.select(id, value2),
    selectedClass,
    value,
    disabled,
    group,
    register,
    unregister
  };
}
function useGroup(props, injectKey) {
  const items = reactive([]);
  const selected = useProxiedModel(props, "modelValue", [], (v) => {
    if (v === void 0) return [];
    return getIds(items, v === null ? [null] : wrapInArray(v));
  }, (v) => {
    const arr = getValues(items, v);
    return props.multiple ? arr : arr[0];
  });
  const groupVm = getCurrentInstance("useGroup");
  function register(item, vm) {
    const unwrapped = item;
    const key = /* @__PURE__ */ Symbol.for(`${injectKey.description}:id`);
    const children = findChildrenWithProvide(key, groupVm?.vnode);
    const index = children.indexOf(vm);
    if (unref(unwrapped.value) === void 0) {
      unwrapped.value = index;
      unwrapped.useIndexAsValue = true;
    }
    if (index > -1) {
      items.splice(index, 0, unwrapped);
    } else {
      items.push(unwrapped);
    }
  }
  function unregister(id) {
    forceMandatoryValue();
    const index = items.findIndex((item) => item.id === id);
    items.splice(index, 1);
  }
  function forceMandatoryValue() {
    const item = items.find((item2) => !item2.disabled);
    if (item && props.mandatory === "force" && !selected.value.length) {
      selected.value = [item.id];
    }
  }
  function select(id, value) {
    const item = items.find((item2) => item2.id === id);
    if (value && item?.disabled) return;
    if (props.multiple) {
      const internalValue = selected.value.slice();
      const index = internalValue.findIndex((v) => v === id);
      const isSelected = ~index;
      value = value ?? !isSelected;
      if (isSelected && props.mandatory && internalValue.length <= 1) return;
      if (!isSelected && props.max != null && internalValue.length + 1 > props.max) return;
      if (index < 0 && value) internalValue.push(id);
      else if (index >= 0 && !value) internalValue.splice(index, 1);
      selected.value = internalValue;
    } else {
      const isSelected = selected.value.includes(id);
      if (props.mandatory && isSelected) return;
      if (!isSelected && !value) return;
      selected.value = value ?? !isSelected ? [id] : [];
    }
  }
  function step(offset) {
    if (props.multiple) consoleWarn('This method is not supported when using "multiple" prop');
    if (!selected.value.length) {
      const item = items.find((item2) => !item2.disabled);
      item && (selected.value = [item.id]);
    } else {
      const currentId = selected.value[0];
      const currentIndex = items.findIndex((i) => i.id === currentId);
      let newIndex = (currentIndex + offset) % items.length;
      let newItem = items[newIndex];
      while (newItem.disabled && newIndex !== currentIndex) {
        newIndex = (newIndex + offset) % items.length;
        newItem = items[newIndex];
      }
      if (newItem.disabled) return;
      selected.value = [items[newIndex].id];
    }
  }
  const state = {
    register,
    unregister,
    selected,
    select,
    disabled: toRef(() => props.disabled),
    prev: () => step(items.length - 1),
    next: () => step(1),
    isSelected: (id) => selected.value.includes(id),
    selectedClass: toRef(() => props.selectedClass),
    items: toRef(() => items),
    getItemIndex: (value) => getItemIndex(items, value)
  };
  provide(injectKey, state);
  return state;
}
function getItemIndex(items, value) {
  const ids = getIds(items, [value]);
  if (!ids.length) return -1;
  return items.findIndex((item) => item.id === ids[0]);
}
function getIds(items, modelValue) {
  const ids = [];
  modelValue.forEach((value) => {
    const item = items.find((item2) => deepEqual(value, item2.value));
    const itemByIndex = items[value];
    if (item?.value !== void 0) {
      ids.push(item.id);
    } else if (itemByIndex?.useIndexAsValue) {
      ids.push(itemByIndex.id);
    }
  });
  return ids;
}
function getValues(items, ids) {
  const values = [];
  ids.forEach((id) => {
    const itemIndex = items.findIndex((item) => item.id === id);
    if (~itemIndex) {
      const item = items[itemIndex];
      values.push(item.value !== void 0 ? item.value : itemIndex);
    }
  });
  return values;
}
const VBtnToggleSymbol = /* @__PURE__ */ Symbol.for("vuetify:v-btn-toggle");
const makeVBtnToggleProps = propsFactory({
  ...makeVBtnGroupProps(),
  ...makeGroupProps()
}, "VBtnToggle");
genericComponent()({
  name: "VBtnToggle",
  props: makeVBtnToggleProps(),
  emits: {
    "update:modelValue": (value) => true
  },
  setup(props, {
    slots
  }) {
    const {
      isSelected,
      next,
      prev,
      select,
      selected
    } = useGroup(props, VBtnToggleSymbol);
    useRender(() => {
      const btnGroupProps = VBtnGroup.filterProps(props);
      return createVNode(VBtnGroup, mergeProps({
        "class": ["v-btn-toggle", {
          "v-btn-toggle--has-color": !!props.color
        }, props.class]
      }, btnGroupProps, {
        "style": props.style
      }), {
        default: () => [slots.default?.({
          isSelected,
          next,
          prev,
          select,
          selected
        })]
      });
    });
    return {
      next,
      prev,
      select
    };
  }
});
const makeVDefaultsProviderProps = propsFactory({
  defaults: Object,
  disabled: Boolean,
  reset: [Number, String],
  root: [Boolean, String],
  scoped: Boolean
}, "VDefaultsProvider");
const VDefaultsProvider = genericComponent(false)({
  name: "VDefaultsProvider",
  props: makeVDefaultsProviderProps(),
  setup(props, {
    slots
  }) {
    const {
      defaults,
      disabled,
      reset,
      root,
      scoped
    } = toRefs(props);
    provideDefaults(defaults, {
      reset,
      root,
      scoped,
      disabled
    });
    return () => slots.default?.();
  }
});
const predefinedSizes = ["x-small", "small", "default", "large", "x-large"];
const makeSizeProps = propsFactory({
  size: {
    type: [String, Number],
    default: "default"
  }
}, "size");
function useSize(props, name = getCurrentInstanceName()) {
  return destructComputed(() => {
    const size = props.size;
    let sizeClasses;
    let sizeStyles;
    if (includes(predefinedSizes, size)) {
      sizeClasses = `${name}--size-${size}`;
    } else if (size) {
      sizeStyles = {
        width: convertToUnit(size),
        height: convertToUnit(size)
      };
    }
    return {
      sizeClasses,
      sizeStyles
    };
  });
}
const makeVIconProps = propsFactory({
  color: String,
  disabled: Boolean,
  start: Boolean,
  end: Boolean,
  icon: IconValue,
  opacity: [String, Number],
  ...makeComponentProps(),
  ...makeSizeProps(),
  ...makeTagProps({
    tag: "i"
  }),
  ...makeThemeProps()
}, "VIcon");
const VIcon = genericComponent()({
  name: "VIcon",
  props: makeVIconProps(),
  setup(props, {
    attrs,
    slots
  }) {
    const slotIcon = shallowRef();
    const {
      themeClasses
    } = useTheme();
    const {
      iconData
    } = useIcon(() => slotIcon.value || props.icon);
    const {
      sizeClasses
    } = useSize(props);
    const {
      textColorClasses,
      textColorStyles
    } = useTextColor(() => props.color);
    useRender(() => {
      const slotValue = slots.default?.();
      if (slotValue) {
        slotIcon.value = flattenFragments(slotValue).filter((node) => node.type === Text && node.children && typeof node.children === "string")[0]?.children;
      }
      const hasClick = !!(attrs.onClick || attrs.onClickOnce);
      return createVNode(iconData.value.component, {
        "tag": props.tag,
        "icon": iconData.value.icon,
        "class": normalizeClass(["v-icon", "notranslate", themeClasses.value, sizeClasses.value, textColorClasses.value, {
          "v-icon--clickable": hasClick,
          "v-icon--disabled": props.disabled,
          "v-icon--start": props.start,
          "v-icon--end": props.end
        }, props.class]),
        "style": normalizeStyle([{
          "--v-icon-opacity": props.opacity
        }, !sizeClasses.value ? {
          fontSize: convertToUnit(props.size),
          height: convertToUnit(props.size),
          width: convertToUnit(props.size)
        } : void 0, textColorStyles.value, props.style]),
        "role": hasClick ? "button" : void 0,
        "aria-hidden": !hasClick,
        "tabindex": hasClick ? props.disabled ? -1 : 0 : void 0
      }, {
        default: () => [slotValue]
      });
    });
    return {};
  }
});
function useIntersectionObserver(callback, options) {
  const intersectionRef = ref();
  const isIntersecting = shallowRef(false);
  return {
    intersectionRef,
    isIntersecting
  };
}
const makeRevealProps = propsFactory({
  reveal: {
    type: [Boolean, Object],
    default: false
  }
}, "reveal");
function useReveal(props) {
  const defaultDuration = 900;
  const duration = toRef(() => typeof props.reveal === "object" ? Math.max(0, Number(props.reveal.duration ?? defaultDuration)) : defaultDuration);
  const state = shallowRef(props.reveal ? "initial" : "disabled");
  return {
    duration,
    state
  };
}
const makeVProgressCircularProps = propsFactory({
  bgColor: String,
  color: String,
  indeterminate: [Boolean, String],
  rounded: Boolean,
  modelValue: {
    type: [Number, String],
    default: 0
  },
  rotate: {
    type: [Number, String],
    default: 0
  },
  width: {
    type: [Number, String],
    default: 4
  },
  ...makeComponentProps(),
  ...makeRevealProps(),
  ...makeSizeProps(),
  ...makeTagProps({
    tag: "div"
  }),
  ...makeThemeProps()
}, "VProgressCircular");
const VProgressCircular = genericComponent()({
  name: "VProgressCircular",
  props: makeVProgressCircularProps(),
  setup(props, {
    slots
  }) {
    const MAGIC_RADIUS_CONSTANT = 20;
    const CIRCUMFERENCE = 2 * Math.PI * MAGIC_RADIUS_CONSTANT;
    const root = ref();
    const {
      themeClasses
    } = provideTheme(props);
    const {
      sizeClasses,
      sizeStyles
    } = useSize(props);
    const {
      textColorClasses,
      textColorStyles
    } = useTextColor(() => props.color);
    const {
      textColorClasses: underlayColorClasses,
      textColorStyles: underlayColorStyles
    } = useTextColor(() => props.bgColor);
    const {
      intersectionRef,
      isIntersecting
    } = useIntersectionObserver();
    const {
      resizeRef,
      contentRect
    } = useResizeObserver();
    const {
      state: revealState,
      duration: revealDuration
    } = useReveal(props);
    const normalizedValue = toRef(() => revealState.value === "initial" ? 0 : clamp(parseFloat(props.modelValue), 0, 100));
    const width = toRef(() => Number(props.width));
    const size = toRef(() => {
      return sizeStyles.value ? Number(props.size) : contentRect.value ? contentRect.value.width : Math.max(width.value, 32);
    });
    const diameter = toRef(() => MAGIC_RADIUS_CONSTANT / (1 - width.value / size.value) * 2);
    const strokeWidth = toRef(() => width.value / size.value * diameter.value);
    const strokeDashOffset = toRef(() => {
      const baseLength = (100 - normalizedValue.value) / 100 * CIRCUMFERENCE;
      return props.rounded && normalizedValue.value > 0 && normalizedValue.value < 100 ? convertToUnit(Math.min(CIRCUMFERENCE - 0.01, baseLength + strokeWidth.value)) : convertToUnit(baseLength);
    });
    const startAngle = computed(() => {
      const baseAngle = Number(props.rotate);
      return props.rounded ? baseAngle + strokeWidth.value / 2 / CIRCUMFERENCE * 360 : baseAngle;
    });
    watchEffect(() => {
      intersectionRef.value = root.value;
      resizeRef.value = root.value;
    });
    useRender(() => createVNode(props.tag, {
      "ref": root,
      "class": normalizeClass(["v-progress-circular", {
        "v-progress-circular--indeterminate": !!props.indeterminate,
        "v-progress-circular--visible": isIntersecting.value,
        "v-progress-circular--disable-shrink": props.indeterminate && (props.indeterminate === "disable-shrink" || PREFERS_REDUCED_MOTION()),
        "v-progress-circular--revealing": ["initial", "pending"].includes(revealState.value)
      }, themeClasses.value, sizeClasses.value, textColorClasses.value, props.class]),
      "style": normalizeStyle([sizeStyles.value, textColorStyles.value, {
        "--progress-reveal-duration": `${revealDuration.value}ms`
      }, props.style]),
      "role": "progressbar",
      "aria-valuemin": "0",
      "aria-valuemax": "100",
      "aria-valuenow": props.indeterminate ? void 0 : normalizedValue.value
    }, {
      default: () => [createElementVNode("svg", {
        "style": {
          transform: `rotate(calc(-90deg + ${startAngle.value}deg))`
        },
        "xmlns": "http://www.w3.org/2000/svg",
        "viewBox": `0 0 ${diameter.value} ${diameter.value}`
      }, [createElementVNode("circle", {
        "class": normalizeClass(["v-progress-circular__underlay", underlayColorClasses.value]),
        "style": normalizeStyle(underlayColorStyles.value),
        "fill": "transparent",
        "cx": "50%",
        "cy": "50%",
        "r": MAGIC_RADIUS_CONSTANT,
        "stroke-width": strokeWidth.value,
        "stroke-dasharray": CIRCUMFERENCE,
        "stroke-dashoffset": 0
      }, null), createElementVNode("circle", {
        "class": "v-progress-circular__overlay",
        "fill": "transparent",
        "cx": "50%",
        "cy": "50%",
        "r": MAGIC_RADIUS_CONSTANT,
        "stroke-width": strokeWidth.value,
        "stroke-dasharray": CIRCUMFERENCE,
        "stroke-dashoffset": strokeDashOffset.value,
        "stroke-linecap": props.rounded ? "round" : void 0
      }, null)]), slots.default && createElementVNode("div", {
        "class": "v-progress-circular__content"
      }, [slots.default({
        value: normalizedValue.value
      })])]
    }));
    return {};
  }
});
const makeDimensionProps = propsFactory({
  height: [Number, String],
  maxHeight: [Number, String],
  maxWidth: [Number, String],
  minHeight: [Number, String],
  minWidth: [Number, String],
  width: [Number, String]
}, "dimension");
function useDimension(props) {
  const dimensionStyles = computed(() => {
    const styles = {};
    const height = convertToUnit(props.height);
    const maxHeight = convertToUnit(props.maxHeight);
    const maxWidth = convertToUnit(props.maxWidth);
    const minHeight = convertToUnit(props.minHeight);
    const minWidth = convertToUnit(props.minWidth);
    const width = convertToUnit(props.width);
    if (height != null) styles.height = height;
    if (maxHeight != null) styles.maxHeight = maxHeight;
    if (maxWidth != null) styles.maxWidth = maxWidth;
    if (minHeight != null) styles.minHeight = minHeight;
    if (minWidth != null) styles.minWidth = minWidth;
    if (width != null) styles.width = width;
    return styles;
  });
  return {
    dimensionStyles
  };
}
const oppositeMap = {
  center: "center",
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left"
};
const makeLocationProps = propsFactory({
  location: String
}, "location");
function useLocation(props, opposite = false, offset) {
  const {
    isRtl
  } = useRtl();
  const locationStyles = computed(() => {
    if (!props.location) return {};
    const {
      side,
      align
    } = parseAnchor(props.location.split(" ").length > 1 ? props.location : `${props.location} center`, isRtl.value);
    function getOffset(side2) {
      return offset ? offset(side2) : 0;
    }
    const styles = {};
    if (side !== "center") {
      if (opposite) styles[oppositeMap[side]] = `calc(100% - ${getOffset(side)}px)`;
      else styles[side] = 0;
    }
    if (align !== "center") {
      if (opposite) styles[oppositeMap[align]] = `calc(100% - ${getOffset(align)}px)`;
      else styles[align] = 0;
    } else {
      if (side === "center") styles.top = styles.left = "50%";
      else {
        styles[{
          top: "left",
          bottom: "left",
          left: "top",
          right: "top"
        }[side]] = "50%";
      }
      styles.transform = {
        top: "translateX(-50%)",
        bottom: "translateX(-50%)",
        left: "translateY(-50%)",
        right: "translateY(-50%)",
        center: "translate(-50%, -50%)"
      }[side];
    }
    return styles;
  });
  return {
    locationStyles
  };
}
const makeLoaderProps = propsFactory({
  loading: [Boolean, String]
}, "loader");
function useLoader(props, name = getCurrentInstanceName()) {
  const loaderClasses = toRef(() => ({
    [`${name}--loading`]: props.loading
  }));
  return {
    loaderClasses
  };
}
const positionValues = ["static", "relative", "fixed", "absolute", "sticky"];
const makePositionProps = propsFactory({
  position: {
    type: String,
    validator: (
      /* istanbul ignore next */
      (v) => positionValues.includes(v)
    )
  }
}, "position");
function usePosition(props, name = getCurrentInstanceName()) {
  const positionClasses = toRef(() => {
    return props.position ? `${name}--${props.position}` : void 0;
  });
  return {
    positionClasses
  };
}
function useRoute() {
  const vm = getCurrentInstance("useRoute");
  return computed(() => vm?.proxy?.$route);
}
function useRouter() {
  return getCurrentInstance("useRouter")?.proxy?.$router;
}
function useLink(props, attrs) {
  const RouterLink = resolveDynamicComponent("RouterLink");
  const isLink = toRef(() => !!(props.href || props.to));
  const isClickable = computed(() => {
    return isLink?.value || hasEvent(attrs, "click") || hasEvent(props, "click");
  });
  if (typeof RouterLink === "string" || !("useLink" in RouterLink)) {
    const href2 = toRef(() => props.href);
    return {
      isLink,
      isRouterLink: toRef(() => false),
      isClickable,
      href: href2,
      linkProps: reactive({
        href: href2
      }),
      route: toRef(() => void 0),
      navigate: toRef(() => void 0)
    };
  }
  const routerLink = RouterLink.useLink({
    to: toRef(() => props.to || ""),
    replace: toRef(() => props.replace)
  });
  const link = computed(() => props.to ? routerLink : void 0);
  const route = useRoute();
  const isActive = computed(() => {
    if (!link.value) return false;
    if (!props.exact) return link.value.isActive?.value ?? false;
    if (!route.value) return link.value.isExactActive?.value ?? false;
    return link.value.isExactActive?.value && deepEqual(link.value.route.value.query, route.value.query);
  });
  const href = computed(() => props.to ? link.value?.route.value.href : props.href);
  const isRouterLink = toRef(() => !!props.to);
  return {
    isLink,
    isRouterLink,
    isClickable,
    isActive,
    route: toRef(() => link.value?.route.value),
    navigate: toRef(() => link.value?.navigate),
    href,
    linkProps: reactive({
      href,
      "aria-current": toRef(() => isActive.value ? "page" : void 0),
      "aria-disabled": toRef(() => props.disabled && isLink.value ? "true" : void 0),
      tabindex: toRef(() => props.disabled && isLink.value ? "-1" : void 0)
    })
  };
}
const makeRouterProps = propsFactory({
  href: String,
  replace: Boolean,
  to: [String, Object],
  exact: Boolean
}, "router");
function useSelectLink(link, select) {
  watch(() => link.isActive?.value, (isActive) => {
    if (link.isLink.value && isActive != null && select) {
      nextTick(() => {
        select(isActive);
      });
    }
  }, {
    immediate: true
  });
}
const stopSymbol = /* @__PURE__ */ Symbol("rippleStop");
const DELAY_RIPPLE = 80;
function transform(el, value) {
  el.style.transform = value;
  el.style.webkitTransform = value;
}
function isTouchEvent(e) {
  return e.constructor.name === "TouchEvent";
}
function isKeyboardEvent(e) {
  return e.constructor.name === "KeyboardEvent";
}
const calculate = (e, el, value = {}) => {
  let localX = 0;
  let localY = 0;
  if (!isKeyboardEvent(e)) {
    const offset = new Box(el);
    const target = isTouchEvent(e) ? e.touches[e.touches.length - 1] : e;
    const point = getTargetBox([target.clientX, target.clientY]);
    localX = point.x - offset.left;
    localY = point.y - offset.top;
  }
  let radius = 0;
  let scale = 0.3;
  if (el._ripple?.circle) {
    scale = 0.15;
    radius = el.clientWidth / 2;
    radius = value.center ? radius : radius + Math.sqrt((localX - radius) ** 2 + (localY - radius) ** 2) / 4;
  } else {
    radius = Math.sqrt(el.clientWidth ** 2 + el.clientHeight ** 2) / 2;
  }
  const centerX = `${(el.clientWidth - radius * 2) / 2}px`;
  const centerY = `${(el.clientHeight - radius * 2) / 2}px`;
  const x = value.center ? centerX : `${localX - radius}px`;
  const y = value.center ? centerY : `${localY - radius}px`;
  return {
    radius,
    scale,
    x,
    y,
    centerX,
    centerY
  };
};
const ripples = {
  /* eslint-disable max-statements */
  show(e, el, value = {}) {
    if (!el?._ripple?.enabled) {
      return;
    }
    const container = (void 0).createElement("span");
    const animation = (void 0).createElement("span");
    container.appendChild(animation);
    container.className = "v-ripple__container";
    if (value.class) {
      container.className += ` ${value.class}`;
    }
    const {
      radius,
      scale,
      x,
      y,
      centerX,
      centerY
    } = calculate(e, el, value);
    const size = `${radius * 2}px`;
    animation.className = "v-ripple__animation";
    animation.style.width = size;
    animation.style.height = size;
    el.appendChild(container);
    const computed2 = (void 0).getComputedStyle(el);
    if (computed2 && computed2.position === "static") {
      el.style.position = "relative";
      el.dataset.previousPosition = "static";
    }
    animation.classList.add("v-ripple__animation--enter");
    animation.classList.add("v-ripple__animation--visible");
    transform(animation, `translate(${x}, ${y}) scale3d(${scale},${scale},${scale})`);
    animation.dataset.activated = String(performance.now());
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        animation.classList.remove("v-ripple__animation--enter");
        animation.classList.add("v-ripple__animation--in");
        transform(animation, `translate(${centerX}, ${centerY}) scale3d(1,1,1)`);
      });
    });
  },
  hide(el) {
    if (!el?._ripple?.enabled) return;
    const ripples2 = el.getElementsByClassName("v-ripple__animation");
    if (ripples2.length === 0) return;
    const animation = Array.from(ripples2).findLast((ripple) => !ripple.dataset.isHiding);
    if (!animation) return;
    else animation.dataset.isHiding = "true";
    const diff = performance.now() - Number(animation.dataset.activated);
    const delay = Math.max(250 - diff, 0);
    setTimeout(() => {
      animation.classList.remove("v-ripple__animation--in");
      animation.classList.add("v-ripple__animation--out");
      setTimeout(() => {
        const ripples3 = el.getElementsByClassName("v-ripple__animation");
        if (ripples3.length === 1 && el.dataset.previousPosition) {
          el.style.position = el.dataset.previousPosition;
          delete el.dataset.previousPosition;
        }
        if (animation.parentNode?.parentNode === el) el.removeChild(animation.parentNode);
      }, 300);
    }, delay);
  }
};
function isRippleEnabled(value) {
  return typeof value === "undefined" || !!value;
}
function rippleShow(e) {
  const value = {};
  const element = e.currentTarget;
  if (!element?._ripple || element._ripple.touched || e[stopSymbol]) return;
  e[stopSymbol] = true;
  if (isTouchEvent(e)) {
    element._ripple.touched = true;
    element._ripple.isTouch = true;
  } else {
    if (element._ripple.isTouch) return;
  }
  value.center = element._ripple.centered || isKeyboardEvent(e);
  if (element._ripple.class) {
    value.class = element._ripple.class;
  }
  if (isTouchEvent(e)) {
    if (element._ripple.showTimerCommit) return;
    element._ripple.showTimerCommit = () => {
      ripples.show(e, element, value);
    };
    element._ripple.showTimer = (void 0).setTimeout(() => {
      if (element?._ripple?.showTimerCommit) {
        element._ripple.showTimerCommit();
        element._ripple.showTimerCommit = null;
      }
    }, DELAY_RIPPLE);
  } else {
    ripples.show(e, element, value);
  }
}
function rippleStop(e) {
  e[stopSymbol] = true;
}
function rippleHide(e) {
  const element = e.currentTarget;
  if (!element?._ripple) return;
  (void 0).clearTimeout(element._ripple.showTimer);
  if (e.type === "touchend" && element._ripple.showTimerCommit) {
    element._ripple.showTimerCommit();
    element._ripple.showTimerCommit = null;
    element._ripple.showTimer = (void 0).setTimeout(() => {
      rippleHide(e);
    });
    return;
  }
  (void 0).setTimeout(() => {
    if (element._ripple) {
      element._ripple.touched = false;
    }
  });
  ripples.hide(element);
}
function rippleCancelShow(e) {
  const element = e.currentTarget;
  if (!element?._ripple) return;
  if (element._ripple.showTimerCommit) {
    element._ripple.showTimerCommit = null;
  }
  (void 0).clearTimeout(element._ripple.showTimer);
}
let keyboardRipple = false;
function keyboardRippleShow(e, keys) {
  if (!keyboardRipple && keys.includes(e.key)) {
    keyboardRipple = true;
    rippleShow(e);
  }
}
function keyboardRippleHide(e) {
  keyboardRipple = false;
  rippleHide(e);
}
function focusRippleHide(e) {
  if (keyboardRipple) {
    keyboardRipple = false;
    rippleHide(e);
  }
}
function updateRipple(el, binding, wasEnabled) {
  const {
    value,
    modifiers
  } = binding;
  const enabled = isRippleEnabled(value);
  if (!enabled) {
    ripples.hide(el);
  }
  el._ripple = el._ripple ?? {};
  el._ripple.enabled = enabled;
  el._ripple.centered = modifiers.center;
  el._ripple.circle = modifiers.circle;
  const bindingValue = isObject(value) ? value : {};
  if (bindingValue.class) {
    el._ripple.class = bindingValue.class;
  }
  const allowedKeys = bindingValue.keys ?? ["Enter", "Space"];
  el._ripple.keyDownHandler = (e) => keyboardRippleShow(e, allowedKeys);
  if (enabled && !wasEnabled) {
    if (modifiers.stop) {
      el.addEventListener("touchstart", rippleStop, {
        passive: true
      });
      el.addEventListener("mousedown", rippleStop);
      return;
    }
    el.addEventListener("touchstart", rippleShow, {
      passive: true
    });
    el.addEventListener("touchend", rippleHide, {
      passive: true
    });
    el.addEventListener("touchmove", rippleCancelShow, {
      passive: true
    });
    el.addEventListener("touchcancel", rippleHide);
    el.addEventListener("mousedown", rippleShow);
    el.addEventListener("mouseup", rippleHide);
    el.addEventListener("mouseleave", rippleHide);
    el.addEventListener("keydown", el._ripple.keyDownHandler);
    el.addEventListener("keyup", keyboardRippleHide);
    el.addEventListener("blur", focusRippleHide);
    el.addEventListener("dragstart", rippleHide, {
      passive: true
    });
  } else if (!enabled && wasEnabled) {
    removeListeners(el);
  }
}
function removeListeners(el) {
  el.removeEventListener("touchstart", rippleStop);
  el.removeEventListener("mousedown", rippleStop);
  el.removeEventListener("touchstart", rippleShow);
  el.removeEventListener("touchend", rippleHide);
  el.removeEventListener("touchmove", rippleCancelShow);
  el.removeEventListener("touchcancel", rippleHide);
  el.removeEventListener("mousedown", rippleShow);
  el.removeEventListener("mouseup", rippleHide);
  el.removeEventListener("mouseleave", rippleHide);
  if (el._ripple?.keyDownHandler) {
    el.removeEventListener("keydown", el._ripple.keyDownHandler);
  }
  el.removeEventListener("keyup", keyboardRippleHide);
  el.removeEventListener("blur", focusRippleHide);
  el.removeEventListener("dragstart", rippleHide);
}
function mounted$1(el, binding) {
  updateRipple(el, binding, false);
}
function unmounted$1(el) {
  removeListeners(el);
  delete el._ripple;
}
function updated(el, binding) {
  if (binding.value === binding.oldValue) {
    return;
  }
  const wasEnabled = isRippleEnabled(binding.oldValue);
  updateRipple(el, binding, wasEnabled);
}
const Ripple = {
  mounted: mounted$1,
  unmounted: unmounted$1,
  updated
};
const makeVBtnProps = propsFactory({
  active: {
    type: Boolean,
    default: void 0
  },
  activeColor: String,
  baseColor: String,
  symbol: {
    type: null,
    default: VBtnToggleSymbol
  },
  flat: Boolean,
  icon: [Boolean, String, Function, Object],
  prependIcon: IconValue,
  appendIcon: IconValue,
  block: Boolean,
  readonly: Boolean,
  slim: Boolean,
  stacked: Boolean,
  spaced: String,
  ripple: {
    type: [Boolean, Object],
    default: true
  },
  text: {
    type: [String, Number, Boolean],
    default: void 0
  },
  ...makeBorderProps(),
  ...makeComponentProps(),
  ...makeDensityProps(),
  ...makeDimensionProps(),
  ...makeElevationProps(),
  ...makeGroupItemProps(),
  ...makeLoaderProps(),
  ...makeLocationProps(),
  ...makePositionProps(),
  ...makeRoundedProps(),
  ...makeRouterProps(),
  ...makeSizeProps(),
  ...makeTagProps({
    tag: "button"
  }),
  ...makeThemeProps(),
  ...makeVariantProps({
    variant: "elevated"
  })
}, "VBtn");
const VBtn = genericComponent()({
  name: "VBtn",
  props: makeVBtnProps(),
  emits: {
    "group:selected": (val) => true
  },
  setup(props, {
    attrs,
    slots
  }) {
    const {
      themeClasses
    } = provideTheme(props);
    const {
      borderClasses
    } = useBorder(props);
    const {
      densityClasses
    } = useDensity(props);
    const {
      dimensionStyles
    } = useDimension(props);
    const {
      elevationClasses
    } = useElevation(props);
    const {
      loaderClasses
    } = useLoader(props);
    const {
      locationStyles
    } = useLocation(props);
    const {
      positionClasses
    } = usePosition(props);
    const {
      roundedClasses
    } = useRounded(props);
    const {
      sizeClasses,
      sizeStyles
    } = useSize(props);
    const group = useGroupItem(props, props.symbol, false);
    const link = useLink(props, attrs);
    const isActive = computed(() => {
      if (props.active !== void 0) {
        return props.active;
      }
      if (link.isRouterLink.value) {
        return link.isActive?.value;
      }
      return group?.isSelected.value;
    });
    const color = toRef(() => isActive.value ? props.activeColor ?? props.color : props.color);
    const variantProps = computed(() => {
      const showColor = group?.isSelected.value && (!link.isLink.value || link.isActive?.value) || !group || link.isActive?.value;
      return {
        color: showColor ? color.value ?? props.baseColor : props.baseColor,
        variant: props.variant
      };
    });
    const {
      colorClasses,
      colorStyles,
      variantClasses
    } = useVariant(variantProps);
    const isDisabled = computed(() => group?.disabled.value || props.disabled);
    const isElevated = toRef(() => {
      return props.variant === "elevated" && !(props.disabled || props.flat || props.border);
    });
    const valueAttr = computed(() => {
      if (props.value === void 0 || typeof props.value === "symbol") return void 0;
      return Object(props.value) === props.value ? JSON.stringify(props.value, null, 0) : props.value;
    });
    function onClick(e) {
      if (isDisabled.value || link.isLink.value && (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || attrs.target === "_blank")) return;
      if (link.isRouterLink.value) {
        link.navigate.value?.(e);
      } else {
        group?.toggle();
      }
    }
    useSelectLink(link, group?.select);
    useRender(() => {
      const Tag = link.isLink.value ? "a" : props.tag;
      const hasPrepend = !!(props.prependIcon || slots.prepend);
      const hasAppend = !!(props.appendIcon || slots.append);
      const hasIcon = !!(props.icon && props.icon !== true);
      return withDirectives(createVNode(Tag, mergeProps(link.linkProps, {
        "type": Tag === "a" ? void 0 : "button",
        "class": ["v-btn", group?.selectedClass.value, {
          "v-btn--active": isActive.value,
          "v-btn--block": props.block,
          "v-btn--disabled": isDisabled.value,
          "v-btn--elevated": isElevated.value,
          "v-btn--flat": props.flat,
          "v-btn--icon": !!props.icon,
          "v-btn--loading": props.loading,
          "v-btn--readonly": props.readonly,
          "v-btn--slim": props.slim,
          "v-btn--stacked": props.stacked
        }, props.spaced ? ["v-btn--spaced", `v-btn--spaced-${props.spaced}`] : [], themeClasses.value, borderClasses.value, colorClasses.value, densityClasses.value, elevationClasses.value, loaderClasses.value, positionClasses.value, roundedClasses.value, sizeClasses.value, variantClasses.value, props.class],
        "style": [colorStyles.value, dimensionStyles.value, locationStyles.value, sizeStyles.value, props.style],
        "aria-busy": props.loading ? true : void 0,
        "disabled": isDisabled.value && Tag !== "a" || void 0,
        "tabindex": props.loading || props.readonly ? -1 : void 0,
        "onClick": onClick,
        "value": valueAttr.value
      }), {
        default: () => [genOverlays(true, "v-btn"), !props.icon && hasPrepend && createElementVNode("span", {
          "key": "prepend",
          "class": "v-btn__prepend"
        }, [!slots.prepend ? createVNode(VIcon, {
          "key": "prepend-icon",
          "icon": props.prependIcon
        }, null) : createVNode(VDefaultsProvider, {
          "key": "prepend-defaults",
          "disabled": !props.prependIcon,
          "defaults": {
            VIcon: {
              icon: props.prependIcon
            }
          }
        }, slots.prepend)]), createElementVNode("span", {
          "class": "v-btn__content",
          "data-no-activator": ""
        }, [!slots.default && hasIcon ? createVNode(VIcon, {
          "key": "content-icon",
          "icon": props.icon
        }, null) : createVNode(VDefaultsProvider, {
          "key": "content-defaults",
          "disabled": !hasIcon,
          "defaults": {
            VIcon: {
              icon: props.icon
            }
          }
        }, {
          default: () => [slots.default?.() ?? toDisplayString(props.text)]
        })]), !props.icon && hasAppend && createElementVNode("span", {
          "key": "append",
          "class": "v-btn__append"
        }, [!slots.append ? createVNode(VIcon, {
          "key": "append-icon",
          "icon": props.appendIcon
        }, null) : createVNode(VDefaultsProvider, {
          "key": "append-defaults",
          "disabled": !props.appendIcon,
          "defaults": {
            VIcon: {
              icon: props.appendIcon
            }
          }
        }, slots.append)]), !!props.loading && createElementVNode("span", {
          "key": "loader",
          "class": "v-btn__loader"
        }, [slots.loader?.() ?? createVNode(VProgressCircular, {
          "color": typeof props.loading === "boolean" ? void 0 : props.loading,
          "indeterminate": true,
          "width": "2"
        }, null)])]
      }), [[Ripple, !isDisabled.value && props.ripple, "", {
        center: !!props.icon
      }]]);
    });
    return {
      group
    };
  }
});
const makeTransitionProps$1 = propsFactory({
  disabled: Boolean,
  group: Boolean,
  hideOnLeave: Boolean,
  leaveAbsolute: Boolean,
  mode: String,
  origin: String
}, "transition");
function createCssTransition(name, origin, mode) {
  return genericComponent()({
    name,
    props: makeTransitionProps$1({
      mode,
      origin
    }),
    setup(props, {
      slots
    }) {
      const functions = {
        onBeforeEnter(el) {
          if (props.origin) {
            el.style.transformOrigin = props.origin;
          }
        },
        onLeave(el) {
          if (props.leaveAbsolute) {
            const {
              offsetTop,
              offsetLeft,
              offsetWidth,
              offsetHeight
            } = el;
            el._transitionInitialStyles = {
              position: el.style.position,
              top: el.style.top,
              left: el.style.left,
              width: el.style.width,
              height: el.style.height
            };
            el.style.position = "absolute";
            el.style.top = `${offsetTop}px`;
            el.style.left = `${offsetLeft}px`;
            el.style.width = `${offsetWidth}px`;
            el.style.height = `${offsetHeight}px`;
          }
          if (props.hideOnLeave) {
            el.style.setProperty("display", "none", "important");
          }
        },
        onAfterLeave(el) {
          if (props.leaveAbsolute && el?._transitionInitialStyles) {
            const {
              position,
              top,
              left,
              width,
              height
            } = el._transitionInitialStyles;
            delete el._transitionInitialStyles;
            el.style.position = position || "";
            el.style.top = top || "";
            el.style.left = left || "";
            el.style.width = width || "";
            el.style.height = height || "";
          }
        }
      };
      return () => {
        const tag = props.group ? TransitionGroup : Transition;
        return h(tag, {
          name: props.disabled ? "" : name,
          css: !props.disabled,
          ...props.group ? void 0 : {
            mode: props.mode
          },
          ...props.disabled ? {} : functions
        }, slots.default);
      };
    }
  });
}
function createJavascriptTransition(name, functions, mode = "in-out") {
  return genericComponent()({
    name,
    props: {
      mode: {
        type: String,
        default: mode
      },
      disabled: {
        type: Boolean,
        default: PREFERS_REDUCED_MOTION()
      },
      group: Boolean,
      hideOnLeave: Boolean
    },
    setup(props, {
      slots
    }) {
      const tag = props.group ? TransitionGroup : Transition;
      return () => {
        return h(tag, {
          name: props.disabled ? "" : name,
          css: !props.disabled,
          // mode: props.mode, // TODO: vuejs/vue-next#3104
          ...props.disabled ? {} : {
            ...functions,
            onLeave: (el) => {
              if (props.hideOnLeave) {
                el.style.setProperty("display", "none", "important");
              } else {
                functions.onLeave?.(el);
              }
            }
          }
        }, slots.default);
      };
    }
  });
}
function ExpandTransitionGenerator(expandedParentClass = "", type = "y") {
  return {
    onBeforeEnter(el) {
      el._parent = el.parentNode;
      el._initialStyle = {
        transition: el.style.transition,
        overflow: el.style.overflow,
        width: el.style.width,
        height: el.style.height
      };
    },
    onEnter(el) {
      const initialStyle = el._initialStyle;
      if (!initialStyle) return;
      el.style.setProperty("transition", "none", "important");
      el.style.overflow = "hidden";
      const offsetWidth = `${el.offsetWidth}px`;
      const offsetHeight = `${el.offsetHeight}px`;
      if (["x", "both"].includes(type)) el.style.width = "0";
      if (["y", "both"].includes(type)) el.style.height = "0";
      void el.offsetHeight;
      el.style.transition = initialStyle.transition;
      if (expandedParentClass && el._parent) {
        el._parent.classList.add(expandedParentClass);
      }
      requestAnimationFrame(() => {
        if (["x", "both"].includes(type)) el.style.width = offsetWidth;
        if (["y", "both"].includes(type)) el.style.height = offsetHeight;
      });
    },
    onAfterEnter: resetStyles,
    onEnterCancelled: resetStyles,
    onLeave(el) {
      el._initialStyle = {
        transition: "",
        overflow: el.style.overflow,
        width: el.style.width,
        height: el.style.height
      };
      el.style.overflow = "hidden";
      if (["x", "both"].includes(type)) el.style.width = `${el.offsetWidth}px`;
      if (["y", "both"].includes(type)) el.style.height = `${el.offsetHeight}px`;
      void el.offsetHeight;
      requestAnimationFrame(() => {
        if (["x", "both"].includes(type)) el.style.width = "0";
        if (["y", "both"].includes(type)) el.style.height = "0";
      });
    },
    onAfterLeave,
    onLeaveCancelled: onAfterLeave
  };
  function onAfterLeave(el) {
    if (expandedParentClass && el._parent) {
      el._parent.classList.remove(expandedParentClass);
    }
    resetStyles(el);
  }
  function resetStyles(el) {
    if (!el._initialStyle) return;
    const {
      width: w,
      height: h2
    } = el._initialStyle;
    el.style.overflow = el._initialStyle.overflow;
    if (w != null && ["x", "both"].includes(type)) el.style.width = w;
    if (h2 != null && ["y", "both"].includes(type)) el.style.height = h2;
    delete el._initialStyle;
  }
}
createCssTransition("fab-transition", "center center", "out-in");
createCssTransition("dialog-bottom-transition");
createCssTransition("dialog-top-transition");
createCssTransition("fade-transition");
createCssTransition("scale-transition");
createCssTransition("scroll-x-transition");
createCssTransition("scroll-x-reverse-transition");
createCssTransition("scroll-y-transition");
createCssTransition("scroll-y-reverse-transition");
createCssTransition("slide-x-transition");
createCssTransition("slide-x-reverse-transition");
createCssTransition("slide-y-transition");
createCssTransition("slide-y-reverse-transition");
const VExpandTransition = createJavascriptTransition("expand-transition", ExpandTransitionGenerator());
createJavascriptTransition("expand-x-transition", ExpandTransitionGenerator("", "x"));
createJavascriptTransition("expand-both-transition", ExpandTransitionGenerator("", "both"));
const ListKey = /* @__PURE__ */ Symbol.for("vuetify:list");
function createList(options = {
  filterable: false
}) {
  const parent = inject(ListKey, {
    filterable: false,
    hasPrepend: shallowRef(false),
    updateHasPrepend: () => null,
    trackingIndex: shallowRef(-1),
    navigationStrategy: shallowRef("focus"),
    uid: ""
  });
  const {
    filterable,
    trackingIndex = parent.trackingIndex,
    navigationStrategy = parent.navigationStrategy,
    uid = parent.uid || useId()
  } = options;
  const data = {
    filterable: parent.filterable || filterable,
    hasPrepend: shallowRef(false),
    updateHasPrepend: (value) => {
      if (value) data.hasPrepend.value = value;
    },
    trackingIndex,
    navigationStrategy,
    uid
  };
  provide(ListKey, data);
  return parent;
}
function useList() {
  return inject(ListKey, null);
}
const independentActiveStrategy = (mandatory) => {
  const strategy = {
    activate: ({
      id,
      value,
      activated
    }) => {
      id = toRaw(id);
      if (mandatory && !value && activated.size === 1 && activated.has(id)) return activated;
      if (value) {
        activated.add(id);
      } else {
        activated.delete(id);
      }
      return activated;
    },
    in: (v, children, parents) => {
      let set = /* @__PURE__ */ new Set();
      if (v != null) {
        for (const id of wrapInArray(v)) {
          set = strategy.activate({
            id,
            value: true,
            activated: new Set(set),
            children,
            parents
          });
        }
      }
      return set;
    },
    out: (v) => {
      return Array.from(v);
    }
  };
  return strategy;
};
const independentSingleActiveStrategy = (mandatory) => {
  const parentStrategy = independentActiveStrategy(mandatory);
  const strategy = {
    activate: ({
      activated,
      id,
      ...rest
    }) => {
      id = toRaw(id);
      const singleSelected = activated.has(id) ? /* @__PURE__ */ new Set([id]) : /* @__PURE__ */ new Set();
      return parentStrategy.activate({
        ...rest,
        id,
        activated: singleSelected
      });
    },
    in: (v, children, parents) => {
      let set = /* @__PURE__ */ new Set();
      if (v != null) {
        const arr = wrapInArray(v);
        if (arr.length) {
          set = parentStrategy.in(arr.slice(0, 1), children, parents);
        }
      }
      return set;
    },
    out: (v, children, parents) => {
      return parentStrategy.out(v, children, parents);
    }
  };
  return strategy;
};
const leafActiveStrategy = (mandatory) => {
  const parentStrategy = independentActiveStrategy(mandatory);
  const strategy = {
    activate: ({
      id,
      activated,
      children,
      ...rest
    }) => {
      id = toRaw(id);
      if (children.has(id)) return activated;
      return parentStrategy.activate({
        id,
        activated,
        children,
        ...rest
      });
    },
    in: parentStrategy.in,
    out: parentStrategy.out
  };
  return strategy;
};
const leafSingleActiveStrategy = (mandatory) => {
  const parentStrategy = independentSingleActiveStrategy(mandatory);
  const strategy = {
    activate: ({
      id,
      activated,
      children,
      ...rest
    }) => {
      id = toRaw(id);
      if (children.has(id)) return activated;
      return parentStrategy.activate({
        id,
        activated,
        children,
        ...rest
      });
    },
    in: parentStrategy.in,
    out: parentStrategy.out
  };
  return strategy;
};
const singleOpenStrategy = {
  open: ({
    id,
    value,
    opened,
    parents
  }) => {
    if (value) {
      const newOpened = /* @__PURE__ */ new Set();
      newOpened.add(id);
      let parent = parents.get(id);
      while (parent != null) {
        newOpened.add(parent);
        parent = parents.get(parent);
      }
      return newOpened;
    } else {
      opened.delete(id);
      return opened;
    }
  },
  select: () => null
};
const multipleOpenStrategy = {
  open: ({
    id,
    value,
    opened,
    parents
  }) => {
    if (value) {
      let parent = parents.get(id);
      opened.add(id);
      while (parent != null && parent !== id) {
        opened.add(parent);
        parent = parents.get(parent);
      }
      return opened;
    } else {
      opened.delete(id);
    }
    return opened;
  },
  select: () => null
};
const listOpenStrategy = {
  open: multipleOpenStrategy.open,
  select: ({
    id,
    value,
    opened,
    parents
  }) => {
    if (!value) return opened;
    const path = [];
    let parent = parents.get(id);
    while (parent != null) {
      path.push(parent);
      parent = parents.get(parent);
    }
    return new Set(path);
  }
};
const independentSelectStrategy = (mandatory) => {
  const strategy = {
    select: ({
      id,
      value,
      selected
    }) => {
      id = toRaw(id);
      if (mandatory && !value) {
        const on = Array.from(selected.entries()).reduce((arr, [key, value2]) => {
          if (value2 === "on") arr.push(key);
          return arr;
        }, []);
        if (on.length === 1 && on[0] === id) return selected;
      }
      selected.set(id, value ? "on" : "off");
      return selected;
    },
    in: (v, children, parents, disabled) => {
      const map = /* @__PURE__ */ new Map();
      for (const id of v || []) {
        strategy.select({
          id,
          value: true,
          selected: map,
          children,
          parents,
          disabled
        });
      }
      return map;
    },
    out: (v) => {
      const arr = [];
      for (const [key, value] of v.entries()) {
        if (value === "on") arr.push(key);
      }
      return arr;
    }
  };
  return strategy;
};
const independentSingleSelectStrategy = (mandatory) => {
  const parentStrategy = independentSelectStrategy(mandatory);
  const strategy = {
    select: ({
      selected,
      id,
      ...rest
    }) => {
      id = toRaw(id);
      const singleSelected = selected.has(id) ? /* @__PURE__ */ new Map([[id, selected.get(id)]]) : /* @__PURE__ */ new Map();
      return parentStrategy.select({
        ...rest,
        id,
        selected: singleSelected
      });
    },
    in: (v, children, parents, disabled) => {
      if (v?.length) {
        return parentStrategy.in(v.slice(0, 1), children, parents, disabled);
      }
      return /* @__PURE__ */ new Map();
    },
    out: (v, children, parents) => {
      return parentStrategy.out(v, children, parents);
    }
  };
  return strategy;
};
const leafSelectStrategy = (mandatory) => {
  const parentStrategy = independentSelectStrategy(mandatory);
  const strategy = {
    select: ({
      id,
      selected,
      children,
      ...rest
    }) => {
      id = toRaw(id);
      if (children.has(id)) return selected;
      return parentStrategy.select({
        id,
        selected,
        children,
        ...rest
      });
    },
    in: parentStrategy.in,
    out: parentStrategy.out
  };
  return strategy;
};
const leafSingleSelectStrategy = (mandatory) => {
  const parentStrategy = independentSingleSelectStrategy(mandatory);
  const strategy = {
    select: ({
      id,
      selected,
      children,
      ...rest
    }) => {
      id = toRaw(id);
      if (children.has(id)) return selected;
      return parentStrategy.select({
        id,
        selected,
        children,
        ...rest
      });
    },
    in: parentStrategy.in,
    out: parentStrategy.out
  };
  return strategy;
};
const classicSelectStrategy = (mandatory) => {
  const strategy = {
    select: ({
      id,
      value,
      selected,
      children,
      parents,
      disabled
    }) => {
      id = toRaw(id);
      const original = new Map(selected);
      const items = [id];
      while (items.length) {
        const item = items.shift();
        if (!disabled.has(item)) {
          selected.set(toRaw(item), value ? "on" : "off");
        }
        if (children.has(item)) {
          items.push(...children.get(item));
        }
      }
      let parent = toRaw(parents.get(id));
      while (parent) {
        let everySelected = true;
        let noneSelected = true;
        for (const child of children.get(parent)) {
          const cid = toRaw(child);
          if (disabled.has(cid)) continue;
          if (selected.get(cid) !== "on") everySelected = false;
          if (selected.has(cid) && selected.get(cid) !== "off") noneSelected = false;
          if (!everySelected && !noneSelected) break;
        }
        selected.set(parent, everySelected ? "on" : noneSelected ? "off" : "indeterminate");
        parent = toRaw(parents.get(parent));
      }
      if (mandatory && !value) {
        const on = Array.from(selected.entries()).reduce((arr, [key, value2]) => {
          if (value2 === "on") arr.push(key);
          return arr;
        }, []);
        if (on.length === 0) return original;
      }
      return selected;
    },
    in: (v, children, parents) => {
      let map = /* @__PURE__ */ new Map();
      for (const id of v || []) {
        map = strategy.select({
          id,
          value: true,
          selected: map,
          children,
          parents,
          disabled: /* @__PURE__ */ new Set()
        });
      }
      return map;
    },
    out: (v, children) => {
      const arr = [];
      for (const [key, value] of v.entries()) {
        if (value === "on" && !children.has(key)) arr.push(key);
      }
      return arr;
    }
  };
  return strategy;
};
const trunkSelectStrategy = (mandatory) => {
  const parentStrategy = classicSelectStrategy(mandatory);
  const strategy = {
    select: parentStrategy.select,
    in: parentStrategy.in,
    out: (v, children, parents) => {
      const arr = [];
      for (const [key, value] of v.entries()) {
        if (value === "on") {
          if (parents.has(key)) {
            const parent = parents.get(key);
            if (v.get(parent) === "on") continue;
          }
          arr.push(key);
        }
      }
      return arr;
    }
  };
  return strategy;
};
const branchSelectStrategy = (mandatory) => {
  const parentStrategy = classicSelectStrategy(mandatory);
  const strategy = {
    select: parentStrategy.select,
    in: (v, children, parents, disabled) => {
      let map = /* @__PURE__ */ new Map();
      for (const id of v || []) {
        if (children.has(id)) continue;
        map = strategy.select({
          id,
          value: true,
          selected: map,
          children,
          parents,
          disabled
        });
      }
      return map;
    },
    out: (v) => {
      const arr = [];
      for (const [key, value] of v.entries()) {
        if (value === "on" || value === "indeterminate") {
          arr.push(key);
        }
      }
      return arr;
    }
  };
  return strategy;
};
const VNestedSymbol = /* @__PURE__ */ Symbol.for("vuetify:nested");
const emptyNested = {
  id: shallowRef(),
  root: {
    itemsRegistration: ref("render"),
    register: () => null,
    unregister: () => null,
    updateDisabled: () => null,
    children: ref(/* @__PURE__ */ new Map()),
    parents: ref(/* @__PURE__ */ new Map()),
    disabled: ref(/* @__PURE__ */ new Set()),
    open: () => null,
    openOnSelect: () => null,
    activate: () => null,
    select: () => null,
    activatable: ref(false),
    scrollToActive: ref(false),
    selectable: ref(false),
    opened: ref(/* @__PURE__ */ new Set()),
    activated: ref(/* @__PURE__ */ new Set()),
    selected: ref(/* @__PURE__ */ new Map()),
    selectedValues: ref([]),
    getPath: () => []
  }
};
const makeNestedProps = propsFactory({
  activatable: Boolean,
  selectable: Boolean,
  activeStrategy: [String, Function, Object],
  selectStrategy: [String, Function, Object],
  openStrategy: [String, Object],
  opened: null,
  activated: null,
  selected: null,
  mandatory: Boolean,
  itemsRegistration: {
    type: String,
    default: "render"
  }
}, "nested");
const useNested = (props, {
  items,
  returnObject,
  scrollToActive,
  valueComparator
}) => {
  const children = shallowRef(/* @__PURE__ */ new Map());
  const parents = shallowRef(/* @__PURE__ */ new Map());
  const disabled = shallowRef(/* @__PURE__ */ new Set());
  const opened = useProxiedModel(props, "opened", props.opened, (v) => new Set(Array.isArray(v) ? v.map((i) => toRaw(i)) : v), (v) => [...v.values()]);
  const activeStrategy = computed(() => {
    if (typeof props.activeStrategy === "object") return props.activeStrategy;
    if (typeof props.activeStrategy === "function") return props.activeStrategy(props.mandatory);
    switch (props.activeStrategy) {
      case "leaf":
        return leafActiveStrategy(props.mandatory);
      case "single-leaf":
        return leafSingleActiveStrategy(props.mandatory);
      case "independent":
        return independentActiveStrategy(props.mandatory);
      case "single-independent":
      default:
        return independentSingleActiveStrategy(props.mandatory);
    }
  });
  const selectStrategy = computed(() => {
    if (typeof props.selectStrategy === "object") return props.selectStrategy;
    if (typeof props.selectStrategy === "function") return props.selectStrategy(props.mandatory);
    switch (props.selectStrategy) {
      case "single-leaf":
        return leafSingleSelectStrategy(props.mandatory);
      case "leaf":
        return leafSelectStrategy(props.mandatory);
      case "independent":
        return independentSelectStrategy(props.mandatory);
      case "single-independent":
        return independentSingleSelectStrategy(props.mandatory);
      case "trunk":
        return trunkSelectStrategy(props.mandatory);
      case "branch":
        return branchSelectStrategy(props.mandatory);
      case "classic":
      default:
        return classicSelectStrategy(props.mandatory);
    }
  });
  const openStrategy = computed(() => {
    if (typeof props.openStrategy === "object") return props.openStrategy;
    switch (props.openStrategy) {
      case "list":
        return listOpenStrategy;
      case "single":
        return singleOpenStrategy;
      case "multiple":
      default:
        return multipleOpenStrategy;
    }
  });
  const flatItems = computed(() => {
    const flat = [];
    const stack = [...items.value];
    while (stack.length) {
      const item = stack.pop();
      flat.push(item);
      if (item.children) stack.push(...item.children);
    }
    return flat;
  });
  function resolveValue(value) {
    const comparator = toValue(valueComparator);
    if (!comparator) return value;
    const _returnObject = toValue(returnObject);
    for (const item of flatItems.value) {
      const itemVal = _returnObject ? toRaw(item.raw) : item.value;
      if (comparator(value, itemVal)) return itemVal;
    }
    return value;
  }
  const activated = useProxiedModel(props, "activated", props.activated, (v) => activeStrategy.value.in(Array.isArray(v) ? v.map(resolveValue) : v, children.value, parents.value), (v) => activeStrategy.value.out(v, children.value, parents.value));
  const selected = useProxiedModel(props, "selected", props.selected, (v) => selectStrategy.value.in(Array.isArray(v) ? v.map(resolveValue) : v, children.value, parents.value, disabled.value), (v) => selectStrategy.value.out(v, children.value, parents.value));
  function getPath(id) {
    const path = [];
    let parent = toRaw(id);
    while (parent !== void 0) {
      path.unshift(parent);
      parent = parents.value.get(parent);
    }
    return path;
  }
  const vm = getCurrentInstance("nested");
  const nodeIds = /* @__PURE__ */ new Set();
  const itemsUpdatePropagation = throttle(() => {
    nextTick(() => {
      children.value = new Map(children.value);
      parents.value = new Map(parents.value);
    });
  }, 100);
  watch(() => [items.value, toValue(returnObject)], () => {
    if (props.itemsRegistration === "props") {
      updateInternalMaps();
    }
  }, {
    immediate: true
  });
  function updateInternalMaps() {
    const _parents = /* @__PURE__ */ new Map();
    const _children = /* @__PURE__ */ new Map();
    const _disabled = /* @__PURE__ */ new Set();
    const getValue = toValue(returnObject) ? (item) => toRaw(item.raw) : (item) => item.value;
    const stack = [...items.value];
    let i = 0;
    while (i < stack.length) {
      const item = stack[i++];
      const itemValue = getValue(item);
      if (item.children) {
        const childValues = [];
        for (const child of item.children) {
          const childValue = getValue(child);
          _parents.set(childValue, itemValue);
          childValues.push(childValue);
          stack.push(child);
        }
        _children.set(itemValue, childValues);
      }
      if (item.props.disabled) {
        _disabled.add(itemValue);
      }
    }
    children.value = _children;
    parents.value = _parents;
    disabled.value = _disabled;
  }
  const nested = {
    id: shallowRef(),
    root: {
      opened,
      activatable: toRef(() => props.activatable),
      scrollToActive: toRef(() => toValue(scrollToActive)),
      selectable: toRef(() => props.selectable),
      activated,
      selected,
      selectedValues: computed(() => {
        const arr = [];
        for (const [key, value] of selected.value.entries()) {
          if (value === "on") arr.push(key);
        }
        return arr;
      }),
      itemsRegistration: toRef(() => props.itemsRegistration),
      register: (id, parentId, isDisabled, isGroup) => {
        if (nodeIds.has(id)) {
          const path = getPath(id).map(String).join(" -> ");
          const newPath = getPath(parentId).concat(id).map(String).join(" -> ");
          consoleError(`Multiple nodes with the same ID
	${path}
	${newPath}`);
          return;
        } else {
          nodeIds.add(id);
        }
        parentId && id !== parentId && parents.value.set(id, parentId);
        isDisabled && disabled.value.add(id);
        isGroup && children.value.set(id, []);
        if (parentId != null) {
          children.value.set(parentId, [...children.value.get(parentId) || [], id]);
        }
        itemsUpdatePropagation();
      },
      unregister: (id) => {
        nodeIds.delete(id);
        children.value.delete(id);
        disabled.value.delete(id);
        const parent = parents.value.get(id);
        if (parent) {
          const list = children.value.get(parent) ?? [];
          children.value.set(parent, list.filter((child) => child !== id));
        }
        parents.value.delete(id);
        itemsUpdatePropagation();
      },
      updateDisabled: (id, isDisabled) => {
        if (isDisabled) {
          disabled.value.add(id);
        } else {
          disabled.value.delete(id);
        }
      },
      open: (id, value, event) => {
        vm.emit("click:open", {
          id,
          value,
          path: getPath(id),
          event
        });
        const newOpened = openStrategy.value.open({
          id,
          value,
          opened: new Set(opened.value),
          children: children.value,
          parents: parents.value,
          event
        });
        newOpened && (opened.value = newOpened);
      },
      openOnSelect: (id, value, event) => {
        const newOpened = openStrategy.value.select({
          id,
          value,
          selected: new Map(selected.value),
          opened: new Set(opened.value),
          children: children.value,
          parents: parents.value,
          event
        });
        newOpened && (opened.value = newOpened);
      },
      select: (id, value, event) => {
        vm.emit("click:select", {
          id,
          value,
          path: getPath(id),
          event
        });
        const newSelected = selectStrategy.value.select({
          id,
          value,
          selected: new Map(selected.value),
          children: children.value,
          parents: parents.value,
          disabled: disabled.value,
          event
        });
        newSelected && (selected.value = newSelected);
        nested.root.openOnSelect(id, value, event);
      },
      activate: (id, value, event) => {
        if (!props.activatable) {
          return nested.root.select(id, true, event);
        }
        vm.emit("click:activate", {
          id,
          value,
          path: getPath(id),
          event
        });
        const newActivated = activeStrategy.value.activate({
          id,
          value,
          activated: new Set(activated.value),
          children: children.value,
          parents: parents.value,
          event
        });
        if (newActivated.size !== activated.value.size) {
          activated.value = newActivated;
        } else {
          for (const value2 of newActivated) {
            if (!activated.value.has(value2)) {
              activated.value = newActivated;
              return;
            }
          }
          for (const value2 of activated.value) {
            if (!newActivated.has(value2)) {
              activated.value = newActivated;
              return;
            }
          }
        }
      },
      children,
      parents,
      disabled,
      getPath
    }
  };
  provide(VNestedSymbol, nested);
  return nested.root;
};
const useNestedItem = (id, isDisabled, isGroup) => {
  const parent = inject(VNestedSymbol, emptyNested);
  const uidSymbol = /* @__PURE__ */ Symbol("nested item");
  const computedId = computed(() => {
    const idValue = toRaw(toValue(id));
    return idValue !== void 0 ? idValue : uidSymbol;
  });
  const item = {
    ...parent,
    id: computedId,
    open: (open, e) => parent.root.open(computedId.value, open, e),
    openOnSelect: (open, e) => parent.root.openOnSelect(computedId.value, open, e),
    isOpen: computed(() => parent.root.opened.value.has(computedId.value)),
    parent: computed(() => parent.root.parents.value.get(computedId.value)),
    activate: (activated, e) => parent.root.activate(computedId.value, activated, e),
    isActivated: computed(() => parent.root.activated.value.has(computedId.value)),
    scrollToActive: parent.root.scrollToActive,
    select: (selected, e) => parent.root.select(computedId.value, selected, e),
    isSelected: computed(() => parent.root.selected.value.get(computedId.value) === "on"),
    isIndeterminate: computed(() => parent.root.selected.value.get(computedId.value) === "indeterminate"),
    isLeaf: computed(() => !parent.root.children.value.get(computedId.value)),
    isGroupActivator: parent.isGroupActivator
  };
  watch(computedId, (val, oldVal) => {
    if (parent.isGroupActivator || parent.root.itemsRegistration.value === "props") return;
    parent.root.unregister(oldVal);
    nextTick(() => {
      parent.root.register(val, parent.id.value, toValue(isDisabled), isGroup);
    });
  });
  watch(() => toValue(isDisabled), (val) => {
    parent.root.updateDisabled(computedId.value, val);
  });
  isGroup && provide(VNestedSymbol, item);
  return item;
};
const useNestedGroupActivator = () => {
  const parent = inject(VNestedSymbol, emptyNested);
  provide(VNestedSymbol, {
    ...parent,
    isGroupActivator: true
  });
};
function useSsrBoot() {
  const isBooted = shallowRef(false);
  const ssrBootStyles = toRef(() => !isBooted.value ? {
    transition: "none !important"
  } : void 0);
  return {
    ssrBootStyles,
    isBooted: readonly(isBooted)
  };
}
const makeTransitionProps = propsFactory({
  transition: {
    type: null,
    default: "fade-transition",
    validator: (val) => val !== true
  }
}, "transition");
const MaybeTransition = (props, {
  slots
}) => {
  const {
    transition,
    disabled,
    group,
    ...rest
  } = props;
  const {
    component = group ? TransitionGroup : Transition,
    ...customProps
  } = isObject(transition) ? transition : {};
  let transitionProps;
  if (isObject(transition)) {
    transitionProps = mergeProps(customProps, onlyDefinedProps({
      disabled,
      group
    }), rest);
  } else {
    transitionProps = mergeProps({
      name: disabled || !transition ? "" : transition
    }, rest);
  }
  return h(component, transitionProps, slots);
};
const VListGroupActivator = defineComponent$1({
  name: "VListGroupActivator",
  setup(_, {
    slots
  }) {
    useNestedGroupActivator();
    return () => slots.default?.();
  }
});
const makeVListGroupProps = propsFactory({
  /* @deprecated */
  activeColor: String,
  baseColor: String,
  color: String,
  collapseIcon: {
    type: IconValue,
    default: "$collapse"
  },
  disabled: Boolean,
  expandIcon: {
    type: IconValue,
    default: "$expand"
  },
  rawId: [String, Number],
  prependIcon: IconValue,
  appendIcon: IconValue,
  fluid: Boolean,
  subgroup: Boolean,
  title: String,
  value: null,
  ...makeComponentProps(),
  ...makeTagProps()
}, "VListGroup");
const VListGroup = genericComponent()({
  name: "VListGroup",
  props: makeVListGroupProps(),
  setup(props, {
    slots
  }) {
    const {
      isOpen,
      open,
      id: _id
    } = useNestedItem(() => props.value, () => props.disabled, true);
    const id = computed(() => `v-list-group--id-${String(props.rawId ?? _id.value)}`);
    const list = useList();
    const {
      isBooted
    } = useSsrBoot();
    const parent = inject(VNestedSymbol);
    const renderWhenClosed = toRef(() => parent?.root?.itemsRegistration.value === "render");
    function onClick(e) {
      if (["INPUT", "TEXTAREA"].includes(e.target?.tagName)) return;
      open(!isOpen.value, e);
    }
    const activatorProps = computed(() => ({
      onClick,
      class: "v-list-group__header",
      id: id.value
    }));
    const toggleIcon = computed(() => isOpen.value ? props.collapseIcon : props.expandIcon);
    const activatorDefaults = computed(() => ({
      VListItem: {
        activeColor: props.activeColor,
        baseColor: props.baseColor,
        color: props.color,
        prependIcon: props.prependIcon || props.subgroup && toggleIcon.value,
        appendIcon: props.appendIcon || !props.subgroup && toggleIcon.value,
        title: props.title,
        value: props.value
      }
    }));
    useRender(() => createVNode(props.tag, {
      "class": normalizeClass(["v-list-group", {
        "v-list-group--prepend": list?.hasPrepend.value,
        "v-list-group--fluid": props.fluid,
        "v-list-group--subgroup": props.subgroup,
        "v-list-group--open": isOpen.value
      }, props.class]),
      "style": normalizeStyle(props.style)
    }, {
      default: () => [slots.activator && createVNode(VDefaultsProvider, {
        "defaults": activatorDefaults.value
      }, {
        default: () => [createVNode(VListGroupActivator, null, {
          default: () => [slots.activator({
            props: activatorProps.value,
            isOpen: isOpen.value
          })]
        })]
      }), createVNode(MaybeTransition, {
        "transition": {
          component: VExpandTransition
        },
        "disabled": !isBooted.value
      }, {
        default: () => [renderWhenClosed.value ? withDirectives(createElementVNode("div", {
          "class": "v-list-group__items",
          "role": "group",
          "aria-labelledby": id.value
        }, [slots.default?.()]), [[vShow, isOpen.value]]) : isOpen.value && createElementVNode("div", {
          "class": "v-list-group__items",
          "role": "group",
          "aria-labelledby": id.value
        }, [slots.default?.()])]
      })]
    }));
    return {
      isOpen
    };
  }
});
const makeVListItemSubtitleProps = propsFactory({
  opacity: [Number, String],
  ...makeComponentProps(),
  ...makeTagProps()
}, "VListItemSubtitle");
const VListItemSubtitle = genericComponent()({
  name: "VListItemSubtitle",
  props: makeVListItemSubtitleProps(),
  setup(props, {
    slots
  }) {
    useRender(() => createVNode(props.tag, {
      "class": normalizeClass(["v-list-item-subtitle", props.class]),
      "style": normalizeStyle([{
        "--v-list-item-subtitle-opacity": props.opacity
      }, props.style])
    }, slots));
    return {};
  }
});
const VListItemTitle = createSimpleFunctional("v-list-item-title");
const makeVBadgeProps = propsFactory({
  bordered: Boolean,
  color: String,
  content: [Number, String],
  dot: Boolean,
  dotSize: [Number, String],
  floating: Boolean,
  icon: IconValue,
  inline: Boolean,
  label: {
    type: String,
    default: "$vuetify.badge"
  },
  max: [Number, String],
  modelValue: {
    type: Boolean,
    default: true
  },
  offsetX: [Number, String],
  offsetY: [Number, String],
  textColor: String,
  ...makeComponentProps(),
  ...makeLocationProps({
    location: "top end"
  }),
  ...makeRoundedProps(),
  ...makeTagProps(),
  ...makeThemeProps(),
  ...makeTransitionProps({
    transition: "scale-rotate-transition"
  }),
  ...makeDimensionProps()
}, "VBadge");
const VBadge = genericComponent()({
  name: "VBadge",
  inheritAttrs: false,
  props: makeVBadgeProps(),
  setup(props, ctx) {
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(() => props.color);
    const {
      roundedClasses
    } = useRounded(props);
    const {
      t
    } = useLocale();
    const {
      textColorClasses,
      textColorStyles
    } = useTextColor(() => props.textColor);
    const {
      themeClasses
    } = useTheme();
    const {
      locationStyles
    } = useLocation(props, true, (side) => {
      const base = props.floating ? props.dot ? 2 : 4 : props.dot ? Number(props.dotSize ?? 8) : 12;
      return base + (["top", "bottom"].includes(side) ? Number(props.offsetY ?? 0) : ["left", "right"].includes(side) ? Number(props.offsetX ?? 0) : 0);
    });
    const {
      dimensionStyles
    } = useDimension(props);
    useRender(() => {
      const value = Number(props.content);
      const content = !props.max || isNaN(value) ? props.content : value <= Number(props.max) ? value : `${props.max}+`;
      const [badgeAttrs, attrs] = pickWithRest(ctx.attrs, ["aria-atomic", "aria-label", "aria-live", "role", "title"]);
      return createVNode(props.tag, mergeProps({
        "class": ["v-badge", {
          "v-badge--bordered": props.bordered,
          "v-badge--dot": props.dot,
          "v-badge--floating": props.floating,
          "v-badge--inline": props.inline
        }, props.class]
      }, attrs, {
        "style": props.style
      }), {
        default: () => [createElementVNode("div", {
          "class": "v-badge__wrapper"
        }, [ctx.slots.default?.(), createVNode(MaybeTransition, {
          "transition": props.transition
        }, {
          default: () => [withDirectives(createElementVNode("span", mergeProps({
            "class": ["v-badge__badge", themeClasses.value, backgroundColorClasses.value, roundedClasses.value, textColorClasses.value],
            "style": [backgroundColorStyles.value, textColorStyles.value, dimensionStyles.value, props.inline ? {} : locationStyles.value, props.dot && props.dotSize ? {
              width: convertToUnit(props.dotSize),
              height: convertToUnit(props.dotSize)
            } : {}],
            "aria-atomic": "true",
            "aria-label": t(props.label, value),
            "aria-live": "polite",
            "role": "status"
          }, badgeAttrs), [props.dot ? void 0 : ctx.slots.badge ? ctx.slots.badge?.() : props.icon ? createVNode(VIcon, {
            "icon": props.icon
          }, null) : content]), [[vShow, props.modelValue]])]
        })])]
      });
    });
    return {};
  }
});
function useAspectStyles(props) {
  return {
    aspectStyles: computed(() => {
      const ratio = Number(props.aspectRatio);
      return ratio ? {
        paddingBottom: String(1 / ratio * 100) + "%"
      } : void 0;
    })
  };
}
const makeVResponsiveProps = propsFactory({
  aspectRatio: [String, Number],
  contentClass: null,
  inline: Boolean,
  ...makeComponentProps(),
  ...makeDimensionProps()
}, "VResponsive");
const VResponsive = genericComponent()({
  name: "VResponsive",
  props: makeVResponsiveProps(),
  setup(props, {
    slots
  }) {
    const {
      aspectStyles
    } = useAspectStyles(props);
    const {
      dimensionStyles
    } = useDimension(props);
    useRender(() => createElementVNode("div", {
      "class": normalizeClass(["v-responsive", {
        "v-responsive--inline": props.inline
      }, props.class]),
      "style": normalizeStyle([dimensionStyles.value, props.style])
    }, [createElementVNode("div", {
      "class": "v-responsive__sizer",
      "style": normalizeStyle(aspectStyles.value)
    }, null), slots.additional?.(), slots.default && createElementVNode("div", {
      "class": normalizeClass(["v-responsive__content", props.contentClass])
    }, [slots.default()])]));
    return {};
  }
});
function mounted(el, binding) {
  return;
}
function unmounted(el, binding) {
  const observe = el._observe?.[binding.instance.$.uid];
  if (!observe) return;
  observe.observer.unobserve(el);
  delete el._observe[binding.instance.$.uid];
}
const Intersect = {
  mounted,
  unmounted,
  updated: (el, binding) => {
    if (el._observe?.[binding.instance.$.uid]) {
      unmounted(el, binding);
    }
  }
};
const makeVImgProps = propsFactory({
  absolute: Boolean,
  alt: String,
  cover: Boolean,
  color: String,
  draggable: {
    type: [Boolean, String],
    default: void 0
  },
  eager: Boolean,
  gradient: String,
  imageClass: null,
  lazySrc: String,
  options: {
    type: Object,
    // For more information on types, navigate to:
    // https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
    default: () => ({
      root: void 0,
      rootMargin: void 0,
      threshold: void 0
    })
  },
  sizes: String,
  src: {
    type: [String, Object],
    default: ""
  },
  crossorigin: String,
  referrerpolicy: String,
  srcset: String,
  position: String,
  ...makeVResponsiveProps(),
  ...makeComponentProps(),
  ...makeRoundedProps(),
  ...makeTransitionProps()
}, "VImg");
const VImg = genericComponent()({
  name: "VImg",
  directives: {
    vIntersect: Intersect
  },
  inheritAttrs: false,
  props: makeVImgProps(),
  emits: {
    loadstart: (value) => true,
    load: (value) => true,
    error: (value) => true
  },
  setup(props, {
    attrs,
    emit,
    slots
  }) {
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(() => props.color);
    const {
      roundedClasses
    } = useRounded(props);
    const vm = getCurrentInstance("VImg");
    const currentSrc = shallowRef("");
    const image = ref();
    const state = shallowRef(props.eager ? "loading" : "idle");
    const naturalWidth = shallowRef();
    const naturalHeight = shallowRef();
    const normalisedSrc = computed(() => {
      return props.src && typeof props.src === "object" ? {
        src: props.src.src,
        srcset: props.srcset || props.src.srcset,
        lazySrc: props.lazySrc || props.src.lazySrc,
        aspect: Number(props.aspectRatio || props.src.aspect || 0)
      } : {
        src: props.src,
        srcset: props.srcset,
        lazySrc: props.lazySrc,
        aspect: Number(props.aspectRatio || 0)
      };
    });
    const aspectRatio = computed(() => {
      return normalisedSrc.value.aspect || naturalWidth.value / naturalHeight.value || 0;
    });
    watch(() => props.src, () => {
      init(state.value !== "idle");
    });
    watch(aspectRatio, (val, oldVal) => {
      if (!val && oldVal && image.value) {
        pollForSize(image.value);
      }
    });
    function init(isIntersecting) {
      if (props.eager && isIntersecting) return;
      state.value = "loading";
      if (normalisedSrc.value.lazySrc) {
        const lazyImg = new Image();
        lazyImg.src = normalisedSrc.value.lazySrc;
        pollForSize(lazyImg, null);
      }
      if (!normalisedSrc.value.src) return;
      nextTick(() => {
        emit("loadstart", image.value?.currentSrc || normalisedSrc.value.src);
        setTimeout(() => {
          if (vm.isUnmounted) return;
          if (image.value?.complete) {
            if (!image.value.naturalWidth) {
              onError();
            }
            if (state.value === "error") return;
            if (!aspectRatio.value) pollForSize(image.value, null);
            if (state.value === "loading") onLoad();
          } else {
            if (!aspectRatio.value) pollForSize(image.value);
            getSrc();
          }
        });
      });
    }
    function onLoad() {
      if (vm.isUnmounted) return;
      getSrc();
      pollForSize(image.value);
      state.value = "loaded";
      emit("load", image.value?.currentSrc || normalisedSrc.value.src);
    }
    function onError() {
      if (vm.isUnmounted) return;
      state.value = "error";
      emit("error", image.value?.currentSrc || normalisedSrc.value.src);
    }
    function getSrc() {
      const img = image.value;
      if (img) currentSrc.value = img.currentSrc || img.src;
    }
    let timer = -1;
    function pollForSize(img, timeout = 100) {
      const poll = () => {
        clearTimeout(timer);
        if (vm.isUnmounted) return;
        const {
          naturalHeight: imgHeight,
          naturalWidth: imgWidth
        } = img;
        if (imgHeight || imgWidth) {
          naturalWidth.value = imgWidth;
          naturalHeight.value = imgHeight;
        } else if (!img.complete && state.value === "loading" && timeout != null) {
          timer = (void 0).setTimeout(poll, timeout);
        } else if (img.currentSrc.endsWith(".svg") || img.currentSrc.startsWith("data:image/svg+xml")) {
          naturalWidth.value = 1;
          naturalHeight.value = 1;
        }
      };
      poll();
    }
    const containClasses = toRef(() => ({
      "v-img__img--cover": props.cover,
      "v-img__img--contain": !props.cover
    }));
    const __image = () => {
      if (!normalisedSrc.value.src || state.value === "idle") return null;
      const img = createElementVNode("img", {
        "class": normalizeClass(["v-img__img", containClasses.value, props.imageClass]),
        "style": {
          objectPosition: props.position
        },
        "crossorigin": props.crossorigin,
        "src": normalisedSrc.value.src,
        "srcset": normalisedSrc.value.srcset,
        "alt": props.alt,
        "referrerpolicy": props.referrerpolicy,
        "draggable": props.draggable,
        "sizes": props.sizes,
        "ref": image,
        "onLoad": onLoad,
        "onError": onError
      }, null);
      const sources = slots.sources?.();
      return createVNode(MaybeTransition, {
        "transition": props.transition,
        "appear": true
      }, {
        default: () => [withDirectives(sources ? createElementVNode("picture", {
          "class": "v-img__picture"
        }, [sources, img]) : img, [[vShow, state.value === "loaded"]])]
      });
    };
    const __preloadImage = () => createVNode(MaybeTransition, {
      "transition": props.transition
    }, {
      default: () => [normalisedSrc.value.lazySrc && state.value !== "loaded" && createElementVNode("img", {
        "class": normalizeClass(["v-img__img", "v-img__img--preload", containClasses.value]),
        "style": {
          objectPosition: props.position
        },
        "crossorigin": props.crossorigin,
        "src": normalisedSrc.value.lazySrc,
        "alt": props.alt,
        "referrerpolicy": props.referrerpolicy,
        "draggable": props.draggable
      }, null)]
    });
    const __placeholder = () => {
      if (!slots.placeholder) return null;
      return createVNode(MaybeTransition, {
        "transition": props.transition,
        "appear": true
      }, {
        default: () => [(state.value === "loading" || state.value === "error" && !slots.error) && createElementVNode("div", {
          "class": "v-img__placeholder"
        }, [slots.placeholder()])]
      });
    };
    const __error = () => {
      if (!slots.error) return null;
      return createVNode(MaybeTransition, {
        "transition": props.transition,
        "appear": true
      }, {
        default: () => [state.value === "error" && createElementVNode("div", {
          "class": "v-img__error"
        }, [slots.error()])]
      });
    };
    const __gradient = () => {
      if (!props.gradient) return null;
      return createElementVNode("div", {
        "class": "v-img__gradient",
        "style": {
          backgroundImage: `linear-gradient(${props.gradient})`
        }
      }, null);
    };
    const isBooted = shallowRef(false);
    {
      const stop = watch(aspectRatio, (val) => {
        if (val) {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              isBooted.value = true;
            });
          });
          stop();
        }
      });
    }
    useRender(() => {
      const responsiveProps = VResponsive.filterProps(props);
      const [rootAttrs, imageAttrs] = filterInputAttrs(attrs);
      return withDirectives(createVNode(VResponsive, mergeProps({
        "class": ["v-img", {
          "v-img--absolute": props.absolute,
          "v-img--booting": !isBooted.value,
          "v-img--fit-content": props.width === "fit-content"
        }, backgroundColorClasses.value, roundedClasses.value, props.class],
        "style": [{
          width: convertToUnit(props.width === "auto" ? naturalWidth.value : props.width)
        }, backgroundColorStyles.value, props.style]
      }, responsiveProps, rootAttrs, {
        "aspectRatio": aspectRatio.value,
        "aria-label": props.alt,
        "role": props.alt ? "img" : void 0
      }), {
        additional: () => createElementVNode(Fragment, null, [createVNode(__image, imageAttrs, null), createVNode(__preloadImage, null, null), createVNode(__gradient, null, null), createVNode(__placeholder, null, null), createVNode(__error, null, null)]),
        default: slots.default
      }), [[Intersect, {
        handler: init,
        options: props.options
      }, null, {
        once: true
      }]]);
    });
    return {
      currentSrc,
      image,
      state,
      naturalWidth,
      naturalHeight
    };
  }
});
const makeVAvatarProps = propsFactory({
  badge: {
    type: [Boolean, Object],
    default: false
  },
  start: Boolean,
  end: Boolean,
  icon: IconValue,
  image: String,
  text: String,
  ...makeBorderProps(),
  ...makeComponentProps(),
  ...makeDensityProps(),
  ...makeRoundedProps(),
  ...makeSizeProps(),
  ...makeTagProps(),
  ...makeThemeProps(),
  ...makeVariantProps({
    variant: "flat"
  })
}, "VAvatar");
const VAvatar = genericComponent()({
  name: "VAvatar",
  props: makeVAvatarProps(),
  setup(props, {
    slots
  }) {
    const {
      themeClasses
    } = provideTheme(props);
    const {
      borderClasses
    } = useBorder(props);
    const {
      colorClasses,
      colorStyles,
      variantClasses
    } = useVariant(props);
    const {
      densityClasses
    } = useDensity(props);
    const {
      roundedClasses
    } = useRounded(props);
    const {
      sizeClasses,
      sizeStyles
    } = useSize(props);
    const badgeDotSize = computed(() => {
      switch (props.size) {
        case "x-small":
          return 8;
        case "small":
          return 10;
        case "large":
          return 14;
        case "x-large":
          return 16;
        default:
          return 12;
      }
    });
    const badgeOffset = computed(() => {
      const {
        floating
      } = isObject(props.badge) ? props.badge : {};
      return (floating ? badgeDotSize.value / 2 : 0) - 1.5;
    });
    const badgeProps = computed(() => {
      return {
        bordered: true,
        dot: !slots.badge,
        dotSize: badgeDotSize.value,
        offsetX: badgeOffset.value,
        offsetY: badgeOffset.value,
        color: typeof props.badge === "string" ? props.badge : "primary",
        ...isObject(props.badge) ? props.badge : {}
      };
    });
    useRender(() => {
      const avatar = createVNode(props.tag, {
        "class": normalizeClass(["v-avatar", {
          "v-avatar--start": props.start,
          "v-avatar--end": props.end
        }, themeClasses.value, borderClasses.value, colorClasses.value, densityClasses.value, roundedClasses.value, sizeClasses.value, variantClasses.value, props.class]),
        "style": normalizeStyle([colorStyles.value, sizeStyles.value, props.style])
      }, {
        default: () => [!slots.default ? props.image ? createVNode(VImg, {
          "key": "image",
          "src": props.image,
          "alt": "",
          "cover": true
        }, null) : props.icon ? createVNode(VIcon, {
          "key": "icon",
          "icon": props.icon
        }, null) : props.text : createVNode(VDefaultsProvider, {
          "key": "content-defaults",
          "defaults": {
            VImg: {
              cover: true,
              src: props.image
            },
            VIcon: {
              icon: props.icon
            }
          }
        }, {
          default: () => [slots.default()]
        }), genOverlays(false, "v-avatar")]
      });
      return props.badge ? createVNode(VBadge, badgeProps.value, {
        default: () => avatar,
        badge: slots.badge
      }) : avatar;
    });
    return {};
  }
});
const makeVListItemProps = propsFactory({
  active: {
    type: Boolean,
    default: void 0
  },
  activeClass: String,
  /* @deprecated */
  activeColor: String,
  appendAvatar: String,
  appendIcon: IconValue,
  baseColor: String,
  disabled: Boolean,
  lines: [Boolean, String],
  link: {
    type: Boolean,
    default: void 0
  },
  nav: Boolean,
  prependAvatar: String,
  prependIcon: IconValue,
  ripple: {
    type: [Boolean, Object],
    default: true
  },
  slim: Boolean,
  prependGap: [Number, String],
  subtitle: {
    type: [String, Number, Boolean],
    default: void 0
  },
  title: {
    type: [String, Number, Boolean],
    default: void 0
  },
  value: null,
  index: Number,
  tabindex: [Number, String],
  onClick: EventProp(),
  onClickOnce: EventProp(),
  ...makeBorderProps(),
  ...makeComponentProps(),
  ...makeDensityProps(),
  ...makeDimensionProps(),
  ...makeElevationProps(),
  ...makeRoundedProps(),
  ...makeRouterProps(),
  ...makeTagProps(),
  ...makeThemeProps(),
  ...makeVariantProps({
    variant: "text"
  })
}, "VListItem");
const VListItem = genericComponent()({
  name: "VListItem",
  directives: {
    vRipple: Ripple
  },
  props: makeVListItemProps(),
  emits: {
    click: (e) => true
  },
  setup(props, {
    attrs,
    slots,
    emit
  }) {
    const link = useLink(props, attrs);
    const rootEl = ref();
    const id = computed(() => props.value === void 0 ? link.href.value : props.value);
    const {
      activate,
      isActivated,
      select,
      isOpen,
      isSelected,
      isIndeterminate,
      isGroupActivator,
      root,
      parent,
      openOnSelect,
      scrollToActive,
      id: uid
    } = useNestedItem(id, () => props.disabled, false);
    const list = useList();
    const isActive = computed(() => props.active !== false && (props.active || link.isActive?.value || (root.activatable.value ? isActivated.value : isSelected.value)));
    const isLink = toRef(() => props.link !== false && link.isLink.value);
    const isSelectable = computed(() => !!list && (root.selectable.value || root.activatable.value || props.value != null));
    const isClickable = computed(() => !props.disabled && props.link !== false && (props.link || link.isClickable.value || isSelectable.value));
    const isTracked = computed(() => list && list.navigationStrategy.value === "track" && props.index !== void 0 && list.trackingIndex.value === props.index);
    const role = computed(() => list ? isLink.value ? "link" : isSelectable.value ? "option" : "listitem" : void 0);
    const ariaSelected = computed(() => {
      if (!isSelectable.value) return void 0;
      return root.activatable.value ? isActivated.value : root.selectable.value ? isSelected.value : isActive.value;
    });
    const roundedProps = toRef(() => props.rounded || props.nav);
    const color = toRef(() => props.color ?? props.activeColor);
    const variantProps = toRef(() => ({
      color: isActive.value ? color.value ?? props.baseColor : props.baseColor,
      variant: props.variant
    }));
    watch(() => link.isActive?.value, (val) => {
      if (!val) return;
      handleActiveLink();
    });
    watch(isActivated, (val) => {
      if (!val || !scrollToActive) return;
      rootEl.value?.scrollIntoView({
        block: "nearest",
        behavior: "instant"
      });
    });
    watch(isTracked, (val) => {
      if (!val) return;
      rootEl.value?.scrollIntoView({
        block: "nearest",
        behavior: "instant"
      });
    });
    function handleActiveLink() {
      if (parent.value != null) {
        root.open(parent.value, true);
      }
      openOnSelect(true);
    }
    const {
      themeClasses
    } = provideTheme(props);
    const {
      borderClasses
    } = useBorder(props);
    const {
      colorClasses,
      colorStyles,
      variantClasses
    } = useVariant(variantProps);
    const {
      densityClasses
    } = useDensity(props);
    const {
      dimensionStyles
    } = useDimension(props);
    const {
      elevationClasses
    } = useElevation(props);
    const {
      roundedClasses
    } = useRounded(roundedProps);
    const lineClasses = toRef(() => props.lines ? `v-list-item--${props.lines}-line` : void 0);
    const rippleOptions = toRef(() => props.ripple !== void 0 && !!props.ripple && list?.filterable ? {
      keys: ["Enter"]
    } : props.ripple);
    const slotProps = computed(() => ({
      isActive: isActive.value,
      select,
      isOpen: isOpen.value,
      isSelected: isSelected.value,
      isIndeterminate: isIndeterminate.value,
      isDisabled: props.disabled
    }));
    function onClick(e) {
      emit("click", e);
      if (["INPUT", "TEXTAREA"].includes(e.target?.tagName)) return;
      if (!isClickable.value) return;
      link.navigate.value?.(e);
      if (isGroupActivator) return;
      if (root.activatable.value) {
        activate(!isActivated.value, e);
      } else if (root.selectable.value) {
        select(!isSelected.value, e);
      } else if (props.value != null && !isLink.value) {
        select(!isSelected.value, e);
      }
    }
    function onKeyDown(e) {
      const target = e.target;
      if (["INPUT", "TEXTAREA"].includes(target.tagName)) return;
      if (e.key === "Enter" || e.key === " " && !list?.filterable) {
        e.preventDefault();
        e.stopPropagation();
        e.target.dispatchEvent(new MouseEvent("click", e));
      }
    }
    useRender(() => {
      const Tag = isLink.value ? "a" : props.tag;
      const hasTitle = slots.title || props.title != null;
      const hasSubtitle = slots.subtitle || props.subtitle != null;
      const hasAppendMedia = !!(props.appendAvatar || props.appendIcon);
      const hasAppend = !!(hasAppendMedia || slots.append);
      const hasPrependMedia = !!(props.prependAvatar || props.prependIcon);
      const hasPrepend = !!(hasPrependMedia || slots.prepend);
      list?.updateHasPrepend(hasPrepend);
      if (props.activeColor) {
        deprecate("active-color", ["color", "base-color"]);
      }
      return withDirectives(createVNode(Tag, mergeProps(link.linkProps, {
        "ref": rootEl,
        "id": props.index !== void 0 && list ? `v-list-item-${list.uid}-${props.index}` : void 0,
        "class": ["v-list-item", {
          "v-list-item--active": isActive.value,
          "v-list-item--disabled": props.disabled,
          "v-list-item--link": isClickable.value,
          "v-list-item--nav": props.nav,
          "v-list-item--prepend": !hasPrepend && list?.hasPrepend.value,
          "v-list-item--slim": props.slim,
          "v-list-item--focus-visible": isTracked.value,
          [`${props.activeClass}`]: props.activeClass && isActive.value
        }, themeClasses.value, borderClasses.value, colorClasses.value, densityClasses.value, elevationClasses.value, lineClasses.value, roundedClasses.value, variantClasses.value, props.class],
        "style": [{
          "--v-list-prepend-gap": convertToUnit(props.prependGap)
        }, colorStyles.value, dimensionStyles.value, props.style],
        "tabindex": props.tabindex ?? (isClickable.value ? list ? -2 : 0 : void 0),
        "aria-selected": ariaSelected.value,
        "role": role.value,
        "onClick": onClick,
        "onKeydown": isClickable.value && !isLink.value && onKeyDown
      }), {
        default: () => [genOverlays(isClickable.value || isActive.value, "v-list-item"), hasPrepend && createElementVNode("div", {
          "key": "prepend",
          "class": "v-list-item__prepend"
        }, [!slots.prepend ? createElementVNode(Fragment, null, [props.prependAvatar && createVNode(VAvatar, {
          "key": "prepend-avatar",
          "density": props.density,
          "image": props.prependAvatar
        }, null), props.prependIcon && createVNode(VIcon, {
          "key": "prepend-icon",
          "density": props.density,
          "icon": props.prependIcon
        }, null)]) : createVNode(VDefaultsProvider, {
          "key": "prepend-defaults",
          "defaults": {
            VAvatar: {
              density: props.density,
              image: props.prependAvatar
            },
            VIcon: {
              density: props.density,
              icon: props.prependIcon
            },
            VListItemAction: {
              start: true
            },
            VCheckboxBtn: {
              density: props.density
            }
          }
        }, {
          default: () => [slots.prepend?.(slotProps.value)]
        }), createElementVNode("div", {
          "class": "v-list-item__spacer"
        }, null)]), createElementVNode("div", {
          "class": "v-list-item__content",
          "data-no-activator": ""
        }, [hasTitle && createVNode(VListItemTitle, {
          "key": "title"
        }, {
          default: () => [slots.title?.({
            title: props.title
          }) ?? toDisplayString(props.title)]
        }), hasSubtitle && createVNode(VListItemSubtitle, {
          "key": "subtitle"
        }, {
          default: () => [slots.subtitle?.({
            subtitle: props.subtitle
          }) ?? toDisplayString(props.subtitle)]
        }), slots.default?.(slotProps.value)]), hasAppend && createElementVNode("div", {
          "key": "append",
          "class": "v-list-item__append"
        }, [!slots.append ? createElementVNode(Fragment, null, [props.appendIcon && createVNode(VIcon, {
          "key": "append-icon",
          "density": props.density,
          "icon": props.appendIcon
        }, null), props.appendAvatar && createVNode(VAvatar, {
          "key": "append-avatar",
          "density": props.density,
          "image": props.appendAvatar
        }, null)]) : createVNode(VDefaultsProvider, {
          "key": "append-defaults",
          "defaults": {
            VAvatar: {
              density: props.density,
              image: props.appendAvatar
            },
            VIcon: {
              density: props.density,
              icon: props.appendIcon
            },
            VListItemAction: {
              end: true
            },
            VCheckboxBtn: {
              density: props.density
            }
          }
        }, {
          default: () => [slots.append?.(slotProps.value)]
        }), createElementVNode("div", {
          "class": "v-list-item__spacer"
        }, null)])]
      }), [[Ripple, isClickable.value && rippleOptions.value]]);
    });
    return {
      activate,
      isActivated,
      isGroupActivator,
      isSelected,
      list,
      select,
      root,
      id: uid,
      link
    };
  }
});
const makeVListSubheaderProps = propsFactory({
  color: String,
  inset: Boolean,
  sticky: Boolean,
  title: String,
  ...makeComponentProps(),
  ...makeTagProps()
}, "VListSubheader");
const VListSubheader = genericComponent()({
  name: "VListSubheader",
  props: makeVListSubheaderProps(),
  setup(props, {
    slots
  }) {
    const {
      textColorClasses,
      textColorStyles
    } = useTextColor(() => props.color);
    useRender(() => {
      const hasText = !!(slots.default || props.title);
      return createVNode(props.tag, {
        "class": normalizeClass(["v-list-subheader", {
          "v-list-subheader--inset": props.inset,
          "v-list-subheader--sticky": props.sticky
        }, textColorClasses.value, props.class]),
        "style": normalizeStyle([{
          textColorStyles
        }, props.style])
      }, {
        default: () => [hasText && createElementVNode("div", {
          "class": "v-list-subheader__text"
        }, [slots.default?.() ?? props.title])]
      });
    });
    return {};
  }
});
const allowedVariants = ["dotted", "dashed", "solid", "double"];
const makeVDividerProps = propsFactory({
  color: String,
  contentOffset: [Number, String, Array],
  gradient: Boolean,
  inset: Boolean,
  length: [Number, String],
  opacity: [Number, String],
  thickness: [Number, String],
  vertical: Boolean,
  variant: {
    type: String,
    default: "solid",
    validator: (v) => allowedVariants.includes(v)
  },
  ...makeComponentProps(),
  ...makeThemeProps()
}, "VDivider");
const VDivider = genericComponent()({
  name: "VDivider",
  props: makeVDividerProps(),
  setup(props, {
    attrs,
    slots
  }) {
    const {
      themeClasses
    } = provideTheme(props);
    const {
      textColorClasses,
      textColorStyles
    } = useTextColor(() => props.color);
    const dividerStyles = computed(() => {
      const styles = {};
      if (props.length) {
        styles[props.vertical ? "height" : "width"] = convertToUnit(props.length);
      }
      if (props.thickness) {
        styles[props.vertical ? "borderRightWidth" : "borderTopWidth"] = convertToUnit(props.thickness);
      }
      return styles;
    });
    const contentStyles = toRef(() => {
      const margin = Array.isArray(props.contentOffset) ? props.contentOffset[0] : props.contentOffset;
      const shift = Array.isArray(props.contentOffset) ? props.contentOffset[1] : 0;
      return {
        marginBlock: props.vertical && margin ? convertToUnit(margin) : void 0,
        marginInline: !props.vertical && margin ? convertToUnit(margin) : void 0,
        transform: shift ? `translate${props.vertical ? "X" : "Y"}(${convertToUnit(shift)})` : void 0
      };
    });
    useRender(() => {
      const divider = createElementVNode("hr", {
        "class": normalizeClass([{
          "v-divider": true,
          "v-divider--gradient": props.gradient && !slots.default,
          "v-divider--inset": props.inset,
          "v-divider--vertical": props.vertical
        }, themeClasses.value, textColorClasses.value, props.class]),
        "style": normalizeStyle([dividerStyles.value, textColorStyles.value, {
          "--v-border-opacity": props.opacity
        }, {
          "border-style": props.variant
        }, props.style]),
        "aria-orientation": !attrs.role || attrs.role === "separator" ? props.vertical ? "vertical" : "horizontal" : void 0,
        "role": `${attrs.role || "separator"}`
      }, null);
      if (!slots.default) return divider;
      return createElementVNode("div", {
        "class": normalizeClass(["v-divider__wrapper", {
          "v-divider__wrapper--gradient": props.gradient,
          "v-divider__wrapper--inset": props.inset,
          "v-divider__wrapper--vertical": props.vertical
        }])
      }, [divider, createElementVNode("div", {
        "class": "v-divider__content",
        "style": normalizeStyle(contentStyles.value)
      }, [slots.default()]), divider]);
    });
    return {};
  }
});
const makeVListChildrenProps = propsFactory({
  items: Array,
  returnObject: Boolean
}, "VListChildren");
const VListChildren = genericComponent()({
  name: "VListChildren",
  props: makeVListChildrenProps(),
  setup(props, {
    slots
  }) {
    createList();
    return () => slots.default?.() ?? props.items?.map(({
      children,
      props: itemProps,
      type,
      raw: item
    }, index) => {
      if (type === "divider") {
        return slots.divider?.({
          props: itemProps
        }) ?? createVNode(VDivider, itemProps, null);
      }
      if (type === "subheader") {
        return slots.subheader?.({
          props: itemProps
        }) ?? createVNode(VListSubheader, itemProps, null);
      }
      const slotsWithItem = {
        subtitle: slots.subtitle ? (slotProps) => slots.subtitle?.({
          ...slotProps,
          item
        }) : void 0,
        prepend: slots.prepend ? (slotProps) => slots.prepend?.({
          ...slotProps,
          item
        }) : void 0,
        append: slots.append ? (slotProps) => slots.append?.({
          ...slotProps,
          item
        }) : void 0,
        title: slots.title ? (slotProps) => slots.title?.({
          ...slotProps,
          item
        }) : void 0
      };
      const listGroupProps = VListGroup.filterProps(itemProps);
      return children ? createVNode(VListGroup, mergeProps(listGroupProps, {
        "value": props.returnObject ? item : itemProps?.value,
        "rawId": itemProps?.value
      }), {
        activator: ({
          props: activatorProps
        }) => {
          const listItemProps = mergeProps(itemProps, activatorProps, {
            value: props.returnObject ? item : itemProps.value
          });
          return slots.header ? slots.header({
            props: listItemProps
          }) : createVNode(VListItem, mergeProps(listItemProps, {
            "index": index
          }), slotsWithItem);
        },
        default: () => createVNode(VListChildren, {
          "items": children,
          "returnObject": props.returnObject
        }, slots)
      }) : slots.item ? slots.item({
        props: {
          ...itemProps,
          index
        }
      }) : createVNode(VListItem, mergeProps(itemProps, {
        "index": index,
        "value": props.returnObject ? item : itemProps.value
      }), slotsWithItem);
    });
  }
});
const makeItemsProps = propsFactory({
  items: {
    type: Array,
    default: () => []
  },
  itemTitle: {
    type: [String, Array, Function],
    default: "title"
  },
  itemValue: {
    type: [String, Array, Function],
    default: "value"
  },
  itemChildren: {
    type: [Boolean, String, Array, Function],
    default: "children"
  },
  itemProps: {
    type: [Boolean, String, Array, Function],
    default: "props"
  },
  itemType: {
    type: [Boolean, String, Array, Function],
    default: "type"
  },
  returnObject: Boolean,
  valueComparator: Function
}, "list-items");
const itemTypes = /* @__PURE__ */ new Set(["item", "divider", "subheader"]);
function transformItem(props, item) {
  const title = isPrimitive(item) ? item : getPropertyFromItem(item, props.itemTitle);
  const value = isPrimitive(item) ? item : getPropertyFromItem(item, props.itemValue, void 0);
  const children = getPropertyFromItem(item, props.itemChildren);
  const itemProps = props.itemProps === true ? omit(item, ["children"]) : getPropertyFromItem(item, props.itemProps);
  let type = getPropertyFromItem(item, props.itemType, "item");
  if (!itemTypes.has(type)) {
    type = "item";
  }
  const _props = {
    title,
    value,
    ...itemProps
  };
  return {
    type,
    title: _props.title,
    value: _props.value,
    props: _props,
    children: type === "item" && children ? transformItems(props, children) : void 0,
    raw: item
  };
}
function transformItems(props, items) {
  const array = [];
  for (const item of items) {
    array.push(transformItem(props, item));
  }
  return array;
}
function useListItems(props) {
  const items = computed(() => transformItems(props, props.items));
  return {
    items
  };
}
const makeVListProps = propsFactory({
  baseColor: String,
  /* @deprecated */
  activeColor: String,
  activeClass: String,
  bgColor: String,
  disabled: Boolean,
  filterable: Boolean,
  expandIcon: IconValue,
  collapseIcon: IconValue,
  lines: {
    type: [Boolean, String],
    default: "one"
  },
  slim: Boolean,
  prependGap: [Number, String],
  indent: [Number, String],
  nav: Boolean,
  navigationStrategy: {
    type: String,
    default: "focus"
  },
  navigationIndex: Number,
  "onClick:open": EventProp(),
  "onClick:select": EventProp(),
  "onUpdate:opened": EventProp(),
  ...makeNestedProps({
    selectStrategy: "single-leaf",
    openStrategy: "list"
  }),
  ...makeBorderProps(),
  ...makeComponentProps(),
  ...makeDensityProps(),
  ...makeDimensionProps(),
  ...makeElevationProps(),
  ...makeItemsProps(),
  ...makeRoundedProps(),
  ...makeTagProps(),
  ...makeThemeProps(),
  ...makeVariantProps({
    variant: "text"
  })
}, "VList");
const VList = genericComponent()({
  name: "VList",
  props: makeVListProps(),
  emits: {
    "update:selected": (value) => true,
    "update:activated": (value) => true,
    "update:opened": (value) => true,
    "update:navigationIndex": (value) => true,
    "click:open": (value) => true,
    "click:activate": (value) => true,
    "click:select": (value) => true
  },
  setup(props, {
    attrs,
    slots,
    emit
  }) {
    const {
      items
    } = useListItems(props);
    const {
      themeClasses
    } = provideTheme(props);
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(() => props.bgColor);
    const {
      borderClasses
    } = useBorder(props);
    const {
      densityClasses
    } = useDensity(props);
    const {
      dimensionStyles
    } = useDimension(props);
    const {
      elevationClasses
    } = useElevation(props);
    const {
      roundedClasses
    } = useRounded(props);
    const {
      children,
      open,
      parents,
      select,
      getPath
    } = useNested(props, {
      items,
      returnObject: toRef(() => props.returnObject),
      scrollToActive: toRef(() => props.navigationStrategy === "track"),
      valueComparator: toRef(() => props.valueComparator)
    });
    const lineClasses = toRef(() => props.lines ? `v-list--${props.lines}-line` : void 0);
    const activeColor = toRef(() => props.activeColor);
    const baseColor = toRef(() => props.baseColor);
    const color = toRef(() => props.color);
    const isSelectable = toRef(() => props.selectable || props.activatable);
    const navigationIndex = useProxiedModel(props, "navigationIndex", -1, (v) => v ?? -1);
    const uid = useId();
    createList({
      filterable: props.filterable,
      trackingIndex: navigationIndex,
      navigationStrategy: toRef(() => props.navigationStrategy),
      uid
    });
    watch(items, () => {
      if (props.navigationStrategy === "track") {
        navigationIndex.value = -1;
      }
    });
    provideDefaults({
      VListGroup: {
        activeColor,
        baseColor,
        color,
        expandIcon: toRef(() => props.expandIcon),
        collapseIcon: toRef(() => props.collapseIcon)
      },
      VListItem: {
        activeClass: toRef(() => props.activeClass),
        activeColor,
        baseColor,
        color,
        density: toRef(() => props.density),
        disabled: toRef(() => props.disabled),
        lines: toRef(() => props.lines),
        nav: toRef(() => props.nav),
        slim: toRef(() => props.slim),
        variant: toRef(() => props.variant),
        tabindex: toRef(() => props.navigationStrategy === "track" ? -1 : void 0)
      }
    });
    const isFocused = shallowRef(false);
    const contentRef = ref();
    function onFocusin(e) {
      isFocused.value = true;
    }
    function onFocusout(e) {
      isFocused.value = false;
    }
    function onFocus(e) {
      if (props.navigationStrategy === "track") {
        if (!~navigationIndex.value) {
          navigationIndex.value = getNextIndex("first");
        }
      } else if (!isFocused.value && !(e.relatedTarget && contentRef.value?.contains(e.relatedTarget))) focus();
    }
    function onBlur() {
      if (props.navigationStrategy === "track") {
        navigationIndex.value = -1;
      }
    }
    function getNavigationDirection(key) {
      switch (key) {
        case "ArrowDown":
          return "next";
        case "ArrowUp":
          return "prev";
        case "Home":
          return "first";
        case "End":
          return "last";
        default:
          return null;
      }
    }
    function getNextIndex(direction) {
      const itemCount = items.value.length;
      if (itemCount === 0) return -1;
      let nextIndex;
      if (direction === "first") {
        nextIndex = 0;
      } else if (direction === "last") {
        nextIndex = itemCount - 1;
      } else {
        nextIndex = navigationIndex.value + (direction === "next" ? 1 : -1);
        if (nextIndex < 0) nextIndex = itemCount - 1;
        if (nextIndex >= itemCount) nextIndex = 0;
      }
      const startIndex = nextIndex;
      let attempts = 0;
      while (attempts < itemCount) {
        const item = items.value[nextIndex];
        if (item && item.type !== "divider" && item.type !== "subheader") {
          return nextIndex;
        }
        nextIndex += direction === "next" || direction === "first" ? 1 : -1;
        if (nextIndex < 0) nextIndex = itemCount - 1;
        if (nextIndex >= itemCount) nextIndex = 0;
        if (nextIndex === startIndex) return -1;
        attempts++;
      }
      return -1;
    }
    function onKeydown(e) {
      const target = e.target;
      if (!contentRef.value || target.tagName === "INPUT" && ["Home", "End"].includes(e.key) || target.tagName === "TEXTAREA") {
        return;
      }
      const direction = getNavigationDirection(e.key);
      if (direction !== null) {
        e.preventDefault();
        if (props.navigationStrategy === "track") {
          const nextIndex = getNextIndex(direction);
          if (nextIndex !== -1) {
            navigationIndex.value = nextIndex;
          }
        } else {
          focus(direction);
        }
      }
    }
    function onMousedown(e) {
      isFocused.value = true;
    }
    function focus(location, options) {
      if (contentRef.value) {
        return focusChild(contentRef.value, location, options);
      }
    }
    useRender(() => {
      const indent = props.indent ?? (props.prependGap ? Number(props.prependGap) + 24 : void 0);
      const ariaMultiselectable = isSelectable.value ? attrs.ariaMultiselectable ?? !String(props.selectStrategy).startsWith("single-") : void 0;
      return createVNode(props.tag, {
        "ref": contentRef,
        "class": normalizeClass(["v-list", {
          "v-list--disabled": props.disabled,
          "v-list--nav": props.nav,
          "v-list--slim": props.slim
        }, themeClasses.value, backgroundColorClasses.value, borderClasses.value, densityClasses.value, elevationClasses.value, lineClasses.value, roundedClasses.value, props.class]),
        "style": normalizeStyle([{
          "--v-list-indent": convertToUnit(indent),
          "--v-list-group-prepend": indent ? "0px" : void 0,
          "--v-list-prepend-gap": convertToUnit(props.prependGap)
        }, backgroundColorStyles.value, dimensionStyles.value, props.style]),
        "tabindex": props.disabled ? -1 : 0,
        "role": isSelectable.value ? "listbox" : "list",
        "aria-activedescendant": props.navigationStrategy === "track" && navigationIndex.value >= 0 ? `v-list-item-${uid}-${navigationIndex.value}` : void 0,
        "aria-multiselectable": ariaMultiselectable,
        "onFocusin": onFocusin,
        "onFocusout": onFocusout,
        "onFocus": onFocus,
        "onBlur": onBlur,
        "onKeydown": onKeydown,
        "onMousedown": onMousedown
      }, {
        default: () => [createVNode(VListChildren, {
          "items": items.value,
          "returnObject": props.returnObject
        }, slots)]
      });
    });
    return {
      open,
      select,
      focus,
      children,
      parents,
      getPath,
      navigationIndex
    };
  }
});
function useSticky({
  rootEl,
  isSticky,
  layoutItemStyles
}) {
  const isStuck = shallowRef(false);
  const stuckPosition = shallowRef(0);
  const stickyStyles = computed(() => {
    const side = typeof isStuck.value === "boolean" ? "top" : isStuck.value;
    return [isSticky.value ? {
      top: "auto",
      bottom: "auto",
      height: void 0
    } : void 0, isStuck.value ? {
      [side]: convertToUnit(stuckPosition.value)
    } : {
      top: layoutItemStyles.value.top
    }];
  });
  return {
    isStuck,
    stickyStyles
  };
}
function useTouch({
  el,
  isActive,
  isTemporary,
  width,
  touchless,
  position
}) {
  computed(() => ["left", "right"].includes(position.value));
  const isDragging = shallowRef(false);
  const dragProgress = shallowRef(0);
  shallowRef(0);
  const dragStyles = computed(() => {
    return isDragging.value ? {
      transform: position.value === "left" ? `translateX(calc(-100% + ${dragProgress.value * width.value}px))` : position.value === "right" ? `translateX(calc(100% - ${dragProgress.value * width.value}px))` : position.value === "top" ? `translateY(calc(-100% + ${dragProgress.value * width.value}px))` : position.value === "bottom" ? `translateY(calc(100% - ${dragProgress.value * width.value}px))` : oops(),
      transition: "none"
    } : void 0;
  });
  useToggleScope(isDragging, () => {
    const transform2 = el.value?.style.transform ?? null;
    const transition = el.value?.style.transition ?? null;
    watchEffect(() => {
      el.value?.style.setProperty("transform", dragStyles.value?.transform || "none");
      el.value?.style.setProperty("transition", dragStyles.value?.transition || null);
    });
    onScopeDispose(() => {
      el.value?.style.setProperty("transform", transform2);
      el.value?.style.setProperty("transition", transition);
    });
  });
  return {
    isDragging,
    dragProgress,
    dragStyles
  };
}
function oops() {
  throw new Error();
}
const makeDelayProps = propsFactory({
  closeDelay: [Number, String],
  openDelay: [Number, String]
}, "delay");
function useDelay(props, cb) {
  let clearDelay = () => {
  };
  function runDelay(isOpening, options) {
    clearDelay?.();
    const delay = isOpening ? props.openDelay : props.closeDelay;
    const normalizedDelay = Math.max(options?.minDelay ?? 0, Number(delay ?? 0));
    return new Promise((resolve) => {
      clearDelay = defer(normalizedDelay, () => {
        cb?.(isOpening);
        resolve(isOpening);
      });
    });
  }
  function runOpenDelay() {
    return runDelay(true);
  }
  function runCloseDelay(options) {
    return runDelay(false, options);
  }
  return {
    clearDelay,
    runOpenDelay,
    runCloseDelay
  };
}
const makeFocusTrapProps = propsFactory({
  retainFocus: Boolean,
  captureFocus: Boolean,
  /** @deprecated */
  disableInitialFocus: Boolean
}, "focusTrap");
const registry = /* @__PURE__ */ new Map();
function useFocusTrap(props, {
  isActive,
  localTop,
  contentEl
}) {
  const trapId = /* @__PURE__ */ Symbol("trap");
  toRef(() => isActive.value && props.captureFocus && !props.disableInitialFocus);
  onScopeDispose(() => {
    registry.delete(trapId);
    return;
  });
}
function useScopeId() {
  const vm = getCurrentInstance("useScopeId");
  const scopeId = vm.vnode.scopeId;
  return {
    scopeId: scopeId ? {
      [scopeId]: ""
    } : void 0
  };
}
const locations = ["start", "end", "left", "right", "top", "bottom"];
const makeVNavigationDrawerProps = propsFactory({
  color: String,
  disableResizeWatcher: Boolean,
  disableRouteWatcher: Boolean,
  expandOnHover: Boolean,
  floating: Boolean,
  modelValue: {
    type: Boolean,
    default: null
  },
  permanent: Boolean,
  rail: {
    type: Boolean,
    default: null
  },
  railWidth: {
    type: [Number, String],
    default: 56
  },
  scrim: {
    type: [Boolean, String],
    default: true
  },
  image: String,
  temporary: Boolean,
  persistent: Boolean,
  touchless: Boolean,
  width: {
    type: [Number, String],
    default: 256
  },
  location: {
    type: String,
    default: "start",
    validator: (value) => locations.includes(value)
  },
  sticky: Boolean,
  ...makeBorderProps(),
  ...makeComponentProps(),
  ...makeDelayProps(),
  ...makeDisplayProps({
    mobile: null
  }),
  ...makeElevationProps(),
  ...makeLayoutItemProps(),
  ...makeRoundedProps(),
  ...omit(makeFocusTrapProps(), ["disableInitialFocus"]),
  ...makeTagProps({
    tag: "nav"
  }),
  ...makeThemeProps()
}, "VNavigationDrawer");
const VNavigationDrawer = genericComponent()({
  name: "VNavigationDrawer",
  props: makeVNavigationDrawerProps(),
  emits: {
    "update:modelValue": (val) => true,
    "update:rail": (val) => true
  },
  setup(props, {
    attrs,
    emit,
    slots
  }) {
    const {
      isRtl
    } = useRtl();
    const {
      themeClasses
    } = provideTheme(props);
    const {
      borderClasses
    } = useBorder(props);
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(() => props.color);
    const {
      elevationClasses
    } = useElevation(props);
    const {
      displayClasses,
      mobile
    } = useDisplay(props);
    const {
      roundedClasses
    } = useRounded(props);
    const router = useRouter();
    const isActive = useProxiedModel(props, "modelValue", null, (v) => !!v);
    const {
      ssrBootStyles
    } = useSsrBoot();
    const {
      scopeId
    } = useScopeId();
    const rootEl = ref();
    const isHovering = shallowRef(false);
    const {
      runOpenDelay,
      runCloseDelay
    } = useDelay(props, (value) => {
      isHovering.value = value;
    });
    const width = computed(() => {
      return props.rail && props.expandOnHover && isHovering.value ? Number(props.width) : Number(props.rail ? props.railWidth : props.width);
    });
    const location = computed(() => {
      return toPhysical(props.location, isRtl.value);
    });
    const isPersistent = toRef(() => props.persistent);
    const isTemporary = computed(() => !props.permanent && (mobile.value || props.temporary));
    const isSticky = computed(() => props.sticky && !isTemporary.value && location.value !== "bottom");
    useFocusTrap(props, {
      isActive,
      localTop: isTemporary,
      contentEl: rootEl
    });
    useToggleScope(() => props.expandOnHover && props.rail != null, () => {
      watch(isHovering, (val) => emit("update:rail", !val));
    });
    useToggleScope(() => !props.disableResizeWatcher, () => {
      watch(isTemporary, (val) => !props.permanent && nextTick(() => isActive.value = !val));
    });
    useToggleScope(() => !props.disableRouteWatcher && !!router, () => {
      watch(router.currentRoute, () => isTemporary.value && (isActive.value = false));
    });
    watch(() => props.permanent, (val) => {
      if (val) isActive.value = true;
    });
    if (props.modelValue == null && !isTemporary.value) {
      isActive.value = props.permanent || !mobile.value;
    }
    const {
      isDragging,
      dragProgress
    } = useTouch({
      el: rootEl,
      isActive,
      isTemporary,
      width,
      touchless: toRef(() => props.touchless),
      position: location
    });
    const layoutSize = computed(() => {
      const size = isTemporary.value ? 0 : props.rail && props.expandOnHover ? Number(props.railWidth) : width.value;
      return isDragging.value ? size * dragProgress.value : size;
    });
    const {
      layoutItemStyles,
      layoutItemScrimStyles
    } = useLayoutItem({
      id: props.name,
      order: computed(() => parseInt(props.order, 10)),
      position: location,
      layoutSize,
      elementSize: width,
      active: readonly(isActive),
      disableTransitions: toRef(() => isDragging.value),
      absolute: computed(() => (
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        props.absolute || isSticky.value && typeof isStuck.value !== "string"
      ))
    });
    const {
      isStuck,
      stickyStyles
    } = useSticky({
      rootEl,
      isSticky,
      layoutItemStyles
    });
    const scrimColor = useBackgroundColor(() => {
      return typeof props.scrim === "string" ? props.scrim : null;
    });
    const scrimStyles = computed(() => ({
      ...isDragging.value ? {
        opacity: dragProgress.value * 0.2,
        transition: "none"
      } : void 0,
      ...layoutItemScrimStyles.value
    }));
    provideDefaults({
      VList: {
        bgColor: "transparent"
      }
    });
    useRender(() => {
      const hasImage = slots.image || props.image;
      return createElementVNode(Fragment, null, [createVNode(props.tag, mergeProps({
        "ref": rootEl,
        "onMouseenter": runOpenDelay,
        "onMouseleave": runCloseDelay,
        "class": ["v-navigation-drawer", `v-navigation-drawer--${location.value}`, {
          "v-navigation-drawer--expand-on-hover": props.expandOnHover,
          "v-navigation-drawer--floating": props.floating,
          "v-navigation-drawer--is-hovering": isHovering.value,
          "v-navigation-drawer--rail": props.rail,
          "v-navigation-drawer--temporary": isTemporary.value,
          "v-navigation-drawer--persistent": isPersistent.value,
          "v-navigation-drawer--active": isActive.value,
          "v-navigation-drawer--sticky": isSticky.value
        }, themeClasses.value, backgroundColorClasses.value, borderClasses.value, displayClasses.value, elevationClasses.value, roundedClasses.value, props.class],
        "style": [backgroundColorStyles.value, layoutItemStyles.value, ssrBootStyles.value, stickyStyles.value, props.style],
        "inert": !isActive.value
      }, scopeId, attrs), {
        default: () => [hasImage && createElementVNode("div", {
          "key": "image",
          "class": "v-navigation-drawer__img"
        }, [!slots.image ? createVNode(VImg, {
          "key": "image-img",
          "alt": "",
          "cover": true,
          "height": "inherit",
          "src": props.image
        }, null) : createVNode(VDefaultsProvider, {
          "key": "image-defaults",
          "disabled": !props.image,
          "defaults": {
            VImg: {
              alt: "",
              cover: true,
              height: "inherit",
              src: props.image
            }
          }
        }, slots.image)]), slots.prepend && createElementVNode("div", {
          "class": "v-navigation-drawer__prepend"
        }, [slots.prepend?.()]), createElementVNode("div", {
          "class": "v-navigation-drawer__content"
        }, [slots.default?.()]), slots.append && createElementVNode("div", {
          "class": "v-navigation-drawer__append"
        }, [slots.append?.()])]
      }), createVNode(Transition, {
        "name": "fade-transition"
      }, {
        default: () => [isTemporary.value && (isDragging.value || isActive.value) && !!props.scrim && createElementVNode("div", mergeProps({
          "class": ["v-navigation-drawer__scrim", scrimColor.backgroundColorClasses.value],
          "style": [scrimStyles.value, scrimColor.backgroundColorStyles.value],
          "onClick": () => {
            if (isPersistent.value) return;
            isActive.value = false;
          }
        }, scopeId), null)]
      })]);
    });
    return {
      isStuck
    };
  }
});
const expandedWidth = 260;
const collapsedWidth = 88;
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "AppSidebar",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute$1();
    const drawer = ref(true);
    const isRail = ref(false);
    const mql = ref(null);
    const toggleRail = () => {
      const isMobile = !!mql.value?.matches;
      if (isMobile) return;
      isRail.value = !isRail.value;
    };
    const items = computed(() => [
      { to: "/", label: "Dashboard", icon: IconDashboard },
      { to: "/movimientos", label: "Movimientos", icon: IconMovimientos },
      { to: "/cuentas", label: "Cuentas", icon: IconCuentas },
      { to: "/reportes", label: "Reportes", icon: IconReportes },
      { to: "/configuracion", label: "Configuración", icon: IconConfiguracion }
    ]);
    const isActive = (to) => {
      if (to === "/") return route.path === "/";
      return route.path === to;
    };
    const onNav = () => {
    };
    const railStyle = computed(() => {
      return isRail.value ? { width: `${collapsedWidth}px`, minWidth: `${collapsedWidth}px` } : { width: `${expandedWidth}px`, minWidth: `${expandedWidth}px` };
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(VNavigationDrawer, mergeProps({
        modelValue: drawer.value,
        "onUpdate:modelValue": ($event) => drawer.value = $event,
        rail: isRail.value,
        permanent: "",
        location: "start",
        class: "appSidebarDrawer",
        width: expandedWidth,
        style: railStyle.value,
        "mobile-breakpoint": 0
      }, _attrs), {
        prepend: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="sidebarTop" data-v-c9296b4c${_scopeId}>`);
            if (!isRail.value) {
              _push2(ssrRenderComponent(VBtn, {
                class: "sidebarToggle",
                variant: "text",
                icon: "mdi-chevron-left",
                "aria-label": "Colapsar sidebar",
                onClick: toggleRail
              }, null, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(VBtn, {
                class: "sidebarToggle",
                variant: "text",
                icon: "mdi-chevron-right",
                "aria-label": "Expandir sidebar",
                onClick: toggleRail
              }, null, _parent2, _scopeId));
            }
            _push2(`<div class="userBlock" aria-hidden="true" data-v-c9296b4c${_scopeId}><div class="userAvatar" data-v-c9296b4c${_scopeId}></div><div class="userMeta" style="${ssrRenderStyle(!isRail.value ? null : { display: "none" })}" data-v-c9296b4c${_scopeId}><div class="userName" data-v-c9296b4c${_scopeId}>Usuario</div><div class="userRole" data-v-c9296b4c${_scopeId}>Finanzas</div></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "sidebarTop" }, [
                !isRail.value ? (openBlock(), createBlock(VBtn, {
                  key: 0,
                  class: "sidebarToggle",
                  variant: "text",
                  icon: "mdi-chevron-left",
                  "aria-label": "Colapsar sidebar",
                  onClick: toggleRail
                })) : (openBlock(), createBlock(VBtn, {
                  key: 1,
                  class: "sidebarToggle",
                  variant: "text",
                  icon: "mdi-chevron-right",
                  "aria-label": "Expandir sidebar",
                  onClick: toggleRail
                })),
                createVNode("div", {
                  class: "userBlock",
                  "aria-hidden": "true"
                }, [
                  createVNode("div", { class: "userAvatar" }),
                  withDirectives(createVNode("div", { class: "userMeta" }, [
                    createVNode("div", { class: "userName" }, "Usuario"),
                    createVNode("div", { class: "userRole" }, "Finanzas")
                  ], 512), [
                    [vShow, !isRail.value]
                  ])
                ])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(VList, {
              density: "compact",
              nav: "",
              class: "navList"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<!--[-->`);
                  ssrRenderList(items.value, (item) => {
                    _push3(ssrRenderComponent(VListItem, {
                      key: item.to,
                      to: item.to,
                      active: isActive(item.to),
                      class: "navItem",
                      color: "primary",
                      rounded: "",
                      onClick: onNav
                    }, {
                      prepend: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          ssrRenderVNode(_push4, createVNode(resolveDynamicComponent(item.icon), { class: "navIcon" }, null), _parent4, _scopeId3);
                        } else {
                          return [
                            (openBlock(), createBlock(resolveDynamicComponent(item.icon), { class: "navIcon" }))
                          ];
                        }
                      }),
                      default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                        if (_push4) {
                          _push4(ssrRenderComponent(VListItemTitle, {
                            style: !isRail.value ? null : { display: "none" }
                          }, {
                            default: withCtx((_4, _push5, _parent5, _scopeId4) => {
                              if (_push5) {
                                _push5(`${ssrInterpolate(item.label)}`);
                              } else {
                                return [
                                  createTextVNode(toDisplayString(item.label), 1)
                                ];
                              }
                            }),
                            _: 2
                          }, _parent4, _scopeId3));
                        } else {
                          return [
                            withDirectives(createVNode(VListItemTitle, null, {
                              default: withCtx(() => [
                                createTextVNode(toDisplayString(item.label), 1)
                              ]),
                              _: 2
                            }, 1536), [
                              [vShow, !isRail.value]
                            ])
                          ];
                        }
                      }),
                      _: 2
                    }, _parent3, _scopeId2));
                  });
                  _push3(`<!--]-->`);
                } else {
                  return [
                    (openBlock(true), createBlock(Fragment, null, renderList(items.value, (item) => {
                      return openBlock(), createBlock(VListItem, {
                        key: item.to,
                        to: item.to,
                        active: isActive(item.to),
                        class: "navItem",
                        color: "primary",
                        rounded: "",
                        onClick: onNav
                      }, {
                        prepend: withCtx(() => [
                          (openBlock(), createBlock(resolveDynamicComponent(item.icon), { class: "navIcon" }))
                        ]),
                        default: withCtx(() => [
                          withDirectives(createVNode(VListItemTitle, null, {
                            default: withCtx(() => [
                              createTextVNode(toDisplayString(item.label), 1)
                            ]),
                            _: 2
                          }, 1536), [
                            [vShow, !isRail.value]
                          ])
                        ]),
                        _: 2
                      }, 1032, ["to", "active"]);
                    }), 128))
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(VList, {
                density: "compact",
                nav: "",
                class: "navList"
              }, {
                default: withCtx(() => [
                  (openBlock(true), createBlock(Fragment, null, renderList(items.value, (item) => {
                    return openBlock(), createBlock(VListItem, {
                      key: item.to,
                      to: item.to,
                      active: isActive(item.to),
                      class: "navItem",
                      color: "primary",
                      rounded: "",
                      onClick: onNav
                    }, {
                      prepend: withCtx(() => [
                        (openBlock(), createBlock(resolveDynamicComponent(item.icon), { class: "navIcon" }))
                      ]),
                      default: withCtx(() => [
                        withDirectives(createVNode(VListItemTitle, null, {
                          default: withCtx(() => [
                            createTextVNode(toDisplayString(item.label), 1)
                          ]),
                          _: 2
                        }, 1536), [
                          [vShow, !isRail.value]
                        ])
                      ]),
                      _: 2
                    }, 1032, ["to", "active"]);
                  }), 128))
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppSidebar.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const AppSidebar = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-c9296b4c"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "AppFooter",
  __ssrInlineRender: true,
  setup(__props) {
    const appName = computed(() => {
      const cfg = useNuxtApp().$config;
      return cfg?.public?.appName || "Finanzas CRUD";
    });
    const version = computed(() => {
      const cfg = useNuxtApp().$config;
      const p = cfg?.public?.version;
      return p ? String(p) : "0.0.0";
    });
    const pwaStatus = ref("Sin confirmar");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "footer" }, _attrs))} data-v-37bc8785><div class="left" data-v-37bc8785><span class="name" data-v-37bc8785>${ssrInterpolate(appName.value)}</span></div><div class="center" data-v-37bc8785><span class="meta" data-v-37bc8785>v${ssrInterpolate(version.value)}</span><span class="sep" data-v-37bc8785>•</span><span class="meta" data-v-37bc8785>PWA: ${ssrInterpolate(pwaStatus.value)}</span></div><div class="right" data-v-37bc8785></div></footer>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppFooter.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const AppFooter = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-37bc8785"]]);
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtPage = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "appRoot" }, _attrs))} data-v-7b864c52>`);
      _push(ssrRenderComponent(AppNavbar, null, null, _parent));
      _push(`<div class="appBody" data-v-7b864c52>`);
      _push(ssrRenderComponent(AppSidebar, null, null, _parent));
      _push(`<main class="appMain" data-v-7b864c52>`);
      _push(ssrRenderComponent(_component_NuxtPage, null, null, _parent));
      _push(`</main></div>`);
      _push(ssrRenderComponent(AppFooter, null, null, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-7b864c52"]]);
export {
  _default as default
};
//# sourceMappingURL=default-Bv99VZXP.js.map
