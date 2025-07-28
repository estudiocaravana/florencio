/**
 * Adapta los archivos HTML generados por Webstudio a los layouts de 11ty.
 *
 * Para ello, busca identificadores definidos en los componentes de Webstudio y los reemplaza por
 * los plantillas de 11ty.
 */

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

    // Sustituimos la etiqueta meta og:image con el logo de la web

    $("meta[property='og:url']").attr(
      "content",
      "https://dicionario.florenciodelgadogurriaran.gal{{ page.url }}"
    );

    $("meta[property='og:image']").attr(
      "content",
      "{{ '/_assets/img/rrss.png' | url }}"
    );

    $("head").append(
      '<meta name="google-site-verification" content="MSsooqjcEmXehcdemvSle1r2DVUvba6vPtzGWx0vsi0" />'
    );

    $("head").append('<meta name="robots" content="index, follow">');

    $("head").append(
      '<link rel="canonical" href="https://dicionario.florenciodelgadogurriaran.gal{{ page.url }}">'
    );

    // Borramos el "script type="application/ld+json" que está dando problemas
    $("script[type='application/ld+json']").remove();

    // Adaptamos los distintos tipos de contenidos de la web

    // HOME
    const adaptarHome = require("./adaptadores/home.js");
    adaptarHome($, assetsUrl);

    // LISTA DE TERMOS
    const adaptarTermos = require("./adaptadores/termos.js");
    adaptarTermos($, assetsUrl);

    // TERMO SINGLE
    const adaptarTermo = require("./adaptadores/termo.js");
    adaptarTermo($, assetsUrl);

    // LISTA DE REFRÁNS
    const adaptarRefrans = require("./adaptadores/refrans.js");
    adaptarRefrans($, assetsUrl);

    // REFRÁN SINGLE
    const adaptarRefran = require("./adaptadores/refran.js");
    adaptarRefran($, assetsUrl);

    // NOVO TERMO
    const adaptarNovoTermo = require("./adaptadores/novo-termo.js");
    adaptarNovoTermo($, assetsUrl);

    // LISTA DE ARTIGOS
    const adaptarArtigos = require("./adaptadores/artigos.js");
    adaptarArtigos($, assetsUrl);

    // ARTIGO SINGLE
    const adaptarArtigo = require("./adaptadores/artigo.js");
    adaptarArtigo($, assetsUrl);

    // Añadimos el css y el js del diccionario donde corresponda
    $("head").append(
      '<link rel="stylesheet" type="text/css" href="{{ \'/_assets/tom-select.css\' | url }}">'
    );
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
