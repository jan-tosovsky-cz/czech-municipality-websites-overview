const fs = require("fs")
const path = require("path")
const { Readable } = require("stream")
const { finished } = require("stream/promises")

const query = `SELECT DISTINCT (REPLACE(STR(?lua), "CZ", "") as ?id) ?name ?population (?website as ?wikidataURL) (?item as ?wikidataEntityURL) WHERE {
    SERVICE wikibase:label {
      bd:serviceParam wikibase:language "cs".
      ?website rdfs:label ?name.
    }
    OPTIONAL {
      # Select Municipalites with propper RÚIAN
      { ?item wdt:P31 wd:Q5153359; wdt:P7606 ?lua;  . }  
      UNION
      # as some of them don't have it, select Municipalities with Czech LUA (NUTS4)
      # !!! beware that in some cases data marked as LUA are districts
      #  => select only LUA with length greater then RUIAN ("CZxxxxxx")
      { ?item wdt:P31 wd:Q5153359; wdt:P782 ?lua . FILTER (STRLEN(STR(?lua)) > 6) }
    }
    OPTIONAL { ?item rdfs:label ?name . }
    OPTIONAL { ?item wdt:P856 ?website . }
    OPTIONAL { ?item wdt:P1082 ?population . }
    FILTER (lang(?name) = "cs").
  }`

async function saveQueryResult(outputPath) {
  const url = "https://query.wikidata.org/sparql?query=" + encodeURIComponent(query)
  const headers = { "Accept": "application/sparql-results+json" }

  const response = await fetch(url, { headers })
  const fileStream = fs.createWriteStream(outputPath)
  await finished(Readable.fromWeb(response.body).pipe(fileStream))
}

saveQueryResult(path.resolve(__dirname, "data/municipality-raw-data.json"))
