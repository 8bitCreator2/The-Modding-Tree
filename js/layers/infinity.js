addLayer("infinity", {
    name() { return "Infinity" },
    symbol: "IN",
    position: 0,
    startData() { return { unlocked: false, points: new Decimal(0), time: 0, best: 999999999, inf_upgs: [], chals: { active: "", inf_unls: 0, comps: [] } } },
    color: "#ffaa2b",
    requires: new Decimal("1e50"),
    tooltip: "Reset everything for Infinity Points and tackle challenges.",
    resource() { return "Infinity Points" },
    baseResource() { return "Bits" },
    baseAmount() { return player.points },
    type: "custom",
    getResetGain() { return FORMS.inf.gain() },
    getNextAt() { return FORMS.MAX },
    canReset() { return FORMS.inf.can() },
    onPrestige(gain) {
        if (player.infinity.best > player.infinity.time) player.infinity.best = player.infinity.time
        if (player.infinity.chals.active) {
            let act = player.infinity.chals.active
            if (!player.infinity.chals.comps.includes(act)) player.infinity.chals.comps.push(act)
            if (player.bits.stats.chals_best[act] === undefined) player.bits.stats.chals_best[act] = 999999999
            if (player.infinity.time < player.bits.stats.chals_best[act]) player.bits.stats.chals_best[act] = player.infinity.time
            CHALS.exit()
        }
        player.infinity.unlocked = true
    },
    doReset() {
        player.infinity.time = 0
        player.reboot.points = new Decimal(0)
        if (!player.infinity.inf_upgs.includes(13)) player.infinity.inf_upgs = []
        player.bits.modules.list = []
        player.bits.modules.unl = false
        player.bits.stats.best_bits = new Decimal(1)
        FORMS.reboot.onReset()
    },
    row: 3,
    layerShown() { return player.infinity.unlocked || player.points.gte(new Decimal("1e45")) },
    tabFormat: {
        "Infinity": {
            content: [
                ["display-text", function() {
                    let html = '<div style="padding:8px;">'
                    html += '<h3 style="color:#ffaa2b;">Infinity Points: ' + format(player.infinity.points, 0) + '</h3>'
                    if (player.infinity.chals.active) {
                        let ch = player.infinity.chals.active
                        let isNormal = ch.startsWith("normal")
                        let isInf = ch.startsWith("inf")
                        html += '<div style="color:#ffaa2b;font-size:12px;">Active Challenge: ' + ch + '</div>'
                        html += '<button class="btn" style="background:#ffaa2b;color:#111;margin:8px 0;" onmousedown="CHALS.exit()">Exit Challenge</button><br>'
                        html += '<button class="btn" style="background:#ffaa2b;color:#111;" onmousedown="FORMS.inf.reset()">Complete Challenge</button>'
                    } else {
                        let gain = FORMS.inf.gain()
                        let canInf = FORMS.inf.can()
                        html += '<button class="btn" style="margin:10px 0;' + (canInf?'background:#ffaa2b;color:#111;':'opacity:0.5;') + '" onmousedown="FORMS.inf.reset()" ' + (!canInf?'disabled':'') + '>'
                        html += 'Reset for <b>' + format(gain, 0) + '</b> IP</button>'
                    }
                    html += '<div style="font-size:10px;color:#888;margin:4px 0;">Best Infinity: ' + format(player.infinity.best) + 's</div>'
                    html += '</div>'
                    return html
                }],
            ],
        },
        "Upgrades": {
            content: [
                ["display-text", function() {
                    let html = '<div style="padding:8px;"><h3 style="color:#ffaa2b;">Infinity Upgrades</h3>'
                    html += '<div style="font-size:10px;color:#888;margin-bottom:10px;">Use IP to unlock permanent upgrades.</div>'
                    for (let r = 1; r <= UPGS.inf_upg.rows; r++) {
                        html += '<div class="table_center" style="display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-bottom:10px;">'
                        for (let c = 1; c <= UPGS.inf_upg.cols; c++) {
                            let id = r*10 + c
                            let upg = UPGS.inf_upg[id]
                            if (!upg || !upg.unl()) continue
                            let owned = player.infinity.inf_upgs.includes(id)
                            let canBuy = UPGS.inf_upg.can(id)
                            html += '<div style="min-width:200px;padding:10px;background:#181c30;border:1px solid #2a2e4a;border-radius:6px;' + (owned?'border-color:#ffaa2b;':'') + '">'
                            if (owned) html += '<div style="color:#ffaa2b;font-weight:bold;font-size:11px;">' + upg.desc + '</div>'
                            else html += '<div style="font-size:10px;color:#ccc;">' + upg.desc + '</div>'
                            if (upg.effDesc) html += '<div style="font-size:10px;color:#14b8a6;">' + upg.effDesc() + '</div>'
                            if (owned) {
                                html += '<div style="color:#14b8a6;font-weight:bold;font-size:11px;margin-top:4px;">OWNED</div>'
                            } else {
                                html += '<button class="btn" style="margin-top:6px;' + (canBuy?'background:#ffaa2b;color:#111;':'opacity:0.5;') + '" onmousedown="UPGS.inf_upg.buy(' + id + ')" ' + (!canBuy?'disabled':'') + '>'
                                html += 'Cost: ' + format(upg.cost, 0) + ' IP</button>'
                            }
                            html += '</div>'
                        }
                        html += '</div>'
                    }
                    html += '</div>'
                    return html
                }],
            ],
            unlocked() { return player.infinity.unlocked },
        },
        "Challenges": {
            content: [
                ["display-text", function() {
                    let html = '<div style="padding:8px;"><h3 style="color:#ffaa2b;">Challenges</h3>'
                    html += '<div style="font-size:10px;color:#888;margin-bottom:10px;">Complete challenges to unlock rewards.</div>'
                    html += '<button class="btn" style="opacity:0.5;margin-bottom:10px;" onmousedown="CHALS.exit()" ' + (!player.infinity.chals.active?'disabled':'') + '>Exit Challenge</button><br>'
                    html += '<div class="section-header" style="color:#ffaa2b;">Normal Challenges</div>'
                    html += '<div class="table_center" style="display:flex;flex-wrap:wrap;justify-content:center;gap:8px;">'
                    for (let x = 1; x <= CHALS.normal.length; x++) {
                        let ch = CHALS.normal[x]
                        let active = player.infinity.chals.active == "normal" + x
                        let done = player.infinity.chals.comps.includes("normal" + x)
                        html += '<div style="min-width:180px;padding:10px;background:#181c30;border:1px solid #2a2e4a;border-radius:6px;' + (active?'border-color:#ffaa2b;':'') + (done?'border-color:#14b8a6;':'') + '">'
                        html += '<div style="font-size:11px;min-height:40px;">' + ch.desc + '</div>'
                        html += '<div style="font-size:9px;color:#888;">Reward: ' + ch.reward + '</div><br>'
                        if (active) html += '<button class="btn" style="background:#ffaa2b;color:#111;" onmousedown="FORMS.inf.reset()">Complete</button>'
                        else if (done) html += '<div style="color:#14b8a6;font-weight:bold;">COMPLETED</div>'
                        else html += '<button class="btn" onmousedown="CHALS.enter(\'normal\',' + x + ')" style="opacity:0.7;">Start</button>'
                        html += '</div>'
                    }
                    html += '</div><br>'
                    html += '<div class="section-header" style="color:#ffaa2b;">Infinity Challenges</div>'
                    let infUnls = player.infinity.chals.inf_unls
                    html += '<div style="font-size:10px;color:#888;margin:8px 0;">Unlocked: ' + infUnls + ' / ' + CHALS.inf.length + '</div>'
                    if (infUnls < CHALS.inf.length) {
                        let canUnlock = CHALS.inf.canUnlock()
                        let req = CHALS.inf.requires[infUnls]
                        html += '<button class="btn" style="' + (canUnlock?'background:#ffaa2b;color:#111;':'opacity:0.5;') + '" onmousedown="CHALS.inf.unlock()" ' + (!canUnlock?'disabled':'') + '>Reach ' + format(req) + ' Bits to unlock</button><br>'
                    }
                    html += '<div class="table_center" style="display:flex;flex-wrap:wrap;justify-content:center;gap:8px;">'
                    for (let x = 1; x <= infUnls; x++) {
                        let ch = CHALS.inf[x]
                        let active = player.infinity.chals.active == "inf" + x
                        let done = player.infinity.chals.comps.includes("inf" + x)
                        html += '<div style="min-width:180px;padding:10px;background:#181c30;border:1px solid #2a2e4a;border-radius:6px;' + (active?'border-color:#ffaa2b;':'') + (done?'border-color:#14b8a6;':'') + '">'
                        html += '<div style="font-size:11px;min-height:40px;">' + ch.desc + '</div>'
                        html += '<div style="font-size:9px;color:#888;">Goal: ' + format(ch.goal) + ' Bits</div>'
                        html += '<div style="font-size:9px;color:#888;">Reward: ' + ch.reward + '</div><br>'
                        if (active) html += '<button class="btn" style="background:#ffaa2b;color:#111;" onmousedown="FORMS.inf.reset()">Complete</button>'
                        else if (done) html += '<div style="color:#14b8a6;font-weight:bold;">COMPLETED</div>'
                        else html += '<button class="btn" onmousedown="CHALS.enter(\'inf\',' + x + ')" style="opacity:0.7;">Start</button>'
                        html += '</div>'
                    }
                    html += '</div><br>'
                    html += '<div class="section-header" style="color:#ffaa2b;">Post-Infinity Challenges</div>'
                    html += '<div class="table_center" style="display:flex;flex-wrap:wrap;justify-content:center;gap:8px;">'
                    for (let x = 1; x <= CHALS.post_inf.length; x++) {
                        let ch = CHALS.post_inf[x]
                        let active = player.infinity.chals.active == "post_inf" + x
                        let done = player.infinity.chals.comps.includes("post_inf" + x)
                        html += '<div style="min-width:180px;padding:10px;background:#181c30;border:1px solid #2a2e4a;border-radius:6px;' + (active?'border-color:#ffaa2b;':'') + (done?'border-color:#14b8a6;':'') + '">'
                        html += '<div style="font-size:11px;min-height:40px;">' + ch.desc + '</div>'
                        html += '<div style="font-size:9px;color:#888;">Goal: ' + format(ch.goal) + ' Bits</div>'
                        html += '<div style="font-size:9px;color:#888;">Reward: ' + ch.reward + '</div><br>'
                        if (active) html += '<button class="btn" style="background:#ffaa2b;color:#111;" onmousedown="FORMS.inf.reset()">Complete</button>'
                        else if (done) html += '<div style="color:#14b8a6;font-weight:bold;">COMPLETED</div>'
                        else html += '<button class="btn" onmousedown="CHALS.enter(\'post_inf\',' + x + ')" style="opacity:0.7;">Start</button>'
                        html += '</div>'
                    }
                    html += '</div></div>'
                    return html
                }],
            ],
            unlocked() { return player.infinity.unlocked },
        },
    },
})
