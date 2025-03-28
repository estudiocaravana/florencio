/*
 * REPRODUCTOR DE AUDIO
 */
import "wave-audio-path-player";

/*
 * FAKE LOGIN
 */

let fakeLogins = document.querySelectorAll(".js-fakelogin");
if (fakeLogins) {
  let datos = localStorage.getItem("fake_login");
  if (datos) {
    datos = JSON.parse(datos);
  }

  fakeLogins.forEach((fakeLogin) => {
    if (datos) {
      fakeLogin.querySelector('.js-fakelogin-1 input[name="nome"]').value =
        datos.nome;
      fakeLogin.querySelector('.js-fakelogin-1 input[name="email"]').value =
        datos.email;
      fakeLogin.querySelector('.js-fakelogin-1 input[name="normas"]').checked =
        datos.normas;

      fakeLogin.querySelector(".js-fakelogin-1").classList.add("hidden");
      fakeLogin.querySelector(".js-fakelogin-2").classList.remove("hidden");
    }

    fakeLogin
      .querySelector(".js-fakelogin-1 button")
      .addEventListener("click", (event) => {
        event.preventDefault();

        localStorage.setItem(
          "fake_login",
          JSON.stringify({
            nome: fakeLogin.querySelector('.js-fakelogin-1 input[name="nome"]')
              .value,
            email: fakeLogin.querySelector(
              '.js-fakelogin-1 input[name="email"]'
            ).value,
            normas: fakeLogin.querySelector(
              '.js-fakelogin-1 input[name="normas"]'
            ).checked,
          })
        );

        fakeLogin.querySelector(".js-fakelogin-1").classList.add("hidden");
        fakeLogin.querySelector(".js-fakelogin-2").classList.remove("hidden");
      });
  });
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
