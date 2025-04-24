const { getFromDirectus } = require("../utils/getFromDirectus");

exports.getTermos = async () => {
  return getFromDirectus(
    "https://panel.florenciodelgadogurriaran.gal/items/termo?fields=*.*&limit=-1",
    "GET"
  );
};
