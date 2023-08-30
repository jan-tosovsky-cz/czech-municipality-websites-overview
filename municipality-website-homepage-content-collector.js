const fs = require("fs")
const { stat } = require("fs/promises")
const path = require("path")
const { Readable } = require("stream")
const { finished } = require("stream/promises")
const municipalityData = require("./data/municipality-data.json")
const redirectionMapPath = path.resolve(__dirname, "data/municipality-website-url-redirections-map.json")
const baseFolderPath = path.resolve(__dirname, "data/municipality-website-homepage-content")
const headers = { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36" }

const manualRedirectMap = new Map()
manualRedirectMap.set(504921, "https://obectribrichy.cz/w/")
manualRedirectMap.set(529591, "https://www.sedlec.org/old/index.html")
manualRedirectMap.set(529753, "https://divcikopy.cz/w/")
manualRedirectMap.set(530107, "https://www.lounovicepodblanikem.cz/uvod.php")
manualRedirectMap.set(530549, "https://www.obec-rataje.cz/wp/")
manualRedirectMap.set(534234, "http://www.obecvinarice.info/vinarice.php?page=uvod")
manualRedirectMap.set(540722, "https://smedcice.cz/wordpress/")
manualRedirectMap.set(546411, "https://obecuherce.cz/w/")
manualRedirectMap.set(547131, "https://svatonovice.cz/w/")
manualRedirectMap.set(548871, "https://www.petrovicky.info/index.php")
manualRedirectMap.set(551465, "https://www.kosice-kh.cz/obec/aktuality/")
manualRedirectMap.set(551775, "https://obecstrasice.cz/w")
manualRedirectMap.set(554162, "http://www.obeccrhov.cz/home")
manualRedirectMap.set(555185, "https://mestohroznetin.cz/w")
manualRedirectMap.set(560308, "https://obecbublava.cz/w/")
manualRedirectMap.set(562378, "https://www.obecstankov.cz/")
manualRedirectMap.set(564036, "https://obechabartice.cz/w/")
manualRedirectMap.set(564851, "http://www.obechorniberkovice.cz/obec/")
manualRedirectMap.set(567841, "https://www.obec-svetec.cz/w/")
manualRedirectMap.set(571253, "http://www.ctetin.cz/ure.html")
manualRedirectMap.set(571806, "http://www.novavesubakova.cz/category/aktuality/")
manualRedirectMap.set(572152, "http://www.obecrana.cz/category/nezarazene/")
manualRedirectMap.set(573281, "http://www.ostruzno.cz/html/uvod.htm")
manualRedirectMap.set(576816, "https://synkov-slemeno.cz/w/")
manualRedirectMap.set(578843, "https://mestyssvojanov.cz/w/")
manualRedirectMap.set(581810, "https://www.krtenov.cz/home")
manualRedirectMap.set(581941, "http://www.lhotauolesnice.cz/home")
manualRedirectMap.set(582107, "http://www.nyrov.cz/home")
manualRedirectMap.set(582280, "http://rozsicka.cz/home")
manualRedirectMap.set(582417, "http://www.sulikov.cz/home")
manualRedirectMap.set(582506, "https://www.obec-tasovice.cz/home")
manualRedirectMap.set(583804, "https://www.obecrudka.cz/w/")
manualRedirectMap.set(586269, "https://www.knezdub.cz/w/")
manualRedirectMap.set(588059, "https://obecracin.cz/w/")
manualRedirectMap.set(589110, "https://obecuhrice.cz/w/")
manualRedirectMap.set(595535, "http://www.dolni-rozinka.cz/w1/")
manualRedirectMap.set(595829, "https://www.obeckadov.cz/category/nezarazene/")
manualRedirectMap.set(596248, "http://novesady.cz/www/")

async function isProcessed(homepageContentPath) {
    try {
        const stats = await stat(homepageContentPath)
        return stats.size > 0

    } catch (error) {
        return false
    }
}

async function processRemainingWebsites(redirectionMap) {
    for (const data of municipalityData) {
        // skip entries causing Node.js termination, see https://github.com/nodejs/node/issues/49233
        if (data.id === 594440 || data.id === 579262) {
            continue
        }
        try {
            const homepageContentPath = path.resolve(baseFolderPath, data.id + ".html")
            const processed = await isProcessed(homepageContentPath)
            if (!processed) {
                
                if (data.wikidataURL) {
                    const url = manualRedirectMap.has(data.id) ? manualRedirectMap.get(data.id) : data.wikidataURL
                    try {
                        const fileStream = fs.createWriteStream(homepageContentPath)
                        const response = await fetch(url, { headers })
                        if (response.url !== data.wikidataURL) {
                            redirectionMap.set(data.id, response.url)
                            console.log(data.id + "|" + data.wikidataURL + "|" + response.url)
                        }
                        await finished(Readable.fromWeb(response.body).pipe(fileStream))
                        fileStream.close()

                    } catch (err) {
                        console.log("Loading the homepage content for " + data.wikidataURL + " [" + data.name + "] has failed: " + err.cause)
                    }
                } else {
                    console.log("Loading the homepage content for ID " + data.id + " [" + data.name + "] has failed: No URL is specified.")
                }
            }
        } catch (err) {
            console.log(err)
        }
    }
}

function getRedirectionMap() {
    if (fs.existsSync(redirectionMapPath)) {
        const content = fs.readFileSync(redirectionMapPath, "utf-8")
        if (content.length > 0 && content !== "[]") {
            return new Map(JSON.parse(content))
        }
    }
    return new Map()
}

const redirectionMap = getRedirectionMap()

if (!fs.existsSync(baseFolderPath)) {
    fs.mkdirSync(baseFolderPath)
}

// disabling certificates validation
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
processRemainingWebsites(redirectionMap).then(() => {
    const sortedRedirectionMap = new Map([...redirectionMap].sort())
    const sortedRedirectionJSON = JSON.stringify([...sortedRedirectionMap], null, 2)
    fs.writeFileSync(redirectionMapPath, sortedRedirectionJSON)
})
