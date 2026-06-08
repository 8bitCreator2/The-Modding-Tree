addLayer("s", {
    name: "Stars", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
	        stars: new Decimal(0),
	        compressions: new Decimal(0),
	        protostar: new Decimal(0),
	        novaShards: new Decimal(0),
	        instability: new Decimal(0),
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
	if (hasUpgrade("s", 41)) mult = mult.mul(upgradeEffect("s", 41))
	if (hasUpgrade("s", 45)) mult = mult.mul(upgradeEffect("s", 45))
	if (hasUpgrade("s", 46)) mult = mult.mul(upgradeEffect("s", 46))
	if (hasUpgrade("starlayer", 11)) mult = mult.mul(upgradeEffect("starlayer", 11))
	if (hasMilestone("starlayer", 0)) mult = mult.mul(1.5)
	if (hasUpgrade("starlayer", 34) && player[this.layer].protostar.gt(0)) {
		let rawInst = player[this.layer].instability
		if (rawInst.gt(10000)) rawInst = rawInst.pow(0.5).mul(100)
		let instMul = rawInst.div(100).add(1)
		let protoBoost = player[this.layer].protostar.add(1).pow(new Decimal(0.02).mul(instMul))
		if (protoBoost.gt(1e10)) protoBoost = protoBoost.pow(0.5).mul(1e5)
		if (protoBoost.gt(1e20)) protoBoost = protoBoost.pow(0.25).mul(1e15)
		mult = mult.mul(protoBoost)
	}
 	if (player[this.layer].novaShards.gt(0)) {
 		mult = mult.mul(player[this.layer].novaShards.add(1).pow(0.15))
 	}
	let nebBuy11 = getBuyableAmount("starlayer", 11)
	if (nebBuy11.gt(0)) mult = mult.mul(nebBuy11.add(1).pow(0.5))
	let condensed = getBuyableAmount("s", 31)
	if (condensed.gt(0)) {
		let exp = hasUpgrade("starlayer", 23) ? new Decimal(2).mul(upgradeEffect("starlayer", 23)) : new Decimal(2)
		if (hasUpgrade("s", 44)) exp = exp.mul(upgradeEffect("s", 44))
		mult = mult.mul(condensed.add(1).pow(exp))
	}

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

	let rawGain4 = player.points.div(10).pow(0.5).mul(mult)
	if (rawGain4.gt(1e100)) {
		let over4 = rawGain4.div(1e100)
		mult = mult.div(over4.pow(0.5))
	}

	let rawGain5 = player.points.div(10).pow(0.5).mul(mult)
	if (rawGain5.gt(1e150)) {
		let over5 = rawGain5.div(1e150)
		mult = mult.div(over5.pow(0.55))
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
    update(diff) {
        if (hasMilestone("starlayer", 3)) {
            player[this.layer].points = player[this.layer].points.add(getResetGain(this.layer).mul(diff))
        }
        if (hasUpgrade("starlayer", 34) && player[this.layer].points.gte(3e100)) {
            let rate = player[this.layer].points.div(3e100).pow(0.25)
            if (player[this.layer].novaShards.gt(0)) rate = rate.mul(player[this.layer].novaShards.add(1).pow(0.05))
            if (player[this.layer].upgrades.filter(id => id === 11).length >= 2) {
                let nova11 = 3
                if (player[this.layer].upgrades.filter(id => id === 16).length >= 2) nova11 = Math.pow(nova11, 1.3)
                rate = rate.mul(nova11)
            }
            if (player[this.layer].upgrades.filter(id => id === 13).length >= 2) {
                let protoBoost = Math.max(0, Decimal.log10(upgradeEffect("s", 13)))
                if (protoBoost > 0) rate = rate.mul(protoBoost)
            }
            if (player[this.layer].upgrades.filter(id => id === 14).length >= 2) {
                let protoBoost = Math.max(0, Decimal.log10(upgradeEffect("s", 14)))
                if (protoBoost > 0) rate = rate.mul(protoBoost)
            }
            if (player[this.layer].upgrades.filter(id => id === 21).length >= 2) {
                let protoBoost = Math.max(0, Decimal.log10(upgradeEffect("s", 21)))
                if (player[this.layer].upgrades.filter(id => id === 16).length >= 2) protoBoost = Math.pow(protoBoost, 1.3)
                if (protoBoost > 0) rate = rate.mul(protoBoost)
            }
            if (player[this.layer].upgrades.filter(id => id === 22).length >= 2) {
                let protoBoost = Math.max(0, Decimal.log10(upgradeEffect("s", 22)))
                if (protoBoost > 0) rate = rate.mul(protoBoost)
            }
            if (player[this.layer].upgrades.filter(id => id === 31).length >= 2) {
                let protoBoost = Math.max(0, Decimal.log10(upgradeEffect("s", 31)))
                if (player[this.layer].upgrades.filter(id => id === 16).length >= 2) protoBoost = Math.pow(protoBoost, 1.3)
                if (protoBoost > 0) rate = rate.mul(protoBoost)
            }
            if (player[this.layer].upgrades.filter(id => id === 32).length >= 2) {
                let protoBoost = Math.max(0, Decimal.log10(upgradeEffect("s", 32)))
                if (protoBoost > 0) rate = rate.mul(protoBoost)
            }
            if (player[this.layer].upgrades.filter(id => id === 33).length >= 2) {
                let protoBoost = Math.max(0, Decimal.log10(upgradeEffect("s", 33)))
                if (protoBoost > 0) rate = rate.mul(protoBoost)
            }
            if (player[this.layer].upgrades.filter(id => id === 34).length >= 2) {
                let protoBoost = Math.max(0, Decimal.log10(upgradeEffect("s", 34)))
                if (protoBoost > 0) rate = rate.mul(protoBoost)
            }
            if (player[this.layer].upgrades.filter(id => id === 36).length >= 2) {
                let protoBoost = Math.max(0, Decimal.log10(upgradeEffect("s", 36)))
                if (protoBoost > 0) rate = rate.mul(protoBoost)
            }
            if (player[this.layer].upgrades.filter(id => id === 15).length >= 2) {
                let starBoost = player.starlayer.points.pow(2).max(1)
                rate = rate.mul(starBoost)
            }
            player[this.layer].protostar = player[this.layer].protostar.add(rate.mul(diff))
            let canSurpass = player[this.layer].upgrades.filter(id => id === 23).length >= 2
            if (player[this.layer].protostar.gt(0) && (canSurpass || player[this.layer].instability.lt(100))) {
                let instRate = player[this.layer].protostar.pow(0.2).mul(0.01)
                if (canSurpass && player[this.layer].instability.gt(100)) {
                    instRate = instRate.mul(new Decimal(100).div(player[this.layer].instability))
                }
                let newInst = player[this.layer].instability.add(instRate.mul(diff))
                if (!canSurpass) newInst = Decimal.min(newInst, 100)
                player[this.layer].instability = newInst
            }
        }
    },
    automate() {
        if (hasMilestone("starlayer", 3)) buyBuyable("s", 31)
    },
    tabFormat: {
        "Main": {
            content: [
                "main-display",
                "prestige-button",
                "blank",
                ["upgrades", [1, 2, 3, 4]],
                "blank",
                ["display-text", function() {
                    if (player.s.novaShards.gt(0)) {
                        let sBoost = format(player.s.novaShards.add(1).pow(0.15))
                        let mBoost = format(player.s.novaShards.add(1).pow(0.1))
                        return '<span style="color:#c084fc;font-size:12px;">✦ Nova Shard boosts: Stardust x' + sBoost + ' | Matter x' + mBoost + '</span>'
                    }
                    return ''
                }],
                "blank",
                ["display-text", function() {
                    let soft1 = 500000
                    let soft2 = 5e10
                    let soft3 = 2e20
                    let soft4 = 1e100
                    let soft5 = 1e150
                    let base = player.points.div(10).pow(0.5)
                    let protoEst = hasUpgrade("starlayer", 34) && player[this.layer].protostar.gt(0)
                        ? (function(p, rawI){let ri=rawI.gt(10000)?rawI.pow(0.5).mul(100):rawI;let i=ri.div(100).add(1);let b=p.add(1).pow(new Decimal(0.02).mul(i));if(b.gt(1e10))b=b.pow(0.5).mul(1e5);return b.gt(1e20)?b.pow(0.25).mul(1e15):b})(player[this.layer].protostar, player[this.layer].instability)
                        : 1
                    let multEst = new Decimal(1)
                        .mul(hasUpgrade("s", 11) ? upgradeEffect("s", 11) : 1)
                        .mul(hasUpgrade("s", 14) ? upgradeEffect("s", 14) : 1)
                        .mul(hasUpgrade("s", 22) ? upgradeEffect("s", 22) : 1)
                        .mul(hasUpgrade("s", 32) ? upgradeEffect("s", 32) : 1)
                        .mul(hasUpgrade("s", 34) ? upgradeEffect("s", 34) : 1)
                        .mul(hasUpgrade("s", 35) ? upgradeEffect("s", 35) : 1)
                        .mul(hasUpgrade("s", 36) ? upgradeEffect("s", 36) : 1)
                        .mul(hasUpgrade("s", 41) ? upgradeEffect("s", 41) : 1)
                        .mul(hasUpgrade("s", 45) ? upgradeEffect("s", 45) : 1)
                        .mul(hasUpgrade("s", 46) ? upgradeEffect("s", 46) : 1)
                        .mul(hasUpgrade("starlayer", 11) ? upgradeEffect("starlayer", 11) : 1)
                        .mul(hasMilestone("starlayer", 0) ? 1.5 : 1)
                        .mul(protoEst)
                        .mul(getBuyableAmount("s", 31).gt(0) ? getBuyableAmount("s", 31).add(1).pow((hasUpgrade("starlayer", 23) ? new Decimal(2).mul(upgradeEffect("starlayer", 23)) : new Decimal(2)).mul(hasUpgrade("s", 44) ? upgradeEffect("s", 44) : 1)) : 1)

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

                    let raw4 = base.mul(multEst)
                    if (raw4.gt(soft4)) {
                        let over4 = raw4.div(soft4)
                        multEst = multEst.div(over4.pow(0.5))
                        softHits.push("1e100")
                    }

                    let raw5 = base.mul(multEst)
                    if (raw5.gt(soft5)) {
                        let over5 = raw5.div(soft5)
                        multEst = multEst.div(over5.pow(0.55))
                        softHits.push("1e150")
                    }

                    let noSoft = base.mul(
                        new Decimal(1)
                            .mul(hasUpgrade("s", 11) ? upgradeEffect("s", 11) : 1)
                            .mul(hasUpgrade("s", 14) ? upgradeEffect("s", 14) : 1)
                            .mul(hasUpgrade("s", 22) ? upgradeEffect("s", 22) : 1)
                            .mul(hasUpgrade("s", 32) ? upgradeEffect("s", 32) : 1)
                            .mul(hasUpgrade("s", 34) ? upgradeEffect("s", 34) : 1)
                            .mul(hasUpgrade("s", 35) ? upgradeEffect("s", 35) : 1)
                            .mul(hasUpgrade("s", 36) ? upgradeEffect("s", 36) : 1)
                            .mul(hasUpgrade("s", 41) ? upgradeEffect("s", 41) : 1)
                            .mul(hasUpgrade("s", 45) ? upgradeEffect("s", 45) : 1)
                            .mul(hasUpgrade("s", 46) ? upgradeEffect("s", 46) : 1)
                            .mul(hasUpgrade("starlayer", 11) ? upgradeEffect("starlayer", 11) : 1)
                            .mul(hasMilestone("starlayer", 0) ? 1.5 : 1)
                            .mul(protoEst)
                             .mul(getBuyableAmount("s", 31).gt(0) ? getBuyableAmount("s", 31).add(1).pow((hasUpgrade("starlayer", 23) ? new Decimal(2).mul(upgradeEffect("starlayer", 23)) : new Decimal(2)).mul(hasUpgrade("s", 44) ? upgradeEffect("s", 44) : 1)) : 1)
                     )
                    let finalGain = base.mul(multEst)
                    if (softHits.length > 0) {
                        let label = "⚠ Softcap active (" + softHits.join(" & ") + ")"
                        return '<span style="color:#FF8C00;">' + label + '<br>without: ' + format(noSoft) + '/s<br>actual: ' + format(finalGain) + '/s</span>'
                    } else
                        return '<span style="color:#888;">Softcaps at 500k, 5e10, 2e20, 1e100, and 1e150 Stardust gain</span>'
                }]
            ]
        },
        "Condenser": {
            content: [
                "main-display",
                "blank",
                ["display-text", function() {
                    let condensed = getBuyableAmount("s", 31)
                    let text = condensed.gt(0)
                        ? 'Condensed Stardust: <span style="color:#FFB347;font-weight:bold;font-size:24px;text-shadow:0 0 10px #FFB347,0 0 20px #FF8C00;">' + format(condensed) + '</span>'
                        : "No Condensed Stardust"
                    let condExp = (hasUpgrade("starlayer", 23) ? new Decimal(2).mul(upgradeEffect("starlayer", 23)) : new Decimal(2)).mul(hasUpgrade("s", 44) ? upgradeEffect("s", 44) : 1)
                    text += '<br>Stardust boost: ' + (condensed.gt(0) ? format(condensed.add(1).pow(condExp)) : '1') + 'x'
                    if (player.s.compressions.gt(0)) {
                        let base = hasUpgrade("starlayer", 21) ? new Decimal(3).mul(upgradeEffect("starlayer", 21)) : new Decimal(3)
                        let compMult = Decimal.pow(base, player.s.compressions)
                        let baseExp = player.s.compressions.gte(15) ? 20 : (player.s.compressions.gte(10) ? 5 : 3)
                        let costExp = hasUpgrade("starlayer", 32) ? new Decimal(baseExp).div(upgradeEffect("starlayer", 32)) : new Decimal(baseExp)
                        let cost = player.s.compressions.add(1).pow(costExp)
                        text += '<br><br>Compressions: <span style="color:#F8ECC9;text-shadow:0 0 10px #F8ECC9,0 0 20px #e8d48b;font-weight:bold;">' + format(player.s.compressions) + '</span>'
                        text += '<br>Next cost: ' + format(cost) + ' Condensed Stardust'
                        text += '<br>+' + format(compMult) + 'x Matter & Nebula'
                    }
                    return text
                }],
                "blank",
                ["buyable", 31],
                "blank",
                ["clickable", 41],
            ],
            style: {
                "background": "linear-gradient(145deg, #1a0f0a 0%, #2a1a10 50%, #1a0f0a 100%)",
                "border": "1px solid rgba(255,179,71,0.2)",
                "border-radius": "16px",
                "padding": "24px",
                "box-shadow": "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
                "backdrop-filter": "blur(10px)",
            },
        },
        "Protostar": {
            unlocked() { return hasUpgrade("starlayer", 34) },
            content: [
                ["display-text", function() {
                    let rate = player[this.layer].points.gte(3e100) ? player[this.layer].points.div(3e100).pow(0.25) : new Decimal(0)
                    if (player[this.layer].novaShards.gt(0)) rate = rate.mul(player[this.layer].novaShards.add(1).pow(0.05))
                    if (player[this.layer].upgrades.filter(id => id === 11).length >= 2) {
                        let nova11 = 3
                        if (player[this.layer].upgrades.filter(id => id === 16).length >= 2) nova11 = Math.pow(nova11, 1.3)
                        rate = rate.mul(nova11)
                    }
                    ;[13, 14, 22, 32, 33, 34, 36].forEach(id => {
                        if (player[this.layer].upgrades.filter(x => x === id).length >= 2) {
                            let b = Math.max(0, Decimal.log10(upgradeEffect("s", id)))
                            if (b > 0) rate = rate.mul(b)
                        }
                    })
                    ;[21, 31].forEach(id => {
                        if (player[this.layer].upgrades.filter(x => x === id).length >= 2) {
                            let b = Math.max(0, Decimal.log10(upgradeEffect("s", id)))
                            if (player[this.layer].upgrades.filter(x => x === 16).length >= 2) b = Math.pow(b, 1.3)
                            if (b > 0) rate = rate.mul(b)
                        }
                    })
                    if (player[this.layer].upgrades.filter(id => id === 15).length >= 2) {
                        rate = rate.mul(player.starlayer.points.add(1).pow(2))
                    }
                    let totalRate = rate
                    let rawInst = player[this.layer].instability
                    if (rawInst.gt(10000)) rawInst = rawInst.pow(0.5).mul(100)
                    let instMul = rawInst.div(100).add(1)
                    let protoBoostVal = player[this.layer].protostar.gt(0) ? player[this.layer].protostar.add(1).pow(new Decimal(0.02).mul(instMul)) : new Decimal(1)
                    if (protoBoostVal.gt(1e10)) protoBoostVal = protoBoostVal.pow(0.5).mul(1e5)
                    if (protoBoostVal.gt(1e20)) protoBoostVal = protoBoostVal.pow(0.25).mul(1e15)
                    let boost = format(protoBoostVal)
                    let shardBoostS = player[this.layer].novaShards.gt(0) ? format(player[this.layer].novaShards.add(1).pow(0.15)) : "1"
                    let shardBoostM = player[this.layer].novaShards.gt(0) ? format(player[this.layer].novaShards.add(1).pow(0.1)) : "1"
                    let shardBoostN = shardBoostM
                    return '<span style="font-size:16px;color:#ff6b6b;">✦ Protostar</span><br><span style="color:#ff6b6b;font-weight:bold;font-size:28px;text-shadow:0 0 20px rgba(255,107,107,0.4);">' + format(player[this.layer].protostar) + '</span>' +
                        '<br><span style="font-size:14px;color:#ff8c8c;">+' + format(totalRate) + '/s</span>' +
                        '<br><span style="font-size:14px;color:#ff8c8c;">Boosts Stardust: ' + boost + 'x</span>'
                }],
                "blank",
                ["clickable", 42],
                "blank",
                ["clickable", 43],
                "blank",
                ["display-text", function() {
                    let rawInst = player[this.layer].instability
                    if (rawInst.gt(10000)) rawInst = rawInst.pow(0.5).mul(100)
                    let instMul = rawInst.div(100).add(1)
                    let canSurpass = player[this.layer].upgrades.filter(id => id === 23).length >= 2
                    let instPct = player[this.layer].instability.toFixed(1)
                    let instColor = player[this.layer].instability.gte(100) ? (canSurpass ? "#00ff88" : "#ff0000") : player[this.layer].instability.gt(50) ? "#ff6600" : "#ff8c8c"
                    let text = '<span style="font-size:16px;color:#ff4444;">⚠ Instability: <span style="color:' + instColor + ';">' + instPct + '%</span></span>' +
                        '<br><span style="font-size:12px;color:#ff8c8c;">Boost: x' + format(instMul) + ' to Protostar\'s Stardust effect</span>'
                    if (canSurpass && player[this.layer].instability.gt(100)) {
                        text += '<br><span style="font-size:11px;color:#00ff88;">Nova Shards x' + format(player[this.layer].instability.div(100)) + ' from excess instability</span>'
                    }
                    return text
                }],
                "blank",
                ["display-text", function() {
                    let shardBoostS = player[this.layer].novaShards.gt(0) ? format(player[this.layer].novaShards.add(1).pow(0.15)) : "1"
                    let shardBoostM = player[this.layer].novaShards.gt(0) ? format(player[this.layer].novaShards.add(1).pow(0.1)) : "1"
                    let shardBoostN = shardBoostM
                    return '<span style="font-size:16px;color:#c084fc;">✦ Nova Shards: <span style="font-weight:bold;">' + format(player[this.layer].novaShards) + '</span></span>' +
                        '<br><span style="font-size:12px;color:#888;">Stardust x' + shardBoostS + ' | Matter x' + shardBoostM + ' | Nebula x' + shardBoostN + '</span>'
                }],
                "blank",
                ["display-text", function() {
                    return '<span style="font-size:12px;color:#888;">Purchased upgrades can be rebought for Nova Shards to empower them.</span>'
                }],
            ],
            style: {
                "background": "linear-gradient(145deg, #1a0a0a 0%, #2a1010 50%, #1a0a0a 100%)",
                "border": "1px solid rgba(255,107,107,0.2)",
                "border-radius": "16px",
                "padding": "24px",
                "box-shadow": "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
                "backdrop-filter": "blur(10px)",
            },
        },
    },
    upgrades: {
        cols: 6,
        rows: 4,
        11: {
            title: "Stardust Creation",
            description: "Stardust is boosted",
            effect() {
                let base = new Decimal(2)
                if (hasUpgrade("s", 24)) base = base.mul(upgradeEffect("s", 24))
                if (hasUpgrade("s", 15)) base = base.mul(upgradeEffect("s", 15))
                if (hasUpgrade("s", 16)) base = base.pow(1.3)
                if (hasUpgrade("starlayer", 24)) base = base.mul(upgradeEffect("starlayer", 24))
                return base
            },
            effectDisplay() {
                let owned = player.s.upgrades.filter(id => id === 11).length
                let text = format(upgradeEffect("s", 11)) + "x"
                if (owned >= 2) text += ' <span style="color:#ff6b6b;">| Protostar x3</span>'
                return text
            },
            canAfford() {
                let owned = player.s.upgrades.filter(id => id === 11).length
                if (owned >= 2) return false
                if (owned >= 1) return hasUpgrade("starlayer", 34) && player.s.novaShards.gte(10)
                return player.s.points.gte(5)
            },
            pay() {
                let owned = player.s.upgrades.filter(id => id === 11).length
                if (owned >= 1) player.s.novaShards = player.s.novaShards.sub(10)
                else player.s.points = player.s.points.sub(5)
            },
            fullDisplay() {
                let owned = player.s.upgrades.filter(id => id === 11).length
                let effectVal = format(upgradeEffect("s", 11))
                if (owned === 0) {
                    return '<h3>Stardust Creation</h3><br>Stardust is boosted<br>Currently: ' + effectVal + 'x<br><br>Cost: 5 Stardust'
                } else if (owned === 1) {
                    if (!hasUpgrade("starlayer", 34)) {
                        return '<h3>Stardust Creation</h3><br>Stardust is boosted<br>Currently: ' + effectVal + 'x<br><br>Cost: 5 Stardust'
                    }
                    let canAff = player.s.novaShards.gte(10)
                    let color = canAff ? '#F8ECC9' : '#666'
                    return '<h3>Stardust Creation</h3><br>Stardust is boosted<br>Currently: ' + effectVal + 'x<br><br>Cost: <span style="color:' + color + ';">10 Nova Shards</span>'
                } else {
                    return '<h3 style="color:#ff6b6b;">✦ Stardust Creation</h3><br>Stardust is boosted: <span style="color:#F8ECC9;">' + effectVal + 'x</span><br>Protostar rate: <span style="color:#F8ECC9;">3x</span>'
                }
            },
            style() {
                let owned = player.s.upgrades.filter(id => id === 11).length
                if (owned >= 2) {
                    return {
                        "background": "linear-gradient(135deg, #2a0a0a 0%, #4a1010 100%)",
                        "border": "2px solid rgba(255,107,107,0.4)",
                        "border-radius": "12px",
                        "box-shadow": "0 4px 15px rgba(255,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
                        "color": "#ff6b6b",
                        "padding": "8px",
                        "font-family": "'Segoe UI', sans-serif",
                        "transition": "all 0.3s ease",
                    }
                }
                if (owned === 1 && hasUpgrade("starlayer", 34) && player.s.novaShards.gte(10)) {
                    return {
                        "background": "linear-gradient(135deg, #2a1a0a 0%, #4a2a10 100%)",
                        "border": "2px solid rgba(255,179,71,0.6)",
                        "border-radius": "12px",
                        "box-shadow": "0 0 20px rgba(255,179,71,0.3), 0 4px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
                        "color": "#F8ECC9",
                        "text-shadow": "0 0 8px rgba(255,179,71,0.4)",
                        "padding": "8px",
                        "font-family": "'Segoe UI', sans-serif",
                        "cursor": "pointer",
                        "transition": "all 0.3s ease",
                    }
                }
                return {}
            },
            unlocked() { return true },
        },
        12: {
            title: "Matter Cannot Be Created",
            description: "Matter gain is boosted",
            effect() {
                let base = new Decimal(3)
                if (hasUpgrade("s", 24)) base = base.mul(upgradeEffect("s", 24))
                if (hasUpgrade("s", 15)) base = base.mul(upgradeEffect("s", 15))
                if (hasUpgrade("s", 16)) base = base.pow(1.3)
                if (hasUpgrade("starlayer", 24)) base = base.mul(upgradeEffect("starlayer", 24))
                if (player.s.upgrades.filter(id => id === 12).length >= 2) base = base.pow(1.4)
                return base
            },
            effectDisplay() {
                return format(upgradeEffect("s", 12)) + "x"
            },
            canAfford() {
                let owned = player.s.upgrades.filter(id => id === 12).length
                if (owned >= 2) return false
                if (owned >= 1) return hasUpgrade("starlayer", 34) && player.s.novaShards.gte(15)
                return player.s.points.gte(10)
            },
            pay() {
                let owned = player.s.upgrades.filter(id => id === 12).length
                if (owned >= 1) player.s.novaShards = player.s.novaShards.sub(15)
                else player.s.points = player.s.points.sub(10)
            },
            fullDisplay() {
                let owned = player.s.upgrades.filter(id => id === 12).length
                let effectVal = format(upgradeEffect("s", 12))
                if (owned === 0) {
                    return '<h3>Matter Cannot Be Created</h3><br>Matter gain is boosted<br>Currently: ' + effectVal + 'x<br><br>Cost: 10 Stardust'
                } else if (owned === 1) {
                    if (!hasUpgrade("starlayer", 34)) {
                        return '<h3>Matter Cannot Be Created</h3><br>Matter gain is boosted<br>Currently: ' + effectVal + 'x<br><br>Cost: 10 Stardust'
                    }
                    let canAff = player.s.novaShards.gte(15)
                    let color = canAff ? '#F8ECC9' : '#666'
                    return '<h3>Matter Cannot Be Created</h3><br>Matter gain is boosted: <span style="color:#F8ECC9;">' + effectVal + 'x</span><br><br>Cost: <span style="color:' + color + ';">15 Nova Shards</span>'
                } else {
                    return '<h3 style="color:#ff6b6b;">✦ Matter Cannot Be Created</h3><br>Matter gain is boosted: <span style="color:#F8ECC9;">' + effectVal + 'x</span><br>Effect ^1.4'
                }
            },
            style() {
                let owned = player.s.upgrades.filter(id => id === 12).length
                if (owned >= 2) {
                    return {
                        "background": "linear-gradient(135deg, #2a0a0a 0%, #4a1010 100%)",
                        "border": "2px solid rgba(255,107,107,0.4)",
                        "border-radius": "12px",
                        "box-shadow": "0 4px 15px rgba(255,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
                        "color": "#ff6b6b",
                        "padding": "8px",
                        "font-family": "'Segoe UI', sans-serif",
                        "transition": "all 0.3s ease",
                    }
                }
                if (owned === 1 && hasUpgrade("starlayer", 34) && player.s.novaShards.gte(15)) {
                    return {
                        "background": "linear-gradient(135deg, #2a1a0a 0%, #4a2a10 100%)",
                        "border": "2px solid rgba(255,179,71,0.6)",
                        "border-radius": "12px",
                        "box-shadow": "0 0 20px rgba(255,179,71,0.3), 0 4px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
                        "color": "#F8ECC9",
                        "text-shadow": "0 0 8px rgba(255,179,71,0.4)",
                        "padding": "8px",
                        "font-family": "'Segoe UI', sans-serif",
                        "cursor": "pointer",
                        "transition": "all 0.3s ease",
                    }
                }
                return {}
            },
            unlocked() { return true },
        },
        13: {
            title: "Stellar Enhancement",
            description: "Stardust boosts Matter gain",
            effect() {
                let base = player.s.points.add(1).pow(0.5)
                if (hasUpgrade("s", 25)) base = base.mul(upgradeEffect("s", 25))
                return base
            },
            effectDisplay() {
                let owned = player.s.upgrades.filter(id => id === 13).length
                let text = format(upgradeEffect("s", 13)) + "x"
                if (owned >= 2) {
                    let protoBoost = Math.max(0, Decimal.log10(upgradeEffect("s", 13)))
                    text += ' <span style="color:#ff6b6b;">| Protostar x' + format(protoBoost) + '</span>'
                }
                return text
            },
            canAfford() {
                let owned = player.s.upgrades.filter(id => id === 13).length
                if (owned >= 2) return false
                if (owned >= 1) return hasUpgrade("starlayer", 34) && player.s.novaShards.gte(50)
                return player.s.points.gte(30)
            },
            pay() {
                let owned = player.s.upgrades.filter(id => id === 13).length
                if (owned >= 1) player.s.novaShards = player.s.novaShards.sub(50)
                else player.s.points = player.s.points.sub(30)
            },
            fullDisplay() {
                let owned = player.s.upgrades.filter(id => id === 13).length
                let effectVal = format(upgradeEffect("s", 13))
                if (owned === 0) {
                    return '<h3>Stellar Enhancement</h3><br>Stardust boosts Matter gain<br>Currently: ' + effectVal + 'x<br><br>Cost: 30 Stardust'
                } else if (owned === 1) {
                    if (!hasUpgrade("starlayer", 34)) {
                        return '<h3>Stellar Enhancement</h3><br>Stardust boosts Matter gain<br>Currently: ' + effectVal + 'x<br><br>Cost: 30 Stardust'
                    }
                    let canAff = player.s.novaShards.gte(50)
                    let color = canAff ? '#F8ECC9' : '#666'
                    return '<h3>Stellar Enhancement</h3><br>Stardust boosts Matter gain<br>Currently: ' + effectVal + 'x<br><br>Cost: <span style="color:' + color + ';">50 Nova Shards</span>'
                } else {
                    let protoBoost = Math.max(0, Decimal.log10(upgradeEffect("s", 13)))
                    return '<h3 style="color:#ff6b6b;">✦ Stellar Enhancement</h3><br>Stardust boosts Matter gain: <span style="color:#F8ECC9;">' + effectVal + 'x</span><br>Protostar rate: <span style="color:#F8ECC9;">x' + format(protoBoost) + '</span>'
                }
            },
            style() {
                let owned = player.s.upgrades.filter(id => id === 13).length
                if (owned >= 2) {
                    return {
                        "background": "linear-gradient(135deg, #2a0a0a 0%, #4a1010 100%)",
                        "border": "2px solid rgba(255,107,107,0.4)",
                        "border-radius": "12px",
                        "box-shadow": "0 4px 15px rgba(255,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
                        "color": "#ff6b6b",
                        "padding": "8px",
                        "font-family": "'Segoe UI', sans-serif",
                        "transition": "all 0.3s ease",
                    }
                }
                if (owned === 1 && hasUpgrade("starlayer", 34) && player.s.novaShards.gte(50)) {
                    return {
                        "background": "linear-gradient(135deg, #2a1a0a 0%, #4a2a10 100%)",
                        "border": "2px solid rgba(255,179,71,0.6)",
                        "border-radius": "12px",
                        "box-shadow": "0 0 20px rgba(255,179,71,0.3), 0 4px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
                        "color": "#F8ECC9",
                        "text-shadow": "0 0 8px rgba(255,179,71,0.4)",
                        "padding": "8px",
                        "font-family": "'Segoe UI', sans-serif",
                        "cursor": "pointer",
                        "transition": "all 0.3s ease",
                    }
                }
                return {}
            },
            unlocked() { return true },
        },
        14: {
            title: "Matter Attraction",
            description: "Matter boosts Stardust gain",
            effect() {
                let base = player.points.add(1).pow(0.5).div(3).max(1)
                if (hasUpgrade("s", 25)) base = base.mul(upgradeEffect("s", 25))
                return base
            },
            effectDisplay() {
                let owned = player.s.upgrades.filter(id => id === 14).length
                let text = format(upgradeEffect("s", 14)) + "x"
                if (owned >= 2) {
                    let protoBoost = Math.max(0, Decimal.log10(upgradeEffect("s", 14)))
                    text += ' <span style="color:#ff6b6b;">| Protostar x' + format(protoBoost) + '</span>'
                }
                return text
            },
            canAfford() {
                let owned = player.s.upgrades.filter(id => id === 14).length
                if (owned >= 2) return false
                if (owned >= 1) return hasUpgrade("starlayer", 34) && player.s.novaShards.gte(500)
                return player.s.points.gte(250)
            },
            pay() {
                let owned = player.s.upgrades.filter(id => id === 14).length
                if (owned >= 1) player.s.novaShards = player.s.novaShards.sub(500)
                else player.s.points = player.s.points.sub(250)
            },
            fullDisplay() {
                let owned = player.s.upgrades.filter(id => id === 14).length
                let effectVal = format(upgradeEffect("s", 14))
                if (owned === 0) {
                    return '<h3>Matter Attraction</h3><br>Matter boosts Stardust gain<br>Currently: ' + effectVal + 'x<br><br>Cost: 250 Stardust'
                } else if (owned === 1) {
                    if (!hasUpgrade("starlayer", 34)) {
                        return '<h3>Matter Attraction</h3><br>Matter boosts Stardust gain<br>Currently: ' + effectVal + 'x<br><br>Cost: 250 Stardust'
                    }
                    let canAff = player.s.novaShards.gte(500)
                    let color = canAff ? '#F8ECC9' : '#666'
                    return '<h3>Matter Attraction</h3><br>Matter boosts Stardust gain<br>Currently: ' + effectVal + 'x<br><br>Cost: <span style="color:' + color + ';">500 Nova Shards</span>'
                } else {
                    let protoBoost = Math.max(0, Decimal.log10(upgradeEffect("s", 14)))
                    return '<h3 style="color:#ff6b6b;">✦ Matter Attraction</h3><br>Matter boosts Stardust gain: <span style="color:#F8ECC9;">' + effectVal + 'x</span><br>Protostar rate: <span style="color:#F8ECC9;">x' + format(protoBoost) + '</span>'
                }
            },
            style() {
                let owned = player.s.upgrades.filter(id => id === 14).length
                if (owned >= 2) {
                    return {
                        "background": "linear-gradient(135deg, #2a0a0a 0%, #4a1010 100%)",
                        "border": "2px solid rgba(255,107,107,0.4)",
                        "border-radius": "12px",
                        "box-shadow": "0 4px 15px rgba(255,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
                        "color": "#ff6b6b",
                        "padding": "8px",
                        "font-family": "'Segoe UI', sans-serif",
                        "transition": "all 0.3s ease",
                    }
                }
                if (owned === 1 && hasUpgrade("starlayer", 34) && player.s.novaShards.gte(500)) {
                    return {
                        "background": "linear-gradient(135deg, #2a1a0a 0%, #4a2a10 100%)",
                        "border": "2px solid rgba(255,179,71,0.6)",
                        "border-radius": "12px",
                        "box-shadow": "0 0 20px rgba(255,179,71,0.3), 0 4px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
                        "color": "#F8ECC9",
                        "text-shadow": "0 0 8px rgba(255,179,71,0.4)",
                        "padding": "8px",
                        "font-family": "'Segoe UI', sans-serif",
                        "cursor": "pointer",
                        "transition": "all 0.3s ease",
                    }
                }
                return {}
            },
            unlocked() { return true },
        },
        15: {
            title: "Star Power",
            description: "Each Star boosts Upgrades 11, 12, and 24",
            effect() {
                return player.starlayer.points.add(1)
            },
            effectDisplay() {
                let owned = player.s.upgrades.filter(id => id === 15).length
                let text = format(upgradeEffect("s", 15)) + "x"
                if (owned >= 2) {
                    let starBoost = player.starlayer.points.add(1).pow(2)
                    text += ' <span style="color:#ff6b6b;">| Protostar x' + format(starBoost) + '</span>'
                }
                return text
            },
            canAfford() {
                let owned = player.s.upgrades.filter(id => id === 15).length
                if (owned >= 2) return false
                if (owned >= 1) return hasUpgrade("starlayer", 34) && player.s.novaShards.gte(10000)
                return player.s.points.gte(500000)
            },
            pay() {
                let owned = player.s.upgrades.filter(id => id === 15).length
                if (owned >= 1) player.s.novaShards = player.s.novaShards.sub(10000)
                else player.s.points = player.s.points.sub(500000)
            },
            fullDisplay() {
                let owned = player.s.upgrades.filter(id => id === 15).length
                let effectVal = format(upgradeEffect("s", 15))
                if (owned === 0) {
                    return '<h3>Star Power</h3><br>Each Star boosts Upgrades 11, 12, and 24<br>Currently: ' + effectVal + 'x<br><br>Cost: 500000 Stardust'
                } else if (owned === 1) {
                    if (!hasUpgrade("starlayer", 34)) {
                        return '<h3>Star Power</h3><br>Each Star boosts Upgrades 11, 12, and 24<br>Currently: ' + effectVal + 'x<br><br>Cost: 500000 Stardust'
                    }
                    let canAff = player.s.novaShards.gte(10000)
                    let color = canAff ? '#F8ECC9' : '#666'
                    return '<h3>Star Power</h3><br>Each Star boosts Upgrades 11, 12, and 24<br>Currently: ' + effectVal + 'x<br><br>Cost: <span style="color:' + color + ';">10000 Nova Shards</span>'
                } else {
                    let starBoost = player.starlayer.points.add(1).pow(2)
                    return '<h3 style="color:#ff6b6b;">✦ Star Power</h3><br>Each Star boosts Upgrades 11, 12, and 24: <span style="color:#F8ECC9;">' + effectVal + 'x</span><br>Protostar rate: <span style="color:#F8ECC9;">x' + format(starBoost) + '</span>'
                }
            },
            style() {
                let owned = player.s.upgrades.filter(id => id === 15).length
                if (owned >= 2) {
                    return {
                        "background": "linear-gradient(135deg, #2a0a0a 0%, #4a1010 100%)",
                        "border": "2px solid rgba(255,107,107,0.4)",
                        "border-radius": "12px",
                        "box-shadow": "0 4px 15px rgba(255,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
                        "color": "#ff6b6b",
                        "padding": "8px",
                        "font-family": "'Segoe UI', sans-serif",
                        "transition": "all 0.3s ease",
                    }
                }
                if (owned === 1 && hasUpgrade("starlayer", 34) && player.s.novaShards.gte(10000)) {
                    return {
                        "background": "linear-gradient(135deg, #2a1a0a 0%, #4a2a10 100%)",
                        "border": "2px solid rgba(255,179,71,0.6)",
                        "border-radius": "12px",
                        "box-shadow": "0 0 20px rgba(255,179,71,0.3), 0 4px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
                        "color": "#F8ECC9",
                        "text-shadow": "0 0 8px rgba(255,179,71,0.4)",
                        "padding": "8px",
                        "font-family": "'Segoe UI', sans-serif",
                        "cursor": "pointer",
                        "transition": "all 0.3s ease",
                    }
                }
                return {}
            },
            unlocked() { return hasMilestone("starlayer", 0) },
        },
        16: {
            title: "Stellar Amplification",
            description: "Upgrades 11 and 12 are raised to ^1.3 after all effects",
            effect() {
                return new Decimal(1.3)
            },
            effectDisplay() {
                let owned = player.s.upgrades.filter(id => id === 16).length
                let text = "^" + format(upgradeEffect("s", 16))
                if (owned >= 2) text += ' <span style="color:#ff6b6b;">| Nova 11/21/31 x1.3</span>'
                return text
            },
            canAfford() {
                let owned = player.s.upgrades.filter(id => id === 16).length
                if (owned >= 2) return false
                if (owned >= 1) return hasUpgrade("starlayer", 34) && player.s.novaShards.gte(3e10)
                return player.s.points.gte("5e26")
            },
            pay() {
                let owned = player.s.upgrades.filter(id => id === 16).length
                if (owned >= 1) player.s.novaShards = player.s.novaShards.sub(3e10)
                else player.s.points = player.s.points.sub("5e26")
            },
            fullDisplay() {
                let owned = player.s.upgrades.filter(id => id === 16).length
                let effectVal = "^" + format(upgradeEffect("s", 16))
                if (owned === 0) {
                    return '<h3>Stellar Amplification</h3><br>Upgrades 11 and 12 are raised to ^1.3<br>Currently: ' + effectVal + '<br><br>Cost: 5e26 Stardust'
                } else if (owned === 1) {
                    if (!hasUpgrade("starlayer", 34)) {
                        return '<h3>Stellar Amplification</h3><br>Upgrades 11 and 12 are raised to ^1.3<br>Currently: ' + effectVal + '<br><br>Cost: 5e26 Stardust'
                    }
                    let canAff = player.s.novaShards.gte(3e10)
                    let color = canAff ? '#F8ECC9' : '#666'
                    return '<h3>Stellar Amplification</h3><br>Upgrades 11 and 12 are raised to ^1.3<br>Currently: ' + effectVal + '<br><br>Cost: <span style="color:' + color + ';">3e10 Nova Shards</span>'
                } else {
                    return '<h3 style="color:#ff6b6b;">✦ Stellar Amplification</h3><br>Upgrades 11 and 12 are raised to ^1.3: <span style="color:#F8ECC9;">' + effectVal + '</span><br>Protostar from 11/21/31: <span style="color:#F8ECC9;">^1.3</span>'
                }
            },
            style() {
                let owned = player.s.upgrades.filter(id => id === 16).length
                if (owned >= 2) {
                    return {
                        "background": "linear-gradient(135deg, #2a0a0a 0%, #4a1010 100%)",
                        "border": "2px solid rgba(255,107,107,0.4)",
                        "border-radius": "12px",
                        "box-shadow": "0 4px 15px rgba(255,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
                        "color": "#ff6b6b",
                        "padding": "8px",
                        "font-family": "'Segoe UI', sans-serif",
                        "transition": "all 0.3s ease",
                    }
                }
                if (owned === 1 && hasUpgrade("starlayer", 34) && player.s.novaShards.gte(3e10)) {
                    return {
                        "background": "linear-gradient(135deg, #2a1a0a 0%, #4a2a10 100%)",
                        "border": "2px solid rgba(255,179,71,0.6)",
                        "border-radius": "12px",
                        "box-shadow": "0 0 20px rgba(255,179,71,0.3), 0 4px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
                        "color": "#F8ECC9",
                        "text-shadow": "0 0 8px rgba(255,179,71,0.4)",
                        "padding": "8px",
                        "font-family": "'Segoe UI', sans-serif",
                        "cursor": "pointer",
                        "transition": "all 0.3s ease",
                    }
                }
                return {}
            },
            unlocked() { return hasMilestone("starlayer", 1) },
        },
        21: {
            title: "Matter Loop",
            description: "Matter boosts its own gain",
            effect() {
                let base = player.points.add(1).pow(0.09)
                if (hasUpgrade("s", 26)) base = base.mul(upgradeEffect("s", 26))
                return base
            },
            effectDisplay() {
                let owned = player.s.upgrades.filter(id => id === 21).length
                let text = format(upgradeEffect("s", 21)) + "x"
                if (owned >= 2) {
                    let protoBoost = Math.max(0, Decimal.log10(upgradeEffect("s", 21)))
                    text += ' <span style="color:#ff6b6b;">| Protostar x' + format(protoBoost) + '</span>'
                }
                return text
            },
            canAfford() {
                let owned = player.s.upgrades.filter(id => id === 21).length
                if (owned >= 2) return false
                if (owned >= 1) return hasUpgrade("starlayer", 34) && player.s.novaShards.gte(2000)
                return player.s.points.gte(1000)
            },
            pay() {
                let owned = player.s.upgrades.filter(id => id === 21).length
                if (owned >= 1) player.s.novaShards = player.s.novaShards.sub(2000)
                else player.s.points = player.s.points.sub(1000)
            },
            fullDisplay() {
                let owned = player.s.upgrades.filter(id => id === 21).length
                let effectVal = format(upgradeEffect("s", 21))
                if (owned === 0) {
                    return '<h3>Matter Loop</h3><br>Matter boosts its own gain<br>Currently: ' + effectVal + 'x<br><br>Cost: 1000 Stardust'
                } else if (owned === 1) {
                    if (!hasUpgrade("starlayer", 34)) {
                        return '<h3>Matter Loop</h3><br>Matter boosts its own gain<br>Currently: ' + effectVal + 'x<br><br>Cost: 1000 Stardust'
                    }
                    let canAff = player.s.novaShards.gte(2000)
                    let color = canAff ? '#F8ECC9' : '#666'
                    return '<h3>Matter Loop</h3><br>Matter boosts its own gain<br>Currently: ' + effectVal + 'x<br><br>Cost: <span style="color:' + color + ';">2000 Nova Shards</span>'
                } else {
                    let protoBoost = Math.max(0, Decimal.log10(upgradeEffect("s", 21)))
                    return '<h3 style="color:#ff6b6b;">✦ Matter Loop</h3><br>Matter boosts its own gain: <span style="color:#F8ECC9;">' + effectVal + 'x</span><br>Protostar rate: <span style="color:#F8ECC9;">x' + format(protoBoost) + '</span>'
                }
            },
            style() {
                let owned = player.s.upgrades.filter(id => id === 21).length
                if (owned >= 2) {
                    return {
                        "background": "linear-gradient(135deg, #2a0a0a 0%, #4a1010 100%)",
                        "border": "2px solid rgba(255,107,107,0.4)",
                        "border-radius": "12px",
                        "box-shadow": "0 4px 15px rgba(255,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
                        "color": "#ff6b6b",
                        "padding": "8px",
                        "font-family": "'Segoe UI', sans-serif",
                        "transition": "all 0.3s ease",
                    }
                }
                if (owned === 1 && hasUpgrade("starlayer", 34) && player.s.novaShards.gte(2000)) {
                    return {
                        "background": "linear-gradient(135deg, #2a1a0a 0%, #4a2a10 100%)",
                        "border": "2px solid rgba(255,179,71,0.6)",
                        "border-radius": "12px",
                        "box-shadow": "0 0 20px rgba(255,179,71,0.3), 0 4px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
                        "color": "#F8ECC9",
                        "text-shadow": "0 0 8px rgba(255,179,71,0.4)",
                        "padding": "8px",
                        "font-family": "'Segoe UI', sans-serif",
                        "cursor": "pointer",
                        "transition": "all 0.3s ease",
                    }
                }
                return {}
            },
            unlocked() { return getBuyableAmount("s", 31).gte(1) },
        },
        22: {
            title: "Stardust Loop",
            description: "Stardust boosts its own gain",
            effect() {
                let base = player.s.points.add(1).pow(0.105)
                if (hasUpgrade("s", 26)) base = base.mul(upgradeEffect("s", 26))
                return base
            },
            effectDisplay() {
                let owned = player.s.upgrades.filter(id => id === 22).length
                let text = format(upgradeEffect("s", 22)) + "x"
                if (owned >= 2) {
                    let protoBoost = Math.max(0, Decimal.log10(upgradeEffect("s", 22)))
                    text += ' <span style="color:#ff6b6b;">| Protostar x' + format(protoBoost) + '</span>'
                }
                return text
            },
            canAfford() {
                let owned = player.s.upgrades.filter(id => id === 22).length
                if (owned >= 2) return false
                if (owned >= 1) return hasUpgrade("starlayer", 34) && player.s.novaShards.gte(5000)
                return player.s.points.gte(5000)
            },
            pay() {
                let owned = player.s.upgrades.filter(id => id === 22).length
                if (owned >= 1) player.s.novaShards = player.s.novaShards.sub(5000)
                else player.s.points = player.s.points.sub(5000)
            },
            fullDisplay() {
                let owned = player.s.upgrades.filter(id => id === 22).length
                let effectVal = format(upgradeEffect("s", 22))
                if (owned === 0) {
                    return '<h3>Stardust Loop</h3><br>Stardust boosts its own gain<br>Currently: ' + effectVal + 'x<br><br>Cost: 5000 Stardust'
                } else if (owned === 1) {
                    if (!hasUpgrade("starlayer", 34)) {
                        return '<h3>Stardust Loop</h3><br>Stardust boosts its own gain<br>Currently: ' + effectVal + 'x<br><br>Cost: 5000 Stardust'
                    }
                    let canAff = player.s.novaShards.gte(5000)
                    let color = canAff ? '#F8ECC9' : '#666'
                    return '<h3>Stardust Loop</h3><br>Stardust boosts its own gain<br>Currently: ' + effectVal + 'x<br><br>Cost: <span style="color:' + color + ';">5000 Nova Shards</span>'
                } else {
                    let protoBoost = Math.max(0, Decimal.log10(upgradeEffect("s", 22)))
                    return '<h3 style="color:#ff6b6b;">✦ Stardust Loop</h3><br>Stardust boosts its own gain: <span style="color:#F8ECC9;">' + effectVal + 'x</span><br>Protostar rate: <span style="color:#F8ECC9;">x' + format(protoBoost) + '</span>'
                }
            },
            style() {
                let owned = player.s.upgrades.filter(id => id === 22).length
                if (owned >= 2) {
                    return {
                        "background": "linear-gradient(135deg, #2a0a0a 0%, #4a1010 100%)",
                        "border": "2px solid rgba(255,107,107,0.4)",
                        "border-radius": "12px",
                        "box-shadow": "0 4px 15px rgba(255,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
                        "color": "#ff6b6b",
                        "padding": "8px",
                        "font-family": "'Segoe UI', sans-serif",
                        "transition": "all 0.3s ease",
                    }
                }
                if (owned === 1 && hasUpgrade("starlayer", 34) && player.s.novaShards.gte(5000)) {
                    return {
                        "background": "linear-gradient(135deg, #2a1a0a 0%, #4a2a10 100%)",
                        "border": "2px solid rgba(255,179,71,0.6)",
                        "border-radius": "12px",
                        "box-shadow": "0 0 20px rgba(255,179,71,0.3), 0 4px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
                        "color": "#F8ECC9",
                        "text-shadow": "0 0 8px rgba(255,179,71,0.4)",
                        "padding": "8px",
                        "font-family": "'Segoe UI', sans-serif",
                        "cursor": "pointer",
                        "transition": "all 0.3s ease",
                    }
                }
                return {}
            },
            unlocked() { return hasUpgrade("s", 21) },
        },
        23: {
            title: "Matter Amplifier",
            description: "2x Matter gain",
            effect() {
                return new Decimal(2)
            },
            effectDisplay() {
                let owned = player.s.upgrades.filter(id => id === 23).length
                let text = format(upgradeEffect("s", 23)) + "x"
                if (owned >= 2) text += ' <span style="color:#ff6b6b;">| surpass 100% instability</span>'
                return text
            },
            canAfford() {
                let owned = player.s.upgrades.filter(id => id === 23).length
                if (owned >= 2) return false
                if (owned >= 1) return hasUpgrade("starlayer", 34) && player.s.novaShards.gte(75000)
                return player.s.points.gte(10000000)
            },
            pay() {
                let owned = player.s.upgrades.filter(id => id === 23).length
                if (owned >= 1) player.s.novaShards = player.s.novaShards.sub(75000)
                else player.s.points = player.s.points.sub(10000000)
            },
            fullDisplay() {
                let owned = player.s.upgrades.filter(id => id === 23).length
                let effectVal = format(upgradeEffect("s", 23))
                if (owned === 0) {
                    return '<h3>Matter Amplifier</h3><br>2x Matter gain<br>Currently: ' + effectVal + 'x<br><br>Cost: 10M Stardust'
                } else if (owned === 1) {
                    if (!hasUpgrade("starlayer", 34)) {
                        return '<h3>Matter Amplifier</h3><br>2x Matter gain<br>Currently: ' + effectVal + 'x<br><br>Cost: 10M Stardust'
                    }
                    let canAff = player.s.novaShards.gte(75000)
                    let color = canAff ? '#F8ECC9' : '#666'
                    return '<h3>Matter Amplifier</h3><br>2x Matter gain<br>Currently: ' + effectVal + 'x<br><br>Cost: <span style="color:' + color + ';">75000 Nova Shards</span>'
                } else {
                    return '<h3 style="color:#ff6b6b;">✦ Matter Amplifier</h3><br>2x Matter gain: <span style="color:#F8ECC9;">' + effectVal + 'x</span><br>Instability can surpass 100%<br>Excess instability boosts Nova Shards'
                }
            },
            style() {
                let owned = player.s.upgrades.filter(id => id === 23).length
                if (owned >= 2) {
                    return {
                        "background": "linear-gradient(135deg, #2a0a0a 0%, #4a1010 100%)",
                        "border": "2px solid rgba(255,107,107,0.4)",
                        "border-radius": "12px",
                        "box-shadow": "0 4px 15px rgba(255,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
                        "color": "#ff6b6b",
                        "padding": "8px",
                        "font-family": "'Segoe UI', sans-serif",
                        "transition": "all 0.3s ease",
                    }
                }
                if (owned === 1 && hasUpgrade("starlayer", 34) && player.s.novaShards.gte(75000)) {
                    return {
                        "background": "linear-gradient(135deg, #2a1a0a 0%, #4a2a10 100%)",
                        "border": "2px solid rgba(255,179,71,0.6)",
                        "border-radius": "12px",
                        "box-shadow": "0 0 20px rgba(255,179,71,0.3), 0 4px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
                        "color": "#F8ECC9",
                        "text-shadow": "0 0 8px rgba(255,179,71,0.4)",
                        "padding": "8px",
                        "font-family": "'Segoe UI', sans-serif",
                        "cursor": "pointer",
                        "transition": "all 0.3s ease",
                    }
                }
                return {}
            },
            unlocked() { return getBuyableAmount("s", 31).gte(2) },
        },
        24: {
            title: "Condenser Synergy",
            description: "Condensed Stardust boosts upgrades 11 and 12",
            effect() {
                let base = getBuyableAmount("s", 31).div(3).add(1)
                if (hasUpgrade("s", 15)) base = base.mul(upgradeEffect("s", 15))
                if (player.s.upgrades.filter(id => id === 24).length >= 2) base = base.pow(2)
                return base
            },
            effectDisplay() {
                let owned = player.s.upgrades.filter(id => id === 24).length
                let text = format(upgradeEffect("s", 24)) + "x"
                if (owned >= 2) text += ' <span style="color:#ff6b6b;">| ^2</span>'
                return text
            },
            canAfford() {
                let owned = player.s.upgrades.filter(id => id === 24).length
                if (owned >= 2) return false
                if (owned >= 1) return hasUpgrade("starlayer", 34) && player.s.novaShards.gte(150000)
                return player.s.points.gte(50000000)
            },
            pay() {
                let owned = player.s.upgrades.filter(id => id === 24).length
                if (owned >= 1) player.s.novaShards = player.s.novaShards.sub(150000)
                else player.s.points = player.s.points.sub(50000000)
            },
            fullDisplay() {
                let owned = player.s.upgrades.filter(id => id === 24).length
                let effectVal = format(upgradeEffect("s", 24))
                if (owned === 0) {
                    return '<h3>Condenser Synergy</h3><br>Condensed Stardust boosts upgrades 11 and 12<br>Currently: ' + effectVal + 'x<br><br>Cost: 50M Stardust'
                } else if (owned === 1) {
                    if (!hasUpgrade("starlayer", 34)) {
                        return '<h3>Condenser Synergy</h3><br>Condensed Stardust boosts upgrades 11 and 12<br>Currently: ' + effectVal + 'x<br><br>Cost: 50M Stardust'
                    }
                    let canAff = player.s.novaShards.gte(150000)
                    let color = canAff ? '#F8ECC9' : '#666'
                    return '<h3>Condenser Synergy</h3><br>Condensed Stardust boosts upgrades 11 and 12<br>Currently: ' + effectVal + 'x<br><br>Cost: <span style="color:' + color + ';">150000 Nova Shards</span>'
                } else {
                    return '<h3 style="color:#ff6b6b;">✦ Condenser Synergy</h3><br>Condensed Stardust boosts upgrades 11 and 12: <span style="color:#F8ECC9;">' + effectVal + 'x</span><br>Effect ^2'
                }
            },
            style() {
                let owned = player.s.upgrades.filter(id => id === 24).length
                if (owned >= 2) {
                    return {
                        "background": "linear-gradient(135deg, #2a0a0a 0%, #4a1010 100%)",
                        "border": "2px solid rgba(255,107,107,0.4)",
                        "border-radius": "12px",
                        "box-shadow": "0 4px 15px rgba(255,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
                        "color": "#ff6b6b",
                        "padding": "8px",
                        "font-family": "'Segoe UI', sans-serif",
                        "transition": "all 0.3s ease",
                    }
                }
                if (owned === 1 && hasUpgrade("starlayer", 34) && player.s.novaShards.gte(150000)) {
                    return {
                        "background": "linear-gradient(135deg, #2a1a0a 0%, #4a2a10 100%)",
                        "border": "2px solid rgba(255,179,71,0.6)",
                        "border-radius": "12px",
                        "box-shadow": "0 0 20px rgba(255,179,71,0.3), 0 4px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
                        "color": "#F8ECC9",
                        "text-shadow": "0 0 8px rgba(255,179,71,0.4)",
                        "padding": "8px",
                        "font-family": "'Segoe UI', sans-serif",
                        "cursor": "pointer",
                        "transition": "all 0.3s ease",
                    }
                }
                return {}
            },
            unlocked() { return getBuyableAmount("s", 31).gte(2) },
        },
        25: {
            title: "Condenser Radiation",
            description: "Condensed Stardust boosts Upgrades 13 and 14 (weaker)",
            effect() {
                let base = getBuyableAmount("s", 31).div(5).add(1)
                if (player.s.upgrades.filter(id => id === 25).length >= 2) base = base.pow(2)
                return base
            },
            effectDisplay() {
                let owned = player.s.upgrades.filter(id => id === 25).length
                let text = format(upgradeEffect("s", 25)) + "x"
                if (owned >= 2) text += ' <span style="color:#ff6b6b;">| Squared</span>'
                return text
            },
            canAfford() {
                let owned = player.s.upgrades.filter(id => id === 25).length
                if (owned >= 2) return false
                if (owned >= 1) return hasUpgrade("starlayer", 34) && player.s.novaShards.gte(1e10)
                return player.s.points.gte("1e16")
            },
            pay() {
                let owned = player.s.upgrades.filter(id => id === 25).length
                if (owned >= 1) player.s.novaShards = player.s.novaShards.sub(1e10)
                else player.s.points = player.s.points.sub("1e16")
            },
            fullDisplay() {
                let owned = player.s.upgrades.filter(id => id === 25).length
                let effectVal = format(upgradeEffect("s", 25))
                if (owned === 0) {
                    return '<h3>Condenser Radiation</h3><br>Condensed Stardust boosts Upgrades 13 and 14 (weaker)<br>Currently: ' + effectVal + 'x<br><br>Cost: 1e16 Stardust'
                } else if (owned === 1) {
                    if (!hasUpgrade("starlayer", 34)) {
                        return '<h3>Condenser Radiation</h3><br>Condensed Stardust boosts Upgrades 13 and 14 (weaker)<br>Currently: ' + effectVal + 'x<br><br>Cost: 1e16 Stardust'
                    }
                    let canAff = player.s.novaShards.gte(1e10)
                    let color = canAff ? '#F8ECC9' : '#666'
                    return '<h3>Condenser Radiation</h3><br>Condensed Stardust boosts Upgrades 13 and 14 (weaker)<br>Currently: ' + effectVal + 'x<br><br>Cost: <span style="color:' + color + ';">1e10 Nova Shards</span>'
                } else {
                    return '<h3 style="color:#ff6b6b;">✦ Condenser Radiation</h3><br>Condensed Stardust boosts Upgrades 13 and 14 (weaker): <span style="color:#F8ECC9;">' + effectVal + 'x</span><br>Effect Squared'
                }
            },
            style() {
                let owned = player.s.upgrades.filter(id => id === 25).length
                if (owned >= 2) {
                    return {
                        "background": "linear-gradient(135deg, #2a0a0a 0%, #4a1010 100%)",
                        "border": "2px solid rgba(255,107,107,0.4)",
                        "border-radius": "12px",
                        "box-shadow": "0 4px 15px rgba(255,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
                        "color": "#ff6b6b",
                        "padding": "8px",
                        "font-family": "'Segoe UI', sans-serif",
                        "transition": "all 0.3s ease",
                    }
                }
                if (owned === 1 && hasUpgrade("starlayer", 34) && player.s.novaShards.gte(1e10)) {
                    return {
                        "background": "linear-gradient(135deg, #2a1a0a 0%, #4a2a10 100%)",
                        "border": "2px solid rgba(255,179,71,0.6)",
                        "border-radius": "12px",
                        "box-shadow": "0 0 20px rgba(255,179,71,0.3), 0 4px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
                        "color": "#F8ECC9",
                        "text-shadow": "0 0 8px rgba(255,179,71,0.4)",
                        "padding": "8px",
                        "font-family": "'Segoe UI', sans-serif",
                        "cursor": "pointer",
                        "transition": "all 0.3s ease",
                    }
                }
                return {}
            },
            unlocked() { return hasMilestone("starlayer", 0) },
        },
        26: {
            title: "Condenser Amplification",
            description: "Condensed Stardust boosts Upgrades 21 and 22",
            effect() {
                let base = getBuyableAmount("s", 31).div(4).add(1)
                if (player.s.upgrades.filter(id => id === 26).length >= 2) base = base.pow(2)
                return base
            },
            effectDisplay() {
                let owned = player.s.upgrades.filter(id => id === 26).length
                let text = format(upgradeEffect("s", 26)) + "x"
                if (owned >= 2) text += ' <span style="color:#ff6b6b;">| Squared</span>'
                return text
            },
            canAfford() {
                let owned = player.s.upgrades.filter(id => id === 26).length
                if (owned >= 2) return false
                if (owned >= 1) return hasUpgrade("starlayer", 34) && player.s.novaShards.gte(5e10)
                return player.s.points.gte("5e27")
            },
            pay() {
                let owned = player.s.upgrades.filter(id => id === 26).length
                if (owned >= 1) player.s.novaShards = player.s.novaShards.sub(5e10)
                else player.s.points = player.s.points.sub("5e27")
            },
            fullDisplay() {
                let owned = player.s.upgrades.filter(id => id === 26).length
                let effectVal = format(upgradeEffect("s", 26))
                if (owned === 0) {
                    return '<h3>Condenser Amplification</h3><br>Condensed Stardust boosts Upgrades 21 and 22<br>Currently: ' + effectVal + 'x<br><br>Cost: 5e27 Stardust'
                } else if (owned === 1) {
                    if (!hasUpgrade("starlayer", 34)) {
                        return '<h3>Condenser Amplification</h3><br>Condensed Stardust boosts Upgrades 21 and 22<br>Currently: ' + effectVal + 'x<br><br>Cost: 5e27 Stardust'
                    }
                    let canAff = player.s.novaShards.gte(5e10)
                    let color = canAff ? '#F8ECC9' : '#666'
                    return '<h3>Condenser Amplification</h3><br>Condensed Stardust boosts Upgrades 21 and 22<br>Currently: ' + effectVal + 'x<br><br>Cost: <span style="color:' + color + ';">5e10 Nova Shards</span>'
                } else {
                    return '<h3 style="color:#ff6b6b;">✦ Condenser Amplification</h3><br>Condensed Stardust boosts Upgrades 21 and 22: <span style="color:#F8ECC9;">' + effectVal + 'x</span><br>Effect Squared'
                }
            },
            style() {
                let owned = player.s.upgrades.filter(id => id === 26).length
                if (owned >= 2) {
                    return {
                        "background": "linear-gradient(135deg, #2a0a0a 0%, #4a1010 100%)",
                        "border": "2px solid rgba(255,107,107,0.4)",
                        "border-radius": "12px",
                        "box-shadow": "0 4px 15px rgba(255,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
                        "color": "#ff6b6b",
                        "padding": "8px",
                        "font-family": "'Segoe UI', sans-serif",
                        "transition": "all 0.3s ease",
                    }
                }
                if (owned === 1 && hasUpgrade("starlayer", 34) && player.s.novaShards.gte(5e10)) {
                    return {
                        "background": "linear-gradient(135deg, #2a1a0a 0%, #4a2a10 100%)",
                        "border": "2px solid rgba(255,179,71,0.6)",
                        "border-radius": "12px",
                        "box-shadow": "0 0 20px rgba(255,179,71,0.3), 0 4px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
                        "color": "#F8ECC9",
                        "text-shadow": "0 0 8px rgba(255,179,71,0.4)",
                        "padding": "8px",
                        "font-family": "'Segoe UI', sans-serif",
                        "cursor": "pointer",
                        "transition": "all 0.3s ease",
                    }
                }
                return {}
            },
            unlocked() { return hasMilestone("starlayer", 1) },
        },
        31: {
            title: "Matter Loop II",
            description: "Matter boosts its own gain (weak)",
            effect() {
                return player.points.add(1).pow(0.04)
            },
            effectDisplay() {
                let owned = player.s.upgrades.filter(id => id === 31).length
                let text = format(upgradeEffect("s", 31)) + "x"
                if (owned >= 2) {
                    let protoBoost = Math.max(0, Decimal.log10(upgradeEffect("s", 31)))
                    text += ' <span style="color:#ff6b6b;">| Protostar x' + format(protoBoost) + '</span>'
                }
                return text
            },
            canAfford() {
                let owned = player.s.upgrades.filter(id => id === 31).length
                if (owned >= 2) return false
                if (owned >= 1) return hasUpgrade("starlayer", 34) && player.s.novaShards.gte(1e6)
                return player.s.points.gte(100000000)
            },
            pay() {
                let owned = player.s.upgrades.filter(id => id === 31).length
                if (owned >= 1) player.s.novaShards = player.s.novaShards.sub(1e6)
                else player.s.points = player.s.points.sub(100000000)
            },
            fullDisplay() {
                let owned = player.s.upgrades.filter(id => id === 31).length
                let effectVal = format(upgradeEffect("s", 31))
                if (owned === 0) {
                    return '<h3>Matter Loop II</h3><br>Matter boosts its own gain (weak)<br>Currently: ' + effectVal + 'x<br><br>Cost: 100M Stardust'
                } else if (owned === 1) {
                    if (!hasUpgrade("starlayer", 34)) {
                        return '<h3>Matter Loop II</h3><br>Matter boosts its own gain (weak)<br>Currently: ' + effectVal + 'x<br><br>Cost: 100M Stardust'
                    }
                    let canAff = player.s.novaShards.gte(1e6)
                    let color = canAff ? '#F8ECC9' : '#666'
                    return '<h3>Matter Loop II</h3><br>Matter boosts its own gain (weak)<br>Currently: ' + effectVal + 'x<br><br>Cost: <span style="color:' + color + ';">1e6 Nova Shards</span>'
                } else {
                    let protoBoost = Math.max(0, Decimal.log10(upgradeEffect("s", 31)))
                    return '<h3 style="color:#ff6b6b;">✦ Matter Loop II</h3><br>Matter boosts its own gain (weak): <span style="color:#F8ECC9;">' + effectVal + 'x</span><br>Protostar rate: <span style="color:#F8ECC9;">x' + format(protoBoost) + '</span>'
                }
            },
            style() {
                let owned = player.s.upgrades.filter(id => id === 31).length
                if (owned >= 2) {
                    return {
                        "background": "linear-gradient(135deg, #2a0a0a 0%, #4a1010 100%)",
                        "border": "2px solid rgba(255,107,107,0.4)",
                        "border-radius": "12px",
                        "box-shadow": "0 4px 15px rgba(255,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
                        "color": "#ff6b6b",
                        "padding": "8px",
                        "font-family": "'Segoe UI', sans-serif",
                        "transition": "all 0.3s ease",
                    }
                }
                if (owned === 1 && hasUpgrade("starlayer", 34) && player.s.novaShards.gte(1e6)) {
                    return {
                        "background": "linear-gradient(135deg, #2a1a0a 0%, #4a2a10 100%)",
                        "border": "2px solid rgba(255,179,71,0.6)",
                        "border-radius": "12px",
                        "box-shadow": "0 0 20px rgba(255,179,71,0.3), 0 4px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
                        "color": "#F8ECC9",
                        "text-shadow": "0 0 8px rgba(255,179,71,0.4)",
                        "padding": "8px",
                        "font-family": "'Segoe UI', sans-serif",
                        "cursor": "pointer",
                        "transition": "all 0.3s ease",
                    }
                }
                return {}
            },
            unlocked() { return getBuyableAmount("s", 31).gte(3) },
        },
        32: {
            title: "Stardust Loop II",
            description: "Stardust boosts its own gain (weak)",
            effect() {
                return player.s.points.add(1).pow(0.04)
            },
            effectDisplay() {
                let owned = player.s.upgrades.filter(id => id === 32).length
                let text = format(upgradeEffect("s", 32)) + "x"
                if (owned >= 2) {
                    let protoBoost = Math.max(0, Decimal.log10(upgradeEffect("s", 32)))
                    text += ' <span style="color:#ff6b6b;">| Protostar x' + format(protoBoost) + '</span>'
                }
                return text
            },
            canAfford() {
                let owned = player.s.upgrades.filter(id => id === 32).length
                if (owned >= 2) return false
                if (owned >= 1) return hasUpgrade("starlayer", 34) && player.s.novaShards.gte(2.5e6)
                return player.s.points.gte(200000000)
            },
            pay() {
                let owned = player.s.upgrades.filter(id => id === 32).length
                if (owned >= 1) player.s.novaShards = player.s.novaShards.sub(2.5e6)
                else player.s.points = player.s.points.sub(200000000)
            },
            fullDisplay() {
                let owned = player.s.upgrades.filter(id => id === 32).length
                let effectVal = format(upgradeEffect("s", 32))
                if (owned === 0) {
                    return '<h3>Stardust Loop II</h3><br>Stardust boosts its own gain (weak)<br>Currently: ' + effectVal + 'x<br><br>Cost: 200M Stardust'
                } else if (owned === 1) {
                    if (!hasUpgrade("starlayer", 34)) {
                        return '<h3>Stardust Loop II</h3><br>Stardust boosts its own gain (weak)<br>Currently: ' + effectVal + 'x<br><br>Cost: 200M Stardust'
                    }
                    let canAff = player.s.novaShards.gte(2.5e6)
                    let color = canAff ? '#F8ECC9' : '#666'
                    return '<h3>Stardust Loop II</h3><br>Stardust boosts its own gain (weak)<br>Currently: ' + effectVal + 'x<br><br>Cost: <span style="color:' + color + ';">2.5e6 Nova Shards</span>'
                } else {
                    let protoBoost = Math.max(0, Decimal.log10(upgradeEffect("s", 32)))
                    return '<h3 style="color:#ff6b6b;">✦ Stardust Loop II</h3><br>Stardust boosts its own gain (weak): <span style="color:#F8ECC9;">' + effectVal + 'x</span><br>Protostar rate: <span style="color:#F8ECC9;">x' + format(protoBoost) + '</span>'
                }
            },
            style() {
                let owned = player.s.upgrades.filter(id => id === 32).length
                if (owned >= 2) {
                    return {
                        "background": "linear-gradient(135deg, #2a0a0a 0%, #4a1010 100%)",
                        "border": "2px solid rgba(255,107,107,0.4)",
                        "border-radius": "12px",
                        "box-shadow": "0 4px 15px rgba(255,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
                        "color": "#ff6b6b",
                        "padding": "8px",
                        "font-family": "'Segoe UI', sans-serif",
                        "transition": "all 0.3s ease",
                    }
                }
                if (owned === 1 && hasUpgrade("starlayer", 34) && player.s.novaShards.gte(2.5e6)) {
                    return {
                        "background": "linear-gradient(135deg, #2a1a0a 0%, #4a2a10 100%)",
                        "border": "2px solid rgba(255,179,71,0.6)",
                        "border-radius": "12px",
                        "box-shadow": "0 0 20px rgba(255,179,71,0.3), 0 4px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
                        "color": "#F8ECC9",
                        "text-shadow": "0 0 8px rgba(255,179,71,0.4)",
                        "padding": "8px",
                        "font-family": "'Segoe UI', sans-serif",
                        "cursor": "pointer",
                        "transition": "all 0.3s ease",
                    }
                }
                return {}
            },
            unlocked() { return getBuyableAmount("s", 31).gte(3) },
        },
        33: {
            title: "Stellar Enhancement II",
            description: "Stardust boosts Matter gain (weak)",
            effect() {
                return player.s.points.add(1).pow(0.15)
            },
            effectDisplay() {
                let owned = player.s.upgrades.filter(id => id === 33).length
                let text = format(upgradeEffect("s", 33)) + "x"
                if (owned >= 2) {
                    let protoBoost = Math.max(0, Decimal.log10(upgradeEffect("s", 33)))
                    text += ' <span style="color:#ff6b6b;">| Protostar x' + format(protoBoost) + '</span>'
                }
                return text
            },
            canAfford() {
                let owned = player.s.upgrades.filter(id => id === 33).length
                if (owned >= 2) return false
                if (owned >= 1) return hasUpgrade("starlayer", 34) && player.s.novaShards.gte(5e6)
                return player.s.points.gte(500000000)
            },
            pay() {
                let owned = player.s.upgrades.filter(id => id === 33).length
                if (owned >= 1) player.s.novaShards = player.s.novaShards.sub(5e6)
                else player.s.points = player.s.points.sub(500000000)
            },
            fullDisplay() {
                let owned = player.s.upgrades.filter(id => id === 33).length
                let effectVal = format(upgradeEffect("s", 33))
                if (owned === 0) {
                    return '<h3>Stellar Enhancement II</h3><br>Stardust boosts Matter gain (weak)<br>Currently: ' + effectVal + 'x<br><br>Cost: 500M Stardust'
                } else if (owned === 1) {
                    if (!hasUpgrade("starlayer", 34)) {
                        return '<h3>Stellar Enhancement II</h3><br>Stardust boosts Matter gain (weak)<br>Currently: ' + effectVal + 'x<br><br>Cost: 500M Stardust'
                    }
                    let canAff = player.s.novaShards.gte(5e6)
                    let color = canAff ? '#F8ECC9' : '#666'
                    return '<h3>Stellar Enhancement II</h3><br>Stardust boosts Matter gain (weak)<br>Currently: ' + effectVal + 'x<br><br>Cost: <span style="color:' + color + ';">5e6 Nova Shards</span>'
                } else {
                    let protoBoost = Math.max(0, Decimal.log10(upgradeEffect("s", 33)))
                    return '<h3 style="color:#ff6b6b;">✦ Stellar Enhancement II</h3><br>Stardust boosts Matter gain (weak): <span style="color:#F8ECC9;">' + effectVal + 'x</span><br>Protostar rate: <span style="color:#F8ECC9;">x' + format(protoBoost) + '</span>'
                }
            },
            style() {
                let owned = player.s.upgrades.filter(id => id === 33).length
                if (owned >= 2) {
                    return {
                        "background": "linear-gradient(135deg, #2a0a0a 0%, #4a1010 100%)",
                        "border": "2px solid rgba(255,107,107,0.4)",
                        "border-radius": "12px",
                        "box-shadow": "0 4px 15px rgba(255,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
                        "color": "#ff6b6b",
                        "padding": "8px",
                        "font-family": "'Segoe UI', sans-serif",
                        "transition": "all 0.3s ease",
                    }
                }
                if (owned === 1 && hasUpgrade("starlayer", 34) && player.s.novaShards.gte(5e6)) {
                    return {
                        "background": "linear-gradient(135deg, #2a1a0a 0%, #4a2a10 100%)",
                        "border": "2px solid rgba(255,179,71,0.6)",
                        "border-radius": "12px",
                        "box-shadow": "0 0 20px rgba(255,179,71,0.3), 0 4px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
                        "color": "#F8ECC9",
                        "text-shadow": "0 0 8px rgba(255,179,71,0.4)",
                        "padding": "8px",
                        "font-family": "'Segoe UI', sans-serif",
                        "cursor": "pointer",
                        "transition": "all 0.3s ease",
                    }
                }
                return {}
            },
            unlocked() { return getBuyableAmount("s", 31).gte(3) },
        },
        34: {
            title: "Matter Attraction II",
            description: "Matter boosts Stardust gain (weak)",
            effect() {
                return player.points.add(1).pow(0.15).div(3).max(1)
            },
            effectDisplay() {
                let owned = player.s.upgrades.filter(id => id === 34).length
                let text = format(upgradeEffect("s", 34)) + "x"
                if (owned >= 2) {
                    let protoBoost = Math.max(0, Decimal.log10(upgradeEffect("s", 34)))
                    text += ' <span style="color:#ff6b6b;">| Protostar x' + format(protoBoost) + '</span>'
                }
                return text
            },
            canAfford() {
                let owned = player.s.upgrades.filter(id => id === 34).length
                if (owned >= 2) return false
                if (owned >= 1) return hasUpgrade("starlayer", 34) && player.s.novaShards.gte(1e7)
                return player.s.points.gte("1e12")
            },
            pay() {
                let owned = player.s.upgrades.filter(id => id === 34).length
                if (owned >= 1) player.s.novaShards = player.s.novaShards.sub(1e7)
                else player.s.points = player.s.points.sub("1e12")
            },
            fullDisplay() {
                let owned = player.s.upgrades.filter(id => id === 34).length
                let effectVal = format(upgradeEffect("s", 34))
                if (owned === 0) {
                    return '<h3>Matter Attraction II</h3><br>Matter boosts Stardust gain (weak)<br>Currently: ' + effectVal + 'x<br><br>Cost: 1e12 Stardust'
                } else if (owned === 1) {
                    if (!hasUpgrade("starlayer", 34)) {
                        return '<h3>Matter Attraction II</h3><br>Matter boosts Stardust gain (weak)<br>Currently: ' + effectVal + 'x<br><br>Cost: 1e12 Stardust'
                    }
                    let canAff = player.s.novaShards.gte(1e7)
                    let color = canAff ? '#F8ECC9' : '#666'
                    return '<h3>Matter Attraction II</h3><br>Matter boosts Stardust gain (weak)<br>Currently: ' + effectVal + 'x<br><br>Cost: <span style="color:' + color + ';">1e7 Nova Shards</span>'
                } else {
                    let protoBoost = Math.max(0, Decimal.log10(upgradeEffect("s", 34)))
                    return '<h3 style="color:#ff6b6b;">✦ Matter Attraction II</h3><br>Matter boosts Stardust gain (weak): <span style="color:#F8ECC9;">' + effectVal + 'x</span><br>Protostar rate: <span style="color:#F8ECC9;">x' + format(protoBoost) + '</span>'
                }
            },
            style() {
                let owned = player.s.upgrades.filter(id => id === 34).length
                if (owned >= 2) {
                    return {
                        "background": "linear-gradient(135deg, #2a0a0a 0%, #4a1010 100%)",
                        "border": "2px solid rgba(255,107,107,0.4)",
                        "border-radius": "12px",
                        "box-shadow": "0 4px 15px rgba(255,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
                        "color": "#ff6b6b",
                        "padding": "8px",
                        "font-family": "'Segoe UI', sans-serif",
                        "transition": "all 0.3s ease",
                    }
                }
                if (owned === 1 && hasUpgrade("starlayer", 34) && player.s.novaShards.gte(1e7)) {
                    return {
                        "background": "linear-gradient(135deg, #2a1a0a 0%, #4a2a10 100%)",
                        "border": "2px solid rgba(255,179,71,0.6)",
                        "border-radius": "12px",
                        "box-shadow": "0 0 20px rgba(255,179,71,0.3), 0 4px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
                        "color": "#F8ECC9",
                        "text-shadow": "0 0 8px rgba(255,179,71,0.4)",
                        "padding": "8px",
                        "font-family": "'Segoe UI', sans-serif",
                        "cursor": "pointer",
                        "transition": "all 0.3s ease",
                    }
                }
                return {}
            },
            unlocked() { return getBuyableAmount("s", 31).gte(3) },
        },
        35: {
            title: "Stardust-Matter Convergence",
            description: "Fuses Stardust Creation and Matter Cannot Be Created into a single upgrade, boosting both resources",
            effect() {
                let base = new Decimal(4)
                if (hasUpgrade("s", 24)) base = base.mul(upgradeEffect("s", 24))
                if (hasUpgrade("s", 15)) base = base.mul(upgradeEffect("s", 15))
                if (player.s.upgrades.filter(id => id === 35).length >= 2) base = base.pow(1.5)
                return base
            },
            effectDisplay() {
                let owned = player.s.upgrades.filter(id => id === 35).length
                let text = format(upgradeEffect("s", 35)) + "x"
                if (owned >= 2) text += ' <span style="color:#ff6b6b;">| ^1.5</span>'
                return text
            },
            canAfford() {
                let owned = player.s.upgrades.filter(id => id === 35).length
                if (owned >= 2) return false
                if (owned >= 1) return hasUpgrade("starlayer", 34) && player.s.novaShards.gte(5e10)
                return player.s.points.gte("1.5e17")
            },
            pay() {
                let owned = player.s.upgrades.filter(id => id === 35).length
                if (owned >= 1) player.s.novaShards = player.s.novaShards.sub(5e10)
                else player.s.points = player.s.points.sub("1.5e17")
            },
            fullDisplay() {
                let owned = player.s.upgrades.filter(id => id === 35).length
                let effectVal = format(upgradeEffect("s", 35))
                if (owned === 0) {
                    return '<h3>Stardust-Matter Convergence</h3><br>Fuses Stardust Creation and Matter Cannot Be Created into a single upgrade<br>Currently: ' + effectVal + 'x<br><br>Cost: 1.5e17 Stardust'
                } else if (owned === 1) {
                    if (!hasUpgrade("starlayer", 34)) {
                        return '<h3>Stardust-Matter Convergence</h3><br>Fuses Stardust Creation and Matter Cannot Be Created into a single upgrade<br>Currently: ' + effectVal + 'x<br><br>Cost: 1.5e17 Stardust'
                    }
                    let canAff = player.s.novaShards.gte(5e10)
                    let color = canAff ? '#F8ECC9' : '#666'
                    return '<h3>Stardust-Matter Convergence</h3><br>Fuses Stardust Creation and Matter Cannot Be Created into a single upgrade<br>Currently: ' + effectVal + 'x<br><br>Cost: <span style="color:' + color + ';">5e10 Nova Shards</span>'
                } else {
                    return '<h3 style="color:#ff6b6b;">✦ Stardust-Matter Convergence</h3><br>Fuses Stardust Creation and Matter Cannot Be Created into a single upgrade: <span style="color:#F8ECC9;">' + effectVal + 'x</span><br>Effect ^1.5'
                }
            },
            style() {
                let owned = player.s.upgrades.filter(id => id === 35).length
                if (owned >= 2) {
                    return {
                        "background": "linear-gradient(135deg, #2a0a0a 0%, #4a1010 100%)",
                        "border": "2px solid rgba(255,107,107,0.4)",
                        "border-radius": "12px",
                        "box-shadow": "0 4px 15px rgba(255,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
                        "color": "#ff6b6b",
                        "padding": "8px",
                        "font-family": "'Segoe UI', sans-serif",
                        "transition": "all 0.3s ease",
                    }
                }
                if (owned === 1 && hasUpgrade("starlayer", 34) && player.s.novaShards.gte(5e10)) {
                    return {
                        "background": "linear-gradient(135deg, #2a1a0a 0%, #4a2a10 100%)",
                        "border": "2px solid rgba(255,179,71,0.6)",
                        "border-radius": "12px",
                        "box-shadow": "0 0 20px rgba(255,179,71,0.3), 0 4px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
                        "color": "#F8ECC9",
                        "text-shadow": "0 0 8px rgba(255,179,71,0.4)",
                        "padding": "8px",
                        "font-family": "'Segoe UI', sans-serif",
                        "cursor": "pointer",
                        "transition": "all 0.3s ease",
                    }
                }
                return {}
            },
            unlocked() { return getBuyableAmount("s", 31).gte(3) },
        },
        36: {
            title: "Ethereal Fusion",
            description: "Fuses Stellar Enhancement and Matter Attraction into one (greatly reduced), boosting both resources",
            effect() {
                return player.s.points.add(1).pow(0.05).mul(player.points.add(1).pow(0.03)).div(10).max(1)
            },
            effectDisplay() {
                let owned = player.s.upgrades.filter(id => id === 36).length
                let text = format(upgradeEffect("s", 36)) + "x"
                if (owned >= 2) {
                    let protoBoost = Math.max(0, Decimal.log10(upgradeEffect("s", 36)))
                    text += ' <span style="color:#ff6b6b;">| Protostar x' + format(protoBoost) + '</span>'
                }
                return text
            },
            canAfford() {
                let owned = player.s.upgrades.filter(id => id === 36).length
                if (owned >= 2) return false
                if (owned >= 1) return hasUpgrade("starlayer", 34) && player.s.novaShards.gte(7.5e10)
                return player.s.points.gte("5e29")
            },
            pay() {
                let owned = player.s.upgrades.filter(id => id === 36).length
                if (owned >= 1) player.s.novaShards = player.s.novaShards.sub(7.5e10)
                else player.s.points = player.s.points.sub("5e29")
            },
            fullDisplay() {
                let owned = player.s.upgrades.filter(id => id === 36).length
                let effectVal = format(upgradeEffect("s", 36))
                if (owned === 0) {
                    return '<h3>Ethereal Fusion</h3><br>Fuses Stellar Enhancement and Matter Attraction into one (greatly reduced)<br>Currently: ' + effectVal + 'x<br><br>Cost: 5e29 Stardust'
                } else if (owned === 1) {
                    if (!hasUpgrade("starlayer", 34)) {
                        return '<h3>Ethereal Fusion</h3><br>Fuses Stellar Enhancement and Matter Attraction into one (greatly reduced)<br>Currently: ' + effectVal + 'x<br><br>Cost: 5e29 Stardust'
                    }
                    let canAff = player.s.novaShards.gte(7.5e10)
                    let color = canAff ? '#F8ECC9' : '#666'
                    return '<h3>Ethereal Fusion</h3><br>Fuses Stellar Enhancement and Matter Attraction into one (greatly reduced)<br>Currently: ' + effectVal + 'x<br><br>Cost: <span style="color:' + color + ';">7.5e10 Nova Shards</span>'
                } else {
                    let protoBoost = Math.max(0, Decimal.log10(upgradeEffect("s", 36)))
                    return '<h3 style="color:#ff6b6b;">✦ Ethereal Fusion</h3><br>Fuses Stellar Enhancement and Matter Attraction into one (greatly reduced): <span style="color:#F8ECC9;">' + effectVal + 'x</span><br>Protostar rate: <span style="color:#F8ECC9;">x' + format(protoBoost) + '</span>'
                }
            },
            style() {
                let owned = player.s.upgrades.filter(id => id === 36).length
                if (owned >= 2) {
                    return {
                        "background": "linear-gradient(135deg, #2a0a0a 0%, #4a1010 100%)",
                        "border": "2px solid rgba(255,107,107,0.4)",
                        "border-radius": "12px",
                        "box-shadow": "0 4px 15px rgba(255,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
                        "color": "#ff6b6b",
                        "padding": "8px",
                        "font-family": "'Segoe UI', sans-serif",
                        "transition": "all 0.3s ease",
                    }
                }
                if (owned === 1 && hasUpgrade("starlayer", 34) && player.s.novaShards.gte(7.5e10)) {
                    return {
                        "background": "linear-gradient(135deg, #2a1a0a 0%, #4a2a10 100%)",
                        "border": "2px solid rgba(255,179,71,0.6)",
                        "border-radius": "12px",
                        "box-shadow": "0 0 20px rgba(255,179,71,0.3), 0 4px 15px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)",
                        "color": "#F8ECC9",
                        "text-shadow": "0 0 8px rgba(255,179,71,0.4)",
                        "padding": "8px",
                        "font-family": "'Segoe UI', sans-serif",
                        "cursor": "pointer",
                        "transition": "all 0.3s ease",
                    }
                }
                return {}
            },
            unlocked() { return getBuyableAmount("s", 31).gte(3) },
        },
        41: {
            title: "Stellar Overdrive",
            description: "Each Star boosts Stardust gain",
            cost: new Decimal("1e70"),
            effect() {
                return player.starlayer.points.add(1).pow(0.15)
            },
            effectDisplay() { return format(upgradeEffect("s", 41))+"x" },
            unlocked() { return hasMilestone("starlayer", 4) },
        },
        42: {
            title: "Condensed Matter",
            description: "Condensed Stardust boosts Matter gain",
            cost: new Decimal("1e72"),
            effect() {
                return getBuyableAmount("s", 31).add(1).pow(0.12)
            },
            effectDisplay() { return format(upgradeEffect("s", 42))+"x" },
            unlocked() { return hasUpgrade("s", 41) },
        },
        43: {
            title: "Nebula Convergence",
            description: "Nebula reduces Condenser cost scaling",
            cost: new Decimal("1e74"),
            effect() {
                return player.starlayer.nebula.add(1).pow(0.015).max(1)
            },
            effectDisplay() { return "/" + format(upgradeEffect("s", 43)) },
            unlocked() { return hasUpgrade("s", 42) },
        },
        44: {
            title: "Condenser Overclocker",
            description: "Condensed Stardust exponent is raised",
            cost: new Decimal("1e76"),
            effect() {
                return new Decimal(1.15)
            },
            effectDisplay() { return "^" + format(upgradeEffect("s", 44)) },
            unlocked() { return hasUpgrade("s", 43) },
        },
        45: {
            title: "Compression Cascade",
            description: "Each Compression boosts all resources",
            cost: new Decimal("1e78"),
            effect() {
                return player.s.compressions.add(1).pow(0.25)
            },
            effectDisplay() { return format(upgradeEffect("s", 45))+"x" },
            unlocked() { return hasUpgrade("s", 44) },
        },
        46: {
            title: "The Star Tree",
            description: "Stars boost all resource generation exponentially",
            cost: new Decimal("1e80"),
            effect() {
                return Decimal.pow(2, player.starlayer.points).max(1)
            },
            effectDisplay() { return format(upgradeEffect("s", 46))+"x" },
            unlocked() { return hasUpgrade("s", 45) },
        },
    },
    clickables: {
        rows: 4,
        cols: 3,
        41: {
            title: "Stardust Compressor",
            display() {
                let comps = player.s.compressions
                let base = hasUpgrade("starlayer", 21) ? new Decimal(3).mul(upgradeEffect("starlayer", 21)) : new Decimal(3)
                let compMult = Decimal.pow(base, comps)
                return "Matter & Nebula +" + format(compMult) + "x"
            },
            canClick() {
                let baseExp = player.s.compressions.gte(15) ? 20 : (player.s.compressions.gte(10) ? 5 : 3)
                let costExp = hasUpgrade("starlayer", 32) ? new Decimal(baseExp).div(upgradeEffect("starlayer", 32)) : new Decimal(baseExp)
                let cost = player.s.compressions.add(1).pow(costExp)
                return getBuyableAmount("s", 31).gte(cost)
            },
            onClick() {
                player.s.compressions = player.s.compressions.add(1)
                setBuyableAmount("s", 31, new Decimal(0))
                player.s.points = new Decimal(0)
            },
            unlocked() { return hasMilestone("starlayer", 3) },
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
        42: {
            title: "Trigger Nova",
            display() {
                let canSurpass = player[this.layer].upgrades.filter(id => id === 23).length >= 2
                let shards = player[this.layer].protostar.gt(0) ? Decimal.floor(player[this.layer].protostar.pow(0.3)) : new Decimal(0)
                if (canSurpass && player[this.layer].instability.gt(100)) {
                    shards = shards.mul(player[this.layer].instability.div(100))
                }
                let canNova = player[this.layer].instability.gte(100) && player[this.layer].protostar.gt(0)
                let readyText = canNova ? '<span style="color:#00ff88;">READY</span>' : '<span style="color:#ff4444;">' + player[this.layer].instability.toFixed(1) + '%</span>'
                return 'Nova Status: ' + readyText +
                       '<br>Protostar to consume: ' + format(player[this.layer].protostar) +
                       '<br>Nova Shards to gain: +' + format(shards)
            },
            canClick() {
                return player[this.layer].instability.gte(100) && player[this.layer].protostar.gt(0)
            },
            onClick() {
                let canSurpass = player[this.layer].upgrades.filter(id => id === 23).length >= 2
                let shards = Decimal.floor(player[this.layer].protostar.pow(0.3))
                if (canSurpass && player[this.layer].instability.gt(100)) {
                    shards = shards.mul(player[this.layer].instability.div(100))
                }
                player[this.layer].novaShards = player[this.layer].novaShards.add(shards)
                player[this.layer].protostar = new Decimal(0)
                player[this.layer].instability = new Decimal(0)
                player[this.layer].points = new Decimal(0)
            },
            unlocked() { return hasUpgrade("starlayer", 34) },
            style: {
                "background": "linear-gradient(135deg, #2a0a0a 0%, #4a1010 100%)",
                "border": "2px solid rgba(255,68,68,0.4)",
                "border-radius": "12px",
                "box-shadow": "0 4px 15px rgba(255,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
                "color": "#ff6b6b",
                "padding": "15px",
                "font-family": "'Segoe UI', sans-serif",
                "cursor": "pointer",
                "transition": "all 0.3s ease",
            },
        },
        43: {
            title: "Overload Star",
            display() {
                let canSurpass = player[this.layer].upgrades.filter(id => id === 23).length >= 2
                let canOverload = player[this.layer].protostar.gte(1) && (canSurpass || player[this.layer].instability.lt(100))
                let gain = player[this.layer].protostar.pow(0.1).mul(3)
                if (!canSurpass) gain = Decimal.min(gain, new Decimal(100).sub(player[this.layer].instability))
                if (canSurpass && player[this.layer].instability.gt(100)) {
                    gain = gain.mul(new Decimal(100).div(player[this.layer].instability))
                }
                let pushedInst = canSurpass ? player[this.layer].instability.add(gain) : Decimal.min(player[this.layer].instability.add(gain), 100)
                let newInstMul = pushedInst.div(100).add(1)
                return '<span style="color:#ff8844;">Burn all Protostar for Instability</span>' +
                       '<br>Consume: <span style="color:#ff8c8c;">' + format(player[this.layer].protostar) + '</span>' +
                       '<br>Gain: <span style="color:#ff6600;">+' + format(gain) + '%</span> Instability' +
                       '<br>New boost: <span style="color:' + (canOverload ? '#ff8c8c' : '#666') + ';">x' + format(newInstMul) + '</span> from instability'
            },
            canClick() {
                let canSurpass = player[this.layer].upgrades.filter(id => id === 23).length >= 2
                return player[this.layer].protostar.gte(1) && (canSurpass || player[this.layer].instability.lt(100))
            },
            onClick() {
                let canSurpass = player[this.layer].upgrades.filter(id => id === 23).length >= 2
                let gain = player[this.layer].protostar.pow(0.1).mul(3)
                if (!canSurpass) gain = Decimal.min(gain, new Decimal(100).sub(player[this.layer].instability))
                if (canSurpass && player[this.layer].instability.gt(100)) {
                    gain = gain.mul(new Decimal(100).div(player[this.layer].instability))
                }
                player[this.layer].instability = canSurpass ? player[this.layer].instability.add(gain) : Decimal.min(player[this.layer].instability.add(gain), 100)
                player[this.layer].protostar = new Decimal(0)
            },
            unlocked() { return hasUpgrade("starlayer", 34) },
            style: {
                "background": "linear-gradient(135deg, #2a1a0a 0%, #4a2a10 100%)",
                "border": "2px solid rgba(255,136,0,0.4)",
                "border-radius": "12px",
                "box-shadow": "0 4px 15px rgba(255,136,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
                "color": "#ff8844",
                "padding": "15px",
                "font-family": "'Segoe UI', sans-serif",
                "cursor": "pointer",
                "transition": "all 0.3s ease",
            },
        },
    },
    buyables: {
        31: {
            title: "Condensed Stardust",
            cost(x) {
                let s = hasMilestone("starlayer", 2) ? 1.2 : hasMilestone("starlayer", 1) ? 1.5 : hasMilestone("starlayer", 0) ? 2 : 3
                if (hasUpgrade("starlayer", 22)) s = s / upgradeEffect("starlayer", 22)
                if (hasUpgrade("s", 43)) s = s / upgradeEffect("s", 43)
                if (x.gte(200)) s = s * 1.5
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
                if (!hasMilestone("starlayer", 4)) {
                    player[this.layer].points = new Decimal(0)
                    player.points = getStartPoints()
                }
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
        let totalCost = new Decimal(4).mul(Decimal.pow(2, stars.add(gain)).sub(Decimal.pow(2, stars)))
        setBuyableAmount("s", 31, getBuyableAmount("s", 31).sub(totalCost))
        player.s.points = new Decimal(0)
        player.s.upgrades = []
        player[this.layer].nebula = new Decimal(0)
        player.points = getStartPoints()
    },
    update(diff) {
        if (hasMilestone(this.layer, 2)) {
            let rate = player[this.layer].points
            if (hasUpgrade(this.layer, 12)) rate = rate.mul(upgradeEffect(this.layer, 12))
            if (hasUpgrade(this.layer, 13)) rate = rate.mul(upgradeEffect(this.layer, 13))
                    if (hasUpgrade(this.layer, 31)) rate = rate.mul(upgradeEffect(this.layer, 31))
                    if (hasMilestone(this.layer, 5)) rate = rate.mul(3)
                    let nebBuy13 = getBuyableAmount(this.layer, 13)
            if (nebBuy13.gt(0)) rate = rate.mul(nebBuy13.add(1).pow(0.5))
            if (player.s.compressions.gt(0)) {
                let base = hasUpgrade("starlayer", 21) ? new Decimal(3).mul(upgradeEffect("starlayer", 21)) : new Decimal(3)
                let compMult = Decimal.pow(base, player.s.compressions)
                rate = rate.mul(compMult)
            }
            if (player.s.novaShards.gt(0)) rate = rate.mul(player.s.novaShards.add(1).pow(0.1))
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
                return player[this.layer].points.add(1).pow(0.25)
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
                return 'Level: <span style="font-size:22px;font-weight:bold;color:#F8ECC9;text-shadow:0 0 10px #F8ECC9;">' + formatWhole(level) + '</span>' +
                       '<br><span style="font-size:13px;color:#aaa;">Cost: ' + format(this.cost()) + ' Nebula</span>' +
                       '<br><span style="font-size:14px;color:#e8d48b;">+' + format(level.add(1).pow(0.5)) + 'x Stardust</span>'
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
                return 'Level: <span style="font-size:22px;font-weight:bold;color:#F8ECC9;text-shadow:0 0 10px #F8ECC9;">' + formatWhole(level) + '</span>' +
                       '<br><span style="font-size:13px;color:#888;">Cost: ' + format(this.cost()) + ' Nebula</span>' +
                       '<br><span style="font-size:14px;color:#e8d48b;">+' + format(level.add(1).pow(0.5)) + 'x Matter</span>'
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
                return 'Level: <span style="font-size:22px;font-weight:bold;color:#c084fc;text-shadow:0 0 10px #c084fc;">' + formatWhole(level) + '</span>' +
                       '<br><span style="font-size:13px;color:#888;">Cost: ' + format(this.cost()) + ' Nebula</span>' +
                       '<br><span style="font-size:14px;color:#c084fc;">+' + format(level.add(1).pow(0.5)) + 'x Nebula</span>'
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
                    if (nebBuy13.gt(0)) rate = rate.mul(nebBuy13.add(1).pow(0.5))
                    if (player.s.compressions.gt(0)) {
                        let base = hasUpgrade("starlayer", 21) ? new Decimal(3).mul(upgradeEffect("starlayer", 21)) : new Decimal(3)
                        let compMult = Decimal.pow(base, player.s.compressions)
                        rate = rate.mul(compMult)
                    }
                    let nebulaText = '<span style="font-size:14px;color:#9ca3af;">✦ Nebula: <span style="color:#c084fc;font-weight:bold;">' + format(player[this.layer].nebula) + '</span> <span style="color:#6b7280;font-size:12px;">(+' + format(rate) + '/s)</span></span>'
                    if (player.s.novaShards.gt(0)) {
                        let nBoost = format(player.s.novaShards.add(1).pow(0.1))
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
                    if (nebBuy13.gt(0)) rate = rate.mul(nebBuy13.add(1).pow(0.5))
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

