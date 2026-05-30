import { a as buildAssetsURL } from '../routes/renderer.mjs';
import { defineComponent, mergeProps, ref, inject, h, Suspense, computed, withCtx, createVNode, toDisplayString, resolveComponent, createTextVNode, withDirectives, vShow, resolveDynamicComponent, openBlock, createBlock, Fragment, renderList, provide, shallowReactive, useSSRContext } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import { _ as _export_sfc, u as useNuxtApp, P as PageRouteSymbol, L as LayoutMetaSymbol, c as useRuntimeConfig } from './server.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrRenderVNode, ssrRenderStyle } from 'vue/server-renderer';
import { _ as __nuxt_component_0$1 } from './nuxt-link-B9HvlfGR.mjs';
import 'vue-bundle-renderer/runtime';
import '../_/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'pinia';
import 'vuetify';
import 'vuetify/components';
import 'vuetify/directives';

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
const _imports_0 = "" + buildAssetsURL("logo.liNYndMy.png");
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "AppNavbar",
  __ssrInlineRender: true,
  setup(__props) {
    const appName = computed(() => {
      var _a;
      return ((_a = useRuntimeConfig().public) == null ? void 0 : _a.appName) || "Finanzas";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<header${ssrRenderAttrs(mergeProps({ class: "navbar" }, _attrs))} data-v-5db41bd8><div class="left" data-v-5db41bd8>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "brand",
        to: "/"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img class="brandIcon"${ssrRenderAttr("src", _imports_0)} alt="Logo" data-v-5db41bd8${_scopeId}><span class="brandText" data-v-5db41bd8${_scopeId}>${ssrInterpolate(appName.value)}</span>`);
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
      _push(`</div><div class="right" data-v-5db41bd8><button class="iconBtn" type="button" aria-label="Notificaciones (placeholder)" data-v-5db41bd8><span class="dot" data-v-5db41bd8></span><svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" data-v-5db41bd8><path d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Zm7-6V11a7 7 0 1 0-14 0v5l-2 2v1h18v-1l-2-2Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" data-v-5db41bd8></path></svg></button><div class="profile" data-v-5db41bd8><div class="avatar" aria-hidden="true" data-v-5db41bd8></div><span class="profileText" data-v-5db41bd8>Perfil</span></div></div></header>`);
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppNavbar.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const AppNavbar = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-5db41bd8"]]);
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
const expandedWidth = 260;
const collapsedWidth = 88;
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "AppSidebar",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const drawer = ref(true);
    const isRail = ref(false);
    const mql = ref(null);
    const toggleRail = () => {
      var _a;
      const isMobile = !!((_a = mql.value) == null ? void 0 : _a.matches);
      if (isMobile) return;
      isRail.value = !isRail.value;
    };
    const items = computed(() => [
      { to: "/", label: "Dashboard", icon: IconDashboard },
      { to: "/movimientos", label: "Movimientos", icon: IconMovimientos },
      { to: "/cuentas", label: "Cuentas", icon: IconCuentas },
      { to: "/reportes", label: "Reportes", icon: IconReportes },
      { to: "/configuracion", label: "Configuraci\xF3n", icon: IconConfiguracion }
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
      const _component_v_navigation_drawer = resolveComponent("v-navigation-drawer");
      const _component_v_btn = resolveComponent("v-btn");
      const _component_v_list = resolveComponent("v-list");
      const _component_v_list_item = resolveComponent("v-list-item");
      const _component_v_list_item_title = resolveComponent("v-list-item-title");
      _push(ssrRenderComponent(_component_v_navigation_drawer, mergeProps({
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
              _push2(ssrRenderComponent(_component_v_btn, {
                class: "sidebarToggle",
                variant: "text",
                icon: "mdi-chevron-left",
                "aria-label": "Colapsar sidebar",
                onClick: toggleRail
              }, null, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(_component_v_btn, {
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
                !isRail.value ? (openBlock(), createBlock(_component_v_btn, {
                  key: 0,
                  class: "sidebarToggle",
                  variant: "text",
                  icon: "mdi-chevron-left",
                  "aria-label": "Colapsar sidebar",
                  onClick: toggleRail
                })) : (openBlock(), createBlock(_component_v_btn, {
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
            _push2(ssrRenderComponent(_component_v_list, {
              density: "compact",
              nav: "",
              class: "navList"
            }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<!--[-->`);
                  ssrRenderList(items.value, (item) => {
                    _push3(ssrRenderComponent(_component_v_list_item, {
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
                          _push4(ssrRenderComponent(_component_v_list_item_title, {
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
                            withDirectives(createVNode(_component_v_list_item_title, null, {
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
                      return openBlock(), createBlock(_component_v_list_item, {
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
                          withDirectives(createVNode(_component_v_list_item_title, null, {
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
              createVNode(_component_v_list, {
                density: "compact",
                nav: "",
                class: "navList"
              }, {
                default: withCtx(() => [
                  (openBlock(true), createBlock(Fragment, null, renderList(items.value, (item) => {
                    return openBlock(), createBlock(_component_v_list_item, {
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
                        withDirectives(createVNode(_component_v_list_item_title, null, {
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
      var _a;
      const cfg = useNuxtApp().$config;
      return ((_a = cfg == null ? void 0 : cfg.public) == null ? void 0 : _a.appName) || "Finanzas CRUD";
    });
    const version = computed(() => {
      var _a;
      const cfg = useNuxtApp().$config;
      const p = (_a = cfg == null ? void 0 : cfg.public) == null ? void 0 : _a.version;
      return p ? String(p) : "0.0.0";
    });
    const pwaStatus = ref("Sin confirmar");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "footer" }, _attrs))} data-v-37bc8785><div class="left" data-v-37bc8785><span class="name" data-v-37bc8785>${ssrInterpolate(appName.value)}</span></div><div class="center" data-v-37bc8785><span class="meta" data-v-37bc8785>v${ssrInterpolate(version.value)}</span><span class="sep" data-v-37bc8785>\u2022</span><span class="meta" data-v-37bc8785>PWA: ${ssrInterpolate(pwaStatus.value)}</span></div><div class="right" data-v-37bc8785></div></footer>`);
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

export { _default as default };
//# sourceMappingURL=default-DLTlT_H-.mjs.map
