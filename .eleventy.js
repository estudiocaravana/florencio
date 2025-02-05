const markdownIt = require("markdown-it");
module.exports = async function (eleventyConfig) {
  let options = {
    html: true,
    breaks: true,
    linkify: true,
  };
  eleventyConfig.setLibrary("md", markdownIt(options));
  eleventyConfig.addPassthroughCopy("src/assets/fonts");
  eleventyConfig.addPassthroughCopy("src/assets/img");
  eleventyConfig.addPassthroughCopy("src/media");
  // Put robots.txt in root
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "/robots.txt" });
  eleventyConfig.addPassthroughCopy({
    "node_modules/alpinejs/dist/cdn.min.js": "/assets/alpine.js",
  });
  eleventyConfig.addCollection("recurso", function (collections) {
    return collections.getFilteredByTag("recurso").sort(function (a, b) {
      return a.data.order - b.data.order;
    });
  });
  eleventyConfig.addCollection("premio", function (collections) {
    return collections.getFilteredByTag("premio").sort(function (a, b) {
      return a.data.order - b.data.order;
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
