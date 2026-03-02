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
const headers = [
  "searchTerm",
  "title",
  "description",
  "canonical",
  "promotionalText",
  "delete"
];

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
  const canonical = item.canonicalUrl || "";
  const searchTerm = canonical.split("/").filter(Boolean).pop() || "";

  let promotionalText = item.promotionalText || "";
  promotionalText = promotionalText.charAt(0).toUpperCase() + promotionalText.slice(1);
  const promotionalTextArray = promotionalText.split("\n");
  promotionalTextArray[0] = `<h2>${promotionalTextArray[0]}</h2>`;
  promotionalText = promotionalTextArray.join("<br>").replace('</h2><br><br>', '</h2>');

  return [
    searchTerm,
    item.title || "",
    item.description || "",
    canonical,
    promotionalText,
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
