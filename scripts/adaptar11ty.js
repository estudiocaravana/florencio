const fs = require("fs");
const cheerio = require("cheerio");
const globby = require("fast-glob");

(async () => {
  const assetsUrl = "https://panel.florenciodelgadogurriaran.gal/assets";

  // Borramos el contenido de la carpeta src/_layouts
  // para que no haya conflictos con los archivos que ya existen
  const webstudioDir = "webstudio/dist/client";
  const layoutsDir = "src/_layouts";
  fs.rmSync(layoutsDir, { recursive: true, force: true });
  fs.mkdirSync(layoutsDir, { recursive: true });

  const webstudioAssetsDir = "webstudio/dist/client/assets";
  const assetsDir = "src/assets";
  fs.rmSync(assetsDir, { recursive: true, force: true });
  fs.mkdirSync(assetsDir, { recursive: true });

  const siteDir = "_site";
  fs.rmSync(siteDir, { recursive: true, force: true });
  fs.mkdirSync(siteDir, { recursive: true });

  const files = await globby([webstudioDir + "/**/*.html"]);

  for (const file of files) {
    const html = fs.readFileSync(file, "utf-8");
    const $ = cheerio.load(html);

    // LISTA DE TERMOS
    $("#termos-lista").each((_, el) => {
      let modelo = $(el).children().first();
      modelo.attr("href", "/termos/termo/{{ item.termo | slug }}");
      modelo.attr(
        "data-categorias",
        "{{ item.categorias | listaIdsCategoria }}"
      );
      modelo.attr("data-campos", "{{ item.campo_semantico | listaIdsCampo }}");
      modelo.attr("data-concellos", "{{ item.ubicacion | listaConcellos }}");
      modelo.find("#termo-nome").first().html("{{ item.termo }}");
      modelo
        .find("#termo-extracto")
        .first()
        .html("{{ item.definicion | safe }}");

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

    // TERMO SINGLE
    $("#termo-single").each((_, el) => {
      const $el = $(el);

      $el.find("#termo-nome").first().html("{{ termo.termo }}");
      $el
        .find("#termo-definicion")
        .first()
        .html("{{ termo.definicion | safe }}");

      // Marca "En revisión"
      let revision = $el.find("#termo-revision").first();
      revision.replaceWith(
        "{% if termo.status == 'revision' %}" +
          revision.prop("outerHTML") +
          "{% endif %}"
      );

      // Ejemplos
      let bloqueExemplos = $el.find("#termo-bloque-exemplos").first();
      let exemplos = bloqueExemplos.find("#termo-exemplos").first();
      exemplos.html("{{ termo.exemplos | safe }}");
      bloqueExemplos.replaceWith(
        "{% if termo.exemplos %}" +
          bloqueExemplos.prop("outerHTML") +
          "{% endif %}"
      );

      // Foto
      let bloqueFoto = $el.find("#termo-bloque-foto").first();
      let foto = bloqueFoto.find("#termo-foto").first();

      let nuevaFoto = $("<img>");
      nuevaFoto.attr("src", assetsUrl + "/{{ termo.galeria[0].foto }}");
      nuevaFoto.attr("class", foto.attr("class"));
      foto.replaceWith(nuevaFoto);

      let bloqueFotoFonte = bloqueFoto.find("#termo-bloque-foto-fonte").first();
      bloqueFotoFonte.replaceWith(
        "{% if termo.galeria[0].foto_fonte %}" +
          bloqueFotoFonte.prop("outerHTML") +
          "{% endif %}"
      );
      bloqueFoto
        .find("#termo-foto-fonte")
        .first()
        .html("{{ termo.galeria[0].foto_fonte }}");

      let bloqueFotoOnde = bloqueFoto.find("#termo-bloque-foto-onde").first();
      bloqueFotoOnde.replaceWith(
        "{% if termo.galeria[0].foto_onde %}" +
          bloqueFotoOnde.prop("outerHTML") +
          "{% endif %}"
      );
      bloqueFoto
        .find("#termo-foto-onde")
        .first()
        .html("{{ termo.galeria[0].foto_onde }}");

      let bloqueFotoQue = bloqueFoto.find("#termo-bloque-foto-que").first();
      bloqueFotoQue.replaceWith(
        "{% if termo.galeria[0].foto_que %}" +
          bloqueFotoQue.prop("outerHTML") +
          "{% endif %}"
      );
      bloqueFoto
        .find("#termo-foto-que")
        .first()
        .html("{{ termo.galeria[0].foto_que }}");

      let bloqueFotoAutoria = bloqueFoto
        .find("#termo-bloque-foto-autoria")
        .first();
      bloqueFotoAutoria.replaceWith(
        "{% if termo.galeria[0].foto_autoria %}" +
          bloqueFotoAutoria.prop("outerHTML") +
          "{% endif %}"
      );
      bloqueFoto
        .find("#termo-foto-autoria")
        .first()
        .html("{{ termo.galeria[0].foto_autoria }}");

      bloqueFoto.replaceWith(
        "{% if termo.galeria | length %}" +
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
        "{% if termo.audios | length %}" +
          "{%- for audio in termo.audios -%}\n" +
          bloqueAudio.prop("outerHTML") +
          "{%- endfor -%}" +
          "{% endif %}"
      );

      // Ficha
      let bloqueFicha = $el.find("#termo-bloque-ficha").first();

      let bloqueCategorias = bloqueFicha
        .find("#termo-bloque-categoria")
        .first();
      bloqueCategorias
        .find("#termo-categoria")
        .first()
        .html("{{ termo.categorias | listaCategoria }}");
      bloqueCategorias.replaceWith(
        "{% if termo.categorias | length %}" +
          bloqueCategorias.prop("outerHTML") +
          "{% endif %}"
      );

      let bloqueCampos = bloqueFicha.find("#termo-bloque-campo").first();
      bloqueCampos
        .find("#termo-campo")
        .first()
        .html("{{ termo.campo_semantico | listaCampo }}");
      bloqueCampos.replaceWith(
        "{% if termo.campo_semantico | length %}" +
          bloqueCampos.prop("outerHTML") +
          "{% endif %}"
      );

      bloqueFicha.replaceWith(
        "{% if termo.categorias | length or termo.campo_semantico | length %}" +
          bloqueFicha.prop("outerHTML") +
          "{% endif %}"
      );

      // Informantes
      let bloqueInformantes = $el.find("#termo-bloque-informantes").first();
      bloqueInformantes
        .find("#termo-informantes")
        .first()
        .html(
          "{%- for informante in termo.informantes -%}" +
            "{{ informante | informante }}<br>" +
            "{%- endfor -%}"
        );
      bloqueInformantes.replaceWith(
        "{% if termo.informantes | length %}" +
          bloqueInformantes.prop("outerHTML") +
          "{% endif %}"
      );

      // Mapa
      let bloqueUbicacion = $el.find("#termo-bloque-localizacion").first();
      bloqueUbicacion.replaceWith(
        "{% if termo.ubicacion | length %}" +
          bloqueUbicacion.prop("outerHTML") +
          "{% endif %}"
      );
      $el
        .find("#termo-localizacion")
        .first()
        .html("{{ termo.ubicacion | listaUbicacion }}");
      $el
        .find("#termo-mapa")
        .first()
        .html(
          "{% if termo.ubicacion | length %}" +
            '<div id="termo-mapa-iframe"></div>' +
            "{% endif %}"
        );

      $("head").append(
        "<script>\n" +
          "  const ubicacion = {{ termo.ubicacion | stringify | safe }};\n" +
          "</script>"
      );

      // Argumentario
      let bloqueArgumentario = $el.find("#termo-bloque-argumentario").first();
      let argumentario = bloqueArgumentario.find("#termo-argumentario").first();
      argumentario.html("{{ termo.argumentario | safe }}");
      bloqueArgumentario.replaceWith(
        "{% if termo.argumentario %}" +
          bloqueArgumentario.prop("outerHTML") +
          "{% endif %}"
      );
    });

    // Añadimos el css y el js del diccionario donde corresponda
    $("head").append(
      '<link rel="stylesheet" type="text/css" href="{{ \'/_assets/css/dicionario.css\' | url }}">'
    );
    $("body").append(
      '<script type="module" src="{{ \'/_assets/js/dicionario.js\' | url }}"></script>'
    );
    // También el js de google maps
    $("head").append(
      "<script>\n" +
        '(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({\n' +
        'key: "AIzaSyBVOKF2PVPBE0a5ZwP9A-MAdLsJyXYSxeI",\n' +
        'v: "weekly",\n' +
        "});\n" +
        "</script>\n"
    );

    // Escribimos el contenido de la plantilla en un archivo
    // con el mismo nombre y en las mismas subcarpetas
    // pero dentro de la carpeta src/_layouts
    const outputPath = file.replace(webstudioDir, layoutsDir);
    const outputDir = outputPath.substring(0, outputPath.lastIndexOf("/"));
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(outputPath, $.html(), "utf-8");
    console.log(`Archivo ${outputPath} creado.`);
  }

  // Copiamos los assets dentro de webstudio/assets a src/assets
  // excepto el javascript que genera webstudio
  const assets = await globby([
    webstudioAssetsDir + "/**/*",
    "!" + webstudioAssetsDir + "/chunks/**",
    "!" + webstudioAssetsDir + "/entries/**",
  ]);
  for (const asset of assets) {
    const outputPath = asset.replace(webstudioAssetsDir, assetsDir);
    const outputDir = outputPath.substring(0, outputPath.lastIndexOf("/"));
    fs.mkdirSync(outputDir, { recursive: true });
    fs.copyFileSync(asset, outputPath);
    console.log(`Archivo ${outputPath} creado.`);
  }
})();
