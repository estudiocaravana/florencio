function adaptar($, assetsUrl) {
  $("#artigo-single").each((_, el) => {
    // Sustituimos el token [ARTIGO] del title de la página por el titulo del artigo
    $("title").html(
      $("title")
        .html()
        .replace(/\[ARTIGO\]/g, "{{ artigo.titulo }}")
    );

    const $el = $(el);

    $el.find("#artigo-titulo").first().html("{{ artigo.titulo }}");
    $el.find("#artigo-extracto").first().html("{{ artigo.extracto | safe }}");
    $el.find("#artigo-autora").first().html("{{ artigo.autora }}");
    $el.find("#artigo-data").first().html("{{ artigo.data | fecha }}");

    // Imaxe
    let bloqueImaxe = $el.find("#artigo-bloque-imaxe").first();
    let imaxe = bloqueImaxe.find("#artigo-imaxe").first();

    let nuevaImaxe = $("<img>");
    nuevaImaxe.attr("src", assetsUrl + "/{{ artigo.imaxe }}");
    nuevaImaxe.attr("class", imaxe.attr("class"));
    imaxe.replaceWith(nuevaImaxe);

    bloqueImaxe.replaceWith(
      "{% if artigo.imaxe | length %}" +
        bloqueImaxe.prop("outerHTML") +
        "{% endif %}"
    );

    // Contido
    let contido = $el.find("#artigo-contido").first();
    contido.replaceWith(
      "{%- for bloque in artigo.contido.blocks -%}" +
        // Párrafo
        "{% if bloque.type == 'paragraph' %}" +
        "<p>{{ bloque.data.text | safe }}</p>" +
        // Encabezados
        "{% elif bloque.type == 'header' %}" +
        "<h2>{{ bloque.data.text | safe }}</h2>" +
        // Imagen
        "{% elif bloque.type == 'image' %}" +
        "<img src='" +
        assetsUrl +
        "/{{ bloque.data.file.fileId }}' alt='{{ bloque.data.caption | safe }}'>" +
        // Lista
        "{% elif bloque.type == 'nestedlist' %}" +
        "<ul>" +
        "{%- for item in bloque.data.items -%}" +
        "<li>{{ item.content | safe }}</li>" +
        "{%- endfor -%}" +
        "</ul>" +
        // Cita
        "{% elif bloque.type == 'quote' %}" +
        "<blockquote>{{ bloque.data.text | safe }}</blockquote>" +
        "{% endif %}" +
        "{%- endfor -%}"
    );
  });
}

module.exports = adaptar;
