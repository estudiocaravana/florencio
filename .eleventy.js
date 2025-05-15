const fs = require("fs");
const markdownIt = require("markdown-it");
const dynamicCategories = require("eleventy-plugin-dynamic-categories");

module.exports = async function (eleventyConfig) {
  // Vite
  const EleventyPluginVite = (await import("@11ty/eleventy-plugin-vite"))
    .default;

  let viteOptions = {
    assetsInclude: ["**/*.tif"],
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
          `.certificados/local.florenciodelgadogurriaran.gal-key.pem`
        ),
        cert: fs.readFileSync(
          `.certificados/local.florenciodelgadogurriaran.gal.pem`
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
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "/robots.txt" });

  // Filtro para convertir json a string
  eleventyConfig.addFilter("stringify", (data) => {
    return JSON.stringify(data, null, "\t");
  });

  // Creamos un filtro para convertir un array de objetos
  // relacionados de muchos a muchos (M2M) en una lista separada por comas
  function creaListaDeM2M(campo, nombre) {
    return (data) => {
      if (!data) return "";

      return data
        .map((item) => {
          return item[campo][nombre];
        })
        .join(", ");
    };
  }

  // Filtro para convertir un array de ubicaciones en una lista
  eleventyConfig.addFilter(
    "listaUbicacion",
    creaListaDeM2M("lugar_id", "nome")
  );
  // Filtro para convertir un array de categorias en una lista
  eleventyConfig.addFilter(
    "listaCategoria",
    creaListaDeM2M("categoria_id", "nome")
  );
  // Filtro para convertir un array de categorias en una lista de ids
  eleventyConfig.addFilter(
    "listaIdsCategoria",
    creaListaDeM2M("categoria_id", "id")
  );
  // Filtro para convertir un array de campos semanticos en una lista
  eleventyConfig.addFilter(
    "listaCampo",
    creaListaDeM2M("campo_semantico_id", "nome")
  );
  // Filtro para convertir un array de campos semanticos en una lista de ids
  eleventyConfig.addFilter(
    "listaIdsCampo",
    creaListaDeM2M("campo_semantico_id", "id")
  );
  // Filtro para convertir un array de ubicaciones en una lista de concellos
  eleventyConfig.addFilter(
    "listaConcellos",
    creaListaDeM2M("lugar_id", "concello")
  );

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
      "audio_residencia"
    )
  );
  // Filtro para mostrar el informante de un termo
  eleventyConfig.addFilter(
    "informante",
    creaInformante(
      "nome",
      "ano_de_nacemento",
      "lugar_de_nacemento",
      "ultimo_lugar_de_residencia"
    )
  );
  // Filtro para mostrar fechas en formato dd/mm/yyyy
  eleventyConfig.addFilter("fecha", (data) => {
    if (!data) return "";
    let fecha = new Date(data);
    return fecha.toLocaleDateString("es-ES");
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
      (item) => item.data.category == category
    );
    return filtered;
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
