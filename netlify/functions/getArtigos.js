const { getFromDirectus } = require("../utils/getFromDirectus");

exports.getArtigos = async () => {
  return getFromDirectus(
    "https://panel.florenciodelgadogurriaran.gal/items/artigo?limit=-1&sort=-data",
    "GET"
  );
};
