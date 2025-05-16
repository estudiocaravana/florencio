const { getCategorias } = require("../../netlify/functions/getCategorias");

module.exports = async () => {
  const response = await getCategorias();

  return response;
};
