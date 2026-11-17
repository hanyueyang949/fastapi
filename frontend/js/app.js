/* ============================================================
   app.js — LÓGICA DE LA TIENDA (letdosport)
   ------------------------------------------------------------
   Bloques:
   1. Referencias al DOM
   2. Vistas y estados
   3. Plantilla de tarjeta
   4. Catálogo   (GET  /deportes/)
   5. Formulario (POST /deportes/, PUT /deportes/{id})
   6. Ficha y borrado (GET 1, DELETE)
   7. Carrito    (usa js/cart.js)
   8. Eventos
   9. Arranque

   ⚠ Aquí no se escribe fetch: todo pasa por DeportesAPI (api.js).
   ============================================================ */

/* ---------- 1. Referencias al DOM ---------- */
const lista = document.querySelector("#lista");

const estadoCargando = document.querySelector("#estado-cargando");
const estadoVacio    = document.querySelector("#estado-vacio");
const estadoError    = document.querySelector("#estado-error");
const textoError     = document.querySelector("#error-texto");
const btnReintentar  = document.querySelector("#btn-reintentar");

/* Formulario */
const panelFormulario = document.querySelector("#panel-formulario");
const form            = document.querySelector("#form-deporte");
const formTitulo      = document.querySelector("#form-titulo");
const formSubtitulo   = document.querySelector("#form-subtitulo");
const formError       = document.querySelector("#form-error");
const btnNuevo        = document.querySelector("#btn-nuevo");
const btnGuardar      = document.querySelector("#btn-guardar");
const btnCancelar     = document.querySelector("#btn-cancelar");
const inputId         = document.querySelector("#deporte-id");
const campoNombre     = document.querySelector("#campo-nombre");
const campoDescripcion = document.querySelector("#campo-descripcion");
const campoPrecio     = document.querySelector("#campo-precio");
const campoStock      = document.querySelector("#campo-stock");
const campoImagen     = document.querySelector("#campo-imagen");

/* Ficha de detalle */
const panelDetalle   = document.querySelector("#panel-detalle");
const detalleImagen  = document.querySelector("#detalle-imagen");
const detalleNombre  = document.querySelector("#detalle-nombre");
const detallePrecio  = document.querySelector("#detalle-precio");
const detalleStock   = document.querySelector("#detalle-stock");
const detalleTexto   = document.querySelector("#detalle-descripcion");
const detalleId      = document.querySelector("#detalle-id");
const btnVolver      = document.querySelector("#btn-volver");
const btnDetalleAnadir = document.querySelector("#btn-detalle-anadir");
const btnDetalleEditar = document.querySelector("#btn-detalle-editar");
const btnDetalleEliminar = document.querySelector("#btn-detalle-eliminar");

/* Estado en memoria */
let deportes = [];            // lo que devolvió el servidor la última vez
let deporteActual = null;     // el que se está viendo en la ficha


/* ---------- 2. Vistas y estados ---------- */
function ocultarEstados() {
  estadoCargando.hidden = true;
  estadoVacio.hidden    = true;
  estadoError.hidden    = true;
}

function ocultarVistas() {
  panelFormulario.hidden = true;
  panelDetalle.hidden    = true;
  ocultarEstados();
}

function mostrarVistaLista() {
  ocultarVistas();
  lista.hidden = false;
}

function mostrarCargando() {
  mostrarVistaLista();
  lista.innerHTML = "";
  estadoCargando.hidden = false;
}

function mostrarVacio() {
  mostrarVistaLista();
  lista.innerHTML = "";
  estadoVacio.hidden = false;
}

function mostrarError(mensaje) {
  mostrarVistaLista();
  lista.innerHTML = "";
  textoError.textContent = mensaje;
  estadoError.hidden = false;
}


