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
    requires() {
        if (player[this.layer].points.gte(7)) return new Decimal(32)
        return new Decimal(4)
    },
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
        let baseCost = stars.gte(7) ? 32 : 4
        let totalCost = new Decimal(baseCost).mul(Decimal.pow(2, stars.add(gain)).sub(Decimal.pow(2, stars)))
        setBuyableAmount("s", 31, getBuyableAmount("s", 31).sub(totalCost))
        if (!hasMilestone(this.layer, 7)) {
            player.s.points = new Decimal(0)
            player.s.upgrades = []
            player[this.layer].nebula = new Decimal(0)
            player.points = getStartPoints()
        }
    },
    update(diff) {
        if (hasMilestone(this.layer, 2)) {
            let rate = player[this.layer].points
            if (hasUpgrade(this.layer, 12)) rate = rate.mul(upgradeEffect(this.layer, 12))
            if (hasUpgrade(this.layer, 13)) rate = rate.mul(upgradeEffect(this.layer, 13))
                    if (hasUpgrade(this.layer, 31)) rate = rate.mul(upgradeEffect(this.layer, 31))
                    if (hasMilestone(this.layer, 5)) rate = rate.mul(3)
                    let nebBuy13 = getBuyableAmount(this.layer, 13)
            if (nebBuy13.gt(0)) rate = rate.mul(nebBuy13.add(1).pow(0.5 * (hasUpgrade("stellartree", 51) ? upgradeEffect("stellartree", 51) : 1) * (player.stellartree && hasUpgrade("stellartree", 56) ? upgradeEffect("stellartree", 56) : 1)))
            if (player.s.compressions.gt(0)) {
                let base = hasUpgrade("starlayer", 21) ? new Decimal(3).mul(upgradeEffect("starlayer", 21)) : new Decimal(3)
                let compMult = Decimal.pow(base, player.s.compressions)
                rate = rate.mul(compMult)
            }
            if (player.stellartree && hasUpgrade("stellartree", 59)) rate = rate.mul(upgradeEffect("stellartree", 59))
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
        3: {
            requirementDescription: "4 Stars",
            effectDescription: "Auto-buy Condensed Stardust, unlocks Stardust Compressor and 4 new Nebula upgrades",
            done() { return player[this.layer].points.gte(4) },
        },
        4: {
            requirementDescription: "5 Stars",
            effectDescription: "Condenser no longer resets, unlocks Nebula Buyables",
            done() { return player[this.layer].points.gte(5) },
        },
        5: {
            requirementDescription: "6 Stars",
            effectDescription: "Unlocks advanced Nebula upgrades, Nebula generation x3",
            done() { return player[this.layer].points.gte(6) },
        },
        6: {
            requirementDescription: "8 Stars",
            effectDescription: "Unlocks the Stellar Tree",
            done() { return player[this.layer].points.gte(8) },
        },
        7: {
            requirementDescription: "12 Stars",
            effectDescription: "Stars no longer reset anything",
            done() { return player[this.layer].points.gte(12) },
        },
    },
    upgrades: {
        cols: 4,
        rows: 3,
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
        21: {
            title: "Nebula Cascade",
            description: "Nebula boosts Stardust Compressor effectiveness",
            cost: new Decimal(1e6),
            currencyInternalName: "nebula",
            currencyLayer: "starlayer",
            currencyDisplayName: "Nebula",
            effect() {
                return player.starlayer.nebula.add(1).pow(0.03).max(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
            unlocked() { return hasMilestone("starlayer", 3) },
        },
        22: {
            title: "Nebula Convergence",
            description: "Nebula reduces Condenser scaling a little",
            cost: new Decimal(5e6),
            currencyInternalName: "nebula",
            currencyLayer: "starlayer",
            currencyDisplayName: "Nebula",
            effect() {
                return player.starlayer.nebula.add(1).pow(0.02).max(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
            unlocked() { return hasUpgrade("starlayer", 21) },
        },
        23: {
            title: "Nebula Singularity",
            description: "Nebula boosts Condensed Stardust base effect",
            cost: new Decimal(10e6),
            currencyInternalName: "nebula",
            currencyLayer: "starlayer",
            currencyDisplayName: "Nebula",
            effect() {
                return player.starlayer.nebula.add(1).pow(0.02).max(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
            unlocked() { return hasUpgrade("starlayer", 22) },
        },
        24: {
            title: "Nebula Transcendence",
            description: "Nebula boosts Stardust upgrades 11 & 12",
            cost: new Decimal(30e6),
            currencyInternalName: "nebula",
            currencyLayer: "starlayer",
            currencyDisplayName: "Nebula",
            effect() {
                return player.starlayer.nebula.add(1).pow(0.035).max(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
            unlocked() { return hasUpgrade("starlayer", 23) },
        },
        31: {
            title: "Nebula Engine",
            description: "Stars boost Nebula generation",
            cost: new Decimal(1e10),
            currencyInternalName: "nebula",
            currencyLayer: "starlayer",
            currencyDisplayName: "Nebula",
            effect() {
                let base = player[this.layer].points.add(1).pow(0.25)
                if (hasUpgrade("stellartree", 58)) base = base.pow(upgradeEffect("stellartree", 58))
                return base
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x" },
            unlocked() { return hasMilestone("starlayer", 5) },
        },
        32: {
            title: "Compression Efficiency",
            description: "Nebula reduces Compressor cost scaling",
            cost: new Decimal(3e10),
            currencyInternalName: "nebula",
            currencyLayer: "starlayer",
            currencyDisplayName: "Nebula",
            effect() {
                return player[this.layer].nebula.add(1).pow(0.012).max(1)
            },
            effectDisplay() { return "/" + format(upgradeEffect(this.layer, this.id)) + " exponent" },
            unlocked() { return hasUpgrade("starlayer", 31) },
        },
        33: {
            title: "Nebula Efficiency",
            description: "Nebula reduces Amplifier buyable costs",
            cost: new Decimal(1e21),
            currencyInternalName: "nebula",
            currencyLayer: "starlayer",
            currencyDisplayName: "Nebula",
            effect() {
                return player[this.layer].nebula.add(1).pow(0.06).max(1)
            },
            effectDisplay() { return "/" + format(upgradeEffect(this.layer, this.id)) },
            unlocked() { return hasUpgrade("starlayer", 32) },
        },
        34: {
            title: "Nebula Ascendancy",
            description: "Unlocks Protostar",
            cost: new Decimal(1e22),
            currencyInternalName: "nebula",
            currencyLayer: "starlayer",
            currencyDisplayName: "Nebula",
            effect() { return new Decimal(1) },
            effectDisplay() { return "Unlocks Protostar" },
            unlocked() { return hasUpgrade("starlayer", 33) },
        },
    },
    buyables: {
        rows: 1,
        cols: 3,
        11: {
            title: "Stardust Amplifier",
            cost() {
                let base = new Decimal(1000).mul(Decimal.pow(1.5, getBuyableAmount(this.layer, this.id)))
                if (hasUpgrade("starlayer", 33)) base = base.div(upgradeEffect("starlayer", 33))
                return base
            },
			display() {
                let level = getBuyableAmount(this.layer, this.id)
                let exp = 0.5 * (hasUpgrade("stellartree", 51) ? upgradeEffect("stellartree", 51) : 1) * (player.stellartree && hasUpgrade("stellartree", 56) ? upgradeEffect("stellartree", 56) : 1)
                return 'Level: <span style="font-size:22px;font-weight:bold;color:#F8ECC9;text-shadow:0 0 10px #F8ECC9;">' + formatWhole(level) + '</span>' +
                       '<br><span style="font-size:13px;color:#aaa;">Cost: ' + format(this.cost()) + ' Nebula</span>' +
                       '<br><span style="font-size:14px;color:#e8d48b;">+' + format(level.add(1).pow(exp)) + 'x Stardust</span>'
            },
            canAfford() {
                return player[this.layer].nebula.gte(this.cost())
            },
            buy() {
                player[this.layer].nebula = player[this.layer].nebula.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() { return hasMilestone("starlayer", 4) },
            style: {
                "background": "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                "border": "1px solid rgba(248,236,201,0.3)",
                "border-radius": "12px",
                "padding": "15px",
                "box-shadow": "0 4px 15px rgba(0,0,0,0.3)",
                "color": "#e0e0e0",
                "font-family": "'Segoe UI', sans-serif",
                "text-align": "center",
            },
        },
        12: {
            title: "Matter Amplifier",
            cost() {
                let base = new Decimal(1000).mul(Decimal.pow(1.5, getBuyableAmount(this.layer, this.id)))
                if (hasUpgrade("starlayer", 33)) base = base.div(upgradeEffect("starlayer", 33))
                return base
            },
            display() {
                let level = getBuyableAmount(this.layer, this.id)
                let exp = 0.5 * (hasUpgrade("stellartree", 51) ? upgradeEffect("stellartree", 51) : 1) * (player.stellartree && hasUpgrade("stellartree", 56) ? upgradeEffect("stellartree", 56) : 1)
                return 'Level: <span style="font-size:22px;font-weight:bold;color:#F8ECC9;text-shadow:0 0 10px #F8ECC9;">' + formatWhole(level) + '</span>' +
                       '<br><span style="font-size:13px;color:#888;">Cost: ' + format(this.cost()) + ' Nebula</span>' +
                       '<br><span style="font-size:14px;color:#e8d48b;">+' + format(level.add(1).pow(exp)) + 'x Matter</span>'
            },
            canAfford() {
                return player[this.layer].nebula.gte(this.cost())
            },
            buy() {
                player[this.layer].nebula = player[this.layer].nebula.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() { return hasMilestone("starlayer", 4) },
            style: {
                "background": "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
                "border": "1px solid rgba(248,236,201,0.3)",
                "border-radius": "12px",
                "padding": "15px",
                "box-shadow": "0 4px 15px rgba(0,0,0,0.3)",
                "color": "#e0e0e0",
                "font-family": "'Segoe UI', sans-serif",
                "text-align": "center",
            },
        },
        13: {
            title: "Nebula Amplifier",
            cost() {
                let base = new Decimal(2000).mul(Decimal.pow(2, getBuyableAmount(this.layer, this.id)))
                if (hasUpgrade("starlayer", 33)) base = base.div(upgradeEffect("starlayer", 33))
                return base
            },
            display() {
                let level = getBuyableAmount(this.layer, this.id)
                let exp = 0.5 * (hasUpgrade("stellartree", 51) ? upgradeEffect("stellartree", 51) : 1) * (player.stellartree && hasUpgrade("stellartree", 56) ? upgradeEffect("stellartree", 56) : 1)
                return 'Level: <span style="font-size:22px;font-weight:bold;color:#c084fc;text-shadow:0 0 10px #c084fc;">' + formatWhole(level) + '</span>' +
                       '<br><span style="font-size:13px;color:#888;">Cost: ' + format(this.cost()) + ' Nebula</span>' +
                       '<br><span style="font-size:14px;color:#c084fc;">+' + format(level.add(1).pow(exp)) + 'x Nebula</span>'
            },
            canAfford() {
                return player[this.layer].nebula.gte(this.cost())
            },
            buy() {
                player[this.layer].nebula = player[this.layer].nebula.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            },
            unlocked() { return hasMilestone("starlayer", 4) },
            style: {
                "background": "linear-gradient(135deg, #1a0a2e 0%, #1a1030 100%)",
                "border": "1px solid rgba(192,132,252,0.3)",
                "border-radius": "12px",
                "padding": "15px",
                "box-shadow": "0 4px 15px rgba(0,0,0,0.3)",
                "color": "#e0e0e0",
                "font-family": "'Segoe UI', sans-serif",
                "text-align": "center",
            },
        },
    },
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                ["display-text", function() {
                    let hasNebula = hasMilestone(this.layer, 2)
                    if (!hasNebula) return '<span style="color:#6b7280;">Reach 3 Stars to unlock Nebula</span>'
                    let rate = player[this.layer].points
                    if (hasUpgrade(this.layer, 12)) rate = rate.mul(upgradeEffect(this.layer, 12))
                    if (hasUpgrade(this.layer, 13)) rate = rate.mul(upgradeEffect(this.layer, 13))
                    if (hasUpgrade(this.layer, 31)) rate = rate.mul(upgradeEffect(this.layer, 31))
                    if (hasMilestone(this.layer, 5)) rate = rate.mul(3)
                    let nebBuy13 = getBuyableAmount(this.layer, 13)
                    if (nebBuy13.gt(0)) rate = rate.mul(nebBuy13.add(1).pow(0.5 * (hasUpgrade("stellartree", 51) ? upgradeEffect("stellartree", 51) : 1) * (player.stellartree && hasUpgrade("stellartree", 56) ? upgradeEffect("stellartree", 56) : 1)))
                    if (player.s.compressions.gt(0)) {
                        let base = hasUpgrade("starlayer", 21) ? new Decimal(3).mul(upgradeEffect("starlayer", 21)) : new Decimal(3)
                        let compMult = Decimal.pow(base, player.s.compressions)
                        rate = rate.mul(compMult)
                    }
                    let nebulaText = '<span style="font-size:14px;color:#9ca3af;">✦ Nebula: <span style="color:#c084fc;font-weight:bold;">' + format(player[this.layer].nebula) + '</span> <span style="color:#6b7280;font-size:12px;">(+' + format(rate) + '/s)</span></span>'
                    if (player.s.novaShards.gt(0)) {
                        let novaMult = player.s.novaShards.add(1).pow(0.1)
                        if (hasUpgrade("stellartree", 52)) novaMult = novaMult.mul(upgradeEffect("stellartree", 52))
                        let nBoost = format(novaMult)
                        nebulaText += '<br><span style="color:#c084fc;font-size:11px;">✦ Nova Shards: Nebula x' + nBoost + '</span>'
                    }
                    return nebulaText
                }],
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
                    if (hasUpgrade(this.layer, 31)) rate = rate.mul(upgradeEffect(this.layer, 31))
                    if (hasMilestone(this.layer, 5)) rate = rate.mul(3)
                    let nebBuy13 = getBuyableAmount(this.layer, 13)
                    if (nebBuy13.gt(0)) rate = rate.mul(nebBuy13.add(1).pow(0.5 * (hasUpgrade("stellartree", 51) ? upgradeEffect("stellartree", 51) : 1) * (player.stellartree && hasUpgrade("stellartree", 56) ? upgradeEffect("stellartree", 56) : 1)))
                    if (player.s.compressions.gt(0)) {
                        let base = hasUpgrade("starlayer", 21) ? new Decimal(3).mul(upgradeEffect("starlayer", 21)) : new Decimal(3)
                        let compMult = Decimal.pow(base, player.s.compressions)
                        rate = rate.mul(compMult)
                    }
                    return '<span style="font-size:16px;color:#9ca3af;">✦ Nebula</span><br><span style="color:#c084fc;font-weight:bold;font-size:28px;text-shadow:0 0 20px rgba(192,132,252,0.4);">' + format(player[this.layer].nebula) + '</span> <span style="color:#6b7280;font-size:14px;">(+' + format(rate) + '/s)</span>'
                }],
                "blank",
                ["upgrades", [1, 2, 3]],
                "blank",
                ["buyables", [1]],
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
