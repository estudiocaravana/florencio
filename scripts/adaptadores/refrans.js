const adaptarElementoTermosRefrans = require("./termosRefrans.js");

function adaptar($, assetsUrl) {
  $("#termos-lista").each((_, el) => {
    adaptarElementoTermosRefrans(
      $,
      el,
      assetsUrl,
      "refrans",
      "/refrans/refran"
    );
  });
}

module.exports = adaptar;
