function adaptar($, assetsUrl) {
  $("#home-termos-lista").each((_, el) => {
    let modelo = $(el).children().first();
    modelo.attr("href", "/termos/termo/{{ item.termo | slugify }}");
    modelo.find("#termo-nome").first().html("{{ item.termo }}");
    modelo
      .find("#termo-extracto")
      .first()
      .html("{{ item.definicion | safe | stripHtml | truncatewords(20) }}");

    const bucle =
      "{%- for item in home -%}\n" +
      modelo.prop("outerHTML") +
      "{%- endfor -%}";
    $(el).html(bucle);
  });

  $("#home-refrans-lista").each((_, el) => {
    let modelo = $(el).children().first();
    modelo.attr("href", "/refrans/refran/{{ item.termo | slugify }}");
    modelo.find("#termo-nome").first().html("{{ item.termo }}");
    modelo
      .find("#termo-extracto")
      .first()
      .html("{{ item.definicion | safe | stripHtml | truncatewords(20) }}");

    const bucle =
      "{%- for item in homeRefrans -%}\n" +
      modelo.prop("outerHTML") +
      "{%- endfor -%}";
    $(el).html(bucle);
  });

  const adaptarArtigoEnLista = require("./artigo-en-lista");
  $("#home-artigo").each((_, el) => {
    const $el = $(el);
    adaptarArtigoEnLista($, assetsUrl, $el);

    $el.prepend("{% set item = artigos[0] %}");
  });
}

module.exports = adaptar;
