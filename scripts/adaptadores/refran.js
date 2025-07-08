function adaptar($, assetsUrl) {
  $("#refran-single").each((_, el) => {
    // Sustituimos el token [REFRAN] del title de la página por el nombre del refrán
    $("title").html(
      $("title")
        .html()
        .replace(/\[REFRAN\]/g, "{{ refran.termo }}")
    );

    const $el = $(el);

    $el.find("#refran-nome").first().html("{{ refran.termo }}");
    $el
      .find("#refran-definicion")
      .first()
      .html("{{ refran.definicion | safe }}");

    // Marca "En revisión"
    let revision = $el.find("#refran-revision").first();
    revision.replaceWith(
      "{% if refran.status == 'revision' %}" +
        revision.prop("outerHTML") +
        "{% endif %}"
    );

    // Ejemplos
    let bloqueExemplos = $el.find("#refran-bloque-exemplos").first();
    let exemplos = bloqueExemplos.find("#refran-exemplos").first();
    exemplos.html("{{ refran.exemplos | safe }}");
    bloqueExemplos.replaceWith(
      "{% if refran.exemplos %}" +
        bloqueExemplos.prop("outerHTML") +
        "{% endif %}"
    );

    // Foto
    let bloqueFoto = $el.find("#refran-bloque-foto").first();
    let foto = bloqueFoto.find("#refran-foto").first();

    let nuevaFoto = $("<img>");
    nuevaFoto.attr("src", assetsUrl + "/{{ refran.galeria[0].foto }}");
    nuevaFoto.attr("class", foto.attr("class"));
    foto.replaceWith(nuevaFoto);

    let bloqueFotoFonte = bloqueFoto.find("#refran-bloque-foto-fonte").first();
    bloqueFotoFonte.replaceWith(
      "{% if refran.galeria[0].foto_fonte %}" +
        bloqueFotoFonte.prop("outerHTML") +
        "{% endif %}"
    );
    bloqueFoto
      .find("#refran-foto-fonte")
      .first()
      .html("{{ refran.galeria[0].foto_fonte }}");

    let bloqueFotoOnde = bloqueFoto.find("#refran-bloque-foto-onde").first();
    bloqueFotoOnde.replaceWith(
      "{% if refran.galeria[0].foto_onde %}" +
        bloqueFotoOnde.prop("outerHTML") +
        "{% endif %}"
    );
    bloqueFoto
      .find("#refran-foto-onde")
      .first()
      .html("{{ refran.galeria[0].foto_onde }}");

    let bloqueFotoQue = bloqueFoto.find("#refran-bloque-foto-que").first();
    bloqueFotoQue.replaceWith(
      "{% if refran.galeria[0].foto_que %}" +
        bloqueFotoQue.prop("outerHTML") +
        "{% endif %}"
    );
    bloqueFoto
      .find("#refran-foto-que")
      .first()
      .html("{{ refran.galeria[0].foto_que }}");

    let bloqueFotoAutoria = bloqueFoto
      .find("#refran-bloque-foto-autoria")
      .first();
    bloqueFotoAutoria.replaceWith(
      "{% if refran.galeria[0].foto_autoria %}" +
        bloqueFotoAutoria.prop("outerHTML") +
        "{% endif %}"
    );
    bloqueFoto
      .find("#refran-foto-autoria")
      .first()
      .html("{{ refran.galeria[0].foto_autoria | autoria }}");

    bloqueFoto.replaceWith(
      "{% if refran.galeria | length %}" +
        bloqueFoto.prop("outerHTML") +
        "{% endif %}"
    );

    // Audio
    let bloqueAudio = $el.find("#refran-bloque-audio").first();
    bloqueAudio
      .find("#refran-audio-reproductor")
      .first()
      .html(
        '<div class="">' +
          '<wave-audio-path-player src="' +
          assetsUrl +
          '/{{ audio.audio }}" wave-width="300" wave-height="40" color="#000000" wave-color="#f7f5f2" wave-slider="#000000" wave-progress-color="#000000"></wave-audio-path-player>' +
          "</div>"
      );
    bloqueAudio
      .find("#refran-audio-lenda")
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
    let bloqueFicha = $el.find("#refran-bloque-ficha").first();

    let bloqueCampos = bloqueFicha.find("#refran-bloque-campo").first();
    bloqueCampos
      .find("#refran-campo")
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
    let bloqueInformantes = $el.find("#refran-bloque-informantes").first();
    bloqueInformantes
      .find("#refran-informantes")
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
    let bloqueUsuarios = $el.find("#refran-bloque-usuarios").first();
    bloqueUsuarios
      .find("#refran-usuarios")
      .first()
      .html("{{ refran.usuarios }}");
    bloqueUsuarios.replaceWith(
      "{% if refran.usuarios %}" +
        bloqueUsuarios.prop("outerHTML") +
        "{% endif %}"
    );

    // Mapa
    let bloqueUbicacion = $el.find("#refran-bloque-localizacion").first();
    bloqueUbicacion.replaceWith(
      "{% if refran.ubicacion | length %}" +
        bloqueUbicacion.prop("outerHTML") +
        "{% endif %}"
    );
    $el
      .find("#refran-localizacion")
      .first()
      .html("{{ refran.ubicacion | listaUbicacion }}");
    $el
      .find("#refran-mapa")
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
    let bloqueArgumentario = $el.find("#refran-bloque-argumentario").first();
    let argumentario = bloqueArgumentario.find("#refran-argumentario").first();
    argumentario.html("{{ refran.argumentario | safe }}");
    bloqueArgumentario.replaceWith(
      "{% if refran.argumentario %}" +
        bloqueArgumentario.prop("outerHTML") +
        "{% endif %}"
    );

    // Enlace para completar el refran
    let enlaceCompletar = $el.find("#refran-completar").first();
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
    const bloqueNavegacion = $el.find("#refran-bloque-navegacion").first();
    const refranAnterior = bloqueNavegacion.find("#refran-anterior");
    const refranSeguinte = bloqueNavegacion.find("#refran-siguiente");

    refranAnterior
      .find("a")
      .first()
      .attr("href", "/refrans/refran/{{ refranAnterior.termo | slugify }}");
    refranAnterior.replaceWith(
      "{% if refranAnterior %}" +
        refranAnterior.prop("outerHTML") +
        "{% endif %}"
    );

    refranSeguinte
      .find("a")
      .first()
      .attr("href", "/refrans/refran/{{ refranSeguinte.termo | slugify }}");
    refranSeguinte.replaceWith(
      "{% if refranSeguinte %}" +
        refranSeguinte.prop("outerHTML") +
        "{% endif %}"
    );

    bloqueNavegacion.replaceWith(
      "{% set refranAnterior = refrans | anterior(refran.id) %}" +
        "{% set refranSeguinte = refrans | siguiente(refran.id) %}" +
        bloqueNavegacion.prop("outerHTML")
    );
  });
}

module.exports = adaptar;
