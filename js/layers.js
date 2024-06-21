addLayer("p", {
    name: "prestige", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#4BDC13",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "prestige points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('p',12)) mult = mult.times(2)
        return mult
       
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {    
         11: {
            title: "2x!",
            description: "Double your point gain.",
            cost: new Decimal(1),
            

    },
     12: {
        title: "2x Prestige Points",
        description: "Read Desc",
        cost: new Decimal(3),
        unlocked() { return hasUpgrade('p', 11)
        
    },
}
},
buyables: {
    11: {
            title: "Point multiplier 2x",
            unlocked() {
                return hasUpgrade('p', 12)
            },
            cost(x) {
                return new Decimal(2).pow(x)
            },
            display() {
                let amount = getBuyableAmount('p', 11)
            },
            canAfford() {
                return player.points.gte(this.cost())
            },
            buy() {
                player.points = player.points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            effect(x) {
                return Decimal.pow(2, x)
            },
        },
    }
})
