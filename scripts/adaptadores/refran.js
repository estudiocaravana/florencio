const adaptarTermoRefran = require("./termoRefran.js");

function adaptar($, assetsUrl) {
  $("#refran-single").each((_, el) => {
    adaptarTermoRefran(
      $,
      el,
      assetsUrl,
      "refran",
      "refrans",
      "/refrans/refran"
    );
  });
}

module.exports = adaptar;
