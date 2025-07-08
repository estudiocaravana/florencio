const { getRefrans } = require("../../netlify/functions/getRefrans");

module.exports = async () => {
  const response = await getRefrans();

  return response;
};
