const { getFromDirectus } = require("../utils/getFromDirectus");

exports.getTermos = async () => {
  return getFromDirectus(
    "https://panel.florenciodelgadogurriaran.gal/items/termo?fields=*.*,ubicacion.lugar_id.*,categorias.categoria_id.*,campo_semantico.campo_semantico_id.*,usuarios_colaboradores.directus_users_id.first_name,comentarios.user_created.*&limit=-1&sort=termo",
    "GET",
  );
};
