/*
 * REPRODUCTOR DE AUDIO
 */
import "wave-audio-path-player";

/*
 * SELECTOR AVANZADO
 */

import TomSelect from "tom-select";

/*
 * BÚSQUEDA
 */

let filtrosAplicados = {};
let paginaActual = 0;
let totalPaginas = 1;

function filtrar(termos) {
  let elementosPorPagina = 9;

  let termosFiltrados = [];

  for (const termo of termos) {
    termo.classList.remove("oculto");
    let estaEnTodosFiltros = true;

    for (let filtroAplicado in filtrosAplicados) {
      let valorFiltro = filtrosAplicados[filtroAplicado];
      let estaEnFiltro = false;

      if (filtroAplicado == "buscar") {
        let termoTexto = termo
          .querySelector("#termo-nome")
          .innerText.trim()
          .toLowerCase();

        if (termoTexto.indexOf(valorFiltro) == -1) {
          estaEnFiltro = false;
        } else {
          estaEnFiltro = true;
        }
      } else {
        let filtroTermo = termo.dataset[filtroAplicado].trim();

        let filtrosTermoSeparados = filtroTermo.split(", ");

        filtrosTermoSeparados.forEach((filtroTermoSeparado) => {
          if (filtroTermoSeparado == valorFiltro) {
            estaEnFiltro = true;
            return;
          }
        });
      }

      if (!estaEnFiltro) {
        termo.classList.add("oculto");
        estaEnTodosFiltros = false;
        break;
      }
    }

    if (estaEnTodosFiltros) {
      termosFiltrados.push(termo);
    }
  }

  totalPaginas = Math.ceil(termosFiltrados.length / elementosPorPagina);
  const minPagina = paginaActual * elementosPorPagina;
  const maxPagina = (paginaActual + 1) * elementosPorPagina;
  let index = 0;
  for (const elemento of termosFiltrados) {
    if (index < minPagina || index >= maxPagina) {
      elemento.classList.add("oculto");
    }
    index++;
  }

  const paginador = document.querySelector("#filtro-paginador");
  if (totalPaginas > 1) {
    paginador.querySelector("#filtro-paginador-pagina").innerHTML =
      paginaActual + 1 + "/" + totalPaginas;
    paginador.classList.remove("oculto");
  } else {
    paginador.classList.add("oculto");
  }

  const resumen = document.querySelector("#filtro-resumen");
  let textosResumen = [];
  if (filtrosAplicados["categorias"]) {
    const categoria = document.querySelector(
      "#filtro-categorias a[data-id='" + filtrosAplicados["categorias"] + "']"
    );
    if (categoria) {
      textosResumen.push(categoria.innerText);
    }
  }
  if (filtrosAplicados["buscar"]) {
    textosResumen.push('que conteñen "' + filtrosAplicados["buscar"] + '"');
  }
  if (filtrosAplicados["campos"]) {
    const campo = document.querySelector(
      "#filtro-campos a[data-id='" + filtrosAplicados["campos"] + "']"
    );
    if (campo) {
      textosResumen.push('no campo de "' + campo.innerText + '"');
    }
  }
  if (filtrosAplicados["concellos"]) {
    textosResumen.push("en " + filtrosAplicados["concellos"]);
  }

  let textoResumen = "";
  if (textosResumen.length > 0) {
    if (!filtrosAplicados["categorias"]) {
      textoResumen += "Termos ";
    }
    textoResumen += textosResumen.join(", ");
  } else {
    textoResumen = "Todos";
  }
  resumen.innerHTML = textoResumen;
}

function crearFiltro(termos, nombreFiltro) {
  let enlaces = document.querySelectorAll("#filtro-" + nombreFiltro + " a");

  enlaces.forEach((enlace) => {
    enlace.addEventListener("click", (event) => {
      event.preventDefault();

      let filtroEnlace = enlace.dataset.id;

      enlaces.forEach((enlace) => {
        enlace.classList.remove("link-activo");
      });
      enlace.classList.add("link-activo");

      if (filtroEnlace != "0") {
        filtrosAplicados[nombreFiltro] = filtroEnlace;
      } else {
        delete filtrosAplicados[nombreFiltro];
      }

      paginaActual = 0;
      filtrar(termos);
    });
  });
}

