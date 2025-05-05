const {
  getCamposSemanticos,
} = require("../../netlify/functions/getCamposSemanticos");

module.exports = async () => {
  const response = await getCamposSemanticos();

  return response;
};