/* ---------- 3. Plantilla de tarjeta ---------- */
function tarjetaHTML(deporte) {
  const agotado = deporte.stock <= 0;

  const badge = agotado
    ? '<span class="badge badge-out">Agotado</span>'
    : '<span class="badge badge-ok">' + deporte.stock + " uds.</span>";

  return `
    <article class="card sport-card">
      <div class="card-media">
        <img src="${escapar(deporte.imagen || "img/default.svg")}"
             alt="${escapar(deporte.nombre)}">
      </div>

      <div class="card-body">
        <div class="card-top">
          <h2 class="card-title">${escapar(deporte.nombre)}</h2>
          ${badge}
        </div>

        <p class="card-desc">${escapar(deporte.descripcion)}</p>

        <div class="card-bottom">
          <span class="price">${formatearPrecio(deporte.precio)}</span>
          <span class="card-id">#${deporte.id}</span>
        </div>

        <div class="card-actions">
          <button class="btn btn-ghost btn-sm" type="button"
                  data-accion="detalle" data-id="${deporte.id}">Ver detalle</button>
          <button class="btn btn-primary btn-sm" type="button"
                  data-accion="anadir" data-id="${deporte.id}"
                  ${agotado ? "disabled" : ""}>${agotado ? "Agotado" : "Añadir"}</button>
        </div>
      </div>
    </article>`;
}


/* ---------- 4. Catálogo ---------- */
async function cargarDeportes() {
  mostrarCargando();

  try {
    deportes = await DeportesAPI.list();

    if (!deportes || deportes.length === 0) {
      mostrarVacio();
      return;
    }

    lista.innerHTML = deportes.map(tarjetaHTML).join("");
    ocultarEstados();

  } catch (error) {
    mostrarError(error.message);
  }
}

/* Busca un deporte en la lista ya cargada (evita una petición de más) */
function buscarDeporte(id) {
  return deportes.find(function (d) { return d.id === id; });
}


