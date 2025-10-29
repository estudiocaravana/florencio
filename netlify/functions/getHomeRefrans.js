const { getFromDirectus } = require("../utils/getFromDirectus");

exports.getHomeRefrans = async () => {
  return getFromDirectus(
    "https://panel.florenciodelgadogurriaran.gal/items/termo?fields=*.*&filter[status][_eq]=published&limit=3&sort=-date_created&filter[tipo][_eq]=refran",
    "GET"
  );
};
