# Tablero Kanban · letdosport

**Documento relacionado:** [Historias de usuario](./historias-usuario.md)

Las tarjetas avanzan de **Backlog → En curso → Hecho**, con límite WIP de 2 en «En curso».

## Backlog

| Tarjeta | Prioridad | Notas |
|---|---|---|
| T-01 · Automatizar pruebas de API y carrito | Media | Añadir pytest y pruebas JS independientes del navegador |
| T-02 · Pedidos y usuarios reales | Baja | Requiere autenticación, tablas propias y API; fuera del alcance de esta demo |
| T-03 · Pago real | Baja | Requiere proveedor de pago; no se simula cobro |

## En curso

| Tarjeta | Prioridad | Notas |
|---|---|---|
| — | — | Sin tareas abiertas |

## Hecho

| Tarjeta | Prioridad | Evidencia |
|---|---|---|
| US-01, US-02 · Catálogo y detalle | Alta | API `/deportes/` y `/deportes/{id}`; cuatro ilustraciones SVG locales |
| US-03, US-04, US-05 · CRUD deportivo | Alta | Formulario de alta y edición en detalle; eliminación confirmada |
| US-06, US-07 · Carrito | Alta | localStorage, cantidades, importes y contador compartido entre páginas |
| US-08 · Compra de demostración | Media | Guarda pedido local y vacía carrito, sin cobrar |
| US-09 · Perfil | Media | Avatar, datos de ejemplo, resumen del carrito e historial local |
| US-10, US-11 · Estados y diseño móvil | Media | Estados de carga/error/vacío y CSS responsive |

> Este tablero documenta funcionalidades implementadas; las comprobaciones manuales se describen en la entrega.
