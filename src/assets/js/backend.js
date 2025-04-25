import {
  createDirectus,
  authentication,
  rest,
  readMe,
  updateMe,
  createItem,
  registerUser,
  staticToken,
  withToken,
  uploadFiles,
} from "@directus/sdk";

let TOKEN_NOMBRE = "directus_auth";

const muestraError = (mensaje) => {
  alert(mensaje);
};

const muestraExito = (mensaje) => {
  console.log(mensaje);
};

export function Backend() {
  this.token = null;
  this.estaLogueado = false;

  let localStorageToken = localStorage.getItem(TOKEN_NOMBRE);

  if (localStorageToken) {
    console.log("Está logueado");
    this.estaLogueado = true;
    this.token = JSON.parse(localStorageToken);
    this.directus = createDirectus(
      "https://panel.florenciodelgadogurriaran.gal"
    )
      .with(staticToken(this.token.access_token))
      .with(authentication("cookie", { credentials: "include" }))
      .with(rest({ credentials: "include" }));
  } else {
    this.directus = createDirectus(
      "https://panel.florenciodelgadogurriaran.gal"
    )
      .with(authentication("cookie", { credentials: "include" }))
      .with(rest({ credentials: "include" }));
  }

  this.init = async () => {
    if (this.estaLogueado) {
      const tokenCaduca = new Date(this.token.expires_at);
      const agora = new Date();

      console.log(agora);
      console.log(tokenCaduca);

      if (tokenCaduca < agora) {
        console.log("El token caducó");
        try {
          const response = await this.directus.refresh();
          localStorage.setItem(TOKEN_NOMBRE, JSON.stringify(response));
          this.token = response;
          console.log("Token renovado");
        } catch (error) {
          localStorage.removeItem(TOKEN_NOMBRE);
          //location.reload();
          muestraError("O token caducou. Por favor, volve iniciar sesión.");
          // alert(error?.errors?.[0]?.message || error);
        }
      }

      // TODO Por alguna razón, tengo que forzar a que incluya el token
      // a pesar de que ya lo haya incluido al crear el cliente
      let userInfo = await this.directus.request(
        withToken(
          this.token.access_token,
          readMe({
            fields: ["*"],
          })
        )
      );
      console.log(userInfo);
    }
  };

  this.login = async (email, password) => {
    if (this.estaLogueado) {
      muestraError("Xa estás logueado");
      return;
    }

    if (!email || !password) {
      muestraError("Por favor, introduce o teu email e contrasinal");
      return;
    }

    try {
      const response = await this.directus.login(email, password);
      localStorage.setItem(TOKEN_NOMBRE, JSON.stringify(response));
      location.reload();
    } catch (error) {
      muestraError(error?.errors?.[0]?.message || "Erro na entrada do usuario");
    }
  };

  this.registrarUsuario = async (datos) => {
    // TODO Validar los datos
    try {
      // Comprobamos si el email ya existe
      const resultCheck = await this.directus.request(() => ({
        path:
          "/flows/trigger/c84488dd-46a4-4b7b-b7b9-1eb001c9edb1?email=" +
          datos.email,
        method: "GET",
      }));

      if (resultCheck.resultado !== false) {
        throw new Error("Xa existe un usuario con ese email.");
      }

      const resultRegister = await this.directus.request(
        registerUser(datos.email, datos.password, {
          first_name: datos.nombre,
        })
      );

      // console.log("Resultado de registro");
      // console.log(resultRegister);

      // Para que esto funcione, hay que desactivar la verificación de email en el panel de Directus
      const response = await this.directus.login(datos.email, datos.password);
      localStorage.setItem(TOKEN_NOMBRE, JSON.stringify(response));
      // console.log(response);

      const resultUpdate = await this.directus.request(
        updateMe({
          relacion_valdeorras: datos.relacion_valdeorras,
        })
      );
      // console.log(resultUpdate);

      location.reload();
      // alert("Register successful");
    } catch (error) {
      muestraError(error?.errors?.[0]?.message || error);
    }
  };

  this.logout = async () => {
    try {
      console.log("Intentando logout");
      const result = await this.directus.logout();
      console.log("Logout hecho");
    } catch (error) {
      muestraError(error?.errors?.[0]?.message || "Non puidemos pechar sesión");
    }
    localStorage.removeItem(TOKEN_NOMBRE);
    location.reload();
  };

  this.nuevaAportacion = async (datos) => {
    // TODO Validar los datos

    let foto_id = null;

    if (datos.foto) {
      // Primero subimos la foto al servidor
      try {
        const formData = new FormData();
        formData.append("file", datos.foto);

        const result = await this.directus.request(
          withToken(this.token.access_token, uploadFiles(formData))
        );

        console.log(result);

        foto_id = result.id;
      } catch (error) {
        muestraError(error?.errors?.[0]?.message || error);
      }
    }

    datos.foto = foto_id;

    try {
      const result = await this.directus.request(
        withToken(this.token.access_token, () => ({
          path: "/flows/trigger/0525f10d-382c-4b00-9ffe-08fe5171e9fc",
          method: "POST",
          body: JSON.stringify(datos),
        }))
      );
      novoTermoForm.classList.add("hidden");
      console.log(result);

      muestraExito("Termo engadido correctamente");
    } catch (error) {
      muestraError(error?.errors?.[0]?.message || error);
    }
  };
}
