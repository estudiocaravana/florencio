import { createDirectus, authentication, rest, readMe } from "@directus/sdk";

const directus = createDirectus("https://panel.florenciodelgadogurriaran.gal")
  .with(authentication())
  .with(rest());

let loginForm = document.getElementById("loginForm");
if (loginForm) {
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
      alert("Login successful");
    } catch (error) {
      alert("Login failed");
      console.log(error);
    }
  });
}
