let modInfo = {
	name: "The ??? Tree",
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
    if (!canGenPoints()) {
        return new Decimal(0); // If points cannot be generated, return 0
    }

    let gain = new Decimal(1); // Initial points gain multiplier (base gain)

    // Add effect of Buyable 12 (Star Fragment), which adds +1 to base points gain
    let buyable12Effect = getBuyableAmount('s', 12).times(1); // Each Buyable 12 adds +1 to base points gain
    gain = gain.plus(buyable12Effect); // Add the effect of Buyable 12 to the base points gain

    // Apply upgrade effects if the player has bought specific upgrades

    // If the player has upgrade 11 (Core Fusion), apply its effect
    if (hasUpgrade('s', 11)) {
        gain = gain.times(upgradeEffect('s', 11));  
    }

    // If the player has upgrade 13 (based on Stellar Matter), apply its effect
    if (hasUpgrade('s', 13)) {
        gain = gain.times(upgradeEffect('s', 13));  
    }

    // If the player has upgrade 22 (Points Boost), apply a flat 1.5x multiplier
    if (hasUpgrade('s', 22)) {
        gain = gain.times(1.5);  
    }

    // Return the final points gain
    return gain;
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
