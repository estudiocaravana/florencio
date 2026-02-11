const {
  getColaboradores,
} = require("../../netlify/functions/getColaboradores");

module.exports = async () => {
  const response = await getColaboradores();

  return response;
};
