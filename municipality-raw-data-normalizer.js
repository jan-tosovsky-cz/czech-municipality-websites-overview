const fs = require("fs")
const path = require("path")
const municipalityRawData = require("./data/municipality-raw-data.json")

// overriding the given Wikidata URL
const overriddenWikidataUrlMap = new Map()
// Pilsen has multiple entries for each locale so using the Czech variant here
overriddenWikidataUrlMap.set(554791, "https://www.pilsen.eu/")

// these entries should be updated directly in Wikidata
overriddenWikidataUrlMap.set(513580, "https://www.hudcice.cz/")
overriddenWikidataUrlMap.set(510645, "https://www.obeckojatin.cz/")
overriddenWikidataUrlMap.set(595756, "https://www.obec-jamy.cz/")
overriddenWikidataUrlMap.set(531405, "https://www.kobylnice-kh.cz/")
overriddenWikidataUrlMap.set(532461, "https://www.klobuky.cz/")
overriddenWikidataUrlMap.set(564117, "https://www.chrastava.eu/")
overriddenWikidataUrlMap.set(587419, "https://www.kostelnimyslova.cz/")
overriddenWikidataUrlMap.set(587800, "https://www.obecrozsec.cz/")
overriddenWikidataUrlMap.set(546623, "https://www.lasenice.cz/")
overriddenWikidataUrlMap.set(529907, "https://www.obeckeblov.cz/")
overriddenWikidataUrlMap.set(578932, "https://obecvendoli.cz/")
overriddenWikidataUrlMap.set(532541, "https://tomice.cz/")
overriddenWikidataUrlMap.set(574295, "https://www.novy-ples.cz/")
overriddenWikidataUrlMap.set(513482, "https://www.obecvysokyujezd.cz/")
overriddenWikidataUrlMap.set(530719, "http://www.obecstudeny.cz/")
overriddenWikidataUrlMap.set(514527, "https://www.lhotkauprerova.cz/")
overriddenWikidataUrlMap.set(535567, "https://brezina-nad-jizerou.cz/")
overriddenWikidataUrlMap.set(580341, "http://hrusova.cz/")
overriddenWikidataUrlMap.set(532606, "https://www.obecchoratice.cz/")
overriddenWikidataUrlMap.set(577600, "https://www.obectroskovice.cz/")
overriddenWikidataUrlMap.set(581127, "http://www.vlckov.eu/")
overriddenWikidataUrlMap.set(565661, "https://www.ritonice.cz/")
overriddenWikidataUrlMap.set(565571, "https://www.obec-vlkava.cz/")
overriddenWikidataUrlMap.set(549312, "https://www.kacakovalhota.cz/")
overriddenWikidataUrlMap.set(571032, "https://www.obec-pecice.cz/")
overriddenWikidataUrlMap.set(577685, "https://www.vysker.cz/")
overriddenWikidataUrlMap.set(570818, "https://obecdalovice.cz/")
overriddenWikidataUrlMap.set(536211, "https://lhotky.e-obec.info/")
overriddenWikidataUrlMap.set(564516, "https://vlastiborice.cz/")
overriddenWikidataUrlMap.set(553905, "https://www.mrlinek.eu/")
overriddenWikidataUrlMap.set(593958, "https://www.obecdolenice.cz/") // Galileo -> Joomla
overriddenWikidataUrlMap.set(594181, "https://www.jamolice.cz/")
overriddenWikidataUrlMap.set(558966, "https://www.chrast.net/")
overriddenWikidataUrlMap.set(546429, "https://www.obec-chraberce.cz/")
overriddenWikidataUrlMap.set(535745, "https://domousnice.cz/")
overriddenWikidataUrlMap.set(534927, "https://www.dubicko.cz/")
overriddenWikidataUrlMap.set(540234, "https://www.lukavicenamorave.cz/")
overriddenWikidataUrlMap.set(561134, "https://www.plana.cz/")
overriddenWikidataUrlMap.set(541192, "https://www.obecnevid.cz/")
overriddenWikidataUrlMap.set(553611, "https://www.litohlavy.cz/")
overriddenWikidataUrlMap.set(559741, "https://www.obecbujesily.cz/")
overriddenWikidataUrlMap.set(559849, "https://www.hurkyurokycan.cz/")
overriddenWikidataUrlMap.set(578444, "https://www.moravskatrebova.cz/")
overriddenWikidataUrlMap.set(588849, "https://www.obecpaclavice.cz/")
overriddenWikidataUrlMap.set(538914, "https://www.mestyslaznetousen.cz/")
overriddenWikidataUrlMap.set(583235, "https://www.kratochvilka.cz/")
overriddenWikidataUrlMap.set(550841, "https://www.jiriceumb.cz/")
overriddenWikidataUrlMap.set(525804, "https://obecbohdikov.cz/")
overriddenWikidataUrlMap.set(529869, "https://www.obecdul.cz/") // Vismo -> Drupal
overriddenWikidataUrlMap.set(562289, "https://www.vojnikov.cz/")
overriddenWikidataUrlMap.set(539104, "https://bojanovice.cz/")
overriddenWikidataUrlMap.set(568392, "https://www.obecdoloplazy.cz/")
overriddenWikidataUrlMap.set(579017, "https://kakejcov.rokycansko.cz/")
overriddenWikidataUrlMap.set(596213, "https://www.novaveszr.cz/")
overriddenWikidataUrlMap.set(599069, "https://www.mesto-orlova.cz/")
overriddenWikidataUrlMap.set(593745, "https://www.bezkov.cz/")
overriddenWikidataUrlMap.set(576701, "https://www.rokytnicevoh.cz/")
overriddenWikidataUrlMap.set(564567, "https://www.litomerice.cz/")
overriddenWikidataUrlMap.set(594776, "https://www.obecslatina.net/")
overriddenWikidataUrlMap.set(565415, "https://www.obecpodsedice.cz/")
overriddenWikidataUrlMap.set(591904, "https://www.mestysvladislav.cz/")
overriddenWikidataUrlMap.set(532436, null)
overriddenWikidataUrlMap.set(532649, null)

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
