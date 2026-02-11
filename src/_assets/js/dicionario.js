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

function quitarTildes(texto) {
  // Hacemos la sustitución manual para mantener la ñ
  return texto
    .replace(/á/g, "a")
    .replace(/é/g, "e")
    .replace(/í/g, "i")
    .replace(/ó/g, "o")
    .replace(/ú/g, "u");
}

function filtrar(lista, termos) {
  let elementosPorPagina = 36;

  let pesosTermos = [];

  console.log(filtrosAplicados);

  // Primero, aplicamos los filtros a los termos
  for (let i = 0; i < termos.length; i++) {
    const termo = termos[i];

    pesosTermos[i] = 1;

    for (let filtroAplicado in filtrosAplicados) {
      let valorFiltro = filtrosAplicados[filtroAplicado];
      valorFiltro = quitarTildes(valorFiltro.toLowerCase());

      if (filtroAplicado == "buscar") {
        let termoTexto = quitarTildes(
          termo.querySelector("#termo-nome").innerText.trim().toLowerCase(),
        );

        // Colocamos antes los termos que empiecen por el texto buscado
        if (termoTexto.indexOf(valorFiltro) == 0) {
          pesosTermos[i] = 2;
          // Luego los que lo contengan en cualquier parte
        } else if (termoTexto.indexOf(valorFiltro) > 0) {
          pesosTermos[i] = 1;
        } else {
          pesosTermos[i] = 0;
        }
      } else {
        let filtroTermo = termo.dataset[filtroAplicado].trim();
        let estaEnFiltro = false;

        let filtrosTermoSeparados = filtroTermo.split(", ");

        filtrosTermoSeparados.forEach((filtroTermoSeparado) => {
          const filtroTermoAdaptado = quitarTildes(
            filtroTermoSeparado.toLowerCase(),
          );
          if (filtroTermoAdaptado == valorFiltro) {
            estaEnFiltro = true;
            return;
          }
        });

        if (!estaEnFiltro) {
          pesosTermos[i] = 0;
        }
      }

      if (pesosTermos[i] == 0) {
        break;
      }
    }
  }

  // Después, ordenamos los termos por peso y alfabéticamente
  let termosFiltrados = termos
    .map((termo, i) => ({
      termo,
      peso: pesosTermos[i],
    }))
    // Eliminamos los que tengan peso 0
    .filter(({ peso }) => peso > 0)
    .sort(
      (a, b) =>
        b.peso - a.peso || a.termo.innerText.localeCompare(b.termo.innerText),
    )
    .map(({ termo }) => termo);

  // Por último, aplicamos la paginación a los termos filtrados
  totalPaginas = Math.ceil(termosFiltrados.length / elementosPorPagina);
  const minPagina = paginaActual * elementosPorPagina;
  const maxPagina = (paginaActual + 1) * elementosPorPagina;
  const termosPaginados = termosFiltrados.slice(minPagina, maxPagina);

  lista.innerHTML = "";
  termosPaginados.forEach((termo) => {
    lista.appendChild(termo);
  });

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
      "#filtro-categorias a[data-id='" + filtrosAplicados["categorias"] + "']",
    );
    if (categoria) {
      textosResumen.push(categoria.innerText);
    }
  }
  if (filtrosAplicados["estados"]) {
    const estado = document.querySelector(
      "#filtro-estados a[data-id='" + filtrosAplicados["estados"] + "']",
    );
    if (estado) {
      textosResumen.push(estado.innerText);
    }
  }
  if (filtrosAplicados["buscar"]) {
    textosResumen.push('que conteñen "' + filtrosAplicados["buscar"] + '"');
  }
  if (filtrosAplicados["campos"]) {
    const campo = document.querySelector(
      "#filtro-campos a[data-id='" + filtrosAplicados["campos"] + "']",
    );
    if (campo) {
      textosResumen.push('no campo de "' + campo.innerText + '"');
    }
  }
  if (filtrosAplicados["concellos"]) {
    textosResumen.push("en " + filtrosAplicados["concellos"]);
  }

  let textoResumen = "";
  if (textosResumen.length > 0 || filtrosAplicados["tipo"]) {
    if (filtrosAplicados["tipo"] == "termo") {
      textoResumen += "Termos ";
    } else {
      if (filtrosAplicados["tipo"] == "refran") {
        textoResumen += "Refráns ";
      } else {
        textoResumen += "Entradas ";
      }
    }
    textoResumen += textosResumen.join(", ");
  } else {
    textoResumen = "Todos";
  }
  resumen.innerHTML = textoResumen;
}

