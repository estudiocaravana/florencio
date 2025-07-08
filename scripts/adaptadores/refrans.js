function adaptar($, assetsUrl) {
  $("#refrans-lista").each((_, el) => {
    let modelo = $(el).children().first();
    modelo.attr("href", "/refrans/refran/{{ item.termo | slugify }}");
    modelo.attr("data-campos", "{{ item.campo_semantico | listaIdsCampo }}");
    modelo.attr("data-concellos", "{{ item.ubicacion | listaConcellos }}");
    modelo.find("#refran-nome").first().html("{{ item.termo }}");
    modelo
      .find("#refran-extracto")
      .first()
      .html("{{ item.definicion | safe }}");

    let estado = modelo.find("#refran-estado").first();
    estado.html(
      "{% if item.status == 'revision' %}" + estado.html() + "{% endif %}"
    );

    const bucle =
      "{%- for item in refrans -%}\n" +
      modelo.prop("outerHTML") +
      "{%- endfor -%}";
    $(el).html(bucle);

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
  });
}

module.exports = adaptar;
