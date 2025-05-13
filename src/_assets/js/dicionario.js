/*
 * REPRODUCTOR DE AUDIO
 */
import "wave-audio-path-player";

/*
 * SELECTOR AVANZADO
 */

import TomSelect from "tom-select";

document.querySelectorAll(".tomselect").forEach((el) => {
  new TomSelect(el, {
    maxOptions: null,
    sortField: {
      field: "text",
      direction: "asc",
    },
  });
});

/*
 * FAKE LOGIN
 */

let datosFakeLogin = localStorage.getItem("fake_login");
if (datosFakeLogin) {
  datosFakeLogin = JSON.parse(datosFakeLogin);
}

// Obtenemos el hash exito
let hayExito = window.location.hash == "#exito";

function anteriorPaginaFakeLogin(fakeLogin) {
  fakeLogin.querySelector(".js-fakelogin-1").classList.remove("hidden");
  fakeLogin.querySelector(".js-fakelogin-2").classList.add("hidden");
}

function siguientePaginaFakeLogin(fakeLogin) {
  fakeLogin.querySelector(".js-fakelogin-1").classList.add("hidden");
  fakeLogin.querySelector(".js-fakelogin-2").classList.remove("hidden");

  if (datosFakeLogin) {
    fakeLogin.querySelectorAll(".js-fakelogin-nome").forEach((element) => {
      element.innerText = datosFakeLogin.nome;
    });
  }
}

function errorFakeLogin(fakeLogin, mensaje) {
  fakeLogin.querySelectorAll(".js-fakelogin-error").forEach((element) => {
    if (mensaje) {
      element.innerText = mensaje;
      element.classList.remove("hidden");
    } else {
      element.classList.add("hidden");
    }
  });
}

let fakeLogins = document.querySelectorAll(".js-fakelogin");
if (fakeLogins) {
  fakeLogins.forEach((fakeLogin) => {
    if (datosFakeLogin) {
      fakeLogin.querySelector('.js-fakelogin-1 input[name="nome"]').value =
        datosFakeLogin.nome;
      fakeLogin.querySelector('.js-fakelogin-1 input[name="email"]').value =
        datosFakeLogin.email;
      fakeLogin.querySelector('.js-fakelogin-1 input[name="normas"]').checked =
        datosFakeLogin.normas;

      siguientePaginaFakeLogin(fakeLogin);
    }

    fakeLogin
      .querySelector(".js-fakelogin-1 button")
      .addEventListener("click", (event) => {
        event.preventDefault();

        let nuevosDatos = {
          nome: fakeLogin
            .querySelector('.js-fakelogin-1 input[name="nome"]')
            .value.trim(),
          email: fakeLogin
            .querySelector('.js-fakelogin-1 input[name="email"]')
            .value.trim(),
          normas: fakeLogin.querySelector(
            '.js-fakelogin-1 input[name="normas"]'
          ).checked,
        };

        let mensajeError = "";

        if (!nuevosDatos.nome.length) {
          mensajeError = "Debes introducir un nome";
        } else if (!nuevosDatos.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
          mensajeError = "Debes introducir un email válido";
        } else if (!nuevosDatos.normas) {
          mensajeError = "Debes aceptar a política de privacidade";
        }

        errorFakeLogin(fakeLogin, mensajeError);

        if (!mensajeError) {
          localStorage.setItem("fake_login", JSON.stringify(nuevosDatos));
          datosFakeLogin = nuevosDatos;

          siguientePaginaFakeLogin(fakeLogin);
        }
      });

    fakeLogin.querySelectorAll(".js-fakelogin-reset").forEach((element) =>
      element.addEventListener("click", (event) => {
        event.preventDefault();

        anteriorPaginaFakeLogin(fakeLogin);
      })
    );

    fakeLogin.addEventListener("submit", (event) => {
      event.preventDefault();
      let hayErrores = false;

      fakeLogin
        .querySelectorAll(
          ".js-fakelogin-2 input, .js-fakelogin-2 textarea, .js-fakelogin-2 select"
        )
        .forEach((element) => {
          if (!element.value.trim().length) {
            errorFakeLogin(fakeLogin, "Tes que cubrir todos os campos");

            hayErrores = true;
            return;
          }
        });

      let action = fakeLogin.dataset.action;
      localStorage.setItem("exito_redirect", action);

      if (!hayErrores) {
        // Relanzamos el formulario
        fakeLogin.submit();
      }
    });

    if (hayExito) {
      fakeLogin.querySelector(".js-fakelogin-1").classList.add("hidden");
      fakeLogin.querySelector(".js-fakelogin-2").classList.add("hidden");
      fakeLogin.querySelector(".js-fakelogin-ok").classList.remove("hidden");

      // Scrollamos hasta el formulario
      fakeLogin.scrollIntoView();
    }
  });
}

