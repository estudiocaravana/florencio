const { getEquipo } = require("../../netlify/functions/getEquipo");

module.exports = async () => {
  const response = await getEquipo();

  return response;
};
