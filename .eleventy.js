const markdownIt = require("markdown-it");

module.exports = async function (eleventyConfig) {
  // Vite
  const EleventyPluginVite = (await import("@11ty/eleventy-plugin-vite"))
    .default;
  eleventyConfig.addPlugin(EleventyPluginVite, {
    viteOptions: {
      assetsInclude: ["**/*.tif"],
    },
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
  eleventyConfig.addPassthroughCopy("src/assets/fonts");
  eleventyConfig.addPassthroughCopy("src/assets/img");
  eleventyConfig.addPassthroughCopy("src/assets/js");
  eleventyConfig.addPassthroughCopy("src/media");
  eleventyConfig.addPassthroughCopy({
    "node_modules/alpinejs/dist/cdn.min.js": "/assets/alpine.js",
  });
  // Put robots.txt in root
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "/robots.txt" });
  // sortByOrder - filtro para ordenar colecciones
  function sortByOrder(values) {
    let vals = [...values]; // this *seems* to prevent collection mutation...
    return vals.sort((a, b) => Math.sign(a.data.order - b.data.order));
  }
  eleventyConfig.addFilter("sortByOrder", sortByOrder);
  // Colecciones. Sólo '...ByGlob' las mayoría directamente por tags
  eleventyConfig.addCollection("recurso", function (collections) {
    return collections.getFilteredByTag("recurso").sort(function (a, b) {
      return a.data.order - b.data.order;
    });
  });
  eleventyConfig.addCollection("actividad", function (collection) {
    return collection
      .getFilteredByGlob("./src/actividad/*.md")
      .sort(function (a, b) {
        return a.data.order - b.data.order;
      });
  });
  eleventyConfig.addCollection("termo", function (collection) {
    return collection
      .getFilteredByGlob("./src/dicionario/termo/*.md")
      .sort(function (a, b) {
        if (a.data.termo < b.data.termo) return -1;
        if (a.data.termo > b.data.termo) return 1;
        return 0;
      });
  });
  // Returns an array of tag names (https://piccalil.li/blog/low-tech-eleventy-categories/)
  eleventyConfig.addCollection("etiquetas", (collection) => {
    const gatheredTags = [];
    // Go through every piece of content and grab the tags
    collection.getFilteredByGlob("./src/actividad/*.md").forEach((item) => {
      if (item.data.tags) {
        if (typeof item.data.tags === "string") {
          gatheredTags.push(item.data.tags);
        } else {
          item.data.tags.forEach((tag) => gatheredTags.push(tag));
        }
      }
    });
    return [...new Set(gatheredTags)];
  });
  eleventyConfig.addCollection("artigo", function (collection) {
    return collection
      .getFilteredByGlob("./src/dicionario/artigo/*.md")
      .sort(function (a, b) {
        return a.data.artigo - b.data.artigo;
      });
  });
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
