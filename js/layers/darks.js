addLayer("darks", {
    name: "Dark Stardust",
    symbol: "DS",
    position: 1,
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "#c084fc",
    componentStyles: {
        "prestige-button": {
            "color": "#ffffff",
            "font-weight": "bold",
            "font-size": "16px",
            "border": "2px solid rgba(187,134,252,0.4)",
            "box-shadow": "0 4px 15px rgba(0,0,0,0.3)",
        },
    },
    requires: new Decimal(1),
    resource: "Dark Stardust",
    baseResource: "Dark Matter",
    baseAmount() { return player.darkmatter ? player.darkmatter.points : new Decimal(0) },
    type: "normal",
    exponent: 0.5,
    canBuyMax: true,
    gainMult() {
        let mult = new Decimal(1)
        if (player.darkmatter && player.darkmatter.darkEnergy && player.darkmatter.darkEnergy.gt(0)) {
            mult = mult.mul(player.darkmatter.darkEnergy.add(1).pow(0.15))
        }
        if (player.darkmatter && player.darkmatter.points && player.darkmatter.points.gt(0)) {
            mult = mult.mul(player.darkmatter.points.add(1).pow(0.05))
        }
        return mult
    },
    gainExp() { return new Decimal(1) },
    onPrestige(gain) {
        if (player.darkmatter) player.darkmatter.points = new Decimal(0)
    },
    row: 0,
    layerShown() { return player.darkmatter && player.darkmatter.activeChallenge && player.darkmatter.activeChallenge >= 11 },
    tooltipLocked() {
        return "Available during Dark Trial"
    },
    nodeStyle() { return {
        "border": "2px solid rgba(187,134,252,0.4)",
        "box-shadow": "0 0 15px rgba(187,134,252,0.2)",
    }},
    upgrades: {
        cols: 1,
        11: {
            title: "Dark Amplification",
            description: "Matter generation x100",
            cost: new Decimal(1),
            currencyInternalName: "points",
            currencyLayer: "darks",
            currencyDisplayName: "Dark Stardust",
            effect() { return new Decimal(100) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x Matter" },
            unlocked() { return true },
            style() {
                let bought = player.darks && player.darks.upgrades.includes(11)
                if (bought) {
                    return {
                        "background": "linear-gradient(135deg, #0a2a0a 0%, #0d3a0d 100%)",
                        "border": "2px solid rgba(74,222,128,0.5)",
                        "border-radius": "16px",
                        "box-shadow": "0 4px 15px rgba(74,222,128,0.2)",
                        "color": "#4ade80",
                        "font-family": "'Segoe UI', sans-serif",
                        "padding": "12px",
                    }
                }
                let afford = player.darks && player.darks.points.gte(1)
                if (afford) {
                    return {
                        "background": "linear-gradient(135deg, #2a1040 0%, #3d2060 100%)",
                        "border": "2px solid rgba(187,134,252,0.6)",
                        "border-radius": "16px",
                        "box-shadow": "0 4px 15px rgba(187,134,252,0.3)",
                        "color": "#ffffff",
                        "font-family": "'Segoe UI', sans-serif",
                        "padding": "12px",
                    }
                }
                return {
                    "background": "linear-gradient(135deg, #1a0030 0%, #2d0050 100%)",
                    "border": "2px solid rgba(187,134,252,0.3)",
                    "border-radius": "16px",
                    "box-shadow": "0 4px 15px rgba(0,0,0,0.3)",
                    "color": "#6b7280",
                    "font-family": "'Segoe UI', sans-serif",
                    "padding": "12px",
                }
            },
        },
        12: {
            title: "Dark Resonance",
            description: "Dark Stardust boosts Matter gain",
            cost: new Decimal(100),
            currencyInternalName: "points",
            currencyLayer: "darks",
            currencyDisplayName: "Dark Stardust",
            effect() {
                return player.darks.points.add(1).pow(0.3)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x Matter" },
            unlocked() { return inChallenge("darkmatter", 12) || inChallenge("darkmatter", 13) },
            style() {
                let bought = player.darks && player.darks.upgrades.includes(12)
                if (bought) {
                    return {
                        "background": "linear-gradient(135deg, #0a1a2a 0%, #0d2a3d 100%)",
                        "border": "2px solid rgba(74,180,222,0.5)",
                        "border-radius": "16px",
                        "box-shadow": "0 4px 15px rgba(74,180,222,0.2)",
                        "color": "#4ab4de",
                        "font-family": "'Segoe UI', sans-serif",
                        "padding": "12px",
                    }
                }
                let afford = player.darks && player.darks.points.gte(100)
                if (afford) {
                    return {
                        "background": "linear-gradient(135deg, #102040 0%, #203060 100%)",
                        "border": "2px solid rgba(100,180,255,0.6)",
                        "border-radius": "16px",
                        "box-shadow": "0 4px 15px rgba(100,180,255,0.3)",
                        "color": "#ffffff",
                        "font-family": "'Segoe UI', sans-serif",
                        "padding": "12px",
                    }
                }
                return {
                    "background": "linear-gradient(135deg, #001030 0%, #002050 100%)",
                    "border": "2px solid rgba(100,180,255,0.3)",
                    "border-radius": "16px",
                    "box-shadow": "0 4px 15px rgba(0,0,0,0.3)",
                    "color": "#6b7280",
                    "font-family": "'Segoe UI', sans-serif",
                    "padding": "12px",
                }
            },
        },
        13: {
            title: "Stardust Shadow",
            description: "Dark Stardust boosts Stardust gain",
            cost: new Decimal(250),
            currencyInternalName: "points",
            currencyLayer: "darks",
            currencyDisplayName: "Dark Stardust",
            effect() {
                return player.darks.points.add(1).pow(0.3)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x Stardust" },
            unlocked() { return inChallenge("darkmatter", 12) || inChallenge("darkmatter", 13) },
            style() {
                let bought = player.darks && player.darks.upgrades.includes(13)
                if (bought) {
                    return {
                        "background": "linear-gradient(135deg, #2a0a1a 0%, #3d0d2a 100%)",
                        "border": "2px solid rgba(222,74,180,0.5)",
                        "border-radius": "16px",
                        "box-shadow": "0 4px 15px rgba(222,74,180,0.2)",
                        "color": "#de4ab4",
                        "font-family": "'Segoe UI', sans-serif",
                        "padding": "12px",
                    }
                }
                let afford = player.darks && player.darks.points.gte(250)
                if (afford) {
                    return {
                        "background": "linear-gradient(135deg, #401030 0%, #602050 100%)",
                        "border": "2px solid rgba(255,100,200,0.6)",
                        "border-radius": "16px",
                        "box-shadow": "0 4px 15px rgba(255,100,200,0.3)",
                        "color": "#ffffff",
                        "font-family": "'Segoe UI', sans-serif",
                        "padding": "12px",
                    }
                }
                return {
                    "background": "linear-gradient(135deg, #300010 0%, #500020 100%)",
                    "border": "2px solid rgba(255,100,200,0.3)",
                    "border-radius": "16px",
                    "box-shadow": "0 4px 15px rgba(0,0,0,0.3)",
                    "color": "#6b7280",
                    "font-family": "'Segoe UI', sans-serif",
                    "padding": "12px",
                }
            },
        },
        14: {
            title: "Softcap Breaker",
            description: "Remove the first Stardust softcap during trials",
            cost: new Decimal(500),
            currencyInternalName: "points",
            currencyLayer: "darks",
            currencyDisplayName: "Dark Stardust",
            effect() { return new Decimal(1) },
            effectDisplay() { return "First softcap bypassed" },
            unlocked() { return inChallenge("darkmatter", 12) || inChallenge("darkmatter", 13) },
            style() {
                let bought = player.darks && player.darks.upgrades.includes(14)
                if (bought) {
                    return {
                        "background": "linear-gradient(135deg, #2a2a0a 0%, #3d3d0d 100%)",
                        "border": "2px solid rgba(255,215,0,0.5)",
                        "border-radius": "16px",
                        "box-shadow": "0 4px 15px rgba(255,215,0,0.2)",
                        "color": "#ffd700",
                        "font-family": "'Segoe UI', sans-serif",
                        "padding": "12px",
                    }
                }
                let afford = player.darks && player.darks.points.gte(500)
                if (afford) {
                    return {
                        "background": "linear-gradient(135deg, #3d2a0a 0%, #604010 100%)",
                        "border": "2px solid rgba(255,215,0,0.6)",
                        "border-radius": "16px",
                        "box-shadow": "0 4px 15px rgba(255,215,0,0.3)",
                        "color": "#ffffff",
                        "font-family": "'Segoe UI', sans-serif",
                        "padding": "12px",
                    }
                }
                return {
                    "background": "linear-gradient(135deg, #2a1a00 0%, #3d2a00 100%)",
                    "border": "2px solid rgba(255,215,0,0.3)",
                    "border-radius": "16px",
                    "box-shadow": "0 4px 15px rgba(0,0,0,0.3)",
                    "color": "#6b7280",
                    "font-family": "'Segoe UI', sans-serif",
                    "padding": "12px",
                }
            },
        },
        15: {
            title: "Exponent Breaker",
            description: "Stardust exponent +0.2",
            cost: new Decimal(1000),
            currencyInternalName: "points",
            currencyLayer: "darks",
            currencyDisplayName: "Dark Stardust",
            effect() { return new Decimal(0.2) },
            effectDisplay() { return "+0.2 Stardust exponent" },
            unlocked() { return inChallenge("darkmatter", 13) },
            style() {
                let bought = player.darks && player.darks.upgrades.includes(15)
                if (bought) {
                    return {
                        "background": "linear-gradient(135deg, #0a2a2a 0%, #0d3d3d 100%)",
                        "border": "2px solid rgba(74,222,222,0.5)",
                        "border-radius": "16px",
                        "box-shadow": "0 4px 15px rgba(74,222,222,0.2)",
                        "color": "#4adede",
                        "font-family": "'Segoe UI', sans-serif",
                        "padding": "12px",
                    }
                }
                let afford = player.darks && player.darks.points.gte(1000)
                if (afford) {
                    return {
                        "background": "linear-gradient(135deg, #104040 0%, #206060 100%)",
                        "border": "2px solid rgba(100,222,222,0.6)",
                        "border-radius": "16px",
                        "box-shadow": "0 4px 15px rgba(100,222,222,0.3)",
                        "color": "#ffffff",
                        "font-family": "'Segoe UI', sans-serif",
                        "padding": "12px",
                    }
                }
                return {
                    "background": "linear-gradient(135deg, #002020 0%, #004040 100%)",
                    "border": "2px solid rgba(100,222,222,0.3)",
                    "border-radius": "16px",
                    "box-shadow": "0 4px 15px rgba(0,0,0,0.3)",
                    "color": "#6b7280",
                    "font-family": "'Segoe UI', sans-serif",
                    "padding": "12px",
                }
            },
        },
    },
    tabFormat: {
        "Main": {
            content: [
                ["display-text", function() {
                    let s = player[this.layer]
                    let upgradeCount = [11, 12, 13, 14, 15].filter(id => s.upgrades.includes(id)).length
                    return '<span style="font-size:20px;font-weight:bold;color:#c084fc;text-shadow:0 0 10px rgba(192,132,252,0.3);">\u2726 Dark Stardust</span><br>' +
                        '<span style="font-size:28px;color:#c084fc;font-weight:bold;">' + format(s.points) + '</span> <span style="color:#9ca3af;font-size:14px;">Dark Stardust</span>' +
                        (upgradeCount > 0 ? '<br><span style="font-size:12px;color:#6b7280;">Upgrades owned: ' + upgradeCount + '/5</span>' : '')
                }],
                "blank",
                "prestige-button",
                "blank",
                ["upgrades", [1, 2, 3, 4, 5]],
            ],
            style: {
                "background": "linear-gradient(145deg, #0a0010 0%, #150020 50%, #0a0010 100%)",
                "border": "1px solid rgba(187,134,252,0.2)",
                "border-radius": "16px",
                "padding": "24px",
                "box-shadow": "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
            },
        },
    },
})
