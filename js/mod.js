let modInfo = {
    name: "Bit Incremental",
    author: "MrRedShark77 + TMT Fusion",
    pointsName: "bits",
    modFiles: ["bitinc/UPGS.js", "bitinc/CHALS.js", "bitinc/PERKS.js", "bitinc/ACHS.js", "bitinc/AUTOS.js", "bitinc/FORMS.js", "tree.js", "layers/bits.js", "layers/reboot.js", "layers/upgrade.js", "layers/infinity.js", "layers/kernel.js", "layers/settings.js"],
    discordName: "",
    discordLink: "",
    initialStartPoints: new Decimal(1),
    offlineLimit: 1,
}

let VERSION = {
    num: "1.01",
    name: "Fusion",
}

let changelog = `<h1>Changelog:</h1><br>
    <h3>v1.0</h3><br>
        - Fusion of Bit Incremental into The Modding Tree framework.`

let winText = `Congratulations! You reached the end of Bit Incremental!`

var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

function canGenPoints(){
    return true
}

function getPointGen() {
    return new Decimal(0)
}

function addedPlayerData() { return {
    language: "en",
    bits: null,
    reboot: null,
    upgrade: null,
    infinity: null,
    kernel: null,
}}

var displayThings = []

function isEndgame() {
    return false
}

var backgroundStyle = {}

function maxTickLength() {
    return(3600)
}

function lang(text) { return text }

function fixOldSave(oldVersion){
    if (oldVersion < 1.01) {
        if (player.reboot) player.reboot.unlocked = true
        if (player.upgrade) player.upgrade.unlocked = true
    }
}

