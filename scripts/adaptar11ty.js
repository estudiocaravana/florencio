const fs = require("fs");
const cheerio = require("cheerio");
const globby = require("fast-glob");

(async () => {
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
      modelo.find("#termo-nome").first().html("{{ item.termo }}");
      modelo.find("#termo-extracto").first().html("{{ item.definicion }}");

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

    // TERMO SINGLE
    $("#termo-single").each((_, el) => {
      const $el = $(el);

      $el.find("#termo-nome").first().html("{{ termo.termo }}");
      $el
        .find("#termo-mapa")
        .first()
        .html('<div id="termo-mapa-iframe"></div>');

      $("head").append(
        "<script>\n" +
          "  const ubicacion = {{ termo.ubicacion | stringify | safe }};\n" +
          "</script>"
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
