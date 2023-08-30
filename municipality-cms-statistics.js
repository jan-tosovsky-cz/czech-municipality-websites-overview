const cmsMap = new Map(require("./data/cms-map.json"))

const frequenciesMap = Array.from(cmsMap.values()).reduce((map, e) => map.set(e, (map.get(e) || 0) + 1), new Map())
const sortedFrequenciesMap = new Map([...frequenciesMap].sort((a, b) => b[1] - a[1]))

for (const entry of sortedFrequenciesMap) {
    console.log(entry[0] + ":" + entry[1])
}
