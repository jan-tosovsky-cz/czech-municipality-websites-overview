const fs = require("fs/promises")
const path = require("path")
const municipalityData = require("./data/municipality-data.json")
const baseFolderPath = path.resolve(__dirname, "data/municipality-website-homepage-content")

const cmsKeywordsMap = new Map()

// CMSs tailored for munucipalities
cmsKeywordsMap.set("Webhouse (Vismo)", ["/vismo"])
cmsKeywordsMap.set("Galileo", ["igalileo", "Galileo Corporation"])
cmsKeywordsMap.set("Antee (IPO)", ["Antee"])
cmsKeywordsMap.set("Public4U", ["public4u", "Public4u"])
cmsKeywordsMap.set("Obce na Webu", ["obcenawebu"])
cmsKeywordsMap.set("CMS-OBCE", ["CMS-OBCE"])
cmsKeywordsMap.set("WRS", ["W Partner s.r.o."])
cmsKeywordsMap.set("ECHOpix CMS", ["macms-root", "echopix"])

// Municipality websites created with the help of EU funds
cmsKeywordsMap.set("Medializujeme Česko (Obce 2020, aGovernment)", ["@MediaCesko"])

// General purpose open source CMSs
cmsKeywordsMap.set("WordPress", ["/wp-content/", "/wp-json/"])
cmsKeywordsMap.set("Joomla!", ["Joomla!"])
cmsKeywordsMap.set("Drupal", ["drupal.org"])
cmsKeywordsMap.set("TYPO3", ["TYPO3 CMS"])
cmsKeywordsMap.set("GravCMS", ["GravCMS"])
cmsKeywordsMap.set("BasicCMS", ["BasicCMS"])
cmsKeywordsMap.set("mnewscms.com", ["mnewscms.com"])
cmsKeywordsMap.set("phpRS", ["phpRS"])
cmsKeywordsMap.set("SunLight CMS", ["SunLight CMS"])
cmsKeywordsMap.set("PHP-Nuke", ["PHP-Nuke"])

// Provider-specific closed-source CMSs
cmsKeywordsMap.set("CalmCube2 CMS", ["CalmCube2 CMS"])
cmsKeywordsMap.set("CMS RedAks", ["CMS RedAks"])
cmsKeywordsMap.set("CMSOl", ["CMSOl"])
cmsKeywordsMap.set("GiraffeCMS", ["GiraffeCMS"])
cmsKeywordsMap.set("iSystems.cz", ["iSystems.cz"])
cmsKeywordsMap.set("Lemonade CMS", ["Lemonade CMS"])
cmsKeywordsMap.set("NewCMS", ["NewCMS"])
cmsKeywordsMap.set("Omnio CMS", ["Omnio CMS"])
cmsKeywordsMap.set("oxiserver.com", ["oxiserver.com"])
cmsKeywordsMap.set("PAGE Pack CMS", ["PAGE Pack CMS"])
cmsKeywordsMap.set("StWebEngine.ASPNET", ["StWebEngine.ASPNET"])
cmsKeywordsMap.set("Sunset CMS", ["Sunset CMS"])
cmsKeywordsMap.set("Topinfo CMS", ["Topinfo CMS"])
cmsKeywordsMap.set("TrollCMS (WordPress based)", ["TrollCMS"])
cmsKeywordsMap.set("Vizus CMS", ["Vizus CMS"])
cmsKeywordsMap.set("WebJET CMS", ["WebJET CMS"])
cmsKeywordsMap.set("WebWorks WebCreator CMS", ["WebWorks WebCreator CMS"])
cmsKeywordsMap.set("xartCMS", ["xartCMS"])

// other non PHP CMSs
cmsKeywordsMap.set("HubSpot", ["HubSpot"])
cmsKeywordsMap.set("Wix", ["Wix"])
cmsKeywordsMap.set("Liferay", ["Liferay"])
cmsKeywordsMap.set("Strapi", ["Strapi"])

// Online page builders
cmsKeywordsMap.set("Webnode", ["Webnode"])
cmsKeywordsMap.set("Oblíbené stránky", ["oblibene.cz"])

// Offline page builders
cmsKeywordsMap.set("Microsoft FrontPage", ["Microsoft FrontPage"])
cmsKeywordsMap.set("Dreamweaver", ["Dreamweaver"])

// Static site generators
// Two first produce false positives
//cmsKeywordsMap.set("Jekyll", ["Jekyll"])
//cmsKeywordsMap.set("Hugo", ["Hugo"])
cmsKeywordsMap.set("Docusaurus", ["Docusaurus"])
cmsKeywordsMap.set("Gridsome", ["Gridsome"])
cmsKeywordsMap.set("Pelican", ["Pelican"])
cmsKeywordsMap.set("Gatsby", ["Gatsby"])

async function getCMS(homepageContentPath) {
    try {
        const stats = await fs.stat(homepageContentPath);
        if (stats.size > 0) {
            const homepageContent = await fs.readFile(homepageContentPath, "utf-8")
            return getCMSFromContent(homepageContent)
        }
    } catch (error) { }

    return null
}

function getCMSFromContent(content) {
    for (const cmsKeywordsEntry of cmsKeywordsMap) {
        for (const keyword of cmsKeywordsEntry[1]) {
            if (content.indexOf(keyword) > -1) {
                return cmsKeywordsEntry[0]
            }
        }
    }
    return null
}

async function processAllEntries() {
    const cmsMap = new Map()
    await Promise.all(municipalityData.map(async (data) => {
        const homepageContentPath = path.resolve(baseFolderPath, data.id + ".html")
        const cms = await getCMS(homepageContentPath)
        cmsMap.set(data.id, cms)
    }))

    const cmsSortedMap = new Map([...cmsMap].sort())
    
    fs.writeFile(path.resolve(__dirname, "data/cms-map.json"), JSON.stringify([...cmsSortedMap], null, 2)); 
}

processAllEntries()
