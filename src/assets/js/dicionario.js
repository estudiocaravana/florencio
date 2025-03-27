import {
  createDirectus,
  authentication,
  rest,
  readMe,
  createItem,
  withToken,
  staticToken,
} from "@directus/sdk";

let directus;
let token = localStorage.getItem("directus_auth");
let estaLogueado = false;

if (token) {
  estaLogueado = true;
  token = JSON.parse(token);
  directus = createDirectus("https://panel.florenciodelgadogurriaran.gal")
    .with(staticToken(token.access_token))
    .with(rest());
} else {
  directus = createDirectus("https://panel.florenciodelgadogurriaran.gal")
    .with(authentication())
    .with(rest());
}

let loginForm = document.getElementById("loginForm");
if (loginForm) {
  if (estaLogueado) {
    loginForm.style.display = "none";
  } else {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      let email = document.getElementById("email").value;
      let password = document.getElementById("password").value;
      try {
        const response = await directus.login(email, password);
        localStorage.setItem("directus_auth", JSON.stringify(response));

        const info = await directus.request(
          readMe({
            fields: ["*"],
          })
        );
        console.log(info);

        const result = await directus.request(
          createItem("aportacion", {
            termo: 1,
            definicion: "prueba",
          })
        );
        console.log(result);

        alert("Login successful");
      } catch (error) {
        alert("Login failed");
        console.log(error);
      }
    });
  }
}
