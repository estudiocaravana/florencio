function adaptarTermoRefran(
  $,
  el,
  assetsUrl,
  dataName,
  dataNameIndex,
  urlBase,
) {
  const tokenTitle = dataName.toUpperCase();
  // Sustituimos el token [tokenTitle] del title de la página por el nombre del termo
  $("title").html(
    $("title")
      .html()
      .replace(
        new RegExp("\\[" + tokenTitle + "\\]", "g"),
        "{{ " + dataName + ".termo }}",
      ),
  );

  const $el = $(el);

  $el
    .find("#termo-nome")
    .first()
    .html("{{ " + dataName + ".termo }}");
  $el
    .find("#termo-definicion")
    .first()
    .html("{{ " + dataName + ".definicion | safe }}");

  // Marca "En revisión"
  let revision = $el.find("#termo-revision").first();
  revision.replaceWith(
    "{% if " +
      dataName +
      ".status == 'revision' %}" +
      revision.prop("outerHTML") +
      "{% endif %}",
  );

  // Marca "Descartado"
  let descartado = $el.find("#termo-descartado").first();
  descartado.replaceWith(
    "{% if " +
      dataName +
      ".status == 'archived' %}" +
      descartado.prop("outerHTML") +
      "{% endif %}",
  );

  // Variantes
  let bloqueVariantes = $el.find("#termo-bloque-variantes").first();
  let variantes = bloqueVariantes.find("#termo-variantes").first();
  variantes.html(
    "{{ " +
      dataName +
      ".variantes | variantes('" +
      urlBase +
      "', " +
      dataNameIndex +
      ") | safe }}",
  );
  bloqueVariantes.replaceWith(
    "{% if " +
      dataName +
      ".variantes %}" +
      bloqueVariantes.prop("outerHTML") +
      "{% endif %}",
  );

  // Ejemplos
  let bloqueExemplos = $el.find("#termo-bloque-exemplos").first();
  let exemplos = bloqueExemplos.find("#termo-exemplos").first();
  exemplos.html("{{ " + dataName + ".exemplos | safe }}");
  bloqueExemplos.replaceWith(
    "{% if " +
      dataName +
      ".exemplos %}" +
      bloqueExemplos.prop("outerHTML") +
      "{% endif %}",
  );

  // Foto
  let bloqueFoto = $el.find("#termo-bloque-foto").first();
  let foto = bloqueFoto.find("#termo-foto").first();

  let nuevaFoto = $("<img>");
  nuevaFoto.attr("src", assetsUrl + "/{{ " + dataName + ".galeria[0].foto }}");
  nuevaFoto.attr("loading", "lazy");
  nuevaFoto.attr("class", foto.attr("class"));
  foto.replaceWith(nuevaFoto);

  let bloqueFotoFonte = bloqueFoto.find("#termo-bloque-foto-fonte").first();
  bloqueFotoFonte.replaceWith(
    "{% if " +
      dataName +
      ".galeria[0].foto_fonte %}" +
      bloqueFotoFonte.prop("outerHTML") +
      "{% endif %}",
  );
  bloqueFoto
    .find("#termo-foto-fonte")
    .first()
    .html("{{ " + dataName + ".galeria[0].foto_fonte }}");

  let bloqueFotoOnde = bloqueFoto.find("#termo-bloque-foto-onde").first();
  bloqueFotoOnde.replaceWith(
    "{% if " +
      dataName +
      ".galeria[0].foto_onde %}" +
      bloqueFotoOnde.prop("outerHTML") +
      "{% endif %}",
  );
  bloqueFoto
    .find("#termo-foto-onde")
    .first()
    .html("{{ " + dataName + ".galeria[0].foto_onde }}");

  let bloqueFotoQue = bloqueFoto.find("#termo-bloque-foto-que").first();
  bloqueFotoQue.replaceWith(
    "{% if " +
      dataName +
      ".galeria[0].foto_que %}" +
      bloqueFotoQue.prop("outerHTML") +
      "{% endif %}",
  );
  bloqueFoto
    .find("#termo-foto-que")
    .first()
    .html("{{ " + dataName + ".galeria[0].foto_que }}");

  let bloqueFotoAutoria = bloqueFoto.find("#termo-bloque-foto-autoria").first();
  bloqueFotoAutoria.replaceWith(
    "{% if " +
      dataName +
      ".galeria[0].foto_autoria %}" +
      bloqueFotoAutoria.prop("outerHTML") +
      "{% endif %}",
  );
  bloqueFoto
    .find("#termo-foto-autoria")
    .first()
    .html("{{ " + dataName + ".galeria[0].foto_autoria | autoria }}");

  bloqueFoto.replaceWith(
    "{% if " +
      dataName +
      ".galeria | length %}" +
      bloqueFoto.prop("outerHTML") +
      "{% endif %}",
  );

  // Audio
  let bloqueAudio = $el.find("#termo-bloque-audio").first();
  bloqueAudio
    .find("#termo-audio-reproductor")
    .first()
    .html(
      '<div class="">' +
        '<wave-audio-path-player src="' +
        assetsUrl +
        '/{{ audio.audio }}" wave-width="300" wave-height="40" color="#000000" wave-color="#f7f5f2" wave-slider="#000000" wave-progress-color="#000000"></wave-audio-path-player>' +
        "</div>",
    );
  bloqueAudio
    .find("#termo-audio-lenda")
    .first()
    .html("{{ audio | informanteAudio }}");

  bloqueAudio.replaceWith(
    "{% if " +
      dataName +
      ".audios | length %}" +
      "{%- for audio in " +
      dataName +
      ".audios -%}\n" +
      bloqueAudio.prop("outerHTML") +
      "{%- endfor -%}" +
      "{% endif %}",
  );

  // Ficha
  let bloqueCategorias = $el.find("#termo-bloque-categoria").first();
  bloqueCategorias
    .find("#termo-categoria")
    .first()
    .html("{{ " + dataName + ".categorias | listaCategoria }}");
  bloqueCategorias.replaceWith(
    "{% if " +
      dataName +
      ".categorias | length %}" +
      bloqueCategorias.prop("outerHTML") +
      "{% endif %}",
  );

  let bloqueCampos = $el.find("#termo-bloque-campo").first();
  bloqueCampos
    .find("#termo-campo")
    .first()
    .html("{{ " + dataName + ".campo_semantico | listaCampo }}");
  bloqueCampos.replaceWith(
    "{% if " +
      dataName +
      ".campo_semantico | length %}" +
      bloqueCampos.prop("outerHTML") +
      "{% endif %}",
  );

  // Informantes
  let bloqueInformantes = $el.find("#termo-bloque-informantes").first();
  bloqueInformantes
    .find("#termo-informantes")
    .first()
    .html(
      "{%- for informante in " +
        dataName +
        ".informantes -%}" +
        "{{ informante | informante }}<br>" +
        "{%- endfor -%}",
    );
  bloqueInformantes.replaceWith(
    "{% if " +
      dataName +
      ".informantes | length %}" +
      bloqueInformantes.prop("outerHTML") +
      "{% endif %}",
  );

  // Usuarios
  let bloqueUsuarios = $el.find("#termo-bloque-usuarios").first();
  bloqueUsuarios
    .find("#termo-usuarios")
    .first()
    .html("{{ " + dataName + " | listaColaboradores }}");
  bloqueUsuarios.replaceWith(
    "{% if " +
      dataName +
      ".usuarios_colaboradores | length or " +
      dataName +
      ".usuarios %}" +
      bloqueUsuarios.prop("outerHTML") +
      "{% endif %}",
  );

  // Mapa
  let bloqueUbicacion = $el.find("#termo-bloque-localizacion").first();
  bloqueUbicacion.replaceWith(
    "{% if " +
      dataName +
      ".ubicacion | length %}" +
      bloqueUbicacion.prop("outerHTML") +
      "{% endif %}",
  );
  $el
    .find("#termo-localizacion")
    .first()
    .html("{{ " + dataName + ".ubicacion | listaUbicacion }}");
  $el
    .find("#termo-mapa")
    .first()
    .html(
      "{% if " +
        dataName +
        ".ubicacion | length %}" +
        '<div id="termo-mapa-iframe"></div>' +
        "{% endif %}",
    );

  $("head").append(
    "<script>\n" +
      "  const ubicacion = {{ " +
      dataName +
      ".ubicacion | stringify | safe }};\n" +
      "</script>",
  );

  // Argumentario
  let bloqueArgumentario = $el.find("#termo-bloque-argumentario").first();
  let argumentario = bloqueArgumentario.find("#termo-argumentario").first();
  argumentario.html("{{ " + dataName + ".argumentario | safe }}");
  bloqueArgumentario.replaceWith(
    "{% if " +
      dataName +
      ".argumentario %}" +
      bloqueArgumentario.prop("outerHTML") +
      "{% endif %}",
  );

  // Enlace para completar el termo
  let enlaceCompletar = $el.find("#termo-completar").first();
  enlaceCompletar.attr(
    "href",
    enlaceCompletar.attr("href") +
      "?termo={{ " +
      dataName +
      ".termo }}&tipo=" +
      dataName,
  );

  // Comentarios
  $el
    .find("#termo-comentario-comentario")
    .first()
    .attr("data-termo", "{{ " + dataName + ".id }}");

  const bloqueComentarios = $el.find("#termo-bloque-comentarios").first();

  const comentarios = bloqueComentarios
    .find("#termo-comentarios-lista")
    .first();
  const modelo = comentarios.children().first();
  modelo
    .find("#termo-comentarios-usuario")
    .first()
    .html("{{ comentario.user_created.first_name }}");
  modelo
    .find("#termo-comentarios-fecha")
    .first()
    .html("{{ comentario.date_created | fecha }}");
  modelo
    .find("#termo-comentarios-comentario")
    .first()
    .html("{{ comentario.comentario | safe }}");

  const bucleComentarios =
    "{%- for comentario in " +
    dataName +
    ".comentarios -%}\n" +
    modelo.prop("outerHTML") +
    "{%- endfor -%}";
  comentarios.html(bucleComentarios);

  const noComentarios = bloqueComentarios.find("#termo-comentarios-no");
  noComentarios.removeClass("oculto");

  const logicaComentarios =
    "{% if " +
    dataName +
    ".comentarios | length %}" +
    comentarios.prop("outerHTML") +
    "{% else %}" +
    noComentarios.prop("outerHTML") +
    "{% endif %}";

  bloqueComentarios.replaceWith(logicaComentarios);

  // Navegación
  const bloquesNavegacion = $el.find("#termo-bloque-navegacion");

  bloquesNavegacion.each((_, el) => {
    const bloqueNavegacion = $(el);
    const termoAnterior = bloqueNavegacion.find("#termo-anterior");
    const termoSeguinte = bloqueNavegacion.find("#termo-siguiente");

    termoAnterior
      .find("a")
      .first()
      .attr("href", urlBase + "/{{ termoAnterior.termo | slugify }}");
    termoAnterior.replaceWith(
      "{% if termoAnterior %}" +
        termoAnterior.prop("outerHTML") +
        "{% endif %}",
    );

    termoSeguinte
      .find("a")
      .first()
      .attr("href", urlBase + "/{{ termoSeguinte.termo | slugify }}");
    termoSeguinte.replaceWith(
      "{% if termoSeguinte %}" +
        termoSeguinte.prop("outerHTML") +
        "{% endif %}",
    );

    bloqueNavegacion.replaceWith(
      "{% set termoAnterior = " +
        dataNameIndex +
        " | anterior(" +
        dataName +
        ".id) %}" +
        "{% set termoSeguinte = " +
        dataNameIndex +
        " | siguiente(" +
        dataName +
        ".id) %}" +
        bloqueNavegacion.prop("outerHTML"),
    );
  });

  const bloqueMiniNavegacion = $el.find("#termo-bloque-mininavegacion").first();
  const miniTermoAnterior = bloqueMiniNavegacion.find("#termo-anterior");
  const miniTermoSeguinte = bloqueMiniNavegacion.find("#termo-siguiente");

  miniTermoAnterior.attr(
    "href",
    urlBase + "/{{ miniTermoAnterior.termo | slugify }}",
  );
  miniTermoAnterior.replaceWith(
    "{% if miniTermoAnterior %}" +
      miniTermoAnterior.prop("outerHTML") +
      "{% endif %}",
  );

  miniTermoSeguinte.attr(
    "href",
    urlBase + "/{{ miniTermoSeguinte.termo | slugify }}",
  );
  miniTermoSeguinte.replaceWith(
    "{% if miniTermoSeguinte %}" +
      miniTermoSeguinte.prop("outerHTML") +
      "{% endif %}",
  );

  bloqueMiniNavegacion.replaceWith(
    "{% set miniTermoAnterior = " +
      dataNameIndex +
      " | anterior(" +
      dataName +
      ".id) %}" +
      "{% set miniTermoSeguinte = " +
      dataNameIndex +
      " | siguiente(" +
      dataName +
      ".id) %}" +
      bloqueMiniNavegacion.prop("outerHTML"),
  );
}

module.exports = adaptarTermoRefran;
