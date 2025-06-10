const { getArtigos } = require("../../netlify/functions/getArtigos");

module.exports = async () => {
  const response = await getArtigos();

  return response;
};
