const { getHome } = require("../../netlify/functions/getHome");

module.exports = async () => {
  const response = await getHome();

  return response;
};
