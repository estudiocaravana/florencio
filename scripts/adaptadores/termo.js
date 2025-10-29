const adaptarTermoRefran = require("./termoRefran.js");

function adaptar($, assetsUrl) {
  $("#termo-single").each((_, el) => {
    adaptarTermoRefran($, el, assetsUrl, "termo", "termos", "/termos/termo");
  });
}

module.exports = adaptar;
