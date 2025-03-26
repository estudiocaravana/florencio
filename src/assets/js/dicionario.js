import { createDirectus, authentication } from "@directus/sdk";

const directus = createDirectus(
  "https://panel.florenciodelgadogurriaran.gal"
).with(authentication());

let loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    try {
      const response = await directus.login(email, password);
      if (response.access_token) {
        cookies.set("directus_session_token", response.access_token, {
          sameSite: "strict",
          path: "/",
          secure: true,
        });
      }
      alert("Login successful");
    } catch (error) {
      alert("Login failed");
      console.log(error);
    }
  });
}
