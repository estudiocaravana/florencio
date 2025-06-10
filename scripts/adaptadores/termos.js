function adaptar($, assetsUrl) {
  $("#termos-lista").each((_, el) => {
    let modelo = $(el).children().first();
    modelo.attr("href", "/termos/termo/{{ item.termo | slugify }}");
    modelo.attr("data-categorias", "{{ item.categorias | listaIdsCategoria }}");
    modelo.attr("data-campos", "{{ item.campo_semantico | listaIdsCampo }}");
    modelo.attr("data-concellos", "{{ item.ubicacion | listaConcellos }}");
    modelo.find("#termo-nome").first().html("{{ item.termo }}");
    modelo.find("#termo-extracto").first().html("{{ item.definicion | safe }}");

    let estado = modelo.find("#termo-estado").first();
    estado.html(
      "{% if item.status == 'revision' %}" + estado.html() + "{% endif %}"
    );

    const bucle =
      "{%- for item in termos -%}\n" +
      modelo.prop("outerHTML") +
      "{%- endfor -%}";
    $(el).html(bucle);
  });

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
}

module.exports = adaptar;
