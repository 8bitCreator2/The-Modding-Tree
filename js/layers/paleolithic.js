function getProgressLevel() {
    let total = player.totalTribalWisdom || new Decimal(0)
    if (total.lte(0)) return new Decimal(0)
    return Decimal.floor(Decimal.log10(total.add(1)))
}

addLayer("paleolithic", {
    name: "Paleolithic",
    symbol: "PL",
    position: 0,
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
    }},
    color: "#b8860b",
    requires: new Decimal(10),
    resource: "Paleolithic Points",
    baseResource: "Knowledge",
    baseAmount() { return player.points },
    type: "normal",
    exponent() { return new Decimal(0.5) },
    gainMult() {
        let mult = new Decimal(1)
        if (hasUpgrade("paleolithic", 14)) mult = mult.mul(upgradeEffect("paleolithic", 14))
        if (hasUpgrade("paleolithic", 22)) mult = mult.mul(upgradeEffect("paleolithic", 22))
        if (hasUpgrade("paleolithic", 32)) mult = mult.mul(upgradeEffect("paleolithic", 32))
        if (hasUpgrade("paleolithic", 34)) mult = mult.mul(upgradeEffect("paleolithic", 34))
        if (hasUpgrade("paleolithic", 35)) mult = mult.mul(upgradeEffect("paleolithic", 35))
        if (hasUpgrade("paleolithic", 41)) mult = mult.mul(upgradeEffect("paleolithic", 41))
        if (hasUpgrade("paleolithic", 44)) mult = mult.mul(upgradeEffect("paleolithic", 44))
        if (hasUpgrade("paleolithic", 45)) mult = mult.mul(upgradeEffect("paleolithic", 45))
        if (hasMilestone("paleolithic", 0)) mult = mult.mul(1.5)
        if (hasMilestone("paleolithic", 2)) mult = mult.mul(1.25)
        if (hasMilestone("paleolithic", 4)) mult = mult.mul(1.5)
        if (hasMilestone("paleolithic", 5)) mult = mult.mul(1.5)
        if (hasMilestone("paleolithic", 7)) mult = mult.mul(2)
        if (hasMilestone("paleolithic", 8)) mult = mult.mul(1.5)
        if (hasMilestone("paleolithic", 10)) mult = mult.mul(2)
        if (hasMilestone("paleolithic", 11)) mult = mult.mul(1.5)
        if (hasMilestone("paleolithic", 13)) mult = mult.mul(2)
        if (hasMilestone("paleolithic", 14)) mult = mult.mul(1.5)
        if (hasMilestone("paleolithic", 16)) mult = mult.mul(3)

        let pl = getProgressLevel()
        if (pl.gt(0)) {
            let plBonus = pl.add(1)
            if (hasUpgrade("paleolithic", 54)) plBonus = plBonus.pow(2)
            mult = mult.mul(plBonus)
        }
        return mult
    },
    gainExp() { return new Decimal(1) },
    onPrestige(gain) {
        let wisdomEarned = hasUpgrade("paleolithic", 15)
            ? Decimal.floor(Decimal.pow(gain, upgradeEffect("paleolithic", 15).toNumber()))
            : Decimal.floor(Decimal.sqrt(gain))
        if (hasUpgrade("paleolithic", 11)) wisdomEarned = wisdomEarned.mul(upgradeEffect("paleolithic", 11))
        if (hasUpgrade("paleolithic", 53)) wisdomEarned = wisdomEarned.mul(upgradeEffect("paleolithic", 53))
        if (hasUpgrade("paleolithic", 42)) wisdomEarned = wisdomEarned.mul(upgradeEffect("paleolithic", 42))
        player.tribalWisdom = (player.tribalWisdom || new Decimal(0)).add(wisdomEarned)
        player.totalTribalWisdom = (player.totalTribalWisdom || new Decimal(0)).add(wisdomEarned)
    },
    row: 0,
    hotkeys: [
        {key: "p", description: "P: Reset for Paleolithic Points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown() { return true },
    tabFormat: {
        "Main": {
            content: [
                ["display-text", function() {
                    let ppGain = (tmp.paleolithic && tmp.paleolithic.resetGain) ? tmp.paleolithic.resetGain : new Decimal(0)
                    return '<div style="display:flex;gap:12px;margin-bottom:12px;">' +
                        '<div style="flex:1;background:linear-gradient(135deg, rgba(232,131,58,0.1), rgba(184,134,11,0.05));border:1px solid rgba(232,131,58,0.2);border-radius:10px;padding:14px 10px;text-align:center;">' +
                        '<div style="color:#e8833a;font-size:10px;letter-spacing:1.5px;margin-bottom:6px;">KNOWLEDGE</div>' +
                        '<div style="color:#e8833a;font-size:24px;font-weight:bold;text-shadow:0 0 10px rgba(232,131,58,0.3);">' + format(player.points) + '</div>' +
                        '<div style="color:#8a7a5a;font-size:10px;margin-top:4px;">+' + format(getPointGen()) + '/sec</div>' +
                        '</div>' +
                        '<div style="flex:1;background:linear-gradient(135deg, rgba(184,134,11,0.1), rgba(139,69,19,0.05));border:1px solid rgba(184,134,11,0.2);border-radius:10px;padding:14px 10px;text-align:center;">' +
                        '<div style="color:#b8860b;font-size:10px;letter-spacing:1.5px;margin-bottom:6px;">PALEOLITHIC POINTS</div>' +
                        '<div style="color:#e8d48b;font-size:24px;font-weight:bold;text-shadow:0 0 10px rgba(232,212,139,0.3);">' + format(player.paleolithic.points) + '</div>' +
                        '<div style="color:#8a7a5a;font-size:10px;margin-top:4px;">+' + format(ppGain) + ' per reset</div>' +
                        '</div>' +
                        '</div>'
                }],
                "prestige-button",
                "blank",
                ["display-text", function() {
                    let wisdom = player.tribalWisdom || new Decimal(0)
                    let total = player.totalTribalWisdom || new Decimal(0)
                    let ppGain = (tmp.paleolithic && tmp.paleolithic.resetGain) ? tmp.paleolithic.resetGain : new Decimal(0)
                    let rawWisdom = hasUpgrade("paleolithic", 15)
                        ? Decimal.floor(Decimal.pow(ppGain, upgradeEffect("paleolithic", 15).toNumber()))
                        : Decimal.floor(Decimal.sqrt(ppGain))
                    let wisdomMult = new Decimal(1)
                    if (hasUpgrade("paleolithic", 11)) wisdomMult = wisdomMult.mul(upgradeEffect("paleolithic", 11))
                    if (hasUpgrade("paleolithic", 53)) wisdomMult = wisdomMult.mul(upgradeEffect("paleolithic", 53))
                    if (hasUpgrade("paleolithic", 42)) wisdomMult = wisdomMult.mul(upgradeEffect("paleolithic", 42))
                    let willEarn = rawWisdom.mul(wisdomMult)
                    let formulaStr = hasUpgrade("paleolithic", 15)
                        ? '\u230A' + format(ppGain) + '^(2/3)\u230B'
                        : '\u230A\u221a(' + format(ppGain) + ')\u230B'
                    return '<div style="background:linear-gradient(135deg, rgba(184,134,11,0.12), rgba(139,69,19,0.08));border:1px solid rgba(184,134,11,0.25);border-radius:12px;padding:16px;margin-bottom:8px;">' +
                        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">' +
                        '<span style="color:#e8d48b;font-size:14px;letter-spacing:1px;">\u2726 TRIBAL WISDOM</span>' +
                        '<span style="color:#e8d48b;font-weight:bold;font-size:20px;text-shadow:0 0 15px rgba(232,212,139,0.4);">' + format(wisdom) + '</span>' +
                        '</div>' +
                        '<div style="display:flex;justify-content:space-between;font-size:11px;color:#8a7a5a;margin-bottom:2px;">' +
                        '<span>Total Wisdom: ' + format(total) + '</span>' +
                        '</div>' +
                        '<div style="color:#6a5a4a;font-size:10px;margin-top:6px;border-top:1px solid rgba(184,134,11,0.15);padding-top:6px;">Earn: ' + formulaStr + ' \u00d7 ' + format(wisdomMult) + ' = ' + format(willEarn) + ' TW per prestige</div>' +
                        '</div>'
                }],
                "blank",
                ["display-text", function() {
                    let tw = player.totalTribalWisdom || new Decimal(0)
                    let rows = [
{label: "DAWN OF TOOLS", req: true, color: "#d4a373"},
{label: "TRIBAL AWAKENING", req: tw.gte(2.5e7), color: "#b8860b"},
{label: "MEGALITHIC AGE", req: tw.gte(1e8), color: "#8B4513"},
{label: "ANCESTRAL LEGACY", req: tw.gte(5e10), color: "#e8d48b"},
{label: "IRON AGE", req: tw.gte(2.5e13), color: "#a0a0c0"},
                    ]
                    let html = '<div style="display:flex;gap:6px;margin-bottom:8px;">'
                    for (let r of rows) {
                        let color = r.req ? r.color : "#4b5563"
                        let textColor = r.req ? r.color : "#6b7280"
                        let glow = r.req ? 'text-shadow:0 0 8px ' + color + '40;' : ''
                        html += '<div style="flex:1;text-align:center;padding:5px 4px;border-radius:6px;background:rgba(0,0,0,0.2);border:1px solid ' + color + '40;font-size:9px;font-weight:bold;letter-spacing:0.5px;color:' + textColor + ';' + glow + '">' +
                            (r.req ? '' : '<span style="color:#ef4444;margin-right:3px;">\u274c</span>') + r.label + '</div>'
                    }
                    html += '</div>'
                    return html
                }],
            ],
            style: {
        "background": "linear-gradient(145deg, #1a0a05 0%, #2a1508 50%, #1a0a05 100%)",
        "border": "1px solid rgba(184,134,11,0.25)",
                "border-radius": "16px",
                "padding": "24px",
                "box-shadow": "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
            },
        },
        "Upgrades": {
            content: [
                ["upgrades", [1, 2, 3, 4, 5]],
            ],
            style: {
                "background": "linear-gradient(145deg, #1a0a05 0%, #2a1508 50%, #1a0a05 100%)",
                "border": "1px solid rgba(184,134,11,0.25)",
                "border-radius": "16px",
                "padding": "24px",
                "box-shadow": "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
            },
        },
        "Ages": {
            content: [
                ["display-text", function() {
                    let ages = [
                        {name: "DAWN OF TOOLS", ids: [0,1,2,3,4], color: "#d4a373"},
                        {name: "TRIBAL AWAKENING", ids: [5,6,7], color: "#b8860b"},
                        {name: "MEGALITHIC AGE", ids: [8,9,10], color: "#8B4513"},
                        {name: "ANCESTRAL LEGACY", ids: [11,12,13], color: "#e8d48b"},
                        {name: "IRON AGE", ids: [14,15,16], color: "#a0a0c0"},
                    ]
                    let m = layers.paleolithic.milestones
                    let html = '<div style="display:flex;flex-direction:column;gap:8px;">'
                    for (let age of ages) {
                        html += '<div style="background:linear-gradient(135deg, rgba(0,0,0,0.25), rgba(0,0,0,0.1));border:1px solid ' + age.color + '30;border-radius:10px;padding:10px;">'
                        html += '<div style="color:' + age.color + ';font-size:11px;font-weight:bold;letter-spacing:1px;margin-bottom:6px;">\u2726 ' + age.name + '</div>'
                        for (let id of age.ids) {
                            if (!m[id]) continue
                            let done = hasMilestone("paleolithic", id)
                            html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:3px 0;border-bottom:1px solid rgba(255,255,255,0.03);">'
                            html += '<div style="display:flex;align-items:center;gap:5px;">'
                            html += '<span style="color:' + (done ? '#7a9a6a' : '#ef4444') + ';font-size:11px;">' + (done ? '\u2714' : '\u2718') + '</span>'
                            html += '<span style="color:' + (done ? '#8aba7a' : '#8a7a5a') + ';font-size:10px;">' + m[id].requirementDescription + '</span>'
                            html += '</div>'
                            html += '<span style="color:' + (done ? '#8aba7a' : '#6a5a4a') + ';font-size:10px;">' + m[id].effectDescription + '</span>'
                            html += '</div>'
                        }
                        html += '</div>'
                    }
                    html += '</div>'
                    return html
                }],
            ],
            style: {
                "background": "linear-gradient(145deg, #1a0a05 0%, #2a1508 50%, #1a0a05 100%)",
                "border": "1px solid rgba(184,134,11,0.25)",
                "border-radius": "16px",
                "padding": "24px",
                "box-shadow": "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
            },
        },
    },
    upgrades: {
        cols: 5,
        rows: 5,
        11: {
            title: "Sharpened Stick",
            description: "Paleolithic Points boost Tribal Wisdom earned",
            effect() {
                return Decimal.max(1, Decimal.sqrt(player["paleolithic"].points.add(1)))
            },
            effectDisplay() { return format(upgradeEffect("paleolithic", 11)) + "x Wisdom" },
            cost() { return new Decimal(5) },
            canAfford() {
                if (player.paleolithic.upgrades.includes(Number(this.id))) return false
                return (player.tribalWisdom || new Decimal(0)).gte(this.cost())
            },
            pay() { player.tribalWisdom = player.tribalWisdom.sub(this.cost()) },
            fullDisplay() {
                let aff = this.canAfford()
                let owned = player.paleolithic.upgrades.includes(Number(this.id))
                return '<h3>Sharpened Stick</h3><br>Paleolithic Points boost Tribal Wisdom earned<br>Currently: ' + this.effectDisplay() + (!owned ? '<br><br>Cost: <span style="color:' + (aff ? '#e8d48b' : '#ef4444') + ';">' + format(this.cost()) + ' Tribal Wisdom</span>' : '')
            },
            unlocked() { return true },
            style() {
                let aff = (player.tribalWisdom || new Decimal(0)).gte(5)
                let bought = player.paleolithic.upgrades.includes(11)
                if (bought) return { "background": "linear-gradient(135deg, #0a1a0a 0%, #0f0f05 100%)", "border": "2px solid rgba(144,200,100,0.35)", "border-radius": "12px", "padding": "8px", "color": "#7a9a6a", "font-family": "'Segoe UI', sans-serif", "transition": "all 0.3s ease", "box-shadow": "inset 0 0 20px rgba(80,160,60,0.08)" }
                if (aff) return { "background": "linear-gradient(135deg, #2a1a0a 0%, #3a2a15 100%)", "border": "2px solid rgba(212,163,115,0.6)", "border-radius": "12px", "padding": "8px", "color": "#e8d4a0", "font-family": "'Segoe UI', sans-serif", "cursor": "pointer", "transition": "all 0.3s ease" }
                return { "background": "linear-gradient(135deg, #050010 0%, #0a0018 100%)", "border": "1px solid rgba(100,80,60,0.15)", "border-radius": "12px", "padding": "8px", "color": "#5a5048", "font-family": "'Segoe UI', sans-serif" }
            },
        },
        12: {
            title: "Campfire",
            description: "Knowledge gain x5",
            effect() {
                let base = new Decimal(5)
                if (hasUpgrade("paleolithic", 21)) base = base.mul(upgradeEffect("paleolithic", 21))
                return base
            },
            effectDisplay() { return format(upgradeEffect("paleolithic", 12)) + "x" },
            cost() { return new Decimal(10) },
            canAfford() {
                if (player.paleolithic.upgrades.includes(Number(this.id))) return false
                return (player.tribalWisdom || new Decimal(0)).gte(this.cost())
            },
            pay() { player.tribalWisdom = player.tribalWisdom.sub(this.cost()) },
            fullDisplay() {
                let aff = this.canAfford()
                let owned = player.paleolithic.upgrades.includes(Number(this.id))
                return '<h3>Campfire</h3><br>Knowledge gain is boosted<br>Currently: ' + this.effectDisplay() + (!owned ? '<br><br>Cost: <span style="color:' + (aff ? '#e8d48b' : '#ef4444') + ';">' + format(this.cost()) + ' Tribal Wisdom</span>' : '')
            },
            unlocked() { return hasUpgrade("paleolithic", 11) },
            style() {
                let aff = (player.tribalWisdom || new Decimal(0)).gte(10)
                let bought = player.paleolithic.upgrades.includes(12)
                if (bought) return { "background": "linear-gradient(135deg, #0a1a0a 0%, #0f0f05 100%)", "border": "2px solid rgba(144,200,100,0.35)", "border-radius": "12px", "padding": "8px", "color": "#7a9a6a", "font-family": "'Segoe UI', sans-serif", "transition": "all 0.3s ease", "box-shadow": "inset 0 0 20px rgba(80,160,60,0.08)" }
                if (aff) return { "background": "linear-gradient(135deg, #2a1a0a 0%, #3a2a15 100%)", "border": "2px solid rgba(212,163,115,0.6)", "border-radius": "12px", "padding": "8px", "color": "#e8d4a0", "font-family": "'Segoe UI', sans-serif", "cursor": "pointer", "transition": "all 0.3s ease" }
                return { "background": "linear-gradient(135deg, #050010 0%, #0a0018 100%)", "border": "1px solid rgba(100,80,60,0.15)", "border-radius": "12px", "padding": "8px", "color": "#5a5048", "font-family": "'Segoe UI', sans-serif" }
            },
        },
        13: {
            title: "Cave Shelter",
            description: "Paleolithic Points boost Knowledge gain",
            effect() {
                let base = player["paleolithic"].points.add(1).pow(0.5)
                if (hasUpgrade("paleolithic", 25)) base = base.mul(upgradeEffect("paleolithic", 25))
                return base
            },
            effectDisplay() { return format(upgradeEffect("paleolithic", 13)) + "x" },
            cost() { return new Decimal(125) },
            canAfford() {
                if (player.paleolithic.upgrades.includes(Number(this.id))) return false
                return (player.tribalWisdom || new Decimal(0)).gte(this.cost())
            },
            pay() { player.tribalWisdom = player.tribalWisdom.sub(this.cost()) },
            fullDisplay() {
                let aff = this.canAfford()
                let owned = player.paleolithic.upgrades.includes(Number(this.id))
                return '<h3>Cave Shelter</h3><br>Paleolithic Points boost Knowledge gain<br>Currently: ' + this.effectDisplay() + (!owned ? '<br><br>Cost: <span style="color:' + (aff ? '#e8d48b' : '#ef4444') + ';">' + format(this.cost()) + ' Tribal Wisdom</span>' : '')
            },
            unlocked() { return hasUpgrade("paleolithic", 12) },
            style() {
                let aff = (player.tribalWisdom || new Decimal(0)).gte(125)
                let bought = player.paleolithic.upgrades.includes(13)
                if (bought) return { "background": "linear-gradient(135deg, #0a1a0a 0%, #0f0f05 100%)", "border": "2px solid rgba(144,200,100,0.35)", "border-radius": "12px", "padding": "8px", "color": "#7a9a6a", "font-family": "'Segoe UI', sans-serif", "transition": "all 0.3s ease", "box-shadow": "inset 0 0 20px rgba(80,160,60,0.08)" }
                if (aff) return { "background": "linear-gradient(135deg, #2a1a0a 0%, #3a2a15 100%)", "border": "2px solid rgba(212,163,115,0.6)", "border-radius": "12px", "padding": "8px", "color": "#e8d4a0", "font-family": "'Segoe UI', sans-serif", "cursor": "pointer", "transition": "all 0.3s ease" }
                return { "background": "linear-gradient(135deg, #050010 0%, #0a0018 100%)", "border": "1px solid rgba(100,80,60,0.15)", "border-radius": "12px", "padding": "8px", "color": "#5a5048", "font-family": "'Segoe UI', sans-serif" }
            },
        },
        14: {
            title: "Hunting Party",
            description: "Paleolithic Points gain x3",
            effect() {
                let base = new Decimal(3)
                if (hasUpgrade("paleolithic", 25)) base = base.mul(upgradeEffect("paleolithic", 25))
                return base
            },
            effectDisplay() { return format(upgradeEffect("paleolithic", 14)) + "x" },
            cost() { return new Decimal(500) },
            canAfford() {
                if (player.paleolithic.upgrades.includes(Number(this.id))) return false
                return (player.tribalWisdom || new Decimal(0)).gte(this.cost())
            },
            pay() { player.tribalWisdom = player.tribalWisdom.sub(this.cost()) },
            fullDisplay() {
                let aff = this.canAfford()
                let owned = player.paleolithic.upgrades.includes(Number(this.id))
                return '<h3>Hunting Party</h3><br>Paleolithic Points gain x3<br>Currently: ' + this.effectDisplay() + (!owned ? '<br><br>Cost: <span style="color:' + (aff ? '#e8d48b' : '#ef4444') + ';">' + format(this.cost()) + ' Tribal Wisdom</span>' : '')
            },
            unlocked() { return hasUpgrade("paleolithic", 13) },
            style() {
                let aff = (player.tribalWisdom || new Decimal(0)).gte(500)
                let bought = player.paleolithic.upgrades.includes(14)
                if (bought) return { "background": "linear-gradient(135deg, #0a1a0a 0%, #0f0f05 100%)", "border": "2px solid rgba(144,200,100,0.35)", "border-radius": "12px", "padding": "8px", "color": "#7a9a6a", "font-family": "'Segoe UI', sans-serif", "transition": "all 0.3s ease", "box-shadow": "inset 0 0 20px rgba(80,160,60,0.08)" }
                if (aff) return { "background": "linear-gradient(135deg, #2a1a0a 0%, #3a2a15 100%)", "border": "2px solid rgba(212,163,115,0.6)", "border-radius": "12px", "padding": "8px", "color": "#e8d4a0", "font-family": "'Segoe UI', sans-serif", "cursor": "pointer", "transition": "all 0.3s ease" }
                return { "background": "linear-gradient(135deg, #050010 0%, #0a0018 100%)", "border": "1px solid rgba(100,80,60,0.15)", "border-radius": "12px", "padding": "8px", "color": "#5a5048", "font-family": "'Segoe UI', sans-serif" }
            },
        },
        15: {
            title: "Stone Tools",
            description: "Improves Tribal Wisdom formula from sqrt(PP) to PP^(2/3)",
            effect() {
                return new Decimal(2/3)
            },
            effectDisplay() { return "PP^" + format(upgradeEffect("paleolithic", 15)) },
            cost() { return new Decimal(2500) },
            canAfford() {
                if (player.paleolithic.upgrades.includes(Number(this.id))) return false
                return (player.tribalWisdom || new Decimal(0)).gte(this.cost())
            },
            pay() { player.tribalWisdom = player.tribalWisdom.sub(this.cost()) },
            fullDisplay() {
                let aff = this.canAfford()
                let owned = player.paleolithic.upgrades.includes(Number(this.id))
                return '<h3>Stone Tools</h3><br>Improves Tribal Wisdom formula from sqrt(PP) to PP^(2/3)<br>Currently: ' + this.effectDisplay() + (!owned ? '<br><br>Cost: <span style="color:' + (aff ? '#e8d48b' : '#ef4444') + ';">' + format(this.cost()) + ' Tribal Wisdom</span>' : '')
            },
            unlocked() { return hasUpgrade("paleolithic", 14) },
            style() {
                let aff = (player.tribalWisdom || new Decimal(0)).gte(2500)
                let bought = player.paleolithic.upgrades.includes(15)
                if (bought) return { "background": "linear-gradient(135deg, #0a1a0a 0%, #0f0f05 100%)", "border": "2px solid rgba(144,200,100,0.35)", "border-radius": "12px", "padding": "8px", "color": "#7a9a6a", "font-family": "'Segoe UI', sans-serif", "transition": "all 0.3s ease", "box-shadow": "inset 0 0 20px rgba(80,160,60,0.08)" }
                if (aff) return { "background": "linear-gradient(135deg, #2a1a0a 0%, #3a2a15 100%)", "border": "2px solid rgba(212,163,115,0.6)", "border-radius": "12px", "padding": "8px", "color": "#e8d4a0", "font-family": "'Segoe UI', sans-serif", "cursor": "pointer", "transition": "all 0.3s ease" }
                return { "background": "linear-gradient(135deg, #050010 0%, #0a0018 100%)", "border": "1px solid rgba(100,80,60,0.15)", "border-radius": "12px", "padding": "8px", "color": "#5a5048", "font-family": "'Segoe UI', sans-serif" }
            },
        },
        21: {
            title: "Fire Mastery",
            description: "Campfire is multiplied by 6 (total x30)",
            effect() { return new Decimal(6) },
            effectDisplay() { return format(upgradeEffect("paleolithic", 21)) + "x Campfire" },
            cost() { return new Decimal(100000) },
            canAfford() {
                if (player.paleolithic.upgrades.includes(Number(this.id))) return false
                return (player.tribalWisdom || new Decimal(0)).gte(this.cost())
            },
            pay() { player.tribalWisdom = player.tribalWisdom.sub(this.cost()) },
            fullDisplay() {
                let aff = this.canAfford()
                let owned = player.paleolithic.upgrades.includes(Number(this.id))
                return '<h3>Fire Mastery</h3><br>Campfire is multiplied by 6 (total x30)<br>Currently: ' + this.effectDisplay() + (!owned ? '<br><br>Cost: <span style="color:' + (aff ? '#e8d48b' : '#ef4444') + ';">' + format(this.cost()) + ' Tribal Wisdom</span>' : '')
            },
            unlocked() { return hasUpgrade("paleolithic", 15) },
            style() {
                let aff = (player.tribalWisdom || new Decimal(0)).gte(100000)
                let bought = player.paleolithic.upgrades.includes(21)
                if (bought) return { "background": "linear-gradient(135deg, #0a1a0a 0%, #0f0f05 100%)", "border": "2px solid rgba(144,200,100,0.35)", "border-radius": "12px", "padding": "8px", "color": "#7a9a6a", "font-family": "'Segoe UI', sans-serif", "transition": "all 0.3s ease", "box-shadow": "inset 0 0 20px rgba(80,160,60,0.08)" }
                if (aff) return { "background": "linear-gradient(135deg, #2a1a0a 0%, #3a2a15 100%)", "border": "2px solid rgba(212,163,115,0.6)", "border-radius": "12px", "padding": "8px", "color": "#e8d4a0", "font-family": "'Segoe UI', sans-serif", "cursor": "pointer", "transition": "all 0.3s ease" }
                return { "background": "linear-gradient(135deg, #050010 0%, #0a0018 100%)", "border": "1px solid rgba(100,80,60,0.15)", "border-radius": "12px", "padding": "8px", "color": "#5a5048", "font-family": "'Segoe UI', sans-serif" }
            },
        },
        51: {
            title: "Tribal Unity",
            description: "Knowledge boosts its own gain (log)",
            effect() {
                let base = Decimal.max(1, Decimal.log10(player.points.add(10)))
                if (hasUpgrade("paleolithic", 31)) base = base.mul(upgradeEffect("paleolithic", 31))
                return base
            },
            effectDisplay() { return format(upgradeEffect("paleolithic", 51)) + "x" },
            cost() { return new Decimal(4e6) },
            canAfford() {
                if (player.paleolithic.upgrades.includes(Number(this.id))) return false
                return (player.tribalWisdom || new Decimal(0)).gte(this.cost())
            },
            pay() { player.tribalWisdom = player.tribalWisdom.sub(this.cost()) },
            fullDisplay() {
                let aff = this.canAfford()
                let owned = player.paleolithic.upgrades.includes(Number(this.id))
                return '<h3>Tribal Unity</h3><br>Knowledge boosts its own gain<br>Currently: ' + this.effectDisplay() + (!owned ? '<br><br>Cost: <span style="color:' + (aff ? '#e8d48b' : '#ef4444') + ';">' + format(this.cost()) + ' Tribal Wisdom</span>' : '')
            },
            unlocked() { return hasUpgrade("paleolithic", 21) },
            style() {
                let aff = (player.tribalWisdom || new Decimal(0)).gte(4e6)
                let bought = player.paleolithic.upgrades.includes(51)
                if (bought) return { "background": "linear-gradient(135deg, #0a1a0a 0%, #0f0f05 100%)", "border": "2px solid rgba(144,200,100,0.35)", "border-radius": "12px", "padding": "8px", "color": "#7a9a6a", "font-family": "'Segoe UI', sans-serif", "transition": "all 0.3s ease", "box-shadow": "inset 0 0 20px rgba(80,160,60,0.08)" }
                if (aff) return { "background": "linear-gradient(135deg, #2a1a05 0%, #3a2a0a 100%)", "border": "2px solid rgba(184,134,11,0.6)", "border-radius": "12px", "padding": "8px", "color": "#e8d48b", "font-family": "'Segoe UI', sans-serif", "cursor": "pointer", "transition": "all 0.3s ease" }
                return { "background": "linear-gradient(135deg, #050010 0%, #0a0018 100%)", "border": "1px solid rgba(100,80,60,0.15)", "border-radius": "12px", "padding": "8px", "color": "#5a5048", "font-family": "'Segoe UI', sans-serif" }
            },
        },
        22: {
            title: "Spirit Rituals",
            description: "Paleolithic Points boost their own gain (log)",
            effect() {
                let base = Decimal.max(1, Decimal.log10(player["paleolithic"].points.add(10)))
                if (hasUpgrade("paleolithic", 31)) base = base.mul(upgradeEffect("paleolithic", 31))
                return base
            },
            effectDisplay() { return format(upgradeEffect("paleolithic", 22)) + "x" },
            cost() { return new Decimal("1e7") },
            canAfford() {
                if (player.paleolithic.upgrades.includes(Number(this.id))) return false
                return (player.tribalWisdom || new Decimal(0)).gte(this.cost())
            },
            pay() { player.tribalWisdom = player.tribalWisdom.sub(this.cost()) },
            fullDisplay() {
                let aff = this.canAfford()
                let owned = player.paleolithic.upgrades.includes(Number(this.id))
                return '<h3>Spirit Rituals</h3><br>Paleolithic Points boost their own gain<br>Currently: ' + this.effectDisplay() + (!owned ? '<br><br>Cost: <span style="color:' + (aff ? '#e8d48b' : '#ef4444') + ';">' + format(this.cost()) + ' Tribal Wisdom</span>' : '')
            },
            unlocked() { return hasUpgrade("paleolithic", 51) },
            style() {
                let aff = (player.tribalWisdom || new Decimal(0)).gte("1e7")
                let bought = player.paleolithic.upgrades.includes(22)
                if (bought) return { "background": "linear-gradient(135deg, #0a1a0a 0%, #0f0f05 100%)", "border": "2px solid rgba(144,200,100,0.35)", "border-radius": "12px", "padding": "8px", "color": "#7a9a6a", "font-family": "'Segoe UI', sans-serif", "transition": "all 0.3s ease", "box-shadow": "inset 0 0 20px rgba(80,160,60,0.08)" }
                if (aff) return { "background": "linear-gradient(135deg, #2a1a05 0%, #3a2a0a 100%)", "border": "2px solid rgba(184,134,11,0.6)", "border-radius": "12px", "padding": "8px", "color": "#e8d48b", "font-family": "'Segoe UI', sans-serif", "cursor": "pointer", "transition": "all 0.3s ease" }
                return { "background": "linear-gradient(135deg, #050010 0%, #0a0018 100%)", "border": "1px solid rgba(100,80,60,0.15)", "border-radius": "12px", "padding": "8px", "color": "#5a5048", "font-family": "'Segoe UI', sans-serif" }
            },
        },
        23: {
            title: "Cave Paintings",
            description: "Double Knowledge gain",
            effect() { return new Decimal(2) },
            effectDisplay() { return format(upgradeEffect("paleolithic", 23)) + "x" },
            cost() { return new Decimal("2e7") },
            canAfford() {
                if (player.paleolithic.upgrades.includes(Number(this.id))) return false
                return (player.tribalWisdom || new Decimal(0)).gte(this.cost())
            },
            pay() { player.tribalWisdom = player.tribalWisdom.sub(this.cost()) },
            fullDisplay() {
                let aff = this.canAfford()
                let owned = player.paleolithic.upgrades.includes(Number(this.id))
                return '<h3>Cave Paintings</h3><br>Double Knowledge gain<br>Currently: ' + this.effectDisplay() + (!owned ? '<br><br>Cost: <span style="color:' + (aff ? '#e8d48b' : '#ef4444') + ';">' + format(this.cost()) + ' Tribal Wisdom</span>' : '')
            },
            unlocked() { return hasUpgrade("paleolithic", 22) },
            style() {
                let aff = (player.tribalWisdom || new Decimal(0)).gte("2e7")
                let bought = player.paleolithic.upgrades.includes(23)
                if (bought) return { "background": "linear-gradient(135deg, #0a1a0a 0%, #0f0f05 100%)", "border": "2px solid rgba(144,200,100,0.35)", "border-radius": "12px", "padding": "8px", "color": "#7a9a6a", "font-family": "'Segoe UI', sans-serif", "transition": "all 0.3s ease", "box-shadow": "inset 0 0 20px rgba(80,160,60,0.08)" }
                if (aff) return { "background": "linear-gradient(135deg, #2a1a05 0%, #3a2a0a 100%)", "border": "2px solid rgba(184,134,11,0.6)", "border-radius": "12px", "padding": "8px", "color": "#e8d48b", "font-family": "'Segoe UI', sans-serif", "cursor": "pointer", "transition": "all 0.3s ease" }
                return { "background": "linear-gradient(135deg, #050010 0%, #0a0018 100%)", "border": "1px solid rgba(100,80,60,0.15)", "border-radius": "12px", "padding": "8px", "color": "#5a5048", "font-family": "'Segoe UI', sans-serif" }
            },
        },
        24: {
            title: "Spear Crafting",
            description: "Paleolithic Points boost upgrade 12",
            effect() {
                let base = player["paleolithic"].points.div(3).add(1)
                return base
            },
            effectDisplay() { return format(upgradeEffect("paleolithic", 24)) + "x" },
            cost() { return new Decimal("1e8") },
            canAfford() {
                if (player.paleolithic.upgrades.includes(Number(this.id))) return false
                return (player.tribalWisdom || new Decimal(0)).gte(this.cost())
            },
            pay() { player.tribalWisdom = player.tribalWisdom.sub(this.cost()) },
            fullDisplay() {
                let aff = this.canAfford()
                let owned = player.paleolithic.upgrades.includes(Number(this.id))
                return '<h3>Spear Crafting</h3><br>Paleolithic Points boost upgrade 12<br>Currently: ' + this.effectDisplay() + (!owned ? '<br><br>Cost: <span style="color:' + (aff ? '#e8d48b' : '#ef4444') + ';">' + format(this.cost()) + ' Tribal Wisdom</span>' : '')
            },
            unlocked() { return hasUpgrade("paleolithic", 23) },
            style() {
                let aff = (player.tribalWisdom || new Decimal(0)).gte("1e8")
                let bought = player.paleolithic.upgrades.includes(24)
                if (bought) return { "background": "linear-gradient(135deg, #0a1a0a 0%, #0f0f05 100%)", "border": "2px solid rgba(144,200,100,0.35)", "border-radius": "12px", "padding": "8px", "color": "#7a9a6a", "font-family": "'Segoe UI', sans-serif", "transition": "all 0.3s ease", "box-shadow": "inset 0 0 20px rgba(80,160,60,0.08)" }
                if (aff) return { "background": "linear-gradient(135deg, #2a1a05 0%, #3a2a0a 100%)", "border": "2px solid rgba(184,134,11,0.6)", "border-radius": "12px", "padding": "8px", "color": "#e8d48b", "font-family": "'Segoe UI', sans-serif", "cursor": "pointer", "transition": "all 0.3s ease" }
                return { "background": "linear-gradient(135deg, #050010 0%, #0a0018 100%)", "border": "1px solid rgba(100,80,60,0.15)", "border-radius": "12px", "padding": "8px", "color": "#5a5048", "font-family": "'Segoe UI', sans-serif" }
            },
        },
        25: {
            title: "Totem Poles",
            description: "Knowledge boosts upgrades 13 and 14",
            effect() {
                return Decimal.max(1, player.points.div(5).add(1))
            },
            effectDisplay() { return format(upgradeEffect("paleolithic", 25)) + "x" },
            cost() { return new Decimal("2e8") },
            canAfford() {
                if (player.paleolithic.upgrades.includes(Number(this.id))) return false
                return (player.tribalWisdom || new Decimal(0)).gte(this.cost())
            },
            pay() { player.tribalWisdom = player.tribalWisdom.sub(this.cost()) },
            fullDisplay() {
                let aff = this.canAfford()
                let owned = player.paleolithic.upgrades.includes(Number(this.id))
                return '<h3>Totem Poles</h3><br>Knowledge boosts upgrades 13 and 14<br>Currently: ' + this.effectDisplay() + (!owned ? '<br><br>Cost: <span style="color:' + (aff ? '#e8d48b' : '#ef4444') + ';">' + format(this.cost()) + ' Tribal Wisdom</span>' : '')
            },
            unlocked() { return hasUpgrade("paleolithic", 24) },
            style() {
                let aff = (player.tribalWisdom || new Decimal(0)).gte("2e8")
                let bought = player.paleolithic.upgrades.includes(25)
                if (bought) return { "background": "linear-gradient(135deg, #0a1a0a 0%, #0f0f05 100%)", "border": "2px solid rgba(144,200,100,0.35)", "border-radius": "12px", "padding": "8px", "color": "#7a9a6a", "font-family": "'Segoe UI', sans-serif", "transition": "all 0.3s ease", "box-shadow": "inset 0 0 20px rgba(80,160,60,0.08)" }
                if (aff) return { "background": "linear-gradient(135deg, #2a1a05 0%, #3a2a0a 100%)", "border": "2px solid rgba(184,134,11,0.6)", "border-radius": "12px", "padding": "8px", "color": "#e8d48b", "font-family": "'Segoe UI', sans-serif", "cursor": "pointer", "transition": "all 0.3s ease" }
                return { "background": "linear-gradient(135deg, #050010 0%, #0a0018 100%)", "border": "1px solid rgba(100,80,60,0.15)", "border-radius": "12px", "padding": "8px", "color": "#5a5048", "font-family": "'Segoe UI', sans-serif" }
            },
        },
        31: {
            title: "Shaman Wisdom",
            description: "Paleolithic Points boost upgrades 21 and 22",
            effect() {
                return player["paleolithic"].points.div(4).add(1)
            },
            effectDisplay() { return format(upgradeEffect("paleolithic", 31)) + "x" },
            cost() { return new Decimal("1e9") },
            canAfford() {
                if (player.paleolithic.upgrades.includes(Number(this.id))) return false
                return (player.tribalWisdom || new Decimal(0)).gte(this.cost())
            },
            pay() { player.tribalWisdom = player.tribalWisdom.sub(this.cost()) },
            fullDisplay() {
                let aff = this.canAfford()
                let owned = player.paleolithic.upgrades.includes(Number(this.id))
                return '<h3>Shaman Wisdom</h3><br>Paleolithic Points boost upgrades 21 and 22<br>Currently: ' + this.effectDisplay() + (!owned ? '<br><br>Cost: <span style="color:' + (aff ? '#e8d48b' : '#ef4444') + ';">' + format(this.cost()) + ' Tribal Wisdom</span>' : '')
            },
            unlocked() { return hasUpgrade("paleolithic", 25) },
            style() {
                let aff = (player.tribalWisdom || new Decimal(0)).gte("1e9")
                let bought = player.paleolithic.upgrades.includes(31)
                if (bought) return { "background": "linear-gradient(135deg, #0a1a0a 0%, #0f0f05 100%)", "border": "2px solid rgba(144,200,100,0.35)", "border-radius": "12px", "padding": "8px", "color": "#7a9a6a", "font-family": "'Segoe UI', sans-serif", "transition": "all 0.3s ease", "box-shadow": "inset 0 0 20px rgba(80,160,60,0.08)" }
                if (aff) return { "background": "linear-gradient(135deg, #2a1a05 0%, #3a2a0a 100%)", "border": "2px solid rgba(184,134,11,0.6)", "border-radius": "12px", "padding": "8px", "color": "#e8d48b", "font-family": "'Segoe UI', sans-serif", "cursor": "pointer", "transition": "all 0.3s ease" }
                return { "background": "linear-gradient(135deg, #050010 0%, #0a0018 100%)", "border": "1px solid rgba(100,80,60,0.15)", "border-radius": "12px", "padding": "8px", "color": "#5a5048", "font-family": "'Segoe UI', sans-serif" }
            },
        },
        52: {
            title: "Megaliths",
            description: "Knowledge gain x2",
            effect() {
                return new Decimal(2)
            },
            effectDisplay() { return format(upgradeEffect("paleolithic", 52)) + "x" },
            cost() { return new Decimal("2e9") },
            canAfford() {
                if (player.paleolithic.upgrades.includes(Number(this.id))) return false
                return (player.tribalWisdom || new Decimal(0)).gte(this.cost())
            },
            pay() { player.tribalWisdom = player.tribalWisdom.sub(this.cost()) },
            fullDisplay() {
                let aff = this.canAfford()
                let owned = player.paleolithic.upgrades.includes(Number(this.id))
                return '<h3>Megaliths</h3><br>Knowledge boosts its own gain (moderate)<br>Currently: ' + this.effectDisplay() + (!owned ? '<br><br>Cost: <span style="color:' + (aff ? '#e8d48b' : '#ef4444') + ';">' + format(this.cost()) + ' Tribal Wisdom</span>' : '')
            },
            unlocked() { return hasUpgrade("paleolithic", 31) },
            style() {
                let aff = (player.tribalWisdom || new Decimal(0)).gte("2e9")
                let bought = player.paleolithic.upgrades.includes(52)
                if (bought) return { "background": "linear-gradient(135deg, #0a1a0a 0%, #0f0f05 100%)", "border": "2px solid rgba(144,200,100,0.35)", "border-radius": "12px", "padding": "8px", "color": "#7a9a6a", "font-family": "'Segoe UI', sans-serif", "transition": "all 0.3s ease", "box-shadow": "inset 0 0 20px rgba(80,160,60,0.08)" }
                if (aff) return { "background": "linear-gradient(135deg, #2a1505 0%, #3a2010 100%)", "border": "2px solid rgba(139,69,19,0.6)", "border-radius": "12px", "padding": "8px", "color": "#d4a080", "font-family": "'Segoe UI', sans-serif", "cursor": "pointer", "transition": "all 0.3s ease" }
                return { "background": "linear-gradient(135deg, #050010 0%, #0a0018 100%)", "border": "1px solid rgba(100,80,60,0.15)", "border-radius": "12px", "padding": "8px", "color": "#5a5048", "font-family": "'Segoe UI', sans-serif" }
            },
        },
        32: {
            title: "Star Gazing",
            description: "Paleolithic Points gain x2",
            effect() {
                return new Decimal(2)
            },
            effectDisplay() { return format(upgradeEffect("paleolithic", 32)) + "x" },
            cost() { return new Decimal("4e9") },
            canAfford() {
                if (player.paleolithic.upgrades.includes(Number(this.id))) return false
                return (player.tribalWisdom || new Decimal(0)).gte(this.cost())
            },
            pay() { player.tribalWisdom = player.tribalWisdom.sub(this.cost()) },
            fullDisplay() {
                let aff = this.canAfford()
                let owned = player.paleolithic.upgrades.includes(Number(this.id))
                return '<h3>Star Gazing</h3><br>Paleolithic Points boost their own gain (moderate)<br>Currently: ' + this.effectDisplay() + (!owned ? '<br><br>Cost: <span style="color:' + (aff ? '#e8d48b' : '#ef4444') + ';">' + format(this.cost()) + ' Tribal Wisdom</span>' : '')
            },
            unlocked() { return hasUpgrade("paleolithic", 52) },
            style() {
                let aff = (player.tribalWisdom || new Decimal(0)).gte("4e9")
                let bought = player.paleolithic.upgrades.includes(32)
                if (bought) return { "background": "linear-gradient(135deg, #0a1a0a 0%, #0f0f05 100%)", "border": "2px solid rgba(144,200,100,0.35)", "border-radius": "12px", "padding": "8px", "color": "#7a9a6a", "font-family": "'Segoe UI', sans-serif", "transition": "all 0.3s ease", "box-shadow": "inset 0 0 20px rgba(80,160,60,0.08)" }
                if (aff) return { "background": "linear-gradient(135deg, #2a1505 0%, #3a2010 100%)", "border": "2px solid rgba(139,69,19,0.6)", "border-radius": "12px", "padding": "8px", "color": "#d4a080", "font-family": "'Segoe UI', sans-serif", "cursor": "pointer", "transition": "all 0.3s ease" }
                return { "background": "linear-gradient(135deg, #050010 0%, #0a0018 100%)", "border": "1px solid rgba(100,80,60,0.15)", "border-radius": "12px", "padding": "8px", "color": "#5a5048", "font-family": "'Segoe UI', sans-serif" }
            },
        },
        33: {
            title: "Flint Mining",
            description: "Paleolithic Points boost Knowledge gain (moderate)",
            effect() {
                return player["paleolithic"].points.add(1).pow(0.15)
            },
            effectDisplay() { return format(upgradeEffect("paleolithic", 33)) + "x" },
            cost() { return new Decimal("1e10") },
            canAfford() {
                if (player.paleolithic.upgrades.includes(Number(this.id))) return false
                return (player.tribalWisdom || new Decimal(0)).gte(this.cost())
            },
            pay() { player.tribalWisdom = player.tribalWisdom.sub(this.cost()) },
            fullDisplay() {
                let aff = this.canAfford()
                let owned = player.paleolithic.upgrades.includes(Number(this.id))
                return '<h3>Flint Mining</h3><br>Paleolithic Points boost Knowledge gain (moderate)<br>Currently: ' + this.effectDisplay() + (!owned ? '<br><br>Cost: <span style="color:' + (aff ? '#e8d48b' : '#ef4444') + ';">' + format(this.cost()) + ' Tribal Wisdom</span>' : '')
            },
            unlocked() { return hasUpgrade("paleolithic", 32) },
            style() {
                let aff = (player.tribalWisdom || new Decimal(0)).gte("1e10")
                let bought = player.paleolithic.upgrades.includes(33)
                if (bought) return { "background": "linear-gradient(135deg, #0a1a0a 0%, #0f0f05 100%)", "border": "2px solid rgba(144,200,100,0.35)", "border-radius": "12px", "padding": "8px", "color": "#7a9a6a", "font-family": "'Segoe UI', sans-serif", "transition": "all 0.3s ease", "box-shadow": "inset 0 0 20px rgba(80,160,60,0.08)" }
                if (aff) return { "background": "linear-gradient(135deg, #2a1505 0%, #3a2010 100%)", "border": "2px solid rgba(139,69,19,0.6)", "border-radius": "12px", "padding": "8px", "color": "#d4a080", "font-family": "'Segoe UI', sans-serif", "cursor": "pointer", "transition": "all 0.3s ease" }
                return { "background": "linear-gradient(135deg, #050010 0%, #0a0018 100%)", "border": "1px solid rgba(100,80,60,0.15)", "border-radius": "12px", "padding": "8px", "color": "#5a5048", "font-family": "'Segoe UI', sans-serif" }
            },
        },
        34: {
            title: "Animal Taming",
            description: "Knowledge boosts Paleolithic Points gain (moderate)",
            effect() {
                return player.points.add(1).pow(0.15).div(3).max(1)
            },
            effectDisplay() { return format(upgradeEffect("paleolithic", 34)) + "x" },
            cost() { return new Decimal("2e10") },
            canAfford() {
                if (player.paleolithic.upgrades.includes(Number(this.id))) return false
                return (player.tribalWisdom || new Decimal(0)).gte(this.cost())
            },
            pay() { player.tribalWisdom = player.tribalWisdom.sub(this.cost()) },
            fullDisplay() {
                let aff = this.canAfford()
                let owned = player.paleolithic.upgrades.includes(Number(this.id))
                return '<h3>Animal Taming</h3><br>Knowledge boosts Paleolithic Points gain (moderate)<br>Currently: ' + this.effectDisplay() + (!owned ? '<br><br>Cost: <span style="color:' + (aff ? '#e8d48b' : '#ef4444') + ';">' + format(this.cost()) + ' Tribal Wisdom</span>' : '')
            },
            unlocked() { return hasUpgrade("paleolithic", 33) },
            style() {
                let aff = (player.tribalWisdom || new Decimal(0)).gte("2e10")
                let bought = player.paleolithic.upgrades.includes(34)
                if (bought) return { "background": "linear-gradient(135deg, #0a1a0a 0%, #0f0f05 100%)", "border": "2px solid rgba(144,200,100,0.35)", "border-radius": "12px", "padding": "8px", "color": "#7a9a6a", "font-family": "'Segoe UI', sans-serif", "transition": "all 0.3s ease", "box-shadow": "inset 0 0 20px rgba(80,160,60,0.08)" }
                if (aff) return { "background": "linear-gradient(135deg, #2a1505 0%, #3a2010 100%)", "border": "2px solid rgba(139,69,19,0.6)", "border-radius": "12px", "padding": "8px", "color": "#d4a080", "font-family": "'Segoe UI', sans-serif", "cursor": "pointer", "transition": "all 0.3s ease" }
                return { "background": "linear-gradient(135deg, #050010 0%, #0a0018 100%)", "border": "1px solid rgba(100,80,60,0.15)", "border-radius": "12px", "padding": "8px", "color": "#5a5048", "font-family": "'Segoe UI', sans-serif" }
            },
        },
        35: {
            title: "Tribal Hierarchy",
            description: "Fuses Paleolithic Points and Knowledge boost into one",
            effect() {
                let base = new Decimal(4)
                if (hasUpgrade("paleolithic", 24)) base = base.mul(upgradeEffect("paleolithic", 24))
                return base
            },
            effectDisplay() { return format(upgradeEffect("paleolithic", 35)) + "x" },
            cost() { return new Decimal("2e11") },
            canAfford() {
                if (player.paleolithic.upgrades.includes(Number(this.id))) return false
                return (player.tribalWisdom || new Decimal(0)).gte(this.cost())
            },
            pay() { player.tribalWisdom = player.tribalWisdom.sub(this.cost()) },
            fullDisplay() {
                let aff = this.canAfford()
                let owned = player.paleolithic.upgrades.includes(Number(this.id))
                return '<h3>Tribal Hierarchy</h3><br>Fuses Paleolithic Points and Knowledge boost into one<br>Currently: ' + this.effectDisplay() + (!owned ? '<br><br>Cost: <span style="color:' + (aff ? '#e8d48b' : '#ef4444') + ';">' + format(this.cost()) + ' Tribal Wisdom</span>' : '')
            },
            unlocked() { return hasUpgrade("paleolithic", 34) },
            style() {
                let aff = (player.tribalWisdom || new Decimal(0)).gte("2e11")
                let bought = player.paleolithic.upgrades.includes(35)
                if (bought) return { "background": "linear-gradient(135deg, #0a1a0a 0%, #0f0f05 100%)", "border": "2px solid rgba(144,200,100,0.35)", "border-radius": "12px", "padding": "8px", "color": "#7a9a6a", "font-family": "'Segoe UI', sans-serif", "transition": "all 0.3s ease", "box-shadow": "inset 0 0 20px rgba(80,160,60,0.08)" }
                if (aff) return { "background": "linear-gradient(135deg, #2a1505 0%, #3a2010 100%)", "border": "2px solid rgba(139,69,19,0.6)", "border-radius": "12px", "padding": "8px", "color": "#d4a080", "font-family": "'Segoe UI', sans-serif", "cursor": "pointer", "transition": "all 0.3s ease" }
                return { "background": "linear-gradient(135deg, #050010 0%, #0a0018 100%)", "border": "1px solid rgba(100,80,60,0.15)", "border-radius": "12px", "padding": "8px", "color": "#5a5048", "font-family": "'Segoe UI', sans-serif" }
            },
        },
        41: {
            title: "Great Migration",
            description: "Fuses Cave Shelter and Hunting Party into one",
            effect() {
                return player["paleolithic"].points.add(1).pow(0.05).mul(player.points.add(1).pow(0.03)).div(10).max(1)
            },
            effectDisplay() { return format(upgradeEffect("paleolithic", 41)) + "x" },
            cost() { return new Decimal("2e12") },
            canAfford() {
                if (player.paleolithic.upgrades.includes(Number(this.id))) return false
                return (player.tribalWisdom || new Decimal(0)).gte(this.cost())
            },
            pay() { player.tribalWisdom = player.tribalWisdom.sub(this.cost()) },
            fullDisplay() {
                let aff = this.canAfford()
                let owned = player.paleolithic.upgrades.includes(Number(this.id))
                return '<h3>Great Migration</h3><br>Fuses Cave Shelter and Hunting Party into one<br>Currently: ' + this.effectDisplay() + (!owned ? '<br><br>Cost: <span style="color:' + (aff ? '#e8d48b' : '#ef4444') + ';">' + format(this.cost()) + ' Tribal Wisdom</span>' : '')
            },
            unlocked() { return hasUpgrade("paleolithic", 35) },
            style() {
                let aff = (player.tribalWisdom || new Decimal(0)).gte("2e12")
                let bought = player.paleolithic.upgrades.includes(41)
                if (bought) return { "background": "linear-gradient(135deg, #0a1a0a 0%, #0f0f05 100%)", "border": "2px solid rgba(144,200,100,0.35)", "border-radius": "12px", "padding": "8px", "color": "#7a9a6a", "font-family": "'Segoe UI', sans-serif", "transition": "all 0.3s ease", "box-shadow": "inset 0 0 20px rgba(80,160,60,0.08)" }
                if (aff) return { "background": "linear-gradient(135deg, #2a1505 0%, #3a2010 100%)", "border": "2px solid rgba(139,69,19,0.6)", "border-radius": "12px", "padding": "8px", "color": "#d4a080", "font-family": "'Segoe UI', sans-serif", "cursor": "pointer", "transition": "all 0.3s ease" }
                return { "background": "linear-gradient(135deg, #050010 0%, #0a0018 100%)", "border": "1px solid rgba(100,80,60,0.15)", "border-radius": "12px", "padding": "8px", "color": "#5a5048", "font-family": "'Segoe UI', sans-serif" }
            },
        },
        53: {
            title: "Ancestral Wisdom",
            description: "More Tribal Wisdom earned per prestige",
            effect() { return new Decimal(2) },
            effectDisplay() { return format(upgradeEffect("paleolithic", 53)) + "x Wisdom" },
            cost() { return new Decimal("2e13") },
            canAfford() {
                if (player.paleolithic.upgrades.includes(Number(this.id))) return false
                return (player.tribalWisdom || new Decimal(0)).gte(this.cost())
            },
            pay() { player.tribalWisdom = player.tribalWisdom.sub(this.cost()) },
            fullDisplay() {
                let aff = this.canAfford()
                let owned = player.paleolithic.upgrades.includes(Number(this.id))
                return '<h3>Ancestral Wisdom</h3><br>More Tribal Wisdom earned per prestige<br>Currently: ' + this.effectDisplay() + (!owned ? '<br><br>Cost: <span style="color:' + (aff ? '#e8d48b' : '#ef4444') + ';">' + format(this.cost()) + ' Tribal Wisdom</span>' : '')
            },
            unlocked() { return hasUpgrade("paleolithic", 41) },
            style() {
                let aff = (player.tribalWisdom || new Decimal(0)).gte("2e13")
                let bought = player.paleolithic.upgrades.includes(53)
                if (bought) return { "background": "linear-gradient(135deg, #0a1a0a 0%, #0f0f05 100%)", "border": "2px solid rgba(144,200,100,0.35)", "border-radius": "12px", "padding": "8px", "color": "#7a9a6a", "font-family": "'Segoe UI', sans-serif", "transition": "all 0.3s ease", "box-shadow": "inset 0 0 20px rgba(80,160,60,0.08)" }
                if (aff) return { "background": "linear-gradient(135deg, #2a2000 0%, #3a2a05 100%)", "border": "2px solid rgba(232,212,139,0.6)", "border-radius": "12px", "padding": "8px", "color": "#ffe8a0", "font-family": "'Segoe UI', sans-serif", "cursor": "pointer", "transition": "all 0.3s ease" }
                return { "background": "linear-gradient(135deg, #050010 0%, #0a0018 100%)", "border": "1px solid rgba(100,80,60,0.15)", "border-radius": "12px", "padding": "8px", "color": "#5a5048", "font-family": "'Segoe UI', sans-serif" }
            },
        },
        42: {
            title: "Generations",
            description: "Paleolithic Points boost Tribal Wisdom earned",
            effect() {
                return Decimal.max(1, Decimal.log10(player["paleolithic"].points.add(10)).div(2))
            },
            effectDisplay() { return format(upgradeEffect("paleolithic", 42)) + "x Wisdom" },
            cost() { return new Decimal("2e14") },
            canAfford() {
                if (player.paleolithic.upgrades.includes(Number(this.id))) return false
                return (player.tribalWisdom || new Decimal(0)).gte(this.cost())
            },
            pay() { player.tribalWisdom = player.tribalWisdom.sub(this.cost()) },
            fullDisplay() {
                let aff = this.canAfford()
                let owned = player.paleolithic.upgrades.includes(Number(this.id))
                return '<h3>Generations</h3><br>Paleolithic Points boost Tribal Wisdom earned<br>Currently: ' + this.effectDisplay() + (!owned ? '<br><br>Cost: <span style="color:' + (aff ? '#e8d48b' : '#ef4444') + ';">' + format(this.cost()) + ' Tribal Wisdom</span>' : '')
            },
            unlocked() { return hasUpgrade("paleolithic", 53) },
            style() {
                let aff = (player.tribalWisdom || new Decimal(0)).gte("2e14")
                let bought = player.paleolithic.upgrades.includes(42)
                if (bought) return { "background": "linear-gradient(135deg, #0a1a0a 0%, #0f0f05 100%)", "border": "2px solid rgba(144,200,100,0.35)", "border-radius": "12px", "padding": "8px", "color": "#7a9a6a", "font-family": "'Segoe UI', sans-serif", "transition": "all 0.3s ease", "box-shadow": "inset 0 0 20px rgba(80,160,60,0.08)" }
                if (aff) return { "background": "linear-gradient(135deg, #2a2000 0%, #3a2a05 100%)", "border": "2px solid rgba(232,212,139,0.6)", "border-radius": "12px", "padding": "8px", "color": "#ffe8a0", "font-family": "'Segoe UI', sans-serif", "cursor": "pointer", "transition": "all 0.3s ease" }
                return { "background": "linear-gradient(135deg, #050010 0%, #0a0018 100%)", "border": "1px solid rgba(100,80,60,0.15)", "border-radius": "12px", "padding": "8px", "color": "#5a5048", "font-family": "'Segoe UI', sans-serif" }
            },
        },
        43: {
            title: "Shared Knowledge",
            description: "Tribal Wisdom boosts Knowledge gain",
            effect() {
                return Decimal.max(1, (player.tribalWisdom || new Decimal(0)).add(1).pow(0.05))
            },
            effectDisplay() { return format(upgradeEffect("paleolithic", 43)) + "x" },
            cost() { return new Decimal("2e15") },
            canAfford() {
                if (player.paleolithic.upgrades.includes(Number(this.id))) return false
                return (player.tribalWisdom || new Decimal(0)).gte(this.cost())
            },
            pay() { player.tribalWisdom = player.tribalWisdom.sub(this.cost()) },
            fullDisplay() {
                let aff = this.canAfford()
                let owned = player.paleolithic.upgrades.includes(Number(this.id))
                return '<h3>Shared Knowledge</h3><br>Tribal Wisdom boosts Knowledge gain<br>Currently: ' + this.effectDisplay() + (!owned ? '<br><br>Cost: <span style="color:' + (aff ? '#e8d48b' : '#ef4444') + ';">' + format(this.cost()) + ' Tribal Wisdom</span>' : '')
            },
            unlocked() { return hasUpgrade("paleolithic", 42) },
            style() {
                let aff = (player.tribalWisdom || new Decimal(0)).gte("2e15")
                let bought = player.paleolithic.upgrades.includes(43)
                if (bought) return { "background": "linear-gradient(135deg, #0a1a0a 0%, #0f0f05 100%)", "border": "2px solid rgba(144,200,100,0.35)", "border-radius": "12px", "padding": "8px", "color": "#7a9a6a", "font-family": "'Segoe UI', sans-serif", "transition": "all 0.3s ease", "box-shadow": "inset 0 0 20px rgba(80,160,60,0.08)" }
                if (aff) return { "background": "linear-gradient(135deg, #2a2000 0%, #3a2a05 100%)", "border": "2px solid rgba(232,212,139,0.6)", "border-radius": "12px", "padding": "8px", "color": "#ffe8a0", "font-family": "'Segoe UI', sans-serif", "cursor": "pointer", "transition": "all 0.3s ease" }
                return { "background": "linear-gradient(135deg, #050010 0%, #0a0018 100%)", "border": "1px solid rgba(100,80,60,0.15)", "border-radius": "12px", "padding": "8px", "color": "#5a5048", "font-family": "'Segoe UI', sans-serif" }
            },
        },
        44: {
            title: "Oral Tradition",
            description: "Paleolithic Points boost their own gain (log)",
            effect() {
                return Decimal.max(1, Decimal.log10((player["paleolithic"].points || new Decimal(0)).add(10)))
            },
            effectDisplay() { return format(upgradeEffect("paleolithic", 44)) + "x" },
            cost() { return new Decimal("2e16") },
            canAfford() {
                if (player.paleolithic.upgrades.includes(Number(this.id))) return false
                return (player.tribalWisdom || new Decimal(0)).gte(this.cost())
            },
            pay() { player.tribalWisdom = player.tribalWisdom.sub(this.cost()) },
            fullDisplay() {
                let aff = this.canAfford()
                let owned = player.paleolithic.upgrades.includes(Number(this.id))
                return '<h3>Oral Tradition</h3><br>Paleolithic Points boost their own gain (strong)<br>Currently: ' + this.effectDisplay() + (!owned ? '<br><br>Cost: <span style="color:' + (aff ? '#e8d48b' : '#ef4444') + ';">' + format(this.cost()) + ' Tribal Wisdom</span>' : '')
            },
            unlocked() { return hasUpgrade("paleolithic", 43) },
            style() {
                let aff = (player.tribalWisdom || new Decimal(0)).gte("2e16")
                let bought = player.paleolithic.upgrades.includes(44)
                if (bought) return { "background": "linear-gradient(135deg, #0a1a0a 0%, #0f0f05 100%)", "border": "2px solid rgba(144,200,100,0.35)", "border-radius": "12px", "padding": "8px", "color": "#7a9a6a", "font-family": "'Segoe UI', sans-serif", "transition": "all 0.3s ease", "box-shadow": "inset 0 0 20px rgba(80,160,60,0.08)" }
                if (aff) return { "background": "linear-gradient(135deg, #2a2000 0%, #3a2a05 100%)", "border": "2px solid rgba(232,212,139,0.6)", "border-radius": "12px", "padding": "8px", "color": "#ffe8a0", "font-family": "'Segoe UI', sans-serif", "cursor": "pointer", "transition": "all 0.3s ease" }
                return { "background": "linear-gradient(135deg, #050010 0%, #0a0018 100%)", "border": "1px solid rgba(100,80,60,0.15)", "border-radius": "12px", "padding": "8px", "color": "#5a5048", "font-family": "'Segoe UI', sans-serif" }
            },
        },
        45: {
            title: "Cultural Exchange",
            description: "Tribal Wisdom boosts all resources",
            effect() {
                return Decimal.max(1, (player.tribalWisdom || new Decimal(0)).add(1).pow(0.02))
            },
            effectDisplay() { return format(upgradeEffect("paleolithic", 45)) + "x all" },
            cost() { return new Decimal("2e17") },
            canAfford() {
                if (player.paleolithic.upgrades.includes(Number(this.id))) return false
                return (player.tribalWisdom || new Decimal(0)).gte(this.cost())
            },
            pay() { player.tribalWisdom = player.tribalWisdom.sub(this.cost()) },
            fullDisplay() {
                let aff = this.canAfford()
                let owned = player.paleolithic.upgrades.includes(Number(this.id))
                return '<h3>Cultural Exchange</h3><br>Tribal Wisdom boosts all resources<br>Currently: ' + this.effectDisplay() + (!owned ? '<br><br>Cost: <span style="color:' + (aff ? '#e8d48b' : '#ef4444') + ';">' + format(this.cost()) + ' Tribal Wisdom</span>' : '')
            },
            unlocked() { return hasUpgrade("paleolithic", 44) },
            style() {
                let aff = (player.tribalWisdom || new Decimal(0)).gte("2e17")
                let bought = player.paleolithic.upgrades.includes(45)
                if (bought) return { "background": "linear-gradient(135deg, #0a1a0a 0%, #0f0f05 100%)", "border": "2px solid rgba(144,200,100,0.35)", "border-radius": "12px", "padding": "8px", "color": "#7a9a6a", "font-family": "'Segoe UI', sans-serif", "transition": "all 0.3s ease", "box-shadow": "inset 0 0 20px rgba(80,160,60,0.08)" }
                if (aff) return { "background": "linear-gradient(135deg, #2a2000 0%, #3a2a05 100%)", "border": "2px solid rgba(232,212,139,0.6)", "border-radius": "12px", "padding": "8px", "color": "#ffe8a0", "font-family": "'Segoe UI', sans-serif", "cursor": "pointer", "transition": "all 0.3s ease" }
                return { "background": "linear-gradient(135deg, #050010 0%, #0a0018 100%)", "border": "1px solid rgba(100,80,60,0.15)", "border-radius": "12px", "padding": "8px", "color": "#5a5048", "font-family": "'Segoe UI', sans-serif" }
            },
        },
        54: {
            title: "Enlightenment",
            description: "Progress Level bonus is squared",
            effect() { return new Decimal(2) },
            effectDisplay() { return "PL bonus ^2" },
            cost() { return new Decimal("2e18") },
            canAfford() {
                if (player.paleolithic.upgrades.includes(Number(this.id))) return false
                return (player.tribalWisdom || new Decimal(0)).gte(this.cost())
            },
            pay() { player.tribalWisdom = player.tribalWisdom.sub(this.cost()) },
            fullDisplay() {
                let aff = this.canAfford()
                let owned = player.paleolithic.upgrades.includes(Number(this.id))
                return '<h3>Enlightenment</h3><br>Progress Level bonus is squared<br>Currently: ' + this.effectDisplay() + (!owned ? '<br><br>Cost: <span style="color:' + (aff ? '#e8d48b' : '#ef4444') + ';">' + format(this.cost()) + ' Tribal Wisdom</span>' : '')
            },
            unlocked() { return hasUpgrade("paleolithic", 45) },
            style() {
                let aff = (player.tribalWisdom || new Decimal(0)).gte("2e18")
                let bought = player.paleolithic.upgrades.includes(54)
                if (bought) return { "background": "linear-gradient(135deg, #0a1a0a 0%, #0f0f05 100%)", "border": "2px solid rgba(144,200,100,0.35)", "border-radius": "12px", "padding": "8px", "color": "#7a9a6a", "font-family": "'Segoe UI', sans-serif", "transition": "all 0.3s ease", "box-shadow": "inset 0 0 20px rgba(80,160,60,0.08)" }
                if (aff) return { "background": "linear-gradient(135deg, #2a2000 0%, #3a2a05 100%)", "border": "2px solid rgba(232,212,139,0.6)", "border-radius": "12px", "padding": "8px", "color": "#ffe8a0", "font-family": "'Segoe UI', sans-serif", "cursor": "pointer", "transition": "all 0.3s ease" }
                return { "background": "linear-gradient(135deg, #050010 0%, #0a0018 100%)", "border": "1px solid rgba(100,80,60,0.15)", "border-radius": "12px", "padding": "8px", "color": "#5a5048", "font-family": "'Segoe UI', sans-serif" }
            },
        },
    },
    milestones: {
        0: { requirementDescription: "25 Tribal Wisdom", effectDescription: "PP gain x1.5", done() { return (player.totalTribalWisdom || new Decimal(0)).gte(25) } },
        1: { requirementDescription: "100 Tribal Wisdom", effectDescription: "Knowledge gain x2", done() { return (player.totalTribalWisdom || new Decimal(0)).gte(100) } },
        2: { requirementDescription: "500 Tribal Wisdom", effectDescription: "PP gain x1.25", done() { return (player.totalTribalWisdom || new Decimal(0)).gte(500) } },
        3: { requirementDescription: "2,000 Tribal Wisdom", effectDescription: "Knowledge gain x1.5", done() { return (player.totalTribalWisdom || new Decimal(0)).gte(2000) } },
        4: { requirementDescription: "10,000 Tribal Wisdom", effectDescription: "All multipliers x1.5", done() { return (player.totalTribalWisdom || new Decimal(0)).gte(10000) } },
        5: { requirementDescription: "25,000,000 Tribal Wisdom", effectDescription: "PP gain x1.5", done() { return (player.totalTribalWisdom || new Decimal(0)).gte(2.5e7) } },
        6: { requirementDescription: "50,000,000 Tribal Wisdom", effectDescription: "Knowledge gain x2", done() { return (player.totalTribalWisdom || new Decimal(0)).gte(5e7) } },
        7: { requirementDescription: "100,000,000 Tribal Wisdom", effectDescription: "All multipliers x2", done() { return (player.totalTribalWisdom || new Decimal(0)).gte(1e8) } },
        8: { requirementDescription: "100,000,000 Tribal Wisdom", effectDescription: "PP gain x1.5", done() { return (player.totalTribalWisdom || new Decimal(0)).gte(1e8) } },
        9: { requirementDescription: "250,000,000 Tribal Wisdom", effectDescription: "Knowledge gain x2", done() { return (player.totalTribalWisdom || new Decimal(0)).gte(2.5e8) } },
        10: { requirementDescription: "500,000,000 Tribal Wisdom", effectDescription: "All multipliers x2", done() { return (player.totalTribalWisdom || new Decimal(0)).gte(5e8) } },
        11: { requirementDescription: "50,000,000,000 Tribal Wisdom", effectDescription: "PP gain x1.5", done() { return (player.totalTribalWisdom || new Decimal(0)).gte(5e10) } },
        12: { requirementDescription: "100,000,000,000 Tribal Wisdom", effectDescription: "Knowledge gain x2", done() { return (player.totalTribalWisdom || new Decimal(0)).gte(1e11) } },
        13: { requirementDescription: "250,000,000,000 Tribal Wisdom", effectDescription: "All multipliers x2", done() { return (player.totalTribalWisdom || new Decimal(0)).gte(2.5e11) } },
        14: { requirementDescription: "25,000,000,000,000 Tribal Wisdom", effectDescription: "PP gain x1.5", done() { return (player.totalTribalWisdom || new Decimal(0)).gte(2.5e13) } },
        15: { requirementDescription: "50,000,000,000,000 Tribal Wisdom", effectDescription: "Knowledge gain x2", done() { return (player.totalTribalWisdom || new Decimal(0)).gte(5e13) } },
         16: { requirementDescription: "100,000,000,000,000 Tribal Wisdom", effectDescription: "All multipliers x3", done() { return (player.totalTribalWisdom || new Decimal(0)).gte(1e14) } },
    },
})
