let modInfo = {
    name: "The Historic Tree",
    author: "you",
    pointsName: "Knowledge",
    modFiles: ["layers/paleolithic.js", "tree.js"],

    discordName: "",
    discordLink: "",
    initialStartPoints: new Decimal(10),
    offlineLimit: 1,
}

let VERSION = {
    num: "0.0",
    name: "Dawn of Humanity",
}

let changelog = `<h1>Changelog:</h1><br>
    <h3>v0.0</h3><br>
        - Paleolithic era begins.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

function canGenPoints(){
    return true
}

function getPointGen() {
    if(!canGenPoints())
        return new Decimal(0)

    let gain = new Decimal(1)
    if (hasUpgrade("paleolithic", 12)) gain = gain.times(upgradeEffect("paleolithic", 12))
    if (hasUpgrade("paleolithic", 13)) gain = gain.times(upgradeEffect("paleolithic", 13))
    if (hasUpgrade("paleolithic", 51)) gain = gain.times(upgradeEffect("paleolithic", 51))
    if (hasUpgrade("paleolithic", 23)) gain = gain.times(upgradeEffect("paleolithic", 23))
    if (hasUpgrade("paleolithic", 52)) gain = gain.times(upgradeEffect("paleolithic", 52))
    if (hasUpgrade("paleolithic", 33)) gain = gain.times(upgradeEffect("paleolithic", 33))
    if (hasUpgrade("paleolithic", 35)) gain = gain.times(upgradeEffect("paleolithic", 35))
    if (hasUpgrade("paleolithic", 41)) gain = gain.times(upgradeEffect("paleolithic", 41))
    if (hasUpgrade("paleolithic", 43)) gain = gain.times(upgradeEffect("paleolithic", 43))
    if (hasUpgrade("paleolithic", 45)) gain = gain.times(upgradeEffect("paleolithic", 45))
    if (hasMilestone("paleolithic", 1)) gain = gain.times(2)
    if (hasMilestone("paleolithic", 3)) gain = gain.times(1.5)
    if (hasMilestone("paleolithic", 4)) gain = gain.times(1.5)
    if (hasMilestone("paleolithic", 6)) gain = gain.times(2)
    if (hasMilestone("paleolithic", 7)) gain = gain.times(2)
    if (hasMilestone("paleolithic", 9)) gain = gain.times(2)
    if (hasMilestone("paleolithic", 10)) gain = gain.times(2)
    if (hasMilestone("paleolithic", 12)) gain = gain.times(2)
    if (hasMilestone("paleolithic", 13)) gain = gain.times(2)
    if (hasMilestone("paleolithic", 15)) gain = gain.times(2)
    if (hasMilestone("paleolithic", 16)) gain = gain.times(3)
    return gain
}

function addedPlayerData() { return {
    tribalWisdom: new Decimal(0),
    totalTribalWisdom: new Decimal(0),
}}

var displayThings = [
]

function isEndgame() {
    return player.points.gte(new Decimal("e1e100"))
}

var backgroundStyle = {

}

function maxTickLength() {
    return(3600)
}

function fixOldSave(oldVersion){
}