document.querySelectorAll("#termos-lista").forEach((lista) => {
  let termos = lista.children;

  crearFiltro(termos, "categorias");
  crearFiltro(termos, "campos");
  crearFiltro(termos, "concellos");

  let buscador = document.querySelector("#fitro-buscador");

  buscador.addEventListener("keyup", function (event) {
    let textoBuscado = buscador.value.trim().toLowerCase();
    // console.log(textoBuscado);
    filtrosAplicados["buscar"] = textoBuscado;
    paginaActual = 0;
    filtrar(termos);
  });

  const paginador = document.querySelector("#filtro-paginador");
  paginador
    .querySelector("#filtro-paginador-anterior")
    .addEventListener("click", (event) => {
      event.preventDefault();
      if (paginaActual > 0) {
        paginaActual--;
        filtrar(termos);
      }
    });
  paginador
    .querySelector("#filtro-paginador-siguiente")
    .addEventListener("click", (event) => {
      event.preventDefault();
      if (paginaActual < totalPaginas - 1) {
        paginaActual++;
        filtrar(termos);
      }
    });

  filtrar(termos);
});

/*
 * NOVO TERMO
 */

document.querySelectorAll("#novo-termo-termo").forEach((termo) => {
  // Obtenemos el parámetro "termo" de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const termoParam = urlParams.get("termo");
  if (termoParam) {
    termo.value = termoParam;
  }
});

document.querySelectorAll("#bloque-desplegable").forEach((bloque) => {
  bloque.querySelectorAll("#desplegable-trigger").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();

      bloque.querySelectorAll("#desplegable-contenido").forEach((contenido) => {
        contenido.classList.toggle("oculto");
      });
    });
  });
});

function crearFileInput(bloque, id) {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.id = id;
  fileInput.classList.add("oculto");
  bloque.parentNode.insertBefore(fileInput, bloque.nextSibling);

  bloque.addEventListener("click", (event) => {
    event.preventDefault();

    fileInput.click();
  });

  fileInput.addEventListener("change", (event) => {
    let file = event.target.files[0];
    if (file) {
      const nombreRecortado =
        file.name.length > 20 ? file.name.slice(0, 20) + "..." : file.name;
      bloque.innerText = nombreRecortado;
    }
  });
}

document.querySelectorAll("#novo-termo-foto-subir").forEach((bloque) => {
  crearFileInput(bloque, "novo-termo-foto");
});

document.querySelectorAll("#novo-termo-audio-subir").forEach((bloque) => {
  crearFileInput(bloque, "novo-termo-audio");
});

/*
 * CONEXIÓN CON BACKEND
 */

import { Backend } from "./backend.js";

function obtenValoresSelect(id) {
  let options = document.getElementById(id).selectedOptions;
  let valores = [];
  for (let i = 0; i < options.length; i++) {
    valores.push(options[i].value);
  }
  return valores;
}

let backend = new Backend();
await backend.init();

if (!backend.estaLogueado) {
  document.querySelectorAll("#login-form").forEach((elemento) => {
    elemento.classList.remove("oculto");
  });
  document.querySelectorAll("#logout-form").forEach((elemento) => {
    elemento.classList.add("oculto");
  });

  document.querySelectorAll("#login-enviar").forEach((trigger) => {
    trigger.addEventListener("click", async (event) => {
      event.preventDefault();

      const padre = trigger.closest("#login-form");

      const email = padre.querySelector("#login-email").value;
      const password = padre.querySelector("#login-password").value;

      await backend.login(email, password, true);
    });
  });

  let registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.classList.remove("hidden");

    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      let email = document.getElementById("registerEmail").value;
      let password = document.getElementById("registerPassword").value;
      let name = document.getElementById("registerName").value;
      let relacion_valdeorras = document.getElementById(
        "registerRelacionValdeorras"
      ).value;
      let institucion = document.getElementById("registerInstitucion").value;

      await backend.registrarUsuario({
        email: email,
        password: password,
        nombre: name,
        relacion_valdeorras: relacion_valdeorras,
        institucion: institucion,
      });
    });
  }
} else {
  document.querySelectorAll("#login-form").forEach((elemento) => {
    elemento.classList.add("oculto");
  });
  document.querySelectorAll("#logout-form").forEach((elemento) => {
    elemento.classList.remove("oculto");
  });

  const perfil = await backend.perfil();

  document.querySelectorAll("#usuario-nome").forEach((element) => {
    element.innerText = perfil.first_name;
  });

  document.querySelectorAll("#logout-enviar").forEach((trigger) => {
    trigger.addEventListener("click", async (event) => {
      event.preventDefault();
      await backend.logout();
    });
  });

  document.querySelectorAll("#termo-comentario-form").forEach((elemento) => {
    elemento.classList.remove("oculto");
  });
  document.querySelectorAll("#termo-comentario-entrar").forEach((elemento) => {
    elemento.classList.add("oculto");
  });
}

