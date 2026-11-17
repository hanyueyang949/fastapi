/* ============================================================
   cart.js — EL CARRITO (guardado en el navegador)
   ------------------------------------------------------------
   购物车不需要后端：数据就存在 localStorage 里，刷新页面也不会丢。

   结构（一个数组）：
     [
       { id: 1, nombre: "Tenis", precio: 89.9, imagen: "img/tenis.svg", cantidad: 2 },
       ...
     ]

   两个页面（index.html 和 carrito.html）都引用这个文件，
   所以两边的数量角标永远同步。
   ============================================================ */

const CLAVE_CARRITO = "letdosport-carrito";


/* ---------- 1. Leer y guardar ---------- */
function leerCarrito() {
  try {
    const texto = localStorage.getItem(CLAVE_CARRITO);
    const lista = texto ? JSON.parse(texto) : [];
    return Array.isArray(lista) ? lista : [];
  } catch (error) {
    // Si alguien tocó el localStorage a mano y lo dejó roto, empezamos de cero
    return [];
  }
}

function guardarCarrito(items) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items));
  actualizarContadorCarrito();
}


/* ---------- 2. Operaciones ---------- */
/* 加入购物车：已经在里面的，数量 +1 */
function anadirAlCarrito(deporte, cantidad) {
  const items = leerCarrito();
  const cuantas = cantidad || 1;
  const existente = items.find(function (i) { return i.id === deporte.id; });

  if (deporte.stock <= 0 || (existente && existente.cantidad + cuantas > deporte.stock)) {
    return false;
  }

  if (existente) {
    existente.cantidad += cuantas;
    existente.stock = deporte.stock;
  } else {
    items.push({
      id: deporte.id,
      nombre: deporte.nombre,
      precio: deporte.precio,
      imagen: deporte.imagen,
      cantidad: cuantas,
      stock: deporte.stock,
    });
  }

  guardarCarrito(items);
  return items;
}

function cambiarCantidad(id, delta) {
  const items = leerCarrito();
  const item = items.find(function (i) { return i.id === id; });
  if (!item) return items;
  if (delta > 0 && item.stock !== undefined && item.cantidad + delta > item.stock) {
    return items;
  }

  item.cantidad += delta;

  if (item.cantidad < 1) {
    return quitarDelCarrito(id);
  }

  guardarCarrito(items);
  return items;
}

function quitarDelCarrito(id) {
  const items = leerCarrito().filter(function (i) { return i.id !== id; });
  guardarCarrito(items);
  return items;
}

function vaciarCarrito() {
  guardarCarrito([]);
}


/* ---------- 3. Cuentas ---------- */
function contarArticulos(items) {
  return (items || leerCarrito()).reduce(function (total, i) {
    return total + i.cantidad;
  }, 0);
}

function totalCarrito(items) {
  return (items || leerCarrito()).reduce(function (total, i) {
    return total + i.precio * i.cantidad;
  }, 0);
}


/* ---------- 4. El numerito del icono del carrito ---------- */
function actualizarContadorCarrito() {
  const total = contarArticulos();

  document.querySelectorAll("[data-contador-carrito]").forEach(function (el) {
    el.textContent = total;
    el.hidden = total === 0;      // 0 的时候不显示，更干净
  });
}


/* ---------- 5. Pedidos (demostración) ---------- */
/* 结账不接支付：只是把购物车内容抄一份存起来，给 usuario.html 显示。 */
const CLAVE_PEDIDOS = "letdosport-pedidos";

function leerPedidos() {
  try {
    const texto = localStorage.getItem(CLAVE_PEDIDOS);
    const lista = texto ? JSON.parse(texto) : [];
    return Array.isArray(lista) ? lista : [];
  } catch (error) {
    return [];
  }
}

function guardarPedido(items) {
  const numero = "LS-" + String(Date.now()).slice(-6);

  const pedido = {
    numero: numero,
    fecha: new Date().toISOString(),
    total: totalCarrito(items),
    articulos: items.map(function (i) {
      return { nombre: i.nombre, cantidad: i.cantidad, precio: i.precio };
    }),
  };

  const pedidos = leerPedidos();
  pedidos.unshift(pedido);

  // 只保留最近 10 个，避免 localStorage 越积越大
  localStorage.setItem(CLAVE_PEDIDOS, JSON.stringify(pedidos.slice(0, 10)));

  return pedido;
}

/* 页面加载时先同步一次 */
document.addEventListener("DOMContentLoaded", actualizarContadorCarrito);
