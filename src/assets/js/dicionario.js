import {
  createDirectus,
  authentication,
  rest,
  readMe,
  updateMe,
  createItem,
  registerUser,
  staticToken,
} from "@directus/sdk";

let directus;
let token = localStorage.getItem("directus_auth");
let estaLogueado = false;

if (token) {
  estaLogueado = true;
  token = JSON.parse(token);
  // TODO Comprobar si el token sigue siendo válido
  directus = createDirectus("https://panel.florenciodelgadogurriaran.gal")
    .with(staticToken(token.access_token))
    .with(authentication())
    .with(rest());
} else {
  directus = createDirectus("https://panel.florenciodelgadogurriaran.gal")
    .with(authentication())
    .with(rest());
}

if (!estaLogueado) {
  let loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.classList.remove("hidden");

    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      let email = document.getElementById("email").value;
      let password = document.getElementById("password").value;
      try {
        const response = await directus.login(email, password);
        localStorage.setItem("directus_auth", JSON.stringify(response));
        location.reload();

        // const info = await directus.request(
        //   readMe({
        //     fields: ["*"],
        //   })
        // );
        // console.log(info);

        // const result = await directus.request(
        //   createItem("aportacion", {
        //     termo: 1,
        //     definicion: "prueba",
        //   })
        // );
        // console.log(result);

        // alert("Login successful");
      } catch (error) {
        alert(error?.errors?.[0]?.message || "Erro na entrada do usuario");
        // console.log(error);
      }
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
        try {
          const resultRegister = await directus.request(
            registerUser(email, password, {
              first_name: name,
            })
          );

          if (!resultRegister) {
            throw new Error("Xa existe un usuario con ese email.");
          }

          // console.log("Resultado de registro");
          // console.log(resultRegister);

          // Para que esto funcione, hay que desactivar la verificación de email en el panel de Directus
          const response = await directus.login(email, password);
          localStorage.setItem("directus_auth", JSON.stringify(response));
          // console.log(response);

          const resultUpdate = await directus.request(
            updateMe({
              relacion_valdeorras: relacion_valdeorras,
            })
          );
          // console.log(resultUpdate);

          location.reload();

          // alert("Register successful");
        } catch (error) {
          alert(error?.errors?.[0]?.message || error);
        }
      });
    }
  }
} else {
  let logoutForm = document.getElementById("logoutForm");
  if (logoutForm) {
    logoutForm.classList.remove("hidden");
    logoutForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      try {
        const result = await directus.logout();
      } catch (error) {
        // TODO Por alguna razón no se puede hacer logout
        console.log(error);
      }
      localStorage.removeItem("directus_auth");
      location.reload();
    });
  }
}
