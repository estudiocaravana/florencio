const markdownIt = require("markdown-it");
const dynamicCategories = require("eleventy-plugin-dynamic-categories");

module.exports = async function (eleventyConfig) {
  // Vite
  const EleventyPluginVite = (await import("@11ty/eleventy-plugin-vite")).default;
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
  // categorias de cada colección
  eleventyConfig.addFilter("categoryFilter", function (collection, category) {
    if (!category) return collection;
    const filtered = collection.filter((item) => item.data.category == category);
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
