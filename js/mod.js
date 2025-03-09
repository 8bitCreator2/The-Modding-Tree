let modInfo = {
    name: "The ??? Tree",
    id: "mymod",
    author: "nobody",
    pointsName: "points",
    modFiles: ["layers.js", "tree.js"],

    discordName: "",
    discordLink: "",
    initialStartPoints: new Decimal(10), // Used for hard resets and new players
    offlineLimit: 1,  // In hours
}

// Set your version in num and name
let VERSION = {
    num: "0.0",
    name: "Literally nothing",
}

let changelog = `<h1>Changelog:</h1><br>
    <h3>v0.0</h3><br>
        - Added things.<br>
        - Added stuff.`

let winText = `Congratulations! You have reached the end and beaten this game, but for now...`

var doNotCallTheseFunctionsEveryTick = ["blowUpEverything"]

function getStartPoints(){
    return new Decimal(modInfo.initialStartPoints)
}

// Determines if it should show points/sec
function canGenPoints(){
    return true
}

// Calculate points/sec!
function getPointGen() {
    if (!canGenPoints())
        return new Decimal(0);

    let gain = new Decimal(1); // Base gain for points/sec

    // 🔨 Apply Upgrade 12 Effect (Boost based on Stone)
    if (hasUpgrade("s", 12)) gain = gain.times(upgradeEffect("s", 12));

    // ⛏️ Apply Pickaxe Buyable Effect (Boost based on Pickaxe levels)
    gain = gain.times(getBuyableAmount("s", 11).pow(1.2));

    return gain;
}

function addedPlayerData() { return {} }

var displayThings = []

function isEndgame() {
    return player.points.gte(new Decimal("e280000000"))
}

var backgroundStyle = {}

function maxTickLength() {
    return(3600) // Default is 1 hour which is just arbitrarily large
}

function fixOldSave(oldVersion){}
