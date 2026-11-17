/* 购物车页面：数量、金额和演示结账都在浏览器本地完成。 */
const cajaVacia = document.querySelector("#carrito-vacio");
const cajaContenido = document.querySelector("#carrito-contenido");
const cajaPedido = document.querySelector("#pedido-ok");
const filasCarrito = document.querySelector("#carrito-lista");

function pintarCarrito() {
  const items = leerCarrito();
  cajaPedido.hidden = true;
  cajaVacia.hidden = items.length > 0;
  cajaContenido.hidden = items.length === 0;

  filasCarrito.innerHTML = items.map(function (item) {
    return `
      <article class="cart-row">
        <div class="cart-thumb"><img src="${escapar(item.imagen || "img/default.svg")}" alt="${escapar(item.nombre)}"></div>
        <div class="cart-row-info">
          <h2 class="cart-row-name">${escapar(item.nombre)}</h2>
          <p class="cart-row-meta">${formatearPrecio(item.precio)} por unidad</p>
          <div class="cart-row-bottom">
            <div class="qty" aria-label="Cantidad de ${escapar(item.nombre)}">
              <button class="qty-btn" type="button" data-accion="menos" data-id="${item.id}" aria-label="Quitar una unidad de ${escapar(item.nombre)}">−</button>
              <span class="qty-value">${item.cantidad}</span>
              <button class="qty-btn" type="button" data-accion="mas" data-id="${item.id}" aria-label="Añadir una unidad de ${escapar(item.nombre)}" ${item.stock !== undefined && item.cantidad >= item.stock ? "disabled" : ""}>+</button>
            </div>
            <span class="cart-row-price">${formatearPrecio(item.precio * item.cantidad)}</span>
            <button class="cart-remove" type="button" data-accion="quitar" data-id="${item.id}">Eliminar</button>
          </div>
        </div>
      </article>`;
  }).join("");

  document.querySelector("#resumen-articulos").textContent = contarArticulos(items);
  document.querySelector("#resumen-total").textContent = formatearPrecio(totalCarrito(items));
}

filasCarrito.addEventListener("click", function (evento) {
  const boton = evento.target.closest("button[data-accion]");
  if (!boton) return;
  const id = Number(boton.dataset.id);
  if (boton.dataset.accion === "mas") cambiarCantidad(id, 1);
  if (boton.dataset.accion === "menos") cambiarCantidad(id, -1);
  if (boton.dataset.accion === "quitar") quitarDelCarrito(id);
  pintarCarrito();
});

document.querySelector("#btn-vaciar").addEventListener("click", function () {
  vaciarCarrito();
  pintarCarrito();
  toast("Carrito vaciado");
});

document.querySelector("#btn-comprar").addEventListener("click", function () {
  const items = leerCarrito();
  if (!items.length) return;
  try {
    guardarPedido(items);
    vaciarCarrito();
    cajaContenido.hidden = true;
    cajaVacia.hidden = true;
    cajaPedido.hidden = false;
  } catch (error) {
    toast("No se pudo guardar el pedido en este navegador.", "error");
  }
});

pintarCarrito();
