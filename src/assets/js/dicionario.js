import { createDirectus, authentication } from "@directus/sdk";

const directus = createDirectus(
  "https://panel.florenciodelgadogurriaran.gal"
).with(authentication("cookie", { credentials: "include" }));

let loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    try {
      await directus.login(email, password);
      alert("Login successful");
    } catch (error) {
      alert("Login failed");
      console.log(error);
    }
  });
}
