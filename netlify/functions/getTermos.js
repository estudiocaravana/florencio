const { getFromDirectus } = require("../utils/getFromDirectus");

exports.getTermos = async () => {
  return getFromDirectus(
    "https://panel.florenciodelgadogurriaran.gal/items/termo?fields=*.*,ubicacion.lugar_id.*,categorias.categoria_id.*,campo_semantico.campo_semantico_id.*&limit=-1",
    "GET"
  );
};
