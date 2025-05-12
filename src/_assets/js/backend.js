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
let CARPETA_PUBLICA = "5e2c48e8-0a84-414e-baaa-f5e622d22355";

const muestraError = (mensaje) => {
  alert(mensaje);
};

const muestraExito = (mensaje) => {
  console.log(mensaje);
};

export function Backend() {
  this.actualizaDatosLogin = () => {
    let localStorageToken = localStorage.getItem(TOKEN_NOMBRE);
    if (localStorageToken) {
      this.token = JSON.parse(localStorageToken);
      this.estaLogueado = true;
    } else {
      this.token = null;
      this.estaLogueado = false;
    }
  };

  this.actualizaDatosLogin();

  if (this.estaLogueado) {
    console.log("Está logueado");
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

  this.hazPeticion = async (funcionDatos, esPublica) => {
    if (esPublica) {
      return await this.directus.request(funcionDatos);
    } else {
      if (!this.estaLogueado) {
        throw new Error("Non estás logueado");
      }

      // TODO Por alguna razón, tengo que forzar a que incluya el token
      // a pesar de que ya lo haya incluido al crear el cliente
      return await this.directus.request(
        withToken(this.token.access_token, funcionDatos)
      );
    }
  };

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
          // muestraError("O token caducou. Por favor, volve iniciar sesión.");
        }
      }

      let userInfo = await this.hazPeticion(
        readMe({
          fields: ["*"],
        }),
        false
      );
      console.log(userInfo);
    }
  };

  this.login = async (email, password, hayReload) => {
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
      this.actualizaDatosLogin();

      if (hayReload) {
        location.reload();
      }
    } catch (error) {
      muestraError(error?.errors?.[0]?.message || "Erro na entrada do usuario");
    }
  };

  this.registrarUsuario = async (datos) => {
    // TODO Validar los datos
    try {
      // Comprobamos si el email ya existe
      const resultCheck = await this.hazPeticion(
        () => ({
          path:
            "/flows/trigger/c84488dd-46a4-4b7b-b7b9-1eb001c9edb1?email=" +
            datos.email,
          method: "GET",
        }),
        true
      );

      if (resultCheck.resultado !== false) {
        throw new Error("Xa existe un usuario con ese email.");
      }

      const resultRegister = await this.hazPeticion(
        registerUser(datos.email, datos.password, {
          first_name: datos.nombre,
        }),
        true
      );

      // console.log("Resultado de registro");
      // console.log(resultRegister);

      // Para que esto funcione, hay que desactivar la verificación de email en el panel de Directus
      await this.login(datos.email, datos.password, false);

      await this.hazPeticion(
        updateMe(
          {
            relacion_valdeorras: datos.relacion_valdeorras,
            institucion: datos.institucion,
          },
          false
        )
      );

      location.reload();
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
      muestraError(
        error?.errors?.[0]?.message || "Non puidemos pechar a sesión"
      );
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
        // Carpeta pública
        formData.append("folder", CARPETA_PUBLICA);
        formData.append("file", datos.foto);

        const resultadoFoto = await this.hazPeticion(
          uploadFiles(formData),
          false
        );

        console.log(resultadoFoto);

        foto_id = resultadoFoto.id;
      } catch (error) {
        muestraError(error?.errors?.[0]?.message || error);
      }
    }

    datos.foto = foto_id;

    try {
      const resultadoNuevoTermino = await this.hazPeticion(
        () => ({
          path: "/flows/trigger/0525f10d-382c-4b00-9ffe-08fe5171e9fc",
          method: "POST",
          body: JSON.stringify(datos),
        }),
        false
      );
      novoTermoForm.classList.add("hidden");
      console.log(resultadoNuevoTermino);

      muestraExito("Termo engadido correctamente");
    } catch (error) {
      muestraError(error?.errors?.[0]?.message || error);
    }
  };
}
