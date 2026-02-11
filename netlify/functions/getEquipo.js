const { getFromDirectus } = require("../utils/getFromDirectus");

exports.getEquipo = async () => {
  return getFromDirectus(
    "https://panel.florenciodelgadogurriaran.gal/flows/trigger/40fb1025-c7ea-4e6a-ab97-f557d1ccdb67",
    "GET",
  );
};
