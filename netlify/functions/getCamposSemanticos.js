const { getFromDirectus } = require("../utils/getFromDirectus");

exports.getCamposSemanticos = async () => {
  return getFromDirectus(
    "https://panel.florenciodelgadogurriaran.gal/items/campo_semantico?fields=*.*&limit=-1",
    "GET"
  );
};
