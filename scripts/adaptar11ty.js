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

    $("#termos-lista").each((_, el) => {
      let modelo = $(el).children().first();
      modelo.attr("href", "/termos/termo/{{ item.termo | slug }}");
      modelo.find("div").first().html("{{ item.termo }}");
      modelo.find("div").first().next().html("{{ item.definicion }}");

      const bucle =
        "{%- for item in termos -%}\n" +
        modelo.prop("outerHTML") +
        "      {%- endfor -%}";
      $(el).html(bucle);
    });

    $("#termo-nome").each((_, el) => {
      const nome = "{{ termo.termo }}";
      $(el).html(nome);
    });

    if (file === "webstudio/termos/termo/index.html") {
      $("head").append(
        "<style>\n" + "#map {\n" + "height: 300px;\n" + "}\n" + "</style>\n"
      );
      $("body").append('<div id="map"></div>');
      $("body").append(
        "<script>\n" +
          '(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({\n' +
          'key: "AIzaSyBVOKF2PVPBE0a5ZwP9A-MAdLsJyXYSxeI",\n' +
          'v: "weekly",\n' +
          "});\n" +
          "</script>\n"
      );
      $("body").append(
        "<script>\n" +
          "  const ubicacion = {{ termo.ubicacion | stringify | safe }};\n" +
          "let map;\n" +
          "async function initMap() {\n" +
          "const centro = { lat: 42.3498369, lng: -6.9703849 };\n" +
          'const { Map } = await google.maps.importLibrary("maps");\n' +
          'const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");\n' +
          'map = new Map(document.getElementById("map"), {\n' +
          "zoom: 10,\n" +
          "center: centro,\n" +
          'mapId: "ubicaciones",\n' +
          "});\n" +
          "for (const u of ubicacion) {\n" +
          'const coordenadas = u.lugar_id.coordenadas.split(",");\n' +
          "const posicion = { lat: parseFloat(coordenadas[0]), lng: parseFloat(coordenadas[1]) };\n" +
          "const marker = new AdvancedMarkerElement({\n" +
          "map: map,\n" +
          "position: posicion,\n" +
          'title: "Valdeorras",\n' +
          "});\n" +
          "const infoWindow = new google.maps.InfoWindow({\n" +
          "content: `<div class='info-window'>\n" +
          "  <h2>${u.lugar_id.nome}</h2>\n" +
          "</div>`,\n" +
          "});\n" +
          "marker.addListener('click', () => {\n" +
          "  infoWindow.open(map, marker);\n" +
          "});\n" +
          "}\n" +
          "}\n" +
          "initMap();\n" +
          "</script>"
      );
    }

    // Añadimos el script de diccionario.js al final del body
    $("body").append(
      '<script type="module" src="{{ \'/_assets/js/dicionario.js\' | url }}"></script>'
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
  const assets = await globby([webstudioAssetsDir + "/**/*"]);
  for (const asset of assets) {
    const outputPath = asset.replace(webstudioAssetsDir, assetsDir);
    const outputDir = outputPath.substring(0, outputPath.lastIndexOf("/"));
    fs.mkdirSync(outputDir, { recursive: true });
    fs.copyFileSync(asset, outputPath);
    console.log(`Archivo ${outputPath} creado.`);
  }
})();
