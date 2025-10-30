function adaptar($, assetsUrl, artigo) {
  artigo
    .find("a")
    .first()
    .attr("href", "/artigos/artigo/{{ item.titulo | slugify }}");
  artigo.find("#artigo-titulo").first().html("{{ item.titulo }}");
  artigo.find("#artigo-extracto").first().html("{{ item.extracto | safe }}");
  artigo.find("#artigo-autora").first().html("{{ item.autora }}");

  const img = artigo.find("#artigo-imaxe").first();
  const nuevaImg = $("<img>");
  nuevaImg.attr("src", assetsUrl + "/{{ item.imaxe }}");
  nuevaImg.attr("loading", "lazy");
  nuevaImg.attr("class", img.attr("class"));
  nuevaImg.attr("width", img.attr("width"));
  img.replaceWith(
    "{% if item.imaxe | length %}" + nuevaImg.prop("outerHTML") + "{% endif %}"
  );
}

module.exports = adaptar;
