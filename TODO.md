# UX/UI Responsive Optimization — TODO

## Fase 1: Layout global (sin nuevas funcionalidades)
- [x] Revisar `layouts/default.vue` y estructura general (Vuetify)
- [x] Ajustar grid/flex para eliminar overflow horizontal
- [x] Asegurar footer siempre visible (sin hack de calc frágil)
- [x] Ajustar breakpoints para móvil/tablet/escritorio

## Fase 2: Sidebar + Navbar (responsivo)
- [ ] Rehacer `components/AppSidebar.vue` para:
  - [ ] Sidebar fijo en escritorio, colapsable
  - [ ] Recordar estado colapsado en `localStorage`
  - [ ] Drawer móvil overlay con overlay clic-cierra
  - [ ] Apertura desde hamburguesa
  - [ ] Cierre automático al navegar
  - [ ] No empujar contenido y sin scroll horizontal involuntario
- [ ] Actualizar `components/AppNavbar.vue` para:
  - [ ] Botón hamburguesa visible en móvil
  - [ ] Título visible
  - [ ] Acciones alineadas y responsive

## Fase 3: Dashboard
- [ ] Reorganizar KPIs para 4/2/1 columnas según breakpoint
- [ ] Optimizar grids en `pages/index.vue` para evitar cortes/overflow

## Fase 4: Charts
- [ ] Revisar `components/charts/*.vue`:
  - [ ] Altura adaptativa
  - [ ] Sin cortes/overflow
  - [ ] Visual en móvil y escritorio

## Fase 5: Tablas
- [ ] Hacer tablas responsive real en:
  - [ ] `pages/index.vue`
  - [ ] `pages/cuentas.vue`
  - [ ] `pages/movimientos.vue`
- [ ] Controlar overflow-x solo dentro del contenedor cuando sea necesario

## Fase 6: Validación final obligatoria
- [ ] Probar 320x568
- [ ] Probar 375x667
- [ ] Probar 390x844
- [ ] Probar 414x896
- [ ] Probar 768x1024
- [ ] Probar 1366x768
- [ ] Confirmar: sin errores de consola, sin overflow horizontal, sidebar y navbar OK, dashboard OK, charts completos, footer correcto

