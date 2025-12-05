function adaptarElementoTermosRefrans($, el, assetsUrl, dataName, urlBase) {
  let modelo = $(el).children().first();
  modelo.attr("href", urlBase + "/{{ item.termo | slugify }}");
  modelo.attr("data-estados", "{{ item.status }}");
  modelo.attr("data-categorias", "{{ item.categorias | listaIdsCategoria }}");
  modelo.attr("data-campos", "{{ item.campo_semantico | listaIdsCampo }}");
  modelo.attr("data-concellos", "{{ item.ubicacion | listaConcellos }}");
  modelo.find("#termo-nome").first().html("{{ item.termo }}");
  modelo
    .find("#termo-extracto")
    .first()
    .html(
      "{{ item.definicion | stripHtml | removeBrackets | truncatewords(20) }}"
    );

  let revision = modelo.find("#termo-revision").first();
  revision.removeClass("oculto");
  revision.html(
    "{% if item.status == 'revision' %}" + revision.html() + "{% endif %}"
  );

  let descartado = modelo.find("#termo-descartado").first();
  descartado.removeClass("oculto");
  descartado.html(
    "{% if item.status == 'archived' %}" + descartado.html() + "{% endif %}"
  );

  const bucle =
    "{%- for item in " +
    dataName +
    " -%}\n" +
    modelo.prop("outerHTML") +
    "{%- endfor -%}";
  $(el).html(bucle);

  $("#filtro-categorias").each((_, el) => {
    let modelo = $(el).children().first();
    modelo.attr("data-id", "{{ item.id }}");
    modelo.html("{{ item.nome }}");

    const bucle =
      "{%- for item in categorias -%}\n" +
      modelo.prop("outerHTML") +
      "{%- endfor -%}";

    // Opción "Todas"
    modelo.attr("data-id", "0");
    modelo.attr("class", modelo.attr("class") + " link-activo");
    modelo.html("Todas");

    $(el).html(modelo.prop("outerHTML") + bucle);
  });

  $("#filtro-campos").each((_, el) => {
    let modelo = $(el).children().first();
    modelo.attr("data-id", "{{ item.id }}");
    modelo.html("{{ item.nome }}");

    const bucle =
      "{%- for item in campos_semanticos -%}\n" +
      modelo.prop("outerHTML") +
      "{%- endfor -%}";

    // Opción "Todos"
    modelo.attr("data-id", "0");
    modelo.attr("class", modelo.attr("class") + " link-activo");
    modelo.html("Todos");

    $(el).html(modelo.prop("outerHTML") + bucle);
  });

  $("#filtro-concellos").each((_, el) => {
    let modelo = $(el).children().first();
    modelo.attr("data-id", "{{ item }}");
    modelo.html("{{ item }}");

    const bucle =
      "{%- for item in concellos -%}\n" +
      modelo.prop("outerHTML") +
      "{%- endfor -%}";

    // Opción "Todos"
    modelo.attr("data-id", "0");
    modelo.attr("class", modelo.attr("class") + " link-activo");
    modelo.html("Todos");

    $(el).html(modelo.prop("outerHTML") + bucle);
  });

  $("#filtro-estados").each((_, el) => {
    let modelo = $(el).children().first();
    const clases = modelo.attr("class");

    let contenido = "";

    // Opción "Todos"
    modelo.attr("data-id", "0");
    modelo.attr("class", clases + " link-activo");
    modelo.html("Todos");
    contenido += modelo.prop("outerHTML");

    // Opción "Validados"
    modelo.attr("data-id", "published");
    modelo.attr("class", clases);
    modelo.html("Validados");
    contenido += modelo.prop("outerHTML");

    // Opción "En revisión"
    modelo.attr("data-id", "revision");
    modelo.attr("class", clases);
    modelo.html("En revisión");
    contenido += modelo.prop("outerHTML");

    // Opción "Descartado"
    modelo.attr("data-id", "archived");
    modelo.attr("class", clases);
    modelo.html("Descartados");
    contenido += modelo.prop("outerHTML");

    $(el).html(contenido);
  });
}

module.exports = adaptarElementoTermosRefrans;
