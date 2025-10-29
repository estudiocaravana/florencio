function adaptar($, assetsUrl) {
  $("#refran-single").each((_, el) => {
    // Sustituimos el token [REFRAN] del title de la página por el nombre del termo
    $("title").html(
      $("title")
        .html()
        .replace(/\[REFRAN\]/g, "{{ refran.termo }}")
    );

    const $el = $(el);

    $el.find("#termo-nome").first().html("{{ refran.termo }}");
    $el
      .find("#termo-definicion")
      .first()
      .html("{{ refran.definicion | safe }}");

    // Marca "En revisión"
    let revision = $el.find("#termo-revision").first();
    revision.replaceWith(
      "{% if refran.status == 'revision' %}" +
        revision.prop("outerHTML") +
        "{% endif %}"
    );

    // Marca "Descartado"
    let descartado = $el.find("#termo-descartado").first();
    descartado.replaceWith(
      "{% if refran.status == 'archived' %}" +
        descartado.prop("outerHTML") +
        "{% endif %}"
    );

    // Variantes
    let bloqueVariantes = $el.find("#termo-bloque-variantes").first();
    let variantes = bloqueVariantes.find("#termo-variantes").first();
    variantes.html("{{ refran.variantes | safe }}");
    bloqueVariantes.replaceWith(
      "{% if refran.variantes %}" +
        bloqueVariantes.prop("outerHTML") +
        "{% endif %}"
    );

    // Ejemplos
    let bloqueExemplos = $el.find("#termo-bloque-exemplos").first();
    let exemplos = bloqueExemplos.find("#termo-exemplos").first();
    exemplos.html("{{ refran.exemplos | safe }}");
    bloqueExemplos.replaceWith(
      "{% if refran.exemplos %}" +
        bloqueExemplos.prop("outerHTML") +
        "{% endif %}"
    );

    // Foto
    let bloqueFoto = $el.find("#termo-bloque-foto").first();
    let foto = bloqueFoto.find("#termo-foto").first();

    let nuevaFoto = $("<img>");
    nuevaFoto.attr("src", assetsUrl + "/{{ refran.galeria[0].foto }}");
    nuevaFoto.attr("class", foto.attr("class"));
    foto.replaceWith(nuevaFoto);

    let bloqueFotoFonte = bloqueFoto.find("#termo-bloque-foto-fonte").first();
    bloqueFotoFonte.replaceWith(
      "{% if refran.galeria[0].foto_fonte %}" +
        bloqueFotoFonte.prop("outerHTML") +
        "{% endif %}"
    );
    bloqueFoto
      .find("#termo-foto-fonte")
      .first()
      .html("{{ refran.galeria[0].foto_fonte }}");

    let bloqueFotoOnde = bloqueFoto.find("#termo-bloque-foto-onde").first();
    bloqueFotoOnde.replaceWith(
      "{% if refran.galeria[0].foto_onde %}" +
        bloqueFotoOnde.prop("outerHTML") +
        "{% endif %}"
    );
    bloqueFoto
      .find("#termo-foto-onde")
      .first()
      .html("{{ refran.galeria[0].foto_onde }}");

    let bloqueFotoQue = bloqueFoto.find("#termo-bloque-foto-que").first();
    bloqueFotoQue.replaceWith(
      "{% if refran.galeria[0].foto_que %}" +
        bloqueFotoQue.prop("outerHTML") +
        "{% endif %}"
    );
    bloqueFoto
      .find("#termo-foto-que")
      .first()
      .html("{{ refran.galeria[0].foto_que }}");

    let bloqueFotoAutoria = bloqueFoto
      .find("#termo-bloque-foto-autoria")
      .first();
    bloqueFotoAutoria.replaceWith(
      "{% if refran.galeria[0].foto_autoria %}" +
        bloqueFotoAutoria.prop("outerHTML") +
        "{% endif %}"
    );
    bloqueFoto
      .find("#termo-foto-autoria")
      .first()
      .html("{{ refran.galeria[0].foto_autoria | autoria }}");

    bloqueFoto.replaceWith(
      "{% if refran.galeria | length %}" +
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
      "{% if refran.audios | length %}" +
        "{%- for audio in refran.audios -%}\n" +
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
      .html("{{ refran.categorias | listaCategoria }}");
    bloqueCategorias.replaceWith(
      "{% if refran.categorias | length %}" +
        bloqueCategorias.prop("outerHTML") +
        "{% endif %}"
    );

    let bloqueCampos = bloqueFicha.find("#termo-bloque-campo").first();
    bloqueCampos
      .find("#termo-campo")
      .first()
      .html("{{ refran.campo_semantico | listaCampo }}");
    bloqueCampos.replaceWith(
      "{% if refran.campo_semantico | length %}" +
        bloqueCampos.prop("outerHTML") +
        "{% endif %}"
    );

    bloqueFicha.replaceWith(
      "{% if refran.categorias | length or refran.campo_semantico | length %}" +
        bloqueFicha.prop("outerHTML") +
        "{% endif %}"
    );

    // Informantes
    let bloqueInformantes = $el.find("#termo-bloque-informantes").first();
    bloqueInformantes
      .find("#termo-informantes")
      .first()
      .html(
        "{%- for informante in refran.informantes -%}" +
          "{{ informante | informante }}<br>" +
          "{%- endfor -%}"
      );
    bloqueInformantes.replaceWith(
      "{% if refran.informantes | length %}" +
        bloqueInformantes.prop("outerHTML") +
        "{% endif %}"
    );

    // Usuarios
    let bloqueUsuarios = $el.find("#termo-bloque-usuarios").first();
    bloqueUsuarios
      .find("#termo-usuarios")
      .first()
      .html("{{ refran.usuarios }}");
    bloqueUsuarios.replaceWith(
      "{% if refran.usuarios %}" +
        bloqueUsuarios.prop("outerHTML") +
        "{% endif %}"
    );

    // Mapa
    let bloqueUbicacion = $el.find("#termo-bloque-localizacion").first();
    bloqueUbicacion.replaceWith(
      "{% if refran.ubicacion | length %}" +
        bloqueUbicacion.prop("outerHTML") +
        "{% endif %}"
    );
    $el
      .find("#termo-localizacion")
      .first()
      .html("{{ refran.ubicacion | listaUbicacion }}");
    $el
      .find("#termo-mapa")
      .first()
      .html(
        "{% if refran.ubicacion | length %}" +
          '<div id="termo-mapa-iframe"></div>' +
          "{% endif %}"
      );

    $("head").append(
      "<script>\n" +
        "  const ubicacion = {{ refran.ubicacion | stringify | safe }};\n" +
        "</script>"
    );

    // Argumentario
    let bloqueArgumentario = $el.find("#termo-bloque-argumentario").first();
    let argumentario = bloqueArgumentario.find("#termo-argumentario").first();
    argumentario.html("{{ refran.argumentario | safe }}");
    bloqueArgumentario.replaceWith(
      "{% if refran.argumentario %}" +
        bloqueArgumentario.prop("outerHTML") +
        "{% endif %}"
    );

    // Enlace para completar el termo
    let enlaceCompletar = $el.find("#termo-completar").first();
    enlaceCompletar.attr(
      "href",
      enlaceCompletar.attr("href") + "?termo={{ refran.termo }}&tipo=refran"
    );

    // Comentarios
    $el
      .find("#termo-comentario-comentario")
      .first()
      .attr("data-termo", "{{ refran.id }}");

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
      "{%- for comentario in refran.comentarios -%}\n" +
      modelo.prop("outerHTML") +
      "{%- endfor -%}";
    comentarios.html(bucleComentarios);

    const noComentarios = bloqueComentarios.find("#termo-comentarios-no");
    noComentarios.removeClass("oculto");

    const logicaComentarios =
      "{% if refran.comentarios | length %}" +
      comentarios.prop("outerHTML") +
      "{% else %}" +
      noComentarios.prop("outerHTML") +
      "{% endif %}";

    bloqueComentarios.replaceWith(logicaComentarios);

    // Navegación
    const bloqueNavegacion = $el.find("#termo-bloque-navegacion").first();
    const termoAnterior = bloqueNavegacion.find("#termo-anterior");
    const termoSeguinte = bloqueNavegacion.find("#termo-siguiente");

    termoAnterior
      .find("a")
      .first()
      .attr("href", "/refrans/refran/{{ termoAnterior.termo | slugify }}");
    termoAnterior.replaceWith(
      "{% if termoAnterior %}" + termoAnterior.prop("outerHTML") + "{% endif %}"
    );

    termoSeguinte
      .find("a")
      .first()
      .attr("href", "/refrans/refran/{{ termoSeguinte.termo | slugify }}");
    termoSeguinte.replaceWith(
      "{% if termoSeguinte %}" + termoSeguinte.prop("outerHTML") + "{% endif %}"
    );

    bloqueNavegacion.replaceWith(
      "{% set termoAnterior = refrans | anterior(refran.id) %}" +
        "{% set termoSeguinte = refrans | siguiente(refran.id) %}" +
        bloqueNavegacion.prop("outerHTML")
    );

    const bloqueMiniNavegacion = $el
      .find("#termo-bloque-mininavegacion")
      .first();
    const miniTermoAnterior = bloqueMiniNavegacion.find("#termo-anterior");
    const miniTermoSeguinte = bloqueMiniNavegacion.find("#termo-siguiente");

    miniTermoAnterior.attr(
      "href",
      "/refrans/refran/{{ miniTermoAnterior.termo | slugify }}"
    );
    miniTermoAnterior.replaceWith(
      "{% if miniTermoAnterior %}" +
        miniTermoAnterior.prop("outerHTML") +
        "{% endif %}"
    );

    miniTermoSeguinte.attr(
      "href",
      "/refrans/refran/{{ miniTermoSeguinte.termo | slugify }}"
    );
    miniTermoSeguinte.replaceWith(
      "{% if miniTermoSeguinte %}" +
        miniTermoSeguinte.prop("outerHTML") +
        "{% endif %}"
    );

    bloqueMiniNavegacion.replaceWith(
      "{% set miniTermoAnterior = refrans | anterior(refran.id) %}" +
        "{% set miniTermoSeguinte = refrans | siguiente(refran.id) %}" +
        bloqueMiniNavegacion.prop("outerHTML")
    );
  });
}

module.exports = adaptar;
