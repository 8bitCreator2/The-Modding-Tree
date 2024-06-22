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
        if (hasUpgrade('p', 12)) mult = mult.times("2")
            if (hasMilestone('p', 1)) gain = gain.times(milestoneEffect('p', 1))	
            

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
        description: "And also get a lot of milestone to complete",
        cost: new Decimal(3),
        unlocked() { return hasUpgrade('p', 11)
        
    },
},
},
milestones: {
    0: {
        requirementDescription: "10 Prestiges",
        effectDescription: "Points boost Prestiges",
        done() { return player[this.layer].points.gte(new Decimal(10)) },
        effect() {
            return player.points.add(1).pow(0.20)
        },
        unlocked() { return hasUpgrade('p', 12)
    },
},
1: {
    requirementDescription: "30 Prestiges",
    effectDescription: "Prestige boost Points",
    done() { return player[this.layer].points.gte(new Decimal(30)) },
    effect() {
        return player[this.layer].points.add(1).pow(0.20)
    },
    
    unlocked() { return hasUpgrade('p', 12)
},
},
2: {
    requirementDescription: "200 Points",
    effectDescription: "Unlock a new layer",
    done() { return player[this.layer].points.gte(new Decimal(200)) },
    effect() {
        return player.points.add(1).pow(0.20)
    },  
    unlocked() { return hasMilestone('p', 1)
},
},
}
})
ddLayer("C", {
    name: "Concentration", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "P", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: false,
		points: new Decimal(0),
    }},
    color: "#F5FFFA",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Concentrated Points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
            

        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "C", description: "P: Reset for Concentrated points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.points.gte(new decimal (200))},
})