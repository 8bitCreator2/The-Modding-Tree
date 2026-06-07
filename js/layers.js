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
	if (hasUpgrade("s", 35)) mult = mult.mul(upgradeEffect("s", 35))
	if (hasUpgrade("s", 36)) mult = mult.mul(upgradeEffect("s", 36))
	if (hasUpgrade("starlayer", 11)) mult = mult.mul(upgradeEffect("starlayer", 11))
	if (hasMilestone("starlayer", 0)) mult = mult.mul(1.5)
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

	let rawGain3 = player.points.div(10).pow(0.5).mul(mult)
	if (rawGain3.gt(2e20)) {
		let over3 = rawGain3.div(2e20)
		mult = mult.div(over3.pow(0.085))
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
                    let soft3 = 2e20
                    let base = player.points.div(10).pow(0.5)
                    let multEst = new Decimal(1)
                        .mul(hasUpgrade("s", 11) ? upgradeEffect("s", 11) : 1)
                        .mul(hasUpgrade("s", 14) ? upgradeEffect("s", 14) : 1)
                        .mul(hasUpgrade("s", 22) ? upgradeEffect("s", 22) : 1)
                        .mul(hasUpgrade("s", 32) ? upgradeEffect("s", 32) : 1)
                        .mul(hasUpgrade("s", 34) ? upgradeEffect("s", 34) : 1)
                        .mul(hasUpgrade("s", 35) ? upgradeEffect("s", 35) : 1)
                        .mul(hasMilestone("starlayer", 0) ? 1.5 : 1)
                        .mul(getBuyableAmount("s", 31).gt(0) ? getBuyableAmount("s", 31).add(1).pow(2) : 1)

                    let softHits = []
                    let raw1 = base.mul(multEst)
                    if (raw1.gt(soft1)) {
                        let over = raw1.div(soft1)
                        multEst = multEst.div(over.pow(0.3))
                        softHits.push("500k")
                    }

                    let raw2 = base.mul(multEst)
                    if (raw2.gt(soft2)) {
                        let over2 = raw2.div(soft2)
                        multEst = multEst.div(over2.pow(0.2))
                        softHits.push("5e10")
                    }

                    let raw3 = base.mul(multEst)
                    if (raw3.gt(soft3)) {
                        let over3 = raw3.div(soft3)
                        multEst = multEst.div(over3.pow(0.085))
                        softHits.push("2e20")
                    }

                    let noSoft = base.mul(
                        new Decimal(1)
                            .mul(hasUpgrade("s", 11) ? upgradeEffect("s", 11) : 1)
                            .mul(hasUpgrade("s", 14) ? upgradeEffect("s", 14) : 1)
                            .mul(hasUpgrade("s", 22) ? upgradeEffect("s", 22) : 1)
                            .mul(hasUpgrade("s", 32) ? upgradeEffect("s", 32) : 1)
                            .mul(hasUpgrade("s", 34) ? upgradeEffect("s", 34) : 1)
                            .mul(hasUpgrade("s", 35) ? upgradeEffect("s", 35) : 1)
                            .mul(hasMilestone("starlayer", 0) ? 1.5 : 1)
                            .mul(getBuyableAmount("s", 31).gt(0) ? getBuyableAmount("s", 31).add(1).pow(2) : 1)
                    )
                    let finalGain = base.mul(multEst)
                    if (softHits.length > 0) {
                        let label = "⚠ Softcap active (" + softHits.join(" & ") + ")"
                        return '<span style="color:#FF8C00;">' + label + '<br>without: ' + format(noSoft) + '/s<br>actual: ' + format(finalGain) + '/s</span>'
                    } else
                        return '<span style="color:#888;">Softcaps at 500k, 5e10, and 2e20 Stardust gain</span>'
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
                if (hasUpgrade("s", 15)) base = base.mul(upgradeEffect("s", 15))
                if (hasUpgrade("s", 16)) base = base.pow(1.15)
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
                if (hasUpgrade("s", 15)) base = base.mul(upgradeEffect("s", 15))
                if (hasUpgrade("s", 16)) base = base.pow(1.15)
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
            let base = player.s.points.add(1).pow(0.5)
            if (hasUpgrade("s", 25)) base = base.mul(upgradeEffect("s", 25))
            return base
        },
        effectDisplay() { return format(upgradeEffect("s", 13))+"x" },
        unlocked() { return true }, 
},
        14: {
        title: "Matter Attraction",
        description: "Matter boosts Stardust gain",
        cost: new Decimal(250),
        effect() {
            let base = player.points.add(1).pow(0.5).div(3).max(1)
            if (hasUpgrade("s", 25)) base = base.mul(upgradeEffect("s", 25))
            return base
        },
        effectDisplay() { return format(upgradeEffect("s", 14))+"x" },
        unlocked() { return true }, 
},
        15: {
        title: "Star Power",
        description: "Each Star boosts Upgrades 11, 12, and 24",
        cost: new Decimal(500000),
        effect() {
            return player.starlayer.points.add(1)
        },
        effectDisplay() { return format(upgradeEffect("s", 15))+"x" },
        unlocked() { return hasMilestone("starlayer", 0) },
},
        16: {
        title: "Stellar Amplification",
        description: "Upgrades 11 and 12 are raised to ^1.15 after all effects",
        cost: new Decimal("5e26"),
        effect() {
            return new Decimal(1.15)
        },
        effectDisplay() { return "^" + format(upgradeEffect("s", 16)) },
        unlocked() { return hasMilestone("starlayer", 1) },
},
        21: {
        title: "Matter Loop",
        description: "Matter boosts its own gain",
        cost: new Decimal(1000),
        effect() {
            let base = player.points.add(1).pow(0.09)
            if (hasUpgrade("s", 26)) base = base.mul(upgradeEffect("s", 26))
            return base
        },
        effectDisplay() { return format(upgradeEffect("s", 21))+"x" },
        unlocked() { return getBuyableAmount("s", 31).gte(1) }, 
},
        22: {
        title: "Stardust Loop",
        description: "Stardust boosts its own gain",
        cost: new Decimal(5000),
        effect() {
            let base = player.s.points.add(1).pow(0.105)
            if (hasUpgrade("s", 26)) base = base.mul(upgradeEffect("s", 26))
            return base
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
                let base = getBuyableAmount("s", 31).div(3).add(1)
                if (hasUpgrade("s", 15)) base = base.mul(upgradeEffect("s", 15))
                return base
            },
            effectDisplay() { return format(upgradeEffect("s", 24))+"x" },
            unlocked() { return getBuyableAmount("s", 31).gte(2) },
},
        25: {
        title: "Condenser Radiation",
        description: "Condensed Stardust boosts Upgrades 13 and 14 (weaker)",
        cost: new Decimal("1e16"),
        effect() {
            return getBuyableAmount("s", 31).div(5).add(1)
        },
        effectDisplay() { return format(upgradeEffect("s", 25))+"x" },
        unlocked() { return hasMilestone("starlayer", 0) },
},
        26: {
        title: "Condenser Amplification",
        description: "Condensed Stardust boosts Upgrades 21 and 22",
        cost: new Decimal("5e27"),
        effect() {
            return getBuyableAmount("s", 31).div(4).add(1)
        },
        effectDisplay() { return format(upgradeEffect("s", 26))+"x" },
        unlocked() { return hasMilestone("starlayer", 1) },
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
        35: {
        title: "Stardust-Matter Convergence",
        description: "Fuses Stardust Creation and Matter Cannot Be Created into a single upgrade, boosting both resources",
        cost: new Decimal("1.5e17"),
        effect() {
            let base = new Decimal(4)
            if (hasUpgrade("s", 24)) base = base.mul(upgradeEffect("s", 24))
            if (hasUpgrade("s", 15)) base = base.mul(upgradeEffect("s", 15))
            return base
        },
        effectDisplay() { return format(upgradeEffect("s", 35))+"x" },
        unlocked() { return getBuyableAmount("s", 31).gte(3) },
},
        36: {
        title: "Ethereal Fusion",
        description: "Fuses Stellar Enhancement and Matter Attraction into one (greatly reduced), boosting both resources",
        cost: new Decimal("5e29"),
        effect() {
            return player.s.points.add(1).pow(0.05).mul(player.points.add(1).pow(0.03)).div(10).max(1)
        },
        effectDisplay() { return format(upgradeEffect("s", 36))+"x" },
        unlocked() { return getBuyableAmount("s", 31).gte(3) },
},
	},
    buyables: {
        31: {
            title: "Condensed Stardust",
            cost(x) {
                let s = hasMilestone("starlayer", 2) ? 1.2 : hasMilestone("starlayer", 1) ? 1.5 : hasMilestone("starlayer", 0) ? 2 : 3
                if (x.lt(3)) return new Decimal(500).mul(Decimal.pow(10, x.mul(s)))
                return new Decimal("5e13").mul(Decimal.pow(10, x.sub(3).mul(s)))
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

addLayer("starlayer", {
    name: "Stars",
    symbol: "ST",
    position: 1,
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        nebula: new Decimal(0),
    }},
    color: "#7ec8e3",
    requires() { return new Decimal(4) },
    resource: "Stars",
    baseResource: "Condensed Stardust",
    baseAmount() { return getBuyableAmount("s", 31) },
    type: "static",
    base: 2,
    exponent: 1,
    canBuyMax: true,
    gainMult() { return new Decimal(1) },
    gainExp() { return new Decimal(1) },
    row: 1,
    resetsNothing() { return true },
    onPrestige(gain) {
        let stars = player[this.layer].points
        let totalCost = new Decimal(4).mul(Decimal.pow(2, stars.add(gain)).sub(Decimal.pow(2, stars)))
        setBuyableAmount("s", 31, getBuyableAmount("s", 31).sub(totalCost))
        player.s.points = new Decimal(0)
        player.s.upgrades = []
        player.points = getStartPoints()
    },
    update(diff) {
        if (hasMilestone(this.layer, 2)) {
            let rate = player[this.layer].points
            if (hasUpgrade(this.layer, 12)) rate = rate.mul(upgradeEffect(this.layer, 12))
            if (hasUpgrade(this.layer, 13)) rate = rate.mul(upgradeEffect(this.layer, 13))
            player[this.layer].nebula = player[this.layer].nebula.add(rate.mul(diff))
        }
        if (tmp[this.layer]?.tabFormat?.["Nebula"]) {
            let show = hasMilestone(this.layer, 2)
            if (tmp[this.layer].tabFormat["Nebula"].unlocked !== show)
                Vue.set(tmp[this.layer].tabFormat["Nebula"], "unlocked", show)
        }
    },
    layerShown() { return true },
    tooltipLocked() {
        return "Reach 4 Condensed Stardust to unlock (You have " + formatWhole(getBuyableAmount("s", 31)) + ")"
    },
    milestones: {
        0: {
            requirementDescription: "1 Star",
            effectDescription: "Condenser scaling reduced, Matter x2, Stardust x1.5",
            done() { return player[this.layer].points.gte(1) },
        },
        1: {
            requirementDescription: "2 Stars",
            effectDescription: "Condenser scaling reduced further, Matter x1.5, Unlocks Upgrade 16",
            done() { return player[this.layer].points.gte(2) },
        },
        2: {
            requirementDescription: "3 Stars",
            effectDescription: "Condenser scaling reduced a bit more, Unlocks Nebula currency and Nebula upgrades",
            done() { return player[this.layer].points.gte(3) },
        },
    },
    upgrades: {
        11: {
            title: "Nebula Infusion",
            description: "Nebula boosts Matter and Stardust gain",
            cost: new Decimal(10),
            currencyInternalName: "nebula",
            currencyLayer: "starlayer",
            currencyDisplayName: "Nebula",
            effect() {
                let base = player.starlayer.nebula.add(1).pow(0.3)
                if (hasUpgrade("starlayer", 14)) base = base.mul(upgradeEffect("starlayer", 14))
                return base
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
            unlocked() { return hasMilestone("starlayer", 2) },
        },
        12: {
            title: "Nebula Expansion",
            description: "Boosts Nebula generation rate",
            cost: new Decimal(100),
            currencyInternalName: "nebula",
            currencyLayer: "starlayer",
            currencyDisplayName: "Nebula",
            effect() {
                let base = new Decimal(2)
                if (hasUpgrade("starlayer", 14)) base = base.mul(upgradeEffect("starlayer", 14))
                return base
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
            unlocked() { return hasUpgrade("starlayer", 11) },
        },
        13: {
            title: "Nebula Overdrive",
            description: "Current Nebula boosts Nebula generation",
            cost: new Decimal(300),
            currencyInternalName: "nebula",
            currencyLayer: "starlayer",
            currencyDisplayName: "Nebula",
            effect() {
                return player.starlayer.nebula.add(1).pow(0.15).max(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
            unlocked() { return hasUpgrade("starlayer", 12) },
        },
        14: {
            title: "Nebula Empowerment",
            description: "Nebula boosts Nebula Infusion and Nebula Expansion",
            cost: new Decimal(2000),
            currencyInternalName: "nebula",
            currencyLayer: "starlayer",
            currencyDisplayName: "Nebula",
            effect() {
                return player.starlayer.nebula.add(1).pow(0.12).max(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
            unlocked() { return hasUpgrade("starlayer", 13) },
        },
    },
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                "milestones",
            ]
        },
        "Nebula": {
            unlocked() { return hasMilestone("starlayer", 2) },
            content: [
                ["display-text", function() {
                    let rate = player[this.layer].points
                    if (hasUpgrade(this.layer, 12)) rate = rate.mul(upgradeEffect(this.layer, 12))
                    if (hasUpgrade(this.layer, 13)) rate = rate.mul(upgradeEffect(this.layer, 13))
                    return '<span style="font-size:16px;color:#9ca3af;">✦ Nebula</span><br><span style="color:#c084fc;font-weight:bold;font-size:28px;text-shadow:0 0 20px rgba(192,132,252,0.4);">' + format(player[this.layer].nebula) + '</span> <span style="color:#6b7280;font-size:14px;">(+' + format(rate) + '/s)</span>'
                }],
                "blank",
                ["upgrades", [1]],
            ],
            style: {
                "background": "linear-gradient(145deg, #0f0a1a 0%, #1a1030 50%, #0f0a1a 100%)",
                "border": "1px solid rgba(192,132,252,0.2)",
                "border-radius": "16px",
                "padding": "24px",
                "box-shadow": "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
                "backdrop-filter": "blur(10px)",
            },
        },
    },
})

