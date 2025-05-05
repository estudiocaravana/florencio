const { getFromDirectus } = require("../utils/getFromDirectus");

exports.getCategorias = async () => {
  return getFromDirectus(
    "https://panel.florenciodelgadogurriaran.gal/items/categoria?fields=*.*&limit=-1",
    "GET"
  );
};
