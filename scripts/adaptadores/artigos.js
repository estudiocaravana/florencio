function adaptar($, assetsUrl) {
  $("#artigos-lista").each((_, el) => {
    let modelo = $(el).children().first();

    const adaptarArtigoEnLista = require("./artigo-en-lista");
    adaptarArtigoEnLista($, assetsUrl, modelo);

    const bucle =
      "{%- for item in artigos -%}\n" +
      modelo.prop("outerHTML") +
      "{%- endfor -%}";
    $(el).html(bucle);
  });
}

module.exports = adaptar;
