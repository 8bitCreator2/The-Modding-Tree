let modInfo = {
	name: "The Star Tree",
	author: "nobody",
	pointsName: "Matter",
	modFiles: ["layers.js", "tree.js"],

	discordName: "",
	discordLink: "",
	initialStartPoints: new Decimal (10), // Used for hard resets and new players
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

// If you add new functions anywhere inside of a layer, and those functions have an effect when called, add them here.
// (The ones here are examples, all official functions are already taken care of)
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
	if(!canGenPoints())
		return new Decimal(0)

	let gain = new Decimal(1)
	if (hasMilestone("starlayer", 0)) gain = gain.times(2)
	if (hasMilestone("starlayer", 1)) gain = gain.times(1.5)
	if (hasUpgrade("s", 12)) gain = gain.times(upgradeEffect("s", 12))
	if (hasUpgrade("s", 13)) gain = gain.times(upgradeEffect("s", 13))
	if (hasUpgrade("s", 21)) gain = gain.times(upgradeEffect("s", 21))
	if (hasUpgrade("s", 23)) gain = gain.times(upgradeEffect("s", 23))
	if (hasUpgrade("s", 31)) gain = gain.times(upgradeEffect("s", 31))
	if (hasUpgrade("s", 33)) gain = gain.times(upgradeEffect("s", 33))
	if (hasUpgrade("s", 35)) gain = gain.times(upgradeEffect("s", 35))
	if (hasUpgrade("s", 36)) gain = gain.times(upgradeEffect("s", 36))
	if (hasUpgrade("s", 42)) gain = gain.times(upgradeEffect("s", 42))
	if (hasUpgrade("s", 45)) gain = gain.times(upgradeEffect("s", 45))
	if (hasUpgrade("s", 46)) gain = gain.times(upgradeEffect("s", 46))
	if (hasUpgrade("starlayer", 11)) gain = gain.times(upgradeEffect("starlayer", 11))
	if (player.s.novaShards.gt(0)) gain = gain.times(player.s.novaShards.add(1).pow(0.1))
	let nebBuy12 = getBuyableAmount("starlayer", 12)
	if (nebBuy12.gt(0)) gain = gain.times(nebBuy12.add(1).pow(0.5))
	if (player.s.compressions.gt(0)) {
		let base = hasUpgrade("starlayer", 21) ? new Decimal(3).mul(upgradeEffect("starlayer", 21)) : new Decimal(3)
		let compMult = Decimal.pow(base, player.s.compressions)
		gain = gain.times(compMult)
	}
	return gain
}

// You can add non-layer related variables that should to into "player" and be saved here, along with default values
function addedPlayerData() { return {
}}

// Display extra things at the top of the page
var displayThings = [
]

// Determines when the game "ends"
function isEndgame() {
	return player.points.gte(new Decimal("e280000000"))
}



// Less important things beyond this point!

// Style for the background, can be a function
var backgroundStyle = {

}

// You can change this if you have things that can be messed up by long tick lengths
function maxTickLength() {
	return(3600) // Default is 1 hour which is just arbitrarily large
}

// Use this if you need to undo inflation from an older version. If the version is older than the version that fixed the issue,
// you can cap their current resources with this.
function fixOldSave(oldVersion){
}
