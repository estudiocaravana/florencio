const fs = require("fs");
const showdown = require("showdown");
const globby = require("fast-glob");
const matter = require("gray-matter"); // You'll need to install this package

(async () => {
  try {
    const converter = new showdown.Converter();

    // Get all md files in contenidos folder
    const mdFiles = await globby("contenidos/**/*.md");

    // Get the categoria and campo possible values from categoria.json and campo_semantico.json
    // and index them by nome
    const categorias = JSON.parse(
      fs.readFileSync("scripts/categoria.json", "utf-8")
    );
    const categoriasIndex = {};
    for (const categoria of categorias) {
      categoriasIndex[categoria.nome] = categoria.id;
    }
    const campos = JSON.parse(
      fs.readFileSync("scripts/campo_semantico.json", "utf-8")
    );
    const camposIndex = {};
    for (const campo of campos) {
      camposIndex[campo.nome] = campo.id;
    }

    // Array to store all parsed content
    const contents = [];

    // Process each file
    for (const file of mdFiles) {
      const fileContent = fs.readFileSync(file, "utf-8");
      const { data: metadata, content } = matter(fileContent);

      contents.push({
        termo: metadata.termo ? metadata.termo.trim() : "",
        definicion: metadata.definicion ? metadata.definicion.trim() : "",
        exemplos: metadata.exemplo ? metadata.exemplo.trim() : "",
        argumentario: converter.makeHtml(content.trim()),
        status: metadata.revision ? "revision" : "published",
        // categorias: metadata.categoria
        //   ? metadata.categoria
        //       .split(",")
        //       .map((cat) => cat.trim())
        //       .map((cat) => categoriasIndex[cat])
        //   : [],
        // campo_semantico: metadata.campo
        //   ? metadata.campo
        //       .split(",")
        //       .map((c) => c.trim())
        //       .map((c) => (camposIndex[c] ? camposIndex[c] : ""))
        //   : "",
      });
    }

    // Write the result to a JSON file
    fs.writeFileSync(
      "contenidos.json",
      JSON.stringify(contents, null, 2),
      "utf-8"
    );

    console.log(`Processed ${mdFiles.length} files`);
  } catch (error) {
    console.error("Error processing files:", error);
  }
})();
