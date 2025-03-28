/*
 * REPRODUCTOR DE AUDIO
 */
import "wave-audio-path-player";

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
      let filtroTermo = termo.dataset[filtroAplicado].trim();

      let estaEnFiltro = false;
      let filtrosTermoSeparados = filtroTermo.split(", ");

      filtrosTermoSeparados.forEach((filtroTermoSeparado) => {
        if (filtroTermoSeparado == valorFiltro) {
          estaEnFiltro = true;
          return;
        }
      });

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
}

/*
 * CONEXIÓN CON DIRECTUS
 */
// import {
//   createDirectus,
//   authentication,
//   rest,
//   readMe,
//   updateMe,
//   createItem,
//   registerUser,
//   staticToken,
//   withToken,
// } from "@directus/sdk";

// let directus;
// let token = localStorage.getItem("directus_auth");
// let estaLogueado = false;

// if (token) {
//   console.log("Está logueado");
//   estaLogueado = true;
//   token = JSON.parse(token);
//   // TODO Comprobar si el token sigue siendo válido
//   directus = createDirectus("https://panel.florenciodelgadogurriaran.gal")
//     .with(staticToken(token.access_token))
//     .with(authentication())
//     .with(rest());
// } else {
//   directus = createDirectus("https://panel.florenciodelgadogurriaran.gal")
//     .with(authentication())
//     .with(rest());
// }

// if (!estaLogueado) {
//   let loginForm = document.getElementById("loginForm");
//   if (loginForm) {
//     loginForm.classList.remove("hidden");

//     loginForm.addEventListener("submit", async (event) => {
//       event.preventDefault();
//       let email = document.getElementById("email").value;
//       let password = document.getElementById("password").value;
//       try {
//         const response = await directus.login(email, password);
//         localStorage.setItem("directus_auth", JSON.stringify(response));
//         location.reload();

//         // const info = await directus.request(
//         //   readMe({
//         //     fields: ["*"],
//         //   })
//         // );
//         // console.log(info);

//         // const result = await directus.request(
//         //   createItem("aportacion", {
//         //     termo: 1,
//         //     definicion: "prueba",
//         //   })
//         // );
//         // console.log(result);

//         // alert("Login successful");
//       } catch (error) {
//         alert(error?.errors?.[0]?.message || "Erro na entrada do usuario");
//         // console.log(error);
//       }
//     });

//     let registerForm = document.getElementById("registerForm");
//     if (registerForm) {
//       registerForm.classList.remove("hidden");

//       registerForm.addEventListener("submit", async (event) => {
//         event.preventDefault();
//         let email = document.getElementById("registerEmail").value;
//         let password = document.getElementById("registerPassword").value;
//         let name = document.getElementById("registerName").value;
//         let relacion_valdeorras = document.getElementById(
//           "registerRelacionValdeorras"
//         ).value;
//         try {
//           const resultRegister = await directus.request(
//             registerUser(email, password, {
//               first_name: name,
//             })
//           );

//           if (!resultRegister) {
//             throw new Error("Xa existe un usuario con ese email.");
//           }

//           // console.log("Resultado de registro");
//           // console.log(resultRegister);

//           // Para que esto funcione, hay que desactivar la verificación de email en el panel de Directus
//           const response = await directus.login(email, password);
//           localStorage.setItem("directus_auth", JSON.stringify(response));
//           // console.log(response);

//           const resultUpdate = await directus.request(
//             updateMe({
//               relacion_valdeorras: relacion_valdeorras,
//             })
//           );
//           // console.log(resultUpdate);

//           location.reload();

//           // alert("Register successful");
//         } catch (error) {
//           alert(error?.errors?.[0]?.message || error);
//         }
//       });
//     }
//   }
// } else {
//   const tokenCaduca = new Date(token.expires_at);
//   const agora = new Date();

//   console.log(agora);
//   console.log(tokenCaduca);

//   // TODO Refrescar el token automáticamente, pero para eso tengo que enviar el refresh_token y no sé de dónde pillarlo
//   // if (tokenCaduca < agora) {
//   //   console.log("El token caducó");
//   //   try {
//   //     const response = await directus.refresh();
//   //     localStorage.setItem("directus_auth", JSON.stringify(response));
//   //     token = response;
//   //   } catch (error) {
//   //     // localStorage.removeItem("directus_auth");
//   //     // location.reload();
//   //     alert(error?.errors?.[0]?.message || error);
//   //   }
//   // }

//   let logoutForm = document.getElementById("logoutForm");
//   if (logoutForm) {
//     logoutForm.classList.remove("hidden");
//     logoutForm.addEventListener("submit", async (event) => {
//       event.preventDefault();
//       try {
//         const result = await directus.logout();
//       } catch (error) {
//         // TODO Por alguna razón no se puede hacer logout
//         console.log(error);
//       }
//       localStorage.removeItem("directus_auth");
//       location.reload();
//     });
//   }

//   let novoTermoForm = document.getElementById("novoTermoForm");
//   if (novoTermoForm) {
//     novoTermoForm.classList.remove("hidden");

//     novoTermoForm.addEventListener("submit", async (event) => {
//       event.preventDefault();
//       let termo = document.getElementById("termo").value;
//       let definicion = document.getElementById("definicion").value;
//       try {
//         const result = await directus.request(
//           withToken(token.access_token, () => ({
//             path: "/flows/trigger/0525f10d-382c-4b00-9ffe-08fe5171e9fc",
//             method: "POST",
//             body: JSON.stringify({
//               termo: termo,
//               definicion: definicion,
//             }),
//           }))
//         );
//         novoTermoForm.classList.add("hidden");
//         // console.log(result);
//         // alert("Termo engadido correctamente");
//       } catch (error) {
//         alert(error?.errors?.[0]?.message || error);
//       }
//     });
//   }
// }
