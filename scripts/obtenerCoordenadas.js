/**
 * Obtiene coordenadas de direcciones de lugares de Valdeorras usando la API de Google Maps.
 */

require("dotenv").config(); // Carga variables del .env
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const API_KEY = process.env.GOOGLE_API_KEY;

// Leer direcciones desde el archivo JSON
function cargarDirecciones() {
  const archivo = "scripts/lugares.json";
  try {
    const data = fs.readFileSync(archivo, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error(
      "❌ No se pudo leer el archivo direcciones.json:",
      err.message
    );
    return [];
  }
}

// Geocodificar una sola dirección
async function geocode(direccion) {
  const textoDireccion =
    direccion.nome + "," + direccion.concello + ", Ourense, España";

  console.log("Geocodificando:", textoDireccion);

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    textoDireccion
  )}&key=${API_KEY}`;
  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.status === "OK") {
      const location = data.results[0].geometry.location;
      const resultado = {
        nome: direccion.nome,
        concello: direccion.concello,
        coordenadas: location.lat + "," + location.lng,
      };
      //console.log(resultado);
      return resultado;
    } else {
      console.error(
        `❌ Geocodificación fallida para "${direccion}": ${data.status}`
      );
      return null;
    }
  } catch (error) {
    console.error(`❌ Error al geocodificar "${direccion}": ${error.message}`);
    return null;
  }
}

// Procesar todas las direcciones
async function procesarDirecciones() {
  const direcciones = cargarDirecciones();
  if (direcciones.length === 0) {
    console.error("⚠️ No hay direcciones para procesar.");
    return;
  }

  const resultados = [];

  for (const direccion of direcciones) {
    const resultado = await geocode(direccion);
    if (resultado) {
      resultados.push(resultado);
    }
    await new Promise((resolve) => setTimeout(resolve, 200)); // Evitar rate limits
  }

  fs.writeFileSync(
    "scripts/lugaresConCoordenadas.json",
    JSON.stringify(resultados, null, 2),
    "utf-8"
  );
  console.log("✅ Coordenadas guardadas en coordenadas.json");
}

procesarDirecciones();
