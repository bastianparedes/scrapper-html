const fs = require("fs");
const path = require("path");

// Rutas de archivos
const file1 = path.join(__dirname, "urls-mx-1.txt");
const file2 = path.join(__dirname, "urls-mx-2.txt");
const output = path.join(__dirname, "urls-mx.txt");

// Leer archivos
const data1 = fs.readFileSync(file1, "utf8");
const data2 = fs.readFileSync(file2, "utf8");

// Separar por líneas y limpiar
const lines1 = data1.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
const lines2 = data2.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

// Mezclar sin duplicados
const uniqueLines = [...new Set([...lines1, ...lines2])];

// Escribir archivo final
fs.writeFileSync(output, uniqueLines.join("\n"), "utf8");

console.log("Archivo resultado.txt creado correctamente");
