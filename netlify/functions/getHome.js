const { getFromDirectus } = require("../utils/getFromDirectus");

exports.getHome = async () => {
  return getFromDirectus(
    "https://panel.florenciodelgadogurriaran.gal/items/termo?fields=*.*&filter[status][_eq]=published&limit=9&sort=-date_created",
    "GET"
  );
};
