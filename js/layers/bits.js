addLayer("bits", {
    name() { return "Bits" },
    symbol: "B",
    position: 0,
    startData() {
        let upgs = {}
        for (let x = 1; x <= 6; x++) upgs[x] = new Decimal(0)
        return {
            unlocked: true,
            bit_upgs: upgs,
            clusters: new Decimal(0),
            compress: new Decimal(1),
            chip: new Decimal(1),
            compress_unl: false,
            chip_unl: false,
            compute: { pp: new Decimal(0), toggle: false, unl: false, upgrades: {} },
            modules: { list: [], unl: false, expansion_seen: false },
            achs: [],
            autobuyer: {},
            stats: { best_bits: new Decimal(1), fast_rate: new Decimal(1), bps: new Decimal(1), chals_best: {} },
            time: 0,
            infTime: 0,
        }
    },
    color: "#14b8a6",
    requires: new Decimal(0),
    resource: "",
    baseResource: "",
    tooltip: "Generate bits and purchase upgrades to grow your computing power.",
    type: "none",
    row: 0,
    layerShown() { return true },
    update(diff) {
        if (!player.bits) return
        let bps = FORMS.bits.gain()
        player.bits.stats.bps = bps
        player.bits.stats.fast_rate = Decimal.max(player.bits.stats.fast_rate, bps)
        let gained = bps.mul(diff)
        if (player.bits.compute && player.bits.compute.toggle) {
            player.points = player.points.mul(0.9)
            let ppBps = bps.mul(0.5)
            if (hasPerk(4)) ppBps = ppBps.mul(1.25)
            if (hasPerk(8)) ppBps = ppBps.mul(1.5)
            if (hasPerk(10)) ppBps = ppBps.mul(3)
            if (hasPerk(14)) ppBps = ppBps.mul(3)
            if (hasPerk(17)) ppBps = ppBps.pow(1.1)
            if (player.bits.chip_unl) ppBps = ppBps.mul(FORMS.bits.chip.effect())
            player.bits.compute.pp = player.bits.compute.pp.add(ppBps.mul(diff))
            gained = ppBps.mul(diff)
        }
        player.points = player.points.add(gained)
        player.bits.stats.best_bits = Decimal.max(player.bits.stats.best_bits, player.points)
        player.bits.time += diff
        player.bits.infTime += diff
        player.infinity.time += diff
        if (player.infinity.chals.comps.includes("normal6")) {
            player.reboot.points = player.reboot.points.add(FORMS.reboot.gain().mul(diff))
        }
        if (!player.infinity.unlocked && player.points.gte(FORMS.MAX)) player.infinity.unlocked = true
        if (!player.bits.compress_unl && player.points.gte(100)) player.bits.compress_unl = true
        if (!player.bits.chip_unl && player.points.gte(10000)) player.bits.chip_unl = true
        if (!player.bits.compute.unl && player.reboot.reboot_upgs[3]) player.bits.compute.unl = true
        if (!player.bits.modules.unl && player.bits.clusters.gte(4)) player.bits.modules.unl = true
        if (!player.bits.modules.expansion_seen && player.bits.stats.best_bits.gte(1e8)) {
            player.bits.modules.expansion_seen = true
        }
        AUTOS.update(diff)
        ACHS.checkACHS()
    },
    tabFormat: {
        "Bits": {
            content: [
                ["display-text", function() {
                    let html = '<div style="padding:8px;">'
                    html += 'You have <h2 style="color:#14b8a6;display:inline;">' + formatWhole(player.points) + '</h2> bits<br>'
                    html += '(+' + format(FORMS.bits.gain(), 2) + '/s)'
                    if (player.reboot.reboot_upgs[1]) {
                        html += '<div style="color:#14b8a6;font-size:11px;margin-top:2px;">'
                        html += 'Bits self-boost: x' + format(player.points.log10().add(1).mul(0.05).add(1))
                        if (player.reboot.points.gt(0)) html += ' | RP boost: x' + format(player.reboot.points.log10().add(1).mul(0.75).add(1))
                        html += '</div>'
                    }
                    if (player.reboot.reboot_upgs[2]) {
                        html += '<div style="color:#7aa2f7;font-size:10px;margin-top:2px;">'
                        html += 'Bit upgrade cost factor: x' + format(player.bits.compress.pow(-0.1)) + ' (upgrades 1-4)'
                        html += '</div>'
                    }
                    html += '<br><div class="section-header" style="color:#14b8a6;font-weight:bold;font-size:13px;border-bottom:1px solid #2a2e4a;padding-bottom:4px;margin-bottom:8px;">Core Upgrades</div>'
                    html += '<button class="btn" onmousedown="UPGS.bits.buyMax()" style="margin-bottom:10px;">Buy Max</button><br>'
                    html += '<div class="table_center" style="display:flex;flex-wrap:wrap;justify-content:center;gap:8px;">'
                    for (let x = 1; x <= UPGS.bits.cols; x++) {
                        let upg = UPGS.bits[x]
                        if (upg.unl && !upg.unl()) continue
                        let lvl = player.bits.bit_upgs[x] || new Decimal(0)
                        let cost = upg.cost()
                        let canBuy = UPGS.bits.can(x)
                        let effDisplay = upg.desc()
                        html += '<div style="min-width:240px;padding:8px;background:#181c30;border:1px solid #2a2e4a;border-radius:6px;">'
                        html += '<div style="text-align:left;font-size:12px;"><b>' + upg.title + '</b> <span style="color:#888;">(' + format(lvl, 0) + ')</span></div><br>'
                        html += '<button class="btn" style="width:100%;' + (canBuy?'background:#14b8a6;color:#111;':'opacity:0.5;') + '" onmousedown="UPGS.bits.buy(' + x + ')" ' + (!canBuy?'disabled':'') + '>'
                        html += effDisplay + '<br><span style="font-size:9px;color:' + (canBuy?'#000':'#888') + ';">Cost: ' + formatWhole(cost) + ' bits</span>'
                        html += '</button></div>'
                    }
                    html += '</div><br><div class="section-header" style="color:#14b8a6;font-weight:bold;font-size:13px;border-bottom:1px solid #2a2e4a;padding-bottom:4px;margin-bottom:8px;">Actions</div>'
                    html += '<div class="table_center" style="display:flex;flex-wrap:wrap;justify-content:center;gap:8px;">'
                    html += '<div style="min-width:240px;padding:8px;background:#181c30;border:1px solid #2a2e4a;border-radius:6px;">'
                    html += '<div style="text-align:left;font-size:12px;"><b style="color:#14b8a6;">' + format(player.bits.clusters, 0) + '</b> Bit Cluster</div><br>'
                    let canCluster = FORMS.bits.cluster.can()
                    html += '<button class="btn" style="width:100%;' + (canCluster?'background:#14b8a6;color:#111;':'opacity:0.5;') + '" onmousedown="FORMS.bits.cluster.reset()" ' + (!canCluster?'disabled':'') + '>'
                    html += 'Reset for <b>' + format(FORMS.bits.cluster.effect(), 2) + 'x</b> upgrade power.<br>'
                    html += '<span style="font-size:9px;">Require: ' + format(FORMS.bits.cluster.req()) + ' bits</span>'
                    html += '</button></div>'
                    if (player.bits.compress_unl) {
                        html += '<div style="min-width:240px;padding:8px;background:#181c30;border:1px solid #2a2e4a;border-radius:6px;">'
                        html += '<div style="text-align:left;font-size:12px;">Bit Compress <b style="color:#7aa2f7;">(x' + format(FORMS.bits.compress.effMult(), 2) + ')</b></div><br>'
                        let canCompress = FORMS.bits.compress.can()
                        html += '<button class="btn" style="width:100%;' + (canCompress?'background:#7aa2f7;color:#111;':'opacity:0.5;') + '" onmousedown="FORMS.bits.compress.doCompress()" ' + (!canCompress?'disabled':'') + '>'
                        html += 'Compress: x' + format(FORMS.bits.compress.effMult(), 2) + ' -> x' + format(FORMS.bits.compress.effMult(FORMS.bits.compress.calcMult()), 2)
                        html += '</button></div>'
                    }
                    if (player.bits.chip_unl) {
                        html += '<div style="min-width:240px;padding:8px;background:#181c30;border:1px solid #2a2e4a;border-radius:6px;">'
                        html += '<div style="text-align:left;font-size:12px;">Processing Chip <b style="color:#8B5CF6;">(x' + format(FORMS.bits.chip.effect()) + ')</b></div><br>'
                        let canChip = FORMS.bits.chip.can()
                        html += '<button class="btn" style="width:100%;' + (canChip?'background:#8B5CF6;color:#fff;':'opacity:0.5;') + '" onmousedown="FORMS.bits.chip.doChip()" ' + (!canChip?'disabled':'') + '>'
                        html += 'Process: x' + format(FORMS.bits.chip.effect()) + ' -> x' + format(FORMS.bits.chip.displaySet())
                        html += '</button></div>'
                    }
                    html += '</div></div>'
                    return html
                }],
            ],
        },
        "Modules": {
            content: [
                ["display-text", function() {
                    if (!player.bits.modules.unl) return '<div style="color:#666;padding:16px;">Need 2 Bit Clusters to unlock Reboot, then 4 clusters for Modules.</div>'
                    let pts = PERKS.points()
                    let spent = PERKS.spent()
                    let avail = pts.sub(spent)
                    let next = PERKS.nextMilestone()
                    let html = '<div style="padding:8px;">'
                    html += '<h3 style="color:#00c853;">Module Points: ' + format(avail, 0) + ' / ' + format(pts, 0) + '</h3>'
                    if (next.gt(0)) html += '<div style="font-size:10px;color:#888;">Next point at ' + format(next) + ' bits</div>'
                    html += '<button class="btn" onmousedown="PERKS.respec()" style="margin-bottom:10px;">Respec Modules (refunds all)</button>'
                    for (let t = 1; t <= 6; t++) {
                        html += '<div class="tier-row" style="margin-bottom:8px;">'
                        let tierNames = {1:"Tier 1 (1 MP)",2:"Tier 2 (1 MP)",3:"Tier 3 (2 MP)",4:"Tier 4 (3 MP)",5:"Tier 5 (4 MP)",6:"Tier 6 (4 MP)"}
                        html += '<div style="color:#888;font-size:10px;margin-bottom:4px;">' + tierNames[t] + '</div>'
                        html += '<div class="table_center" style="display:flex;flex-wrap:wrap;justify-content:center;gap:6px;">'
                        for (let id of PERKS.tierPerks(t)) {
                            let owned = PERKS.has(id)
                            let canBuy = PERKS.canBuy(id)
                            let node = PERKS.tree[id]
                            html += '<div style="min-width:150px;padding:8px;background:#181c30;border:1px solid ' + (owned?'#00c853;':canBuy?'#14b8a6;':'#2a2e4a;') + ';border-radius:6px;">'
                            html += '<div style="font-weight:bold;font-size:11px;color:' + (owned?'#00c853;':'#ccc;') + '">' + node.title + '</div>'
                            html += '<div style="font-size:9px;color:#888;min-height:24px;">' + node.desc + '</div>'
                            if (owned) html += '<div style="color:#00c853;font-weight:bold;font-size:10px;">OWNED</div>'
                            else if (canBuy) html += '<button class="btn" style="background:#00c853;color:#111;font-size:9px;" onmousedown="PERKS.buy(' + id + ')">Buy (' + node.cost + ' MP)</button>'
                            else html += '<div style="font-size:8px;color:#666;">' + PERKS.prereqText(id) + '</div>'
                            html += '</div>'
                        }
                        html += '</div></div>'
                    }
                    html += '</div>'
                    return html
                }],
            ],
            unlocked() { return player.bits.modules.unl || player.bits.clusters.gte(2) },
        },
        "Achievements": {
            content: [
                ["display-text", function() {
                    let html = '<div style="padding:8px;"><h3 style="color:#14b8a6;">Achievements</h3>'
                    for (let r = 1; r <= ACHS.rows; r++) {
                        html += '<div class="table_center" style="display:flex;flex-wrap:wrap;justify-content:center;gap:4px;margin-bottom:4px;">'
                        for (let c = 1; c <= ACHS.cols; c++) {
                            let id = r*10 + c
                            if (!ACHS.names[id]) { html += '<div style="width:90px;height:60px;"></div>'; continue }
                            let owned = ACHS.has(id)
                            html += '<div style="width:90px;height:60px;padding:4px;background:' + (owned?'#14b8a6':'#181c30') + ';border:1px solid #2a2e4a;border-radius:4px;font-size:8px;overflow:hidden;" title="' + ACHS.getText(id).replace(/"/g,"&quot;") + '">'
                            html += ACHS.names[id] + '</div>'
                        }
                        html += '</div>'
                    }
                    html += '</div>'
                    return html
                }],
            ],
        },
        "Autobuyers": {
            content: [
                ["display-text", function() {
                    let html = '<div style="padding:8px;"><h3 style="color:#14b8a6;">Autobuyers</h3>'
                    for (let x = 1; x <= AUTOS.length; x++) {
                        let a = AUTOS[x]
                        if (!a.unl()) continue
                        let enabled = player.bits.autobuyer[a.id]
                        let see = a.see()
                        html += '<div style="padding:8px;margin:4px 0;background:#181c30;border:1px solid #2a2e4a;border-radius:4px;">'
                        html += '<div style="font-size:11px;">' + a.dis + '</div>'
                        if (see) {
                            let checked = enabled ? 'checked' : ''
                            html += '<label style="font-size:10px;cursor:pointer;"><input type="checkbox" ' + checked + ' onchange="player.bits.autobuyer[\'' + a.id + '\']=this.checked"> Enabled</label>'
                        } else {
                            html += '<div style="font-size:9px;color:#666;">' + a.see_desc + '</div>'
                        }
                        html += '</div>'
                    }
                    html += '</div>'
                    return html
                }],
            ],
            unlocked() { return FORMS.inf.seen() || player.reboot.reboot_upgs[4] },
        },
        "Stats": {
            content: [
                ["display-text", function() {
                    let html = '<div style="padding:8px;"><h3 style="color:#14b8a6;">Statistics</h3>'
                    html += 'Best Bits: ' + format(player.bits.stats.best_bits) + '<br>'
                    html += 'Fastest Bit gain: +' + format(player.bits.stats.fast_rate) + '/s<br>'
                    html += 'Play time: ' + formatTime(player.bits.time) + '<br><br>'
                    if (player.infinity.unlocked) {
                        html += 'Infinitied: Yes<br>'
                        html += 'Fastest Infinity: ' + formatTime(player.infinity.best) + '<br>'
                        html += 'Current Infinity time: ' + formatTime(player.infinity.time) + '<br><br>'
                    }
                    html += '<div class="section-header" style="color:#ffaa2b;">Challenge Records</div>'
                    html += 'Normal total: ' + formatTime(CHALS.sumTotal().normal) + '<br>'
                    for (let x = 1; x <= CHALS.normal.length; x++) {
                        if (player.bits.stats.chals_best['normal'+x] !== undefined) {
                            html += 'Challenge ' + x + ': ' + formatTime(player.bits.stats.chals_best['normal'+x]) + '<br>'
                        }
                    }
                    html += '<br>Infinity total: ' + formatTime(CHALS.sumTotal().inf) + '<br>'
                    for (let x = 1; x <= CHALS.inf.length; x++) {
                        if (player.bits.stats.chals_best['inf'+x] !== undefined) {
                            html += 'Infinity Challenge ' + x + ': ' + formatTime(player.bits.stats.chals_best['inf'+x]) + '<br>'
                        }
                    }
                    html += '</div>'
                    return html
                }],
            ],
        },
    },
})
