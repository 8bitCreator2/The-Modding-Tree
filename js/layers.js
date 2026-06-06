addLayer("s", {
    name: "Stars", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
	        stars: new Decimal(0),
    }},
    color: "#F8ECC9",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "Stardust", // Name of prestige currency
    baseResource: "Matter", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        let mult = new Decimal(1)
	if (hasUpgrade("s", 11)) mult = mult.mul(upgradeEffect("s", 11))
	if (hasUpgrade("s", 14)) mult = mult.mul(upgradeEffect("s", 14))
	if (hasUpgrade("s", 22)) mult = mult.mul(upgradeEffect("s", 22))
	if (hasUpgrade("s", 32)) mult = mult.mul(upgradeEffect("s", 32))
	if (hasUpgrade("s", 34)) mult = mult.mul(upgradeEffect("s", 34))
	let condensed = getBuyableAmount("s", 31)
	if (condensed.gt(0)) mult = mult.mul(condensed.add(1).pow(2))

	let rawGain = player.points.div(10).pow(0.5).mul(mult)
	if (rawGain.gt(500000)) {
		let over = rawGain.div(500000)
		mult = mult.div(over.pow(0.3))
	}

	let rawGain2 = player.points.div(10).pow(0.5).mul(mult)
	if (rawGain2.gt(5e10)) {
		let over2 = rawGain2.div(5e10)
		mult = mult.div(over2.pow(0.2))
	}

        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "s", description: "S: Reset for Stardust", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                ["upgrades", [1, 2, 3]],
                "blank",
                ["display-text", function() {
                    let soft1 = 500000
                    let soft2 = 5e10
                    let base = player.points.div(10).pow(0.5)
                    let multEst = new Decimal(1)
                        .mul(hasUpgrade("s", 11) ? upgradeEffect("s", 11) : 1)
                        .mul(hasUpgrade("s", 14) ? upgradeEffect("s", 14) : 1)
                        .mul(hasUpgrade("s", 22) ? upgradeEffect("s", 22) : 1)
                        .mul(hasUpgrade("s", 32) ? upgradeEffect("s", 32) : 1)
                        .mul(hasUpgrade("s", 34) ? upgradeEffect("s", 34) : 1)
                        .mul(getBuyableAmount("s", 31).gt(0) ? getBuyableAmount("s", 31).add(1).pow(2) : 1)

                    let raw1 = base.mul(multEst)
                    if (raw1.gt(soft1)) {
                        let over = raw1.div(soft1)
                        multEst = multEst.div(over.pow(0.3))
                    }

                    let raw2 = base.mul(multEst)
                    if (raw2.gt(soft2)) {
                        let over2 = raw2.div(soft2)
                        multEst = multEst.div(over2.pow(0.2))
                    }

                    let noSoft = base.mul(
                        new Decimal(1)
                            .mul(hasUpgrade("s", 11) ? upgradeEffect("s", 11) : 1)
                            .mul(hasUpgrade("s", 14) ? upgradeEffect("s", 14) : 1)
                            .mul(hasUpgrade("s", 22) ? upgradeEffect("s", 22) : 1)
                            .mul(hasUpgrade("s", 32) ? upgradeEffect("s", 32) : 1)
                            .mul(hasUpgrade("s", 34) ? upgradeEffect("s", 34) : 1)
                            .mul(getBuyableAmount("s", 31).gt(0) ? getBuyableAmount("s", 31).add(1).pow(2) : 1)
                    )
                    let finalGain = base.mul(multEst)
                    if (finalGain.gt(soft1)) {
                        let label = finalGain.gt(soft2) ? "⚠ Softcap active (500k & 5e10)" : "⚠ Softcap active 500k"
                        return '<span style="color:#FF8C00;">' + label + '<br>without: ' + format(noSoft) + '/s<br>actual: ' + format(finalGain) + '/s</span>'
                    } else
                        return '<span style="color:#888;">Softcaps at 500k and 5e10 Stardust gain</span>'
                }]
            ]
        },
        "Condenser": {
            content: [
                "main-display",
                "blank",
                ["display-text", function() {
                    let condensed = getBuyableAmount("s", 31)
                    if (condensed.gt(0))
                        return 'Condensed Stardust: <span style="color:#FFB347;font-weight:bold;font-size:24px;text-shadow:0 0 10px #FFB347,0 0 20px #FF8C00;">' + format(condensed) + '</span> (' + format(condensed.add(1).pow(2)) + 'x Stardust)'
                    else
                        return "Purchase Condensed Stardust below to boost Stardust gain!"
                }],
                "blank",
                ["buyable", 31]
            ]
        },
    },
	upgrades: {
    11: {
        title: "Stardust Creation",
        description: "Stardust is boosted",
        cost: new Decimal(5),
        effect() {
            let base = new Decimal(2)
            if (hasUpgrade("s", 24)) base = base.mul(upgradeEffect("s", 24))
            return base
        },
        effectDisplay() { return format(upgradeEffect("s", 11))+"x" },
        unlocked() { return true }, 
		
    },
		   12: {
        title: "Matter Cannot Be Created",
        description: "Matter gain is boosted",
        cost: new Decimal(10),
        effect() {
            let base = new Decimal(3)
            if (hasUpgrade("s", 24)) base = base.mul(upgradeEffect("s", 24))
            return base
        },
        effectDisplay() { return format(upgradeEffect("s", 12))+"x" },
        unlocked() { return true }, 
},
       13: {
        title: "Stellar Enhancement",
        description: "Stardust boosts Matter gain",
        cost: new Decimal(30),
        effect() {
            return player.s.points.add(1).pow(0.5)
        },
        effectDisplay() { return format(upgradeEffect("s", 13))+"x" },
        unlocked() { return true }, 
},
       14: {
        title: "Matter Attraction",
        description: "Matter boosts Stardust gain",
        cost: new Decimal(250),
        effect() {
            return player.points.add(1).pow(0.5).div(3).max(1)
        },
        effectDisplay() { return format(upgradeEffect("s", 14))+"x" },
        unlocked() { return true }, 
},
        21: {
        title: "Matter Loop",
        description: "Matter boosts its own gain",
        cost: new Decimal(1000),
        effect() {
            return player.points.add(1).pow(0.09)
        },
        effectDisplay() { return format(upgradeEffect("s", 21))+"x" },
        unlocked() { return getBuyableAmount("s", 31).gte(1) }, 
},
        22: {
        title: "Stardust Loop",
        description: "Stardust boosts its own gain",
        cost: new Decimal(5000),
        effect() {
            return player.s.points.add(1).pow(0.105)
        },
        effectDisplay() { return format(upgradeEffect("s", 22))+"x" },
        unlocked() { return hasUpgrade("s", 21) }, 
},
        23: {
        title: "Matter Amplifier",
        description: "2x Matter gain",
        cost: new Decimal(10000000),
        effect() {
            return new Decimal(2)
        },
        effectDisplay() { return format(upgradeEffect("s", 23))+"x" },
        unlocked() { return getBuyableAmount("s", 31).gte(2) }, 
},
        24: {
        title: "Condenser Synergy",
        description: "Condensed Stardust boosts upgrades 11 and 12",
        cost: new Decimal(50000000),
        effect() {
            return getBuyableAmount("s", 31).div(3).add(1)
        },
        effectDisplay() { return format(upgradeEffect("s", 24))+"x" },
        unlocked() { return getBuyableAmount("s", 31).gte(2) }, 
},
        31: {
        title: "Matter Loop II",
        description: "Matter boosts its own gain (weak)",
        cost: new Decimal(100000000),
        effect() {
            return player.points.add(1).pow(0.04)
        },
        effectDisplay() { return format(upgradeEffect("s", 31))+"x" },
        unlocked() { return getBuyableAmount("s", 31).gte(3) }, 
},
        32: {
        title: "Stardust Loop II",
        description: "Stardust boosts its own gain (weak)",
        cost: new Decimal(200000000),
        effect() {
            return player.s.points.add(1).pow(0.04)
        },
        effectDisplay() { return format(upgradeEffect("s", 32))+"x" },
        unlocked() { return getBuyableAmount("s", 31).gte(3) }, 
},
        33: {
        title: "Stellar Enhancement II",
        description: "Stardust boosts Matter gain (weak)",
        cost: new Decimal(500000000),
        effect() {
            return player.s.points.add(1).pow(0.15)
        },
        effectDisplay() { return format(upgradeEffect("s", 33))+"x" },
        unlocked() { return getBuyableAmount("s", 31).gte(3) }, 
},
        34: {
        title: "Matter Attraction II",
        description: "Matter boosts Stardust gain (weak)",
        cost: new Decimal("1e12"),
        effect() {
            return player.points.add(1).pow(0.15).div(3).max(1)
        },
        effectDisplay() { return format(upgradeEffect("s", 34))+"x" },
        unlocked() { return getBuyableAmount("s", 31).gte(3) }, 
},
	},
    buyables: {
        31: {
            title: "Condensed Stardust",
            cost(x) {
                if (x.lt(3)) return new Decimal(500).mul(Decimal.pow(10, x.mul(3)))
                return new Decimal("5e13").mul(Decimal.pow(10, x.sub(3).mul(3)))
            },
            display() {
                let level = getBuyableAmount(this.layer, this.id)
                return "Level: " + format(level) +
                       "<br>Cost: " + format(this.cost()) + " Stardust" +
                       "<br>Boost: +" + format(level.add(1).pow(2)) + "x Stardust"
            },
            canAfford() {
                return player[this.layer].points.gte(this.cost())
            },
            buy() {
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
                player[this.layer].points = new Decimal(0)
                player.points = getStartPoints()
            },
            unlocked() { return true },
            style: {
                "background": "linear-gradient(135deg, #F8ECC9 0%, #e8d48b 100%)",
                "border": "2px solid rgba(255,255,255,0.2)",
                "border-radius": "12px",
                "box-shadow": "0 4px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
                "color": "#4a3728",
                "padding": "15px",
                "font-family": "'Segoe UI', sans-serif",
                "backdrop-filter": "blur(5px)"
            },
        },
    }
})
