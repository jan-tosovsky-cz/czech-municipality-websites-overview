const fs = require("fs")
const path = require("path")
const municipalityAggregatedData = require("./data/municipality-aggregated-data.json")
const csvPath = path.resolve(__dirname, "data/municipality-aggregated-data.csv")

const headers = [
    "RÚIAN kód", 
    "Název", 
    "Počet obyvatel", 
    "CMS", 
    "URL", 
    "Wikidata URL", 
    "Wikidata Entity URL"
]

function getWrapped(value) {
    return "\"" + value + "\""
}

const cvsStream = fs.createWriteStream(csvPath);
// BOM
cvsStream.write("\ufeff")
// Header
cvsStream.write("\"" + headers.join("\";\"") + "\"\n")

for (const data of municipalityAggregatedData) {
    const fields = [
        data.id, 
        getWrapped(data.name), 
        data.population,
        getWrapped(data.cms), 
        getWrapped(data.url),
        getWrapped(data.wikidataURL),
        getWrapped(data.wikidataEntityURL)
    ]
    cvsStream.write(fields.join(";") + "\n");
}

cvsStream.close();

