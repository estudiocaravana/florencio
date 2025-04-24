const { getFromDirectus } = require("../utils/getFromDirectus");

exports.getLugares = async () => {
  return getFromDirectus(
    "https://panel.florenciodelgadogurriaran.gal/items/lugar?fields=*.*&limit=-1",
    "GET"
  );
};
