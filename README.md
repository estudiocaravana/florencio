# Cómo funciona

Este proyecto está hecho con Webstudio, Eleventy (11ty), Netlify y Directus.

Con **Webstudio** maquetamos la web.

Con **11ty** hacemos que la maquetación sea dinámica.

**Directus** sirve como CMS para el contenido. Nos gusta mucho cómo está diseñado su panel y es muy configurable. Está instalado dentro de un contenedor Docker en un servidor de Raiola Networks.

**Netlify** se encarga de hacer el build de la web y de servirla como estática en producción. También nos permite recibir formularios de contacto.

# Trabajar en local

La primera vez, ejecutar

```bash
npm install
```

Para trabajar en local con HTTPS tenemos que generar un certificado SSL. Para ello, primero creamos la carpeta `.certificados` dentro de la carpeta raíz del proyecto.

```bash
mkdir .certificados
cd .certificados
```

Para el siguiente paso, tenemos que tener instalado mkcert en nuestro ordenador.
https://github.com/FiloSottile/mkcert#installation

Luego, generamos el certificado con el siguiente comando:

```bash
mkcert -install
mkcert local.florenciodelgadogurriaran.gal
```

Esto generará 2 archivos dentro de .certificados: local.florenciodelgadogurriaran.gal.pem y local.florenciodelgadogurriaran.gal-key.pem

Tendremos que añadir el dominio `local.florenciodelgadogurriaran.gal` a nuestro archivo `/etc/hosts` para que funcione el certificado. Para ello, añadiremos la siguiente línea a ese archivo:

```
127.0.0.1   local.florenciodelgadogurriaran.gal
```

Por último, ejecutamos

```bash
netlify dev
```

Tendremos que acceder a la web a través de `https://local.florenciodelgadogurriaran.gal:8888` para que funcione el certificado.

# Recompilar el código si hay cambios en el diseño de Webstudio

Lo primero que tendremos que hacer es conectar el proyecto a Webstudio. Antes, tendremos que tener instalado el [CLI de Webstudio](https://docs.webstudio.is/university/self-hosting/cli).

Y después:

1 - Creamos la carpeta `webstudio` dentro de la raíz del proyecto.

2 - Ejecutamos los siguientes comandos en terminal:

```bash
cd webstudio
webstudio
```

3 - Seguimos las instrucciones pegando en enlace de "share" del proyecto Webstudio y eligiendo la opción de plantilla estática (SSG).

A partir de ahora, cada vez que hagamos cambios en Webstudio, tendremos que ejecutar el siguiente comando en la **raíz del proyecto** para recompilar el código:

```bash
npm run wr
```

Esto descargará el código de Webstudio, generará los layouts de 11ty en src/\_layouts, copiará los assets en la carpeta src/assets y lanzará la web con Netlify Dev.

Si solo queremos recompilar los layouts de 11ty, podemos ejecutar el siguiente comando:

```bash
npm run r
```

El código que genera los layouts de 11ty se encuentra en la carpeta scripts/adaptar11ty.js.

# Hacer deploy si hay cambios en las functions

Para que funcione, por ahora estoy haciendo lo siguiente:

1 - En una pestaña de la terminal, lanzo la versión de servidor de desarrollo con

```bash
netlify dev
```

para que funcionen las llamadas a las functions. Si no, al llamarlas desde el build dice que no funcionan

2 - En otra pestaña de la terminal, hago un build del proyecto

```bash
netlify build
```

3 - En esa misma pestaña, hago una prueba del deploy

```bash
netlify deploy
```

4 - Si todo va bien, lo subo a producción

```bash
netlify deploy --prod
```

Esto provoca también que se regenere la web en Netlify.

# Artículos interesantes

Directus + 11ty
https://docs.directus.io/blog/getting-started-directus-and-eleventy-11ty-3.html

Cómo hacer webs con Astro y Netlify  
https://www.netlify.com/blog/deploy-an-astro-site-with-forms-serverless-functions-and-redirects/
https://www.netlify.com/blog/2021/07/23/build-a-modern-shopping-site-with-astro-and-serverless-functions/

Regenerar la web en Netlify tras cambios en Directus  
https://docs.directus.io/guides/headless-cms/trigger-static-builds/netlify.html#triggering-static-site-builds-with-netlify

Ante problemas con el envío de formularios  
https://answers.netlify.com/t/support-guide-form-problems-form-debugging-404-when-submitting/92

Redirecciones a otras páginas  
https://docs.astro.build/es/guides/routing/#redirecciones
