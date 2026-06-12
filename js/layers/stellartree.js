addLayer("stellartree", {
    name: "Stellar Tree",
    symbol: "\u2605",
    position: 2,
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "#00ffaa",
    resource: "Stellar Energy",
    type: "none",
    row: 1,
    layerShown() { return hasMilestone("starlayer", 6) },
    tooltipLocked() {
        return "Unlocked at 8 Stars"
    },
    nodeStyle() { return {
        "border": "2px solid rgba(0,255,170,0.4)",
        "box-shadow": "0 0 15px rgba(0,255,170,0.2)",
    }},
    upgrades: {
        51: {
            title: "Nebula Overdrive",
            description: "Cube all Nebula buyable effects",
            cost: new Decimal("1e42"),
            currencyInternalName: "nebula",
            currencyLayer: "starlayer",
            currencyDisplayName: "Nebula",
            effect() { return new Decimal(3) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x exponent" },
            unlocked() { return true },
            style() {
                let b = player.stellartree && player.stellartree.upgrades.includes(51)
                let a = !b && player.starlayer && player.starlayer.nebula.gte(1e42)
                if (b) return {
                    "background": "rgba(0,255,170,0.06)",
                    "border": "1px solid rgba(0,255,170,0.25)",
                    "border-radius": "10px",
                    "color": "#00ffaa",
                    "padding": "10px 14px",
                    "font-family": "'Segoe UI', sans-serif",
                    "box-shadow": "inset 0 0 20px rgba(0,255,170,0.04)",
                    "transition": "all 0.2s ease",
                }
                if (a) return {
                    "background": "rgba(0,255,170,0.03)",
                    "border": "1px solid rgba(0,255,170,0.15)",
                    "border-radius": "10px",
                    "color": "#e0e0e0",
                    "padding": "10px 14px",
                    "font-family": "'Segoe UI', sans-serif",
                    "transition": "all 0.2s ease",
                    "cursor": "pointer",
                }
                return {
                    "background": "transparent",
                    "border": "1px solid rgba(255,255,255,0.12)",
                    "border-radius": "10px",
                    "color": "rgba(255,255,255,0.45)",
                    "padding": "10px 14px",
                    "font-family": "'Segoe UI', sans-serif",
                    "transition": "all 0.2s ease",
                }
            },
        },
        52: {
            title: "Nova Resonance",
            description: "Nova Shard effects x3, passively generates Nova Shards at 100% rate without consuming Protostar",
            cost: new Decimal("1e48"),
            currencyInternalName: "nebula",
            currencyLayer: "starlayer",
            currencyDisplayName: "Nebula",
            effect() { return new Decimal(3) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x, passive Nova generation" },
            unlocked() { return hasUpgrade("stellartree", 51) },
            style() {
                let b = player.stellartree && player.stellartree.upgrades.includes(52)
                let a = !b && player.starlayer && player.starlayer.nebula.gte(1e25)
                if (b) return {
                    "background": "rgba(150,100,255,0.06)",
                    "border": "1px solid rgba(150,100,255,0.25)",
                    "border-radius": "10px",
                    "color": "#c084fc",
                    "padding": "10px 14px",
                    "font-family": "'Segoe UI', sans-serif",
                    "box-shadow": "inset 0 0 20px rgba(150,100,255,0.04)",
                    "transition": "all 0.2s ease",
                }
                if (a) return {
                    "background": "rgba(150,100,255,0.03)",
                    "border": "1px solid rgba(150,100,255,0.15)",
                    "border-radius": "10px",
                    "color": "#e0e0e0",
                    "padding": "10px 14px",
                    "font-family": "'Segoe UI', sans-serif",
                    "transition": "all 0.2s ease",
                    "cursor": "pointer",
                }
                return {
                    "background": "transparent",
                    "border": "1px solid rgba(255,255,255,0.12)",
                    "border-radius": "10px",
                    "color": "rgba(255,255,255,0.45)",
                    "padding": "10px 14px",
                    "font-family": "'Segoe UI', sans-serif",
                    "transition": "all 0.2s ease",
                }
            },
        },
        53: {
            title: "Condenser Mastery",
            description: "Autobuyer buys max level Condensed Stardust",
            cost: new Decimal("1e49"),
            currencyInternalName: "nebula",
            currencyLayer: "starlayer",
            currencyDisplayName: "Nebula",
            effect() { return new Decimal(1) },
            effectDisplay() { return "Auto-max Condenser" },
            unlocked() { return hasUpgrade("stellartree", 51) },
            style() {
                let b = player.stellartree && player.stellartree.upgrades.includes(53)
                let a = !b && player.starlayer && player.starlayer.nebula.gte(1e30)
                if (b) return {
                    "background": "rgba(255,107,107,0.06)",
                    "border": "1px solid rgba(255,107,107,0.25)",
                    "border-radius": "10px",
                    "color": "#ff6b6b",
                    "padding": "10px 14px",
                    "font-family": "'Segoe UI', sans-serif",
                    "box-shadow": "inset 0 0 20px rgba(255,107,107,0.04)",
                    "transition": "all 0.2s ease",
                }
                if (a) return {
                    "background": "rgba(255,107,107,0.03)",
                    "border": "1px solid rgba(255,107,107,0.15)",
                    "border-radius": "10px",
                    "color": "#e0e0e0",
                    "padding": "10px 14px",
                    "font-family": "'Segoe UI', sans-serif",
                    "transition": "all 0.2s ease",
                    "cursor": "pointer",
                }
                return {
                    "background": "transparent",
                    "border": "1px solid rgba(255,255,255,0.12)",
                    "border-radius": "10px",
                    "color": "rgba(255,255,255,0.45)",
                    "padding": "10px 14px",
                    "font-family": "'Segoe UI', sans-serif",
                    "transition": "all 0.2s ease",
                }
            },
        },
        55: {
            title: "Protostar Crystallization",
            description: "Matter gains log10(Protostar's Stardust boost + 1)x",
            cost: new Decimal("2e49"),
            currencyInternalName: "nebula",
            currencyLayer: "starlayer",
            currencyDisplayName: "Nebula",
            effect() {
                let rawInst = player.s.instability
                if (rawInst.gt(10000)) rawInst = rawInst.pow(0.5).mul(100)
                let instMul = rawInst.div(100).add(1)
                let protoBoost = player.s.protostar.add(1).pow(new Decimal(0.02).mul(instMul))
                if (protoBoost.gt(1e10)) protoBoost = protoBoost.pow(0.5).mul(1e5)
                if (protoBoost.gt(1e20)) protoBoost = protoBoost.pow(0.25).mul(1e15)
                return Decimal.log10(protoBoost.add(1)).max(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x Matter" },
            unlocked() { return hasUpgrade("stellartree", 53) },
            style() {
                let b = player.stellartree && player.stellartree.upgrades.includes(55)
                let a = !b && player.starlayer && player.starlayer.nebula.gte(1e40)
                if (b) return {
                    "background": "rgba(192,132,252,0.06)",
                    "border": "1px solid rgba(192,132,252,0.25)",
                    "border-radius": "10px",
                    "color": "#c084fc",
                    "padding": "10px 14px",
                    "font-family": "'Segoe UI', sans-serif",
                    "box-shadow": "inset 0 0 20px rgba(192,132,252,0.04)",
                    "transition": "all 0.2s ease",
                }
                if (a) return {
                    "background": "rgba(192,132,252,0.03)",
                    "border": "1px solid rgba(192,132,252,0.15)",
                    "border-radius": "10px",
                    "color": "#e0e0e0",
                    "padding": "10px 14px",
                    "font-family": "'Segoe UI', sans-serif",
                    "transition": "all 0.2s ease",
                    "cursor": "pointer",
                }
                return {
                    "background": "transparent",
                    "border": "1px solid rgba(255,255,255,0.12)",
                    "border-radius": "10px",
                    "color": "rgba(255,255,255,0.45)",
                    "padding": "10px 14px",
                    "font-family": "'Segoe UI', sans-serif",
                    "transition": "all 0.2s ease",
                }
            },
        },
        56: {
            title: "Nebula Amplification",
            description: "Nebula buyable effects ^2",
            cost: new Decimal("1e50"),
            currencyInternalName: "nebula",
            currencyLayer: "starlayer",
            currencyDisplayName: "Nebula",
            effect() { return new Decimal(2) },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x exponent" },
            unlocked() { return hasUpgrade("stellartree", 55) },
            style() {
                let b = player.stellartree && player.stellartree.upgrades.includes(56)
                let a = !b && player.starlayer && player.starlayer.nebula.gte(1e50)
                if (b) return {
                    "background": "rgba(255,179,71,0.06)",
                    "border": "1px solid rgba(255,179,71,0.25)",
                    "border-radius": "10px",
                    "color": "#ffb347",
                    "padding": "10px 14px",
                    "font-family": "'Segoe UI', sans-serif",
                    "box-shadow": "inset 0 0 20px rgba(255,179,71,0.04)",
                    "transition": "all 0.2s ease",
                }
                if (a) return {
                    "background": "rgba(255,179,71,0.03)",
                    "border": "1px solid rgba(255,179,71,0.15)",
                    "border-radius": "10px",
                    "color": "#e0e0e0",
                    "padding": "10px 14px",
                    "font-family": "'Segoe UI', sans-serif",
                    "transition": "all 0.2s ease",
                    "cursor": "pointer",
                }
                return {
                    "background": "transparent",
                    "border": "1px solid rgba(255,255,255,0.12)",
                    "border-radius": "10px",
                    "color": "rgba(255,255,255,0.45)",
                    "padding": "10px 14px",
                    "font-family": "'Segoe UI', sans-serif",
                    "transition": "all 0.2s ease",
                }
            },
        },
        57: {
            title: "Dark Side",
            description: "Unlocks Dark Matter layer",
            cost: new Decimal("1e60"),
            currencyInternalName: "nebula",
            currencyLayer: "starlayer",
            currencyDisplayName: "Nebula",
            unlocked() { return hasUpgrade("stellartree", 56) },
            style() {
                let b = player.stellartree && player.stellartree.upgrades.includes(57)
                let a = !b && player.starlayer && player.starlayer.nebula.gte(1e60)
                if (b) return {
                    "background": "rgba(248,236,201,0.06)",
                    "border": "1px solid rgba(248,236,201,0.25)",
                    "border-radius": "10px",
                    "color": "#F8ECC9",
                    "padding": "10px 14px",
                    "font-family": "'Segoe UI', sans-serif",
                    "box-shadow": "inset 0 0 20px rgba(248,236,201,0.04)",
                    "transition": "all 0.2s ease",
                }
                if (a) return {
                    "background": "rgba(248,236,201,0.03)",
                    "border": "1px solid rgba(248,236,201,0.15)",
                    "border-radius": "10px",
                    "color": "#e0e0e0",
                    "padding": "10px 14px",
                    "font-family": "'Segoe UI', sans-serif",
                    "transition": "all 0.2s ease",
                    "cursor": "pointer",
                }
                return {
                    "background": "transparent",
                    "border": "1px solid rgba(255,255,255,0.12)",
                    "border-radius": "10px",
                    "color": "rgba(255,255,255,0.45)",
                    "padding": "10px 14px",
                    "font-family": "'Segoe UI', sans-serif",
                    "transition": "all 0.2s ease",
                }
            },
        },
                    58: {
            title: "Star Genesis",
            description: "Cubes all Star-boosted upgrade effects",
            cost: new Decimal("1e65"),
            currencyInternalName: "nebula",
            currencyLayer: "starlayer",
            currencyDisplayName: "Nebula",
            effect() { return new Decimal(3) },
            effectDisplay() { return "^" + format(upgradeEffect(this.layer, this.id)) + " to Star upgrades" },
            unlocked() { return hasUpgrade("stellartree", 56) },
            style() {
                let b = player.stellartree && player.stellartree.upgrades.includes(58)
                let a = !b && player.starlayer && player.starlayer.nebula.gte(1e65)
                if (b) return {
                    "background": "rgba(255,68,68,0.06)",
                    "border": "1px solid rgba(255,68,68,0.25)",
                    "border-radius": "10px",
                    "color": "#ff4444",
                    "padding": "10px 14px",
                    "font-family": "'Segoe UI', sans-serif",
                    "box-shadow": "inset 0 0 20px rgba(255,68,68,0.04)",
                    "transition": "all 0.2s ease",
                }
                if (a) return {
                    "background": "rgba(255,68,68,0.03)",
                    "border": "1px solid rgba(255,68,68,0.15)",
                    "border-radius": "10px",
                    "color": "#e0e0e0",
                    "padding": "10px 14px",
                    "font-family": "'Segoe UI', sans-serif",
                    "transition": "all 0.2s ease",
                    "cursor": "pointer",
                }
                return {
                    "background": "transparent",
                    "border": "1px solid rgba(255,255,255,0.12)",
                    "border-radius": "10px",
                    "color": "rgba(255,255,255,0.45)",
                    "padding": "10px 14px",
                    "font-family": "'Segoe UI', sans-serif",
                    "transition": "all 0.2s ease",
                }
            },
        },
        59: {
            title: "Void Harvest",
            description: "Dark Energy boosts Nebula generation",
            cost: new Decimal("1e63"),
            currencyInternalName: "nebula",
            currencyLayer: "starlayer",
            currencyDisplayName: "Nebula",
            effect() {
                let de = player.darkmatter && player.darkmatter.darkEnergy ? player.darkmatter.darkEnergy : new Decimal(0)
                return de.add(1).pow(0.1).max(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x Nebula" },
            unlocked() { return hasUpgrade("stellartree", 57) },
            style() {
                let b = player.stellartree && player.stellartree.upgrades.includes(59)
                let a = !b && player.starlayer && player.starlayer.nebula.gte(1e63)
                if (b) return {
                    "background": "rgba(192,132,252,0.06)",
                    "border": "1px solid rgba(192,132,252,0.25)",
                    "border-radius": "10px",
                    "color": "#c084fc",
                    "padding": "10px 14px",
                    "font-family": "'Segoe UI', sans-serif",
                    "box-shadow": "inset 0 0 20px rgba(192,132,252,0.04)",
                    "transition": "all 0.2s ease",
                }
                if (a) return {
                    "background": "rgba(192,132,252,0.03)",
                    "border": "1px solid rgba(192,132,252,0.15)",
                    "border-radius": "10px",
                    "color": "#e0e0e0",
                    "padding": "10px 14px",
                    "font-family": "'Segoe UI', sans-serif",
                    "transition": "all 0.2s ease",
                    "cursor": "pointer",
                }
                return {
                    "background": "transparent",
                    "border": "1px solid rgba(255,255,255,0.12)",
                    "border-radius": "10px",
                    "color": "rgba(255,255,255,0.45)",
                    "padding": "10px 14px",
                    "font-family": "'Segoe UI', sans-serif",
                    "transition": "all 0.2s ease",
                }
            },
        },
        60: {
            title: "Nova Condenser",
            description: "Condenser boosts Protostar generation",
            cost: new Decimal("1e90"),
            currencyInternalName: "nebula",
            currencyLayer: "starlayer",
            currencyDisplayName: "Nebula",
            effect() {
                let condensed = getBuyableAmount("s", 31)
                if (condensed.lte(0)) return new Decimal(1)
                let effective = softcapCondensed(condensed)
                let exp = (hasUpgrade("starlayer", 23) ? new Decimal(2).mul(upgradeEffect("starlayer", 23)) : new Decimal(2)).mul(hasUpgrade("s", 44) ? upgradeEffect("s", 44) : 1)
                let mainEffect = effective.add(1).pow(exp)
                return Decimal.log10(mainEffect.add(1)).max(1)
            },
            effectDisplay() { return format(upgradeEffect(this.layer, this.id)) + "x Protostar" },
            unlocked() { return hasUpgrade("stellartree", 59) },
            style() {
                let b = player.stellartree && player.stellartree.upgrades.includes(60)
                let a = !b && player.starlayer && player.starlayer.nebula.gte(1e90)
                if (b) return {
                    "background": "rgba(0,255,170,0.06)",
                    "border": "1px solid rgba(0,255,170,0.25)",
                    "border-radius": "10px",
                    "color": "#00ffaa",
                    "padding": "10px 14px",
                    "font-family": "'Segoe UI', sans-serif",
                    "box-shadow": "inset 0 0 20px rgba(0,255,170,0.04)",
                    "transition": "all 0.2s ease",
                }
                if (a) return {
                    "background": "rgba(0,255,170,0.03)",
                    "border": "1px solid rgba(0,255,170,0.15)",
                    "border-radius": "10px",
                    "color": "#e0e0e0",
                    "padding": "10px 14px",
                    "font-family": "'Segoe UI', sans-serif",
                    "transition": "all 0.2s ease",
                    "cursor": "pointer",
                }
                return {
                    "background": "transparent",
                    "border": "1px solid rgba(255,255,255,0.12)",
                    "border-radius": "10px",
                    "color": "rgba(255,255,255,0.45)",
                    "padding": "10px 14px",
                    "font-family": "'Segoe UI', sans-serif",
                    "transition": "all 0.2s ease",
                }
            },
        },
    },
    tabFormat: {
        "Main": {
            content: [
                ["display-text", function() {
                    return '<div style="text-align:center;padding:8px 0 4px 0;">' +
                        '<span style="font-size:22px;font-weight:bold;color:#00ffaa;text-shadow:0 0 15px rgba(0,255,170,0.4),0 0 30px rgba(0,255,170,0.1);letter-spacing:2px;">\u2605 STELLAR TREE</span>' +
                        '<br><span style="font-size:11px;color:rgba(0,255,170,0.3);letter-spacing:4px;">\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014</span></div>'
                }],
                "blank",
                ["upgrade-tree", [
                    [51],
                    [52, 53],
                    [55],
                    [56],
                    [57, 58],
                    [59],
                    [60]
                ]],
            ],
            style: {
                "background": "radial-gradient(ellipse at 50% 15%, rgba(0,255,170,0.04) 0%, transparent 50%), radial-gradient(ellipse at 80% 50%, rgba(150,100,255,0.02) 0%, transparent 40%), radial-gradient(ellipse at 20% 80%, rgba(255,179,71,0.02) 0%, transparent 40%), linear-gradient(180deg, #020a06 0%, #06120e 25%, #0a1a14 50%, #06120e 75%, #020a06 100%)",
                "border": "1px solid rgba(0,255,170,0.1)",
                "border-radius": "20px",
                "padding": "24px 20px",
                "box-shadow": "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(0,255,170,0.05)",
                "position": "relative",
                "overflow": "hidden",
            },
        },
    },
})
