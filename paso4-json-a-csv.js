const fs = require("fs");
const path = require("path");
const config = require('./paso1.config.json');

// Archivos
const inputFile = path.resolve(`data-${config.regionCode}.json`);
const outputFile = path.resolve(`output-${config.regionCode}.csv`);

// Leer JSON
const rawData = fs.readFileSync(inputFile, "utf8");
const data = JSON.parse(rawData);

// Headers CSV
const headers = Object.keys(data[0]);

// Función para escapar valores CSV
const escapeCsv = (value) => {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes('"') || str.includes(",") || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

// Procesar filas
const rows = data.map(item => {
  return [
    item.pageId,
    item.title || "",
    item.description || "",
    item.canonical,
    item.promotionalText,
    'false'
  ].map(escapeCsv).join(",");
});

// Construir CSV
const csvContent = [
  headers.join(","),
  ...rows
].join("\n");

// Escribir archivo
fs.writeFileSync(outputFile, csvContent, "utf8");

console.log("CSV generado:", outputFile);
