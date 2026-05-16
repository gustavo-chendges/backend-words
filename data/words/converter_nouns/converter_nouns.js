const fs = require("fs");
const setWordCategory = require("../../../lib/setWordCategory")

// Ler arquivo original
const rawData = fs.readFileSync("../nouns.json", "utf-8");
const nouns = JSON.parse(rawData);

console.log(nouns)


// ID inicial
let currentId = 130;

// Converter
const converted = nouns.map(item => ({
    id: currentId++,
    word: item.word,
    translations: item.translations,
    wordClass: [item.wordClass], // vira array
    tags: [setWordCategory(item.wordClass)]
}));

// Salvar novo arquivo
fs.writeFileSync(
    "nouns_converted.json",
    JSON.stringify(converted, null, 4),
    "utf-8"
);

console.log("Arquivo convertido com sucesso!");
