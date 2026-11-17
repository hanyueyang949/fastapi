# Historias de usuario · letdosport

**Alcance:** catálogo deportivo con FastAPI + SQLite y tienda HTML/CSS/JavaScript sin framework. El carrito y los pedidos de demostración se guardan en `localStorage`; no hay autenticación ni pago real.

| ID | Como… quiero… para… | Criterios de aceptación |
|---|---|---|
| US-01 | Como visitante, quiero ver el catálogo para descubrir deportes. | Se muestran Tenis, Skydiving, Kite surfing y Paddle boarding con nombre, precio, foto local y stock; el catálogo viene de `GET /deportes/`. |
| US-02 | Como visitante, quiero ver el detalle para conocer la actividad. | «Ver detalle» muestra imagen, descripción, precio y disponibilidad; «Volver» regresa al listado. |
| US-03 | Como gestor, quiero añadir una actividad para actualizar la tienda. | Formulario con nombre, descripción, precio positivo, stock no negativo e imagen; `POST /deportes/` devuelve 201. |
| US-04 | Como gestor, quiero corregir una actividad para mantener los datos. | «Editar» solo en detalle; formulario precargado; `PUT /deportes/{id}` refleja los cambios. |
| US-05 | Como gestor, quiero eliminar una actividad para quitarla del catálogo. | Se pide confirmación antes de `DELETE /deportes/{id}`; al cancelar, no se borra. |
| US-06 | Como comprador, quiero añadir actividades al carrito para comprarlas juntas. | «Añadir» en cada tarjeta; artículos iguales se agrupan; la cantidad queda guardada al recargar. Los agotados no pueden añadirse. |
| US-07 | Como comprador, quiero ajustar mi carrito para revisar el importe. | `+`, `−`, «Eliminar» y «Vaciar» actualizan el subtotal, total y contador de cabecera. |
| US-08 | Como comprador, quiero finalizar una compra de prueba para ver el proceso. | «Finalizar compra» guarda un pedido local, vacía el carrito y muestra confirmación; no solicita tarjeta ni procesa pagos. |
| US-09 | Como visitante, quiero consultar mi cuenta para ver carrito y pedidos. | «Usuario» abre un perfil de ejemplo con avatar, nombre, correo y pedidos guardados en este navegador. |
| US-10 | Como visitante, quiero saber si ocurre un error para poder reintentar. | Hay estados de carga, catálogo vacío y error; errores de formulario legibles, con reintento de conexión. |
| US-11 | Como visitante móvil, quiero usar la tienda desde el teléfono. | Tarjetas, ficha, carrito y cuenta se adaptan al ancho móvil sin desplazamiento horizontal. |

## Definición de terminado

- La API responde con códigos correctos (`200`, `201`, `204`, `404`, `422`).
- El catálogo y el carrito funcionan con ratón o teclado, con textos en español.
- Los datos persistidos se recuperan tras recargar; el checkout se identifica como demostración.
- Las ilustraciones se sirven desde `frontend/img/` sin dependencias externas.
