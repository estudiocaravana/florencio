const { getTodo } = require("../../netlify/functions/getTodo");

module.exports = async () => {
  const response = await getTodo();

  return response;
};