/*
 * BÚSQUEDA
 */

let filtrosAplicados = {};

function filtrar(termos) {
  termos.forEach((termo) => {
    termo.classList.remove("hidden");

    for (let filtroAplicado in filtrosAplicados) {
      let valorFiltro = filtrosAplicados[filtroAplicado];
      let estaEnFiltro = false;

      if (filtroAplicado == "buscar") {
        let termoTexto = termo.innerText.trim().toLowerCase();

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
        termo.classList.add("hidden");
        break;
      }
    }
  });
}

function crearFiltro(termos, nombreFiltro) {
  let enlaces = filtro.querySelectorAll(".js-filtro-" + nombreFiltro + " a");

  enlaces.forEach((enlace) => {
    enlace.addEventListener("click", (event) => {
      event.preventDefault();

      let filtroEnlace = enlace.innerText.trim();

      enlaces.forEach((enlace) => {
        enlace.classList.remove("text-verde");
      });
      enlace.classList.add("text-verde");

      if (filtroEnlace != "Todos" && filtroEnlace != "Todas") {
        filtrosAplicados[nombreFiltro] = filtroEnlace;
      } else {
        delete filtrosAplicados[nombreFiltro];
      }

      filtrar(termos);
    });
  });
}

let filtro = document.querySelector(".js-filtro");
if (filtro) {
  let termos = document.querySelectorAll(".js-termo");

  crearFiltro(termos, "categoria");
  crearFiltro(termos, "campo");
  crearFiltro(termos, "lugar");

  let buscador = document.querySelector(".js-filtro-buscar");

  buscador.addEventListener("keyup", function (event) {
    let textoBuscado = buscador.value.trim().toLowerCase();
    console.log(textoBuscado);
    filtrosAplicados["buscar"] = textoBuscado;
    filtrar(termos);
  });
}

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
  let loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.classList.remove("hidden");

    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      let email = document.getElementById("email").value;
      let password = document.getElementById("password").value;

      await backend.login(email, password, true);
    });
  }

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
  let logoutForm = document.getElementById("logoutForm");
  if (logoutForm) {
    logoutForm.classList.remove("hidden");
    logoutForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      await backend.logout();
    });
  }

  let novoTermoForm = document.getElementById("novoTermoForm");
  if (novoTermoForm) {
    novoTermoForm.classList.remove("hidden");

    novoTermoForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      let datos = {
        termo: document.getElementById("termo").value,
        definicion: document.getElementById("definicion").value,

        ubicacion: obtenValoresSelect("selectLocalizacion"),
        campos_semanticos: obtenValoresSelect("selectCampo"),
        categorias: obtenValoresSelect("selectCategoria"),

        foto: document.getElementById("foto").files[0],
      };

      await backend.nuevaAportacion(datos);
    });
  }
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

document.querySelectorAll("#termos-filtro-trigger").forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();

    document
      .querySelector("#termos-filtro-contenido")
      .classList.toggle("oculto");
  });
});

document.querySelectorAll("#termos-lista").forEach((lista) => {
  let elementos = lista.children;
  let elementosPorPagina = 9;

  let totalPaginas = Math.ceil(elementos.length / elementosPorPagina);

  // let pagina = 1;
  // let paginacion = lista.querySelector(".paginacion");
  // let paginacionHTML = "";
  // for (let i = 1; i <= totalPaginas; i++) {
  //   paginacionHTML += `<button class="pagina" data-pagina="${i}">${i}</button>`;
  // }
  // paginacion.innerHTML = paginacionHTML;

  // paginacion.querySelectorAll(".pagina").forEach((paginaBtn) => {
  //   paginaBtn.addEventListener("click", (event) => {
  //     event.preventDefault();
  //     let paginaSeleccionada = parseInt(paginaBtn.dataset.pagina);
  //     if (paginaSeleccionada != pagina) {
  //       pagina = paginaSeleccionada;
  //       elementos.forEach((elemento, index) => {
  //         elemento.classList.add("oculto");
  //         if (
  //           index >= (pagina - 1) * elementosPorPagina &&
  //           index < pagina * elementosPorPagina
  //         ) {
  //           elemento.classList.remove("oculto");
  //         }
  //       });
  //     }
  //   });
  // });

  let index = 0;
  for (const elemento of elementos) {
    if (index >= elementosPorPagina) {
      elemento.classList.add("oculto");
    }
    index++;
  }
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
