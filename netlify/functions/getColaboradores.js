const { getFromDirectus } = require("../utils/getFromDirectus");

exports.getColaboradores = async () => {
  return getFromDirectus(
    "https://panel.florenciodelgadogurriaran.gal/flows/trigger/37ddbbe5-b299-4738-8322-4766ad6150b1",
    "GET",
  );
};
