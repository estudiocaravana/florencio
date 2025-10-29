const { getHomeRefrans } = require("../../netlify/functions/getHomeRefrans");

module.exports = async () => {
  const response = await getHomeRefrans();

  return response;
};
