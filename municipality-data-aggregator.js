const fs = require("fs")
const path = require("path")
const municipalityData = require("./data/municipality-data.json")
const municipalityAggregatedDataPath = path.resolve(__dirname, "data/municipality-aggregated-data.json")
const urlRedirectionsMap = new Map(require("./data/municipality-website-url-redirections-map.json"))
const cmsMap = new Map(require("./data/cms-map.json"))

const aggregatedData = []
for (const data of municipalityData) {
    data.url = urlRedirectionsMap.has(data.id) ? urlRedirectionsMap.get(data.id) : data.wikidataURL
    data.cms = cmsMap.has(data.id) ? cmsMap.get(data.id) : null
    aggregatedData.push(data)
}

const aggregatedDataJSON = JSON.stringify(aggregatedData, null, 2)
fs.writeFileSync(municipalityAggregatedDataPath, aggregatedDataJSON)
