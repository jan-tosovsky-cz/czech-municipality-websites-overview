const fs = require("fs/promises")
const path = require("path")
const municipalityData = require("./data/municipality-data.json")
const baseFolderPath = path.resolve(__dirname, "data/municipality-website-homepage-content")
const keyword = "http-equiv=\"refresh\""

async function searchForKeyword(homepageContentPath, id) {
    try {
        const stats = await fs.stat(homepageContentPath);
        if (stats.size > 0) {
            const homepageContent = await fs.readFile(homepageContentPath, "utf-8")
            const position = homepageContent.indexOf(keyword)
            if (position > -1) {
                console.log(id + ": " + homepageContent.substring(position - 20, position + 20))
            }
        }
    } catch (error) { }
}

async function processAllEntries() {
    await Promise.all(municipalityData.map(async (data) => {
        const homepageContentPath = path.resolve(baseFolderPath, data.id + ".html")
        searchForKeyword(homepageContentPath, data.id)
    }))
}

processAllEntries()
