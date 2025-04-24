const { getLugares } = require("../../netlify/functions/getLugares");

module.exports = async () => {
  const response = await getLugares();

  return response;
};