/* ---------- 5. Formulario ---------- */
function abrirFormulario(deporte) {
  form.reset();
  ocultarErrorFormulario();

  if (deporte) {
    inputId.value          = deporte.id;
    campoNombre.value      = deporte.nombre;
    campoDescripcion.value = deporte.descripcion;
    campoPrecio.value      = deporte.precio;
    campoStock.value       = deporte.stock;
    campoImagen.value      = deporte.imagen;

    formTitulo.textContent    = "Editar deporte";
    formSubtitulo.textContent = "Modifica los datos y pulsa Guardar.";
  } else {
    inputId.value = "";

    formTitulo.textContent    = "Nuevo deporte";
    formSubtitulo.textContent = "Rellena los datos del deporte o actividad.";
  }

  ocultarVistas();
  lista.hidden = true;
  panelFormulario.hidden = false;

  campoNombre.focus();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function cerrarFormulario() {
  mostrarVistaLista();
}

function mostrarErrorFormulario(mensaje) {
  formError.textContent = mensaje;
  formError.hidden = false;
}

function ocultarErrorFormulario() {
  formError.textContent = "";
  formError.hidden = true;
}

/* Validación en el navegador: evita una petición inútil.
   El servidor valida otra vez (Pydantic); eso es la red de seguridad. */
function validarFormulario() {
  const nombre      = campoNombre.value.trim();
  const descripcion = campoDescripcion.value.trim();
  const precio      = campoPrecio.value.trim();
  const stock       = campoStock.value.trim();

  if (!nombre) return "El nombre es obligatorio.";
  if (!descripcion) return "La descripción es obligatoria.";

  if (precio === "" || isNaN(Number(precio)) || Number(precio) <= 0) {
    return "El precio debe ser un número mayor que 0.";
  }

  if (stock === "" || !Number.isInteger(Number(stock)) || Number(stock) < 0) {
    return "El stock debe ser un número entero igual o mayor que 0.";
  }

  return null;
}

async function enviarFormulario(evento) {
  evento.preventDefault();

  ocultarErrorFormulario();

  const mensajeValidacion = validarFormulario();
  if (mensajeValidacion) {
    mostrarErrorFormulario(mensajeValidacion);
    return;
  }

  const datos = {
    nombre:      campoNombre.value.trim(),
    descripcion: campoDescripcion.value.trim(),
    precio:      Number(campoPrecio.value),
    stock:       Number(campoStock.value),
    imagen:      campoImagen.value.trim() || "img/default.svg",
  };

  const id = inputId.value;
  const esEdicion = id !== "";

  btnGuardar.disabled = true;
  btnGuardar.textContent = "Guardando…";

  try {
    if (esEdicion) {
      await DeportesAPI.update(id, datos);        // PUT /deportes/{id}
      toast("Deporte actualizado correctamente");
    } else {
      await DeportesAPI.create(datos);            // POST /deportes/
      toast("Deporte añadido al catálogo");
    }

    deporteActual = null;
    cerrarFormulario();
    await cargarDeportes();

  } catch (error) {
    // 422 / 500 / red: el mensaje ya viene "traducido" desde api.js
    mostrarErrorFormulario(error.message);

  } finally {
    btnGuardar.disabled = false;
    btnGuardar.textContent = "Guardar";
  }
}


/* ---------- 6. Ficha y borrado ---------- */
async function verDetalle(id) {
  ocultarVistas();
  lista.hidden = true;

  try {
    const deporte = await DeportesAPI.get(id);     // GET /deportes/{id}
    pintarDetalle(deporte);
  } catch (error) {
    mostrarError(error.message);
  }
}

function pintarDetalle(deporte) {
  deporteActual = deporte;

  detalleImagen.src = deporte.imagen || "img/default.svg";
  detalleImagen.alt = deporte.nombre;
  detalleNombre.textContent = deporte.nombre;
  detallePrecio.textContent = formatearPrecio(deporte.precio);
  detalleStock.textContent  = deporte.stock > 0
    ? deporte.stock + " unidades disponibles"
    : "Agotado";
  detalleTexto.textContent  = deporte.descripcion;
  detalleId.textContent     = "#" + deporte.id;

  /* Los botones se reutilizan entre fichas: hay que resetearlos */
  btnDetalleEliminar.disabled = false;
  btnDetalleEliminar.textContent = "Eliminar";

  btnDetalleAnadir.disabled = deporte.stock <= 0;
  btnDetalleAnadir.textContent = deporte.stock > 0 ? "Añadir al carrito" : "Agotado";

  ocultarVistas();
  lista.hidden = true;
  panelDetalle.hidden = false;

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function volverALista() {
  deporteActual = null;
  mostrarVistaLista();
}

async function eliminarDeporte(deporte) {
  if (!deporte) return;

  const confirmado = window.confirm(
    "¿Eliminar «" + deporte.nombre + "» del catálogo?\n\nEsta acción no se puede deshacer."
  );

  if (!confirmado) return;

  btnDetalleEliminar.disabled = true;
  btnDetalleEliminar.textContent = "Eliminando…";

  try {
    await DeportesAPI.remove(deporte.id);          // DELETE /deportes/{id}
    toast("Deporte eliminado del catálogo");
    deporteActual = null;
    await cargarDeportes();
  } catch (error) {
    toast(error.message, "error");
    btnDetalleEliminar.disabled = false;
    btnDetalleEliminar.textContent = "Eliminar";
  }
}


/* ---------- 7. Carrito ---------- */
function anadirDesdeTarjeta(id) {
  const deporte = buscarDeporte(id);
  if (!deporte) return;

  const resultado = anadirAlCarrito(deporte);      // js/cart.js
  toast(resultado ? "«" + deporte.nombre + "» añadido al carrito" : "No quedan más unidades disponibles", resultado ? "ok" : "error");
}

function anadirDesdeFicha() {
  if (!deporteActual) return;

  const resultado = anadirAlCarrito(deporteActual);
  toast(resultado ? "«" + deporteActual.nombre + "» añadido al carrito" : "No quedan más unidades disponibles", resultado ? "ok" : "error");
}


/* ---------- 8. Eventos ---------- */

btnNuevo.addEventListener("click", function () {
  abrirFormulario(null);
});

btnCancelar.addEventListener("click", function () {
  cerrarFormulario();
});

form.addEventListener("submit", enviarFormulario);
btnReintentar.addEventListener("click", cargarDeportes);

btnVolver.addEventListener("click", volverALista);
btnDetalleAnadir.addEventListener("click", anadirDesdeFicha);

btnDetalleEditar.addEventListener("click", function () {
  if (deporteActual) abrirFormulario(deporteActual);
});

btnDetalleEliminar.addEventListener("click", function () {
  eliminarDeporte(deporteActual);
});

/* Delegación: un solo listener para todos los botones de las tarjetas */
lista.addEventListener("click", async function (evento) {

  const boton = evento.target.closest("button[data-accion]");
  if (!boton) return;

  const id = Number(boton.dataset.id);
  const accion = boton.dataset.accion;

  if (accion === "anadir") {
    anadirDesdeTarjeta(id);
    return;
  }

  if (accion === "detalle") {
    verDetalle(id);
  }
});


/* ---------- 9. Arranque ---------- */
cargarDeportes();
