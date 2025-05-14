const { getLugares } = require("../../netlify/functions/getLugares");

module.exports = async () => {
  const response = await getLugares();

  // Obtenemos los campos "concello" de cada lugar, sin duplicados y ordenados alfabéticamente
  const concellos = response
    .map((lugar) => lugar.concello)
    .filter((value, index, self) => self.indexOf(value) === index)
    .sort((a, b) => a.localeCompare(b));

  return concellos;
};
