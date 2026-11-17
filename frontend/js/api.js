/* ============================================================
   api.js — CAPA DE RED DE LETDOSPORT
   ------------------------------------------------------------
   唯一的职责：和后端说话。
   它不知道页面长什么样，也不知道按钮叫什么。

   ⚠ 以后如果后端换个地址、或者接口改名，
     只需要改这个文件的第一行。
   ============================================================ */

const API_BASE = "http://127.0.0.1:8000";


/* ------------------------------------------------------------
   1. extraerMensaje() — 把后端的错误变成一句人话
   ------------------------------------------------------------
   后端可能返回：
     {"detail": "No existe un deporte con id 99"}
     {"detail": [{"loc": ["body","precio"], "msg": "..."}]}   ← 422
   ------------------------------------------------------------ */
function extraerMensaje(cuerpo, codigo) {
  if (!cuerpo) return "Error " + codigo + " del servidor.";

  if (typeof cuerpo.detail === "string") {
    return cuerpo.detail;
  }

  if (Array.isArray(cuerpo.detail)) {
    return cuerpo.detail
      .map(function (e) {
        const campo = e.loc ? e.loc[e.loc.length - 1] : "?";
        return campo + ": " + e.msg;
      })
      .join(" · ");
  }

  return "Error " + codigo + " del servidor.";
}


/* ------------------------------------------------------------
   2. request() — 所有请求都从这里走
   ------------------------------------------------------------ */
async function request(ruta, opciones) {
  const config = opciones || {};

  let respuesta;

  try {
    respuesta = await fetch(API_BASE + ruta, {
      method: config.method || "GET",
      headers: { "Content-Type": "application/json" },
      body: config.body ? JSON.stringify(config.body) : undefined,
    });
  } catch (error) {
    throw new Error("No se pudo conectar con el servidor. Comprueba que el backend esté en marcha en el puerto 8000.");
  }

  if (respuesta.status === 204) return null;          // DELETE：没有内容

  const texto = await respuesta.text();
  const cuerpo = texto ? JSON.parse(texto) : null;

  if (!respuesta.ok) {
    throw new Error(extraerMensaje(cuerpo, respuesta.status));
  }

  return cuerpo;
}


/* ------------------------------------------------------------
   3. DeportesAPI — 5 个操作，对应 5 个端点
   ------------------------------------------------------------ */
const DeportesAPI = {

  list() {
    return request("/deportes/");                     // GET /deportes/
  },

  get(id) {
    return request("/deportes/" + id);                // GET /deportes/{id}
  },

  create(datos) {
    return request("/deportes/", {                    // POST /deportes/
      method: "POST",
      body: datos,
    });
  },

  update(id, datos) {
    return request("/deportes/" + id, {               // PUT /deportes/{id}
      method: "PUT",
      body: datos,
    });
  },

  remove(id) {
    return request("/deportes/" + id, {               // DELETE /deportes/{id}
      method: "DELETE",
    });
  },
};
