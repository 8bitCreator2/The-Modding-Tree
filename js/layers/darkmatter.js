function trialExtract(v) {
    if (v instanceof Decimal) return {__d: true, v: v.toString()}
    if (Array.isArray(v)) return v.map(trialExtract)
    if (v && typeof v === 'object') {
        let r = {}
        for (let k in v) {
            if (k === '__ob__') continue
            r[k] = trialExtract(v[k])
        }
        return r
    }
    return v
}

function trialRestore(v) {
    if (v && typeof v === 'object' && v.__d) return new Decimal(v.v)
    if (Array.isArray(v)) return v.map(trialRestore)
    if (v && typeof v === 'object') {
        let r = {}
        for (let k in v) r[k] = trialRestore(v[k])
        return r
    }
    return v
}

const TRIAL_DATA = {
    11: { name: "I", goal: new Decimal(1e6), goalDisplay: "1e6", penalty: "/3" },
    12: { name: "II", goal: new Decimal(1e8), goalDisplay: "1e8", penalty: "^0.25 /10" },
    13: { name: "III", goal: new Decimal(1e10), goalDisplay: "1e10", penalty: "^0.15 /100" },
}

const DE_REWARDS = {
    11: Decimal.log10(1e6),
    12: new Decimal(0),
    13: new Decimal(0),
}

function dimCost(dimId, level) {
    let mult = dimId === 11 ? 1 : dimId === 12 ? 2 : 5
    let exp = 1.2
    if (dimId === 12 && level.gte(20)) exp = 1.8
    if (level.gte(100)) exp = 2.0
    let c = new Decimal(level).add(1).pow(exp).times(mult).floor()
    return c.lt(1) ? new Decimal(1) : c
}

function buyDim(id) {
    let layer = "darkmatter"
    let s = player[layer]
    let level = s.dims[id]
    let cost = dimCost(id, level)
    if (s.darkEnergy.gte(cost)) {
        s.darkEnergy = s.darkEnergy.sub(cost)
        s.dims[id] = level.add(1)
    }
}

function deProduction() {
    let dm = player.darkmatter
    if (!dm) return new Decimal(0)
    let dd1 = dm.dims[11] || new Decimal(0)
    if (dd1.lte(0)) return new Decimal(0)
    let dd2 = dm.dims[12] || new Decimal(0)
    let dd3 = dm.dims[13] || new Decimal(0)
    let rate = dd1.mul(0.5)
    if (dm.challenges[12] >= 1) rate = rate.mul(2)
    if (dd2.gt(0)) rate = rate.mul(dd2.add(1))
    if (dd3.gt(0)) rate = rate.mul(Decimal.pow(2, dd3))
    return rate
}

function makeTrial(challengeId) {
    return {
        name: "Dark Trial " + TRIAL_DATA[challengeId].name,
        completionLimit: 1,
        challengeDescription() { return "Build Stardust to earn Dark Energy." },
        unlocked() {
            if (challengeId == 11) return true
            return player[this.layer].challenges[challengeId - 1] >= 1
        },
        goalDescription: "Reach " + TRIAL_DATA[challengeId].goalDisplay + " Stardust",
        canComplete() { return player.s.points.gte(TRIAL_DATA[challengeId].goal) },
        rewardEffect() { return new Decimal(1) },
        rewardDisplay() { return format(DE_REWARDS[challengeId]) + " DE" },
        rewardDescription: "Gain " + format(DE_REWARDS[challengeId]) + " Dark Energy + unlock Dimension " + (challengeId - 10),
        onEnter() {
            function extract(v) { return trialExtract(v) }
            player[this.layer].trialSave = {
                points: extract(player.points),
                s: extract(player.s),
                starlayer: extract(player.starlayer),
                stellartree: extract(player.stellartree),
            }
            layerDataReset("s")
            layerDataReset("darks")
            layerDataReset("starlayer")
            layerDataReset("stellartree")
            if (player.stellartree) player.stellartree.upgrades.push(57)
            player.points = getStartPoints()
        },
        onComplete() {
            let deGain = DE_REWARDS[challengeId]
            player[this.layer].darkEnergy = player[this.layer].darkEnergy.add(deGain)
        },
        onExit() {
            if (!player[this.layer].trialSave) return
            function restore(v) { return trialRestore(v) }
            let data = player[this.layer].trialSave
            delete player[this.layer].trialSave
            player.points = restore(data.points)
            let rs = restore(data.s)
            for (let k in rs) Vue.set(player.s, k, rs[k])
            let rsl = restore(data.starlayer)
            for (let k in rsl) Vue.set(player.starlayer, k, rsl[k])
            let rst = restore(data.stellartree)
            for (let k in rst) Vue.set(player.stellartree, k, rst[k])
            layerDataReset("darks")
        },
    }
}

