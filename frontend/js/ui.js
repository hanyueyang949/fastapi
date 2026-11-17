/* ============================================================
   ui.js — PIEZAS DE INTERFAZ REUTILIZABLES
   ------------------------------------------------------------
   Aquí viven las cosas "genéricas" que no tienen que ver con
   deportes: notificaciones (toast), escape de HTML y formato
   de precios.
   ============================================================ */


/* ------------------------------------------------------------
   1. escapar() — convertir texto en HTML seguro
   ------------------------------------------------------------
   问题：如果一个名字叫
        <img src=x onerror="alert('hackeado')">
   直接塞进 innerHTML 就会被浏览器当成代码执行（XSS 攻击）。

   解决：把 5 个特殊字符换成"实体"，浏览器就只当文字显示。
   ------------------------------------------------------------ */
function escapar(texto) {
  return String(texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}


/* ------------------------------------------------------------
   2. toast() — 右下角弹出的小提示
   ------------------------------------------------------------
   用法：
     toast("Añadido al carrito");            // 绿色
     toast("No se pudo guardar", "error");   // 红色
   ------------------------------------------------------------ */
function toast(mensaje, tipo) {
  const contenedor = document.querySelector("#toasts");
  if (!contenedor) return;

  const el = document.createElement("div");
  el.className = "toast toast-" + (tipo || "ok");
  el.textContent = mensaje;

  contenedor.appendChild(el);

  // 3.2 秒后自动消失（点一下也能提前关掉）
  const temporizador = setTimeout(function () {
    el.remove();
  }, 3200);

  el.addEventListener("click", function () {
    clearTimeout(temporizador);
    el.remove();
  });
}


/* ------------------------------------------------------------
   3. formatearPrecio() — 89.9 → "89,90 €"
   ------------------------------------------------------------
   En España el decimal va con coma y el símbolo detrás.
   toFixed(2) garantiza siempre dos decimales (89.9 → 89.90).
   ------------------------------------------------------------ */
function formatearPrecio(valor) {
  const numero = Number(valor) || 0;
  return numero.toFixed(2).replace(".", ",") + " €";
}
