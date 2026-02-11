function crearListaUsuarios($, el, assetsUrl, coleccion) {
  const bloque = $(el);
  let listaUsuarios = bloque.find("#proxecto-usuario");

  let modelo = listaUsuarios.first();
  modelo.find("#proxecto-usuario-nome").first().html("{{ item.nome }}");
  modelo
    .find("#proxecto-usuario-descricion")
    .first()
    .html("{{ item.descricion }}");

  let foto = modelo.find("#proxecto-usuario-avatar").first();
  let nuevaFoto = $("<img>");
  nuevaFoto.attr("src", assetsUrl + "/{{ item.avatar }}");
  nuevaFoto.attr("loading", "lazy");
  nuevaFoto.attr("class", foto.attr("class"));
  foto.replaceWith(
    "{% if item.avatar %}" + nuevaFoto.prop("outerHTML") + "{% endif %}",
  );

  const bucle =
    "{%- for item in " +
    coleccion +
    " -%}\n" +
    modelo.prop("outerHTML") +
    "{%- endfor -%}";

  listaUsuarios.replaceWith(bucle);
}

function adaptar($, assetsUrl) {
  $("#proxecto-bloque-equipo").each((_, el) => {
    crearListaUsuarios($, el, assetsUrl, "equipo");
  });

  $("#proxecto-bloque-colaboradores").each((_, el) => {
    crearListaUsuarios($, el, assetsUrl, "colaboradores");
  });
}

module.exports = adaptar;
