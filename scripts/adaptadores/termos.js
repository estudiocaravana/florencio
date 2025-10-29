const adaptarElementoTermosRefrans = require("./termosRefrans.js");

function adaptar($, assetsUrl) {
  $("#termos-lista").each((_, el) => {
    adaptarElementoTermosRefrans($, el, assetsUrl, "termos", "/termos/termo");
  });
}

module.exports = adaptar;
