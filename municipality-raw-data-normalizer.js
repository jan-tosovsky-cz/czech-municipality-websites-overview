const fs = require("fs")
const path = require("path")
const municipalityRawData = require("./data/municipality-raw-data.json")

// overriding the given Wikidata URL
const overriddenWikidataUrlMap = new Map()
// Pilsen has multiple entries for each locale so using the Czech variant here
overriddenWikidataUrlMap.set(554791, "https://www.pilsen.eu/")

// flattening the structure & replacing non-fixable Wikidata URLs
function normalize() {
    const normalizedDataMap = new Map()

    for (const data of municipalityRawData.results.bindings) {
        const id = Number(data.id.value)
        const name = data.name.value
        const url = overriddenWikidataUrlMap.has(id) ? overriddenWikidataUrlMap.get(id) : (data.wikidataURL) ? data.wikidataURL.value : null
        if (url === null) {
            console.log("The website is not specified for " + id + " [" + name + "]")
        }
        normalizedDataMap.set(id, {
            "id" : id,
            "name" : name,
            "population" : Number(data.population.value),
            "wikidataURL" : url,
            "wikidataEntityURL": data.wikidataEntityURL.value
        })
    }

    const sortedDataMap = new Map([...normalizedDataMap].sort())
    const sortedDataJSON = JSON.stringify([...sortedDataMap.values()], null, 2)
    
    fs.writeFileSync(path.resolve(__dirname, "data/municipality-data.json"), sortedDataJSON) 
}

normalize()
