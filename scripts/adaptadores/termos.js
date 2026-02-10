const adaptarElementoTermosRefrans = require("./termosRefrans.js");

function adaptar($, assetsUrl) {
  $("#termos-lista").each((_, el) => {
    adaptarElementoTermosRefrans($, el, assetsUrl);
  });
}

module.exports = adaptar;
