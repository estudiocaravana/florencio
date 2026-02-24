const fs = require("fs");
const markdownIt = require("markdown-it");
const dynamicCategories = require("eleventy-plugin-dynamic-categories");
const { htmlToText } = require("html-to-text");

module.exports = async function (eleventyConfig) {
  // Vite
  const EleventyPluginVite = (await import("@11ty/eleventy-plugin-vite"))
    .default;

  let viteOptions = {
    assetsInclude: ["**/*.tif"],
    // Para evitar el error de Vite "Top-level await is not available in the configured target environment"
    // https://stackoverflow.com/questions/72618944/get-error-to-build-my-project-in-vite-top-level-await-is-not-available-in-the
    build: {
      target: "esnext",
    },
  };

  // Cargamos los certificados para el servidor https si estamos ejecutando netlify dev

  if (process.env.NETLIFY_DEV) {
    viteOptions.server = {
      // Definimos el servidor del HMR (Hot Module Replacement) para evitar errores de consola
      // al estar trabajando con el servidor local local.florenciodelgadogurriaran.gal
      hmr: {
        protocol: "wss",
        host: "local.florenciodelgadogurriaran.gal",
        port: 24678,
      },
      https: {
        key: fs.readFileSync(
          `.certificados/local.florenciodelgadogurriaran.gal-key.pem`,
        ),
        cert: fs.readFileSync(
          `.certificados/local.florenciodelgadogurriaran.gal.pem`,
        ),
      },
    };
  }

  eleventyConfig.addPlugin(EleventyPluginVite, {
    viteOptions: viteOptions,
  });
  // Opciones básicas
  let options = {
    html: true,
    breaks: true,
    linkify: true,
  };
  // Markdown
  eleventyConfig.setLibrary("md", markdownIt(options));
  // Pasasamos los assets necesarios
  eleventyConfig.addPassthroughCopy("src/_assets");
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/media");
  eleventyConfig.addPassthroughCopy({
    "node_modules/tom-select/dist/css/tom-select.min.css":
      "/_assets/tom-select.css",
  });
  eleventyConfig.addPassthroughCopy({
    "node_modules/tom-select/dist/css/tom-select.min.css.map":
      "/_assets/tom-select.min.css.map",
  });
  // Put robots.txt in root
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "/public/robots.txt" });

  // Put google verification file in root
  eleventyConfig.addPassthroughCopy({
    "src/google4930be4105f28dfd.html": "/public/google4930be4105f28dfd.html",
  });

  // Filtro para convertir json a string
  eleventyConfig.addFilter("stringify", (data) => {
    return JSON.stringify(data, null, "\t");
  });

  // Filtro para convertir HTML y los caracteres &; en texto plano
  eleventyConfig.addFilter("stripHtml", (data) => {
    return htmlToText(data, {
      wordwrap: null,
    });
  });

  // Filtro para eliminar los corchetes, y su contenido, de un texto
  eleventyConfig.addFilter("removeBrackets", (data) => {
    if (!data) return "";
    return data.replace(/\s*\[.*?\]\s*/g, "").trim();
  });

  // Filtro para limitar el número de palabras
  eleventyConfig.addFilter("truncatewords", (data, numWords) => {
    if (!data) return "";
    let words = data.split(" ");
    if (words.length <= numWords) {
      return data;
    }
    return words.slice(0, numWords).join(" ") + "...";
  });

  // Filtro para obtener la url base de cada tipo de elemento
  eleventyConfig.addFilter("urlBase", (data) => {
    if (!data) return "";
    switch (data) {
      case "termo":
        return "/termos/termo";
      case "refran":
        return "/refrans/refran";
      default:
        return "/" + data + "s/" + data;
    }
  });

  // Creamos un filtro para convertir un array de objetos
  // relacionados de muchos a muchos (M2M) en una lista separada por comas
  function creaListaDeM2M(campo, nombre) {
    return (data) => {
      if (!data) return "";

      const items = data.map((item) => {
        return item[campo][nombre];
      });

      // Eliminamos los duplicados
      const uniqueItems = [...new Set(items)];

      return uniqueItems.join(", ");
    };
  }

  // Filtro para convertir un array de ubicaciones en una lista
  eleventyConfig.addFilter(
    "listaUbicacion",
    creaListaDeM2M("lugar_id", "nome"),
  );
  // Filtro para convertir un array de categorias en una lista
  eleventyConfig.addFilter(
    "listaCategoria",
    creaListaDeM2M("categoria_id", "nome"),
  );
  // Filtro para convertir un array de categorias en una lista de ids
  eleventyConfig.addFilter(
    "listaIdsCategoria",
    creaListaDeM2M("categoria_id", "id"),
  );
  // Filtro para convertir un array de campos semanticos en una lista
  eleventyConfig.addFilter(
    "listaCampo",
    creaListaDeM2M("campo_semantico_id", "nome"),
  );
  // Filtro para convertir un array de campos semanticos en una lista de ids
  eleventyConfig.addFilter(
    "listaIdsCampo",
    creaListaDeM2M("campo_semantico_id", "id"),
  );
  // Filtro para convertir un array de ubicaciones en una lista de concellos
  eleventyConfig.addFilter(
    "listaConcellos",
    creaListaDeM2M("lugar_id", "concello"),
  );
  // Filtro para convertir los colaboradores, tanto si son usuarios como si no, en una lista de nombres
  eleventyConfig.addFilter("listaColaboradores", (termo) => {
    if (!termo) return "";
    let listaColaboradores = [];

    if (termo.usuarios_colaboradores.length) {
      listaColaboradores.push(
        termo.usuarios_colaboradores.map((item) => {
          return item.directus_users_id.first_name;
        }),
      );
    }

    if (termo.usuarios) {
      listaColaboradores.push(termo.usuarios);
    }

    return listaColaboradores.join(", ");
  });

  // Creamos un filtro para extraer el informante de un objeto
  function creaInformante(quen, data_nacemento, nacemento, residencia) {
    return (data) => {
      if (!data) return "";

      let texto = "";

      if (data[quen]) {
        texto += data[quen];
      }
      if (data[data_nacemento] || data[nacemento]) {
        texto += " (";

        if (data[data_nacemento]) {
          texto += data[data_nacemento];
        }
        if (data[data_nacemento] && data[nacemento]) {
          texto += ", ";
        }
        if (data[nacemento]) {
          texto += data[nacemento];
        }

        texto += ")";
      }
      if (data[residencia]) {
        texto += ". Actualmente vive en " + data[residencia];
      }
      return texto;
    };
  }

  // Filtro para mostrar el informante de un audio
  eleventyConfig.addFilter(
    "informanteAudio",
    creaInformante(
      "audio_quen",
      "audio_data_nacemento",
      "audio_nacemento",
      "audio_residencia",
    ),
  );
  // Filtro para mostrar el informante de un termo
  eleventyConfig.addFilter(
    "informante",
    creaInformante(
      "nome",
      "ano_de_nacemento",
      "lugar_de_nacemento",
      "ultimo_lugar_de_residencia",
    ),
  );
  // Filtro para comprueba si una galería tiene fotos
  eleventyConfig.addFilter("tieneFotos", (data) => {
    if (!data) return false;
    return data.some((item) => item.foto);
  });
  // Filtro para mostrar fechas en formato dd/mm/yyyy
  eleventyConfig.addFilter("fecha", (data) => {
    if (!data) return "";
    let fecha = new Date(data);
    return fecha.toLocaleDateString("es-ES");
  });
  // Filtro para mostrar la autoría de una foto
  eleventyConfig.addFilter("autoria", (data) => {
    if (!data) return "";
    switch (data) {
      case "cc":
        return "Creative Commons";
    }

    // Devolvemos la autoría con la primera letra en mayúscula
    return data.charAt(0).toUpperCase() + data.slice(1);
  });

  // Funciones para encontrar el termo siguiente y anterior
  eleventyConfig.addFilter("siguiente", (collection, id) => {
    if (!collection || !id) return null;
    const index = collection.findIndex((item) => item.id == id);
    if (index === -1 || index === collection.length - 1) return null;
    return collection[index + 1];
  });
  eleventyConfig.addFilter("anterior", (collection, id) => {
    if (!collection || !id) return null;
    const index = collection.findIndex((item) => item.id == id);
    if (index === -1 || index === 0) return null;
    return collection[index - 1];
  });

  // sortByOrder - filtro para ordenar colecciones
  function sortByOrder(values) {
    let vals = [...values]; // this *seems* to prevent collection mutation...
    return vals.sort((a, b) => Math.sign(a.data.order - b.data.order));
  }
  eleventyConfig.addFilter("sortByOrder", sortByOrder);
  // categorias de cada colección
  eleventyConfig.addFilter("categoryFilter", function (collection, category) {
    if (!category) return collection;
    const filtered = collection.filter(
      (item) => item.data.category == category,
    );
    return filtered;
  });

  // Funciones para enlazar automáticamente las variantes de una palabra con su ficha, si existe
  eleventyConfig.addFilter("variantes", (variantes, urlBase, collection) => {
    if (!collection || !variantes) return null;

    const palabras = variantes
      // .split(/,|\s+e\s+/)
      .split(/,/)
      .map((v) => v.trim())
      .filter((v) => v);

    const variantesEnlazadas = palabras
      .map((palabra) => {
        const found = collection.find(
          (item) => item.termo.toLowerCase() === palabra.toLowerCase(),
        );
        if (found) {
          return `<a href="${urlBase}/${found.termo.toLowerCase()}">${palabra}</a>`;
        } else {
          return palabra;
        }
      })
      .join(", ");

    return variantesEnlazadas;
  });

  // directorios y njk
  return {
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dir: {
      input: "src",
      data: "_data",
      includes: "_includes",
      layouts: "_layouts",
    },
  };
};
