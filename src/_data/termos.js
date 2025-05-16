const { getTermos } = require("../../netlify/functions/getTermos");

module.exports = async () => {
  const response = await getTermos();

  return response;
};
