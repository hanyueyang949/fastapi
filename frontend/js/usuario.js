/* 个人中心为演示页面；订单和购物车都只读取本浏览器。 */
const itemsPerfil = leerCarrito();
const listaPerfil = document.querySelector("#perfil-carrito-lista");
if (itemsPerfil.length) {
  document.querySelector("#perfil-carrito-resumen").textContent =
    contarArticulos(itemsPerfil) + " artículos · " + formatearPrecio(totalCarrito(itemsPerfil));
  listaPerfil.innerHTML = itemsPerfil.map(function (item) {
    return `<li class="mini-item">
      <div class="mini-thumb"><img src="${escapar(item.imagen || "img/default.svg")}" alt=""></div>
      <span class="mini-name">${escapar(item.nombre)} <span class="mini-meta">× ${item.cantidad}</span></span>
      <strong>${formatearPrecio(item.precio * item.cantidad)}</strong>
    </li>`;
  }).join("");
}

const pedidosPerfil = leerPedidos();
if (pedidosPerfil.length) {
  document.querySelector("#perfil-pedidos-vacio").hidden = true;
  document.querySelector("#perfil-pedidos-lista").innerHTML = pedidosPerfil.map(function (pedido) {
    const fecha = new Date(pedido.fecha);
    const textoFecha = Number.isNaN(fecha.getTime()) ? "Fecha no disponible" : fecha.toLocaleDateString("es-ES");
    return `<li class="order-item">
      <span><span class="order-id">${escapar(pedido.numero)}</span><br>
      <span class="order-date">${textoFecha} · ${contarArticulos(pedido.articulos)} artículos</span></span>
      <span class="order-total">${formatearPrecio(pedido.total)}</span>
    </li>`;
  }).join("");
}
