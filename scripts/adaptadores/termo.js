function adaptar($, assetsUrl) {
  $("#termo-single").each((_, el) => {
    // Sustituimos el token [TERMO] del title de la página por el nombre del termo
    $("title").html(
      $("title")
        .html()
        .replace(/\[TERMO\]/g, "{{ termo.termo }}")
    );

    const $el = $(el);

    $el.find("#termo-nome").first().html("{{ termo.termo }}");
    $el.find("#termo-definicion").first().html("{{ termo.definicion | safe }}");

    // Marca "En revisión"
    let revision = $el.find("#termo-revision").first();
    revision.replaceWith(
      "{% if termo.status == 'revision' %}" +
        revision.prop("outerHTML") +
        "{% endif %}"
    );

    // Marca "Descartado"
    let descartado = $el.find("#termo-descartado").first();
    descartado.replaceWith(
      "{% if termo.status == 'archived' %}" +
        descartado.prop("outerHTML") +
        "{% endif %}"
    );

    // Variantes
    let bloqueVariantes = $el.find("#termo-bloque-variantes").first();
    let variantes = bloqueVariantes.find("#termo-variantes").first();
    variantes.html("{{ termo.variantes | safe }}");
    bloqueVariantes.replaceWith(
      "{% if termo.variantes %}" +
        bloqueVariantes.prop("outerHTML") +
        "{% endif %}"
    );

    // Ejemplos
    let bloqueExemplos = $el.find("#termo-bloque-exemplos").first();
    let exemplos = bloqueExemplos.find("#termo-exemplos").first();
    exemplos.html("{{ termo.exemplos | safe }}");
    bloqueExemplos.replaceWith(
      "{% if termo.exemplos %}" +
        bloqueExemplos.prop("outerHTML") +
        "{% endif %}"
    );

    // Foto
    let bloqueFoto = $el.find("#termo-bloque-foto").first();
    let foto = bloqueFoto.find("#termo-foto").first();

    let nuevaFoto = $("<img>");
    nuevaFoto.attr("src", assetsUrl + "/{{ termo.galeria[0].foto }}");
    nuevaFoto.attr("class", foto.attr("class"));
    foto.replaceWith(nuevaFoto);

    let bloqueFotoFonte = bloqueFoto.find("#termo-bloque-foto-fonte").first();
    bloqueFotoFonte.replaceWith(
      "{% if termo.galeria[0].foto_fonte %}" +
        bloqueFotoFonte.prop("outerHTML") +
        "{% endif %}"
    );
    bloqueFoto
      .find("#termo-foto-fonte")
      .first()
      .html("{{ termo.galeria[0].foto_fonte }}");

    let bloqueFotoOnde = bloqueFoto.find("#termo-bloque-foto-onde").first();
    bloqueFotoOnde.replaceWith(
      "{% if termo.galeria[0].foto_onde %}" +
        bloqueFotoOnde.prop("outerHTML") +
        "{% endif %}"
    );
    bloqueFoto
      .find("#termo-foto-onde")
      .first()
      .html("{{ termo.galeria[0].foto_onde }}");

    let bloqueFotoQue = bloqueFoto.find("#termo-bloque-foto-que").first();
    bloqueFotoQue.replaceWith(
      "{% if termo.galeria[0].foto_que %}" +
        bloqueFotoQue.prop("outerHTML") +
        "{% endif %}"
    );
    bloqueFoto
      .find("#termo-foto-que")
      .first()
      .html("{{ termo.galeria[0].foto_que }}");

    let bloqueFotoAutoria = bloqueFoto
      .find("#termo-bloque-foto-autoria")
      .first();
    bloqueFotoAutoria.replaceWith(
      "{% if termo.galeria[0].foto_autoria %}" +
        bloqueFotoAutoria.prop("outerHTML") +
        "{% endif %}"
    );
    bloqueFoto
      .find("#termo-foto-autoria")
      .first()
      .html("{{ termo.galeria[0].foto_autoria | autoria }}");

    bloqueFoto.replaceWith(
      "{% if termo.galeria | length %}" +
        bloqueFoto.prop("outerHTML") +
        "{% endif %}"
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
          "</div>"
      );
    bloqueAudio
      .find("#termo-audio-lenda")
      .first()
      .html("{{ audio | informanteAudio }}");

    bloqueAudio.replaceWith(
      "{% if termo.audios | length %}" +
        "{%- for audio in termo.audios -%}\n" +
        bloqueAudio.prop("outerHTML") +
        "{%- endfor -%}" +
        "{% endif %}"
    );

    // Ficha
    let bloqueFicha = $el.find("#termo-bloque-ficha").first();

    let bloqueCategorias = bloqueFicha.find("#termo-bloque-categoria").first();
    bloqueCategorias
      .find("#termo-categoria")
      .first()
      .html("{{ termo.categorias | listaCategoria }}");
    bloqueCategorias.replaceWith(
      "{% if termo.categorias | length %}" +
        bloqueCategorias.prop("outerHTML") +
        "{% endif %}"
    );

    let bloqueCampos = bloqueFicha.find("#termo-bloque-campo").first();
    bloqueCampos
      .find("#termo-campo")
      .first()
      .html("{{ termo.campo_semantico | listaCampo }}");
    bloqueCampos.replaceWith(
      "{% if termo.campo_semantico | length %}" +
        bloqueCampos.prop("outerHTML") +
        "{% endif %}"
    );

    bloqueFicha.replaceWith(
      "{% if termo.categorias | length or termo.campo_semantico | length %}" +
        bloqueFicha.prop("outerHTML") +
        "{% endif %}"
    );

    // Informantes
    let bloqueInformantes = $el.find("#termo-bloque-informantes").first();
    bloqueInformantes
      .find("#termo-informantes")
      .first()
      .html(
        "{%- for informante in termo.informantes -%}" +
          "{{ informante | informante }}<br>" +
          "{%- endfor -%}"
      );
    bloqueInformantes.replaceWith(
      "{% if termo.informantes | length %}" +
        bloqueInformantes.prop("outerHTML") +
        "{% endif %}"
    );

    // Usuarios
    let bloqueUsuarios = $el.find("#termo-bloque-usuarios").first();
    bloqueUsuarios.find("#termo-usuarios").first().html("{{ termo.usuarios }}");
    bloqueUsuarios.replaceWith(
      "{% if termo.usuarios %}" +
        bloqueUsuarios.prop("outerHTML") +
        "{% endif %}"
    );

    // Mapa
    let bloqueUbicacion = $el.find("#termo-bloque-localizacion").first();
    bloqueUbicacion.replaceWith(
      "{% if termo.ubicacion | length %}" +
        bloqueUbicacion.prop("outerHTML") +
        "{% endif %}"
    );
    $el
      .find("#termo-localizacion")
      .first()
      .html("{{ termo.ubicacion | listaUbicacion }}");
    $el
      .find("#termo-mapa")
      .first()
      .html(
        "{% if termo.ubicacion | length %}" +
          '<div id="termo-mapa-iframe"></div>' +
          "{% endif %}"
      );

    $("head").append(
      "<script>\n" +
        "  const ubicacion = {{ termo.ubicacion | stringify | safe }};\n" +
        "</script>"
    );

    // Argumentario
    let bloqueArgumentario = $el.find("#termo-bloque-argumentario").first();
    let argumentario = bloqueArgumentario.find("#termo-argumentario").first();
    argumentario.html("{{ termo.argumentario | safe }}");
    bloqueArgumentario.replaceWith(
      "{% if termo.argumentario %}" +
        bloqueArgumentario.prop("outerHTML") +
        "{% endif %}"
    );

    // Enlace para completar el termo
    let enlaceCompletar = $el.find("#termo-completar").first();
    enlaceCompletar.attr(
      "href",
      enlaceCompletar.attr("href") + "?termo={{ termo.termo }}&tipo=termo"
    );

    // Comentarios
    $el
      .find("#termo-comentario-comentario")
      .first()
      .attr("data-termo", "{{ termo.id }}");

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
      .html("{{ comentario.comentario }}");

    const bucleComentarios =
      "{%- for comentario in termo.comentarios -%}\n" +
      modelo.prop("outerHTML") +
      "{%- endfor -%}";
    comentarios.html(bucleComentarios);

    const noComentarios = bloqueComentarios.find("#termo-comentarios-no");
    noComentarios.removeClass("oculto");

    const logicaComentarios =
      "{% if termo.comentarios | length %}" +
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
        .attr("href", "/termos/termo/{{ termoAnterior.termo | slugify }}");
      termoAnterior.replaceWith(
        "{% if termoAnterior %}" +
          termoAnterior.prop("outerHTML") +
          "{% endif %}"
      );

      termoSeguinte
        .find("a")
        .first()
        .attr("href", "/termos/termo/{{ termoSeguinte.termo | slugify }}");
      termoSeguinte.replaceWith(
        "{% if termoSeguinte %}" +
          termoSeguinte.prop("outerHTML") +
          "{% endif %}"
      );

      bloqueNavegacion.replaceWith(
        "{% set termoAnterior = termos | anterior(termo.id) %}" +
          "{% set termoSeguinte = termos | siguiente(termo.id) %}" +
          bloqueNavegacion.prop("outerHTML")
      );
    });

    const bloqueMiniNavegacion = $el
      .find("#termo-bloque-mininavegacion")
      .first();
    const miniTermoAnterior = bloqueMiniNavegacion.find("#termo-anterior");
    const miniTermoSeguinte = bloqueMiniNavegacion.find("#termo-siguiente");

    miniTermoAnterior.attr(
      "href",
      "/termos/termo/{{ miniTermoAnterior.termo | slugify }}"
    );
    miniTermoAnterior.replaceWith(
      "{% if miniTermoAnterior %}" +
        miniTermoAnterior.prop("outerHTML") +
        "{% endif %}"
    );

    miniTermoSeguinte.attr(
      "href",
      "/termos/termo/{{ miniTermoSeguinte.termo | slugify }}"
    );
    miniTermoSeguinte.replaceWith(
      "{% if miniTermoSeguinte %}" +
        miniTermoSeguinte.prop("outerHTML") +
        "{% endif %}"
    );

    bloqueMiniNavegacion.replaceWith(
      "{% set miniTermoAnterior = termos | anterior(termo.id) %}" +
        "{% set miniTermoSeguinte = termos | siguiente(termo.id) %}" +
        bloqueMiniNavegacion.prop("outerHTML")
    );
  });
}

module.exports = adaptar;