function crearFiltro(lista, termos, nombreFiltro) {
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
      filtrar(lista, termos);
    });
  });
}

document.querySelectorAll("#termos-lista").forEach((lista) => {
  // Clonamos los termos para tener una copia que no se altere
  const termos = Array.from(lista.children).map((termo) =>
    termo.cloneNode(true),
  );

  crearFiltro(lista, termos, "categorias");
  crearFiltro(lista, termos, "campos");
  crearFiltro(lista, termos, "concellos");
  crearFiltro(lista, termos, "estados");

  const botonesTipo = document.querySelectorAll("#filtro-tipo button");
  botonesTipo.forEach((boton) => {
    boton.addEventListener("click", (event) => {
      event.preventDefault();

      botonesTipo.forEach((boton) => {
        boton.classList.remove("boton-activo");
      });
      boton.classList.add("boton-activo");

      const tipoFiltrado = boton.id;

      if (tipoFiltrado == "todos") {
        delete filtrosAplicados["tipo"];
      } else {
        filtrosAplicados["tipo"] = tipoFiltrado;
      }
      paginaActual = 0;
      filtrar(lista, termos);
    });
  });

  // Comprobamos si la URL contiene el parámetro "buscar" para no activar el filtro de tipo
  const urlParams = new URLSearchParams(window.location.search);
  const buscarParam = urlParams.get("buscar");
  if (!buscarParam) {
    // Comprobamos si la URL contiene la palabra "termos" o "refrans" para aplicar el filtro correspondiente
    const url = window.location.href;
    if (url.indexOf("termos") > -1) {
      document.querySelector("#filtro-tipo button#termo").click();
    } else if (url.indexOf("refrans") > -1) {
      document.querySelector("#filtro-tipo button#refran").click();
    }
  }

  let buscador = document.querySelector("#fitro-buscador");

  buscador.addEventListener("keyup", function (event) {
    let textoBuscado = buscador.value.trim();
    // console.log(textoBuscado);
    filtrosAplicados["buscar"] = textoBuscado;
    paginaActual = 0;
    filtrar(lista, termos);
  });

  const paginador = document.querySelector("#filtro-paginador");
  paginador
    .querySelector("#filtro-paginador-anterior")
    .addEventListener("click", (event) => {
      event.preventDefault();
      if (paginaActual > 0) {
        paginaActual--;
        filtrar(lista, termos);
      }
    });
  paginador
    .querySelector("#filtro-paginador-siguiente")
    .addEventListener("click", (event) => {
      event.preventDefault();
      if (paginaActual < totalPaginas - 1) {
        paginaActual++;
        filtrar(lista, termos);
      }
    });

  filtrar(lista, termos);
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

document.querySelectorAll("#novo-termo-tipo").forEach((tipo) => {
  // Obtenemos el parámetro "tipo" de la URL
  const urlParams = new URLSearchParams(window.location.search);
  const tipoParam = urlParams.get("tipo");
  if (tipoParam) {
    tipo.value = tipoParam;
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

function crearFileInput(bloque, id, accept) {
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = accept;
  fileInput.id = id;
  fileInput.classList.add("oculto");
  bloque.parentNode.insertBefore(fileInput, bloque.nextSibling);

  const textoInicial = bloque.innerText;

  let tieneFichero = false;

  bloque.addEventListener("click", (event) => {
    event.preventDefault();

    if (!tieneFichero) {
      fileInput.click();
    } else {
      fileInput.value = "";
      fileInput.dispatchEvent(new Event("change"));
      tieneFichero = false;
    }
  });

  fileInput.addEventListener("change", (event) => {
    let file = event.target.files[0];
    if (file) {
      let nombreRecortado =
        file.name.length > 20 ? file.name.slice(0, 20) + "..." : file.name;
      nombreRecortado +=
        ' <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="boton-cerrar"><path stroke-linecap="round" stroke-linejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>';
      bloque.innerHTML = nombreRecortado;
      tieneFichero = true;
    } else {
      bloque.innerHTML = textoInicial;
    }
  });
}

document.querySelectorAll("#novo-termo-foto-subir").forEach((bloque) => {
  crearFileInput(bloque, "novo-termo-foto", "image/*");
});

document.querySelectorAll("#novo-termo-audio-subir").forEach((bloque) => {
  crearFileInput(bloque, "novo-termo-audio", "audio/*");
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
  document.querySelectorAll("#usuario-accions").forEach((elemento) => {
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
        "registerRelacionValdeorras",
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
  document.querySelectorAll("#usuario-accions").forEach((elemento) => {
    elemento.classList.remove("oculto");
  });

  document.querySelectorAll("#colabora-rexistro").forEach((elemento) => {
    elemento.classList.add("oculto");
  });
  document.querySelectorAll("#colabora-novo-termo").forEach((elemento) => {
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
      "#novo-termo-audio-sexo",
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

function adaptaFormularioATipo(nombreTipo, tipo) {
  if (tipo == "refran") {
    document
      .querySelectorAll("#novo-termo-categoria-bloque")
      .forEach((categoria) => {
        categoria.classList.add("oculto");
      });
  } else {
    document
      .querySelectorAll("#novo-termo-categoria-bloque")
      .forEach((categoria) => {
        categoria.classList.remove("oculto");
      });
  }

  document.querySelectorAll("#novo-termo-termo-label").forEach((label) => {
    label.innerText = nombreTipo + "*";
  });
}

document.querySelectorAll("#novo-termo-tipo").forEach((el) => {
  el.addEventListener("change", (event) => {
    adaptaFormularioATipo(el.options[el.selectedIndex].text, el.value);
  });

  adaptaFormularioATipo(el.options[el.selectedIndex].text, el.value);
});

function alternaCargando(boton) {
  const spinners = document.querySelectorAll("#cargando");

  boton.classList.toggle("oculto");
  spinners.forEach((spinner) => {
    spinner.classList.toggle("oculto");
  });
}

document.querySelectorAll("#novo-termo-enviar").forEach((boton) => {
  boton.addEventListener("click", async (event) => {
    event.preventDefault();

    let datos = {
      termo: document.getElementById("novo-termo-termo").value,
      tipo: document.getElementById("novo-termo-tipo").value,
      definicion: document.getElementById("novo-termo-definicion").value,
      exemplos: document.getElementById("novo-termo-exemplo").value,

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
        "novo-termo-informante-data_nacemento",
      ).value,
      informante_nacemento: document.getElementById(
        "novo-termo-informante-nacemento",
      ).value,
      informante_residencia: document.getElementById(
        "novo-termo-informante-residencia",
      ).value,

      audio: document.getElementById("novo-termo-audio").files[0],
      audio_nome: document.getElementById("novo-termo-audio-nome").value,
      audio_sexo: document.getElementById("novo-termo-audio-sexo").value,
      audio_data_nacemento: document.getElementById(
        "novo-termo-audio-data_nacemento",
      ).value,
      audio_nacemento: document.getElementById("novo-termo-audio-nacemento")
        .value,
      audio_residencia: document.getElementById("novo-termo-audio-residencia")
        .value,
      audio_onde: document.getElementById("novo-termo-audio-onde").value,
      audio_termos: document.getElementById("novo-termo-audio-termos").value,
    };

    alternaCargando(boton);
    let ok = await backend.nuevaAportacion(datos);
    console.log("Resultado novo termo:", ok);
    if (ok) {
      // Reseteamos el formulario
      document.querySelectorAll("input, textarea").forEach((input) => {
        input.value = "";
        input.dispatchEvent(new Event("change"));
      });
      document.querySelectorAll("select").forEach((select) => {
        if (select.id == "novo-termo-tipo") {
          return;
        }
        select.selectedIndex = 0;
        if (select.tomselect) {
          select.tomselect.clear();
        }
      });
    }
    alternaCargando(boton);
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

    alternaCargando(elemento);
    let ok = await backend.nuevoComentario(datos);
    if (ok) {
      // Reseteamos el input
      comentario.value = "";
    }
    alternaCargando(elemento);
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
      "rexistro-persoa-repassword",
    ).value;
    let relacion_valdeorras = document.getElementById(
      "rexistro-persoa-relacion",
    ).value;
    let privacidade = document.getElementById(
      "rexistro-persoa-privacidade",
    ).checked;

    alternaCargando(botonRexistroPersoa);
    await backend.registrarUsuario({
      email: email,
      password: password,
      repassword: repassword,
      nombre: nome,
      relacion_valdeorras: relacion_valdeorras,
      institucion: 0,
      privacidade: privacidade,
    });
    alternaCargando(botonRexistroPersoa);
  });
}

let botonRexistroColectivo = document.getElementById(
  "rexistro-colectivo-enviar",
);
if (botonRexistroColectivo) {
  botonRexistroColectivo.addEventListener("click", async (event) => {
    event.preventDefault();

    let nome = document.getElementById("rexistro-colectivo-nome").value;
    let email = document.getElementById("rexistro-colectivo-email").value;
    let password = document.getElementById("rexistro-colectivo-password").value;
    let repassword = document.getElementById(
      "rexistro-colectivo-repassword",
    ).value;
    let relacion_valdeorras = document.getElementById(
      "rexistro-colectivo-relacion",
    ).value;
    let persoa_contacto = document.getElementById(
      "rexistro-colectivo-contacto",
    ).value;
    let privacidade = document.getElementById(
      "rexistro-colectivo-privacidade",
    ).checked;

    alternaCargando(botonRexistroColectivo);
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
    alternaCargando(botonRexistroColectivo);
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

document.querySelectorAll("#ir-login").forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();

    // Llevamos al usuario arriba de la página
    window.scrollTo(0, 0);

    // Hacemos click en el trigger del login para abrir el popover
    document.querySelectorAll("#login-trigger").forEach((loginTrigger) => {
      loginTrigger.click();
    });
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
  const contenido = document.querySelector("#termos-filtro-contenido");
  let contenidoVisible = false;

  document.addEventListener("click", (event) => {
    if (contenidoVisible) {
      const target = event.target;

      // Comprobamos si el click fue fuera del contenido
      // y, si es así, lo ocultamos
      if (
        !target.closest("#termos-filtro-contenido") &&
        !target.closest("#termos-filtro-trigger")
      ) {
        contenidoVisible = false;
        contenido.classList.add("oculto");
      }
    }
  });

  trigger.addEventListener("click", (event) => {
    event.preventDefault();

    contenidoVisible = !contenidoVisible;
    contenido.classList.toggle("oculto");
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

document.getElementById("ir-arriba").addEventListener("click", (event) => {
  event.preventDefault();

  window.scrollTo(0, 0);
});

document.querySelectorAll("#termo-localizacion-punto").forEach((punto) => {
  const esquinaSuperiorIzquierda = [42.515756, -7.196293];
  const esquinaInferiorDerecha = [42.179298, -6.736241];

  for (const u of ubicacion) {
    const copiaDePunto = punto.cloneNode(true);

    const coordenadas = u.lugar_id.coordenadas.split(",");
    // Le damos al punto la posición de la ubicación relativa a las coordenadas de las esquinas del mapa
    const latitud = parseFloat(coordenadas[0]);
    const longitud = parseFloat(coordenadas[1]);

    const top =
      ((esquinaSuperiorIzquierda[0] - latitud) /
        (esquinaSuperiorIzquierda[0] - esquinaInferiorDerecha[0])) *
      100;
    const left =
      ((longitud - esquinaSuperiorIzquierda[1]) /
        (esquinaInferiorDerecha[1] - esquinaSuperiorIzquierda[1])) *
      100;

    copiaDePunto.style.top = top + "%";
    copiaDePunto.style.left = left + "%";

    // Le añadimos un title con el nombre de la ubicación para que se muestre al pasar el ratón por encima
    copiaDePunto.title = u.lugar_id.nome;

    // Añadimos la copia del punto al mapa
    punto.parentNode.appendChild(copiaDePunto);
  }

  // Eliminamos el punto original, que no se corresponde con ninguna ubicación
  punto.remove();
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
      mapTypeId: google.maps.MapTypeId.HYBRID,
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