addLayer("darkmatter", {
    name: "Dark Matter",
    symbol: "DM",
    position: 1,
    startData() { return {
        unlocked: true,
        points: new Decimal(0),
        darkEnergy: new Decimal(0),
        dims: { 11: new Decimal(0), 12: new Decimal(0), 13: new Decimal(0) },
    }},
    color: "#2d0036",
    resource: "Dark Matter",
    type: "none",
    row: 1,
    layerShown() {
        if (!player.stellartree) return false
        if (hasUpgrade("stellartree", 57)) return true
        let dm = player.darkmatter
        if (!dm) return false
        return (dm.darkEnergy && dm.darkEnergy.gt(0)) || (dm.challenges && dm.challenges[11] >= 1)
    },
    update(diff) {
        if (player[this.layer].activeChallenge >= 11) {
            let rate = Decimal.log10(player.points).add(1)
            player[this.layer].points = player[this.layer].points.add(rate.mul(diff))
        }
        let deRate = deProduction()
        if (deRate.gt(0)) {
            player[this.layer].darkEnergy = player[this.layer].darkEnergy.add(deRate.mul(diff))
        }
    },
    tabFormat: {
        "Trials": {
            content: [
                ["display-text", function() {
                    let s = player[this.layer]
                    return '<span style="font-size:16px;color:#bb86fc;">\u2726 Dark Matter: <span style="font-weight:bold;font-size:22px;">' + format(s.points) + '</span></span>'
                }],
                "blank",
                ["display-text", function() {
                    let s = player[this.layer]
                    let active = s.activeChallenge
                    let html = '<span style="font-size:20px;font-weight:bold;color:#bb86fc;text-shadow:0 0 10px rgba(187,134,252,0.3);">\u2726 Dark Trials</span>'
                    if (active >= 11) {
                        let def = TRIAL_DATA[active]
                        let canComplete = player.s.points.gte(def.goal)
                        let bg = canComplete ? '#0a2a0a,#105010' : '#1a0030,#2d0050'
                        let border = canComplete ? '#4ade80' : '#bb86fc'
                        let textColor = canComplete ? '#4ade80' : '#bb86fc'
                        let label = canComplete ? '\u2605 Complete' : 'Exit Early'
                        let dim = canComplete ? '' : 'opacity:0.6;'
                        html += '<div style="border:2px solid ' + border + ';border-radius:12px;padding:16px;text-align:center;background:linear-gradient(135deg,' + bg + ');color:' + textColor + ';margin-top:10px;">' +
                            '<div style="font-size:14px;font-weight:bold;margin-bottom:4px;">DARK TRIAL ' + def.name + '</div>' +
                            '<div style="font-size:12px;color:#9ca3af;margin-bottom:12px;">Goal: ' + def.goalDisplay + ' Stardust<br>Penalty: ' + def.penalty + '</div>' +
                            '<button onclick="startChallenge(\'darkmatter\',' + active + ')" style="background:' + border + ';color:#0a0010;border:none;border-radius:8px;padding:10px 24px;font-size:15px;font-weight:bold;cursor:pointer;' + dim + '">' + label + '</button></div>'
                    } else {
                        html += '<br><span style="font-size:13px;color:#9ca3af;">Complete trials to earn Dark Energy and unlock Dimensions.</span>'
                    }
                    return html
                }],
                "blank",
                ["display-text", function() {
                    let s = player[this.layer]
                    let html = ''
                    for (let id of [11, 12, 13]) {
                        if (tmp[this.layer] && tmp[this.layer].challenges && tmp[this.layer].challenges[id] && tmp[this.layer].challenges[id].unlocked) {
                            let def = TRIAL_DATA[id]
                            let completed = (s.challenges[id] || 0) >= 1
                            let deAmount = DE_REWARDS[id]
                            let rewardText = id === 11 ? '6 DE + Dim 1'
                                : id === 12 ? 'Dim 2 + double DD1'
                                : 'Dim 3'
                            if (completed) {
                                html += '<div style="border:1px solid #4ade80;border-radius:8px;padding:10px;margin:6px 0;background:linear-gradient(135deg,#0a2a0a,#105010);">' +
                                    '<div style="font-size:13px;font-weight:bold;color:#4ade80;">\u2714 Dark Trial ' + def.name + ' \u2014 Completed</div>' +
                                    '<div style="font-size:11px;color:#9ca3af;">' + rewardText + '</div></div>'
                            } else {
                                let inTrial = s.activeChallenge && s.activeChallenge >= 11
                                let canAff = !inTrial && hasUpgrade("stellartree", 57)
                                let startStyle = canAff
                                    ? 'background:#bb86fc;color:#0a0010;border:none;border-radius:6px;padding:6px 16px;font-size:13px;font-weight:bold;cursor:pointer;margin-top:6px;'
                                    : 'background:#555;color:#333;border:none;border-radius:6px;padding:6px 16px;font-size:13px;font-weight:bold;margin-top:6px;cursor:not-allowed;'
                                html += '<div style="border:1px solid #bb86fc;border-radius:8px;padding:10px;margin:6px 0;background:linear-gradient(135deg,#1a0030,#2d0050);">' +
                                    '<div style="font-size:13px;font-weight:bold;color:#bb86fc;">Dark Trial ' + def.name + '</div>' +
                                    '<div style="font-size:11px;color:#9ca3af;">Goal: ' + def.goalDisplay + ' S\u00a0|\u00a0' + def.penalty + '\u00a0|\u00a0Reward: ' + rewardText + '</div>' +
                                    '<button onclick="startChallenge(\'darkmatter\',' + id + ')" style="' + startStyle + '">Start</button></div>'
                            }
                        }
                    }
                    return html
                }],
            ],
            style: {
                "background": "linear-gradient(145deg, #0a0010 0%, #150020 50%, #0a0010 100%)",
                "border": "1px solid rgba(187,134,252,0.2)",
                "border-radius": "16px",
                "padding": "24px",
                "box-shadow": "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
            },
        },
        "Dark Energy": {
            content: [
                ["display-text", function() {
                    let s = player[this.layer]
                    let rate = deProduction()
                    return '<div style="text-align:center;">' +
                        '<span style="font-size:20px;font-weight:bold;color:#c084fc;text-shadow:0 0 10px rgba(192,132,252,0.3);">\u2726 Dark Energy</span><br>' +
                        '<span style="font-size:28px;color:#c084fc;font-weight:bold;">' + format(s.darkEnergy) + '</span>' +
                        (rate.gt(0) ? '<br><span style="font-size:13px;color:#9ca3af;">+' + format(rate) + ' DE/s</span>' : '') +
                        '</div>'
                }],
                "blank",
                ["display-text", function() {
                    let s = player[this.layer]
                    let html = ''
                    let dims = [
                        {id: 11, name: "Dark Dimension I", desc: (s.challenges[12] >= 1 ? "Produces 1.0 DE/s per level (doubled by Trial II)" : "Produces 0.5 DE/s per level"), unlockedBy: 11, color: "#c084fc"},
                        {id: 12, name: "Dark Dimension II", desc: "Multiplies DD1 production", unlockedBy: 12, color: "#a78bfa"},
                        {id: 13, name: "Dark Dimension III", desc: "Exponentially multiplies all DE", unlockedBy: 13, color: "#7c3aed"},
                    ]
                    for (let dim of dims) {
                        let unlocked = s.challenges[dim.unlockedBy] >= 1
                        if (!unlocked) {
                            html += '<div style="border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:10px;margin:6px 0;background:rgba(0,0,0,0.3);text-align:center;">' +
                                '<div style="font-size:13px;font-weight:bold;color:#6b7280;">\u274c ' + dim.name + ' \u2014 Locked</div>' +
                                '<div style="font-size:11px;color:#555;">Complete Dark Trial ' + (dim.unlockedBy - 10) + ' to unlock</div></div>'
                            continue
                        }
                        let level = s.dims[dim.id] || new Decimal(0)
                        let cost = dimCost(dim.id, level)
                        let canAff = s.darkEnergy.gte(cost)
                        let buyStyle = canAff
                            ? 'background:' + dim.color + ';color:#0a0010;border:none;border-radius:6px;padding:6px 16px;font-size:13px;font-weight:bold;cursor:pointer;margin-top:6px;'
                            : 'background:#444;color:#222;border:none;border-radius:6px;padding:6px 16px;font-size:13px;font-weight:bold;margin-top:6px;cursor:not-allowed;'
                        let effectText = ''
                        if (dim.id === 11) effectText = format(level.mul(s.challenges[12] >= 1 ? 1 : 0.5)) + ' DE/s'
                        else if (dim.id === 12) effectText = format(level.add(1)) + 'x DD1'
                        else if (dim.id === 13) effectText = '2^' + formatWhole(level) + ' = ' + format(Decimal.pow(2, level)) + 'x all'
                        html += '<div style="border:1px solid ' + dim.color + ';border-radius:8px;padding:10px;margin:6px 0;background:linear-gradient(135deg,#0a0010,#150020);text-align:center;">' +
                            '<div style="font-size:14px;font-weight:bold;color:' + dim.color + ';">' + dim.name + '</div>' +
                            '<div style="font-size:11px;color:#9ca3af;">' + dim.desc + '</div>' +
                            '<div style="font-size:12px;color:#ccc;margin:4px 0;">Level: <span style="font-weight:bold;color:' + dim.color + ';">' + formatWhole(level) + '</span> \u2014 ' + effectText + '</div>' +
                            '<div style="font-size:11px;color:#9ca3af;">Cost: ' + format(cost) + ' DE</div>' +
                            '<button onclick="buyDim(' + dim.id + ')" style="' + buyStyle + '">Buy</button></div>'
                    }
                    return html
                }],
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
    challenges: {
        11: makeTrial(11),
        12: makeTrial(12),
        13: makeTrial(13),
    },
})
