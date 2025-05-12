const fs = require("fs");
const cheerio = require("cheerio");
const globby = require("fast-glob");

(async () => {
  // Borramos el contenido de la carpeta src/_layouts
  // para que no haya conflictos con los archivos que ya existen
  const layoutsDir = "src/_layouts/dicionario";
  fs.rmSync(layoutsDir, { recursive: true, force: true });
  fs.mkdirSync(layoutsDir, { recursive: true });

  const assetsDir = "src/assets";
  fs.rmSync(assetsDir, { recursive: true, force: true });
  fs.mkdirSync(assetsDir, { recursive: true });

  const siteDir = "_site";
  fs.rmSync(siteDir, { recursive: true, force: true });
  fs.mkdirSync(siteDir, { recursive: true });

  const files = await globby(["webstudio/**/*.html"]);

  for (const file of files) {
    const html = fs.readFileSync(file, "utf-8");
    const $ = cheerio.load(html);

    $("#termos-lista").each((_, el) => {
      let modelo = $(el).children().first();
      modelo.attr("href", "/dicionario/termos/{{ item.termo | slug }}");
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

    // // Borramos todos los elementos script y link que llamen a las carpetas /assets/entries y /assets/chunks
    // $("script[src*='/assets/entries']").remove();
    // $("link[href*='/assets/entries']").remove();
    // $("script[src*='/assets/chunks']").remove();
    // $("link[href*='/assets/chunks']").remove();

    // Añadimos el script de diccionario.js al final del body
    $("body").append(
      '<script type="module" src="{{ \'/_assets/js/dicionario.js\' | url }}"></script>'
    );

    // Escribimos el contenido de la plantilla en un archivo
    // con el mismo nombre y en las mismas subcarpetas
    // pero dentro de la carpeta src/_layouts
    const outputPath = file.replace("webstudio", layoutsDir);
    const outputDir = outputPath.substring(0, outputPath.lastIndexOf("/"));
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(outputPath, $.html(), "utf-8");
    console.log(`Archivo ${outputPath} creado.`);
  }

  // Copiamos los assets dentro de webstudio/assets a src/assets, excluyendo las subcarpetas chunks y entries
  const assets = await globby([
    "webstudio/assets/**/*",
    // "!webstudio/assets/chunks/**",
    // "!webstudio/assets/entries/**",
  ]);
  for (const asset of assets) {
    const outputPath = asset.replace("webstudio/assets", assetsDir);
    const outputDir = outputPath.substring(0, outputPath.lastIndexOf("/"));
    fs.mkdirSync(outputDir, { recursive: true });
    fs.copyFileSync(asset, outputPath);
    console.log(`Archivo ${outputPath} creado.`);
  }
})();
