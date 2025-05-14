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
  document.querySelectorAll("#aviso-mensaje").forEach((aviso) => {
    aviso.innerHTML = mensaje;
  });
  document.querySelector("#aviso").classList.remove("oculto");
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

      // console.log(agora);
      // console.log(tokenCaduca);

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
    }
  };

  this.login = async (email, password, hayReload) => {
    try {
      if (this.estaLogueado) {
        throw new Error("Xa estás logueado");
      }

      if (!email || !password) {
        throw new Error("Por favor, introduce o teu email e contrasinal");
      }

      const response = await this.directus.login(email, password);
      localStorage.setItem(TOKEN_NOMBRE, JSON.stringify(response));
      this.actualizaDatosLogin();

      if (hayReload) {
        location.reload();
      }
    } catch (error) {
      muestraError(error?.errors?.[0]?.message || error);
    }
  };

  this.registrarUsuario = async (datos) => {
    try {
      if (!datos.email) {
        throw new Error("Por favor, introduce o teu email");
      }
      if (!datos.password) {
        throw new Error("Por favor, introduce un contrasinal");
      }
      if (datos.password.length < 8) {
        throw new Error("O contrasinal ten que ter polo menos 8 caracteres");
      }
      if (datos.password !== datos.repassword) {
        throw new Error("Os contrasinais non coinciden");
      }
      if (!datos.nombre) {
        throw new Error("Por favor, introduce o teu nome");
      }
      if (!datos.privacidade) {
        throw new Error("Por favor, acepta a política de privacidade");
      }

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

      let datosPerfil = {
        institucion: datos.institucion,
      };

      if (datos.relacion_valdeorras) {
        datosPerfil.relacion_valdeorras = datos.relacion_valdeorras;
      }
      if (datos.persoa_contacto) {
        datosPerfil.persoa_contacto = datos.persoa_contacto;
      }

      await this.hazPeticion(updateMe(datosPerfil, false));

      // Redirigimos a la home
      location.href = "/?registro=ok";
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

  this.perfil = async () => {
    let userInfo = await this.hazPeticion(
      readMe({
        fields: ["*"],
      }),
      false
    );

    return userInfo;
  };

  this.subirArchivo = async (archivo) => {
    let archivo_id = null;

    if (archivo) {
      // Subimos el archivo al servidor
      const formData = new FormData();
      // Carpeta pública
      formData.append("folder", CARPETA_PUBLICA);
      formData.append("file", archivo);

      const resultadoFoto = await this.hazPeticion(
        uploadFiles(formData),
        false
      );

      console.log(resultadoFoto);

      archivo_id = resultadoFoto.id;
    }

    return archivo_id;
  };

  this.nuevaAportacion = async (datos) => {
    try {
      if (!datos.termo) {
        throw new Error("Por favor, introduce o termo");
      }

      datos.foto = await this.subirArchivo(datos.foto);
      datos.audio = await this.subirArchivo(datos.audio);

      const resultadoNuevoTermino = await this.hazPeticion(
        () => ({
          path: "/flows/trigger/0525f10d-382c-4b00-9ffe-08fe5171e9fc",
          method: "POST",
          body: JSON.stringify(datos),
        }),
        false
      );
      console.log(resultadoNuevoTermino);

      muestraExito("Termo engadido correctamente");
    } catch (error) {
      muestraError(error?.errors?.[0]?.message || error);
    }
  };
}