document
  .querySelectorAll(
    "#novo-termo-ubicacion," +
      "#novo-termo-categoria," +
      "#novo-termo-campo," +
      "#novo-termo-foto-autoria," +
      "#novo-termo-informante-sexo," +
      "#novo-termo-audio-sexo"
  )
  .forEach((el) => {
    new TomSelect(el, {
      maxOptions: null,
      sortField: {
        field: "text",
        direction: "asc",
      },
    });
  });

document.querySelectorAll("#novo-termo-enviar").forEach((elemento) => {
  elemento.addEventListener("click", async (event) => {
    event.preventDefault();

    let datos = {
      termo: document.getElementById("novo-termo-termo").value,
      definicion: document.getElementById("novo-termo-definicion").value,

      ubicacion: obtenValoresSelect("novo-termo-ubicacion"),
      campos_semanticos: obtenValoresSelect("novo-termo-campo"),
      categorias: obtenValoresSelect("novo-termo-categoria"),

      foto: document.getElementById("novo-termo-foto").files[0],
      foto_autoria: document.getElementById("novo-termo-foto-autoria").value,
      foto_fonte: document.getElementById("novo-termo-foto-fonte").value,

      informante_nome: document.getElementById("novo-termo-informante-nome")
        .value,
      informante_sexo: document.getElementById("novo-termo-informante-sexo")
        .value,
      informante_data_nacemento: document.getElementById(
        "novo-termo-informante-data_nacemento"
      ).value,
      informante_nacemento: document.getElementById(
        "novo-termo-informante-nacemento"
      ).value,
      informante_residencia: document.getElementById(
        "novo-termo-informante-residencia"
      ).value,

      audio: document.getElementById("novo-termo-audio").files[0],
      audio_nome: document.getElementById("novo-termo-audio-nome").value,
      audio_sexo: document.getElementById("novo-termo-audio-sexo").value,
      audio_data_nacemento: document.getElementById(
        "novo-termo-audio-data_nacemento"
      ).value,
      audio_nacemento: document.getElementById("novo-termo-audio-nacemento")
        .value,
      audio_residencia: document.getElementById("novo-termo-audio-residencia")
        .value,
      audio_onde: document.getElementById("novo-termo-audio-onde").value,
      audio_termos: document.getElementById("novo-termo-audio-termos").value,
    };

    await backend.nuevaAportacion(datos);
  });
});

document.querySelectorAll("#termo-comentario-enviar").forEach((elemento) => {
  elemento.addEventListener("click", async (event) => {
    event.preventDefault();

    const comentario = document.getElementById("termo-comentario-comentario");

    const termo = comentario.dataset.termo;
    const comentarioTexto = comentario.value;

    let datos = {
      termo: termo,
      comentario: comentarioTexto,
    };

    await backend.nuevoComentario(datos);
  });
});

// TODO No debería poder acceder a esta página si ya está logueado

document.querySelectorAll("#rexistro-tipo button").forEach((trigger, iTipo) => {
  if (iTipo == 0) {
    trigger.classList.add("activo");
  }

  trigger.addEventListener("click", (event) => {
    event.preventDefault();

    document
      .querySelectorAll("#rexistro-tipo button")
      .forEach((boton, iBoton) => {
        if (iBoton == iTipo) {
          boton.classList.add("activo");
        } else {
          boton.classList.remove("activo");
        }
      });

    const forms = document.querySelector("#rexistro-forms").children;
    let iForm = 0;
    for (const form of forms) {
      if (iForm == iTipo) {
        form.classList.remove("oculto");
      } else {
        form.classList.add("oculto");
      }
      iForm++;
    }
  });
});

