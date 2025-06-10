function adaptar($, assetsUrl) {
  $("#novo-termo-ubicacion").each((_, el) => {
    $(el).append(
      "{%- for lugar in lugares -%}" +
        "<option value='{{ lugar.id }}'>{{ lugar.nome }} ({{ lugar.concello }})</option>" +
        "{%- endfor -%}"
    );
  });
  $("#novo-termo-categoria").each((_, el) => {
    $(el).append(
      "{%- for categoria in categorias -%}" +
        "<option value='{{ categoria.id }}'>{{ categoria.nome }}</option>" +
        "{%- endfor -%}"
    );
  });
  $("#novo-termo-campo").each((_, el) => {
    $(el).append(
      "{%- for campo in campos_semanticos -%}" +
        "<option value='{{ campo.id }}'>{{ campo.nome }}</option>" +
        "{%- endfor -%}"
    );
  });
}

module.exports = adaptar;