let botonRexistroPersoa = document.getElementById("rexistro-persoa-enviar");
if (botonRexistroPersoa) {
  botonRexistroPersoa.addEventListener("click", async (event) => {
    event.preventDefault();

    let nome = document.getElementById("rexistro-persoa-nome").value;
    let email = document.getElementById("rexistro-persoa-email").value;
    let password = document.getElementById("rexistro-persoa-password").value;
    let repassword = document.getElementById(
      "rexistro-persoa-repassword"
    ).value;
    let relacion_valdeorras = document.getElementById(
      "rexistro-persoa-relacion"
    ).value;
    let privacidade = document.getElementById(
      "rexistro-persoa-privacidade"
    ).checked;

    await backend.registrarUsuario({
      email: email,
      password: password,
      repassword: repassword,
      nombre: nome,
      relacion_valdeorras: relacion_valdeorras,
      institucion: 0,
      privacidade: privacidade,
    });
  });
}

let botonRexistroColectivo = document.getElementById(
  "rexistro-colectivo-enviar"
);
if (botonRexistroColectivo) {
  botonRexistroColectivo.addEventListener("click", async (event) => {
    event.preventDefault();

    let nome = document.getElementById("rexistro-colectivo-nome").value;
    let email = document.getElementById("rexistro-colectivo-email").value;
    let password = document.getElementById("rexistro-colectivo-password").value;
    let repassword = document.getElementById(
      "rexistro-colectivo-repassword"
    ).value;
    let relacion_valdeorras = document.getElementById(
      "rexistro-colectivo-relacion"
    ).value;
    let persoa_contacto = document.getElementById(
      "rexistro-colectivo-contacto"
    ).value;
    let privacidade = document.getElementById(
      "rexistro-colectivo-privacidade"
    ).checked;

    await backend.registrarUsuario({
      email: email,
      password: password,
      repassword: repassword,
      nombre: nome,
      relacion_valdeorras: relacion_valdeorras,
      persoa_contacto: persoa_contacto,
      institucion: 1,
      privacidade: privacidade,
    });
  });
}

document.querySelectorAll(".dropdown").forEach((dropdown) => {
  dropdown.querySelectorAll(".trigger button").forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();

      dropdown.querySelectorAll(".content").forEach((content) => {
        content.classList.toggle("hidden");
      });
    });
  });
});

document.querySelectorAll("#login-trigger").forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();

    const padre = trigger.closest("#login-popover");

    padre.querySelector("#login-contenido").classList.toggle("oculto");
  });
});

/*
 * AVISOS
 */

// Cerramos los avisos tanto al hacer click en el fondo como en el botón de cerrar,
// pero no en el aviso en sí
document.querySelectorAll("#aviso, #aviso-cerrar").forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();

    document.querySelector("#aviso").classList.add("oculto");
  });
});
document.querySelectorAll("#aviso-card").forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
  });
});

document.querySelectorAll("#termos-filtro-trigger").forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();

    document
      .querySelector("#termos-filtro-contenido")
      .classList.toggle("oculto");
  });
});

/*
 * SIDEBAR
 */
document
  .querySelectorAll("#sidebar-abrir, #sidebar-cerrar")
  .forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();

      document.querySelector("#sidebar").classList.toggle("oculto");
    });
  });

document.querySelectorAll("#termo-mapa-iframe").forEach((elementoMapa) => {
  let map;

  async function initMap() {
    const centro = { lat: 42.3498369, lng: -6.9703849 };
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    map = new Map(elementoMapa, {
      zoom: 10,
      center: centro,
      mapId: "ubicaciones",
    });
    for (const u of ubicacion) {
      const coordenadas = u.lugar_id.coordenadas.split(",");
      const posicion = {
        lat: parseFloat(coordenadas[0]),
        lng: parseFloat(coordenadas[1]),
      };
      const marker = new AdvancedMarkerElement({
        map: map,
        position: posicion,
        title: "Valdeorras",
      });
      const infoWindow = new google.maps.InfoWindow({
        content: `<div class='info-window'>
            <h2>${u.lugar_id.nome}</h2>
          </div>`,
      });
      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });
    }
  }
  initMap();
});
